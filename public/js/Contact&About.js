
        // Mobile Menu Toggle
        document.querySelector('.mobile-menu-btn').addEventListener('click', function() {
            document.querySelector('nav').classList.toggle('active');
        });
        
        // FAQ Toggle
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', function() {
                const faqItem = this.parentElement;
                const answer = this.nextElementSibling;
                const icon = this.querySelector('.faq-toggle i');
                
                // Toggle active class
                faqItem.classList.toggle('active');
                
                // Toggle icon
                if (faqItem.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                    answer.style.maxHeight = null;
                }
            });
        });
        
        // Testimonial Slider
        const testimonialSlides = document.querySelectorAll('.testimonial-slide');
        const dots = document.querySelectorAll('.dot');
        let currentSlide = 0;
        
        function showSlide(n) {
            // Hide all slides
            testimonialSlides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show the selected slide and dot
            testimonialSlides[n].classList.add('active');
            dots[n].classList.add('active');
            currentSlide = n;
        }
        
        // Next button
        document.querySelector('.next-testimonial').addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        });
        
        // Previous button
        document.querySelector('.prev-testimonial').addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + testimonialSlides.length) % testimonialSlides.length;
            showSlide(currentSlide);
        });
        
        // Dot navigation
        dots.forEach(dot => {
            dot.addEventListener('click', function() {
                const slideIndex = parseInt(this.getAttribute('data-slide'));
                showSlide(slideIndex);
            });
        });
        
        // Auto slide every 5 seconds
        setInterval(function() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            showSlide(currentSlide);
        }, 5000);
        
        // Location Tabs
        document.querySelectorAll('.location-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs
                document.querySelectorAll('.location-tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // Hide all location content
                document.querySelectorAll('.location-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding location content
                const location = this.getAttribute('data-location');
                document.getElementById(location + '-location').classList.add('active');
            });
        });
        
        // Form Submission
        document.getElementById('enquiry-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Show success modal
            document.getElementById('success-modal').style.display = 'flex';
        });
        
        document.getElementById('contact-form').addEventListener('submit', function(e) {
            e.preventDefault();
            // Show success modal
            document.getElementById('success-modal').style.display = 'flex';
        });
        
        // Close Modal
        document.querySelector('.close-modal').addEventListener('click', function() {
            document.getElementById('success-modal').style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === document.getElementById('success-modal')) {
                document.getElementById('success-modal').style.display = 'none';
            }
        });