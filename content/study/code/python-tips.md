---
title: "Python 실무 팁 모음"
date: "2024-11-15"
description: "자주 쓰는 Python 패턴과 유용한 팁들을 정리했습니다."
tags: ["Python", "Tips", "코딩"]
---

## List Comprehension

```python
# 기본
squares = [x**2 for x in range(10)]

# 조건부
evens = [x for x in range(20) if x % 2 == 0]

# 중첩
matrix = [[i*j for j in range(1, 4)] for i in range(1, 4)]
```

## 데코레이터 패턴

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()
        print(f"{func.__name__} 실행 시간: {end - start:.4f}초")
        return result
    return wrapper

@timer
def heavy_computation():
    return sum(range(1_000_000))
```

## 자주 쓰는 내장 함수들

```python
data = [3, 1, 4, 1, 5, 9, 2, 6]

# 정렬 (원본 유지)
sorted_data = sorted(data, reverse=True)

# enumerate로 인덱스 함께 순회
for i, val in enumerate(data):
    print(f"{i}: {val}")

# zip으로 여러 리스트 동시 순회
names = ["Alice", "Bob", "Charlie"]
scores = [90, 85, 92]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
```

## defaultdict 활용

```python
from collections import defaultdict

# 단어 빈도 계산
text = "apple banana apple cherry banana apple"
freq = defaultdict(int)
for word in text.split():
    freq[word] += 1

# 그룹핑
groups = defaultdict(list)
for name, dept in [("Alice", "ML"), ("Bob", "DL"), ("Carol", "ML")]:
    groups[dept].append(name)
```

## 타입 힌트

```python
from typing import Optional, Union

def process(
    data: list[int],
    threshold: float = 0.5,
    label: Optional[str] = None
) -> dict[str, Union[int, float]]:
    return {"count": len(data), "mean": sum(data) / len(data)}
```
