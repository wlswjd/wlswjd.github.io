---
title: "자연 언어 처리의 역사 개론"
date: "2025-07-22"
description: "규칙 기반부터 통계 기반, 딥러닝, 그리고 LLM까지 자연어 처리 기술의 발전 흐름과 패러다임 변화를 다룹니다."
tags: ["NLP", "History", "Statistical NLP", "Deep Learning", "LLM"]
---

##  TL;DR

- 자연어 처리는 규칙(Rule) → 통계(Stat) → 딥러닝(DL) → LLM 순으로 진화함.
- 합리주의(Chomsky)에서 경험주의(Data-driven)로의 철학적 전환이 기술 발전을 주도함.
- LLM의 등장은 '검색' 패러다임을 '생성' 패러다임으로 근본적으로 변화시킴.

##  NLP 기술 발전의 4단계

### 1. 규칙 기반 (Rule-based): 합리주의의 시대
1950~80년대. 언어학자들이 문법 규칙(If-Then)을 직접 코딩함.
- **특징**: 정확도는 높지만 예외 처리가 불가능하고 확장성이 매우 낮음. "언어는 수학처럼 명확한 규칙이 있다"는 믿음에 기반함.

### 2. 통계 기반 (Statistical NLP): 경험주의의 태동
1990~2000년대. 대량의 텍스트에서 단어의 빈도와 확률을 계산함 (N-gram).
- **특징**: 데이터가 많을수록 성능이 좋아지지만, 본 적 없는 단어(OOV)나 문맥 처리에 한계가 있음.

### 3. 딥러닝 기반 (Neural NLP): 의미의 벡터화
2013년~. Word2Vec의 등장으로 단어를 벡터 공간에 매핑함. 이후 RNN, LSTM, Seq2Seq 모델이 번역 등에서 혁신을 일으킴.
- **핵심**: "비슷한 문맥의 단어는 비슷한 의미를 가진다"는 분포 가설을 신경망으로 구현함.

### 4. Pre-training & LLM: 파운데이션 모델의 시대
2017년 Transformer의 등장과 2018년 BERT/GPT의 탄생.
- **Pre-training**: 인터넷의 방대한 텍스트로 '언어 능력' 자체를 미리 학습함.
- **Fine-tuning**: 특정 태스크에 맞게 살짝만 튜닝하면 SOTA 성능 달성.
- **Prompting**: 이제는 튜닝조차 필요 없이, 말로 시키면(In-context Learning) 다 해내는 **AGI(일반인공지능)**의 초기 단계로 진입함.

##  패러다임의 변화: Search to Generation

ChatGPT 이후, 정보 획득 방식이 "검색해서 링크를 클릭하고 읽는(Search)" 방식에서 "질문하고 답을 생성받는(Generation)" 방식으로 바뀜. 이는 구글 검색 중심의 웹 생태계가 근본적으로 흔들리고 있음을 의미함.

##  윤리적 과제 (Alignment)

AI가 인간보다 말을 잘하게 되면서 **Alignment(정렬)** 문제가 대두됨. AI가 거짓말(Hallucination)을 하거나, 혐오 표현을 하거나, 폭탄 제조법을 알려주지 않도록 RLHF(Reinforcement Learning from Human Feedback) 등을 통해 인간의 가치관에 맞게 제어하는 것이 현대 NLP의 가장 큰 과제임.
