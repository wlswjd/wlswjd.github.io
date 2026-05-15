---
title: "[사이드 프로젝트] RAG에 Re-ranking 도입과 효과 검증 — 평가 점수의 함정까지"
date: "2026-05-15"
description: "마크 RAG에 Cross-encoder Re-ranking을 붙이고 베이스라인과 비교해 효과를 수치로 검증한 기록. 그리고 “점수는 낮은데 답변은 괜찮아 보이는” 인지 부조화의 원인까지 정리."
tags: ["Side Project", "LLM Agent", "RAG", "Re-ranking", "RAGAS", "Evaluation"]
---

이전 글에서 두 RAG 프로젝트(마인크래프트 위키 RAG, 유튜브 채널 RAG)에 RAGAS 평가를 도입하고 베이스라인을 측정했다. 이번 글은 마크 RAG에 **Cross-encoder Re-ranking**을 도입해, 베이스라인과 비교해 효과를 검증한 기록이다.

그리고 평가하면서 자주 마주친 흥미로운 질문 하나도 같이 다룬다. **“점수는 낮은데 실제 답변은 괜찮아 보이는 건 왜일까?”**

---

### 1. 베이스라인의 약점

이전 글에서 측정한 마크 RAG 베이스라인은 다음과 같았다.

```
faithfulness:      0.86  (환각 거의 없음, 좋음)
answer_relevancy:  0.53  (답변이 질문에 직접 안 답함, 낮음)
context_precision: 0.61  (검색 정확도 보통)
context_recall:    0.55  (정답 검색 절반만 성공, 낮음)
```

질문별로 보면 3가지 약점 패턴이 있었다.

- **패턴 A — 데이터에 정답이 없음** (비콘, 엔드 차원 등)
- **패턴 B — 검색이 다른 페이지를 가져옴** (워든 질문에 행동 양식 청크가 검색됨)
- **패턴 C — 답변이 부분적** (검색은 OK인데 LLM이 컨텍스트의 일부만 활용)

이 중 패턴 B를 해결하기 위한 도구가 **Cross-encoder Re-ranking**이다.

---

### 2. Re-ranking이란

검색을 2단계로 쪼개는 구조다.

**[1단계] Bi-encoder 기반 Hybrid Search**

- 질문과 청크를 각각 따로 벡터화
- 빠르지만 거칠다
- 후보를 넓게 가져옴 (Top 30)

**[2단계] Cross-encoder Re-ranking**

- 질문과 청크를 함께 넣어서 직접 관련도 계산
- 느리지만 정밀하다
- Top 30 중 진짜 관련 있는 Top 5만 추림

비유하자면 1단계는 1차 서류 심사, 2단계는 면접이다. 1차에서 30명을 추리고, 면접에서 5명을 선발하는 구조.

---

### 3. 구현 — 코드는 의외로 짧다

한국어 Cross-encoder 모델로 `Dongjin-kr/ko-reranker`를 사용했다.

#### `reranker.py` (신규)

```python
from sentence_transformers import CrossEncoder

_RERANKER_MODEL = "Dongjin-kr/ko-reranker"
_model = None

def get_reranker():
    """모델 싱글톤 로드 (최초 1회만)"""
    global _model
    if _model is None:
        _model = CrossEncoder(_RERANKER_MODEL, max_length=512)
    return _model

def rerank(query: str, docs: list, top_k: int = 5) -> list:
    """Hybrid Search 결과를 Cross-encoder로 재정렬"""
    if not docs:
        return []

    model = get_reranker()
    pairs = [[query, doc.page_content] for doc in docs]
    scores = model.predict(pairs)

    ranked = sorted(zip(docs, scores), key=lambda x: x[1], reverse=True)
    return [doc for doc, score in ranked[:top_k]]
```

#### `hybrid_search.py` 수정

```python
def hybrid_search(query, vectorstore, bm25_data,
                  top_n=30, top_k=5, use_rerank=True):
    # ... 기존 Hybrid Search 로직 (Dense + BM25 + RRF) ...

    # 변경점 1: RRF 결과를 top_k가 아닌 top_n개로 변환
    rrf_docs = build_documents(sorted_ids[:top_n])

    # 변경점 2: Re-ranking 추가
    if use_rerank:
        return rerank(query, rrf_docs, top_k=top_k)
    else:
        return rrf_docs[:top_k]
```

`use_rerank` 플래그를 둔 이유는 **평가 비교** 때문이다. False로 호출하면 이전 베이스라인을 그대로 다시 측정할 수 있다.

---

### 4. 효과 측정

같은 골든셋 20개로 다시 평가했다.

