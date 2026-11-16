---
title: "LangChain: 현업에서 AI 애플리케이션 구축하기"
date: "2025-08-22"
description: "LLM을 활용한 애플리케이션 개발 프레임워크 LangChain의 핵심 개념과 LCEL, 에이전트, RAG 등 실무 활용법을 다룹니다."
tags: ["LangChain", "LLM", "Agents", "RAG", "LCEL"]
---

##  TL;DR

- LangChain은 LLM을 활용한 애플리케이션 개발의 표준 프레임워크임.
- **Chain**: LLM과 프롬프트, 출력 파서를 연결하여 복잡한 로직을 구성함.
- **RAG**: 외부 지식(문서)을 검색하여 LLM에 주입함으로써 할루시네이션을 방지함.
- **Agent**: LLM이 스스로 도구(Tool)를 선택하고 실행 계획을 수립하는 자율적 시스템.

##  LangChain의 핵심 철학: 연결(Chain)

LLM은 텍스트를 완성하는 강력한 엔진이지만, 혼자서는 할 수 없는 게 많음 (예: 최신 뉴스 알기, 수학 계산하기). LangChain은 LLM에게 **손과 발(Tools)**, **기억(Memory)**, **눈(Retrieval)**을 달아주는 접착제 역할을 함.

##  LCEL (LangChain Expression Language)

최근 LangChain은 파이썬의 파이프 연산자(`|`)를 활용한 선언적 문법인 LCEL을 밈. 코드가 훨씬 직관적임.

```python
# Prompt -> Model -> Output Parser의 흐름을 리눅스 파이프처럼 정의
chain = prompt | model | StrOutputParser()

# 실행
result = chain.invoke({"topic": "AI Trends"})
```
이 방식은 스트리밍(Streaming), 비동기(Async), 배치(Batch) 처리를 자동으로 지원하여 프로덕션 레벨 개발에 유리함.

##  RAG (Retrieval Augmented Generation)

LLM의 가장 큰 단점인 '최신 정보 부재'와 '거짓말(Hallucination)'을 해결하는 기술임.
1.  **Retrieval**: 질문과 관련된 문서를 벡터 DB(Vector Store)에서 검색함.
2.  **Augmentation**: 검색된 문서를 프롬프트에 컨텍스트로 끼워 넣음.
3.  **Generation**: LLM이 "제공된 문서에 기반하여" 답변을 생성함.

LangChain은 문서 로딩(Loader), 분할(Splitter), 임베딩(Embedding), 벡터 저장소(VectorStore) 등 RAG 파이프라인의 모든 단계를 모듈화하여 제공함.

##  Agents: 자율적인 AI

단순히 정해진 순서대로 실행하는 Chain을 넘어, **Agent**는 LLM이 "다음에 무엇을 할지" 스스로 결정함.
예를 들어 "오늘 서울 날씨 어때?"라고 물으면, Agent는:
1.  "날씨 정보가 필요하군." (판단)
2.  `Weather_API` 도구를 호출해야겠다. (도구 선택)
3.  API 호출 결과 확인. (실행)
4.  "오늘 서울은 맑습니다." 라고 답변 생성. (응답)

LangChain은 이러한 ReAct(Reasoning + Acting) 패턴을 쉽게 구현할 수 있도록 지원함.
