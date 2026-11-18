---
title: "[사이드 프로젝트] Minecraft RAG AI 챗봇 개발기 (4) 메타데이터 보강 · HNSW · Hybrid Search"
date: "2026-04-29"
description: "순수 Dense 검색만 쓰던 RAG에 메타데이터를 붙이고, HNSW 파라미터를 명시하고, BM25 + RRF로 Hybrid Search를 도입한 과정."
tags: ["Side Project", "LLM Agent", "RAG", "Hybrid Search", "BM25", "ChromaDB"]
---

시리즈 4편은 “검색 품질”을 끌어올리는 단계다. 기존 RAG(시리즈 1~3)는 순수 Dense 검색(`similarity_search(k=5)`)에만 의존했는데, 이번에는 **메타데이터 보강 → HNSW 파라미터 명시 → Hybrid Search 도입**까지 한 번에 정리했다.

---

### 1. 배경 및 목표

기존 RAG는 키워드 정확 매칭에 약했다. 예를 들어 “철 곡괭이 내구도 몇?” 같은 질문은 의미는 잡아도 정확한 수치가 들어 있는 청크를 잘 못 가져왔다. 그래서 RAG 학습(Day 1~6) 내용을 실제 프로젝트에 단계적으로 적용했다.

개선 계획 전체는 `CLAUDE.md`에 정리해뒀고, 이번 글에서는 그중 1~3단계를 다룬다.

- 1단계: 메타데이터 보강
- 2단계: HNSW 파라미터 명시
- 3단계: Hybrid Search 도입

---

### 2. 메타데이터 보강 (`batch_loader_full.py`)

기존 Document 메타데이터는 `{"item": ..., "type": ...}` 두 필드뿐이었다. 출처 구분이나 필터링을 하려면 부족했다. 그래서 다음 세 필드를 추가했다.

- `source`: 데이터 출처 구분 (`"official_wiki"` / `"namu_wiki"` / `"dcinside"`)
- `category`: 수집 루프의 카테고리 (예: `"도구"`, `"몹"`, `"core_system"`)
- `url`: `urllib.parse.quote`로 한국어 인코딩한 위키 페이지 URL

구현은 `get_full_item_data()` 시그니처에 `category=None`, `source="official_wiki"` 파라미터를 추가하고, `base_meta` 딕셔너리로 공통 메타데이터를 일괄 관리하는 방식이다. 단일 핵심 문서 루프는 `category="core_system"`로 고정, 카테고리 루프는 루프 변수를 그대로 전달, 정밀조합법 Document는 결과물(`output_item`)의 URL로 덮어쓰도록 했다.

다만 **기존 `chroma_db`에 저장된 데이터는 구 메타데이터 그대로**다. 신규 수집분부터만 보강된 메타데이터가 붙고, 전체 정리는 다음 단계 재인덱싱 시점에 한꺼번에 한다.

---

### 3. HNSW 파라미터 명시

LangChain Chroma의 기본값은 `hnsw:space=l2`이고, M/ef 파라미터도 암묵적으로 사용된다. `CLAUDE.md`에서 결정한 값(`cosine`, `M=16`, `construction_ef=100`, `search_ef=30`)을 코드에 명시적으로 지정했다.

- `batch_loader_full.py`의 Chroma 인스턴스 생성에 `collection_metadata` 인자 추가
- `app.py`의 `load_vectorstore()` 내부에 `hnsw_meta` 딕셔너리를 정의해 두 분기(collection_name 유무) 모두에 적용

다만 실질적 효과는 제한적이다.

- `normalize_embeddings=True` 덕분에 모든 벡터가 단위 벡터 → L2와 cosine의 랭킹 결과가 수학적으로 동일. **cosine 변경의 실질 효과는 없음.**
- `M=16`, `construction_ef=100`은 ChromaDB 기본값과 동일.
- `search_ef=30`은 기본(10)보다 높아 recall이 소폭 향상되지만, 기존 컬렉션에는 소급 적용되지 않는다.

