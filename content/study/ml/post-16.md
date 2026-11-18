---
title: "추천 시스템 개요 및 기초 방법론: 추천 시스템 문제 정의"
date: "2025-09-20"
description: "추천 시스템의 정의와 목적, 그리고 핵심 문제인 Top-K 랭킹과 평점 예측을 다룹니다. LLM 시대의 새로운 패러다임도 소개함."
tags: ["Recommender System", "Personalization", "Ranking", "Rating Prediction"]
---

##  TL;DR

- 추천 시스템은 개인화를 위한 AI/ML의 핵심 분야로, 비즈니스 가치를 창출함.
- 핵심 문제는 Top-K 랭킹(암시적 피드백)과 평점 예측(명시적 피드백)으로 구분됨.
- LLM의 등장으로 모든 데이터를 자연어로 변환하는 새로운 패러다임으로 전환되고 있음.

##  추천 시스템의 본질: 개인화 (Personalization)

추천 시스템(RecSys)은 정보 과부하(Information Overload) 시대의 필터(Filter)임. 검색(Search)이 사용자가 명확한 의도(Query)를 가지고 정보를 찾는 능동적 행위라면, 추천은 사용자의 잠재적 의도를 파악해 정보를 제공하는 수동적(Passive) 행위임.

##  핵심 문제 정의 (Problem Definition)

추천 시스템이 풀어야 할 문제는 크게 두 가지로 나뉨.

### 1. Top-K 랭킹 문제 (Ranking)
사용자가 좋아할 만한 아이템 $K$개를 순서대로 나열하는 문제임.
- **데이터**: 클릭, 구매, 시청 시간 등 **암시적 피드백(Implicit Feedback)**을 주로 사용함.
- **목표**: 사용자가 실제로 소비할 확률(Probability)이 높은 순서대로 정렬함.
- **평가**: NDCG, Recall, Precision 등이 사용됨. 실무에서는 가장 중요한 태스크임.

### 2. 평점 예측 문제 (Rating Prediction)
사용자가 특정 아이템에 매길 구체적인 점수(별점)를 예측하는 문제임.
- **데이터**: 별점, 좋아요/싫어요 등 **명시적 피드백(Explicit Feedback)**을 사용함.
- **목표**: $R_{ui}$ (유저 $u$의 아이템 $i$에 대한 평점)의 오차를 최소화함.
- **평가**: RMSE, MAE. (넷플릭스 프라이즈 시절에 유행했으나, 최근에는 랭킹 문제보다 중요도가 낮아짐.)

##  패러다임의 변화: Matrix Factorization에서 LLM까지

1.  **Collaborative Filtering (CF)**: "비슷한 유저는 비슷한 아이템을 좋아한다"는 가정.
2.  **Matrix Factorization (MF)**: 유저와 아이템을 저차원 벡터로 임베딩하여 내적(Dot Product)으로 유사도를 계산함. (SVD, ALS)
3.  **Deep Learning (DL)**: 비선형적 관계를 학습하기 위해 Neural Network(NCF, Wide&Deep) 도입.
4.  **LLM-based RecSys**: 최근 트렌드. 유저의 히스토리와 아이템 설명을 모두 **자연어 프롬프트**로 변환하여 LLM에 입력함. "이 유저는 A, B를 샀어. 다음엔 뭘 살까?"라고 물어보는 식임. 이는 콜드 스타트 문제 해결과 설명 가능한 추천(Explainable RecSys)에 강력함.
