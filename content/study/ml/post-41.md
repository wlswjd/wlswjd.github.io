---
title: "(AI 부트캠프 13기) 딥러닝 개요와 PyTorch 맛보기"
date: "2025-06-25"
description: "부트캠프에서 학습한 딥러닝의 기초부터 심화까지, 그리고 PyTorch를 활용한 실습 경험을 정리했음."
tags: ["Deep Learning", "PyTorch", "CNN", "RNN"]
---

##  학습 내용 및 회고

### 1. 딥러닝 기초부터 심화까지
AI 부트캠프 13기 과정을 통해 퍼셉트론의 기초 원리부터 최신 딥러닝 아키텍처까지 체계적으로 학습함.
*   **Backpropagation**: 수식으로만 접했던 역전파를 계산 그래프(Computational Graph) 관점에서 이해하고, 왜 Vanishing Gradient 문제가 발생하는지, 이를 해결하기 위한 ReLU와 같은 활성화 함수가 왜 필요한지 체득함.
*   **Optimization**: 단순히 Adam을 쓰는 것을 넘어, SGD, Momentum, RMSProp의 발전 흐름을 이해하고 Learning Rate Scheduler의 중요성을 배움.

### 2. CNN & RNN 아키텍처 구현
*   **CNN**: Convolution 연산의 의미(Feature Extraction)와 Pooling(Dimension Reduction)의 역할을 이해함. ResNet의 Skip Connection이 깊은 망 학습에 미치는 영향을 직접 구현하며 확인함.
*   **RNN**: 시계열 데이터 처리를 위한 순환 구조를 배우고, Long-term dependency 문제를 해결하기 위한 LSTM/GRU의 Gating 메커니즘을 학습함.

### 3. PyTorch Lightning & MLOps
가장 큰 수확은 **PyTorch Lightning**의 도입임. 기존의 스파게티 같은 PyTorch 학습 루프(Training Loop)를 `LightningModule`로 구조화하면서, 코드가 획기적으로 깔끔해짐.
또한 **Hydra**로 복잡한 실험 설정을 관리하고, **WandB**로 실험 로그를 시각화하는 MLOps 파이프라인을 구축해봄으로써, '실험 가능한' 환경을 만드는 법을 익힘.

##  Insight

단순히 모델의 API를 호출하는 것은 누구나 할 수 있음. 중요한 것은 "왜 모델이 학습되지 않는가?"를 디버깅할 수 있는 능력임. Loss가 줄어들지 않을 때 Learning Rate를 조절하거나, 데이터의 분포를 확인하거나, 모델의 Capacity를 조절하는 등의 **문제 해결 능력**이 엔지니어의 핵심 역량임을 깨달음.
