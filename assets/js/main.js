/* =========================================================
   Soyeon Kim Portfolio — shared behavior
   - Renders the common header/footer into #site-header / #site-footer
   - KO/EN toggle (copy lives inline as lang="ko" / lang="en" siblings)
   - Mobile menu, scroll reveal, e-mail copy
   ========================================================= */

const EMAIL = '7syeonk29@gmail.com';

const LINKS = {
    linkedin: 'https://www.linkedin.com/in/soyeon-kim-735996394',
    github: 'https://github.com/sol729',
    figma: 'https://www.figma.com/design/xteqtuAjhzONe38m1xGFaz/%EC%BA%90%EB%9F%AC%EC%85%80-%EC%BD%98%ED%85%90%EC%B8%A0-%EB%AA%A8%EC%9D%8C_%EA%B9%80%EC%86%8C%EC%97%B0?node-id=2-5',
    portfolio: 'https://drive.google.com/drive/folders/12Eg0Wg3hJxGtJngfE_HioBsgVnFIuzoo?usp=sharing',
    resume: 'https://drive.google.com/drive/folders/12_uu06jVCLRqLd8jphip2cSTAtKFF7N7?usp=sharing',
};

const NAV = [
    {href: 'about.html', ko: '소개', en: 'About'},
    {href: 'skills.html', ko: '역량', en: 'Skills'},
    {href: 'career.html', ko: '경력', en: 'Career'},
    {href: 'archiving.html', ko: '프로젝트', en: 'Projects'},
];

// Pages in sub-folders (e.g. projects/) set <body data-root="../">
const ROOT = document.body.dataset.root || '';

const bi = (ko, en) => `<span lang="ko">${ko}</span><span lang="en">${en}</span>`;

// ---------- Header ----------
function renderHeader() {
    const slot = document.getElementById('site-header');
    if (!slot) return;

    const current = location.pathname.split('/').pop() || 'index.html';
    const navLinks = NAV.map(item => {
        const active = current === item.href || document.body.dataset.section === item.href;
        return `<a href="${ROOT}${item.href}"${active ? ' aria-current="page"' : ''}>${bi(item.ko, item.en)}</a>`;
    }).join('');

    slot.innerHTML = `
        <header class="site-header">
            <div class="container">
                <a href="${ROOT}index.html" class="brand">Soyeon Kim<span>.</span></a>
                <nav class="nav" id="site-nav" aria-label="Main">${navLinks}</nav>
                <div class="header-actions">
                    <div class="lang-toggle" role="group" aria-label="Language">
                        <button type="button" data-set-lang="ko">KO</button>
                        <button type="button" data-set-lang="en">EN</button>
                    </div>
                    <button type="button" class="menu-btn" aria-controls="site-nav" aria-expanded="false" aria-label="Menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </div>
        </header>`;

    const header = slot.querySelector('.site-header');
    const menuBtn = slot.querySelector('.menu-btn');

    menuBtn.addEventListener('click', () => {
        const open = document.body.classList.toggle('menu-open');
        menuBtn.setAttribute('aria-expanded', String(open));
    });
    slot.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
        document.body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
    }));

    const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    window.addEventListener('scroll', onScroll, {passive: true});
    onScroll();
}

// ---------- Footer ----------
function renderFooter() {
    const slot = document.getElementById('site-footer');
    if (!slot) return;

    slot.innerHTML = `
        <footer class="site-footer">
            <div class="container">
                <div class="footer-cta">
                    <div>
                        <h2 class="h-section">
                            ${bi('함께 성장할 <span class="hl">기회</span>를<br>기다리고 있어요',
                                 'Let’s build <span class="serif">something</span><br>together')}
                        </h2>
                        <p>${bi('새로운 커리어 기회와 커피챗은 언제나 환영합니다.',
                                'Open to new roles and always happy to grab a coffee chat.')}</p>
                    </div>
                    <button type="button" class="btn" data-copy-email>
                        ${EMAIL} <span class="arrow" aria-hidden="true">⧉</span>
                    </button>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2026 Kim Soyeon. All rights reserved.</p>
                    <ul class="footer-links">
                        <li><a href="${LINKS.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
                        <li><a href="${LINKS.github}" target="_blank" rel="noopener">GitHub</a></li>
                        <li><a href="${LINKS.resume}" target="_blank" rel="noopener">Resume</a></li>
                        <li><a href="${LINKS.figma}" target="_blank" rel="noopener">Figma</a></li>
                        <li><a href="${LINKS.portfolio}" target="_blank" rel="noopener">${bi('PPT 포트폴리오', 'PDF Portfolio')}</a></li>
                    </ul>
                </div>
            </div>
        </footer>`;
}

// ---------- Language ----------
function setLang(lang) {
    const html = document.documentElement;
    html.dataset.lang = lang;
    html.lang = lang;
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage blocked */ }

    document.querySelectorAll('[data-set-lang]').forEach(btn => {
        btn.setAttribute('aria-pressed', String(btn.dataset.setLang === lang));
    });

    const title = html.dataset[lang === 'en' ? 'titleEn' : 'titleKo'];
    if (title) document.title = title;
}

