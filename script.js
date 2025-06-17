document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                let targetPosition = targetElement.offsetTop;
                // Adjust for the scroll container if navigating to #about
                if (targetId === '#about') {
                    const scrollContainer = document.getElementById('hero-scroll-container');
                    targetPosition = scrollContainer.offsetHeight;
                }
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll-morphing hero text
    const scrollContainer = document.getElementById('hero-scroll-container');
    const morphTexts = document.querySelectorAll('.morph-text');
    if (scrollContainer && morphTexts.length > 0) {
        
        const setInitialState = () => {
            morphTexts[0].style.opacity = '1';
            morphTexts[0].style.transform = 'scale(1)';
            morphTexts[0].style.filter = 'blur(0px)';
        };

        setInitialState();

        window.addEventListener('scroll', () => {
            const { top, height } = scrollContainer.getBoundingClientRect();
            
            // Don't run animation if not in view
            if (top > window.innerHeight || top < -height) {
                return;
            }

            const scrollDepth = height - window.innerHeight;
            let progress = -top / scrollDepth;
            progress = Math.max(0, Math.min(1, progress));

            const numTransitions = morphTexts.length - 1;
            const holdEnd = 0.8; // 80% of the segment is a "hold"

            const transitionProgress = progress * numTransitions;
            let currentWordIndex = Math.floor(transitionProgress);
            let localProgress = transitionProgress - currentWordIndex;

            let morphProgress = 0;
            if (localProgress > holdEnd) {
                morphProgress = (localProgress - holdEnd) / (1 - holdEnd);
            }
            
            // Ensure the last word is fully visible at the end
            if (progress >= 1) {
                currentWordIndex = numTransitions -1;
                morphProgress = 1;
            }

            const nextWordIndex = currentWordIndex + 1;

            morphTexts.forEach((text, index) => {
                let opacity = 0, scale = 0.95, blur = 8;

                if (index === currentWordIndex) {
                    opacity = 1 - morphProgress;
                    scale = 1 - (morphProgress * 0.05);
                    blur = morphProgress * 8;
                } else if (index === nextWordIndex) {
                    opacity = morphProgress;
                    scale = 0.95 + (morphProgress * 0.05);
                    blur = (1 - morphProgress) * 8;
                }
                
                text.style.opacity = `${opacity}`;
                text.style.transform = `scale(${scale}) translateZ(0)`;
                text.style.filter = `blur(${blur}px)`;
            });
        });
    }

    // Scroll-triggered animations for other sections
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(element => {
        animationObserver.observe(element);
    });
});
