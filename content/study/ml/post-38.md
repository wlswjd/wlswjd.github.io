---
title: "추천 시스템의 평가: 성능을 측정하는 올바른 방법"
date: "2025-09-21"
description: "추천 시스템의 성능을 평가하는 다양한 패러다임과 지표, 그리고 올바른 데이터 분할 전략에 대해 다룹니다."
tags: ["Evaluation Metrics", "NDCG", "Precision/Recall", "A/B Testing"]
---

##  TL;DR

- 오프라인 평가(Offline)와 온라인 평가(Online) 간의 불일치(Misalignment)를 인지해야 함.
- 미래 데이터 유출(Future Data Leakage)을 막는 것이 평가의 핵심임.
- 정확도(Accuracy) 외에도 다양성(Diversity), 의외성(Serendipity) 등 다각적 평가가 필요함.

##  평가 지표 (Evaluation Metrics) 상세

### 1. 정확도 관련 지표
- **Precision@K**: 추천한 $K$개 중 실제 유저가 선호한 아이템의 비율. (맞춘 개수 / $K$)
- **Recall@K**: 유저가 선호하는 전체 아이템 중 추천 시스템이 찾아낸 비율. (맞춘 개수 / 전체 정답 개수)
- **NDCG (Normalized Discounted Cumulative Gain)**: 추천의 **'순서'**를 고려한 지표. 상위권에 정답이 있을수록 가중치를 더 줌.
    $$ DCG_p = sum_{i=1}^{p} rac{rel_i}{log_2(i+1)} $$
    이를 이상적인 정렬(IDCG)로 나누어 0~1 사이로 정규화한 것이 NDCG임.

### 2. 비즈니스 관점 지표
- **Coverage**: 전체 아이템 중 추천 시스템이 커버할 수 있는 아이템의 비율. (롱테일 아이템이 추천되는가?)
- **Serendipity**: 유저가 미처 몰랐던 뜻밖의 아이템을 발견하게 해주는가? (맨날 뻔한 것만 추천하면 지루해짐)
- **Diversity**: 추천 리스트가 얼마나 다양한 카테고리로 구성되어 있는가?

##  데이터 분할 전략 (Data Split Strategy)

추천 시스템은 **시계열(Time-series)** 데이터임. 따라서 일반적인 Random Split을 쓰면 안 됨.

*   **Bad (Random Split)**: 전체 데이터에서 랜덤하게 8:2로 나눔. -> **미래의 정보가 과거 학습에 유출(Leakage)**되어 성능이 뻥튀기됨.
*   **Good (Temporal Global Split)**: 특정 시점(예: 2025년 1월 1일)을 기준으로 이전은 Train, 이후는 Test로 나눔. 가장 현실적인 평가 방법임.
*   **Alternative (Leave-One-Last)**: 각 유저의 마지막 행동 하나만 Test로 빼고 나머지로 학습함. 구현은 쉽지만, 현실 반영도는 떨어질 수 있음.

결론적으로, 좋은 추천 시스템 평가는 단순히 RMSE를 낮추는 게 아니라, 실제 서비스 환경(Online A/B Test)에서의 비즈니스 지표(CTR, 매출, 체류시간) 상승으로 이어져야 함.
