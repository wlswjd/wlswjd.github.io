// Main App Logic

const postListContainer = document.getElementById('post-list-container');
const articleDetailContainer = document.getElementById('article-detail-container');
const mainContentArea = document.getElementById('main-content-area');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const postCountDisplay = document.getElementById('post-count-display');

const categoryGroups = {
    study: ['ml', 'dl', 'code', 'papers'],
    project: ['competition', 'contest', 'sidepr', 'projects']
};

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderPosts('all');
    
    // Scroll Event Listener for "Scroll to Top" button
    mainContentArea.addEventListener('scroll', () => {
        if (mainContentArea.scrollTop > 200) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    });

    // Mascot click: toggle walking animation
    const mascotContainer = document.getElementById('mascot-container');
    if (mascotContainer) {
        mascotContainer.addEventListener('click', () => {
            mascotContainer.classList.toggle('mascot-paused');
        });
    }
});

function scrollToTop() {
    mainContentArea.scrollTo({ top: 0, behavior: 'smooth' });
}

function filterPosts(category) {
    // Reset View
    goBackToList();
    
    if (category === 'all') {
        renderPosts('all');
        return;
    }
    
    const group = categoryGroups[category];
    const filtered = posts.filter(p => {
        if (group && group.includes(p.category)) return true;
        if (p.category === category) return true;
        // Check tech tags too for search/tag filtering
        // p.tech가 "HTML"일 때 "ml"이 포함되는 문제 해결을 위해 정확히 분리해서 비교
        const techList = p.tech.split(',').map(t => t.trim().toLowerCase());
        if (techList.includes(category.toLowerCase())) return true;
        return false;
    });
    
    renderHTML(filtered);
}

function handleSearch() {
    const query = document.getElementById('search-input').value.toLowerCase();
    if (!query) {
        renderPosts('all');
        return;
    }
    const filtered = posts.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.summary.toLowerCase().includes(query) ||
        p.tech.toLowerCase().includes(query)
    );
    renderHTML(filtered);
}

function renderPosts(filter) {
    if (filter === 'all') {
        renderHTML(posts);
    } else {
        filterPosts(filter);
    }
}

function renderHTML(data) {
    postListContainer.innerHTML = '';
    
    if (data.length === 0) {
        postListContainer.innerHTML = '<div class="window-body"><p>No posts found.</p></div>';
        updatePostCountDisplay(0);
        return;
    }

    data.forEach(post => {
        const div = document.createElement('div');
        div.className = 'window post-card';
        div.innerHTML = `
          <div class="title-bar">
            <div class="title-bar-text">${post.title}</div>
            <div class="title-bar-controls">
              <button aria-label="Minimize"></button>
              <button aria-label="Maximize"></button>
              <button aria-label="Close"></button>
            </div>
          </div>
          <div class="window-body">
            <p><strong>Date: ${post.date}</strong></p>
            <p>Tech: ${post.tech}</p>
            <p>${post.summary}</p>
            <div style="text-align: right;">
                <button onclick="viewPost(${post.id})">Read Article</button>
            </div>
          </div>
        `;
        postListContainer.appendChild(div);
    });

    updatePostCountDisplay(data.length);
}

function viewPost(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;

    // Hide List, Show Detail
    postListContainer.style.display = 'none';
    articleDetailContainer.classList.add('visible');
    
    // Reset scroll to top when viewing new article
    mainContentArea.scrollTop = 0;

    // Fill Content
    document.getElementById('article-title-bar').innerText = post.title;
    document.getElementById('article-title').innerText = post.title;
    document.getElementById('article-meta').innerText = `Date: ${post.date} | Tech: ${post.tech}`;
    
    const articleBody = document.getElementById('article-body');

    // Markdown Parsing & Math Rendering Logic
    if (typeof marked !== 'undefined') {
        let content = post.content;

        // 1. 수식($...$, $$...$$)을 잠시 임시 토큰으로 숨기기 (마크다운 파서가 건드리지 못하게)
        const mathExpressions = [];
        const protectedContent = content.replace(/(\$\$[\s\S]+?\$\$)|(\$[^\$\n]+\$)/g, (match) => {
            mathExpressions.push(match);
            return `MATH_TOKEN_${mathExpressions.length - 1}_`;
        });

        // 2. 마크다운 변환 (이제 수식은 안전함)
        let htmlContent = marked.parse(protectedContent);

        // 3. 수식 복구
        htmlContent = htmlContent.replace(/MATH_TOKEN_(\d+)_/g, (match, index) => {
            return mathExpressions[index];
        });

        articleBody.innerHTML = htmlContent;
        
        // 4. KaTeX 렌더링 적용
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(articleBody, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false}
                ],
                throwOnError: false
            });
        }
    } else {
        articleBody.innerHTML = post.content;
    }
}

