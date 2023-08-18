## Hardhat 프로젝트 사용법

### 컨트랙트 폴더 진입
`` cd package ``

### 패키지 설치
`` npm i ``

### 컨트랙트 배포 전, 테스트
`` npm run test ``

### Hardhat(local) 네트워크에 컨트랙트 배포
`` npm run deploy-hardhat ``

### Goerli 네트워크에 컨트랙트 배포
`` npm run deploy-goerli ``

### Hardhat 네트워크 로컬 실행
`` npm run script ``

* Hardhat 프로젝트 주의사항
  - .env 파일을 생성해서 본인이 사용할 메타마스크 프라이빗 키를 PRIVATE_KEY라는 이름의 환경변수로 저장해야 합니다.



## 프론트엔드 프로젝트 사용법

### 프론트엔드 폴더 진입
`` cd app ``

### 패키지 설치
`` npm i ``

### 민팅 및 소각에 사용할 컨트랙트 주소 설정
`` app/const.ts 파일 ``

`` export const hardhatContractAddress = Hardhat 프로젝트에서 Hardhat 네트워크에 배포하고 돌려받은 컨트랙트 주소; ``

`` export const goerliContractAddress =Hardhat 프로젝트에서 Goerli 네트워크에 배포하고 돌려받은 컨트랙트 주소; ``

* const에 적힌 주소를 그대로 사용하시면 제가 배포한 컨트랙트에 적용됩니다.

### 프론트엔드 앱 실행
`` npm run dev ``
