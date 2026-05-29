---
title: "[알고리즘] Day 1 — 배열·리스트의 효율적 조작과 카운팅"
date: "2026-05-29"
description: "파이썬 리스트의 내부 구조, 빈도 카운팅, 집합 자료구조를 활용한 효율적인 알고리즘 문제 해결 방법과 자주 하는 실수 정리."
tags: ["Algorithm", "Python", "Data Structure", "List", "Set", "Hash"]
---

## 1. 학습 목표

- 파이썬 리스트의 내부 구조와 연산별 시간복잡도를 정확히 이해한다
- 카운팅이 필요한 상황에서 자료구조를 의도적으로 선택할 수 있다
- 정렬 + 인접 비교 패턴을 이해한다
- 같은 로직을 Pythonic하게 작성할 수 있다
- 집합(set) 자료구조를 활용해 멤버십 검사와 집합 연산을 수행할 수 있다

---

### 1. 파이썬 `list`의 본질

#### 내부 구조

CPython의 `list`는 내부적으로 **동적 배열(dynamic array)**이다. C 배열과 약간의 여유 공간으로 구성되어 있고, 메모리상에 연속적으로 배치된다.

- 인덱스 접근은 주소 계산 한 번이면 끝나므로 **O(1)**이다.
- `append` 시 여유 공간이 차면 약 1.125배 크기로 재할당 및 복사가 일어난다. 평균적으로는 **O(1) amortized**이다.

#### 연산별 시간복잡도

| 연산 | 복잡도 | 비고 |
|---|---|---|
| `lst[i]` | O(1) | 인덱싱 |
| `lst[i] = x` | O(1) | 할당 |
| `lst.append(x)` | O(1) amortized | 가끔 재할당 |
| `lst.pop()` | O(1) | 맨 뒤 제거 |
| `lst.pop(0)` | **O(N)** | 함정 |
| `lst.insert(0, x)` | **O(N)** | 함정 |
| `x in lst` | **O(N)** | 선형 탐색 |
| `lst[a:b]` | O(b-a) | 새 리스트 생성 |
| `len(lst)` | O(1) | |
| `lst.sort()` | O(N log N) | Timsort |

#### 자주 하는 실수

**큐가 필요할 때 `list.pop(0)`은 절대 쓰지 말아야 한다.**

```python
# 잘못된 코드 — 매번 O(N)이 소요되어 전체 O(N²)이 됨
queue = []
queue.append(x)
queue.pop(0)

# 올바른 코드 — 양쪽 끝 모두 O(1)
from collections import deque
queue = deque()
queue.append(x)
queue.popleft()
```

**반복문 안에서 list 멤버십 검사도 피해야 한다.**

```python
# 잘못된 코드 — 매번 O(N)이 소요되어 전체 O(N²)
seen = []
for x in arr:
    if x in seen:
        pass
    seen.append(x)

# 올바른 코드 — O(1) 탐색으로 전체 O(N)
seen = set()
for x in arr:
    if x in seen:
        pass
    seen.add(x)
```

---

### 2. 카운팅 사고법

원소의 등장 횟수를 세는 방식은 크게 3가지가 있다.

```python
# (1) 인덱스 카운팅 — 값 범위가 작은 정수일 때 최선
cnt = [0] * (MAX + 1)
for x in arr:
    cnt[x] += 1

# (2) dict — 값 범위가 크거나 문자열·튜플일 때
cnt = {}
for x in arr:
    cnt[x] = cnt.get(x, 0) + 1

# (3) Counter — 가장 Pythonic하고 부가 메서드가 풍부함
from collections import Counter
cnt = Counter(arr)
```

복잡도는 셋 다 O(N)이지만, 상수 시간 측면에서는 **(1)이 가장 빠르다.**

**카운팅이 필요한지 알아채는 신호**
문제에 다음과 같은 키워드가 나오면 카운팅을 먼저 떠올려야 한다.
- "가장 많이/적게 등장한"
- "K번 이상 등장한"
- "중복된", "유일한"
- "두 배열에 공통으로 있는"

---

### 3. 정렬 + 인접 비교 패턴

"가장 가까운 두 수", "연속된 수의 길이", "중복 카운팅" 같은 문제는 **정렬 후 인접한 원소만 비교**하면 쉽게 풀린다. **O(N²) → O(N log N)**으로 단축할 수 있다.