function goBackToList() {
    articleDetailContainer.classList.remove('visible');
    postListContainer.style.display = 'flex';
}

function showPage(page) {
    if (page === 'about') {
        // Use innerHTML to inject structure for About Me
        postListContainer.innerHTML = `
            <div class="window post-card">
                <div class="title-bar"><div class="title-bar-text">README.md</div></div>
                <div class="window-body" style="line-height: 1.6;">
                    <h2 style="margin-top: 0;">👋 안녕하세요, I'm Chin Jeung(a.k.a Cedric) | 진 정</h2>
                    
                    <p>
                        AI-데이터 분석·MLOps를 중심으로 복잡한 문제를 구조화하고 자동화하는 <strong>빌더 진정(Chin Jeung)</strong>입니다!!!<br>
                        한 줄의 코드가 사람의 일상을 효율적으로 바꾼다고 믿으며, 완벽한 설계보다 꾸준한 개선과 실전 적용을 중시합니다.<br>
                        기술을 단순한 '실험'이 아닌 운영 가능한 결과물로 완성하는 것을 목표로 매일 조금씩 전진하고 있습니다 :)
                    </p>

                    <hr>

                    <h3>🔧 내가 만들고 있는 것</h3>
                    <ul>
                        <li>Clean Architecture 기반의 유지보수 가능한 백엔드 & 데이터 파이프라인</li>
                        <li>Airflow·MLflow·Docker를 활용한 AI 자동화 및 MLOps 인프라 구축</li>
                        <li>데이터 중심 운영 가능한 AI 서비스 구조화 및 배포 파이프라인</li>
                    </ul>

                    <h3>🚀 내가 탐구 중인 분야</h3>
                    <ul>
                        <li>공공데이터 분석 및 활용 서비스 개발 (부동산, 교육, 교통 등)</li>
                        <li>모델 서빙 및 API 최적화 (BentoML, FastAPI, GPU 효율화)</li>
                        <li>분산형 데이터 처리 및 스트리밍 시스템 (Kafka, Redis Streams 등)</li>
                        <li>데이터 시각화 및 인터랙티브 대시보드 (Streamlit, Plotly 등)</li>
                    </ul>

                    <div class="field-row" style="margin-top: 20px;">
                        <blockquote style="border-left: 4px solid #808080; padding-left: 10px; margin-left: 0;">
                            <strong>💬 Motto / 모토</strong><br>
                            "습관은 기질을 압도한다."
                        </blockquote>
                    </div>

                    <h3>💼 Experience</h3>
                    <ul>
                        <li><strong>커널아카데미(UpstageAI)</strong> (교육) (2025.03 ~ 2025.10) : Upstage AI Lab 13기(AI Bootcamp)</li>
                        <li><strong>제로랩 (연구원)</strong> (2021.06 ~ 2022.12) : 제로랩 기업부설연구소의 연구원으로 R&D 사업 진행</li>
                    </ul>
                </div>
            </div>
        `;
    } else {
        // Contact Page
        postListContainer.innerHTML = `
            <div class="window post-card">
                <div class="title-bar"><div class="title-bar-text">CONTACT.TXT</div></div>
                <div class="window-body">
                    <h3>Contact Info</h3>
                    <p>Email: relaxman@example.com</p>
                    <p>GitHub: github.com/wlswjd</p>
                </div>
            </div>
        `;
    }
    goBackToList(); 
    updatePostCountDisplay(null);
}

// Tab Switching Logic
function switchTab(tabName) {
    // Pause games if leaving tab
    if (tabName !== 'game' && typeof stopDino === 'function') stopDino();
    if (tabName !== 'tetris' && typeof stopTetris === 'function') stopTetris();

    // Update buttons
    document.querySelectorAll('[role="tab"]').forEach(el => {
        el.setAttribute('aria-selected', 'false');
    });
    document.getElementById(`tab-${tabName}-btn`).setAttribute('aria-selected', 'true');

    // Update content visibility
    document.querySelectorAll('.tab-view').forEach(el => {
        el.classList.remove('active');
    });
    const activeView = document.getElementById(`${tabName}-view`);
    if (activeView) {
        activeView.classList.add('active');
    }
}

function updatePostCountDisplay(count) {
    if (!postCountDisplay) return;
    if (typeof count === 'number') {
        postCountDisplay.textContent = `현재 글: ${count}개`;
    } else {
        postCountDisplay.textContent = '';
    }
}
