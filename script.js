window.addEventListener('load', () => {
    const transLayer = document.getElementById('page-transition-layer');
    if (transLayer) {
        requestAnimationFrame(() => { transLayer.style.left = '-100%'; });
    }

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

    // 네비게이션 점프 이동
    window.scrollToSection = (index) => {
        const isMobile = window.innerWidth < 768;
        const introScroll = window.innerHeight * 7.5;
        
        let targetScroll = 0;
        if (isMobile) {
            if (index === 0) targetScroll = introScroll;
            if (index === 1) targetScroll = introScroll + (secAbout ? secAbout.offsetTop : 0);
            if (index === 2) targetScroll = introScroll + (secWork ? secWork.offsetTop : 0);
        } else {
            const pauseScroll = window.innerHeight * 1.5;
            const moveScroll = window.innerHeight * 2;
            if (index === 0) targetScroll = introScroll; 
            if (index === 1) targetScroll = introScroll + pauseScroll + moveScroll; 
            if (index === 2) targetScroll = introScroll + (pauseScroll * 2) + (moveScroll * 2); 
        }
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    function updateScroll() {
        const isMobile = window.innerWidth < 768;
        const introScroll = window.innerHeight * 7.5;
        const pauseScroll = window.innerHeight * 1.5;
        const moveScroll = window.innerHeight * 2;

        // 전체 스크롤 길이 업데이트
        if (scrollH) {
            if (isMobile) {
                // 모바일: 인트로 + 컨텐츠 실제 높이만큼 
                const contentH = mainContent ? mainContent.offsetHeight : window.innerHeight * 3;
                scrollH.style.height = `${introScroll + contentH}px`;
            } else {
                // 데스크톱: 애니메이션 딜레이 포함 높이
                scrollH.style.height = `${introScroll + (pauseScroll * 2) + (moveScroll * 2) + window.innerHeight}px`;
            }
        }

        const scrollTop = window.scrollY;

        // --- A. 인트로 애니메이션 ---
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
                
                if (isMobile) {
                    // [모바일] 화면 뭉침 버그 해결! % 대신 화면 딱 1칸인 vh로 애니메이션
                    if (progress < 1) {
                        mainContent.style.position = 'fixed';
                        mainContent.style.top = '0px';
                        mainContent.style.transform = `translateY(${(p4 - 1) * 100}vh)`; 
                    } else {
                        mainContent.style.position = 'absolute';
                        mainContent.style.top = `${introScroll}px`;
                        mainContent.style.transform = 'translateY(0)';
                    }
                } else {
                    // 데스크톱 유지
                    mainContent.style.position = 'fixed';
                    mainContent.style.top = '0px';
                    mainContent.style.transform = `translateY(${(p4 - 1) * 100}%)`;
                }
            }
            if (p4 > 0.8 && gnb) { gnb.classList.remove('invisible'); gnb.style.opacity = 1; }
        }

        // --- B. 화면 전환 로직 ---
        if (isMobile) {
            if (secIndex) { secIndex.style.transform = 'none'; secIndex.style.opacity = 1; }
            if (secAbout) { secAbout.style.transform = 'none'; secAbout.style.opacity = 1; }
            if (secWork) { secWork.style.transform = 'none'; secWork.style.opacity = 1; }

            // GNB 메뉴 활성화 상태 업데이트
            if (progress >= 1 && secAbout && secWork) {
                const scrollPastIntro = scrollTop - introScroll;
                const triggerOffset = window.innerHeight * 0.3; 
                
                if (scrollPastIntro >= secWork.offsetTop - triggerOffset) {
                    document.body.className = 'work-view';
                    if (navAbout) navAbout.classList.remove('active');
                    if (navWork) navWork.classList.add('active');
                } else if (scrollPastIntro >= secAbout.offsetTop - triggerOffset) {
                    document.body.className = 'about-view';
                    if (navAbout) navAbout.classList.add('active');
                    if (navWork) navWork.classList.remove('active');
                } else {
                    document.body.className = 'index-view';
                    if (navAbout) navAbout.classList.remove('active');
                    if (navWork) navWork.classList.remove('active');
                }
            }
        } else {
            // [데스크톱] 기존의 입체 스크롤 (손대지 않음!)
            const afterIntroScroll = scrollTop - introScroll;

            if (afterIntroScroll <= 0) {
                if (secIndex) { secIndex.style.transform = `scale(1) translateX(0)`; secIndex.style.opacity = 1; secIndex.style.overflowY = 'auto'; }
                if (secAbout) { secAbout.style.transform = `translateX(100vw)`; secAbout.style.opacity = 1; secAbout.style.overflowY = 'hidden'; }
                if (secWork) { secWork.style.transform = `translateX(100vw)`; secWork.style.overflowY = 'hidden'; }
                document.body.className = 'index-view';
            } 
            else if (afterIntroScroll > 0 && afterIntroScroll <= pauseScroll) {
                if (secIndex) { secIndex.style.transform = `scale(1) translateX(0)`; secIndex.style.opacity = 1; secIndex.style.overflowY = 'auto'; }
                if (secAbout) { secAbout.style.transform = `translateX(100vw)`; secAbout.style.opacity = 1; secAbout.style.overflowY = 'hidden'; }
                if (secWork) { secWork.style.transform = `translateX(100vw)`; secWork.style.overflowY = 'hidden'; }
                document.body.className = 'index-view';
            } 
            else if (afterIntroScroll > pauseScroll && afterIntroScroll <= pauseScroll + moveScroll) {
                const slideScroll = afterIntroScroll - pauseScroll;
                const p = slideScroll / moveScroll; 
                if (secIndex) { secIndex.style.transform = `scale(${1 - p * 0.05}) translateX(-${p * 15}vw)`; secIndex.style.opacity = 1 - p * 0.8; secIndex.style.overflowY = 'hidden'; }
                if (secAbout) { secAbout.style.transform = `translateX(${100 - p * 100}vw)`; secAbout.style.opacity = 1; secAbout.style.overflowY = 'hidden'; }
                if (secWork) { secWork.style.transform = `translateX(100vw)`; secWork.style.overflowY = 'hidden'; }
                document.body.className = p > 0.5 ? 'about-view' : 'index-view';
                if (navAbout) navAbout.classList.toggle('active', p > 0.5);
                if (navWork) navWork.classList.remove('active');
            }
            else if (afterIntroScroll > pauseScroll + moveScroll && afterIntroScroll <= (pauseScroll * 2) + moveScroll) {
                if (secIndex) { secIndex.style.opacity = 0; secIndex.style.overflowY = 'hidden'; }
                if (secAbout) { secAbout.style.transform = `scale(1) translateX(0)`; secAbout.style.opacity = 1; secAbout.style.overflowY = 'auto'; }
                if (secWork) { secWork.style.transform = `translateX(100vw)`; secWork.style.overflowY = 'hidden'; }
                document.body.className = 'about-view';
                if (navAbout) navAbout.classList.add('active');
                if (navWork) navWork.classList.remove('active');
            }
            else if (afterIntroScroll > (pauseScroll * 2) + moveScroll && afterIntroScroll <= (pauseScroll * 2) + (moveScroll * 2)) {
                const slideScroll = afterIntroScroll - ((pauseScroll * 2) + moveScroll);
                const p = slideScroll / moveScroll; 
                if (secIndex) { secIndex.style.opacity = 0; secIndex.style.overflowY = 'hidden'; }
                if (secAbout) { secAbout.style.transform = `scale(${1 - p * 0.05}) translateX(-${p * 15}vw)`; secAbout.style.opacity = 1 - p * 0.8; secAbout.style.overflowY = 'hidden'; }
                if (secWork) { secWork.style.transform = `translateX(${100 - p * 100}vw)`; secWork.style.overflowY = 'hidden'; }
                document.body.className = p > 0.5 ? 'work-view' : 'about-view';
                if (navAbout) navAbout.classList.toggle('active', p <= 0.5);
                if (navWork) navWork.classList.toggle('active', p > 0.5);
            }
            else {
                if (secIndex) { secIndex.style.opacity = 0; secIndex.style.overflowY = 'hidden'; }
                if (secAbout) { secAbout.style.transform = `scale(0.95) translateX(-15vw)`; secAbout.style.opacity = 0; secAbout.style.overflowY = 'hidden'; }
                if (secWork) { secWork.style.transform = `translateX(0)`; secWork.style.overflowY = 'auto'; }
                document.body.className = 'work-view';
                if (navAbout) navAbout.classList.remove('active');
                if (navWork) navWork.classList.add('active');
            }
        }
    }

    window.addEventListener('scroll', updateScroll);
    window.addEventListener('resize', updateScroll);
    updateScroll();

    // Work Page (Sanity 연동 부분)
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
                if (container) container.innerHTML = `<p class="text-red-500 text-center py-20 col-span-full">데이터 로드 실패</p>`;
            }
        }

        function renderProjects(list) {
            if (!container) return;
            container.innerHTML = ''; 
            
            if (!list || list.length === 0) {
                container.innerHTML = `<p class="py-20 text-center col-span-full">프로젝트가 없습니다.</p>`;
                return;
            }

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
            if (detailImageData.length > 0) {
                detailImages.innerHTML = detailImageData.map(img => `<img src="${urlFor(img).width(1600).url()}" alt="detail">`).join('');
            } else {
                detailImages.innerHTML = `<p class="text-white text-center py-10">상세 이미지가 없습니다.</p>`;
            }
            
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

                const currentCards = container.querySelectorAll('.project-card');
                currentCards.forEach(card => {
                    card.classList.remove('is-visible');
                    card.style.transform = 'translateY(20px)';
                    card.style.opacity = '0';
                });

                setTimeout(() => {
                    const filter = button.dataset.filter;
                    const filtered = filter === 'all' ? allProjects : allProjects.filter(p => p.category === filter);
                    renderProjects(filtered);
                }, 400); 
            });
        });

        fetchProjects();
    }
});