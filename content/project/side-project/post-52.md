---
title: "[Project] 로컬호스트를 넘어: Discord Activity 배포 여정기 (Vercel & Render)"
date: "2026-02-16"
description: "로컬 환경에서 개발한 디스코드 액티비티를 Vercel(Frontend)과 Render(Backend)를 통해 실제 서비스로 배포하며 겪은 CORS, Mixed Content, OAuth2 문제 해결 과정."
tags: ["Vercel", "Render", "CI/CD", "CORS", "OAuth2"]
---

### 1. Intro: 로컬 개발의 달콤한 함정

처음엔 모든 게 순조로웠음.
*   **Frontend**: Vite + React
*   **Backend**: Express + Socket.io
*   **Tunneling**: `localtunnel` / `cloudflared`

터미널 3개를 띄워놓고 내 화면에 뜬 게임을 보며 환호했으나, 친구들을 초대하려는 순간 현실의 벽에 부딪힘. 매번 바뀌는 터미널 URL을 친구들에게 공유하는 것은 지속 가능한 방법이 아니었음.
결국 **"링크 하나만 누르면 되게 하자"**는 목표로 배포를 결심함.

### 2. Strategy: 무료 클라우드 조합 (Vercel + Render)

서버 비용 0원으로 영구적인 서비스를 만들기 위해 최강의 무료 조합을 선택함.

| 역할 | 서비스 | 선정 이유 |
| :--- | :--- | :--- |
| **Frontend** | **Vercel** | React 배포의 최강자. GitHub 연동 시 자동 배포(CI/CD) 지원. |
| **Backend** | **Render** | Node.js + Socket.io 서버를 무료로 호스팅할 수 있는 몇 안 되는 대안. |

### 3. Troubleshooting: 배포는 실전이다

로컬에서는 겪지 못했던 다양한 네트워크 및 보안 이슈들이 터져 나옴.

#### [Issue 1] CORS (Cross-Origin Resource Sharing)
프론트(Vercel)와 백엔드(Render)의 도메인이 다르다 보니 브라우저가 통신을 차단함.
*   **Solution**: 서버 코드에 `cors` 미들웨어를 추가하여 모든 출처(`*`)를 허용하고, `app.options`로 프리플라이트(Pre-flight) 요청까지 명시적으로 처리함.

#### [Issue 2] Mixed Content (보안 접속)
Vercel은 기본적으로 HTTPS인데, Render 무료 플랜 주소를 HTTP로 호출하면 차단됨.
*   **Solution**: 환경 변수(`VITE_API_URL`)에 `https://`를 강제하고, 클라이언트 코드 내에서도 프로토콜을 자동으로 업그레이드하는 로직을 추가함.

#### [Issue 3] Render의 절전 모드 (Cold Start)
무료 서버인 Render는 15분간 트래픽이 없으면 절전 모드(Spin Down)로 들어감. 다시 깨우는 데 1분 가까이 소요됨.
*   **Solution**: 앱 실행 시 비동기로 서버에 핑(Ping)을 보내 깨우고, 화면에는 **"Waking up server..."** 라는 로딩 메시지를 띄워 사용자 경험(UX)을 개선함.

#### [Issue 4] OAuth2 & Redirect URI
로컬의 `localhost:3000` 인증 주소가 배포 후에는 Vercel 도메인으로 변경되어야 함.
*   **Solution**: 디스코드 개발자 포털과 Render 환경 변수(`DISCORD_REDIRECT_URI`)에 배포된 Vercel 주소를 정확히 등록하여 해결함.

### 4. Conclusion (회고)

이제 더 이상 터미널을 켤 필요 없이, 링크 하나로 친구들과 게임을 즐길 수 있게 됨.
이번 배포 과정을 통해 **환경 변수(Environment Variable)** 관리의 중요성과, 로컬과 프로덕션 환경의 차이에서 오는 **네트워크 보안 이슈(CORS, HTTPS)**를 깊이 있게 이해하게 됨. 배포는 개발의 끝이 아니라, 실제 서비스 운영을 위한 새로운 시작임을 깨달음.
