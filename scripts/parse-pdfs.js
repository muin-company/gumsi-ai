#!/usr/bin/env node

/**
 * PDF 파싱 스크립트
 * PDF → JSON 변환 (문제, 선택지, 정답 추출)
 */

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const cliProgress = require('cli-progress');

// 문제 패턴 정규식
const QUESTION_PATTERNS = {
  // 문제 번호: "1.", "1)", "[1]" 등
  questionNumber: /^(\d+)[\.\)]/,
  
  // 선택지: "①", "1)", "가.", "A." 등
  choice: /^[①②③④⑤]|^[1-5]\)|^[가-마]\.|^[A-E]\./,
  
  // 정답 표시
  answer: /정답[\s:：]+([①-⑤1-5가-마A-E])/i
};

/**
 * PDF 텍스트 파싱
 */
async function parsePdf(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    
    return {
      text: data.text,
      pages: data.numpages,
      info: data.info
    };
  } catch (error) {
    throw new Error(`PDF 읽기 실패: ${error.message}`);
  }
}

/**
 * 텍스트에서 문제 추출
 */
function extractQuestions(text, metadata) {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const questions = [];
  let currentQuestion = null;
  let currentChoices = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 문제 번호 감지
    const questionMatch = line.match(QUESTION_PATTERNS.questionNumber);
    if (questionMatch) {
      // 이전 문제 저장
      if (currentQuestion) {
        currentQuestion.choices = currentChoices;
        questions.push(currentQuestion);
      }
      
      // 새 문제 시작
      const questionNumber = parseInt(questionMatch[1]);
      currentQuestion = {
        number: questionNumber,
        question: line.replace(QUESTION_PATTERNS.questionNumber, '').trim(),
        choices: [],
        answer: null,
        metadata
      };
      currentChoices = [];
      continue;
    }
    
    // 선택지 감지
    if (currentQuestion && QUESTION_PATTERNS.choice.test(line)) {
      currentChoices.push(line);
      continue;
    }
    
    // 정답 감지
    const answerMatch = line.match(QUESTION_PATTERNS.answer);
    if (answerMatch && currentQuestion) {
      currentQuestion.answer = answerMatch[1];
      continue;
    }
    
    // 문제 본문 이어붙이기
    if (currentQuestion && !currentQuestion.answer) {
      currentQuestion.question += ' ' + line;
    }
  }
  
  // 마지막 문제 저장
  if (currentQuestion) {
    currentQuestion.choices = currentChoices;
    questions.push(currentQuestion);
  }
  
  return questions;
}

/**
 * 파일명에서 메타데이터 추출
 */
function extractMetadata(filename) {
  // 파일명 형식: 2024-1-math.pdf
  const match = filename.match(/(\d{4})-(\d)-([a-z]+)\.pdf/);
  
  if (!match) {
    return {
      year: null,
      exam: null,
      subject: null
    };
  }
  
  return {
    year: parseInt(match[1]),
    exam: parseInt(match[2]),
    subject: match[3],
    filename
  };
}

/**
 * JSON 스키마 검증
 */
function validateQuestion(question) {
  const errors = [];
  
  if (!question.number || typeof question.number !== 'number') {
    errors.push('문제 번호 누락');
  }
  
  if (!question.question || question.question.length < 10) {
    errors.push('문제 본문 누락 또는 너무 짧음');
  }
  
  if (!Array.isArray(question.choices) || question.choices.length === 0) {
    errors.push('선택지 누락');
  }
  
  if (!question.answer) {
    errors.push('정답 누락');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('📄 PDF 파싱 시작\n');
  
  const pdfDir = path.join(__dirname, '../data/pdfs');
  const outputDir = path.join(__dirname, '../data/questions');
  
  // 출력 디렉토리 생성
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // PDF 파일 목록
  const pdfFiles = fs.readdirSync(pdfDir)
    .filter(file => file.endsWith('.pdf'));
  
  if (pdfFiles.length === 0) {
    console.log('❌ PDF 파일이 없습니다.');
    return;
  }
  
  console.log(`📚 총 ${pdfFiles.length}개의 PDF 파일 발견\n`);
  
  // 프로그레스 바
  const progressBar = new cliProgress.SingleBar({
    format: '파싱 진행 |{bar}| {percentage}% | {value}/{total} 파일 | {filename}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true
  });
  
  progressBar.start(pdfFiles.length, 0, { filename: 'N/A' });
  
  // 통계
  const stats = {
    totalFiles: pdfFiles.length,
    success: 0,
    failed: 0,
    totalQuestions: 0,
    validQuestions: 0,
    errors: []
  };
  
  // 각 PDF 파싱
  for (let i = 0; i < pdfFiles.length; i++) {
    const filename = pdfFiles[i];
    const pdfPath = path.join(pdfDir, filename);
    
    progressBar.update(i + 1, { filename });
    
    try {
      // 메타데이터 추출
      const metadata = extractMetadata(filename);
      
      // PDF 읽기
      const pdfData = await parsePdf(pdfPath);
      
      // 문제 추출
      const questions = extractQuestions(pdfData.text, metadata);
      
      // 검증
      const validQuestions = [];
      for (const q of questions) {
        const validation = validateQuestion(q);
        if (validation.valid) {
          validQuestions.push(q);
        } else {
          stats.errors.push({
            file: filename,
            question: q.number,
            errors: validation.errors
          });
        }
      }
      
      // JSON 저장
      const outputFilename = filename.replace('.pdf', '.json');
      const outputPath = path.join(outputDir, outputFilename);
      
      fs.writeFileSync(outputPath, JSON.stringify({
        metadata,
        pdfInfo: {
          pages: pdfData.pages,
          title: pdfData.info?.Title
        },
        questions: validQuestions,
        stats: {
          total: questions.length,
          valid: validQuestions.length,
          invalid: questions.length - validQuestions.length
        }
      }, null, 2));
      
      stats.success++;
      stats.totalQuestions += questions.length;
      stats.validQuestions += validQuestions.length;
      
    } catch (error) {
      stats.failed++;
      stats.errors.push({
        file: filename,
        error: error.message
      });
    }
  }
  
  progressBar.stop();
  
  // 결과 출력
  console.log('\n\n📊 파싱 완료!\n');
  console.log(`✅ 성공: ${stats.success}개 파일`);
  console.log(`❌ 실패: ${stats.failed}개 파일`);
  console.log(`📝 총 문제: ${stats.totalQuestions}개`);
  console.log(`✔️  유효 문제: ${stats.validQuestions}개`);
  console.log(`⚠️  무효 문제: ${stats.totalQuestions - stats.validQuestions}개\n`);
  
  if (stats.errors.length > 0) {
    console.log(`⚠️  ${stats.errors.length}개의 에러 발생 (상세 내용은 로그 파일 참조)\n`);
  }
  
  // 에러 로그 저장
  const errorLogPath = path.join(__dirname, '../data/parse-errors.json');
  fs.writeFileSync(errorLogPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    errors: stats.errors
  }, null, 2));
  
  console.log(`💾 에러 로그: ${errorLogPath}`);
  console.log(`💾 결과 저장: ${outputDir}/\n`);
}

// 스크립트 실행
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = { parsePdf, extractQuestions, validateQuestion };
