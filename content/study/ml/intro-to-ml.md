---
title: "머신러닝 입문: 핵심 개념 정리"
date: "2024-11-20"
description: "머신러닝의 기본 개념과 주요 알고리즘을 정리한 노트입니다."
tags: ["머신러닝", "기초", "지도학습"]
---

## 머신러닝이란?

머신러닝은 데이터를 통해 컴퓨터가 스스로 학습하도록 만드는 AI의 한 분야입니다.

## 학습 방식의 분류

### 지도 학습 (Supervised Learning)
- 레이블이 있는 데이터로 학습
- **회귀(Regression)**: 연속적인 값 예측
- **분류(Classification)**: 카테고리 예측

### 비지도 학습 (Unsupervised Learning)
- 레이블 없는 데이터에서 패턴 발견
- 군집화(Clustering), 차원 축소(Dimensionality Reduction)

### 강화 학습 (Reinforcement Learning)
- 환경과의 상호작용을 통해 보상 최대화
- 게임 AI, 로봇 제어 등에 활용

## 주요 알고리즘

| 알고리즘 | 유형 | 특징 |
|---|---|---|
| Linear Regression | 지도(회귀) | 단순, 해석 용이 |
| Decision Tree | 지도(분류/회귀) | 직관적, 과적합 주의 |
| Random Forest | 지도(앙상블) | 강건성 높음 |
| K-Means | 비지도(군집) | 구현 간단 |

## 핵심 개념 정리

```python
# scikit-learn으로 간단한 선형 회귀
from sklearn.linear_model import LinearRegression
import numpy as np

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

model = LinearRegression()
model.fit(X, y)
print(f"예측: {model.predict([[6]])}")  # [12.]
```

> **과적합(Overfitting)** 주의: 훈련 데이터에만 지나치게 최적화되면 새로운 데이터에서 성능이 떨어집니다.
