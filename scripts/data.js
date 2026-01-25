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
        id: 16,
        category: 'papers',
        title: '[논문 리뷰] TLCR: Token-Level Continuous Reward for Fine-grained RLHF (ACL 2024)',
        date: 'Jul 20, 2025',
        tech: 'RLHF, PPO, Reward Modeling, NLP',
        summary: '기존 RLHF의 한계를 극복하기 위해 토큰 단위의 연속적인 보상(Continuous Reward)을 제안한 TLCR 논문 리뷰. 토큰별 세밀한 피드백으로 언어 모델 성능을 극대화함.',
        content: `
> **TLCR: Token-Level Continuous Reward for Fine-grained Reinforcement Learning from Human Feedback**
> [ACL 2024 Accepted Paper]

최근 LLM 학습의 핵심인 **RLHF(Reinforcement Learning from Human Feedback)**의 한계를 극복하고자 제안된 **TLCR** 논문을 리뷰함. 기존의 '문장 단위' 보상이 아닌 '토큰 단위'의 정밀한 보상 설계를 통해 성능을 높인 점이 인상적임.

---

### 1. Overview (연구 배경)

RLHF는 인간의 선호도를 반영하여 모델을 학습시키는 핵심 기술임. 하지만 인간의 피드백은 보통 **"이 문장 전체가 좋다/나쁘다"**라는 식의 **시퀀스 수준(Sequence-level)** 레이블링으로 이루어짐.

반면, 언어 모델은 **토큰 하나하나를 생성(Autoregressive)**하는 방식으로 작동함. 이 **세분성(Granularity)의 불일치**로 인해, 모델은 문장 내의 어떤 특정 단어가 좋고 나쁜지를 정확히 파악하기 어려움.

### 2. Problems & Solutions (문제와 해결)

**Problem 1: 시퀀스 단위 보상의 한계**
기존 방식은 문장 전체에 대해 점수를 매기기 때문에, 문맥 내의 세밀한 뉘앙스를 놓치기 쉬움. (아래 Figure 1-(a) 참조)

**Problem 2: 이산적(Discrete) 토큰 보상의 한계**
이를 해결하기 위해 토큰 단위 보상을 도입한 연구들도 있었으나, 단순히 **+1, 0, -1** 같은 이산적인 값만 사용하여 미묘한 선호도 차이를 반영하지 못함. (Figure 1-(b) 참조)

![Sequence vs Discrete vs Continuous Reward](assets/fig1a.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1-(a). Sequence-Level Reward: 문장 전체에 대한 단일 보상</em></p>

![Sequence vs Discrete vs Continuous Reward](assets/fig1b.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1-(b). Token-Level Discrete Reward: 단순한 이산적(+1/0/-1) 보상</em></p>

**Solution: TLCR (Token-Level Continuous Reward)**
본 논문은 판별자(Discriminator)의 신뢰도(Confidence)를 활용하여, 각 토큰에 대해 **-1에서 1 사이의 연속적인(Continuous) 보상**을 부여하는 방법을 제안함. (Figure 1-(c))

![Sequence vs Discrete vs Continuous Reward](assets/fig1c.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1-(c). TLCR: 토큰별로 세밀한 연속적 보상 부여</em></p>

이를 통해 모델은 어떤 토큰이 더 선호되는지 **연속적인 스펙트럼** 내에서 정교하게 학습할 수 있음.

### 3. Methodology (핵심 모델 구조)

#### [A] Token-Level Preference Labeling
먼저 GPT-4와 같은 외부 LLM을 활용해 데이터를 증강함.
1. 거절된 응답(Rejected)을 더 나은 응답(Modified)으로 수정하게 함.
2. **Levenshtein Distance(편집 거리)**를 이용해 수정 전후의 차이를 분석.
3. 삭제/수정된 토큰은 **Negative**, 새로 추가된 토큰은 **Positive**, 그대로인 토큰은 **Neutral**로 라벨링함.

#### [B] Discriminator Training
위에서 만든 라벨 데이터를 이용해 **토큰 판별자(Discriminator)**를 학습시킴.
- 긍정 토큰: 레이블 1
- 부정 토큰: 레이블 0
- 중립 토큰: **Soft Label 0.5** (편향 방지)

#### [C] Continuous Reward & PPO
학습된 판별자가 내뱉는 **예측 확률(Confidence)**을 보상으로 사용함.
- 확률값 $p$를 $[-1, 1]$ 범위로 정규화: $R = 2p - 1$
- 이 보상 값을 사용해 **PPO(Proximal Policy Optimization)** 알고리즘으로 언어 모델을 강화학습함.

### 4. Experiments (실험 및 결과)

**성능 비교:**
- **MT-Bench 점수:** 5.04점 (모든 Baseline 중 최고)
- **GPT-4 Win Rate:** 최대 84.89% 기록
- 기존 RLHF(PPOseq), DPO 등보다 일관되게 높은 성능을 보임.

**정성적 분석:**
- Discriminator가 문장 내의 **오정보(Hallucination)**나 **오타**에 대해 정확히 Negative 보상을 주는 것을 확인함. (예: 2008을 08로 잘못 쓴 경우 등)
- 긍정/부정 보상이 모두 있어야 모델이 보상 점수만 쫓는 **Reward Hacking**을 막고 안정적으로 학습됨을 입증함.

### 5. Conclusion & Insight (결론 및 배운 점)

TLCR은 토큰 단위의 정밀한 피드백을 통해 기존 RLHF의 '뭉뚱그리기' 문제를 해결한 멋진 접근법임.
특히 **GPT-4를 활용해 데이터를 증강하고 라벨링**하는 과정이 인상적이었음. 데이터가 부족한 상황에서도 고품질의 리워드 모델을 만들 수 있는 좋은 아이디어라고 생각됨.

앞으로 내 프로젝트에서도 단순히 전체 문장만 볼 것이 아니라, **중요한 키워드(토큰) 단위로 가중치를 다르게 주는 방식**을 고민해봐야겠음.

---
*Reference: [TLCR: Token-Level Continuous Reward for Fine-grained RLHF (ACL 2024)](https://arxiv.org/abs/2406.00000)*
        `
    },
    {
        id: 15,
        category: 'papers',
        title: '[논문 리뷰] CLIP-RT(2025): Learning Language-Conditioned Robotic Policies from Natural Language Supervision',
        date: 'Jun 6, 2025',
        tech: 'Robotics, VLA, CLIP, Imitation Learning',
        summary: '로봇AI 분야의 최신 논문 CLIP-RT 리뷰. 자연어를 학습 신호(Supervision)로 사용하여 로봇의 정책(Policy)을 학습하는 새로운 VLA 모델을 제안',
        content: `


최근 로봇AI에 관심이 생겨 읽게 된 논문. 2025 RSS(Robotics: Science and Systems) 학회에 억셉된 최신 연구로, 로봇을 잘 모르는 사람도 '자연어' 관점에서 흥미롭게 읽을 수 있음.

---

### 1. Overview (연구 배경)

1. **Robot Demonstration Data**: 모방학습(Imitation Learning)을 위한 데이터. 사람이 직접 시범을 보인 작업 기록.
2. **STA (Stochastic Trajectory Augmentation)**: 기존 경로(Trajectory)에 노이즈를 주거나 변형하여 데이터를 증강하는 기법.
3. **Motion Primitive**: 로봇이 수행할 수 있는 기본 동작 단위.
4. **Closed-loop Control**: 매 순간 센서(카메라 등) 정보를 확인하며 실시간으로 행동을 제어하는 방식.
5. **End-effector**: 로봇 팔의 끝부분(집게, 드릴 등)을 말하며, 이를 제어하기 위해 **Inverse Kinematics (IK)**를 사용함.

### 2. Problems & Solutions (문제와 해결)

CLIP-RT는 **자연어를 Supervision(지도 신호)으로 사용하여** 시각-언어-행동(VLA) 정책을 학습하는 모델임.
CLIP이 "자연어를 이미지 학습의 신호로 썼던 것"에서 영감을 받아, CLIP-RT는 **"팔을 10cm 앞으로 이동해"** 같은 자연어 지시를 학습 신호로 사용함.

**주요 기여 (Contributions):**
1. CLIP-RT 모델 제안
2. 데이터 수집 프레임워크 제안
3. OpenVLA 대비 9개 신규 과제에서 평균 성공률 24% 향상
4. 사람 및 대규모 모델과의 협업 가능성 증대
5. LIBERO 벤치마크에서 높은 성공률(92.8%)과 속도(163Hz) 달성

### 3. Methodology (핵심 모델 구조)
#### [A] Contrastive Imitation Learning (CIL)
기존 모방 학습과 달리 **대조적 모방 학습(Contrastive Imitation Learning)**을 사용함.
CLIP-RT는 다음 세 가지 입력을 받음.
- $v_i$: 이미지 관측값 (Image Observation)
- $\\ell_i$: 언어 지시 (Instruction)
- $u_j$: 언어 기반 감독 (Language Supervision)

이 셋의 유사도를 최적화하는 것이 목표임. 즉, **"현재 상황($v_i + \\ell_i$)에 딱 맞는 행동 지시($u_j$)는 무엇인가?"**를 확률적으로 학습함.

*(여기에 CLIP-RT 구조도나 Figure 2 이미지를 넣으면 좋음)*

#### [B] Natural Language Supervision
CLIP-RT는 GPT-4를 활용해 50개의 기본 동작을 899개의 다양한 자연어 표현으로 증강하여 학습함.
이를 통해 "move upwards"와 "raise the arm"이 같은 행동임을 이해하게 됨.

#### [C] Closed-Loop Control
학습된 모델은 테스트 시 **Closed-loop** 방식으로 작동함.
1. 현재 상황(이미지+지시)을 보고 가장 확률 높은 **Motion Primitive**를 선택함. (예: "Move left by 10cm")
2. 이를 미리 정의된 Lookup Table을 통해 **Low-level End-effector Action**으로 변환함.
3. **Inverse Kinematics (IK)**로 실제 로봇을 움직임.

### 4. Experiments (실험 및 결과)

가장 흥미로웠던 점은 <strong>Novel Task(새로운 과제)</strong> 수행 능력임.

![CLIP-RT Success Rate](assets/CLIP-RT_success_rate.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Success rates on 9 novel tasks (Comparison with OpenVLA)</em></p>

"장난감 자동차 가지고 놀기", "칠판 지우기" 등 학습 때 보지 못한 새로운 과제에서도 CLIP-RT는 OpenVLA보다 월등한 성능(성공률 53% vs 29%)을 보임.

이는 CLIP-RT가 다양한 작업을 학습하며 <strong>공통된 동작 구조(Shared Structure)</strong>를 언어를 통해 잘 배웠기 때문으로 분석됨.

또한, 로봇이 실수를 할 때 사람이 "그리퍼를 90도 돌려"라고 말로 피드백을 주면, 이를 즉각 반영하여 성공률이 크게 오르는 <strong>협업 능력</strong>도 확인됨.

### 5. Conclusion & Insight (결론 및 배운 점)

자연어를 통해 비전문가도 로봇 데이터를 생성할 수 있다는 점이 인상적임. 특히 CLIP의 아이디어를 로봇 제어에 적용하여, 명확한 모델 설계와 직관적인 목적 함수를 만들어낸 점이 배울 만함.

다음에는 비교 대상이었던 **OpenVLA** 논문도 읽어볼 예정임.

---
*Reference: [CLIP-RT: Learning Language-Conditioned Robotic Policies from Natural Language Supervision (2025)](https://arxiv.org/abs/2411.00508)*
        `
    },
    {
        id: 14,
        category: 'papers',
        title: '[논문 리뷰] Word2Vec: Efficient Estimation of Word Representations in Vector Space',
        date: 'Jan 14, 2026',
        tech: 'NLP, Deep Learning, Word2Vec, Numpy',
        summary: '구문(프로젝트 내에서는 댓글과 같은)의 방대한 텍스트 데이터를 효율적으로 벡터화하는 CBOW와 Skip-gram 모델의 수학적 원리와 학습 최적화 기법(Negative Sampling) 분석',
        content: `
### 1. Overview (연구 배경)

진행 중인 유튜브채널분석에서 댓글의 자연어 수집 후 분석에 앞서 텍스트를 기계가 이해할 수 있는 숫자(Vector)로 변환하는 과정의 원리를 이해하기 위해 해당 논문을 분석하고 구현 목표를 수립함.
기존의 One-hot Encoding 방식은 단어 간의 유의미한 관계(Semantic Relationship)를 담지 못하고 차원이 너무 커지는 문제가 있음. 이에 따라 분산 표현(Distributed Representation)의 시초이자, 효율적인 연산량을 자랑하는 **Word2Vec (Mikolov et al., 2013)** 논문을 선정하여 분석하고 구현 목표를 수립함.

### 2. Problems & Solutions (문제와 해결)

**기존 NNLM(Neural Network Language Model)의 한계:**
기존 언어 모델은 단어 예측을 위해 비선형적인 Hidden Layer(Tanh, Sigmoid 등)를 포함한 복잡한 연산을 수행함.

- **Computational Complexity:** $Q = N \\times D + N \\times D \\times H + H \\times V$
- $N$(입력 개수), $D$(차원), $H$(은닉층), $V$(단어 수)가 모두 곱해지는 구조로, 데이터가 늘어날수록 학습 시간이 기하급수적으로 증가함.

**Word2Vec의 제안:**
"단어 표현의 정교함은 유지하되, 복잡한 비선형 Hidden Layer를 제거하자."
단순한 행렬 곱(Log-linear model)만으로도 충분히 훌륭한 벡터를 얻을 수 있음을 증명하며, 계산 비용을 획기적으로 낮췄음.

### 3. Methodology (핵심 모델 구조)

논문은 두 가지 아키텍처를 제안함.

![CBOW vs Skip-gram Architecture](assets/CBOW_and_SKIPGRAM.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. The architecture of CBOW and Skip-gram</em></p>

#### (1) CBOW (Continuous Bag-of-Words)
- **개념:** 주변 단어들(Context)의 벡터를 평균(Average)내어 중심 단어(Target)를 예측
- **특징:** 문맥을 뭉뚱그려(Smoothing) 처리하므로 학습이 빠르지만, 드물게 등장하는 단어에 대한 예측력은 다소 떨어짐.

#### (2) Skip-gram (Selected for Project)
- **개념:** 중심 단어(Target) 하나를 입력으로 받아, 주변에 올 수 있는 문맥 단어들(Context)을 역으로 예측
- **Why Skip-gram?**
    - 내 프로젝트인 유튜브 댓글 데이터는 구어체와 신조어가 많고 데이터의 절대량이 아주 방대하지 않음.
    - 논문에 따르면 **Skip-gram은 소량의 데이터에서도 희귀 단어를 잘 찾아내며**, 중심 단어 하나로 여러 개의 학습 쌍(Pair)을 만들어내므로(Data Augmentation 효과) 내 프로젝트에 더 적합하다고 판단함.

### 4. Mathematical Derivation (수식 유도 및 최적화)

단순히 라이브러리를 쓰는 것이 아니라 **Numpy로 밑바닥 구현**을 하기 위해 핵심 수식을 정리함.

#### (1) Objective Function
Skip-gram의 목표는 주어진 중심 단어 $w_t$에 대해 주변 단어 $w_{t+j}$가 등장할 확률(Likelihood)을 최대화하는 것

$$ \\frac{1}{T} \\sum_{t=1}^{T} \\sum_{-c \\le j \\le c, j \\ne 0} \\log p(w_{t+j} | w_t) $$

#### (2) The Softmax Problem & Negative Sampling
원래 확률 $p$를 구하려면 Softmax를 써야 함.

$$ p(w_O|w_I) = \\frac{\\exp({v'_{w_O}}^\\top v_{w_I})}{\\sum_{w=1}^{V} \\exp({v'_w}^\\top v_{w_I})} $$

하지만 분모($\\sum$)를 구하기 위해 100만 개($V$) 단어를 다 계산하는 것은 불가능. 이를 해결하기 위해 **Negative Sampling**을 도입함. 전체 단어를 다 보는 대신, **'정답 단어 1개'와 '오답(Noise) 단어 K개'**만을 비교하여 이진 분류 문제로 바꿈.

**[Implementation Formula]**
내일 구현할 최종 Loss Function은 다음과 같음:

$$ J(\\theta) = - \\log \\sigma({u_{target}}^T \\cdot v_{center}) - \\sum_{k=1}^{K} \\log \\sigma(- {u_{neg_k}}^T \\cdot v_{center}) $$

* 정답과는 내적값을 키우고(Log-Likelihood 증가), 오답과는 내적값을 줄이는(Minimize) 원리

### 5. Conclusion & Next Step

- **Insight:** Word2Vec은 단순한 카운팅이 아니라, **"비슷한 문맥에 등장하는 단어는 비슷한 의미를 가진다"**는 분포 가설을 수학적으로 가장 효율적으로 구현한 모델. 특히 'Syntactic(구문적)' 관계까지 벡터 연산으로 풀린다는 점이 인상적임.
- **Next Step:** 다음 포스팅에서는 위에서 유도한 Negative Sampling Loss 수식을 **Python Numpy로 직접 구현**하여, 실제 댓글 데이터가 벡터 공간에서 어떻게 군집화되는지 시각화해볼 예정

---
### References
- [Efficient Estimation of Word Representations in Vector Space (Mikolov et al., 2013)](https://arxiv.org/abs/1301.3781)
- [Distributed Representations of Words and Phrases and their Compositionality (Mikolov et al., 2013)](https://arxiv.org/abs/1310.4546)
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
        title: '사이드 프로젝트: 나만의 레트로 포트폴리오 사이트 고도화 (v1.0 ~ v2.5)',
        date: '2025',
        tech: 'HTML, CSS, JavaScript, 98.css, Canvas API',
        summary: '윈도우 98 감성의 포트폴리오 사이트를 기획하고, CMD 터미널/미니게임/마스코트 등을 추가하며 인터랙티브하게 고도화한 개발 기록.',
        content: `
### 1. Overview (기획 의도)

단순히 글만 나열된 정적인 포트폴리오가 아니라, **"방문자가 직접 이것저것 눌러보고 탐험하는 재미"**가 있는 사이트를 만들고 싶었음.
개발자로서의 정체성을 보여주기 위해 **레트로(Retro)한 윈도우 98 UI**를 콘셉트로 잡고, 실제 OS처럼 창을 띄우거나 터미널을 치는 경험을 웹으로 구현함.

### 2. Version History (개발 과정)

#### [v1.0] 기초 공사: 98.css 도입 및 레이아웃
- **Tech**: HTML5, CSS3, 98.css
- 오픈소스 라이브러리인 **98.css**를 활용하여 버튼, 창, 스크롤바 등 기본적인 UI 컴포넌트를 구성함.
- 좌측 탐색기(Explorer)와 우측 위젯(System Status)을 배치하여 실제 윈도우 탐색기 같은 레이아웃을 잡음.

*(여기에 초기 메인 화면 스크린샷 추천)*

#### [v2.0] 인터랙티브 기능 확장: CMD & Mini Games
- **Tech**: Vanilla JavaScript, HTML5 Canvas
- **CMD (Terminal)**: 실제 터미널처럼 명령어를 입력하고 결과를 출력하는 기능 구현. (\`help\`, \`ls\`, \`whoami\` 등 명령어 지원)
- **Mini Games**:
    - **Dino Run**: 크롬 공룡 게임을 캔버스로 직접 구현.
    - **Tetris**: 고전 테트리스 게임 구현 (블록 회전, 충돌 감지 로직).
    - **Rogue**: 텍스트 기반(ASCII) 로그라이크 던전 탐험 게임 구현. (맵 생성 알고리즘, 몬스터 AI 적용)

*(여기에 게임 실행 화면이나 CMD 화면 스크린샷 추천)*

#### [v2.5] 디테일 & 가독성 개선 (Current)
- **Mascot**: 화면 우측 하단에 움직이는 마스코트(투슬리스)를 추가하여 생동감을 더함. (클릭 시 멈춤/재생 기능)
- **Typography**: 본문 가독성을 위해 **Pretendard** 폰트를 적용하고, 제목과 본문의 줄 간격/자간을 세밀하게 조정하여 '기술 문서'다운 깔끔함을 확보함.
- **Responsive**: 큰 모니터에서도 레이아웃이 깨지지 않고 시원하게 보이도록 \`max-width\` 제한을 해제하고 반응형 처리를 강화함.

### 3. Key Implementation Details (구현 포인트)

#### (1) JavaScript로 구현한 로그라이크 게임 (Rogue)
외부 라이브러리 없이 순수 JS 배열(Array)로 2D 맵을 관리하고, 몬스터의 턴(Turn)제 이동 로직을 구현함.
특히 \`cmd.js\`와 연동하여 터미널 명령어(\`rogue play\`)로 게임 진입/종료가 자연스럽게 이어지도록 설계한 점이 핵심.

#### (2) Markdown & Math Rendering
글 작성의 효율성을 위해 **Marked.js**로 마크다운을 파싱하고, **KaTeX**를 도입하여 논문 리뷰 시 필요한 복잡한 수식($$ y = ax + b $$)을 깔끔하게 렌더링하도록 처리함.

### 4. Conclusion (회고)
처음에는 단순한 HTML 페이지로 시작했지만, 기능을 하나씩 붙여가며 **"살아있는 웹 애플리케이션"**으로 진화함.
특히 Canvas API를 활용한 게임 구현과 DOM 조작을 통한 인터랙티브 요소 개발 과정에서 JavaScript의 기본기를 탄탄하게 다질 수 있었음.

앞으로도 계속해서 새로운 기능을 실험하는 **나만의 샌드박스**로 활용할 예정임.
        `
    }
];