즉, 이번 변경은 **다음 재인덱싱(청크 크기 800 → 400) 시점에 실제로 효과가 나타나도록 코드를 미리 맞춰둔** 셈이다.

---

### 4. Hybrid Search 도입 (`hybrid_search.py` 신규)

순수 Dense 검색은 키워드 정확 매칭에 약하고, BM25는 키워드는 잘 잡지만 의미를 모른다. 그래서 두 방식을 **RRF(Reciprocal Rank Fusion)**로 결합해 상호 보완하기로 했다.

`hybrid_search.py`는 다음 함수들로 구성된다.

- **`tokenize(text)`**: 한국어 공백 기반 단순 토큰화. 형태소 분석기(konlpy/Mecab) 없이 동작하도록 해서 CPU 환경 호환을 우선시했다.
- **`build_bm25_index(vectorstore, bm25_path)`**: ChromaDB 전체 청크를 한 번에 로드해 `BM25Okapi(k1=1.5, b=0.75)`로 인덱스를 만들고 pickle로 저장. 마인크래프트는 `bm25_minecraft.pkl`, 발헤임은 `bm25_valheim.pkl`로 분리한다. 데이터 추가(batch_loader 재실행) 후에는 반드시 재실행해야 인덱스가 갱신된다.
- **`load_bm25_index(bm25_path)`**: pickle에서 `(bm25, ids, documents, metadatas)` 튜플로 로드.
- **`hybrid_search(query, vectorstore, bm25_data, top_n=30, top_k=5)`**: Dense + BM25 각각 상위 `top_n`개를 뽑은 뒤 `score += 1 / (60 + rank)`로 RRF 결합 → 상위 `top_k`개를 LangChain `Document` 리스트로 반환한다.

`__main__` 블록을 두어 `python hybrid_search.py` 한 번이면 두 컬렉션의 BM25 인덱스를 모두 빌드하도록 했고, 빈 컬렉션은 자동 스킵한다.

`app.py` 쪽 변경은 조건 분기 하나가 핵심이다.

- BM25 인덱스 있음 → `_hybrid_search(user_query, vectorstore, bm25_data, top_n=30, top_k=5)`
- BM25 인덱스 없음 → 기존 `vectorstore.similarity_search(user_query, k=5)`로 폴백

스피너 문구도 `"위키 DB 검색 중..."` → `"DB 하이브리드 검색 중..."`으로 바꿨고, `rank-bm25`는 `requirements.txt`에 추가해 venv에 설치했다.

---

### 5. 현재 파일 구조 요약

| 파일 | 역할 |
|------|------|
| `batch_loader_full.py` | 공식 위키 크롤러 — 메타데이터 보강(source/category/url), HNSW 파라미터 적용 |
| `namuwiki_loader.py` | 나무위키 크롤러 — `source: "namu_wiki"` 이미 있음 (category/url 미추가) |
| `valheim_dcinside_loader.py` | 디시 갤러리 크롤러 — source/game/post_id 이미 있음 |
| `hybrid_search.py` | BM25 인덱스 빌드 + Hybrid Search 함수 모듈 |
| `app.py` | Streamlit UI — Hybrid Search 적용 완료, BM25 없으면 Dense로 폴백 |

---

### 다음 할 일

이번 단계는 사실 “재인덱싱 전에 코드를 정리해두는 작업”에 가깝다. 실제 검색 품질 향상은 다음 단계부터 본격적으로 체감될 예정이다.

- **재인덱싱**: `chroma_db` 삭제 후 청크 크기 800 → 400으로 축소해 전체 재수집. 이 시점에 HNSW 파라미터가 실제로 적용된다.
- **Re-ranking**: `reranker.py` 신규 작성 (`Dongjin-kr/ko-reranker`, Top-N=30 → Top-K=5).
- **메타데이터 일관성**: `namuwiki_loader.py`에도 `category`, `url` 보강.
