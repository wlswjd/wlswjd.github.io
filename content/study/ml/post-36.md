---
title: "Data-Centric AI: 고품질 데이터 구축을 위한 실무 가이드"
date: "2025-05-15"
description: "AI 프로젝트의 80%를 차지하는 데이터 구축 프로세스를 6단계로 나누어 설명하고, 실무적인 가이드를 제공함."
tags: ["Data Collection", "Labeling", "Preprocessing"]
---

##  TL;DR

- 실제 AI 프로젝트에서 데이터 관련 작업이 전체의 80%를 차지하므로 체계적 접근이 필수임.
- 원시 데이터(Raw Data) → 원천 데이터(Source Data) → 라벨링 데이터(Labeled Data) 로 점진적 품질 향상이 핵심임.
- 데이터 구축 프로세스는 수집-전처리-라벨링-클렌징-스플릿-릴리즈의 6단계로 구성됨.

##  데이터 구축 파이프라인의 6단계 상세 가이드

### 1. 데이터 수집 (Data Collection)
목적에 맞는 **원시 데이터(Raw Data)**를 획득하는 단계임.
- **Checklist**: 저작권(Copyright) 문제, 개인정보(PII) 포함 여부, 데이터의 다양성(Diversity) 확보.
- **Tip**: 초기 단계부터 '엣지 케이스(Edge Case)'를 고려하지 않으면 나중에 재수집 비용이 큼.

### 2. 데이터 전처리 (Data Preprocessing)
수집된 Raw Data를 기계가 읽을 수 있는 **원천 데이터(Source Data)**로 변환함.
- **작업**: 비식별화(De-identification), 포맷 통일(JSON/CSV), 중복 제거(Deduplication).
- **중요**: 이 단계에서 데이터 스키마(Schema)를 확정해야 후속 작업이 꼬이지 않음.

### 3. 데이터 라벨링 (Data Labeling)
정답(Ground Truth)을 부여하여 **라벨링 데이터(Labeled Data)**를 생성함.
- **가이드라인**: 작업자 간 주관적 해석을 배제하기 위해 매우 구체적인 가이드라인(Edge case 포함)이 필요함.
- **도구**: Label Studio, CVAT 등 라벨링 툴 활용.

### 4. 데이터 클렌징 (Data Cleansing) & 검수
라벨링된 데이터의 품질을 검수하고 오류를 정제함.
- **교차 검수(Cross-Check)**: 라벨러 A의 작업물을 라벨러 B가 검수.
- **자동화 검수**: 규칙 기반(Rule-based) 스크립트로 1차 필터링 (예: Bounding Box가 이미지 밖으로 나갔는지 확인).

### 5. 데이터 스플릿 (Data Split)
학습(Train), 검증(Validation), 테스트(Test) 셋으로 분할함.
- **Stratified Split**: 클래스 비율을 유지하며 나누는 것이 중요함.
- **Leakage 방지**: 시계열 데이터나 동일 유저 데이터가 Train/Test에 섞이지 않도록 주의해야 함.

### 6. 데이터 릴리즈 (Data Release)
완성된 데이터셋을 배포하고 버전을 관리함 (Versioning).
- **DVC(Data Version Control)** 같은 도구를 사용하여 데이터의 변경 이력을 코드처럼 관리하는 것이 MLOps의 정석임.

##  실무 적용 Insight

데이터 구축은 단순 반복 작업(노가다)이 아님. 모델의 성능 상한선(Upper Bound)을 결정하는 고도의 엔지니어링 과정임. 특히 **IAA(Inter Annotator Agreement)** 지표를 통해 라벨링 품질을 정량적으로 관리하는 것이 프로젝트 성공의 지름길임.
