// {
//     id: 9,  // (중요) 기존 숫자와 겹치지 않게 1씩 늘려주세요
//     category: 'ml',  // papers, ml, dl, projects 중 하나 선택
//     title: '여기에 제목을 적으세요',
//     date: 'Dec 5, 2025',
//     tech: 'Python, TensorFlow',
//     summary: '목록에 보여질 짧은 한 줄 요약입니다.',
//     content: `
// 여기에 본문 내용을 적습니다.
// # 제목
// - 리스트
//     `
// },

// {
//     id: 14,                                     // 글 고유 번호 (기존 번호와 겹치지 않게 1씩 증가)
//     category: 'ml',                             // 카테고리 (ml, dl, code, papers, projects 등)
//     title: '새로운 글 제목',                      // 글 제목
//     date: '2025. 12. 06',                       // 작성 날짜
//     tech: 'Python, TensorFlow',                 // 사용 기술 태그
//     summary: '목록에서 보여질 한 줄 요약',          // 요약문
//     content: `
// ### 여기부터 마크다운으로 작성하세요

// 그냥 글을 쓰면 문단이 됩니다.
// 엔터 두 번 치면 문단이 나뉩니다.

// - 이렇게 리스트도 쓸 수 있고
// - **굵은 글씨**도 가능합니다.

// > 인용구는 이렇게 씁니다.
//     `
// }

// 1. 파일 저장: 프로젝트 폴더 내 assets 폴더(또는 images 등 원하는 곳)에 이미지 파일을 넣으세요. (예 : my-photo.jpg)
// 2. 본문에 삽입: 글 내용(content) 안에 마크다운 문법이나 HTML 태그로 이미지 경로를 적습니다
// (추천) : ![사진 설명](assets/my-photo.jpg)
// 이렇게 하면 글 중간에 사진이 예쁘게 들어갑니다. 경로는 항상 프로젝트 최상위 폴더 기준으로 적어주시면 됩니다. (예: assets/파일이름)