| 지표 | 베이스라인 | Re-ranking 적용 후 | 변화 |
|---|---|---|---|
| Faithfulness | 0.8561 | 0.8387 | -2.0% |
| Answer Relevancy | 0.5267 | 0.5686 | **+8.0%** |
| Context Precision | 0.6122 | 0.6825 | **+11.5%** |
| Context Recall | 0.5500 | 0.5583 | +1.5% |

#### 핵심 발견

**Context Precision이 가장 크게 개선**됐다(+11.5%). 예상한 결과다. Re-ranking의 본질은 검색된 후보 중 관련 있는 것을 위로 올리는 작업이라, 정밀도(Precision)에 직접 영향을 준다.

**Answer Relevancy도 +8% 개선**됐다. 검색이 정밀해지면 LLM에게 더 좋은 컨텍스트가 들어가고, 답변도 질문에 더 직접적이 된다.

**Recall은 거의 변화 없음(+1.5%).** Re-ranking은 이미 검색된 후보 안에서 순서만 바꾸기 때문에, “전체 정답 중 검색된 비율”인 Recall에는 영향이 적다. Recall을 올리려면 다른 접근이 필요하다.

**Faithfulness는 약간 하락(-2%).** 이건 평가 노이즈일 가능성이 크다. 표본 20개로는 1개 질문이 5%씩 평균에 영향을 준다.

---

### 5. 질문별 분석 — Re-ranking이 만능은 아니다

질문별 점수 변화를 보면 흥미로운 패턴이 있다.

#### 크게 개선된 질문

```
Q10 (마법 부여대 재료):  Precision 0.00 → 1.00
Q2  (워든 위치):         Precision 0.00 → 0.50
Q1  (다이아몬드 곡괭이):  Precision 0.50 → 0.75
```

베이스라인에서 정답을 못 찾던 질문들이 크게 개선됐다. **1차 검색에서 정답이 후보(30개) 안에는 있었지만 상위로 못 올라온 경우** Re-ranking이 효과를 발휘한다.

#### 오히려 하락한 질문

```
Q4  (엔더 드래곤 보상):  Precision 1.00 → 0.33
Q9  (모루 재료):         Precision 1.00 → 0.48
```

베이스라인에서 이미 완벽했던 질문에서 점수가 떨어졌다. 이미 1순위가 정답이었는데 Re-ranker가 다른 청크를 위로 올리면서 손해가 발생한 경우다.

> **학습 포인트.** Re-ranking은 평균적으로 개선을 주지만, 모든 질문에서 좋아지는 건 아니다. 1차 검색이 이미 잘 작동하는 질문에서는 오히려 손해가 날 수도 있다. 그럼에도 평균 효과는 명확히 개선되었으므로 전체적으로 도입할 가치는 충분하다.

---

### 6. 흥미로운 질문 — 점수는 낮은데 답변은 괜찮은 이유

평가를 진행하면서 자주 마주친 인지 부조화가 있다.

> “Answer Relevancy가 0.57이라 낮아 보이는데, 실제 답변을 읽어보면 꽤 정확하고 자연스럽다. 이게 어떻게 된 일인가?”

이 현상의 원인을 정리하면 5가지다.

#### 원인 1: Faithfulness는 사실 높다 (0.84)

체감하는 답변 품질의 가장 큰 부분은 “환각이 없는가”이다. Faithfulness가 0.84면 매우 좋은 수준이고, 그래서 답변이 괜찮게 느껴진다.

#### 원인 2: Answer Relevancy의 측정 방식

RAGAS의 Answer Relevancy는 다음 절차로 측정한다.

1. LLM이 답변을 보고 “이 답변이 답할 수 있는 가능한 질문 N개”를 생성
2. 그 질문들과 원래 질문의 임베딩 유사도 평균

답이 정확해도 표현이 다르면 점수가 낮아진다.

```
원래 질문: "워든은 어디서 나타나?"
실제 답변: "워든은 깊은 어둠 생물군계의 고대 도시에서 등장합니다."

LLM이 답변에서 추출한 가능한 질문들:
- "고대 도시에 등장하는 몹은?"
- "깊은 어둠 생물군계의 특징은?"
- "워든의 출현 위치는?"

→ 원래 질문과 표현이 달라 임베딩 유사도가 0.5~0.7
```

한국어는 영어보다 표현 다양성이 커서 이 문제가 더 두드러진다.

#### 원인 3: Context Recall의 엄격한 기준

Context Recall은 **정답(ground_truth)의 모든 사실이 컨텍스트에 있어야 1.0**이다.

```
정답: "엔더 드래곤을 처치하면 경험치 12000과 드래곤 알,
       그리고 엔드 게이트가 활성화되어 엔드 시티로 이동할 수 있게 됩니다."

→ 3가지 사실:
  1. 경험치 12000
  2. 드래곤 알
  3. 엔드 게이트 활성화

→ 컨텍스트에 2가지만 있으면 Recall = 2/3 = 0.67
```

