---
title: "[논문 리뷰] Item2Vec: Neural Item Embedding for Collaborative Filtering"
date: "2025-12-15"
description: "Word2Vec의 Skip-gram 모델을 추천 시스템에 적용하여, 아이템 간의 유사도를 벡터 공간에 임베딩하는 Item2Vec 방법론 분석."
tags: ["Recommender System", "Word2Vec", "Embedding", "NLP"]
---

### 1. Overview
2016년 Microsoft Research에서 발표한 **Item2Vec**은 자연어 처리(NLP) 분야의 Word2Vec(특히 Skip-gram) 아이디어를 추천 시스템에 그대로 이식하여 큰 성공을 거둔 논문임.

기존의 협업 필터링(CF) 방식, 특히 SVD(Singular Value Decomposition)는 "유저-아이템 행렬"이 필요함. 하지만 현실 세계의 데이터는 유저 정보가 없거나(Cold Start), 데이터가 매우 희소(Sparse)한 경우가 많음. Item2Vec은 유저 식별자 없이 오직 **"세션(Session) 내의 아이템 목록"**만을 사용하여 아이템 간의 관계를 학습함.

즉, **"문장 속의 단어(Word in Sentence)"**를 **"장바구니 속의 상품(Item in Basket)"**으로 치환하여, 아이템 간의 잠재적 연관성을 벡터 공간에 임베딩하는 것이 핵심임.

### 2. Methodology (핵심 모델 구조)

#### [A] Skip-gram with Negative Sampling (SGNS)
Item2Vec은 Word2Vec의 Skip-gram 모델을 차용함. 목표는 주어진 아이템 $w_i$가 있을 때, 같은 세션(장바구니)에 등장한 다른 아이템 $w_j$의 등장 확률을 최대화하는 것임.

![Item2Vec Architecture](/images/item2vec_1.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 1. Skip-gram model architecture applied to items</em></p>

수식으로는 다음과 같이 정의됨.
$$ \frac{1}{K} \sum_{i=1}^{K} \sum_{j \neq i} \log p(w_j | w_i) $$

여기서 모든 아이템에 대해 Softmax를 계산하면 비용이 너무 크기 때문에, **Negative Sampling**을 사용함. 즉, 실제로 같이 구매된 아이템(Positive)과는 내적값을 높이고, 랜덤하게 추출된 아이템(Negative)과는 내적값을 낮추는 방식으로 효율적으로 학습함.

#### [B] Comparison with SVD
논문에서는 기존 SVD 방식과 Item2Vec의 성능을 비교함.

![Item2Vec vs SVD t-SNE](/images/item2vec_2.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 2. t-SNE visualization: Item2Vec(좌) vs SVD(우)</em></p>

위 그림을 보면, Item2Vec은 비슷한 카테고리의 상품끼리(예: 액션 게임, 전략 게임) 매우 뚜렷하게 군집화(Clustering)되는 것을 볼 수 있음. 반면 SVD는 군집이 다소 뭉개지거나 섞여 있는 모습임. 이는 Item2Vec이 아이템 간의 **의미적 유사성(Semantic Similarity)**을 훨씬 더 잘 포착한다는 것을 보여줌.

### 3. Experiments & Results (실험 결과)

실제 데이터셋(Microsoft Xbox Music, 상품 데이터)을 이용한 실험에서도 Item2Vec의 우수성이 입증됨.

![Similarity Table](/images/item2vec_3.png)
<p style="text-align: center; margin-top: 8px; color: #555;"><em>Figure 3. Top-k similar items for query items</em></p>

위 표는 특정 아이템(Query)을 입력했을 때 추천되는 상위 아이템들을 보여줌. Item2Vec은 단순히 같은 카테고리일 뿐만 아니라, 유저가 실제로 **"대체재(Substitutable)"** 혹은 **"보완재(Complementary)"**로 느낄만한 상품들을 매우 정교하게 찾아냄.

### 4. Application (For Business)
이 모델은 딜리버드코리아와 같은 글로벌 이커머스/물류 플랫폼에서 강력한 무기가 될 수 있음.

1.  **User-less Recommendation:** 유저 로그인이 없거나 신규 유저라 하더라도, 현재 장바구니에 담은 물건 하나만 있다면 즉시 연관 상품을 추천할 수 있음.
2.  **Cross-selling 전략:** "K-Pop 앨범을 산 외국인이 자주 같이 사는 화장품은?"과 같은 질문에 대해, 국가별/카테고리별 구매 로그만 학습시키면 즉시 인사이트를 얻을 수 있음.
3.  **데이터 확장성:** SVD보다 대용량 데이터 처리에 유리하며, 새로운 상품이 추가되어도 재학습이 비교적 용이함.
