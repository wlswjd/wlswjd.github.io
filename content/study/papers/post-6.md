---
title: "[논문 리뷰] CLIP-RT(2025): Learning Language-Conditioned Robotic Policies from Natural Language Supervision"
date: "2025-06-06"
description: "로봇AI 분야의 최신 논문 CLIP-RT 리뷰. 자연어를 학습 신호(Supervision)로 사용하여 로봇의 정책(Policy)을 학습하는 새로운 VLA 모델을 제안"
tags: ["Robotics", "VLA", "CLIP", "Imitation Learning"]
---

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
- $\ell_i$: 언어 지시 (Instruction)
- $u_j$: 언어 기반 감독 (Language Supervision)

이 셋의 유사도를 최적화하는 것이 목표임. 즉, **"현재 상황($v_i + \ell_i$)에 딱 맞는 행동 지시($u_j$)는 무엇인가?"**를 확률적으로 학습함.

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

![CLIP-RT Success Rate](/images/CLIP-RT_success_rate.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Success rates on 9 novel tasks (Comparison with OpenVLA)</em></p>

"장난감 자동차 가지고 놀기", "칠판 지우기" 등 학습 때 보지 못한 새로운 과제에서도 CLIP-RT는 OpenVLA보다 월등한 성능(성공률 53% vs 29%)을 보임.

이는 CLIP-RT가 다양한 작업을 학습하며 <strong>공통된 동작 구조(Shared Structure)</strong>를 언어를 통해 잘 배웠기 때문으로 분석됨.

또한, 로봇이 실수를 할 때 사람이 "그리퍼를 90도 돌려"라고 말로 피드백을 주면, 이를 즉각 반영하여 성공률이 크게 오르는 <strong>협업 능력</strong>도 확인됨.

### 5. Conclusion & Insight (결론 및 배운 점)

자연어를 통해 비전문가도 로봇 데이터를 생성할 수 있다는 점이 인상적임. 특히 CLIP의 아이디어를 로봇 제어에 적용하여, 명확한 모델 설계와 직관적인 목적 함수를 만들어낸 점이 배울 만함.

다음에는 비교 대상이었던 **OpenVLA** 논문도 읽어볼 예정임.

---
*Reference: [CLIP-RT: Learning Language-Conditioned Robotic Policies from Natural Language Supervision (2025)](https://arxiv.org/abs/2411.00508)*
