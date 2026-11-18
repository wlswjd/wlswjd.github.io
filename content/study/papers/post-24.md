---
title: "[논문 리뷰] Wide & Deep Learning for Recommender Systems"
date: "2026-01-10"
description: "선형 모델의 암기(Memorization) 능력과 딥러닝의 일반화(Generalization) 능력을 결합하여 추천 성능을 극대화한 구글의 Wide & Deep 모델 분석."
tags: ["Recommender System", "Deep Learning", "Logistic Regression", "TensorFlow"]
---

### 1. Overview
2016년 구글(Google Play Store 팀)이 발표한 이 논문은 추천 시스템의 두 가지 핵심 가치인 **Memorization(암기)**과 **Generalization(일반화)**을 동시에 잡기 위해 설계된 하이브리드 모델임.

![Wide & Deep Spectrum](/images/wide_1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. The spectrum of Wide & Deep Learning (좌측: Wide, 우측: Deep, 중앙: Wide & Deep)</em></p>

*   **Memorization (Wide):** "A를 사면 B를 산다"와 같이 데이터에 빈번하게 등장하는 강력한 규칙을 학습함. (선형 모델)
*   **Generalization (Deep):** 데이터에 직접적으로 등장하지 않은, 희소(Sparse)하고 잠재적인 조합을 찾아냄. (딥러닝 모델)

이 두 가지를 결합하여, 아는 것은 확실하게 추천하고(Wide), 모르는 것은 똑똑하게 추론하는(Deep) 시스템을 구축함.

### 2. Methodology (핵심 모델 구조)

#### [A] The Wide Component (Memorization)
Wide 파트는 선형 모델(Logistic Regression)을 기반으로 함. 여기서 핵심은 **Cross-Product Transformation**임.

![Wide Component Formula](/images/wide_2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. Wide Component의 수식과 구조</em></p>

예를 들어, "AND(User_Installed_App='Netflix', Impression_App='Pandora')"와 같이 두 가지 조건이 모두 1일 때만 1이 되는 피처를 만듦. 이는 분석가가 도메인 지식을 활용하여 직접 설계(Feature Engineering)해야 하며, 명확한 상관관계를 학습하는 데 매우 강력함.

#### [B] The Deep Component (Generalization)
Deep 파트는 임베딩(Embedding) 층과 다층 퍼셉트론(MLP)으로 구성됨.

![Deep Component](/images/wide_3.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Deep Component의 구조 (Embedding -> Hidden Layers)</em></p>

고차원의 희소한 범주형 데이터(Categorical Features)를 저차원 밀집 벡터(Dense Vector)로 변환하여, 아이템 간의 보이지 않는 유사성을 학습함. 이를 통해 한 번도 본 적 없는 유저-아이템 조합에 대해서도 추천이 가능해짐.

#### [C] Joint Training (동시 학습)
Wide & Deep 모델은 두 모델을 단순히 앙상블(Ensemble)하는 것이 아니라, **Joint Training**함.

![Full Architecture](/images/wide_4.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 4. Wide & Deep 전체 아키텍처 및 Joint Training 구조</em></p>

위 그림과 같이, Wide 파트의 출력과 Deep 파트의 출력을 합쳐서 하나의 Sigmoid 함수에 넣음. 역전파(Backpropagation) 시, Loss가 양쪽으로 동시에 전파되어 가중치를 업데이트함.
$$ P(Y=1|x) = \sigma(w_{wide}^T [x, \phi(x)] + w_{deep}^T a^{(l_f)} + b) $$

### 3. System Implementation (시스템 구현)
논문에서는 실제 구글 플레이 스토어의 앱 추천 파이프라인도 소개하고 있음.

![System Pipeline](/images/wide_5.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 5. Google Play Store의 앱 추천 파이프라인 (Data Generation -> Training -> Serving)</em></p>

수십억 건의 유저 로그 데이터를 처리하여 학습 데이터를 생성하고(Data Generation), 모델을 학습시킨 뒤(Training), 실제 유저 요청이 오면 실시간으로 추론(Serving)하는 전체 흐름을 보여줌. 이는 단순한 모델링을 넘어 **MLOps** 관점에서도 중요한 레퍼런스가 됨.

### 4. Application (For Business)
이 논문은 **AI Analyst**로서의 역량을 가장 잘 보여줄 수 있는 모델임.

1.  **분석가의 개입 (Wide Part):** 순수 딥러닝 모델은 "왜 추천했는지" 설명하기 어렵지만, Wide 파트는 분석가가 직접 설계한 피처("여성 의류 카테고리에서 1+1 행사 중")가 모델에 반영됨. 즉, 비즈니스 도메인 지식을 모델에 주입할 수 있음.
2.  **매출 극대화:** 구글 플레이 스토어 실험 결과, Wide & Deep 모델은 단순 Wide 모델이나 Deep 모델보다 앱 설치율(App Acquisitions)을 각각 3.9%, 1% 향상시킴.
3.  **균형 잡힌 추천:** 인기 있는 상품만 추천하는(Wide 편향) 문제와, 너무 엉뚱한 상품을 추천하는(Deep 편향) 문제를 상호 보완하여, 유저에게 신뢰도 높은 추천을 제공함.
