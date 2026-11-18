---
title: "[논문 리뷰] Word2Vec: Efficient Estimation of Word Representations in Vector Space"
date: "2026-01-14"
description: "구문(프로젝트 내에서는 댓글과 같은)의 방대한 텍스트 데이터를 효율적으로 벡터화하는 CBOW와 Skip-gram 모델의 수학적 원리와 학습 최적화 기법(Negative Sampling) 분석"
tags: ["NLP", "Deep Learning", "Word2Vec", "Numpy"]
---

### 1. Overview (연구 배경)

진행 중인 유튜브채널분석에서 댓글의 자연어 수집 후 분석에 앞서 텍스트를 기계가 이해할 수 있는 숫자(Vector)로 변환하는 과정의 원리를 이해하기 위해 해당 논문을 분석하고 구현 목표를 수립함.
기존의 One-hot Encoding 방식은 단어 간의 유의미한 관계(Semantic Relationship)를 담지 못하고 차원이 너무 커지는 문제가 있음. 이에 따라 분산 표현(Distributed Representation)의 시초이자, 효율적인 연산량을 자랑하는 **Word2Vec (Mikolov et al., 2013)** 논문을 선정하여 분석하고 구현 목표를 수립함.

### 2. Problems & Solutions (문제와 해결)

**기존 NNLM(Neural Network Language Model)의 한계:**
기존 언어 모델은 단어 예측을 위해 비선형적인 Hidden Layer(Tanh, Sigmoid 등)를 포함한 복잡한 연산을 수행함.

- **Computational Complexity:** $Q = N \times D + N \times D \times H + H \times V$
- $N$(입력 개수), $D$(차원), $H$(은닉층), $V$(단어 수)가 모두 곱해지는 구조로, 데이터가 늘어날수록 학습 시간이 기하급수적으로 증가함.

**Word2Vec의 제안:**
"단어 표현의 정교함은 유지하되, 복잡한 비선형 Hidden Layer를 제거하자."
단순한 행렬 곱(Log-linear model)만으로도 충분히 훌륭한 벡터를 얻을 수 있음을 증명하며, 계산 비용을 획기적으로 낮췄음.

### 3. Methodology (핵심 모델 구조)

논문은 두 가지 아키텍처를 제안함.

![CBOW vs Skip-gram Architecture](/images/CBOW_and_SKIPGRAM.png)
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

$$ \frac{1}{T} \sum_{t=1}^{T} \sum_{-c \le j \le c, j \ne 0} \log p(w_{t+j} | w_t) $$

#### (2) The Softmax Problem & Negative Sampling
원래 확률 $p$를 구하려면 Softmax를 써야 함.

$$ p(w_O|w_I) = \frac{\exp({v'_{w_O}}^\top v_{w_I})}{\sum_{w=1}^{V} \exp({v'_w}^\top v_{w_I})} $$

하지만 분모($\sum$)를 구하기 위해 100만 개($V$) 단어를 다 계산하는 것은 불가능. 이를 해결하기 위해 **Negative Sampling**을 도입함. 전체 단어를 다 보는 대신, **'정답 단어 1개'와 '오답(Noise) 단어 K개'**만을 비교하여 이진 분류 문제로 바꿈.

**[Implementation Formula]**
내일 구현할 최종 Loss Function은 다음과 같음:

$$ J(\theta) = - \log \sigma({u_{target}}^T \cdot v_{center}) - \sum_{k=1}^{K} \log \sigma(- {u_{neg_k}}^T \cdot v_{center}) $$

* 정답과는 내적값을 키우고(Log-Likelihood 증가), 오답과는 내적값을 줄이는(Minimize) 원리

### 5. Conclusion & Next Step

- **Insight:** Word2Vec은 단순한 카운팅이 아니라, **"비슷한 문맥에 등장하는 단어는 비슷한 의미를 가진다"**는 분포 가설을 수학적으로 가장 효율적으로 구현한 모델. 특히 'Syntactic(구문적)' 관계까지 벡터 연산으로 풀린다는 점이 인상적임.
- **Next Step:** 다음 포스팅에서는 위에서 유도한 Negative Sampling Loss 수식을 **Python Numpy로 직접 구현**하여, 실제 댓글 데이터가 벡터 공간에서 어떻게 군집화되는지 시각화해볼 예정

---
### References
- [Efficient Estimation of Word Representations in Vector Space (Mikolov et al., 2013)](https://arxiv.org/abs/1301.3781)
- [Distributed Representations of Words and Phrases and their Compositionality (Mikolov et al., 2013)](https://arxiv.org/abs/1310.4546)
