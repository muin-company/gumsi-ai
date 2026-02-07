#!/bin/bash

# 검시AI Vercel 배포 자동화 스크립트
# Usage: ./deploy.sh [production|preview]

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# 배너
echo ""
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   검시AI Vercel 배포 자동화 스크립트   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# 배포 타입 확인
DEPLOY_TYPE=${1:-preview}
if [[ "$DEPLOY_TYPE" != "production" && "$DEPLOY_TYPE" != "preview" ]]; then
    log_error "Invalid deploy type: $DEPLOY_TYPE"
    echo "Usage: ./deploy.sh [production|preview]"
    exit 1
fi

log_info "배포 타입: ${DEPLOY_TYPE}"
echo ""

# 1. Git 상태 확인
log_info "[1/7] Git 상태 확인..."
if [[ -n $(git status -s) ]]; then
    log_warning "변경사항이 커밋되지 않았습니다."
    git status -s
    echo ""
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "배포 취소됨"
        exit 1
    fi
else
    log_success "Git 상태 깨끗함"
fi
echo ""

# 2. Node.js 버전 확인
log_info "[2/7] Node.js 버전 확인..."
NODE_VERSION=$(node -v)
log_success "Node.js 버전: $NODE_VERSION"
echo ""

# 3. 의존성 설치 확인
log_info "[3/7] 의존성 확인..."
if [[ ! -d "node_modules" ]]; then
    log_warning "node_modules가 없습니다. 의존성 설치 중..."
    npm install
else
    log_success "의존성 설치됨"
fi
echo ""

# 4. 환경변수 확인
log_info "[4/7] 환경변수 확인..."
if [[ ! -f ".env.local" ]]; then
    log_warning ".env.local 파일이 없습니다."
    log_info "베타 버전은 환경변수 없이 동작 가능 (localStorage 사용)"
else
    log_success ".env.local 파일 존재"
    # 필수 환경변수 체크 (선택사항)
    # if [[ -z "$NEXT_PUBLIC_SUPABASE_URL" ]]; then
    #     log_error "NEXT_PUBLIC_SUPABASE_URL이 설정되지 않았습니다"
    #     exit 1
    # fi
fi
echo ""

# 5. 로컬 빌드 테스트
log_info "[5/7] 로컬 빌드 테스트 중..."
if npm run build; then
    log_success "빌드 성공!"
else
    log_error "빌드 실패. 에러를 확인하고 수정해주세요."
    exit 1
fi
echo ""

# 6. Vercel CLI 확인 및 설치
log_info "[6/7] Vercel CLI 확인..."
if ! command -v vercel &> /dev/null; then
    log_warning "Vercel CLI가 설치되지 않았습니다."
    read -p "Vercel CLI를 설치하시겠습니까? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install -g vercel
        log_success "Vercel CLI 설치 완료"
    else
        log_error "Vercel CLI가 필요합니다. 배포 취소됨."
        echo "설치 명령어: npm install -g vercel"
        exit 1
    fi
else
    VERCEL_VERSION=$(vercel --version)
    log_success "Vercel CLI 버전: $VERCEL_VERSION"
fi
echo ""

# 7. Vercel 배포
log_info "[7/7] Vercel 배포 시작..."
echo ""

if [[ "$DEPLOY_TYPE" == "production" ]]; then
    log_warning "⚠️  프로덕션 배포를 시작합니다!"
    read -p "계속하시겠습니까? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "배포 취소됨"
        exit 1
    fi
    
    log_info "프로덕션 배포 중..."
    vercel --prod
else
    log_info "Preview 배포 중..."
    vercel
fi

echo ""
log_success "🎉 배포 완료!"
echo ""

# 배포 후 안내
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}다음 단계:${NC}"
echo ""
echo "1. 배포 URL 확인 및 테스트"
echo "2. 메타태그 확인 (Open Graph, Twitter Card)"
echo "3. 모바일 반응형 테스트"
echo "4. 페이지 로딩 속도 확인"
echo "5. Vercel Analytics 활성화 (선택)"
echo ""
echo -e "${BLUE}유용한 링크:${NC}"
echo "• Vercel 대시보드: https://vercel.com/dashboard"
echo "• Meta 디버거: https://developers.facebook.com/tools/debug/"
echo "• DNS 체커: https://dnschecker.org"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