```python
arr.sort()
for i in range(1, len(arr)):
    diff = arr[i] - arr[i-1]
```

핵심은 "전체 쌍을 다 보지 않아도 되는 이유"를 파악하는 것이다. 정렬했기 때문에 멀리 떨어진 원소 쌍은 더 큰 차이를 가질 수밖에 없다.

---

### 4. 집합 자료구조 (`set`)

#### 기본 사용법

```python
s1 = {1, 2, 3}              # 리터럴
s2 = set([1, 2, 2, 3, 3])   # 리스트에서 변환 → {1, 2, 3} (중복 자동 제거)
s3 = set()                  # 빈 집합. {}는 빈 dict이므로 주의

s1.add(4)
s1.remove(2)                # 없으면 KeyError
s1.discard(99)              # 없어도 에러 없음

3 in s1                     # True/False, O(1)
```

#### 집합 연산

```python
A = {1, 2, 3, 4}
B = {3, 4, 5, 6}

A & B   # 교집합 → {3, 4}
A | B   # 합집합 → {1, 2, 3, 4, 5, 6}
A - B   # 차집합 → {1, 2}
A ^ B   # 대칭차 → {1, 2, 5, 6}
```

#### 주의점: 순서를 보장하지 않는다

`set`은 **순서가 없다.** 출력할 때 오름차순이 필요하면 반드시 `sorted()`를 거쳐야 한다.

```python
result = sorted(A & B)   # 정렬된 list로 변환됨
print(*result)
```

작은 양의 정수만 들어있을 때 우연히 정렬된 것처럼 보이지만, 이는 CPython 구현의 부수적 효과일 뿐 **언어가 보장하는 동작이 아니다.**

---

### 5. Pythonic 작성법과 유용한 라이브러리

#### Pythonic 패턴

```python
# 합계와 조건 만족 개수
total = sum(arr)
positive_count = sum(1 for x in arr if x > 0)

# 인덱스와 함께 순회
for i, x in enumerate(arr):
    pass

# 두 시퀀스 동시 순회
for a, b in zip(arr1, arr2):
    pass

# key 함수로 max/min 추출
most_common = max(cnt, key=cnt.get)

# 리스트 컴프리헨션
squared = [x*x for x in arr if x > 0]
```

#### `collections.Counter`

빈도 카운팅 전용 자료구조로, `dict`의 자식 클래스다.

```python
from collections import Counter

arr = [3, 1, 3, 2, 3, 1, 1]
cnt = Counter(arr)

cnt              # Counter({3: 3, 1: 3, 2: 1})
cnt[99]          # 0 (없는 키를 조회해도 KeyError가 아님)
cnt.most_common(2)  # [(3, 3), (1, 3)]
```

**주의**: `most_common()`은 동점일 때 입력 순서를 따른다. "값이 작은 것 우선" 같은 조건은 직접 처리해야 한다.

#### 유용한 문법

- **`*` (unpacking 연산자)**: 함수 호출 시 컨테이너의 원소들을 개별 인자로 풀어준다. `print(*[3, 5, 7])`은 `print(3, 5, 7)`과 같다.
- **`' '.join(map(str, ...))`**: 리스트의 원소들을 공백 구분 문자열로 만드는 패턴이다. `join`은 문자열 iterable에만 동작하므로 `map(str, ...)` 변환이 필수다.
- **`lambda` + `sorted(key=...)`**: 정렬 기준을 임의로 지정한다. `sorted(cnt.items(), key=lambda x: (-x[1], x[0]))`처럼 튜플을 반환하면 다중 조건 정렬(빈도 내림차순, 값 오름차순)이 가능하다.

---

### 6. 실전 문제 풀이 및 자주 하는 실수

#### 문제 1: 가장 빈도가 높은 숫자의 합

**문제 요약**: 배열에서 가장 많이 등장한 숫자를 찾고, 동점이면 작은 값을 선택해 그 값의 모든 등장값의 합을 출력한다.

```python
from collections import Counter

n = int(input())
arr = list(map(int, input().split()))

cnt = Counter(arr)
max_freq = max(cnt.values())
candidates = [v for v, f in cnt.items() if f == max_freq]
answer = min(candidates) * max_freq
print(answer)
```

