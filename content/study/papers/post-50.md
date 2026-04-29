---
title: "[논문 리뷰] LoRA: Low-Rank Adaptation of Large Language Models (ICLR 2022)"
date: "2026-02-14"
description: "거대 언어 모델의 파라미터 전체를 학습하지 않고, Low-Rank 행렬 분해를 통해 학습 파라미터 수를 획기적으로 줄이면서도 성능을 유지하는 효율적인 튜닝 기법(LoRA) 분석."
tags: ["LLM", "Fine-tuning", "PEFT", "Linear Algebra"]
---

### 1. The Reality of LLM Fine-tuning

"GPT-3(175B)를 파인튜닝 하려면 GPU가 몇 장 필요할까?"
단순 계산으로도 수백 GB의 VRAM이 필요함. Full Fine-tuning은 가중치($W$) 전체를 업데이트하기 때문에, 옵티마이저 상태(Optimizer States)까지 포함하면 배보다 배꼽이 더 큰 메모리를 잡아먹음.
현업에서 LLaMA-3 70B 같은 모델을 서비스별로 튜닝해서 서빙하는 건 비용적으로 거의 불가능에 가까웠음. **LoRA(Low-Rank Adaptation)**가 나오기 전까지는.

### 2. Core Hypothesis: Intrinsic Rank

이 논문의 시작점은 매우 수학적이고 직관적인 가설에서 출발함.
**"과라미터화(Over-parameterized)된 모델이 학습할 때, 실제로 변하는 정보의 차원(Intrinsic Dimension)은 매우 낮다."**
즉, 1750억 개의 파라미터가 모두 독립적으로 변하는 게 아니라, 실제로는 **낮은 랭크(Low Rank)**의 어떤 부분공간(Subspace) 안에서만 움직인다는 것임.

### 3. Methodology: Matrix Decomposition

기존 가중치 행렬을 $W_0 in mathbb{R}^{d 	imes k}$라고 할 때, 변화량 $Delta W$를 직접 학습하는 대신 두 개의 작은 행렬의 곱으로 분해(Decomposition)함.

![LoRA Architecture](/images/LoRa_1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. LoRA의 핵심 구조 ($W_0$는 고정하고 $A, B$만 학습)</em></p>

#### [Mathematical Formulation]
$$ h = W_0 x + Delta W x = W_0 x + B A x $$

*   $W_0$: Pre-trained Weight (Frozen, 학습 안 함)
*   $B in mathbb{R}^{d 	imes r}$: 초기화 0 (Zero Initialization)
*   $A in mathbb{R}^{r 	imes k}$: 정규분포 초기화 (Gaussian Initialization)
*   $r$: Rank (하이퍼파라미터, 보통 1, 2, 4, 8 등으로 매우 작게 설정)

이렇게 하면 학습해야 할 파라미터 수는 $d 	imes k$에서 $r 	imes (d+k)$로 드라마틱하게 줄어듦. (약 10,000배 감소)

### 4. Why it works? (Scaling & Initialization)

단순히 행렬을 쪼개는 것뿐만 아니라, 학습 안정성을 위해 **Scaling Factor** $alpha$를 도입함.
$$ Delta W = rac{alpha}{r} BA $$
이 스케일링 덕분에 $r$ 값을 바꿔도 하이퍼파라미터 튜닝을 다시 할 필요가 줄어듦. 초기화 시 $B$를 0으로 두어 학습 시작 시점에는 $Delta W = 0$, 즉 원본 모델과 동일한 출력에서 시작하게 설계한 점도 엔지니어링적으로 매우 영리한 선택임.

![Performance Comparison](/images/LoRa_2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. Full Fine-tuning 대비 파라미터 수와 성능 비교</em></p>

### 5. Experiments & Results

GPT-3 175B 모델을 튜닝했을 때의 결과는 놀라움.
1.  **Storage**: 체크포인트 크기가 350GB에서 **35MB**로 줄어듦 (1/10,000).
2.  **Speed**: 학습 시 그래디언트 계산량이 줄어들어 25% 이상 빨라짐.
3.  **Performance**: Full Fine-tuning과 대등하거나, 오히려 더 좋은 성능(ROUGE 스코어 등)을 보임.

![Matrix Analysis](/images/LoRa_3.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. 학습된 행렬의 Subspace Similarity 분석</em></p>

논문 후반부의 분석(Figure 3)을 보면, LoRA로 학습된 $A, B$ 행렬이 실제로 원본 모델의 중요한 특징(Feature)들을 잘 포착하고 있음을 증명함. 이는 앞서 세운 "Intrinsic Rank" 가설이 맞았음을 보여줌.

### 6. Engineer's Insight

LoRA는 이제 선택이 아니라 **Default**임. 특히 **Multi-Tenant** 구조의 서비스를 만들 때 빛을 발함.
*   Base Model(수십 GB)은 GPU 메모리에 딱 하나만 올림.
*   고객사 A용 LoRA(수십 MB), 고객사 B용 LoRA(수십 MB)만 그때그때 로드해서 갈아 끼우면 됨. (Hot-swapping)
*   이를 통해 하나의 GPU로 수십, 수백 개의 맞춤형 모델을 서빙하는 **경제성(Cost-efficiency)**을 확보할 수 있음.
