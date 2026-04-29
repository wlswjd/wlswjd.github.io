---
title: "Kaggle Titanic 대회 참가 후기"
date: "2024-10-20"
description: "머신러닝 입문 대회 Titanic 참가 경험과 접근 방법을 공유합니다."
tags: ["Kaggle", "분류", "EDA", "Feature Engineering"]
---

## 대회 개요

- **대회**: Titanic - Machine Learning from Disaster
- **플랫폼**: Kaggle
- **목표**: 타이타닉 생존자 예측 (이진 분류)
- **최종 점수**: 0.79186 (Accuracy)

## 데이터 분석 (EDA)

### 주요 특성들
- **Survived**: 생존 여부 (0: 사망, 1: 생존) - 타겟 변수
- **Pclass**: 좌석 등급 (1, 2, 3)
- **Sex**: 성별
- **Age**: 나이
- **SibSp / Parch**: 가족 수

### 인사이트
- **여성 생존율**: 74% vs 남성 19%
- **1등석 생존율**: 63% vs 3등석 24%
- 어린이와 여성 우선 구조 정책 반영

## Feature Engineering

```python
# 가족 크기
df['FamilySize'] = df['SibSp'] + df['Parch'] + 1
df['IsAlone'] = (df['FamilySize'] == 1).astype(int)

# 나이 결측치 처리
df['Age'] = df.groupby(['Pclass', 'Sex'])['Age'].transform(
    lambda x: x.fillna(x.median())
)

# 이름에서 호칭 추출
df['Title'] = df['Name'].str.extract(r' ([A-Za-z]+)\.', expand=False)
df['Title'] = df['Title'].replace(['Lady', 'Countess', 'Don', ...], 'Rare')
```

## 최종 모델

Random Forest + 하이퍼파라미터 튜닝으로 최종 제출.

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=6,
    min_samples_split=10,
    random_state=42
)
cv_scores = cross_val_score(model, X_train, y_train, cv=5)
print(f"CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
```

## 배운 점

1. EDA의 중요성 - 데이터를 먼저 이해해야 좋은 피처를 만들 수 있다
2. 결측치 처리 전략이 성능에 큰 영향을 미침
3. Cross-validation으로 과적합 방지
