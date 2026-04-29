---
title: "Attention 메커니즘 완전 정복: Standard부터 Flash, MLA까지"
date: "2025-09-17"
description: "현대 AI의 기반이 된 Attention 메커니즘의 원리부터 최신 최적화 기법인 Flash Attention, MLA까지 깊이 있게 탐구함."
tags: ["Attention", "Transformer", "Flash Attention", "Multi-head Attention"]
---

##  TL;DR

- **Attention**: "어디에 집중할지"를 학습하는 메커니즘. Query(Q), Key(K), Value(V)의 상호작용으로 계산됨.
- **Flash Attention**: GPU 메모리 접근(IO)을 줄여 속도를 비약적으로 높인 하드웨어 최적화 알고리즘.
- **MLA (Multi-head Latent Attention)**: DeepSeek 등 최신 모델이 사용하는 KV Cache 압축 기술. 성능 저하 없이 추론 비용을 낮춤.

##  Standard Attention Mechanism

Transformer의 핵심인 Scaled Dot-Product Attention의 수식은 다음과 같음:
$$ 	ext{Attention}(Q, K, V) = 	ext{softmax}left(rac{QK^T}{sqrt{d_k}}ight)V $$

1.  **Query(Q)와 Key(K)의 내적**: 두 벡터가 얼마나 유사한지(관련 있는지) 계산함.
2.  **Scaling ($1/sqrt{d_k}$)**: 차원이 커질수록 내적 값이 커져 Softmax 기울기가 소실되는 것을 방지함.
3.  **Softmax**: 관련도 점수를 확률(합이 1)로 변환함.
4.  **Value(V)와 가중합**: 중요도에 따라 정보를 취합함.

하지만 이 방식은 입력 길이($N$)의 제곱($O(N^2)$)만큼 메모리와 연산량이 늘어나는 치명적 단점이 있음.

##  Flash Attention: 하드웨어 관점의 최적화

스탠포드 연구진이 제안한 Flash Attention은 수식을 바꾸지 않고, **GPU 메모리 계층 구조(HBM vs SRAM)**를 공략함.
*   **문제**: GPU 연산 속도(Compute)보다 메모리에서 데이터를 가져오는 속도(Memory Bandwidth)가 병목임. 기존 Attention은 $N 	imes N$ 행렬을 HBM(메인 메모리)에 썼다 지웠다를 반복함.
*   **해결**: 행렬을 작은 블록(Tile)으로 쪼개서, 빠른 캐시 메모리(SRAM) 안에서 연산을 다 끝내고 결과만 HBM에 씀.
*   **결과**: 메모리 사용량을 $O(N^2)$에서 $O(N)$ 수준으로 줄이고, 속도는 수 배 빨라짐. 긴 문맥(Long Context) 처리가 가능해진 일등공신임.

##  MLA (Multi-head Latent Attention)

최근 DeepSeek-V2/V3 모델에 적용된 기술로, 거대 모델 추론의 핵심 병목인 **KV Cache** 크기를 줄이는 기법임.
*   기존 MHA(Multi-Head Attention)는 각 헤드마다 KV를 다 저장해야 해서 메모리가 터짐.
*   MQA/GQA(Grouped Query Attention)는 KV 헤드 수를 줄여서 성능이 약간 떨어짐.
*   **MLA**는 KV를 저차원 잠재 벡터(Latent Vector)로 압축했다가 복원하는 방식을 사용하여, **GQA보다 적은 메모리(KV Cache)를 쓰면서도 MHA급의 성능**을 유지함.

##  Conclusion

Attention은 이제 단순히 소프트웨어 알고리즘을 넘어, GPU 하드웨어 특성과 추론 비용까지 고려하며 진화하고 있음. 이 흐름을 이해해야 효율적인 LLM 서빙이 가능함.
