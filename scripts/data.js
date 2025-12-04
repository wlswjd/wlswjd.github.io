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
        id: 9,
        category: 'ml',
        title: '서울시 부동산 가격 예측 프로젝트 회고 with 머신러닝',
        date: '2025', // 날짜는 velog 원본에 맞춰 수정해주세요
        tech: 'Python, Scikit-learn, XGBoost, Pandas',
        summary: '머신러닝을 활용하여 서울시 부동산 실거래가를 예측하는 모델을 구축하고 성능을 최적화한 프로젝트 회고입니다.',
        content: `
            <h3>1. Project Overview (프로젝트 개요)</h3>
            <p>서울시 아파트 실거래가 데이터를 활용하여 가격을 예측하는 회귀 모델을 구축했습니다. 부동산 시장의 불확실성을 줄이고 합리적인 가격 기준을 제시하는 것을 목표로 했습니다.</p>
            
            <h3>2. Data & Preprocessing (데이터 및 전처리)</h3>
            <ul>
                <li><strong>데이터셋:</strong> 서울시 부동산 실거래가 데이터 (국토교통부 / 공공데이터포털)</li>
                <li><strong>전처리:</strong> 
                    <ul>
                        <li>결측치 처리 (평균값 대체 및 삭제)</li>
                        <li>이상치 제거 (IQR 방식 활용)</li>
                        <li>범주형 변수 인코딩 (One-Hot Encoding)</li>
                    </ul>
                </li>
            </ul>

            <h3>3. Modeling (모델링)</h3>
            <p>다양한 회귀 모델을 비교 실험했습니다.</p>
            <ul>
                <li>Linear Regression</li>
                <li>Random Forest Regressor</li>
                <li>XGBoost / LightGBM</li>
            </ul>
            <p>최종적으로 <strong>XGBoost</strong> 모델이 가장 우수한 성능(RMSE 기준)을 보여 선정했습니다.</p>

            <h3>4. Result & Retrospective (결과 및 회고)</h3>
            <p><strong>성과:</strong> 베이스라인 대비 RMSE를 약 15% 개선했습니다.</p>
            <p><strong>배운 점:</strong> 파생 변수(예: 지하철역과의 거리, 학군 등) 생성의 중요성을 체감했습니다. 데이터 전처리가 모델 성능에 미치는 영향이 모델 튜닝보다 큼을 확인했습니다.</p>
            
            <hr>
            <p><em>(여기에 Velog의 상세한 내용을 복사해서 붙여넣으시면 됩니다.)</em></p>
        `
    },
    {
        id: 10,
        category: 'ml',
        title: '데이터 분류 및 전처리 실습: 부동산 집값 예측 대회 준비',
        date: '2025', 
        tech: 'Python, Pandas, Matplotlib, Seaborn',
        summary: '부동산 가격 예측 대회를 위해 데이터를 탐색적 데이터 분석(EDA)하고 전처리하는 과정을 정리했습니다.',
        content: `
            <h3>1. EDA (탐색적 데이터 분석)</h3>
            <p>데이터의 분포와 변수 간의 상관관계를 분석했습니다.</p>
            <ul>
                <li>Target 변수(가격)의 분포 확인 (Log 변환 필요성 확인)</li>
                <li>주요 변수(면적, 연식)와 가격의 산점도 시각화</li>
            </ul>

            <h3>2. Feature Engineering (특성 공학)</h3>
            <p>기존 변수를 조합하여 새로운 의미를 도출했습니다.</p>
            <ul>
                <li><strong>건물 노후도:</strong> 현재 연도 - 준공 연도</li>
                <li><strong>단지 규모:</strong> 세대수 구간화</li>
            </ul>

            <h3>3. Insights (인사이트)</h3>
            <p>단순히 데이터를 넣는 것보다, 도메인 지식을 활용하여 불필요한 변수를 제거했을 때 모델의 안정성이 높아짐을 확인했습니다.</p>

            <hr>
            <p><em>(여기에 Velog의 상세한 코드나 그래프 설명을 추가하세요.)</em></p>
        `
    },
    {
        id: 1,
        category: 'ml',
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
        category: 'code',
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
        id: 11,
        category: 'competition',
        title: '데이터 경진대회 참여 회고',
        date: '2024',
        tech: 'Python, XGBoost, Optuna',
        summary: '부동산 실거래가 예측 경진대회에서 모델을 고도화하며 얻은 인사이트를 정리했습니다.',
        content: `
            <p>대회 참가 배경과 목표를 소개하고, 데이터 분석 및 모델링 전략, 리더보드 성과 등을 순서대로 정리했습니다.</p>
            <p>하이퍼파라미터 튜닝은 Optuna로 자동화했고, 교차검증 전략을 바꿨을 때 점수가 상승했던 경험을 기록했습니다.</p>
        `
    },
    {
        id: 12,
        category: 'contest',
        title: 'AI 공모전 프로젝트',
        date: '2024',
        tech: 'Python, FastAPI, React',
        summary: '대국민 공모전에서 제출한 AI 기반 서비스 기획 및 구현 내용을 정리했습니다.',
        content: `
            <p>사용자 시나리오, 시스템 구성도, 백엔드/프론트엔드 구현 스택, 시연 데모 영상을 포함한 제출 과정을 회고했습니다.</p>
        `
    },
    {
        id: 13,
        category: 'sidepr',
        title: '사이드 프로젝트: 포트폴리오 사이트 고도화',
        date: '2025',
        tech: 'HTML, CSS, JavaScript, 98.css',
        summary: '윈도우 98 감성의 포트폴리오 사이트를 기획·구현하며 얻은 경험을 정리했습니다.',
        content: `
            <p>디자인 콘셉트, 기능 요구사항, 98.css 커스터마이징, 게임/터미널 탭 추가 등의 과정을 기록했습니다.</p>
        `
    }
];
