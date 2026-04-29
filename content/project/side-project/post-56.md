---
title: "[Project] 내 블로그 챗봇에게 '자아'를 심어주기 (Lightweight RAG & CORS TroubleShooting)"
date: "2026-03-01"
description: "Vector DB 없이 프롬프트 엔지니어링만으로 구현한 초경량 RAG. GitHub Pages와 Vercel 간의 CORS 및 405 Method Not Allowed 에러 해결 과정."
tags: ["JavaScript", "Vercel", "Gemini API", "RAG", "CORS"]
---

### 1. The Problem: "주인님 글이 뭐죠?"

내 블로그 우측 하단에 사는 강아지 비서 **Cedric**. 귀엽긴 한데 치명적인 단점이 있었다. **내 블로그에 무슨 글이 있는지 모른다는 것.**
"RAG 관련 글 찾아줘"라고 물으면 "정보가 없습니다"라고 답하거나, 엉뚱한 소리를 했다.

거창하게 **Pinecone** 같은 Vector DB를 붙이기엔, 내 블로그 글 개수(약 50개)가 너무 소박했다. 배보다 배꼽이 더 큰 상황.

### 2. Solution: Lightweight RAG (Context Injection)

**"그냥 글 목록을 요약해서 귓속말(System Prompt)로 다 알려주면 되지 않을까?"**

LLM의 Context Window가 충분히 길어졌기 때문에 가능한 전략이다. 복잡한 임베딩 과정 없이, 프론트엔드에서 `data.js`를 읽어 텍스트로 요약한 뒤 API에 같이 던져주기로 했다.

```javascript
// Frontend (scripts/chatbot.js)
getBlogContext: function() {
    // 최신 글 30개만 추려서 요약
    return posts.map(p => `[ID: ${p.id}] 제목: ${p.title}, 요약: ${p.summary}`).join('\n');
}
```

이제 사용자가 질문을 할 때마다, 이 요약본이 **"이 블로그엔 이런 글들이 있어"**라는 지침과 함께 Gemini에게 전달된다.

### 3. The Wall: 405 Method Not Allowed & CORS

로컬(`localhost`)에서는 잘 작동했는데, **GitHub Pages**에 배포하니 에러가 터졌다.

> **Error: 405 Method Not Allowed**

**원인 분석:**
1.  GitHub Pages는 **정적(Static) 호스팅**이다. 서버가 없으니 `/api/chat` 같은 백엔드 로직을 처리할 수 없다.
2.  그래서 실제 서버인 **Vercel** 주소(`https://...vercel.app/api/chat`)로 요청을 보내야 했다.
3.  그랬더니 이번엔 **CORS(Cross-Origin Resource Sharing)** 보안 정책이 막아섰다.

**해결책:**
1.  **Backend (Vercel)**: 응답 헤더에 `Access-Control-Allow-Origin: *`를 추가하여 외부 접속 허용.
2.  **Frontend**: 현재 접속한 도메인이 `github.io`면 자동으로 Vercel 주소로 쏘도록 분기 처리.

```javascript
const isGitHubPages = window.location.hostname.includes('github.io');
const API_URL = isGitHubPages 
    ? 'https://my-blog.vercel.app/api/chat' 
    : '/api/chat';
```

### 4. Result

이제 Cedric은 내 블로그의 모든 글을 꿰뚫고 있다.
"추천 시스템 글 요약해줘"라고 하면, 정확히 내가 쓴 글의 ID와 내용을 바탕으로 답변한다. **Vector DB 비용 0원**으로 구현한, 가성비 최고의 **Personalized Chatbot**이 완성되었다.
