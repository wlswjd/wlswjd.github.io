---
title: "[Project] 내 블로그에 '살아있는' AI 챗봇(Cedric) 심기 (feat. Vercel & Gemini)"
date: "2026-02-03"
description: "GitHub Pages의 정적 한계를 Vercel Serverless로 극복하고, Google Gemini API를 연동하여 자가 치유(Self-Healing) 기능을 갖춘 AI 챗봇 'Cedric'을 구현한 과정."
tags: ["JavaScript", "Vercel", "Serverless", "Google Gemini API", "Prompt Engineering", "Code"]
---

### 1. Intro: 정적인 블로그는 심심하다
내 포트폴리오 사이트는 **Windows 98** 콘셉트의 레트로 디자인임. 하지만 단순히 글만 읽는 정적인 사이트(Static Site)는 뭔가 2% 부족해 보였다.
"방문자가 내 기술 스택에 대해 물어보면 바로 대답해주는 AI 비서가 있으면 어떨까?"
그래서 옛날 MS 오피스의 **'강아지 비서(Rocky)'**를 모티브로 한 AI 챗봇 **'Cedric'**을 만들기로 결심했다.

### 2. The Wall: GitHub Pages의 한계
처음엔 간단할 줄 알았다. 하지만 GitHub Pages는 **정적 호스팅(Static Hosting)** 서비스다. 즉, 서버가 없음.
여기서 치명적인 문제가 발생함.

*   **API Key 노출 문제:** JavaScript 코드(`main.js`)에 내 OpenAI/Gemini API 키를 넣으면, 방문자가 '소스 보기'로 내 키를 훔쳐갈 수 있다. (내 카드로 남이 채굴을 돌릴 수도 있다!)
*   **CORS 문제:** 브라우저에서 직접 구글 API를 호출하면 보안 정책(CORS) 때문에 막히는 경우가 많다.

### 3. Solution: Vercel Serverless Function
이 문제를 해결하기 위해 **Vercel**을 도입했다. Vercel은 GitHub 저장소를 연결하면 자동으로 배포해줄 뿐만 아니라, **Serverless Function(서버리스 함수)** 기능을 제공함.

*   **Frontend:** HTML/JS/CSS (GitHub Pages와 동일)
*   **Backend:** `/api/chat.js` (Node.js 환경)

이제 프론트엔드는 내 백엔드(`/api/chat`)에게 메시지만 보내고, 백엔드가 숨겨진 API Key(`process.env.KEY`)를 사용해 구글 서버와 통신한다. 보안 완벽 해결.

### 4. Troubleshooting: 험난한 연동 과정

#### [Issue 1] "Model Not Found" (404 Error)
처음엔 **Gemini 1.5 Flash** 모델을 사용하려 했으나, 계속 `404 Not Found` 에러가 떴다.
*   **원인:** 사용한 라이브러리(`@google/generative-ai`) 버전이 너무 구버전(`^0.1.0`)이라 최신 모델을 인식하지 못함.
*   **해결:** `package.json`에서 버전을 `^0.12.0`으로 업데이트함.

#### [Issue 2] 여전한 404... 왜?
라이브러리를 업데이트하고 모델을 `gemini-pro`로 바꿨는데도 404가 떴다.
*   **원인:** 새로 발급받은 API Key가 특정 모델 권한만 열려있거나, 구글 클라우드 프로젝트 설정이 덜 전파된 상태였다.
*   **해결:** 코드가 스스로 살아남는 **"Self-Healing"** 로직을 구현하기로 함.

### 5. The "Self-Healing" Code (핵심)
특정 모델 이름(`gemini-1.5-flash`)에 의존하면 구글이 모델명을 바꾸거나 내 키 권한이 바뀔 때마다 챗봇이 죽는다.
그래서 **"일단 찔러보고, 안 되면 되는 놈을 찾아내는"** 로직을 짰다.

```javascript
try {
    // 1. 일단 1.5 Flash로 시도
    response = await callGemini('gemini-1.5-flash');

    // 2. 만약 404(없음) 뜨면?
    if (response.status === 404) {
        console.log("Flash 모델 실패. 사용 가능한 모델 목록 조회 중...");
        
        // 내 키로 쓸 수 있는 모델 리스트를 받아옴
        const listResp = await fetch(listUrl);
        const listData = await listResp.json();
        
        // 'generateContent' 기능을 지원하는 첫 번째 모델을 찾음
        const validModel = listData.models.find(m => m.supportedGenerationMethods.includes('generateContent'));
        
        // 그걸로 다시 시도!
        response = await callGemini(validModel.name);
    }
}
```

이 코드를 적용하자마자, 로그에 `Found fallback model: gemini-2.0-flash-exp`가 뜨면서 챗봇이 살아났다. 내가 명시하지 않았던 최신 실험 모델을 스스로 찾아내서 연결한 것이다.

### 6. Design: Retro Emotion
기능만 있으면 재미없다. 감성을 넣었다.
*   **Mascot:** 픽셀 아트 스타일의 강아지 이미지를 우측 하단에 배치.
*   **UI:** 윈도우 98 스타일의 회색 창 대신, 오피스 길잡이 특유의 **노란색 말풍선**으로 대화창을 꾸몄다.
*   **Persona:** 시스템 프롬프트(System Prompt)에 "너는 충실하고 장난기 많은 강아지 비서 Cedric이야"라고 주입하여 딱딱한 AI 로봇 같은 말투를 피했다.

### 7. Result
이제 내 블로그 우측 하단에는 항상 Cedric이 대기 중이다. 포트폴리오를 보러 온 채용 담당자가 "이거 어떻게 만든 거지?" 하고 눌러보는 순간, 이 **서버리스 아키텍처**와 **문제 해결 과정**이 자연스럽게 어필될 것이다.
