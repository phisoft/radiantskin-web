/* ============================================================
   Radiant Skin — Shared Header (Topbar + Navbar)
   ============================================================
   This is the SINGLE source of truth for the site-wide top menu.
   To update the menu across ALL pages, edit ONLY this file.

   Usage:
     <div id="site-header" data-root="" data-active="home"></div>
     ...
     <script src="js/header.js"></script>

   For pages inside subfolders (product/, treatment/):
     <div id="site-header" data-root="../" data-active="treatments"></div>
     ...
     <script src="../js/header.js"></script>

   data-root:   path prefix for links / images
                ""    → pages in the root folder
                "../" → pages in product/ & treatment/ folders
   data-active: which nav item gets highlighted
                home | about | treatments | products | faq | contact
   ============================================================ */

(function () {
    'use strict';

    var host = document.getElementById('site-header');
    if (!host) return;

    var root = host.getAttribute('data-root') || '';
    var active = host.getAttribute('data-active') || '';

    var headerHTML =
        '<style>\n' +
        '    /* Shared header Book Now button (matches Radiant Skin Product Premium button style) */\n' +
        '    .header-book-btn {\n' +
        '        display: inline-block;\n' +
        '        padding: 10px 24px;\n' +
        '        font-family: \'Poppins\', sans-serif;\n' +
        '        font-size: 0.75rem;\n' +
        '        font-weight: 500;\n' +
        '        letter-spacing: 0.8px;\n' +
        '        text-transform: uppercase;\n' +
        '        text-decoration: none;\n' +
        '        color: #fff !important;\n' +
        '        background: #a0152a;\n' +
        '        border-radius: 8px;\n' +
        '        transition: all 0.3s ease;\n' +
        '        margin-top: 0;\n' +
        '        border: none;\n' +
        '        cursor: pointer;\n' +
        '    }\n' +
        '    .header-book-btn:hover {\n' +
        '        background: #C42039;\n' +
        '        color: #fff;\n' +
        '        text-decoration: none;\n' +
        '    }\n' +
        '</style>\n' +
        '<!-- Topbar Start -->\n' +
        '<div class="container-fluid bg-dark d-none d-lg-block">\n' +
        '    <div class="row py-2 px-lg-5">\n' +
        '        <div class="col-lg-8 text-left mb-2 mb-lg-0">\n' +
        '            <div class="d-inline-flex align-items-center">\n' +
        '                <small class="text-white"><i class="fa fa-phone-alt mr-2"></i>+6017 - 946 3353 | +6017 - 876 3356</small>\n' +
        '                <small class="text-white px-3">|</small>\n' +
        '                <small class="text-white"><i class="fa fa-envelope mr-2"></i>radiantskinvouge@gmail.com</small>\n' +
        '            </div>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<!-- Topbar End -->\n' +
        '\n' +
        '<!-- Navbar Start -->\n' +
        '<div class="container-fluid p-0">\n' +
        '    <nav class="navbar navbar-expand-lg bg-white navbar-light py-3 py-lg-0 px-lg-5">\n' +
        '        <a href="' + root + 'index.html" class="navbar-brand ml-lg-3">\n' +
        '            <img src="' + root + 'img/rdskin-logo.png" alt="Radiant Skin">\n' +
        '        </a>\n' +
        '        <button type="button" class="navbar-toggler" data-toggle="collapse" data-target="#navbarCollapse">\n' +
        '            <span class="navbar-toggler-icon"></span>\n' +
        '        </button>\n' +
        '        <div class="collapse navbar-collapse justify-content-between px-lg-3" id="navbarCollapse">\n' +
        '            <div class="navbar-nav m-auto py-0">\n' +
        '                <a href="' + root + 'index.html#home" class="nav-item nav-link" data-nav="home">Home</a>\n' +
        '                <a href="' + root + 'about.html" class="nav-item nav-link" data-nav="about">About</a>\n' +
        '                <a href="' + root + 'index.html#treatments" class="nav-item nav-link" data-nav="treatments">Treatments</a>\n' +
        '                <a href="' + root + 'index.html#products" class="nav-item nav-link" data-nav="products">Skin Product</a>\n' +
        '                <a href="' + root + 'index.html#faq" class="nav-item nav-link" data-nav="faq">FAQ</a>\n' +
        '                <a href="' + root + 'index.html#contact" class="nav-item nav-link" data-nav="contact">Contact</a>\n' +
        '            </div>\n' +
        '            <a href="' + root + 'index.html#contact" class="header-book-btn d-none d-lg-block">Book Now</a>\n' +
        '        </div>\n' +
        '    </nav>\n' +
        '</div>\n' +
        '<!-- Navbar End -->';

    function inject() {
        host.innerHTML = headerHTML;

        if (active) {
            var links = host.querySelectorAll('.navbar-nav .nav-link');
            for (var i = 0; i < links.length; i++) {
                if (links[i].getAttribute('data-nav') === active) {
                    links[i].classList.add('active');
                    break;
                }
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inject);
    } else {
        inject();
    }
})();