function initLang() {
    setLang(document.documentElement.dataset.lang === 'en' ? 'en' : 'ko');
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-set-lang]');
        if (btn) setLang(btn.dataset.setLang);
    });
}

// ---------- E-mail copy ----------
let toastTimer;
function toast(message) {
    let el = document.querySelector('.toast');
    if (!el) {
        el = document.createElement('div');
        el.className = 'toast';
        el.setAttribute('role', 'status');
        document.body.appendChild(el);
    }
    el.innerHTML = message;
    el.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-show'), 2400);
}

function initEmailCopy() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('[data-copy-email]');
        if (!btn) return;
        e.preventDefault();
        const done = () => toast(bi('이메일 주소를 복사했어요 💛', 'E-mail copied to clipboard 💛'));
        if (navigator.clipboard) {
            navigator.clipboard.writeText(EMAIL).then(done, () => { location.href = `mailto:${EMAIL}`; });
        } else {
            location.href = `mailto:${EMAIL}`;
        }
    });
}

// ---------- Scroll reveal ----------
function initReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
        items.forEach(el => el.classList.add('is-visible'));
        return;
    }
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                io.unobserve(entry.target);
            }
        });
    }, {rootMargin: '0px 0px -8% 0px'});
    items.forEach(el => io.observe(el));
}

// ---------- Photo galleries ----------
// <div class="gallery" data-path="assets/img/archive/usco" data-count="40" [data-start="1"] data-alt="..."></div>
// builds a horizontal strip of 01.jpg … NN.jpg with prev/next buttons; clicking a photo opens the lightbox.
function initGalleries() {
    document.querySelectorAll('.gallery[data-path]').forEach(gallery => {
        const {path, count, start = 1, alt = ''} = gallery.dataset;
        const total = Number(count);
        const items = Array.from({length: total}, (_, i) => {
            const n = String(Number(start) + i).padStart(2, '0');
            return `<button type="button" class="gallery-item" data-index="${i}">
                        <img src="${path}/${n}.jpg" alt="${alt} ${i + 1}" loading="lazy" decoding="async">
                    </button>`;
        }).join('');

        gallery.innerHTML = `
            <div class="gallery-track">${items}</div>
            <div class="gallery-bar">
                <span class="gallery-count">${bi(`사진 ${total}장`, `${total} photos`)}</span>
                <div class="gallery-btns">
                    <button type="button" data-dir="-1" aria-label="Previous">←</button>
                    <button type="button" data-dir="1" aria-label="Next">→</button>
                </div>
            </div>`;

        const track = gallery.querySelector('.gallery-track');
        const [prev, next] = gallery.querySelectorAll('[data-dir]');
        const update = () => {
            prev.disabled = track.scrollLeft <= 2;
            next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
        };
        gallery.querySelectorAll('[data-dir]').forEach(btn => btn.addEventListener('click', () => {
            track.scrollBy({left: Number(btn.dataset.dir) * track.clientWidth * 0.8});
        }));
        track.addEventListener('scroll', update, {passive: true});
        window.addEventListener('resize', update);
        track.querySelectorAll('img').forEach(img => img.addEventListener('load', update, {once: true}));
        update();

        const srcs = Array.from(track.querySelectorAll('img'), img => img.src);
        track.addEventListener('click', e => {
            const item = e.target.closest('.gallery-item');
            if (item) openLightbox(srcs, Number(item.dataset.index));
        });
    });
}

let lightbox;
function openLightbox(srcs, start) {
    if (!lightbox) {
        lightbox = document.createElement('dialog');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-top">
                <span class="lightbox-count"></span>
                <button type="button" data-close aria-label="Close">✕</button>
            </div>
            <div class="lightbox-stage">
                <button type="button" data-step="-1" aria-label="Previous">←</button>
                <img alt="">
                <button type="button" data-step="1" aria-label="Next">→</button>
            </div>`;
        document.body.appendChild(lightbox);

        lightbox.addEventListener('click', e => {
            if (e.target.closest('[data-close]') || e.target === lightbox || e.target.classList.contains('lightbox-stage')) {
                lightbox.close();
            }
            const step = e.target.closest('[data-step]');
            if (step) lightbox.go(Number(step.dataset.step));
        });
        lightbox.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') lightbox.go(-1);
            if (e.key === 'ArrowRight') lightbox.go(1);
        });
        // swipe on touch screens
        let startX = null;
        lightbox.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive: true});
        lightbox.addEventListener('touchend', e => {
            if (startX === null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 40) lightbox.go(dx < 0 ? 1 : -1);
            startX = null;
        });
    }

    let index = start;
    const img = lightbox.querySelector('img');
    const counter = lightbox.querySelector('.lightbox-count');
    const render = () => {
        img.src = srcs[index];
        counter.textContent = `${index + 1} / ${srcs.length}`;
    };
    lightbox.go = step => {
        index = (index + step + srcs.length) % srcs.length;
        render();
    };
    render();
    lightbox.showModal();
}

renderHeader();
renderFooter();
initLang();
initEmailCopy();
initGalleries();
initReveal();
