---
title: "서울시 부동산 가격 예측 프로젝트 회고 with 머신러닝"
date: "2025-05-18"
description: "공공데이터를 활용하여 서울시 아파트 실거래가를 예측하는 모델을 구축하고, 데이터 전처리부터 AutoML까지의 과정을 정리함."
tags: ["Python", "Scikit-learn", "XGBoost", "AutoGluon", "Pandas"]
---

부트캠프에서 진행한 머신러닝 경진대회를 통해, 공공데이터를 기반으로 서울시 아파트 가격을 예측하는 프로젝트를 수행함. 데이터 전처리부터 모델링, 그리고 AutoML까지의 흐름을 정리해봄.

---

### 1. Overview (프로젝트 개요)

*   **목표:** 서울시 아파트 실거래가 데이터를 활용하여 가격을 예측하는 회귀 모델 구축
*   **데이터셋:**
    *   `train.csv`: 학습용 데이터 (약 111만 건)
    *   `test.csv`: 예측용 테스트 데이터 (약 9천 건)
    *   `bus_feature.csv`, `subway_feature.csv`: 주변 대중교통 정보

### 2. EDA & Preprocessing (데이터 탐색 및 전처리)

데이터를 분석하기 전, 먼저 타겟 변수(거래금액)의 분포와 결측치 현황을 파악함.

#### [A] 데이터 분포 확인
가장 먼저 타겟 값인 '거래금액'의 분포를 확인해보니, 왼쪽으로 치우친 형태를 보임. 이를 정규분포에 가깝게 만들기 위해 로그 변환(Log Transformation)이 필요함을 확인함.

![Target Distribution](/images/house1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. Target Variable Distribution</em></p>

#### [B] 결측치(Missing Values) 처리
데이터셋에 포함된 결측치를 시각화하여 확인. '임대보증금' 등 결측 비율이 높은 변수는 중앙값으로 대체하거나 제거하는 전략을 수립함.

![Missing Values Heatmap](/images/house2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. Missing Values Heatmap</em></p>

#### [C] 상관관계 분석 (Correlation)
변수 간의 상관관계를 분석하여 타겟 변수와 연관성이 높은 피처를 선별함. 붉은색에 가까울수록 상관관계가 높음을 의미함.

![Correlation Matrix](/images/house3.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Correlation Matrix</em></p>

#### [D] 이상치 처리 및 파생변수 생성
*   **이상치(Outlier):** 전용면적 대비 거래금액이 비정상적으로 낮거나 높은 데이터를 IQR 방식으로 제거함.
*   **파생변수:** '건축년도'만으로는 부족하여 `2025 - 건축년도`를 계산해 **'건물 나이(Building Age)'** 변수를 생성함.

![Area vs Price Scatter Plot](/images/house4.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 4. 전용면적 vs 거래금액 산점도 (이상치 제거 전후 비교)</em></p>

### 3. Modeling Strategy (모델링 전략)

#### [A] Baseline Modeling
*   **LightGBM**을 베이스라인 모델로 선정.
*   `num_leaves`, `max_depth`, `learning_rate` 등을 Grid Search로 최적화.
*   Early Stopping을 적용하여 과적합을 방지함.

#### [B] Ensemble & AutoML
단일 모델의 한계를 극복하기 위해 여러 모델을 조합함.
1.  **Weighted Average:** LGBM, XGBoost, CatBoost의 예측값을 가중 평균.
2.  **AutoML (AutoGluon):** Amazon의 AutoML 프레임워크인 AutoGluon을 활용하여 Stacking 및 Bagging을 자동으로 수행.

```python
from autogluon.tabular import TabularPredictor
predictor = TabularPredictor(label='거래금액(만원)', eval_metric='rmse').fit(train_data=train_df)
```

### 4. Result (실험 결과)

다양한 모델 실험 결과, AutoML을 적용했을 때 가장 우수한 성능을 보임.

![Model Performance](/images/house5.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 5. Model Performance Comparison</em></p>

최종적으로 리더보드 제출을 위해 학습된 모델의 피처 중요도(Feature Importance)를 분석하고, 결과를 시각화하여 제출함.

![Final Result](/images/house6.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 6. Final Prediction Results & Feature Importance</em></p>

### 5. Conclusion & Insight (회고)

*   **데이터 전처리의 중요성:** EDA와 피처 엔지니어링에 가장 많은 시간을 쏟았고, 실제로 모델 튜닝보다 전처리가 성능 향상에 더 큰 영향을 줌.
*   **AutoML의 강력함:** 베이스라인 모델을 빠르게 구축하고, 앙상블을 통해 성능을 극대화하는 데 매우 유용했음.
*   **향후 계획:** 시계열성을 고려한 모델링이나, 서울시 구별로 모델을 분리하여 학습시키는 방법을 시도해볼 예정임.
