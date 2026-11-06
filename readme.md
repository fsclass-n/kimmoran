# 김모란 | Portfolio Website

전자공학 전공 기반 Full Stack & AI Developer 김모란의 개인 포트폴리오입니다.
채용 담당자가 30초 안에 핵심 역량·성과·연락처를 파악할 수 있도록 설계한 다크 테마 원페이지 사이트입니다.

## Design

- 다크 테마: 차콜/블랙 배경(`#07090D`) + 네온 민트(`#2EF2C4`) · 일렉트릭 블루(`#3D8BFF`) 포인트
- 타이포그래피: Pretendard(본문), Space Grotesk(숫자·제목), JetBrains Mono(코드·라벨)
- 카드 레이아웃, 마우스 추적 스포트라이트 호버, 스크롤 리빌·카운트업 애니메이션
- 반응형 브레이크포인트: 1100px / 860px / 640px, `prefers-reduced-motion` 대응

## Structure

- **Hero**: 강렬한 타이틀, 타이핑 효과, 핵심 역량 3가지(풀스택 · Data & AI · 문제 해결)와 대표 지표
- **About**: 핵심 지표 스트립, 프로필, 학력(한국 모란 대학교 전자공학과 · GPA · 주요 이수 과목), 교육 타임라인
- **Skills**: 6개 카테고리, 숙련도 3단계(Main / Used / Learning) 색상 구분
- **Projects**: 모든 프로젝트를 `Problem → Solution → Result(정량 지표)` 구조로 정리
- **Contact**: 전화·이메일(복사 버튼)·GitHub 카드, 지원자 요약 정보, Web3Forms 문의 폼
- **Quick Dock**: 데스크톱 우측 고정 / 모바일 하단 바 — 어느 위치에서든 1클릭으로 전화·메일·스택·프로젝트 이동

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript (빌드 과정 없음)
- Netlify

## Verification

```bash
python -m http.server 8000
```

브라우저에서 `http://localhost:8000` 접속 후 내비게이션, 퀵 독, 이메일 복사, 프로젝트 링크, 반응형 레이아웃을 확인합니다.

## Contact form

`index.html`의 기존 Web3Forms access key와 `https://api.web3forms.com/submit` 엔드포인트를 사용합니다.
메일 수신처는 Web3Forms에서 해당 키에 연결된 주소를 따르므로, 사이트에 표시되는 이메일을 바꿔도 수신처는 변경되지 않습니다.

- 필수 입력값 검증, 중복 제출 방지, 전송 중·성공·실패 상태 제공
- 입력한 제목을 메일 제목에 반영하고, 발신자 이메일을 Reply-To로 설정
- JavaScript가 꺼져 있어도 기본 POST 폼으로 전송 가능

## Content notes

- 학력(한국 모란 대학교 전자공학과, 2020.03–2024.02, GPA 3.92/4.5, 전공 4.05), 졸업 프로젝트 및 수상은 요청에 따라 임의 설정한 값입니다.
- 프로젝트의 정량 성과(비교 시간 95% 단축, 일 1,200건 수집, 배포 시간 73% 단축 등)는 예시 수치입니다. 실제 측정값으로 교체해 사용하세요.
- 연락처(`010-1234-5678`, `moran@gmail.com`)는 예시 값입니다.
- 사이트 주소는 `https://kimmoran.netlify.app/`을 기준으로 canonical·OG·sitemap을 작성했습니다. 배포 주소가 다르면 함께 수정하세요.
- 프로젝트 기능·기술 설명은 각 서비스와 공개 소개 페이지(`fsclass-n.github.io/*`)를 기준으로 작성했습니다.
