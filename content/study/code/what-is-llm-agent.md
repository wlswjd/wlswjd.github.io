---
title: "LLM Agent란 무엇인가?"
date: "2025-01-05"
description: "LLM 기반 에이전트의 개념, 구성 요소, 그리고 활용 사례를 정리합니다."
tags: ["LLM", "Agent", "RAG", "Tool Use"]
---

## LLM Agent 개요

LLM Agent는 대형 언어 모델(LLM)을 **두뇌**로 사용하여 자율적으로 계획을 세우고 행동할 수 있는 시스템입니다.

## 핵심 구성 요소

### 1. 계획 (Planning)
- 복잡한 목표를 작은 단계로 분해
- ReAct, Chain-of-Thought, Tree-of-Thought 등의 기법 활용

### 2. 메모리 (Memory)
- **단기 기억**: 현재 컨텍스트 창 내 대화 기록
- **장기 기억**: 벡터 DB 활용한 외부 저장소

### 3. 도구 사용 (Tool Use)
```
Agent → 도구 호출 결정 → Tool (검색, 계산, API 호출 등) → 결과 반환 → 다음 행동 결정
```

### 4. 행동 (Action)
- 코드 실행, 웹 검색, API 호출 등
- 환경과의 상호작용

## 주요 프레임워크

| 프레임워크 | 특징 |
|---|---|
| LangChain | 가장 범용적, 다양한 통합 |
| LlamaIndex | RAG에 특화 |
| AutoGen | 멀티 에이전트 협업 |
| CrewAI | 역할 기반 에이전트 팀 |

## 간단한 구현 예시

```python
from langchain.agents import AgentExecutor, create_react_agent
from langchain_openai import ChatOpenAI
from langchain.tools import DuckDuckGoSearchRun

llm = ChatOpenAI(model="gpt-4")
tools = [DuckDuckGoSearchRun()]
agent = create_react_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "오늘 날씨를 검색해서 알려줘"})
```

> **주의**: Hallucination과 무한 루프 방지를 위한 가드레일 설계가 중요합니다.
