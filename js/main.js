(function ($) {
    "use strict";

    $(document).ready(function () {
        // FAQ accordion toggle
        $('#faq').on('click', '.faq-toggle', function () {
            var answer = $(this).next('.faq-answer');
            if (!answer.length) return;
            var icon = $(this).find('i');
            var isOpen = answer.hasClass('open');
            answer.toggleClass('open', !isOpen);
            // Cap the open panel to its real height so long answers cannot be clipped.
            answer[0].style.maxHeight = isOpen ? '' : answer[0].scrollHeight + 'px';
            icon.toggleClass('fa-chevron-down fa-chevron-up');
            $(this).attr('aria-expanded', (!isOpen).toString());
        });

        // Find Your Skin Solution accordion toggle
        $('.skin-solution').on('click', '.ss-toggle', function () {
            var answer = $(this).next('.ss-answer');
            var item = $(this).closest('.ss-item');
            var isOpen = answer.hasClass('open');
            answer.toggleClass('open', !isOpen);
            item.toggleClass('open', !isOpen);
            $(this).attr('aria-expanded', (!isOpen).toString());
        });

        // Lash & Brow price card toggle (click the box to reveal prices)
        $('.lash-brow-list').on('click', '.lash-toggle', function () {
            var panel = $('#' + $(this).attr('aria-controls'));
            var card = $(this).closest('.lash-card');
            var isOpen = panel.hasClass('open');
            panel.toggleClass('open', !isOpen);
            card.toggleClass('open', !isOpen);
            $(this).attr('aria-expanded', (!isOpen).toString());
        });

        // Carousel button navigation
        $('.carousel-btn-prev').on('click', function () {
            $(this).siblings('.treatment-carousel').each(function () {
                this.scrollBy({ left: -368, behavior: 'smooth' });
            });
        });
        $('.carousel-btn-next').on('click', function () {
            $(this).siblings('.treatment-carousel').each(function () {
                this.scrollBy({ left: 368, behavior: 'smooth' });
            });
        });
    });
    
    
    // Smooth scrolling for anchor links (including shared-header links)
    $(document).on('click', 'a[href^="#"], a[href*="#"]', function (event) {
        var href = $(this).attr('href') || '';
        // Only handle same-page anchor links (e.g. index.html#home -> #home when on home page)
        if (href.indexOf('.html') === -1 || window.location.pathname.indexOf(href.split('#')[0].replace('../', '')) !== -1) {
            var hash = href.split('#')[1];
            if (!hash) return;
            var target = $('#' + hash);
            if (target.length) {
                event.preventDefault();
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 1000, 'easeInOutExpo');
            }
        }
    });

    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    if ($.fn.counterUp) {
        $('[data-toggle="counter-up"]').counterUp({
            delay: 10,
            time: 2000
        });
    }


    if (!$.fn.owlCarousel) return;

    // Service carousel
    $(".service-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        loop: true,
        dots: false,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            },
            1200:{
                items:5
            }
        }
    });


    // Pricing carousel
    $(".pricing-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        loop: true,
        dots: false,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 30,
        dots: true,
        loop: true,
        items: 1
    });

    
})(jQuery);

// Scroll-triggered fade-up animations (Intersection Observer)
(function () {
    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.spa-fade-up, .treatment-card-item, .service-item, .faq-item, .section-header-wrap').forEach(function (el) {
        if (!el.classList.contains('spa-fade-up')) {
            el.classList.add('spa-fade-up');
        }
        observer.observe(el);
    });
})();

document.addEventListener('DOMContentLoaded', function () {
    var wrappers = document.querySelectorAll('.whatsapp-wrapper');

    wrappers.forEach(function (wrapper) {
        var trigger = wrapper.querySelector('.whatsapp-container');
        var popup = wrapper.querySelector('.whatsapp-popup');
        var closeBtn = wrapper.querySelector('.whatsapp-popup-close');

        if (!trigger || !popup) return;

        // Toggle popup on button click
        trigger.addEventListener('click', function (e) {
            e.stopPropagation();
            popup.classList.toggle('active');
        });

        // Close popup on 'X' click
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                popup.classList.remove('active');
            });
        }

        // Close popup if user clicks anywhere outside this wrapper
        document.addEventListener('click', function (e) {
            if (!popup.contains(e.target) && !trigger.contains(e.target)) {
                popup.classList.remove('active');
            }
        });
    });
});
