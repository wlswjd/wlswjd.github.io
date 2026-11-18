---
title: "Data Centric AI: 데이터 중심 인공지능의 패러다임 전환"
date: "2025-05-10"
description: "모델 중심에서 데이터 중심으로의 AI 패러다임 전환을 설명하며, 데이터 품질 관리가 모델 성능에 미치는 결정적 영향을 다룹니다."
tags: ["Data Centric AI", "MLOps", "Data Quality"]
---

##  TL;DR

- Model Centric AI가 모델 개선에 집중했다면, Data Centric AI는 고품질 소량 데이터로 성능 향상에 집중함.
- 전체 AI 프로젝트의 80%가 데이터 관련 작업으로, 데이터 품질이 모델 성능에 결정적 영향.
- MLOps에서 데이터 품질 관리와 자동화가 핵심 경쟁력으로 부상함.
- 미래 트렌드는 Multilingual, Multimodal, Synthetic Data임.

##  AI 패러다임의 전환: Model vs Data

AI 시스템의 성능은 다음 수식으로 표현될 수 있음.
$$ 	ext{AI System} = 	ext{Code (Model)} + 	ext{Data} $$

과거의 **Model-Centric AI**는 "데이터는 고정(Fixed)하고, 코드를 개선하여 성능을 높이자"는 접근법이었음. 연구자들은 SOTA(State-of-the-art) 모델 아키텍처를 개발하는 데 몰두했음.

하지만 Andrew Ng 교수가 주창한 **Data-Centric AI**는 정반대의 접근을 취함. "코드는 고정하고, 데이터를 개선하여 성능을 높이자"는 것임. 실제로 산업 현장에서는 모델의 하이퍼파라미터를 튜닝하는 것보다, 노이즈가 낀 데이터 50개를 수정하는 것이 성능 향상에 훨씬 큰 기여를 함.

##  왜 지금 Data Centric인가?

1.  **모델의 상향 평준화**: 이제 누구나 HuggingFace에서 고성능 모델(BERT, ResNet, YOLO 등)을 가져다 쓸 수 있음. 모델 자체만으로는 차별화가 어려움.
2.  **Small Data 문제**: 제조, 의료 등 특수 도메인에서는 Big Data를 구하기 어려움. 소량의 데이터로 고성능을 내려면 데이터의 질(Quality)이 압도적으로 중요함.
3.  **Real-world Noise**: 학계의 Benchmark 데이터셋(MNIST, ImageNet)과 달리, 현실 데이터는 라벨 오류, 결측치, 중복이 가득함. 이를 정제하는 것이 엔지니어링의 핵심임.

##  Data Centric AI의 핵심 기술

*   **Label Consistency (라벨 일관성)**: 여러 라벨러가 동일한 기준(Instruction)으로 라벨링했는지 검증함. "착한 개"와 "나쁜 개"의 기준이 모호하다면 모델은 결코 수렴하지 않음.
*   **Active Learning (능동 학습)**: 모델이 헷갈려하는(Uncertainty가 높은) 데이터만 골라내어 사람이 검수함. 라벨링 비용을 획기적으로 줄일 수 있음.
*   **Synthetic Data (합성 데이터)**: GAN이나 Diffusion 모델을 이용해 부족한 클래스의 데이터를 인공적으로 생성함.

결론적으로, Data Centric AI는 "더 많은 데이터"가 아닌 **"더 똑똑한 데이터"**를 추구하며, AI 프로젝트 성공의 핵심 열쇠가 되고 있음.
