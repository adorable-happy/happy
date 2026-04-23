window.addEventListener('load', () => {
    // 페이지 전환 레이어 초기화
    const transLayer = document.getElementById('page-transition-layer');
    if (transLayer) {
        requestAnimationFrame(() => { transLayer.style.left = '-100%'; });
    }

    // 네비게이션 점프 이동
    window.scrollToSection = (index) => {
        const isMobile = window.innerWidth < 768;
        const introScroll = window.innerHeight * 7.5;
        
        let targetScroll = 0;
        if (isMobile) {
            // 모바일은 단순한 높이 합산
            if (index === 0) targetScroll = introScroll;
            if (index === 1) targetScroll = introScroll + window.innerHeight;
            if (index === 2) targetScroll = introScroll + (window.innerHeight * 2);
        } else {
            // 데스크톱은 기존 딜레이 계산
            const pauseScroll = window.innerHeight * 1.5;
            const moveScroll = window.innerHeight * 2;
            if (index === 0) targetScroll = introScroll; 
            if (index === 1) targetScroll = introScroll + pauseScroll + moveScroll; 
            if (index === 2) targetScroll = introScroll + (pauseScroll * 2) + (moveScroll * 2); 
        }
        
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    // DOM 요소
    const scrollH = document.getElementById('scroll-height');
    const maskPath = document.getElementById('mask-path');
    const scrollGuide = document.getElementById('scroll-guide');
    const circleSvg = document.querySelector('.circle-svg');
    const faceImg = document.getElementById('face-img');
    const expandCircle = document.getElementById('expanding-circle');
    const mainContent = document.getElementById('main-content');
    const gnb = document.getElementById('main-gnb');
    const navAbout = document.getElementById('nav-about');
    const navWork = document.getElementById('nav-work');

    const secIndex = document.getElementById('sec-index');
    const secAbout = document.getElementById('sec-about');
    const secWork = document.getElementById('sec-work');

    function updateScroll() {
        const isMobile = window.innerWidth < 768;
        const introScroll = window.innerHeight * 7.5;
        const pauseScroll = window.innerHeight * 1.5;
        const moveScroll = window.innerHeight * 2;

        // 전체 스크롤 길이 업데이트
        if (scrollH) {
            const totalH = isMobile 
                ? introScroll + (window.innerHeight * 3) 
                : introScroll + (pauseScroll * 2) + (moveScroll * 2) + window.innerHeight;
            scrollH.style.height = `${totalH}px`;
        }

        const scrollTop = window.scrollY;
        
        // --- A. 인트로 애니메이션 (공통) ---
        const progress = Math.min(scrollTop / introScroll, 1);
        if (progress <= 0.35) {
            const p1 = progress / 0.35;
            if (maskPath) maskPath.style.strokeDashoffset = 1700 * (1 - p1);
            if (circleSvg) circleSvg.style.opacity = 1;
            if (faceImg) faceImg.style.opacity = 0;
            if (scrollGuide) { scrollGuide.style.opacity = 1 - p1; scrollGuide.style.visibility = 'visible'; }
        } else if (progress > 0.35 && progress <= 0.55) {
            const p2 = (progress - 0.35) / 0.2;
            if (faceImg) faceImg.style.opacity = p2;
            if (circleSvg) circleSvg.style.opacity = 1;
            if (scrollGuide) { scrollGuide.style.opacity = 0; scrollGuide.style.visibility = 'hidden'; }
        } else if (progress > 0.55 && progress <= 0.8) {
            const p3 = (progress - 0.55) / 0.25;
            if (expandCircle) expandCircle.style.transform = `translate(-50%, -50%) scale(${p3 * 500})`;
            if (circleSvg) circleSvg.style.opacity = p3 > 0.9 ? 0 : 1;
            if (mainContent) mainContent.classList.add('invisible');
        } else {
            const p4 = (progress - 0.8) / 0.2;
            if (mainContent) {
                mainContent.classList.remove('invisible');
                if (!isMobile) mainContent.style.transform = `translateY(${(p4 - 1) * 100}%)`;
                else mainContent.style.transform = 'none';
            }
            if (p4 > 0.8 && gnb) { gnb.classList.remove('invisible'); gnb.style.opacity = 1; }
        }

        // --- B. 화면 전환 로직 ---
        if (isMobile) {
            // [모바일 모드] GNB 활성화 상태만 체크
            const currentPos = scrollTop - introScroll;
            if (currentPos < window.innerHeight) {
                document.body.className = 'index-view';
                if (navAbout) navAbout.classList.remove('active');
                if (navWork) navWork.classList.remove('active');
            } else if (currentPos < window.innerHeight * 2) {
                document.body.className = 'about-view';
                if (navAbout) navAbout.classList.add('active');
                if (navWork) navWork.classList.remove('active');
            } else {
                document.body.className = 'work-view';
                if (navAbout) navAbout.classList.remove('active');
                if (navWork) navWork.classList.add('active');
            }
        } else {
            // [데스크톱 모드] 기존 입체 전환 애니메이션
            const afterIntroScroll = scrollTop - introScroll;

            if (afterIntroScroll <= 0) {
                if (secIndex) { secIndex.style.transform = `scale(1) translateX(0)`; secIndex.style.opacity = 1; }
                if (secAbout) { secAbout.style.transform = `translateX(100vw)`; secAbout.style.opacity = 1; }
                if (secWork) { secWork.style.transform = `translateX(100vw)`; }
                document.body.className = 'index-view';
            } 
            else if (afterIntroScroll > 0 && afterIntroScroll <= pauseScroll) {
                if (secIndex) { secIndex.style.transform = `scale(1) translateX(0)`; secIndex.style.opacity = 1; }
                if (secAbout) { secAbout.style.transform = `translateX(100vw)`; }
                document.body.className = 'index-view';
            } 
            else if (afterIntroScroll > pauseScroll && afterIntroScroll <= pauseScroll + moveScroll) {
                const slideScroll = afterIntroScroll - pauseScroll;
                const p = slideScroll / moveScroll; 
                if (secIndex) { secIndex.style.transform = `scale(${1 - p * 0.05}) translateX(-${p * 15}vw)`; secIndex.style.opacity = 1 - p * 0.8; }
                if (secAbout) { secAbout.style.transform = `translateX(${100 - p * 100}vw)`; secAbout.style.opacity = 1; }
                document.body.className = p > 0.5 ? 'about-view' : 'index-view';
                if (navAbout) navAbout.classList.toggle('active', p > 0.5);
            }
            else if (afterIntroScroll > pauseScroll + moveScroll && afterIntroScroll <= (pauseScroll * 2) + moveScroll) {
                if (secAbout) { secAbout.style.transform = `scale(1) translateX(0)`; secAbout.style.opacity = 1; }
                if (secWork) { secWork.style.transform = `translateX(100vw)`; }
                document.body.className = 'about-view';
                if (navAbout) navAbout.classList.add('active');
                if (navWork) navWork.classList.remove('active');
            }
            else if (afterIntroScroll > (pauseScroll * 2) + moveScroll && afterIntroScroll <= (pauseScroll * 2) + (moveScroll * 2)) {
                const slideScroll = afterIntroScroll - ((pauseScroll * 2) + moveScroll);
                const p = slideScroll / moveScroll; 
                if (secAbout) { secAbout.style.transform = `scale(${1 - p * 0.05}) translateX(-${p * 15}vw)`; secAbout.style.opacity = 1 - p * 0.8; }
                if (secWork) { secWork.style.transform = `translateX(${100 - p * 100}vw)`; }
                document.body.className = p > 0.5 ? 'work-view' : 'about-view';
                if (navAbout) navAbout.classList.toggle('active', p <= 0.5);
                if (navWork) navWork.classList.toggle('active', p > 0.5);
            }
            else {
                if (secWork) { secWork.style.transform = `translateX(0)`; }
                document.body.className = 'work-view';
                if (navAbout) navAbout.classList.remove('active');
                if (navWork) navWork.classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);
    updateScroll();

    // Work Page (Sanity 연동)
    const createClient = window.createClient;
    const imageUrlBuilder = window.imageUrlBuilder;

    if (createClient && imageUrlBuilder) {
        let allProjects = [];
        const client = createClient({
            projectId: 'e18cmrnu',
            dataset: 'production',
            apiVersion: '2026-04-22',
            useCdn: true
        });

        const builder = imageUrlBuilder(client);
        const urlFor = (source) => builder.image(source);

        const detailWrap = document.getElementById('project-detail');
        const detailTitle = document.getElementById('detail-title');
        const detailCategory = document.getElementById('detail-category');
        const detailDescription = document.getElementById('detail-description');
        const detailImages = document.getElementById('detail-images');
        const detailClose = document.getElementById('detail-close');
        const container = document.getElementById('project-list');

        async function fetchProjects() {
            try {
                allProjects = await client.fetch(`*[_type == "project"] | order(_createdAt desc)`);
                renderProjects(allProjects);
            } catch (err) {
                console.error('프로젝트 로딩 실패:', err);
            }
        }

        function renderProjects(list) {
            if (!container) return;
            container.innerHTML = list.map(project => `
                <div class="project-card" data-id="${project._id}">
                    <div class="img-box">
                        ${project.mainImage ? `<img src="${urlFor(project.mainImage).width(800).url()}" alt="${project.title || ''}">` : ''}
                    </div>
                    <div class="info">
                        <span class="cat">${project.category || ''}</span>
                        <h3 class="tit">${project.title || ''}</h3>
                    </div>
                </div>
            `).join('');

            const cards = container.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
                setTimeout(() => { card.classList.add('is-visible'); }, index * 100);
            });
            bindProjectClicks();
        }

        function bindProjectClicks() {
            document.querySelectorAll('.project-card').forEach(card => {
                card.addEventListener('click', () => {
                    const project = allProjects.find(item => item._id === card.dataset.id);
                    if (project) openProjectDetail(project);
                });
            });
        }

        function openProjectDetail(project) {
            if (!detailWrap) return;
            detailWrap.classList.remove('hidden');
            detailTitle.textContent = project.title || '';
            detailCategory.textContent = project.category || '';
            detailDescription.textContent = project.description || '';
            const detailImageData = project.contentImages || project.detailImages || [];
            detailImages.innerHTML = detailImageData.map(img => `<img src="${urlFor(img).width(1600).url()}" alt="detail">`).join('');
            document.body.style.overflow = 'hidden'; 
            detailWrap.scrollTop = 0;
        }

        if (detailClose) {
            detailClose.addEventListener('click', () => {
                detailWrap.classList.add('hidden');
                document.body.style.overflow = ''; 
            });
        }

        document.querySelectorAll('.filter-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter;
                const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter);
                renderProjects(filtered);
            });
        });

        fetchProjects();
    }
});