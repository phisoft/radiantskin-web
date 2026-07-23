$(function () {

    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('sendMessageButton');

    // Set form_start timestamp
    document.getElementById('form_start').value = Date.now();

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Bot check - honeypot
        if (form.website.value !== '') return;

        // Basic validation
        var name = form.name.value.trim();
        var email = form.email.value.trim();
        var subject = form.subject.value.trim();
        var message = form.message.value.trim();

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields.');
            return;
        }

        // Prevent double submit
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        var formData = new FormData(form);

        fetch('https://send.bah.my/o6b7gnhl', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(function (response) {
            if (response.ok) {
                window.location.href = '/success_message.html';
            } else {
                throw new Error('Submission failed');
            }
        })
        .catch(function (err) {
            console.error(err);
            alert('Error sending message. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    });

    // Handle tab clicks
    $("a[data-toggle=\"tab\"]").click(function (e) {
        e.preventDefault();
        $(this).tab("show");
    });
});