document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Testimonial Slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    let currentSlide = 0;

    function showSlide(n) {
        testimonialSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = (n + testimonialSlides.length) % testimonialSlides.length;

        testimonialSlides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
        nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.gallery-close');
    const modalPrev = document.querySelector('.gallery-prev');
    const modalNext = document.querySelector('.gallery-next');
    let currentImage = 0;
    const galleryImages = [];

    if (galleryItems.length > 0) {
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            galleryImages.push(img.src);

            item.addEventListener('click', () => {
                currentImage = index;
                modalImg.src = img.src;
                modal.style.display = 'block';
            });
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        modalPrev.addEventListener('click', () => {
            currentImage = (currentImage - 1 + galleryImages.length) % galleryImages.length;
            modalImg.src = galleryImages[currentImage];
        });

        modalNext.addEventListener('click', () => {
            currentImage = (currentImage + 1) % galleryImages.length;
            modalImg.src = galleryImages[currentImage];
        });

        document.addEventListener('keydown', (e) => {
            if (modal.style.display === 'block') {
                if (e.key === 'ArrowLeft') {
                    currentImage = (currentImage - 1 + galleryImages.length) % galleryImages.length;
                    modalImg.src = galleryImages[currentImage];
                } else if (e.key === 'ArrowRight') {
                    currentImage = (currentImage + 1) % galleryImages.length;
                    modalImg.src = galleryImages[currentImage];
                } else if (e.key === 'Escape') {
                    modal.style.display = 'none';
                }
            }
        });
    }

    // Booking Form Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(bookingForm);
            let formValues = {};

            for (let [key, value] of formData.entries()) {
                formValues[key] = value;
            }

            console.log('Form submitted with values:', formValues);

            bookingForm.innerHTML = `
                <div class="success-message">
                    <h3>Thank you for your booking request!</h3>
                    <p>We have received your information and will contact you shortly to confirm your booking.</p>
                </div>
            `;
        });
    }

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.menu-item, .event-card, .gallery-item, .testimonial-content');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    const elementsToAnimate = document.querySelectorAll('.menu-item, .event-card, .gallery-item, .testimonial-content');
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // Set event date min to tomorrow
    const eventDateInput = document.getElementById("event-date");
    if (eventDateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const minDate = tomorrow.toISOString().split("T")[0];
        eventDateInput.min = minDate;
    }
});