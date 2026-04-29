---
title: "[Side Project] 나만의 'Second Brain' RAG 챗봇 구축 계획"
date: "2026-03-01"
description: "개인 노트(Obsidian/Notion)를 지식 베이스로 활용하는 RAG 파이프라인 설계. LangChain과 Vector DB를 활용해 '내 기억을 검색하는' AI 비서 만들기."
tags: ["RAG", "LangChain", "Pinecone", "OpenAI API", "Streamlit"]
---

### 1. Motivation (기획 의도)

개발 공부를 하고 논문을 읽으면서 Obsidian에 정리한 마크다운(Markdown) 노트가 수백 개가 넘어감. 하지만 정작 필요할 때 "그거 어디에 적어놨더라?" 하고 찾는 데 시간이 너무 오래 걸림.
단순 키워드 검색(Ctrl+F)은 "RAG의 한계점" 같은 문맥적인 질문에 답을 못 줌. 그래서 **내 개인 노트들을 학습한 RAG 챗봇**을 만들어, 나만의 **Second Brain**을 구축해보고자 함.

### 2. Core Features (핵심 기능)

1.  **Semantic Search**: "작년에 공부한 강화학습 내용 요약해줘"라고 물으면, 관련 노트를 찾아 요약해줌.
2.  **Source Citation**: 답변이 내 노트의 어느 파일, 어느 문단에서 왔는지 출처를 명시함 (Hallucination 방지).
3.  **Auto-Sync**: 로컬 마크다운 파일이 수정되면 Vector DB에도 자동으로 반영되도록 파이프라인 구축.

### 3. Tech Stack (기술 스택 선정)

*   **Framework**: **LangChain** (RAG 파이프라인 구성의 표준).
*   **LLM**: **GPT-4o-mini** 또는 **Gemini 1.5 Flash** (가성비와 속도 고려).
*   **Embedding**: **text-embedding-3-small** (OpenAI) 또는 **Ko-SBERT** (한국어 특화).
*   **Vector DB**: **Pinecone** (Serverless라 관리가 편함) 또는 **ChromaDB** (로컬 테스트용).
*   **UI**: **Streamlit** (빠르게 프로토타입 만들기 위함).

### 4. Architecture Design (아키텍처)

$$ 	ext{Query} ightarrow 	ext{Hybrid Search (Keyword + Vector)} ightarrow 	ext{Reranking} ightarrow 	ext{LLM Generation} $$

1.  **Ingestion**: Obsidian 폴더 내의 `.md` 파일들을 로드함.
2.  **Chunking**: 단순히 글자 수로 자르지 않고, **Header(#, ##)** 단위로 의미 있게 자르는 `MarkdownHeaderTextSplitter` 사용 예정.
3.  **Embedding & Storage**: 텍스트를 벡터화하여 Pinecone에 저장. 메타데이터로 파일명, 생성일자 저장.
4.  **Retrieval**: 유저 질문에 대해 **MMR(Maximal Marginal Relevance)** 알고리즘으로 다양성 있는 문서를 검색.
5.  **Generation**: 검색된 문맥(Context)을 프롬프트에 넣어 답변 생성.

### 5. Roadmap (개발 일정)

*   **Week 1**: 데이터 전처리 파이프라인 구축 (Markdown Parsing & Cleaning).
*   **Week 2**: Vector DB 연동 및 임베딩 성능 테스트 (Retrieval 품질 평가).
*   **Week 3**: LangChain으로 LLM 연동 및 프롬프트 엔지니어링 (System Prompt 튜닝).
*   **Week 4**: Streamlit UI 구현 및 배포.

### 6. Expected Challenges (예상되는 문제)

*   **한국어 검색 품질**: 영어보다 한국어 임베딩 성능이 떨어질 수 있음. 필요시 Hybrid Search(BM25 + Dense) 도입 고려.
*   **표/코드 블록 처리**: 마크다운 내의 코드 블록이나 표가 깨지지 않고 LLM에 잘 전달될지 테스트 필요.
*   **최신성 유지**: 노트가 수정되었을 때 전체를 다시 임베딩하지 않고, 변경된 부분만 업데이트(Upsert)하는 로직 구현이 까다로울 듯함.
