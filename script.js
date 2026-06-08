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
    // 🌟 2. 아카이빙 페이지 전용 기능 (새로 추가됨)
    // ==========================================

    // [기능 A] 사진 확대 모달 (팝업창)
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const closeBtn = document.querySelector(".modal-close");
    const galleryImages = document.querySelectorAll(".gallery-img");

    if(modal) {
        // 사진을 클릭하면 원본 사이즈로 팝업!
        galleryImages.forEach(img => {
            img.addEventListener("click", function() {
                modal.style.display = "block";
                modalImg.src = this.src;
            });
        });

        // 닫기 버튼이나 여백을 클릭하면 닫힘
        closeBtn.addEventListener("click", () => modal.style.display = "none");
        window.addEventListener("click", (e) => {
            if (e.target === modal) modal.style.display = "none";
        });
    }

    // [기능 B] 갤러리 자동 스크롤 & 양옆 넘기기 버튼 컨트롤
    const rightPanels = document.querySelectorAll('.timeline-right');

    rightPanels.forEach(panel => {
        const container = panel.querySelector('.gallery-container');
        const track = panel.querySelector('.gallery-track');
        const prevBtn = panel.querySelector('.prev-btn');
        const nextBtn = panel.querySelector('.next-btn');

        if (!container || !track) return; // 요소가 없으면 건너뜀

        let scrollInterval;

        // 자동으로 부드럽게 흘러가는 함수
        function startAutoScroll() {
            scrollInterval = setInterval(() => {
                container.scrollLeft += 1; // 스크롤 속도

                // 사진들이 끝까지 가기 전에 처음으로 몰래 되돌려서 무한루프 느낌!
                if (container.scrollLeft >= track.scrollWidth / 2) {
                    container.scrollLeft = 0;
                }
            }, 20);
        }

        function stopAutoScroll() {
            clearInterval(scrollInterval);
        }

        // 사진 틀에 마우스를 올리면 멈춤, 떼면 다시 출발
        container.addEventListener('mouseenter', stopAutoScroll);
        container.addEventListener('mouseleave', startAutoScroll);

        // 버튼을 누를 때 수동으로 스크롤 넘기기
        if(prevBtn) {
            prevBtn.addEventListener('mouseenter', stopAutoScroll);
            prevBtn.addEventListener('mouseleave', startAutoScroll);
            prevBtn.addEventListener('click', () => {
                container.scrollBy({ left: -350, behavior: 'smooth' }); // 왼쪽으로 350px 쓱 넘김
            });
        }

        if(nextBtn) {
            nextBtn.addEventListener('mouseenter', stopAutoScroll);
            nextBtn.addEventListener('mouseleave', startAutoScroll);
            nextBtn.addEventListener('click', () => {
                container.scrollBy({ left: 350, behavior: 'smooth' }); // 오른쪽으로 350px 쓱 넘김
            });
        }

        // 페이지 진입 시 자동으로 출발!
        startAutoScroll();
    });

});