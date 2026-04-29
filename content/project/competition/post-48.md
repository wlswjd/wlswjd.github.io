---
title: "[대회 회고] 문장 내 개체간 관계 추출 (Relation Extraction)"
date: "2026-02-10"
description: "문장 속 단어들의 속성과 관계를 추론하는 RE 모델 개발. Entity Marking, 계층적 모델링, 데이터 증강 등 다양한 실험을 통해 성능을 개선한 과정."
tags: ["Python", "PyTorch", "Transformers", "KLUE-RoBERTa", "R-BERT"]
---

### 1. Overview (프로젝트 개요)

문장 내에 존재하는 단어(Entity)들의 속성과 관계를 파악하여 개념을 학습하는 **관계 추출(Relation Extraction)** 모델을 개발하는 프로젝트임.
가장 먼저 EDA를 통해 데이터의 특성을 파악하고, Baseline 코드를 기반으로 다양한 가설을 검증하며 성능을 개선함.

### 2. Environment (개발 환경)

*   **Hardware**: Intel i7-13700K, NVIDIA GeForce **RTX 4070**, CUDA 12.6
*   **Library**: PyTorch 2.7.1, Transformers 4.54.1, Scikit-learn, Pandas
*   **Data**: KLUE Relation Extraction Dataset (Train/Test)

### 3. EDA & Insights (데이터 분석)

*   **Class Imbalance**: `no_relation`이 30%를 차지하며, 일부 관계는 데이터가 매우 적음(40~100개). 클래스 불균형 해결이 필수적임.
*   **Entity Analysis**: Subject는 주로 사람(PER)/조직(ORG)이지만, Object는 다양한 타입을 가짐.
*   **Sentence Length**: 평균 20단어, 최대 108단어. Max Length를 128로 설정하여 커버함.
*   **Entity Distance**: Entity 간 최대 거리가 293자에 달해, 단순 BERT로는 커버하기 어려울 수 있음을 확인함.

### 4. Experiment Strategy (실험 및 가설 검증)

#### [A] 전처리 및 모델링 전략
1.  **Entity Marking**: Subject와 Object에 태그를 부착하여 모델이 엔티티 위치를 인지하도록 도움. (성능 향상 확인)
2.  **Weighted Focal Loss**: 클래스 불균형 해소를 위해 적용했으나, 유의미한 성능 향상은 없었음.
3.  **Hierarchical Modeling (계층적 모델링)**:
    *   Stage 1: 관계 있음 vs 없음
    *   Stage 2: 세부 관계 분류
    *   결과: 오히려 성능이 하락함. 모델이 `no_relation`에 과적합되는 경향을 보임.

#### [B] Data Augmentation (데이터 증강)
*   **RMR (Random Mask Replacement)**: 엔티티 외의 단어를 마스킹하고 복원하여 증강.
*   **RMI (Random Mask Insertion)**: 임의 위치에 마스크를 삽입.
*   **Result**: RMR + RMI 조합이 가장 좋은 성능을 보임. (AEDA는 과적합 유발)

#### [C] Model Selection
*   **KoElectra**: 성능이 저조함 (토크나이저 불일치 추정).
*   **KLUE-RoBERTa-Large**: 배치 사이즈를 16으로 줄였을 때 AUPRC가 70점대로 크게 상승함.

### 5. Result & Conclusion (결과 및 회고)

*   **Final Score**: AUPRC 70.11, F1 63.00
*   **Insight**:
    *   **Entity Marking**은 확실한 성능 향상을 보장함.
    *   **계층적 모델링**은 이론적으로 좋아 보이나, 실제 구현 시 에러 전파(Error Propagation) 문제가 발생할 수 있음을 배움.
    *   Source(WikiTree, Wikipedia)별로 데이터 특성이 다르므로, 이를 고려한 **도메인 특화 앙상블**을 시도하지 못한 점이 아쉬움.
