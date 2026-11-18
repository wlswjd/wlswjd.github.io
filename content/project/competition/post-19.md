---
title: "커머스 상품 구매 예측 (Commerce Purchase Behavior Prediction)"
date: "2025-10-16"
description: "사용자의 쇼핑 패턴을 분석하여 향후 일주일간 구매할 상품을 예측하는 경진대회. ALS와 SASRec의 하이브리드 앙상블 전략으로 Cold/Hot User 문제를 동시에 해결함."
tags: ["Python", "PyTorch", "RecBole", "SASRec", "ALS", "XGBoost"]
---

### 1. Overview (프로젝트 개요)

이커머스 환경에서 사용자의 쇼핑 패턴(View, Cart, Purchase)을 분석하여 **향후 일주일(Next One Week) 동안 구매할 상품을 예측**하는 경진대회임.

수많은 제품 중에서 사용자에게 딱 맞는 상품을 찾아주는 것이 핵심이며, 특히 **추천 시스템(RecSys)**의 특성상 "평가 지표(NDCG@10)에 최적화된 파이프라인"을 구축하는 것이 목표였음.

![Overview](/images/recsys1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. Competition Overview</em></p>

### 2. EDA & Data Analysis (데이터 분석)

데이터는 2019.11 ~ 2020.02(학습) 및 2020.03(테스트)로 구성됨. 총 835만 건의 대규모 데이터였지만, **극심한 데이터 불균형**이 가장 큰 문제였음.

*   **Event Ratio:** View (99.7%) >> Cart (0.2%) > Purchase (0.02%)
*   **Insight:** "장바구니(Cart)나 구매(Purchase) 데이터가 너무 적다." → 따라서 단순 조회(View) 데이터도 중요한 신호로 활용해야 하지만, **구매로 전환되는 뚜렷한 패턴이 부족**함.
*   **Strategy:** 구매/장바구니 이벤트에 가중치를 더 부여하거나, 시계열(Time-decay) 요소를 반영해야 함.

### 3. Modeling Strategy (핵심 모델링 전략)

우리는 단일 모델의 한계를 극복하기 위해 **하이브리드 앙상블(Hybrid Ensemble)** 전략을 채택함.

#### [A] Baseline 1: ALS (Alternating Least Squares)
*   **특징:** 잠재 요인(Latent Factor) 협업 필터링 모델.
*   **강점:** 전역적인 인기 패턴(Global Popularity)과 공출현 빈도를 잘 잡아냄. **상호작용이 적은(Cold/Light) 사용자**에게 강함.
*   **튜닝:** `factors=32`, `alpha=10`, `reg=0.001` 설정 시 베이스라인 대비 13% 성능 향상.

#### [B] Baseline 2: SASRec (Self-Attentive Sequential Recommendation)
*   **특징:** 사용자의 행동 '순서(Sequence)'를 트랜스포머(Self-Attention)로 학습하는 모델.
*   **강점:** 최근 본 상품이 다음 구매에 미치는 영향을 잘 반영함. **상호작용이 많은(Warm/Hot) 사용자**에게 매우 정밀함.
*   **구현:** **RecBole** 라이브러리를 활용하여 구축.

#### [C] Ensemble Strategy (Hybrid)
**"Cold User는 ALS로 잡고, Hot User는 SASRec으로 잡자."**

두 모델의 강점이 서로 다르다는 점에 착안하여, 사용자의 활동량(Interaction Count)에 따라 가중치를 다르게 적용하는 **가변 가중 앙상블**을 시도함.

1.  **RRF (Reciprocal Rank Fusion):** 두 모델이 뽑은 랭킹을 상호 보완적으로 섞음.
2.  **Weighted Sum:** 활동량이 많은 유저 구간에서는 SASRec의 점수에 **1.1~1.4배 가중치**를 부여하여 최근성(Recency)을 더 강조함.

![Modeling Process](/images/recsys4.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. Modeling & Ensemble Process</em></p>

### 4. Advanced Trials (추가 시도 및 시행착오)

성능을 더 끌어올리기 위해 **Ranking Model (Ltr)** 도입을 시도했으나, 몇 가지 한계로 최종 모델에서는 제외함.

*   **Try:** **XGBoostRanker / CatBoostRanker** 도입.
*   **Idea:** "유저가 아이템을 얼마나 선호하는가"를 수치화(Score)하여 랭킹 학습. (Event Weight: View < Cart < Purchase)
*   **Problem:**
    1.  **연산 비용:** 전체 데이터 학습에 10시간 이상 소요되어 하이퍼파라미터 튜닝이 비현실적임.
    2.  **데이터 희소성:** 상호작용이 10개 미만인 유저가 너무 많아, Ranker가 안정적인 Top-10 리스트를 만들지 못함.
*   **Lesson:** 데이터가 희소한(Sparse) 환경에서는 복잡한 랭킹 모델보다 **ALS/SASRec 같은 탄탄한 베이스라인의 앙상블**이 더 효율적임.

### 5. Conclusion & Result (결과 및 회고)

*   **Final Score:** 리더보드 상위권 안착 (ALS 단일 대비 NDCG 대폭 상승)
*   **Insight:**
    *   추천 시스템에서는 **모델의 복잡도보다 데이터의 품질(전처리)**이 훨씬 중요하다는 것을 체감함.
    *   단순히 모델을 섞는 게 아니라, **"유저 세그먼트(Cold vs Hot)"에 따라 모델의 영향력을 조정**하는 전략이 유효했음.

![Result](/images/recsys2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Final Leaderboard Result</em></p>
