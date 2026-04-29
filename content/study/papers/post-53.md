---
title: "[논문 리뷰] Dense Passage Retrieval for Open-Domain Question Answering (EMNLP 2020)"
date: "2026-02-18"
description: "기존 키워드 기반 검색(BM25)의 한계를 넘어, 딥러닝 기반의 Dense Vector로 문서를 검색하는 DPR 방법론. In-batch Negative 학습 전략이 핵심."
tags: ["NLP", "Dense Retrieval", "BERT", "Contrastive Learning"]
---

### 1. Intro: 검색의 패러다임 변화 (Sparse to Dense)

RAG(Retrieval-Augmented Generation) 시스템에서 가장 중요한 건 "얼마나 똑똑하게 문서를 찾아오느냐"임.
과거에는 **TF-IDF**나 **BM25** 같은 키워드 매칭(Sparse Retrieval) 방식을 썼음. 하지만 이 방식은 치명적인 단점이 있음.
"핸드폰"으로 검색하면 "스마트폰"이나 "모바일 기기"가 들어간 문서는 못 찾음. (Lexical Mismatch)

이 문제를 해결하기 위해 등장한 것이 바로 **DPR(Dense Passage Retrieval)**임. 단어가 달라도 **의미(Semantics)**가 비슷하면 찾아낼 수 있도록, 질문과 문서를 벡터 공간(Vector Space)에 매핑하는 기술임.

![DPR Overview](./assets/dense1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. Dense Passage Retrieval의 전체적인 개요. 질문과 문서를 각각의 인코더를 통해 벡터화하고 내적(Dot Product)으로 유사도를 계산함.</em></p>

### 2. Architecture: Bi-Encoder Structure

구조는 매우 심플함. 두 개의 BERT 모델을 사용함.

$$ sim(q, p) = E_Q(q)^	op E_P(p) $$

*   **Question Encoder ($E_Q$)**: 질문($q$)을 입력받아 768차원 벡터로 변환.
*   **Passage Encoder ($E_P$)**: 문서($p$)를 입력받아 768차원 벡터로 변환.
*   **Similarity**: 두 벡터의 내적(Dot Product)을 통해 유사도를 계산.

이렇게 학습된 인코더로 모든 문서를 미리 벡터화해두고, **FAISS** 같은 라이브러리를 쓰면 수천만 개의 문서 중에서도 0.1초 안에 정답을 찾아낼 수 있음 (MIPS).

### 3. Training Strategy: The Secret Sauce

DPR 논문의 진짜 가치는 모델 구조가 아니라 **학습 방법(Training Strategy)**에 있음.
"어떻게 하면 정답 문서는 가깝게, 오답 문서는 멀게 만들까?"를 풀기 위해 **Contrastive Learning**을 사용함.

![In-batch Negatives](./assets/dense2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. In-batch Negative 학습 전략. 배치 내의 다른 질문들에 대한 정답 문서를 나의 오답(Negative)으로 활용하여 효율성을 극대화함.</em></p>

#### [A] In-batch Negatives (효율의 극대화)
일반적으로 학습 데이터는 `{질문, 정답 문서, 오답 문서}` 쌍으로 구성됨.
하지만 오답 문서를 일일이 많이 준비하는 건 비용이 큼. 저자들은 **"배치(Batch) 안에 있는 다른 질문의 정답 문서들은, 내 질문 입장에서는 다 오답(Negative)이지 않을까?"**라는 아이디어를 냄.

*   배치 사이즈가 $B$라면, 1개의 질문에 대해:
    *   **Positive**: 자신의 정답 문서 (1개)
    *   **Negative**: 다른 질문들의 정답 문서 ($B-1$개)
*   이렇게 하면 별도의 오답 데이터를 로드할 필요 없이, 배치 내부에서 $B^2$개의 학습 시그널을 만들어낼 수 있음. 메모리 효율과 학습 속도를 동시에 잡은 신의 한 수임.

#### [B] Hard Negatives (난이도 조절)
너무 쉬운 오답만 있으면 모델이 공부를 안 함. 그래서 **BM25로 검색은 되지만 실제로는 정답이 아닌 문서(Hard Negative)**를 일부러 하나씩 끼워 넣음.
"단어는 겹치는데 내용은 다른" 헷갈리는 예제를 줌으로써 모델이 더 정교한 의미 파악을 하도록 유도함.

### 4. Experiments & Results

![Retrieval Accuracy](./assets/dense3.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Top-k Retrieval Accuracy 비교. DPR이 BM25보다 훨씬 높은 정확도를 보여줌 (특히 Top-20, Top-100에서).</em></p>

*   **성능**: 기존 최강자였던 BM25보다 압도적으로 높은 검색 정확도를 보임 (Top-20 기준 10% 이상 향상).
*   **End-to-End QA**: 이렇게 찾은 문서를 LLM에 넣어 답을 생성했을 때, 전체 QA 시스템의 성능도 비약적으로 상승함.

![Ablation Study](./assets/dense4.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 4. Negative Sampling 전략에 따른 성능 비교. In-batch Negative와 BM25 Hard Negative를 같이 썼을 때(Gold + Entropy + Hard) 성능이 가장 좋음.</em></p>

위 표를 보면 단순히 랜덤한 문서를 오답으로 쓰는 것보다, **BM25에서 높게 랭크된 오답(Hard Negative)**을 섞어 쓰는 것이 성능 향상에 결정적임을 알 수 있음.

![End-to-End QA](./assets/dense5.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 5. End-to-End QA 성능 비교. 검색된 문서를 바탕으로 답을 생성했을 때(Exact Match), DPR 기반 모델이 기존 SOTA를 경신함.</em></p>
<br/>

### 5. Engineer's Insight

DPR은 이제 벡터 검색의 교과서가 되었음. 하지만 실무에서 DPR만 맹신하면 안 됨.
1.  **고유명사 문제**: 제품명이나 사람 이름 같은 건 여전히 BM25가 더 잘 찾음.
2.  **Hybrid Search**: 그래서 현업에서는 **DPR(의미 검색) + BM25(키워드 검색)** 결과를 가중 합산(Reciprocal Rank Fusion)하여 사용하는 것이 국룰임.
3.  **Domain Adaptation**: 위키피디아로 학습된 DPR을 우리 회사 데이터(법률, 의료 등)에 바로 쓰면 성능이 안 나옴. 반드시 우리 도메인 데이터로 추가 학습(Fine-tuning)을 하거나, **GTE, BGE** 같은 최신 임베딩 모델을 쓰는 것이 좋음.
