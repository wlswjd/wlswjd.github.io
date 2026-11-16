---
title: "PyTorch Lightning 으로 구축하는 LLM 모델링 실험 환경"
date: "2025-07-23"
description: "복잡한 LLM 학습 코드를 PyTorch Lightning으로 단순화하고, WandB와 Hydra를 연동하여 효율적인 MLOps 환경을 구축하는 방법을 소개함."
tags: ["PyTorch Lightning", "LLM", "WandB", "Hydra"]
---

##  TL;DR

- PyTorch Lightning은 "과학적 코드(알고리즘)"와 "엔지니어링 코드(학습 루프)"를 분리해줌.
- 복잡한 Multi-GPU 학습, Mixed Precision, Logging 등을 설정 한 줄로 처리 가능함.
- `LightningModule`과 `DataModule`로 코드를 모듈화하여 재사용성을 극대화함.

##  Why PyTorch Lightning for LLM?

LLM(Large Language Model) 학습은 일반적인 딥러닝보다 훨씬 복잡한 엔지니어링을 요구함.
1.  **분산 학습 필수**: 모델이 너무 커서 GPU 하나에 안 들어감. (DeepSpeed, FSDP 필요)
2.  **메모리 최적화**: 16-bit(FP16), BF16 Mixed Precision 학습이 기본임.
3.  **복잡한 로깅**: Loss뿐만 아니라 생성된 텍스트 샘플, GPU 상태 등을 실시간으로 모니터링해야 함.

순수 PyTorch로 이를 구현하면 수백 줄의 보일러플레이트 코드가 필요하지만, Lightning은 `Trainer`에 플래그만 넘기면 됨.

```python
# Lightning의 마법: 설정 한 줄로 분산 학습 & 16bit 학습 적용
trainer = Trainer(
    accelerator="gpu",
    devices=4,           # GPU 4장 사용
    strategy="deepspeed", # DeepSpeed ZeRO 최적화 사용
    precision="16-mixed"  # FP16 Mixed Precision 사용
)
```

##  핵심 구조: LightningModule

모델의 구조뿐만 아니라, '학습이 어떻게 진행되는지'를 클래스 안에 캡슐화함.

```python
class LLMFinetuner(pl.LightningModule):
    def __init__(self, model_name):
        super().__init__()
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
    
    def training_step(self, batch, batch_idx):
        # 순수 PyTorch: optimizer.zero_grad(), loss.backward(), optimizer.step() 등을 직접 써야 함
        # Lightning: loss만 리턴하면 나머지는 알아서 처리함
        outputs = self.model(**batch)
        loss = outputs.loss
        self.log("train_loss", loss)
        return loss
    
    def configure_optimizers(self):
        return AdamW(self.parameters(), lr=2e-5)
```

##  MLOps 통합 (Hydra + WandB)

*   **Hydra**: 복잡한 하이퍼파라미터(Batch size, LR, Model name 등)를 계층적인 `.yaml` 파일로 관리함. 코드를 수정하지 않고 설정 파일만 바꿔서 실험 가능.
*   **WandB**: Lightning의 `WandbLogger`를 사용하면 별도 코드 없이 Loss 그래프, 시스템 자원 사용량, 모델 체크포인트가 클라우드에 자동 저장됨.

이러한 모던 스택(Lightning + Hydra + WandB)은 LLM 연구 및 개발의 속도를 비약적으로 높여줌.
