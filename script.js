document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 🌟 1. 페이지 요소들 스크롤 애니메이션 (기존 기능 유지)
    // ==========================================
    const stickyWrapper = document.querySelector('.sticky-wrapper');
    const welcome = document.querySelector('.welcome-area');
    const character = document.querySelector('.character-wrapper');
    const button = document.querySelector('.next-button-container');

    if (stickyWrapper) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const vh = window.innerHeight;

            const scrollPrompt = document.querySelector('.scroll-prompt');
            if (scrollPrompt) {
                if (scrollY > 20) scrollPrompt.classList.add('hide');
                else scrollPrompt.classList.remove('hide');
            }

            if (welcome) {
                if (scrollY > vh * 0.3) welcome.classList.add('show');
                else welcome.classList.remove('show');
            }

            if (character) {
                if (scrollY > vh * 0.9) character.classList.add('show');
                else character.classList.remove('show');
            }

            if (button) {
                if (scrollY > vh * 1.5) button.classList.add('show');
                else button.classList.remove('show');
            }
        });
    }

    // ==========================================
    // 🌟 2. 아카이빙 갤러리 무한 스크롤 & 자동 복제 (방향 반대 적용!)
    // ==========================================
    const rightPanels = document.querySelectorAll('.timeline-right');

    rightPanels.forEach(panel => {
        const container = panel.querySelector('.gallery-container');
        const track = panel.querySelector('.gallery-track');
        const prevBtn = panel.querySelector('.prev-btn');
        const nextBtn = panel.querySelector('.next-btn');

        if (!container || !track) return;

        // 💡 HTML 수정 없이 JS가 원본 사진을 가져와 2번 더 복제해서 뒤에 붙입니다! (총 3세트)
        const originalImages = Array.from(track.children);
        for (let i = 0; i < 2; i++) {
            originalImages.forEach(img => {
                const clone = img.cloneNode(true);
                track.appendChild(clone);
            });
        }

        let scrollInterval;

        // 사진 3세트 중 가운데(1세트가 끝나는 지점)로 몰래 스크롤을 이동시켜 둡니다.
        // 이렇게 해야 양옆 어디로 넘기든 빈 공간이 보이지 않습니다.
        setTimeout(() => {
            container.scrollLeft = track.scrollWidth / 3;
        }, 100);

        // 자동으로 스르륵 흘러가는 함수
        function startAutoScroll() {
            scrollInterval = setInterval(() => {
                // 👇 스크롤을 '오른쪽'으로 이동시킵니다 = 화면상 사진은 '오른쪽에서 왼쪽'으로 흐름!
                container.scrollLeft += 1;

                // 💡 스크롤이 2세트 끝(오른쪽 끝)에 닿으면, 아무도 모르게 다시 가운데로 순간이동!
                if (container.scrollLeft >= (track.scrollWidth / 3) * 2) {
                    container.scrollLeft = track.scrollWidth / 3;
                }
                // 만약 수동으로 왼쪽 끝까지 넘겼을 경우를 대비한 안전장치
                else if (container.scrollLeft <= 0) {
                    container.scrollLeft = track.scrollWidth / 3;
                }
            }, 20); // 20은 속도 (숫자가 작을수록 빠름)
        }

        function stopAutoScroll() {
            clearInterval(scrollInterval);
        }

        // 사진 틀에 마우스를 올리면 멈춤, 떼면 다시 출발
        container.addEventListener('mouseenter', stopAutoScroll);
        container.addEventListener('mouseleave', startAutoScroll);

        // 버튼 수동 조작
        if (prevBtn) {
            prevBtn.addEventListener('mouseenter', stopAutoScroll);
            prevBtn.addEventListener('mouseleave', startAutoScroll);
            prevBtn.addEventListener('click', () => {
                container.scrollBy({left: -350, behavior: 'smooth'});
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('mouseenter', stopAutoScroll);
            nextBtn.addEventListener('mouseleave', startAutoScroll);
            nextBtn.addEventListener('click', () => {
                container.scrollBy({left: 350, behavior: 'smooth'});
            });
        }

        // 출발!
        startAutoScroll();
    });

    // ==========================================
    // 🌟 3. 사진 확대 모달 (팝업창)
    // ==========================================
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");
    const galleryImages = document.querySelectorAll(".gallery-img");

    if (modal) {
        galleryImages.forEach(img => {
            img.addEventListener("click", function () {
                modal.style.display = "block";
                modalImg.src = this.src;
            });
        });

        // 닫기 버튼이나 바깥쪽 여백 클릭 시 닫힘
        closeBtn.addEventListener("click", () => modal.style.display = "none");
        window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

});