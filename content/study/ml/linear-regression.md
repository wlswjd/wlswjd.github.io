---
title: "선형 회귀 (Linear Regression) 완벽 이해"
date: "2024-12-01"
description: "선형 회귀의 수학적 원리부터 Python 구현까지."
tags: ["선형회귀", "수학", "최적화"]
---

## 선형 회귀의 목적

입력 변수 X와 출력 변수 y 사이의 **선형 관계**를 모델링합니다.

$$y = w_1 x_1 + w_2 x_2 + \cdots + b$$

## 손실 함수 (Loss Function)

**평균 제곱 오차 (MSE)**:

$$L = \frac{1}{n}\sum_{i=1}^n (y_i - \hat{y}_i)^2$$

이 값을 최소화하는 가중치 $w$를 찾는 것이 목표입니다.

## 경사 하강법 (Gradient Descent)

```python
def gradient_descent(X, y, lr=0.01, epochs=1000):
    w = np.zeros(X.shape[1])
    b = 0
    n = len(y)
    
    for _ in range(epochs):
        y_pred = X @ w + b
        dw = (2/n) * X.T @ (y_pred - y)
        db = (2/n) * np.sum(y_pred - y)
        w -= lr * dw
        b -= lr * db
    
    return w, b
```

## 정규화 (Regularization)

- **L1 (Lasso)**: 일부 가중치를 0으로 만들어 피처 선택 효과
- **L2 (Ridge)**: 가중치의 크기를 작게 유지하여 과적합 방지