const posts = [
    {
        id: 14,
        category: 'papers',
        title: '[논문 리뷰] Word2Vec: Efficient Estimation of Word Representations in Vector Space',
        date: 'Jan 14, 2026',
        tech: 'NLP, Deep Learning, Word2Vec, Numpy',
        summary: '채널십오야 댓글 분석을 위한 첫걸음. 방대한 텍스트 데이터를 효율적으로 벡터화하는 CBOW와 Skip-gram 모델의 수학적 원리와 학습 최적화 기법(Negative Sampling) 분석.',
        content: `
### 1. Overview (연구 배경)

진행 중인 **'채널십오야 유튜브 데이터 분석 프로젝트'**에서 댓글의 의미를 파악하기 위해서는 텍스트를 기계가 이해할 수 있는 숫자(Vector)로 변환하는 과정이 필수적이다.

기존의 One-hot Encoding 방식은 단어 간의 유의미한 관계(Semantic Relationship)를 담지 못하고 차원이 너무 커지는 문제가 있다. 이에 따라 분산 표현(Distributed Representation)의 시초이자, 효율적인 연산량을 자랑하는 **Word2Vec (Mikolov et al., 2013)** 논문을 선정하여 분석하고 구현 목표를 수립했다.

### 2. Problems & Solutions (문제와 해결)

**기존 NNLM(Neural Network Language Model)의 한계:**
기존 언어 모델은 단어 예측을 위해 비선형적인 Hidden Layer(Tanh, Sigmoid 등)를 포함한 복잡한 연산을 수행했다.

- **Computational Complexity:** $Q = N \\times D + N \\times D \\times H + H \\times V$
- $N$(입력 개수), $D$(차원), $H$(은닉층), $V$(단어 수)가 모두 곱해지는 구조로, 데이터가 늘어날수록 학습 시간이 기하급수적으로 증가한다.

**Word2Vec의 제안:**
"단어 표현의 정교함은 유지하되, 복잡한 비선형 Hidden Layer를 제거하자."
단순한 행렬 곱(Log-linear model)만으로도 충분히 훌륭한 벡터를 얻을 수 있음을 증명하며, 계산 비용을 획기적으로 낮췄다.

### 3. Methodology (핵심 모델 구조)

논문은 두 가지 아키텍처를 제안한다.

![CBOW vs Skip-gram Architecture](assets/CBOW_and_SKIPGRAM.png)
*Figure 1. The architecture of CBOW and Skip-gram*

#### (1) CBOW (Continuous Bag-of-Words)
- **개념:** 주변 단어들(Context)의 벡터를 평균(Average)내어 중심 단어(Target)를 예측한다.
- **특징:** 문맥을 뭉뚱그려(Smoothing) 처리하므로 학습이 빠르지만, 드물게 등장하는 단어에 대한 예측력은 다소 떨어진다.

#### (2) Skip-gram (Selected for Project)
- **개념:** 중심 단어(Target) 하나를 입력으로 받아, 주변에 올 수 있는 문맥 단어들(Context)을 역으로 예측한다.
- **Why Skip-gram?**
    - 내 프로젝트인 유튜브 댓글 데이터는 구어체와 신조어가 많고 데이터의 절대량이 아주 방대하지 않다.
    - 논문에 따르면 **Skip-gram은 소량의 데이터에서도 희귀 단어를 잘 찾아내며**, 중심 단어 하나로 여러 개의 학습 쌍(Pair)을 만들어내므로(Data Augmentation 효과) 내 프로젝트에 더 적합하다고 판단했다.

### 4. Mathematical Derivation (수식 유도 및 최적화)

단순히 라이브러리를 쓰는 것이 아니라 **Numpy로 밑바닥 구현**을 하기 위해 핵심 수식을 정리했다.

#### (1) Objective Function
Skip-gram의 목표는 주어진 중심 단어 $w_t$에 대해 주변 단어 $w_{t+j}$가 등장할 확률(Likelihood)을 최대화하는 것이다.

$$ \\frac{1}{T} \\sum_{t=1}^{T} \\sum_{-c \\le j \\le c, j \\ne 0} \\log p(w_{t+j} | w_t) $$

#### (2) The Softmax Problem & Negative Sampling
원래 확률 $p$를 구하려면 Softmax를 써야 한다.

$$ p(w_O|w_I) = \\frac{\\exp({v'_{w_O}}^\\top v_{w_I})}{\\sum_{w=1}^{V} \\exp({v'_w}^\\top v_{w_I})} $$

하지만 분모($\\sum$)를 구하기 위해 100만 개($V$) 단어를 다 계산하는 것은 불가능하다. 이를 해결하기 위해 **Negative Sampling**을 도입한다. 전체 단어를 다 보는 대신, **'정답 단어 1개'와 '오답(Noise) 단어 K개'**만을 비교하여 이진 분류 문제로 바꾼다.

**[Implementation Formula]**
내일 구현할 최종 Loss Function은 다음과 같다:

$$ J(\\theta) = - \\log \\sigma({u_{target}}^T \\cdot v_{center}) - \\sum_{k=1}^{K} \\log \\sigma(- {u_{neg_k}}^T \\cdot v_{center}) $$

* 정답과는 내적값을 키우고(Log-Likelihood 증가), 오답과는 내적값을 줄이는(Minimize) 원리다.

### 5. Conclusion & Next Step

- **Insight:** Word2Vec은 단순한 카운팅이 아니라, **"비슷한 문맥에 등장하는 단어는 비슷한 의미를 가진다"**는 분포 가설을 수학적으로 가장 효율적으로 구현한 모델이다. 특히 'Syntactic(구문적)' 관계까지 벡터 연산으로 풀린다는 점이 인상적이다.
- **Next Step:** 이론 학습은 끝났다. 다음 포스팅에서는 위에서 유도한 Negative Sampling Loss 수식을 **Python Numpy로 직접 구현**하여, 실제 댓글 데이터가 벡터 공간에서 어떻게 군집화되는지 시각화해 볼 것이다.

---
*Reference: [Efficient Estimation of Word Representations in Vector Space (Mikolov et al., 2013)](https://arxiv.org/abs/1301.3781)*
        `
    },
    {
        id: 9,
        category: 'ml',
        title: '서울시 부동산 가격 예측 프로젝트 회고 with 머신러닝',
        date: '2025',
        tech: 'Python, Scikit-learn, XGBoost, Pandas',
        summary: '머신러닝을 활용하여 서울시 부동산 실거래가를 예측하는 모델을 구축하고 성능을 최적화한 프로젝트 회고입니다.',
        content: `
### 1. Project Overview (프로젝트 개요)

서울시 아파트 실거래가 데이터를 활용하여 가격을 예측하는 회귀 모델을 구축했습니다. 부동산 시장의 불확실성을 줄이고 합리적인 가격 기준을 제시하는 것을 목표로 했습니다.

### 2. Data & Preprocessing (데이터 및 전처리)

- **데이터셋:** 서울시 부동산 실거래가 데이터 (국토교통부 / 공공데이터포털)
- **전처리:** 
    - 결측치 처리 (평균값 대체 및 삭제)
    - 이상치 제거 (IQR 방식 활용)
    - 범주형 변수 인코딩 (One-Hot Encoding)

### 3. Modeling (모델링)

다양한 회귀 모델을 비교 실험했습니다.

- Linear Regression
- Random Forest Regressor
- XGBoost / LightGBM

최종적으로 **XGBoost** 모델이 가장 우수한 성능(RMSE 기준)을 보여 선정했습니다.

### 4. Result & Retrospective (결과 및 회고)

- **성과:** 베이스라인 대비 RMSE를 약 15% 개선했습니다.
- **배운 점:** 파생 변수(예: 지하철역과의 거리, 학군 등) 생성의 중요성을 체감했습니다. 데이터 전처리가 모델 성능에 미치는 영향이 모델 튜닝보다 큼을 확인했습니다.

---
*(여기에 Velog의 상세한 내용을 복사해서 붙여넣으시면 됩니다.)*
        `
    },
    {
        id: 10,
        category: 'ml',
        title: '데이터 분류 및 전처리 실습: 부동산 집값 예측 대회 준비',
        date: '2025', 
        tech: 'Python, Pandas, Matplotlib, Seaborn',
        summary: '부동산 가격 예측 대회를 위해 데이터를 탐색적 데이터 분석(EDA)하고 전처리하는 과정을 정리했습니다.',
        content: `
### 1. EDA (탐색적 데이터 분석)

데이터의 분포와 변수 간의 상관관계를 분석했습니다.

- Target 변수(가격)의 분포 확인 (Log 변환 필요성 확인)
- 주요 변수(면적, 연식)와 가격의 산점도 시각화

### 2. Feature Engineering (특성 공학)

기존 변수를 조합하여 새로운 의미를 도출했습니다.

- **건물 노후도:** 현재 연도 - 준공 연도
- **단지 규모:** 세대수 구간화

### 3. Insights (인사이트)

단순히 데이터를 넣는 것보다, 도메인 지식을 활용하여 불필요한 변수를 제거했을 때 모델의 안정성이 높아짐을 확인했습니다.

---
*(여기에 Velog의 상세한 코드나 그래프 설명을 추가하세요.)*
        `
    },
    {
        id: 1,
        category: 'ml',
        title: '데이터 온톨로지: 지식을 구조화하는 방법',
        date: 'Nov 6, 2025',
        tech: 'rdflib, owlready2, networkx',
        summary: '데이터 온톨로지(Data Ontology)는 특정 도메인의 개념과 그 관계를 형식적으로 정의한 지식 표현 체계다...',
        content: `
데이터 온톨로지는 지식을 구조화하는 핵심 기술입니다.

RDF, OWL 등을 사용하여 그래프 형태로 지식을 연결합니다.

주요 개념: Class, Property, Individual...
        `
    },
    {
        id: 2,
        category: 'code',
        title: 'Alembic으로 시작하는 데이터베이스 마이그레이션',
        date: 'Oct 25, 2025',
        tech: 'Python 3.12+, SQLAlchemy, Alembic',
        summary: 'TL;DR Alembic은 SQLAlchemy 기반의 데이터베이스 마이그레이션 도구입니다. 스키마 변경을 버전 관리하듯이...',
        content: `
데이터베이스 스키마 변경을 Git처럼 관리하고 싶다면 Alembic이 정답입니다.
        `
    },
    {
        id: 3,
        category: 'dl',
        title: 'PostgreSQL: 오픈소스 데이터베이스의 강자',
        date: 'Oct 17, 2025',
        tech: 'Docker, PostgreSQL 16.0',
        summary: 'PostgreSQL은 강력한 오픈소스 객체-관계형 데이터베이스 시스템(ORDBMS)입니다...',
        content: `
PostgreSQL은 단순한 RDBMS를 넘어 강력한 확장성과 기능을 제공합니다.
        `
    },
    {
        id: 4,
        category: 'projects',
        title: '나만의 포트폴리오 사이트 만들기',
        date: 'Dec 4, 2025',
        tech: 'HTML, CSS, JS, 98.css',
        summary: '윈도우 98 감성을 살린 포트폴리오 사이트 제작기.',
        content: `
98.css 라이브러리를 활용하여 레트로한 느낌의 포트폴리오를 만들었습니다.
        `
    },
    {
        id: 11,
        category: 'competition',
        title: '데이터 경진대회 참여 회고',
        date: '2024',
        tech: 'Python, XGBoost, Optuna',
        summary: '부동산 실거래가 예측 경진대회에서 모델을 고도화하며 얻은 인사이트를 정리했습니다.',
        content: `
대회 참가 배경과 목표를 소개하고, 데이터 분석 및 모델링 전략, 리더보드 성과 등을 순서대로 정리했습니다.

하이퍼파라미터 튜닝은 Optuna로 자동화했고, 교차검증 전략을 바꿨을 때 점수가 상승했던 경험을 기록했습니다.
        `
    },
    {
        id: 12,
        category: 'contest',
        title: 'AI 공모전 프로젝트',
        date: '2024',
        tech: 'Python, FastAPI, React',
        summary: '대국민 공모전에서 제출한 AI 기반 서비스 기획 및 구현 내용을 정리했습니다.',
        content: `
사용자 시나리오, 시스템 구성도, 백엔드/프론트엔드 구현 스택, 시연 데모 영상을 포함한 제출 과정을 회고했습니다.
        `
    },
    {
        id: 13,
        category: 'sidepr',
        title: '사이드 프로젝트: 포트폴리오 사이트 고도화',
        date: '2025',
        tech: 'HTML, CSS, JavaScript, 98.css',
        summary: '윈도우 98 감성의 포트폴리오 사이트를 기획·구현하며 얻은 경험을 정리했습니다.',
        content: `
디자인 콘셉트, 기능 요구사항, 98.css 커스터마이징, 게임/터미널 탭 추가 등의 과정을 기록했습니다.
        `
    }
];
