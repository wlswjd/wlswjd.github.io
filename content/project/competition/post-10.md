---
title: "문서 타입 분류 AI 모델 개발 경진대회"
date: "2025-07-14"
description: "다양한 문서 이미지를 17개 클래스로 분류하는 AI 모델 개발 경진대회 회고. CV 기반 이미지 분류 모델 활용 및 Two-Stage 전략 적용."
tags: ["Python", "PyTorch", "EfficientNet", "Albumentations"]
---

### 1. Overview (프로젝트 개요)

문서는 금융, 의료, 보험, 물류 등 다양한 도메인에서 생성되며, 그 형식이 매우 다양하고 구조적이지 않음. 이번 프로젝트의 목표는 주어진 문서 이미지를 **17개의 클래스** 중 하나로 정확하게 분류하는 모델을 개발하는 것임. (CV 08조)

### 2. Environment & Data (개발 환경 및 데이터)

*   **Hardware**: AMD Ryzen Threadripper 3960X, NVIDIA GeForce **RTX 3090**, CUDA 12.2
*   **Library**: PyTorch 2.1.0, Torchvision 0.16.0, Timm 0.9.12, Albumentations 1.3.1
*   **Data**:
    *   학습 데이터: 1,570장 (17개 클래스)
    *   테스트 데이터: 3,140장
    *   **Class List**: 계좌번호, 진단서, 운전면허증, 여권, 등기부등본 등 문서 이미지 + (자동차 계기판, 번호판 등 비문서 포함)

### 3. Key Strategy (핵심 전략)

#### [A] EDA & Preprocessing
*   **Data Imbalance**: 클래스별 데이터 불균형이 심해 Oversampling과 Focal Loss를 적용함.
*   **Label Noise**: 일부 라벨 오류를 수작업으로 정제함.
*   **Augmentation**: `Albumentations`를 활용해 회전(Rotate), 노이즈(Noise), 왜곡(Distortion) 등 17종의 Offline Augmentation을 수행하여 데이터셋을 확장함.

#### [B] Two-Stage Modeling
일부 이미지가 문서가 아닌 '자동차 계기판'이나 '번호판'인 점에 착안하여, 2단계 파이프라인을 구축함.
1.  **Binary Classifier**: 문서 vs 비문서 이진 분류 (`train_non_doc_classifier.py`)
2.  **Main Classifier**: 17개 클래스 세부 분류

#### [C] Model Selection & Ensemble
*   **EfficientNet B4**: 성능과 속도의 균형이 좋아 베이스라인으로 선정.
*   **Diverse Architectures**: ConvNeXt, CoAtNet, HRNet, Coat-Lite 등 다양한 구조를 실험함.
*   **Ensemble**:
    *   **Soft Voting**: 5-Fold 모델의 확률값 평균.
    *   **Hard Voting**: 다수결 원칙 적용.
    *   최종적으로 다양한 모델의 예측값을 결합하여 일반화 성능을 극대화함.

### 4. Result (결과)

*   **F1 Score**: **0.9522** (Leaderboard)
*   단순 모델링을 넘어, 데이터 중심(Data-Centric)의 전처리와 오프라인 증강 전략이 성능 향상의 핵심이었음.
*   WandB를 통한 체계적인 실험 관리로 최적의 하이퍼파라미터(Adam, LambdaLR/CosineAnnealing)를 찾을 수 있었음.

### 5. Retrospective (회고)
초기에는 모델 아키텍처 변경에 집중했으나, 결국 데이터 증강과 앙상블이 성능을 결정짓는다는 것을 배움. 특히 Test 데이터에 포함된 회전/뒤집기 변형에 대응하기 위한 TTA(Test Time Augmentation) 전략이 유효했음.
```python
train_transform = A.Compose([
    A.RandomRotate90(),
    A.Resize(height=img_size, width=img_size),
    A.Flip(),
    A.GaussNoise(p=0.3),
    # ...
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2(),
])
```

### 4. Modeling Strategy (모델링 전략)

#### [A] 단일 모델 실험
*   **Backbone:** EfficientNet, ConvNeXt, HRNet, CoAtNet, EfficientNet V2 등 다양한 모델 실험.
*   **Loss Function:** 클래스 불균형 해결을 위해 **Focal Loss** 적용. 혼동되는 클래스(3, 7번)에는 가중치를 1.3배 부여하여 학습 강화.
*   **Scheduler:** LambdaLR, CosineAnnealingWarmRestarts 등 적용.

#### [B] Two-Stage 모델 전략
*   **Stage 1:** 문서 vs 비문서(자동차 계기판/번호판) 분리.
*   **Stage 2:** 문서 이미지들만 대상으로 15개 클래스 세분화 분류.
*   **효과:** 시각적 차이가 큰 클래스를 먼저 걸러내어 전체 정확도 상승을 유도함.

### 5. Conclusion & Insight (회고)

단순한 이미지 분류가 아니라, 비정형 문서의 시각적 다양성을 이해하는 것이 중요했음. 단일 모델의 한계를 **Two-Stage 설계**와 **Loss 가중치 조정**으로 극복할 수 있다는 점을 경험함.

팀원들과의 적극적인 실험 공유를 통해 최적의 모델 조합을 찾았고, 결과적으로 **7위**라는 유의미한 성과를 달성함.
