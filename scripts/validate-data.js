#!/usr/bin/env node

/**
 * 데이터 검증 스크립트
 * JSON 스키마 검증, 중복 체크, 통계 리포트 생성
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * JSON 스키마 검증
 */
function validateSchema(data) {
  const errors = [];
  
  // 메타데이터 검증
  if (!data.metadata) {
    errors.push('메타데이터 누락');
  } else {
    if (!data.metadata.year || data.metadata.year < 2020 || data.metadata.year > 2026) {
      errors.push('유효하지 않은 연도');
    }
    if (!data.metadata.exam || ![1, 2].includes(data.metadata.exam)) {
      errors.push('유효하지 않은 회차');
    }
    if (!data.metadata.subject) {
      errors.push('과목 정보 누락');
    }
  }
  
  // 문제 배열 검증
  if (!Array.isArray(data.questions)) {
    errors.push('questions가 배열이 아님');
    return { valid: false, errors };
  }
  
  // 각 문제 검증
  data.questions.forEach((q, idx) => {
    if (!q.number) {
      errors.push(`문제 ${idx + 1}: 번호 누락`);
    }
    if (!q.question || q.question.length < 5) {
      errors.push(`문제 ${q.number || idx + 1}: 본문 누락 또는 너무 짧음`);
    }
    if (!Array.isArray(q.choices) || q.choices.length === 0) {
      errors.push(`문제 ${q.number || idx + 1}: 선택지 누락`);
    }
    if (!q.answer) {
      errors.push(`문제 ${q.number || idx + 1}: 정답 누락`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 문제 해시 생성 (중복 체크용)
 */
function getQuestionHash(question) {
  const content = `${question.question}${question.choices.join('')}${question.answer}`;
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * 중복 문제 체크
 */
function findDuplicates(allQuestions) {
  const hashMap = new Map();
  const duplicates = [];
  
  allQuestions.forEach(item => {
    const hash = getQuestionHash(item.question);
    
    if (hashMap.has(hash)) {
      duplicates.push({
        hash,
        original: hashMap.get(hash),
        duplicate: item
      });
    } else {
      hashMap.set(hash, item);
    }
  });
  
  return duplicates;
}

/**
 * 누락 데이터 감지
 */
function findMissingData(data) {
  const missing = [];
  
  data.questions.forEach(q => {
    const issues = [];
    
    if (!q.question || q.question.trim().length === 0) {
      issues.push('본문 누락');
    }
    
    if (!q.choices || q.choices.length < 4) {
      issues.push('선택지 부족 (최소 4개 필요)');
    }
    
    if (!q.answer) {
      issues.push('정답 누락');
    }
    
    if (q.choices && q.answer) {
      // 정답이 선택지에 있는지 확인
      const answerExists = q.choices.some(choice => 
        choice.includes(q.answer) || choice.startsWith(q.answer)
      );
      
      if (!answerExists) {
        issues.push('정답이 선택지에 없음');
      }
    }
    
    if (issues.length > 0) {
      missing.push({
        file: data.metadata?.filename || 'unknown',
        questionNumber: q.number,
        issues
      });
    }
  });
  
  return missing;
}

/**
 * 통계 생성
 */
function generateStatistics(allData) {
  const stats = {
    totalFiles: allData.length,
    totalQuestions: 0,
    byYear: {},
    byExam: {},
    bySubject: {},
    questionNumbers: {
      min: Infinity,
      max: -Infinity,
      avg: 0
    }
  };
  
  let questionSum = 0;
  
  allData.forEach(data => {
    const year = data.metadata?.year || 'unknown';
    const exam = data.metadata?.exam || 'unknown';
    const subject = data.metadata?.subject || 'unknown';
    const count = data.questions?.length || 0;
    
    stats.totalQuestions += count;
    questionSum += count;
    
    // 연도별
    if (!stats.byYear[year]) {
      stats.byYear[year] = { files: 0, questions: 0 };
    }
    stats.byYear[year].files++;
    stats.byYear[year].questions += count;
    
    // 회차별
    if (!stats.byExam[exam]) {
      stats.byExam[exam] = { files: 0, questions: 0 };
    }
    stats.byExam[exam].files++;
    stats.byExam[exam].questions += count;
    
    // 과목별
    if (!stats.bySubject[subject]) {
      stats.bySubject[subject] = { files: 0, questions: 0 };
    }
    stats.bySubject[subject].files++;
    stats.bySubject[subject].questions += count;
    
    // 문제 번호 범위
    if (data.questions) {
      data.questions.forEach(q => {
        if (q.number < stats.questionNumbers.min) {
          stats.questionNumbers.min = q.number;
        }
        if (q.number > stats.questionNumbers.max) {
          stats.questionNumbers.max = q.number;
        }
      });
    }
  });
  
  stats.questionNumbers.avg = stats.totalFiles > 0 
    ? Math.round(questionSum / stats.totalFiles) 
    : 0;
  
  return stats;
}

/**
 * 리포트 생성
 */
function generateReport(allData, validation, duplicates, missing, stats) {
  const lines = [];
  
  lines.push('='.repeat(60));
  lines.push('📊 검정고시 문제 데이터 검증 리포트');
  lines.push('='.repeat(60));
  lines.push('');
  
  // 기본 통계
  lines.push('## 📈 기본 통계');
  lines.push(`총 파일 수: ${stats.totalFiles}개`);
  lines.push(`총 문제 수: ${stats.totalQuestions}개`);
  lines.push(`파일당 평균 문제 수: ${stats.questionNumbers.avg}개`);
  lines.push('');
  
  // 연도별
  lines.push('### 연도별 분포');
  Object.entries(stats.byYear).sort().forEach(([year, data]) => {
    lines.push(`  ${year}년: ${data.files}개 파일, ${data.questions}개 문제`);
  });
  lines.push('');
  
  // 과목별
  lines.push('### 과목별 분포');
  Object.entries(stats.bySubject).sort().forEach(([subject, data]) => {
    lines.push(`  ${subject}: ${data.files}개 파일, ${data.questions}개 문제`);
  });
  lines.push('');
  
  // 검증 결과
  lines.push('## ✅ 스키마 검증 결과');
  const validFiles = validation.filter(v => v.valid).length;
  const invalidFiles = validation.filter(v => !v.valid).length;
  lines.push(`유효한 파일: ${validFiles}개`);
  lines.push(`유효하지 않은 파일: ${invalidFiles}개`);
  
  if (invalidFiles > 0) {
    lines.push('');
    lines.push('### 유효하지 않은 파일 상세:');
    validation.filter(v => !v.valid).forEach(v => {
      lines.push(`  📄 ${v.file}:`);
      v.errors.forEach(err => lines.push(`     - ${err}`));
    });
  }
  lines.push('');
  
  // 중복 검사
  lines.push('## 🔍 중복 문제 검사');
  lines.push(`중복 문제: ${duplicates.length}개`);
  
  if (duplicates.length > 0) {
    lines.push('');
    lines.push('### 중복 문제 목록:');
    duplicates.slice(0, 10).forEach(dup => {
      lines.push(`  원본: ${dup.original.file} - 문제 ${dup.original.question.number}`);
      lines.push(`  중복: ${dup.duplicate.file} - 문제 ${dup.duplicate.question.number}`);
      lines.push('');
    });
    if (duplicates.length > 10) {
      lines.push(`  ... 외 ${duplicates.length - 10}개 더`);
    }
  }
  lines.push('');
  
  // 누락 데이터
  lines.push('## ⚠️  누락 데이터');
  lines.push(`누락 발견: ${missing.length}개`);
  
  if (missing.length > 0) {
    lines.push('');
    lines.push('### 누락 데이터 목록:');
    missing.slice(0, 20).forEach(m => {
      lines.push(`  📄 ${m.file} - 문제 ${m.questionNumber}:`);
      m.issues.forEach(issue => lines.push(`     - ${issue}`));
    });
    if (missing.length > 20) {
      lines.push(`  ... 외 ${missing.length - 20}개 더`);
    }
  }
  lines.push('');
  
  lines.push('='.repeat(60));
  lines.push(`생성 시간: ${new Date().toLocaleString('ko-KR')}`);
  lines.push('='.repeat(60));
  
  return lines.join('\n');
}

/**
 * 메인 실행 함수
 */
async function main() {
  console.log('🔍 데이터 검증 시작\n');
  
  const dataDir = path.join(__dirname, '../data/questions');
  
  // JSON 파일 읽기
  if (!fs.existsSync(dataDir)) {
    console.log('❌ questions 디렉토리가 없습니다.');
    return;
  }
  
  const jsonFiles = fs.readdirSync(dataDir)
    .filter(file => file.endsWith('.json'));
  
  if (jsonFiles.length === 0) {
    console.log('❌ JSON 파일이 없습니다.');
    return;
  }
  
  console.log(`📚 ${jsonFiles.length}개의 JSON 파일 검증 중...\n`);
  
  // 모든 데이터 로드
  const allData = [];
  const validation = [];
  
  jsonFiles.forEach(filename => {
    const filepath = path.join(dataDir, filename);
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    
    allData.push(data);
    
    // 스키마 검증
    const result = validateSchema(data);
    validation.push({
      file: filename,
      valid: result.valid,
      errors: result.errors
    });
  });
  
  // 중복 체크
  console.log('🔍 중복 문제 검사 중...');
  const allQuestions = [];
  allData.forEach(data => {
    data.questions?.forEach(q => {
      allQuestions.push({
        file: data.metadata?.filename || 'unknown',
        question: q
      });
    });
  });
  const duplicates = findDuplicates(allQuestions);
  
  // 누락 데이터 체크
  console.log('🔍 누락 데이터 검사 중...');
  const missing = [];
  allData.forEach(data => {
    const m = findMissingData(data);
    missing.push(...m);
  });
  
  // 통계 생성
  console.log('📊 통계 생성 중...');
  const stats = generateStatistics(allData);
  
  // 리포트 생성
  const report = generateReport(allData, validation, duplicates, missing, stats);
  
  // 콘솔 출력
  console.log('\n' + report);
  
  // 리포트 저장
  const reportPath = path.join(__dirname, '../data/validation-report.txt');
  fs.writeFileSync(reportPath, report);
  
  // JSON 결과 저장
  const jsonReportPath = path.join(__dirname, '../data/validation-report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    stats,
    validation,
    duplicates: duplicates.slice(0, 100), // 최대 100개만
    missing: missing.slice(0, 100)
  }, null, 2));
  
  console.log(`\n💾 리포트 저장: ${reportPath}`);
  console.log(`💾 JSON 리포트: ${jsonReportPath}\n`);
  
  // 종료 코드
  const hasErrors = validation.some(v => !v.valid) || missing.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

// 스크립트 실행
if (require.main === module) {
  main().catch(error => {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  });
}

module.exports = { validateSchema, findDuplicates, findMissingData, generateStatistics };
