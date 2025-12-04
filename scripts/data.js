// {
//     id: 9,  // (중요) 기존 숫자와 겹치지 않게 1씩 늘려주세요
//     category: 'ml',  // papers, ml, dl, projects 중 하나 선택
//     title: '여기에 제목을 적으세요',
//     date: 'Dec 5, 2025',
//     tech: 'Python, TensorFlow',
//     summary: '목록에 보여질 짧은 한 줄 요약입니다.',
//     content: `
//         <p>여기에 본문 내용을 적습니다.</p>
//         <p>줄바꿈도 자유롭게 가능합니다.</p>
//     `
// },

// content: `
//     <p>아래는 실험 결과 그래프입니다.</p>
//     <img src="images/result_graph.png" style="width: 100%; max-width: 600px; border: 2px solid gray;">
//     <p>그래프 설명...</p>
// `

const posts = [
    {
        id: 1,
        category: 'papers',
        title: '데이터 온톨로지: 지식을 구조화하는 방법',
        date: 'Nov 6, 2025',
        tech: 'rdflib, owlready2, networkx',
        summary: '데이터 온톨로지(Data Ontology)는 특정 도메인의 개념과 그 관계를 형식적으로 정의한 지식 표현 체계다...',
        content: `<p>데이터 온톨로지는 지식을 구조화하는 핵심 기술입니다.</p>
                  <p>RDF, OWL 등을 사용하여 그래프 형태로 지식을 연결합니다.</p>
                  <p>주요 개념: Class, Property, Individual...</p>`
    },
    {
        id: 2,
        category: 'ml',
        title: 'Alembic으로 시작하는 데이터베이스 마이그레이션',
        date: 'Oct 25, 2025',
        tech: 'Python 3.12+, SQLAlchemy, Alembic',
        summary: 'TL;DR Alembic은 SQLAlchemy 기반의 데이터베이스 마이그레이션 도구입니다. 스키마 변경을 버전 관리하듯이...',
        content: `<p>데이터베이스 스키마 변경을 Git처럼 관리하고 싶다면 Alembic이 정답입니다.</p>`
    },
    {
        id: 3,
        category: 'dl',
        title: 'PostgreSQL: 오픈소스 데이터베이스의 강자',
        date: 'Oct 17, 2025',
        tech: 'Docker, PostgreSQL 16.0',
        summary: 'PostgreSQL은 강력한 오픈소스 객체-관계형 데이터베이스 시스템(ORDBMS)입니다...',
        content: `<p>PostgreSQL은 단순한 RDBMS를 넘어 강력한 확장성과 기능을 제공합니다.</p>`
    },
    {
        id: 4,
        category: 'projects',
        title: '나만의 포트폴리오 사이트 만들기',
        date: 'Dec 4, 2025',
        tech: 'HTML, CSS, JS, 98.css',
        summary: '윈도우 98 감성을 살린 포트폴리오 사이트 제작기.',
        content: `<p>98.css 라이브러리를 활용하여 레트로한 느낌의 포트폴리오를 만들었습니다.</p>`
    },
    {
        id: 5,
        category: 'projects',
        title: 'FastAPI와 React를 활용한 대시보드 개발',
        date: 'Sep 10, 2025',
        tech: 'FastAPI, React, Chart.js',
        summary: '실시간 데이터를 시각화하는 인터랙티브 대시보드를 개발했습니다.',
        content: `<p>WebSocket을 이용하여 실시간 데이터 업데이트를 구현했습니다.</p>`
    },
    {
        id: 6,
        category: 'ml',
        title: 'Scikit-learn으로 배우는 머신러닝 기초',
        date: 'Aug 22, 2025',
        tech: 'Python, Scikit-learn, Pandas',
        summary: '머신러닝의 기본 개념인 지도 학습과 비지도 학습을 Scikit-learn 라이브러리로 실습해봅니다.',
        content: `<p>Iris 데이터셋을 활용한 분류 모델 만들기 예제입니다.</p>`
    },
    {
        id: 7,
        category: 'dl',
        title: 'PyTorch vs TensorFlow: 딥러닝 프레임워크 비교',
        date: 'Jul 15, 2025',
        tech: 'PyTorch, TensorFlow',
        summary: '현업에서 가장 많이 쓰이는 두 프레임워크의 장단점과 선택 가이드.',
        content: `<p>PyTorch는 연구용으로, TensorFlow는 배포용으로 많이 쓰였으나 최근 트렌드는...</p>`
    },
    {
        id: 8,
        category: 'papers',
        title: 'Attention Is All You Need 리뷰',
        date: 'Jun 01, 2025',
        tech: 'Transformer, NLP',
        summary: 'NLP의 혁명, Transformer 구조를 제안한 논문을 상세하게 리뷰합니다.',
        content: `<p>Self-Attention 메커니즘의 원리와 이를 통한 병렬 처리의 이점을 설명합니다.</p>`
    }
];