**사고 흐름 및 복잡도**:
- 빈도수 계산(`Counter`) → 최대 빈도 추출 → 해당 빈도를 가진 값 필터링 → 최솟값 × 빈도수
- 시간 O(N), 공간 O(N)

**막혔던 부분**:
- `dict.items()` 순회 시 튜플 구조를 헷갈리거나, 계산만 하고 변수에 저장하지 않는 실수를 주의해야 한다.

#### 문제 2: 두 배열의 공통 원소

**문제 요약**: 두 배열의 공통 원소를 오름차순으로 출력하고, 없으면 `NONE`을 출력한다.

```python
n, m = map(int, input().split())
A = set(map(int, input().split()))
B = set(map(int, input().split()))

result = sorted(A & B)
print('NONE' if not result else ' '.join(map(str, result)))
```

**사고 흐름 및 복잡도**:
- 양쪽 모두 등장 → `set` 교집합(`&`) 연산 → 오름차순 정렬(`sorted`)
- 시간 O(N + M + K log K), 공간 O(N + M)

**막혔던 부분**:
- `set`이 자동으로 오름차순 정렬된다고 착각하기 쉽다. 반드시 `sorted()`를 거쳐야 한다.

#### 자주 하는 실수 정리

| 실수 | 원인 | 해결 |
|---|---|---|
| `list.pop(0)` 사용 | O(N)인 줄 모름 | `deque.popleft()` 사용 |
| 반복문 안 `x in list` | O(N²) 됨 | `set` 사용 |
| `set` 출력 순서 가정 | 보장 안 됨 | `sorted()` 명시 |
| `input("프롬프트")` | 채점기 출력 섞임 | `input()` 인자 없이 사용 |

---

### 7. 심화 개념: CPython, 해시 테이블, 멤버십

#### CPython과 언어 명세

**CPython**은 Python 언어를 C로 구현한 표준 구현체다. 언어 명세(specification)와 구현체(implementation)는 다르다. 언어 명세는 "set은 순서가 없다"고만 정의하지만, CPython은 내부 해시 테이블의 슬롯 순서대로 순회한다. 따라서 "set이 작은 정수일 때 정렬돼 보인다"는 건 CPython의 부수효과일 뿐, 언어가 보장하는 동작이 아니다.

#### 해시(hash)와 해시 테이블

**해시 함수**는 임의의 데이터를 고정 크기의 정수로 변환한다. 불변(immutable) 객체만 해시 가능하므로 `list`는 해시 불가, `tuple`은 가능하다. CPython에서는 작은 양의 정수에 대해 `hash(n) == n`이 성립한다.

**해시 테이블**은 키를 빠르게 찾기 위한 자료구조다. 키를 해시 함수로 정수로 만들고, 그 정수를 인덱스 삼아 배열에 저장해 평균 **O(1)** 검색을 가능하게 한다. 파이썬의 `dict`와 `set`이 이 구조를 사용한다.

#### 해시 슬롯과 충돌

해시 테이블 내부 배열의 각 칸을 **슬롯(slot)**이라 한다. 두 키가 같은 슬롯으로 가려 할 때 **충돌(collision)**이 발생하며, CPython은 오픈 어드레싱(open addressing)으로 다른 빈 슬롯을 찾아간다.

작은 정수 set이 정렬돼 보이는 이유는 `hash(n) % 슬롯_개수`가 순서대로 배치되기 때문이지만, 충돌이 발생하거나 큰 수, 문자열이 섞이면 순서가 완전히 깨진다.

#### 멤버십(membership) 검사 복잡도

`x in 컨테이너` 연산의 복잡도는 자료구조에 따라 다르다.

| 자료구조 | `in` 복잡도 | 원리 |
|---|---|---|
| `list`, `tuple` | **O(N)** | 처음부터 순서대로 비교 |
| `set`, `dict` | **O(1) 평균** | hash 계산 → 슬롯 찾기 → 확인 |
| `str` | O(N) | substring 검색 |

같은 데이터라도 `set`으로 바꾸면 멤버십 검사가 N배 빨라지는 이유가 바로 이 해시 테이블 구조 덕분이다.

---

### 다음 글 예고

- Day 2 — 문자열 처리
