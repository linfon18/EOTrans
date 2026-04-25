// ========== 随机背景图/视频（同一会话内不变） ==========
(function() {
    var bgItems = [
        { type: 'img', src: 'images/bg/bg-1.jpg' },
        { type: 'img', src: 'images/bg/bg-2.jpg' },
        { type: 'img', src: 'images/bg/bg-3.jpg' },
        { type: 'vid', src: 'images/bg/bg-4.mp4' },
        { type: 'vid', src: 'images/bg/bg-5.mp4' }
    ];
    var storageKey = 'ysy_bg_index';
    var index = sessionStorage.getItem(storageKey);
    if (index === null) {
        index = Math.floor(Math.random() * bgItems.length);
        sessionStorage.setItem(storageKey, index);
    } else {
        index = parseInt(index, 10);
    }
    // 创建遮罩层
    var overlay = document.createElement('div');
    overlay.className = 'bg-overlay';
    document.body.insertBefore(overlay, document.body.firstChild);

    var item = bgItems[index];
    if (item.type === 'vid') {
        var video = document.createElement('video');
        video.src = item.src;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1;pointer-events:none;';
        document.body.insertBefore(video, overlay);
    } else {
        var img = new Image();
        img.onload = function() {
            document.body.style.backgroundImage = 'url(' + item.src + ')';
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.style.backgroundRepeat = 'no-repeat';
        };
        img.src = item.src;
    }
})();

// ========== 星星背景生成 ==========
(function() {
    var starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    for (var i = 0; i < 80; i++) {
        var star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 60 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (2 + Math.random() * 3) + 's';
        star.style.width = (1 + Math.random() * 2) + 'px';
        star.style.height = star.style.width;
        starsContainer.appendChild(star);
    }

    // 新增：十字星装饰
    for (var j = 0; j < 8; j++) {
        var cross = document.createElement('div');
        cross.className = 'star-cross';
        cross.style.left = (5 + Math.random() * 90) + '%';
        cross.style.top = (5 + Math.random() * 50) + '%';
        cross.style.animationDelay = Math.random() * 4 + 's';
        cross.style.animationDuration = (3 + Math.random() * 4) + 's';
        starsContainer.appendChild(cross);
    }
})();

// ========== Hero 浮动粒子生成 ==========
(function() {
    var particlesContainer = document.getElementById('heroParticles');
    if (!particlesContainer) return;
    var particleCount = 20;
    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        var isStar = Math.random() > 0.5;
        particle.className = 'hero-particle' + (isStar ? ' star-shape' : '');
        var size = 2 + Math.random() * 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (12 + Math.random() * 20) + 's';
        particle.style.animationDelay = (Math.random() * 15) + 's';
        if (!isStar) {
            // 圆形粒子 - 金色光点
            var opacity = 0.15 + Math.random() * 0.35;
            particle.style.background = 'rgba(245, 158, 11, ' + opacity + ')';
            particle.style.boxShadow = '0 0 ' + (size * 2) + 'px rgba(245, 158, 11, ' + (opacity * 0.5) + ')';
        } else {
            // 十字星粒子
            particle.style.width = (size + 4) + 'px';
            particle.style.height = (size + 4) + 'px';
        }
        particlesContainer.appendChild(particle);
    }
})();

// ========== 爪印装饰生成 ==========
(function() {
    var pawContainer = document.getElementById('pawPrints');
    if (!pawContainer) return;
    var pawChars = ['\u271D', '\u271F', '\u2720'];
    for (var i = 0; i < 12; i++) {
        var paw = document.createElement('div');
        paw.className = 'paw';
        paw.textContent = pawChars[Math.floor(Math.random() * pawChars.length)];
        paw.style.left = Math.random() * 90 + '%';
        paw.style.top = Math.random() * 90 + '%';
        paw.style.animationDelay = Math.random() * 20 + 's';
        paw.style.animationDuration = (15 + Math.random() * 15) + 's';
        paw.style.fontSize = (0.8 + Math.random() * 1.2) + 'rem';
        pawContainer.appendChild(paw);
    }
})();

// ========== 导航栏滚动效果 ==========
var navbar = document.getElementById('navbar');
var backToTop = document.getElementById('backToTop');
if (navbar && backToTop) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== 移动端导航切换 ==========
var navToggle = document.getElementById('navToggle');
var navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', function() {
        navLinks.classList.toggle('open');
    });

    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            navLinks.classList.remove('open');
        });
    });
}

// ========== 角色搜索与筛选 ==========
var charSearch = document.getElementById('charSearch');
var charGrid = document.getElementById('characterGrid');
var noResults = document.getElementById('noResults');
if (charSearch && charGrid && noResults) {
    var filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    var currentFilter = 'all';

    function filterCharacters() {
        var searchTerm = charSearch.value.toLowerCase().trim();
        var cards = charGrid.querySelectorAll('.character-card');
        var visibleCount = 0;

        cards.forEach(function(card) {
            var name = card.dataset.name.toLowerCase();
            var type = card.dataset.type.toLowerCase();
            var text = card.textContent.toLowerCase();

            var matchesSearch = !searchTerm || text.indexOf(searchTerm) !== -1;
            var matchesFilter = currentFilter === 'all' || type === currentFilter.toLowerCase();

            if (matchesSearch && matchesFilter) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        noResults.classList.toggle('show', visibleCount === 0);
    }

    charSearch.addEventListener('input', filterCharacters);

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterCharacters();
        });
    });

    // ========== 角色排序 ==========
    var charSort = document.getElementById('charSort');
    if (charSort) {
        charSort.addEventListener('change', function() {
            var cards = Array.from(charGrid.querySelectorAll('.character-card'));
            var sortBy = charSort.value;

            cards.sort(function(a, b) {
                if (sortBy === 'name') {
                    return a.dataset.name.localeCompare(b.dataset.name, 'zh-CN');
                } else if (sortBy === 'first_ep') {
                    var aEp = parseInt(a.querySelector('.stat-value').textContent) || 9999;
                    var bEp = parseInt(b.querySelector('.stat-value').textContent) || 9999;
                    return aEp - bEp;
                } else if (sortBy === 'total_ep') {
                    var aTotal = parseInt(a.querySelectorAll('.stat-value')[1].textContent) || 0;
                    var bTotal = parseInt(b.querySelectorAll('.stat-value')[1].textContent) || 0;
                    return bTotal - aTotal;
                }
                return 0;
            });

            cards.forEach(function(card) {
                charGrid.appendChild(card);
            });
        });
    }
}

