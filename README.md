### 프로젝트 파일 구조

project-root/
├── data/
│   ├── products.json        # 제품 데이터 파일
│   ├── posts.json           # 게시글 데이터 파일
│   ├── users.json           # 유저 데이터 파일
│   └── reviews.json         # 리뷰 데이터 파일
│
├── routes/
│   ├── products.js          # 제품 관련 라우터
│   ├── posts.js             # 게시글 관련 라우터
│   ├── users.js             # 유저 관련 라우터
│   ├── cart.js              # 장바구니 관련 라우터
│   ├── payment.js           # 결제 관련 라우터
│   ├── order.js             # 주문 관련 라우터
│   ├── auth.js              # 인증 관련 라우터
│   └── reviews.js           # 리뷰 관련 라우터
│
├── views/
│   ├── cart.html            # 장바구니 페이지
│   ├── login.html           # 로그인 페이지
│   ├── orderList.html       # 주문 목록 페이지
│   ├── payment.html         # 결제 페이지
│   ├── productDetail.html   # 제품 상세 페이지
│   ├── productList.html     # 제품 목록 페이지
│   ├── register.html        # 회원가입 페이지
│   └── reviews.html         # 리뷰 페이지
│
├── .gitignore               # Git 무시 파일
├── package.json             # npm 패키지 정보
├── test.http                # REST API 테스트 파일
└── web.js                   # 메인 서버 파일

### 각 파일의 역할

## data/
products.json: 제품 데이터를 저장하는 파일.
posts.json: 게시글 데이터를 저장하는 파일.
users.json: 유저 데이터를 저장하는 파일.
reviews.json: 리뷰 데이터를 저장하는 파일.

## routes/
products.js: 제품 관련 API 라우터.
posts.js: 게시글 관련 API 라우터.
users.js: 유저 관련 API 라우터.
cart.js: 장바구니 관련 API 라우터.
payment.js: 결제 관련 API 라우터.
order.js: 주문 관련 API 라우터.
auth.js: 로그인, 로그아웃 등 인증 관련 API 라우터.
reviews.js: 리뷰 관련 API 라우터.

## views/
cart.html: 장바구니 페이지.
login.html: 로그인 페이지.
orderList.html: 주문 목록 페이지.
payment.html: 결제 페이지.
productDetail.html: 제품 상세 페이지.
productList.html: 제품 목록 페이지.
register.html: 회원가입 페이지.
reviews.html: 리뷰 페이지.

## 기타 파일
.gitignore: Git에서 무시할 파일을 정의하는 파일.
package.json: 프로젝트의 npm 패키지 정보를 포함하는 파일.
test.http: REST API를 테스트하기 위한 파일.
web.js: 메인 서버 파일로, Express 애플리케이션을 설정하고 라우터를 연결합니다.
