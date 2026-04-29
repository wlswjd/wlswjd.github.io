---
title: "개인 블로그 만들기 - Next.js + NES.css"
date: "2025-01-20"
description: "레트로 스타일 개인 블로그를 Next.js와 NES.css로 만든 과정을 기록합니다."
tags: ["Next.js", "NES.css", "블로그", "사이드프로젝트"]
---

## 동기

공부한 내용을 정리하고 싶었는데, 남들이 다 쓰는 티스토리나 Notion보다는 직접 만들어서 쓰고 싶었습니다. 그리고 뭔가 특색 있는 디자인을 원했어요.

## 기술 선택

- **Next.js 14**: App Router, SSG 지원으로 블로그에 최적
- **NES.css**: 8비트 레트로 스타일 CSS 프레임워크
- **Markdown**: 글 작성이 편하고 Git으로 관리 가능
- **TypeScript**: 타입 안정성

## 주요 기능

- 카테고리 트리 사이드바
- Markdown 포스트 렌더링
- 태그 시스템
- 반응형 레이아웃

## 개발 과정에서 배운 것

Next.js App Router를 처음 써봤는데, Server Component와 Client Component를 구분하는 개념이 처음엔 헷갈렸습니다. 사이드바의 expand/collapse 기능은 client component여야 해서 분리했습니다.

## 앞으로 할 것

- [ ] 검색 기능 추가
- [ ] 다크 모드
- [ ] RSS 피드
- [ ] 댓글 시스템 (giscus)
