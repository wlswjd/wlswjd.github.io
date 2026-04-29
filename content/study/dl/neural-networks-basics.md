---
title: "신경망 기초: 퍼셉트론부터 딥러닝까지"
date: "2024-12-10"
description: "인공 신경망의 기본 구조와 학습 원리를 정리합니다."
tags: ["딥러닝", "신경망", "역전파"]
---

## 퍼셉트론 (Perceptron)

가장 단순한 형태의 인공 뉴런입니다.

```
입력 → [가중합 + 편향] → 활성화 함수 → 출력
```

## 활성화 함수

| 함수 | 수식 | 특징 |
|---|---|---|
| Sigmoid | $\sigma(x) = \frac{1}{1+e^{-x}}$ | 출력 0~1, 기울기 소실 문제 |
| ReLU | $\max(0, x)$ | 학습 빠름, 가장 많이 사용 |
| Softmax | $\frac{e^{x_i}}{\sum e^{x_j}}$ | 다중 분류 출력층 |

## 역전파 (Backpropagation)

1. **순전파**: 입력 → 출력 계산
2. **손실 계산**: 예측값과 실제값 비교
3. **역전파**: 체인룰로 각 가중치의 기울기 계산
4. **가중치 업데이트**: 기울기 방향으로 조금씩 이동

## PyTorch 예시

```python
import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 10)
        self.relu = nn.ReLU()
    
    def forward(self, x):
        x = self.relu(self.fc1(x))
        return self.fc2(x)

model = SimpleNet()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
```
