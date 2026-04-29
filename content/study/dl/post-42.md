---
title: "(AI 부트캠프 13기) 대회를 치르면서 배운 CNN 모델링"
date: "2025-07-10"
description: "문서 이미지 분류 대회를 통해 경험한 EDA, 실험 관리, 모델링의 실패와 성공 과정을 회고함."
tags: ["CNN", "Computer Vision", "PyTorch Lightning", "EDA"]
---

##  학습 목표 및 배경
문서 이미지 분류 경진대회에 참가하여, 실제 비정형 데이터(이미지)를 다루는 End-to-End 파이프라인을 구축함. 17개의 복잡한 문서 클래스를 정확히 분류하는 것이 목표였음.

##  주요 시도 및 성과

### 1. 심도 있는 EDA (Exploratory Data Analysis)
대부분의 참가자가 모델링에 급급할 때, 우리는 데이터 자체를 뜯어보는 데 집중함.
*   **Class Imbalance**: 일부 클래스 데이터가 극도로 적음을 확인하고, 이를 해결하기 위해 Focal Loss 도입 및 Oversampling 전략을 수립함.
*   **Visual Domain Gap**: Train 셋은 스캔본처럼 깨끗한 반면, Test 셋은 스마트폰으로 찍은 듯한 노이즈(기울어짐, 그림자)가 많음을 발견함.

### 2. Data Augmentation 전략
EDA 인사이트를 바탕으로 **Albumentations** 라이브러리를 활용해 실전적인 증강을 적용함.
*   `RandomRotate90`, `Perspective` 변환으로 회전된 이미지에 대응.
*   `GaussNoise`, `Blur`로 저화질 이미지에 대응.
이는 모델의 일반화 성능(Generalization)을 크게 높이는 결정적인 요인이 됨.

### 3. 실험 관리 (Experiment Tracking)
PyTorch Lightning과 WandB를 연동하여 모든 실험의 하이퍼파라미터와 결과를 기록함. 덕분에 "어떤 설정이 성능 향상에 기여했는지"를 정량적으로 추적할 수 있었음.

##  실패 분석 (Failure Analysis) 및 아쉬움
*   **Validation Set 구성 실패**: Test 셋의 분포를 반영하지 못한 Validation Set을 사용하여, 리더보드 점수와 로컬 점수의 괴리가 컸음. Stratified K-Fold 등을 더 정교하게 적용했어야 함.
*   **OCR 미활용**: 문서 분류의 특성상 텍스트 정보(OCR)가 매우 중요한 단서가 될 수 있었으나, 순수 CV 모델(EfficientNet)에만 의존한 점이 아쉬움. Multi-modal 접근이 필요했음.

##  Conclusion
"Garbage In, Garbage Out". 모델 아키텍처보다 데이터에 대한 이해와 전처리가 성능에 훨씬 큰 영향을 미친다는 진리를 다시 한번 확인함. 다음 대회에서는 데이터 중심(Data-Centric) 접근을 더 강화할 계획임.
