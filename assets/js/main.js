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

renderHeader();
renderFooter();
initLang();
initEmailCopy();
initReveal();
