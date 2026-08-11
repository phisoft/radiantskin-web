(function () {
    'use strict';

    var form = document.getElementById('contactForm');
    var buttons = document.querySelectorAll('.js-wa-send');
    var hint = document.getElementById('waHint');

    if (!form || !buttons.length) return;

    function val(id) {
        var el = document.getElementById(id);
        return el ? el.value.trim() : '';
    }

    function buildMessage(branch) {
        var lines = [
            'Hi Radiant Skin (' + branch + ' Branch), I would like to enquire.',
            '',
            'Name: ' + val('name'),
            'Email: ' + val('email')
        ];

        if (val('phone')) lines.push('Phone: ' + val('phone'));

        lines.push('Subject: ' + val('subject'));
        lines.push('');
        lines.push('Message:');
        lines.push(val('message'));

        return lines.join('\n');
    }

    function buildUrl(btn) {
        return 'https://wa.me/' + btn.getAttribute('data-phone') +
               '?text=' + encodeURIComponent(buildMessage(btn.getAttribute('data-branch')));
    }

    function refresh() {
        Array.prototype.forEach.call(buttons, function (btn) {
            btn.href = buildUrl(btn);
        });
    }

    function isValid() {
        return val('name') !== '' && val('message') !== '';
    }

    form.addEventListener('input', refresh);
    refresh(); // seed the hrefs on load

    Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener('click', function (e) {
            if (!isValid()) {
                e.preventDefault();
                if (hint) hint.hidden = false;

                var target = val('name')
                    ? document.getElementById('message')
                    : document.getElementById('name');
                if (target) target.focus();
                return;
            }

            if (hint) hint.hidden = true;
            btn.href = buildUrl(btn); // belt-and-braces: rebuild at click time
        });
    });
})();
