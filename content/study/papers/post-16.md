---
title: "[논문 리뷰] TLCR: Token-Level Continuous Reward for Fine-grained RLHF (ACL 2024)"
date: "2025-07-20"
description: "기존 RLHF의 한계를 극복하기 위해 토큰 단위의 연속적인 보상(Continuous Reward)을 제안한 TLCR 논문 리뷰. 토큰별 세밀한 피드백으로 언어 모델 성능을 극대화함."
tags: ["RLHF", "PPO", "Reward Modeling", "NLP"]
---

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

![Sequence vs Discrete vs Continuous Reward](/images/fig1a.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1-(a). Sequence-Level Reward: 문장 전체에 대한 단일 보상</em></p>

![Sequence vs Discrete vs Continuous Reward](/images/fig1b.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1-(b). Token-Level Discrete Reward: 단순한 이산적(+1/0/-1) 보상</em></p>

**Solution: TLCR (Token-Level Continuous Reward)**
본 논문은 판별자(Discriminator)의 신뢰도(Confidence)를 활용하여, 각 토큰에 대해 **-1에서 1 사이의 연속적인(Continuous) 보상**을 부여하는 방법을 제안함. (Figure 1-(c))

![Sequence vs Discrete vs Continuous Reward](/images/fig1c.png)
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