골든셋의 정답을 풍부하게 쓸수록 Recall이 낮아지는 역설이 있다.

#### 원인 4: 정답 형식과 답변 형식의 차이

골든셋의 `ground_truth`는 짧고 핵심적이고, 실제 답변은 길고 풍부하다.

```
ground_truth: "다이아몬드 곡괭이는 흑요석, 에메랄드, 네더라이트 잔해를 캘 수 있습니다."

실제 답변: "컨텍스트에 따르면 다이아몬드 곡괭이는 여러 종류의 돌, 광석,
            돌이나 광석으로 제작된 블록을 빠르게 파괴할 수 있습니다.
            구체적으로는... [긴 설명] ..."
```

답변이 더 풍부한데도 형식 차이 때문에 점수가 낮게 측정될 수 있다.

#### 원인 5: LLM-as-a-Judge의 노이즈

평가자 LLM(`gpt-4o-mini`)도 100% 정확하지 않다. 같은 답변에 대해서도 매번 약간씩 다르게 채점한다. 표본이 20개로 작으면 이 노이즈가 평균에 큰 영향을 준다.

#### 그래서 점수를 어떻게 봐야 하나

```
잘못된 해석: "0.57은 절반 수준이니 별로다"
옳은 해석:  "베이스라인 0.53 → 0.57로 8% 개선됐다"
```

평가의 가치는 **절대 기준이 아니라 상대 기준**에 있다.

- 적용 전 vs 적용 후 비교
- 어떤 질문이 약한지 파악
- 개선 방향 결정

**0.5~0.7 범위의 점수는 실무에서 꽤 괜찮은 수준이다.** RAGAS 점수가 0.9를 넘는 경우는 드물다. 사용자가 체감하는 답변 품질과 RAGAS 점수가 어긋나는 건 자연스러운 현상이고, 이걸 인지하는 것 자체가 평가에 대한 이해도가 깊어진 신호다.

---

### 7. 다음 단계

Re-ranking으로 검색 정밀도는 개선했지만, **Recall은 여전히 약점**(0.56)이다. Recall을 올리려면 다음 옵션들이 있다.

**옵션 1: 청크 크기 축소**

- 현재 마크 RAG의 청크는 800자
- `ko-sroberta` 임베딩 모델의 토큰 한계는 ~400자
- 청크 후반부가 임베딩에 반영 안 되는 문제

**옵션 2: 데이터 보강**

- 비콘, 엔드 차원 같은 누락 페이지를 위키에서 추가 크롤링
- 패턴 A 해결

**옵션 3: 쿼리 고도화 (Day 9)**

- HyDE: 가상 답변을 만들어서 그 임베딩으로 검색
- Multi-query: 질문을 여러 표현으로 변형해서 검색
- Step-back prompting: 질문을 상위 개념으로 추상화

YT RAG에도 같은 Re-ranking을 적용해 효과를 검증하는 작업이 남아 있다. YT RAG는 `video_id` 단위 집계 로직이 있어서 Re-ranking 통합 위치가 약간 다르다.

---

### 8. 회고

이번 작업의 진짜 가치는 **수치로 검증된 개선**이다.

```
"Re-ranking을 도입했더니 좀 더 좋아진 것 같다"
→ "Context Precision 11.5% 개선, Answer Relevancy 8% 개선"
```

이전에는 감으로 판단했을 변화가 이제는 데이터로 추적된다. 어떤 질문에서 개선됐고, 어떤 질문에서 손해 봤는지도 명확하다. 다음 개선 방향(Recall)도 데이터가 가리키고 있다.

평가 체계의 진짜 가치는 한 번의 측정이 아니라, **개선 작업마다 효과를 검증할 수 있다는 점**에 있다. 첫 베이스라인 측정 때는 평가의 절대적 의미를 따졌지만, 두 번째 측정에서야 비로소 그 가치가 드러난다.

---

### 부록

#### 비용

평가 1회당 OpenAI 비용 약 $0.10 (130원). 두 번 평가했으니 총 $0.20. Re-ranking 도입 효과를 수치로 측정하는 비용으로는 매우 저렴하다.

#### 속도

Cross-encoder는 느리다. CPU 환경에서 30개 후보 재정렬에 질문당 1~3초가 추가된다. 사용자 경험에 영향이 있다면 `top_n`을 30 → 20으로 줄이는 방법이 있다.

### 다음 글 예고

- YT RAG에 Re-ranking 적용 + 비교
- 청크 크기 축소로 Recall 개선 시도
- Day 9 쿼리 고도화 (HyDE, Multi-query) 적용
