// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialisation de AOS (si utilisé dans le projet)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // *** Gestion de l’effet de défilement de l’en-tête ***
    const header = document.getElementById('main-header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollTop = scrollTop;
    });

    // *** Gestion du menu mobile ***
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle-mobile');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = this.classList.contains('active') ? 'hidden' : '';
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Gestion des sous-menus déroulants dans le menu mobile
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('active');
        });
    });

    // Fermeture du menu mobile lors du clic sur un lien
    const mobileLinks = document.querySelectorAll('.mobile-menu-link:not(.dropdown-toggle-mobile), .mobile-dropdown-link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // *** Chargement de la carte SVG de l'Afrique ***
    const africaSVG = document.getElementById('africa-svg');
    if (africaSVG) {
        fetch('Blank_Map-Africa.svg')
            .then(response => response.text())
            .then(svgContent => {
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                const pathsAndGroups = svgDoc.querySelectorAll('path, g');
                pathsAndGroups.forEach(element => {
                    if (element.id && !element.id.includes('Skala')) {
                        const clone = element.cloneNode(true);
                        africaSVG.appendChild(clone);
                    }
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement du SVG :', error);
                africaSVG.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="white" font-size="20">Carte de l\'Afrique</text>';
            });
    }

    // *** Gestion des tooltips de la carte ***
    const mapPoints = document.querySelectorAll('.map-action-point');
    const tooltip = document.getElementById('tooltip');

    function showTooltip(point) {
        const countryName = point.getAttribute('data-name');
        const projectTitle = point.getAttribute('data-project');
        const projectDetail = point.getAttribute('data-detail');

        tooltip.querySelector('.country-name').textContent = countryName;
        tooltip.querySelector('.project-title').textContent = projectTitle;
        tooltip.querySelector('.project-detail').textContent = projectDetail;

        const rect = point.getBoundingClientRect();
        const mapContainer = document.querySelector('.map-container');
        const mapRect = mapContainer.getBoundingClientRect();

        const tooltipX = rect.left - mapRect.left + rect.width / 2 - tooltip.offsetWidth / 2;
        const tooltipY = rect.top - mapRect.top - tooltip.offsetHeight - 10;

        tooltip.style.left = `${Math.max(10, Math.min(mapRect.width - tooltip.offsetWidth - 10, tooltipX))}px`;
        tooltip.style.top = `${Math.max(10, tooltipY)}px`;

        tooltip.classList.add('visible');
    }

    function hideTooltip() {
        tooltip.classList.remove('visible');
    }

    mapPoints.forEach(point => {
        point.addEventListener('mouseenter', () => showTooltip(point));
        point.addEventListener('mouseleave', hideTooltip);
        point.addEventListener('click', () => showTooltip(point));
    });

    // *** Carrousel des services sur mobile ***
    let currentSlide = 0;
    const serviceCards = document.querySelectorAll('.service-card');
    const prevButton = document.querySelector('.prev-slide');
    const nextButton = document.querySelector('.next-slide');
    const currentSlideIndicator = document.getElementById('current-slide');
    const totalSlidesIndicator = document.getElementById('total-slides');
    const totalSlides = serviceCards.length;

    function initSlider() {
        if (window.innerWidth <= 768) {
            serviceCards.forEach((card, index) => {
                card.style.display = index === currentSlide ? 'flex' : 'none';
            });
            document.querySelector('.slider-controls').style.display = 'flex';
            totalSlidesIndicator.textContent = totalSlides;
            updateSlideIndicator();
        } else {
            serviceCards.forEach(card => card.style.display = 'flex');
            document.querySelector('.slider-controls').style.display = 'none';
        }
    }

    function updateSlideIndicator() {
        currentSlideIndicator.textContent = currentSlide + 1;
    }

    function goToSlide(index) {
        serviceCards.forEach((card, i) => {
            card.style.display = i === index ? 'flex' : 'none';
        });
        currentSlide = index;
        updateSlideIndicator();
    }

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', function() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            goToSlide(currentSlide);
        });

        nextButton.addEventListener('click', function() {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        });
    }

    initSlider();
    window.addEventListener('resize', initSlider);

    // Gestion des swipes tactiles pour le carrousel
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector('.services-container').addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    document.querySelector('.services-container').addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        if (touchEndX < touchStartX) nextButton.click();
        if (touchEndX > touchStartX) prevButton.click();
    }, false);

    // *** Bouton "Retour en haut" ***
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        backToTopBtn.classList.toggle('visible', window.pageYOffset > 300);
    });

    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // *** Gestion du chatbox ***
    const chatboxToggle = document.querySelector('.chatbox-toggle');
    const chatbox = document.querySelector('.chatbox');
    const chatboxClose = document.querySelector('.chatbox-close');
    const chatboxGreeting = document.getElementById('chatbox-greeting');
    const chatboxBody = document.querySelector('.chatbox-body');
    const chatboxForm = document.getElementById('chatbox-form');
    const chatboxInput = document.getElementById('chatbox-input');

    // Masquer le message de bienvenue après un délai
    if (chatboxGreeting) {
        setTimeout(() => chatboxGreeting.classList.add('hide'), 4000);
    }

    // Ouvre/ferme le chatbox quand on clique sur la bulle (toggle)
    if (chatboxToggle && chatbox) {
        chatboxToggle.addEventListener('click', () => {
            chatbox.classList.toggle('active');
        });
    }
    if (chatboxClose && chatbox) {
        chatboxClose.addEventListener('click', () => chatbox.classList.remove('active'));
    }

    // Initialisation du chatbox avec message de bienvenue
    chatboxBody.innerHTML = `
        <div class="welcome-message">
            <p>Bonjour ! Je suis Lynka, l'assistante virtuelle de Linksys Capital Advisory. Comment puis-je vous aider aujourd'hui ?</p>
        </div>
        <div class="faq-buttons">
            <button class="faq-button" data-question="Que fait votre entreprise ?">Que fait votre entreprise ?</button>
            <button class="faq-button" data-question="Où êtes-vous basés ?">Où êtes-vous basés ?</button>
            <button class="faq-button" data-question="Comment vous contacter ?">Comment vous contacter ?</button>
        </div>
    `;

    // Contexte du fil de discussion
    let chatHistory = [];

    // Gestion des boutons FAQ
    const faqButtons = document.querySelectorAll('.faq-button');
    faqButtons.forEach(button => {
        button.addEventListener('click', function() {
            const question = this.getAttribute('data-question');
            addUserMessage(question);
            chatHistory.push({ role: 'user', content: question });
            sendToChatApi(question);
        });
    });

    // Soumission du formulaire de chat
    chatboxForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = chatboxInput.value.trim();
        if (message === '') return;
        addUserMessage(message);
        chatHistory.push({ role: 'user', content: message });
        chatboxInput.value = '';
        sendToChatApi(message);
    });

    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'user-message';
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatboxBody.appendChild(messageDiv);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'bot-message';
        messageDiv.innerHTML = `<p>${text}</p>`;
        chatboxBody.appendChild(messageDiv);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
        chatHistory.push({ role: 'assistant', content: text });
    }

    function addLoadingMessage() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'bot-message loading';
        loadingDiv.innerHTML = `<p>Lynka réfléchit...</p>`;
        chatboxBody.appendChild(loadingDiv);
        chatboxBody.scrollTop = chatboxBody.scrollHeight;
        return loadingDiv;
    }

    // Appel à l'API de chat avec contexte
    function sendToChatApi(text) {
        const loadingDiv = addLoadingMessage();
        // Ajoute le contexte de discussion dans la variable text (concatène tout l'historique)
        const context = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
        const textWithContext = context ? `${context}\nuser: ${text}` : text;
        fetch('https://lynksys-oxg1.vercel.app/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: textWithContext })
        })
        .then(response => response.json())
        .then(data => {
            loadingDiv.remove();
            let botReply = "[Erreur API]";
            if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                botReply = data.choices[0].message.content;
            }
            addBotMessage(botReply);
        })
        .catch(() => {
            loadingDiv.remove();
            addBotMessage("Désolé, une erreur est survenue lors de la connexion à l'API.");
        });
    }

    // *** Gestion du splashscreen ***
    const splashscreen = document.getElementById('splashscreen');
    setTimeout(() => splashscreen.classList.add('hidden'), 1500);

    // Animations optimisées et élégantes pour images et textes
    function addOptimizedImageTextAnimations() {
        // Images : effet de fade + zoom léger
        document.querySelectorAll('img, .image, .img, .blog-image, .hero-bg-img, .partner-logo img').forEach((img, idx) => {
            img.classList.add('img-anim');
            img.style.opacity = 0;
            img.style.transform = 'scale(0.96) translateY(22px)';
        });
        // Textes principaux : fade + slide
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .title, .subtitle, .section-title, .hero-text, .vision-text, .service-card h4, .service-card p, .team-member h4, .team-member p').forEach((txt, idx) => {
            txt.classList.add('txt-anim');
            txt.style.opacity = 0;
            txt.style.transform = 'translateY(32px)';
        });
        // Observer optimisé (un seul pour tout)
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('img-anim')) {
                        entry.target.style.transition = 'opacity 1.1s cubic-bezier(.77,0,.18,1), transform 1.1s cubic-bezier(.77,0,.18,1)';
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'scale(1) translateY(0)';
                    } else if (entry.target.classList.contains('txt-anim')) {
                        entry.target.style.transition = 'opacity 0.85s cubic-bezier(.77,0,.18,1), transform 0.85s cubic-bezier(.77,0,.18,1)';
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'none';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, {threshold: 0.18});
        document.querySelectorAll('.img-anim, .txt-anim').forEach(el => observer.observe(el));
    }
    window.addEventListener('DOMContentLoaded', addOptimizedImageTextAnimations);
});
