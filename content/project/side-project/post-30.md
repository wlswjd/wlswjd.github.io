---
title: "[Project] Discord Activity: Liar Game (라이어 게임)"
date: "2026-02-15"
description: "디스코드 음성 채널에서 설치 없이 바로 즐기는 실시간 웹 소켓 기반 라이어 게임 개발기. Discord Embedded App SDK 활용."
tags: ["React", "TypeScript", "Node.js", "Socket.io", "Discord SDK"]
---

### 1. Overview (프로젝트 개요)

스타크래프트 유즈맵 '라이어 게임'과 오프라인 보드게임에서 영감을 받아 제작한 프로젝트임.
기존에는 디스코드 봇을 이용하거나 별도의 웹사이트에 접속해야 했지만, **Discord Embedded App SDK**를 활용하여 디스코드 창을 벗어나지 않고 음성 채널 내에서 바로 게임을 즐길 수 있도록 구현함.

![Game Screenshot](/images/game_screenshot.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. 게임 플레이 화면 (원탁형 UI 및 실시간 상태 동기화)</em></p>

### 2. Key Features (주요 특징)

*   **No Installation**: 디스코드 액티비티 기능을 통해 클릭 한 번으로 실행 (별도 설치 불필요).
*   **Real-time Sync**: Socket.io를 이용해 턴, 투표, 타이머, 채팅을 모든 유저에게 실시간 동기화.
*   **Intuitive UI**: 원탁형 좌석 배치와 현재 턴/상태에 따른 즉각적인 시각적 피드백 제공.
*   **Deployment**: Vercel(Frontend)과 Render(Backend)를 통한 24시간 무중단 서비스 구축.

### 3. Game Rules (게임 규칙)

1.  **시작**: 최소 2명 이상. 랜덤한 '주제'와 '제시어'가 선정됨. (라이어는 제시어 모름)
2.  **설명**: 순서대로 돌아가며 제시어를 설명함. 시민은 라이어가 눈치채지 못하게, 라이어는 들키지 않게 연기해야 함.
3.  **투표**: 1차 투표로 최다 득표자를 선정하고, 최후 변론 후 찬반 투표(Kill/Save)를 진행함.
4.  **역전승**: 라이어가 처형당하더라도 마지막 15초 안에 제시어를 맞히면 역전승함.

### 4. Tech Stack & Architecture

#### [Frontend]
*   **React + TypeScript + Vite**: 빠른 개발 속도와 타입 안정성 확보.
*   **Discord Embedded App SDK**: 디스코드 클라이언트와의 통신 및 사용자 인증 처리.
*   **Socket.io-client**: 서버로부터 게임 상태 이벤트를 수신하여 UI 업데이트.

#### [Backend]
*   **Node.js + Express**: 가벼운 이벤트 기반 서버 구축.
*   **Socket.io**: 룸(Room) 기반의 실시간 양방향 통신 구현.
*   **State Machine**: 대기(Waiting) -> 게임중(Playing) -> 투표(Voting) -> 결과(Result)로 이어지는 복잡한 상태 관리 로직 구현.

### 5. Implementation Details (개발 과정)

#### [A] Client-Server 통신 구조
Discord Activity는 `iframe` 내에서 웹 앱을 구동하는 방식임.
*   **Frontend**: 사용자의 브라우저(디스코드)에서 실행되며 UI 렌더링.
*   **Backend**: 모든 게임 로직과 데이터(방 상태, 점수, 타이머)를 중앙 관리.
*   **Sync**: `setInterval`로 서버에서 타이머를 관리하고, 매초 클라이언트에 브로드캐스팅하여 모든 유저가 동일한 시간을 보게 함.

#### [B] Troubleshooting
*   **Tunneling Issue**: 로컬 개발 시 디스코드에서 접근하기 위해 터널링 툴(Cloudflared 등)을 사용했으나 연결이 불안정했음. -> 클라우드 배포(Vercel/Render)로 환경을 이원화하여 해결.
*   **CORS & Mixed Content**: HTTPS(프론트)와 HTTP(백엔드) 간 통신 문제 발생. -> 백엔드 CORS 설정 추가 및 환경 변수(`VITE_API_URL`) 분리로 해결.

### 6. Conclusion (회고)
단순한 웹 게임을 넘어, **"디스코드라는 플랫폼 안에서 돌아가는 앱"**을 만드는 경험이 신선했음.
특히 실시간성이 중요한 게임에서 Socket.io의 상태 동기화 로직을 정교하게 다듬는 과정에서 많은 것을 배움. 앞으로도 친구들과 가볍게 즐길 수 있는 미니 게임들을 이 플랫폼 위에 더 얹어보고 싶음.