// ========== 话数搜索与筛选 ==========
var epSearch = document.getElementById('epSearch');
if (epSearch) {
    var arcFilterBtns = document.querySelectorAll('.filter-btn[data-arc-filter]');
    var currentArcFilter = 'all';

    function filterEpisodes() {
        var searchTerm = epSearch.value.toLowerCase().trim();
        var arcs = document.querySelectorAll('.episode-arc');

        arcs.forEach(function(arc) {
            var arcName = arc.dataset.arc;
            var entries = arc.querySelectorAll('.episode-entry');
            var visibleInArc = 0;

            var arcVisible = currentArcFilter === 'all' || arcName === currentArcFilter;

            entries.forEach(function(entry) {
                var text = entry.textContent.toLowerCase();
                var matchesSearch = !searchTerm || text.indexOf(searchTerm) !== -1;

                if (matchesSearch && arcVisible) {
                    entry.style.display = '';
                    visibleInArc++;
                } else {
                    entry.style.display = 'none';
                }
            });

            arc.style.display = (arcVisible && (visibleInArc > 0 || !searchTerm)) ? '' : 'none';
        });
    }

    epSearch.addEventListener('input', filterEpisodes);

    arcFilterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            arcFilterBtns.forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            currentArcFilter = btn.dataset.arcFilter;
            filterEpisodes();
        });
    });
}

// ========== 模态框 ==========
var modalOverlay = document.getElementById('modalOverlay');
var modalContent = document.getElementById('modalContent');
var modalClose = document.getElementById('modalClose');

if (modalOverlay && modalContent && modalClose) {
    // Make openModal globally accessible for gallery onclick
    window.openModal = function(element) {
        var img = element.querySelector('img');
        var caption = element.querySelector('.gallery-caption');
        if (img && img.src) {
            modalContent.innerHTML = '<img src="' + img.src + '" style="width:100%;border-radius:12px;margin-bottom:16px;" alt="' + (caption ? caption.textContent : '') + '">' +
                (caption ? '<p style="text-align:center;color:var(--text-secondary);">' + caption.textContent + '</p>' : '');
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) closeModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    // ========== 角色卡片点击展开详情 ==========
    document.querySelectorAll('.character-card').forEach(function(card) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function() {
            var name = card.querySelector('.card-name').textContent;
            var desc = card.querySelector('.card-desc').textContent;
            var img = card.querySelector('.card-image');
            var imgHtml = '';
            if (img && img.src) {
                imgHtml = '<img src="' + img.src + '" style="width:100%;max-height:300px;object-fit:cover;border-radius:12px;margin-bottom:16px;" onerror="this.style.display=\'none\'">';
            }
            var tagsHtml = '';
            card.querySelectorAll('.tag').forEach(function(tag) {
                tagsHtml += '<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:0.8rem;margin-right:6px;background:rgba(245,158,11,0.1);color:var(--accent-gold);">' + tag.textContent + '</span>';
            });
            var statsHtml = '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:16px 0;padding:12px;background:rgba(0,0,0,0.2);border-radius:10px;">';
            card.querySelectorAll('.stat').forEach(function(stat) {
                statsHtml += '<div style="text-align:center;"><span style="display:block;font-size:0.75rem;color:var(--text-muted);">' + stat.querySelector('.stat-label').textContent + '</span><span style="display:block;font-size:0.9rem;color:var(--accent-gold);font-weight:600;">' + stat.querySelector('.stat-value').textContent + '</span></div>';
            });
            statsHtml += '</div>';

            modalContent.innerHTML = imgHtml +
                '<h2>' + name + '</h2>' +
                '<div style="margin-bottom:12px;">' + tagsHtml + '</div>' +
                statsHtml +
                '<p>' + desc + '</p>' +
                '<p style="font-size:0.85rem;color:var(--text-muted);margin-top:12px;">' + (card.querySelector('.card-location') ? card.querySelector('.card-location').textContent : '') + '</p>';
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });
}

// ========== 滚动动画 - 增强版 ==========
(function() {
    // 先为网格卡片添加动画类
    document.querySelectorAll('.arc-grid, .character-grid, .species-grid, .gallery-grid, .fanworks-grid').forEach(function(grid) {
        var cards = grid.children;
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.add('fade-in', 'stagger-' + Math.min(i + 1, 5));
        }
    });

    var animClasses = ['fade-in', 'slide-in-left', 'slide-in-right', 'scale-in'];
    var allElements = [];
    animClasses.forEach(function(cls) {
        document.querySelectorAll('.' + cls).forEach(function(el) {
            allElements.push(el);
        });
    });

    if (allElements.length > 0) {
        // 使用 reduced-motion 媒体查询检测用户偏好
        var prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // 如果用户偏好减少动画，直接显示所有元素
            allElements.forEach(function(el) {
                el.classList.add('visible');
            });
        } else {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            allElements.forEach(function(el) {
                observer.observe(el);
            });
        }
    }
})();
