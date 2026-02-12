// index.js

$(function () {
    const $menuLinks = $('.gnb a[href^="#"]');
    const headerH = 100;        
    let isAnimating = false;

    // 메뉴 active 처리 (공통 함수)
    function setActiveById(id) {
        $menuLinks.each(function () {
            const $a = $(this);
            const href = $a.attr('href');
            const $li = $a.parent('li');

            if (href === id) $li.addClass('active');
            else $li.removeClass('active');
        });
    }

    // 현재 스크롤 위치 기준으로 어떤 섹션이 “활성”인지 계산
    function updateActiveOnScroll() {
        if (isAnimating) return; // 클릭 애니메이션 중에는 스크롤 이벤트로 흔들리지 않게

        const scrollPos = $(window).scrollTop() + headerH; 
        let currentId = null;

        $menuLinks.each(function () {
            const id = $(this).attr('href');
            const $sec = $(id);
            if (!$sec.length) return;

            const top = $sec.offset().top;
            const bottom = top + $sec.outerHeight();

            if (scrollPos >= top && scrollPos < bottom) {
                currentId = id;
            }
        });

        if (currentId) setActiveById(currentId);
    }

    // 스크롤 성능용(가벼운 throttling)
    let rafId = null;
    $(window).on('scroll', function () {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            updateActiveOnScroll();
            rafId = null;
        });
    });

    // 메뉴 클릭: 해당 섹션으로 부드럽게 이동 + active 고정
    $menuLinks.on('click', function (e) {
        e.preventDefault();

        const id = $(this).attr('href');
        const $target = $(id);
        if (!$target.length) return;

        isAnimating = true;
        setActiveById(id); // 클릭 즉시 active 반영

        const targetTop = $target.offset().top; 

        $('html, body').stop().animate(
            { scrollTop: targetTop },
            500,
            function () {
                isAnimating = false;
                updateActiveOnScroll(); // 최종 위치 기준으로 한번 더 정리
            }
        );
    });

    // 첫 로드 시 현재 위치 반영
    updateActiveOnScroll();
});
