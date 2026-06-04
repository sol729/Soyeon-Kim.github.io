// script.js

document.addEventListener('DOMContentLoaded', () => {

    // 첫 화면 스크롤리텔링 요소들
    const stickyWrapper = document.querySelector('.sticky-wrapper');
    const welcome = document.querySelector('.welcome-area');
    const character = document.querySelector('.character-wrapper');
    const button = document.querySelector('.next-button-container');

    if (stickyWrapper) {
        // 스크롤 할 때마다 위치를 계산하는 함수
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY; // 마우스를 내린 거리
            const vh = window.innerHeight;  // 현재 모니터 화면 1장 높이

            // 1. 아주 살짝 내렸을 때 (화면의 30% 지점 통과) -> WELCOME 등장!
            if (welcome) {
                if (scrollY > vh * 0.3) welcome.classList.add('show');
                else welcome.classList.remove('show'); // 다시 위로 올리면 사라짐
            }

            // 2. 더 내렸을 때 (화면의 90% 지점 통과) -> 캐릭터 등장!
            if (character) {
                if (scrollY > vh * 0.9) character.classList.add('show');
                else character.classList.remove('show');
            }

            // 3. 한참 더 내렸을 때 (화면의 150% 지점 통과) -> 비행기 등장!
            if (button) {
                if (scrollY > vh * 1.5) button.classList.add('show');
                else button.classList.remove('show');
            }
        });
    }
});