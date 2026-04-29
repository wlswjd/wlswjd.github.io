---
title: "[논문 리뷰] Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks (NeurIPS 2020)"
date: "2026-02-12"
description: "LLM의 환각(Hallucination) 문제를 해결하고 최신 정보를 반영하기 위해, 외부 지식 베이스를 검색(Retrieval)하여 생성(Generation)에 활용하는 RAG 방법론의 시초가 된 논문."
tags: ["NLP", "RAG", "LLM", "Vector Search"]
---

### 1. Intro

클루커스를 비롯한 현재 AI 씬의 대부분 기업들이 매달려 있는 **RAG(Retrieval-Augmented Generation)**.
단순히 "검색해서 넣는다"는 아이디어가 어떻게 NLP의 패러다임을 바꿨는지, 그리고 그 이면의 수학적 원리는 무엇인지 원논문을 통해 깊게 파보려고 함.

### 2. The Core Problem: Parametric vs Non-Parametric Memory

기존 LLM(BERT, GPT 등)은 세상의 모든 지식을 자신의 가중치($W$) 안에 우겨넣으려 했음. 이를 **Parametric Memory**라고 함.
하지만 이 방식은 명확한 한계가 존재함.

1.  **Hallucination**: 학습하지 않은 내용을 물어보면 그럴듯한 거짓말을 함.
2.  **Outdated**: 모델이 학습된 시점 이후의 세상(Post-training world)을 모름.
3.  **High Cost**: 지식 업데이트를 위해 모델 전체를 재학습(Re-training)하는 건 비용적으로 미친 짓임.

저자들은 이에 대한 해결책으로 **Non-Parametric Memory**를 제안함. 즉, 모델 외부의 **Wikipedia(Dense Vector Index)**를 "Memory"로 정의하고, 필요할 때마다 꺼내 쓰자는 것임.

### 3. RAG Architecture & Mathematics

RAG는 **Retriever(검색기)**와 **Generator(생성기)**가 결합된 구조임.
단순히 이어 붙인 게 아니라, **End-to-End로 미분 가능하도록(Differentiable)** 설계된 것이 핵심임.

![RAG Overview](/images/retrieval_1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. RAG 모델의 전체 아키텍처 (Retriever + Generator)</em></p>

#### [A] DPR (Dense Passage Retriever)
질문($x$)과 문서($z$)를 각각 BERT 기반의 인코더로 임베딩한 뒤, 내적(Dot Product)을 통해 관련성 점수를 계산함.

$$ p_{eta}(z|x) propto exp(d(z)^	op q(x)) $$

*   $d(z)$: 문서 인코더 (Document Encoder)
*   $q(x)$: 질문 인코더 (Query Encoder)
*   $eta$: Retriever의 파라미터

#### [B] Generator (BART)
검색된 문서($z$)와 질문($x$)을 함께 입력받아 답변($y$)을 생성함.

$$ p_{	heta}(y_i | x, z, y_{1:i-1}) $$

### 4. Two Models: RAG-Sequence vs RAG-Token

논문에서는 지식을 주입하는 방식에 따라 두 가지 모델을 제안함. 이 부분이 수학적으로 가장 흥미로운 지점임.

![Model Comparison](/images/retrieval_2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. RAG-Sequence와 RAG-Token의 차이</em></p>

#### (1) RAG-Sequence Model
**"하나의 문서를 잡고 끝까지 밀고 나가는 방식"**
상위 K개의 문서를 검색한 뒤, 각 문서마다 완전한 답변을 생성하고 그 확률을 더함(Marginalize).

$$ p_{seq}(y|x) approx sum_{z in 	ext{top-k}(p(cdot|x))} p_{eta}(z|x) prod_{i}^{N} p_{	heta}(y_i|x, z, y_{1:i-1}) $$

*   문서 $z$가 한 번 정해지면, 답변 $y$ 전체를 생성하는 동안 고정됨.
*   **Use Case**: 질문의 의도가 명확하고, 하나의 문서에서 답을 완결지을 수 있는 경우에 적합.

#### (2) RAG-Token Model
**"토큰마다 다른 문서를 참고하는 방식"**
답변의 각 단어(Token)를 생성할 때마다 문서를 다시 확률적으로 선택함.

$$ p_{token}(y|x) approx prod_{i}^{N} sum_{z in 	ext{top-k}} p_{eta}(z|x) p_{	heta}(y_i|x, z, y_{1:i-1}) $$

*   첫 번째 단어는 문서 A에서, 두 번째 단어는 문서 B에서 가져올 수 있음.
*   **Use Case**: "오바마는 어디서 태어났고 부인은 누구인가?"처럼 여러 출처의 정보를 조합해야 하는 경우 더 강력함.

### 5. Experiments & Results

![Performance](/images/retrieval_3.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Open-Domain QA Benchmark 결과</em></p>

실험 결과, RAG는 **Natural Questions (NQ)**, **TriviaQA** 등 지식 집약적 태스크에서 기존의 Parametric-only 모델(T5-11B 등)을 압도함.
특히 파라미터 수가 훨씬 적은데도 성능이 더 높다는 것은 **"지식을 외우는 것보다 찾는 것이 효율적임"**을 증명함.

### 6. Implementation Insight

논문은 Retriever와 Generator를 동시에 학습(Joint Training)시켰지만, 실무(Production)에서는 비용 문제로 인해 **Frozen RAG**가 주류임.
*   Retriever는 이미 학습된 모델(ColBERT, BGE 등)을 쓰고 고정함.
*   Generator(LLM)도 고정하고, 프롬프트 엔지니어링으로 문맥을 주입함.

하지만 "진짜 성능"을 내려면 논문처럼 **Domain-Specific Fine-tuning**이 필수적임. 특히 한국어 도메인에서는 기본 임베딩 모델의 성능이 떨어지기 때문에, 우리 회사 데이터에 맞게 임베딩 모델을 추가 학습(Contrastive Learning)시키는 것이 RAG 성능의 8할을 결정한다고 봄.
