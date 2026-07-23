(function ($) {
    "use strict";

    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);

        // FAQ accordion toggle
        $('#faq').on('click', '.faq-toggle', function () {
            var answer = $(this).next('.faq-answer');
            var icon = $(this).find('i');
            answer.toggleClass('open');
            icon.toggleClass('fa-chevron-down fa-chevron-up');
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
    
    
    // Smooth scrolling for anchor links
    $(document).on('click', 'a[href^="#"]', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutExpo');
        }
    });

    // Active nav link on scroll + navbar scroll effect
    $(window).scroll(function () {
        var scrollDistance = $(window).scrollTop();

        // Navbar scroll effect
        if (scrollDistance > 50) {
            $('.navbar').addClass('scrolled');
        } else {
            $('.navbar').removeClass('scrolled');
        }

        // Active nav link
        $('section[id], div[id]').each(function () {
            if ($(this).offset().top - 100 <= scrollDistance) {
                var id = $(this).attr('id');
                $('.navbar-nav .nav-item .nav-link').removeClass('active');
                $('.navbar-nav .nav-item .nav-link[href="#' + id + '"]').addClass('active');
            }
        });
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
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Date and time picker
    $('#date').datetimepicker({
        format: 'L'
    });
    $('#time').datetimepicker({
        format: 'LT'
    });


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

