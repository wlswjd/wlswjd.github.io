---
title: "논문 리뷰: Attention Is All You Need (Transformer)"
date: "2025-01-15"
description: "2017년 Google이 발표한 Transformer 논문을 읽고 핵심 개념을 정리했습니다."
tags: ["논문리뷰", "Transformer", "Attention", "NLP"]
---

## 논문 정보

- **제목**: Attention Is All You Need
- **저자**: Vaswani et al. (Google Brain, 2017)
- **링크**: [arXiv:1706.03762](https://arxiv.org/abs/1706.03762)

## 핵심 기여

기존 RNN/LSTM 기반 seq2seq 모델의 한계를 극복한 **순수 Attention 메커니즘** 기반 아키텍처 제안.

## Scaled Dot-Product Attention

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

- **Q (Query)**: 현재 위치가 어떤 정보를 찾는가
- **K (Key)**: 각 위치가 어떤 정보를 가지고 있는가
- **V (Value)**: 실제 전달할 정보

## Multi-Head Attention

여러 개의 Attention Head를 병렬로 실행하여 다양한 관점의 의존 관계를 학습합니다.

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
```

## Positional Encoding

RNN과 달리 순서 정보가 없으므로 위치 정보를 직접 주입합니다.

$$PE_{(pos, 2i)} = \sin(pos / 10000^{2i/d_{model}})$$

## 왜 중요한가?

이 논문은 BERT, GPT, T5 등 현대 LLM의 기반이 된 아키텍처를 제안했습니다. 오늘날 ChatGPT, Claude 등 모든 대형 언어 모델의 근간입니다.

## 개인적인 생각

처음 읽을 때 Attention 수식 이해가 어려웠는데, QKV를 "검색 쿼리 - 문서 키워드 - 문서 내용"으로 비유하니 직관적으로 이해되었습니다.
