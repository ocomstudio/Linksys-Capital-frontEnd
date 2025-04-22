document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
    
    // Header Scroll Effect
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
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            
            if (this.classList.contains('active')) {
                this.querySelector('span:nth-child(1)').style.transform = 'rotate(45deg) translate(5px, 5px)';
                this.querySelector('span:nth-child(2)').style.opacity = '0';
                this.querySelector('span:nth-child(3)').style.transform = 'rotate(-45deg) translate(7px, -7px)';
                mainNav.style.display = 'block';
            } else {
                this.querySelector('span:nth-child(1)').style.transform = 'none';
                this.querySelector('span:nth-child(2)').style.opacity = '1';
                this.querySelector('span:nth-child(3)').style.transform = 'none';
                mainNav.style.display = '';
            }
        });
    }
    
    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroControls = document.querySelectorAll('.hero-control');
    let currentSlide = 0;
    
    function showSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroControls.forEach(control => control.classList.remove('active'));
        
        heroSlides[index].classList.add('active');
        heroControls[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        showSlide(currentSlide);
    }
    
    // Initialize slider controls
    if (heroControls.length > 0) {
        heroControls.forEach((control, index) => {
            control.addEventListener('click', () => showSlide(index));
        });
        
        // Auto slide every 5 seconds
        setInterval(nextSlide, 5000);
    }
    
    // Services Slider
    const serviceCards = document.querySelectorAll('.service-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let activeServiceIndex = 1; // Middle card is active by default
    
    function updateServiceCards() {
        serviceCards.forEach(card => card.classList.remove('active'));
        serviceCards[activeServiceIndex].classList.add('active');
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            activeServiceIndex = (activeServiceIndex - 1 + serviceCards.length) % serviceCards.length;
            updateServiceCards();
        });
        
        nextBtn.addEventListener('click', function() {
            activeServiceIndex = (activeServiceIndex + 1) % serviceCards.length;
            updateServiceCards();
        });
    }
    
    // Back to Top Button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Dropdown Menu on Mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (window.innerWidth <= 768) {
        dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            });
        });
    }
    
    // Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Vertical Carousel Auto-scroll + Dots Sync
    const carouselTrack = document.querySelector('.carousel-track');
    const carouselDots = document.querySelectorAll('.carousel-dots-vertical .dot');
    let currentIndex = 0;
    const imageCount = 3; // Only 3 unique images
    let intervalId;

    function updateCarousel(position) {
        carouselTrack.style.transform = `translateY(-${position * 200}px)`;
        carouselDots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === position);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel(currentIndex);
    }

    if (carouselTrack && carouselDots.length) {
        // Set up click events for vertical dots
        carouselDots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetInterval();
            });
        });

        // Auto-scroll logic
        function nextSlide() {
            currentIndex = (currentIndex + 1) % imageCount;
            updateCarousel(currentIndex);
        }
        function resetInterval() {
            clearInterval(intervalId);
            intervalId = setInterval(nextSlide, 3000);
        }
        intervalId = setInterval(nextSlide, 3000);
        updateCarousel(currentIndex);
    }
    
    // Interactive Africa Map
    const activeCountries = document.querySelectorAll('.active-country');
    const tooltip = document.getElementById('tooltip');
    
    if (activeCountries.length > 0 && tooltip) {
        activeCountries.forEach(country => {
            country.addEventListener('mouseenter', function(e) {
                const countryName = this.getAttribute('data-name');
                const projectTitle = this.getAttribute('data-project');
                const projectDetail = this.getAttribute('data-detail');
                
                tooltip.querySelector('.country-name').textContent = countryName;
                tooltip.querySelector('.project-title').textContent = projectTitle;
                tooltip.querySelector('.project-detail').textContent = projectDetail;
                
                // Position the tooltip
                const rect = this.getBoundingClientRect();
                const mapContainer = document.querySelector('.map-container');
                const mapRect = mapContainer.getBoundingClientRect();
                
                const tooltipX = rect.left + rect.width / 2 - mapRect.left - tooltip.offsetWidth / 2;
                const tooltipY = rect.top - mapRect.top - tooltip.offsetHeight - 10;
                
                tooltip.style.left = `${Math.max(10, Math.min(mapRect.width - tooltip.offsetWidth - 10, tooltipX))}px`;
                tooltip.style.top = `${Math.max(10, tooltipY)}px`;
                
                tooltip.classList.add('visible');
            });
            
            country.addEventListener('mouseleave', function() {
                tooltip.classList.remove('visible');
            });
        });
    }
    
    // Nouvelle logique pour les points d'action sur la carte Afrique SVG
    const mapPoints = document.querySelectorAll('.map-action-point');
    const africaTooltip = document.getElementById('tooltip');
    const africaSvg = document.getElementById('africa-svg');
    if (mapPoints.length > 0 && africaTooltip && africaSvg) {
        mapPoints.forEach(point => {
            point.addEventListener('mouseenter', function(e) {
                const countryName = this.getAttribute('data-name');
                const projectTitle = this.getAttribute('data-project');
                const projectDetail = this.getAttribute('data-detail');
                africaTooltip.querySelector('.country-name').textContent = countryName;
                africaTooltip.querySelector('.project-title').textContent = projectTitle;
                africaTooltip.querySelector('.project-detail').textContent = projectDetail;
                // Positionnement du tooltip
                const svgRect = africaSvg.getBoundingClientRect();
                const pt = africaSvg.createSVGPoint();
                pt.x = parseFloat(this.getAttribute('cx'));
                pt.y = parseFloat(this.getAttribute('cy'));
                const screenCTM = this.ownerSVGElement.getScreenCTM();
                const transformed = pt.matrixTransform(screenCTM);
                const tooltipX = transformed.x - svgRect.left - africaTooltip.offsetWidth / 2;
                const tooltipY = transformed.y - svgRect.top - africaTooltip.offsetHeight - 18;
                africaTooltip.style.left = `${Math.max(10, Math.min(svgRect.width - africaTooltip.offsetWidth - 10, tooltipX))}px`;
                africaTooltip.style.top = `${Math.max(10, tooltipY)}px`;
                africaTooltip.classList.add('visible');
            });
            point.addEventListener('mouseleave', function() {
                africaTooltip.classList.remove('visible');
            });
        });
    }
    
    // Gestion tooltips pour points d'action Lynksis
    const mapPointsLynksis = document.querySelectorAll('.map-action-point');
    const tooltipLynksis = document.getElementById('tooltip');

    mapPointsLynksis.forEach(point => {
        point.addEventListener('mouseenter', function(e) {
            tooltipLynksis.querySelector('.country-name').textContent = this.getAttribute('data-name');
            tooltipLynksis.querySelector('.project-title').textContent = this.getAttribute('data-project');
            tooltipLynksis.querySelector('.project-detail').textContent = this.getAttribute('data-detail');
            tooltipLynksis.classList.add('visible');
            // Positionnement du tooltip
            const rect = this.getBoundingClientRect();
            const mapRect = this.parentElement.getBoundingClientRect();
            tooltipLynksis.style.left = (rect.left - mapRect.left + rect.width/2) + 'px';
            tooltipLynksis.style.top = (rect.top - mapRect.top - 10) + 'px';
        });
        point.addEventListener('mouseleave', function() {
            tooltipLynksis.classList.remove('visible');
        });
    });
    
    // Chatbox Lynka
    const chatboxToggle = document.querySelector('.chatbox-toggle');
    const chatbox = document.querySelector('.chatbox');
    const chatboxClose = document.querySelector('.chatbox-close');
    const chatboxForm = document.getElementById('chatbox-form');
    const chatboxInput = document.getElementById('chatbox-input');
    const chatboxMessages = document.querySelector('.chatbox-messages');
    const faqButtons = document.querySelectorAll('.faq-button');
    
    // FAQ responses
    const faqResponses = {
        "Que fait votre entreprise ?": "Linksys Capital Advisory est une société de Gestion de Fonds (Fund Manager) spécialisée dans les investissements à fort impact social, environnemental et financier en Afrique. Nous mobilisons des capitaux pour soutenir les entrepreneurs et initiatives économiques.",
        "Où êtes-vous basés ?": "Notre siège social est situé à Yaoundé, Cameroun, à l'adresse suivante : Villa La Rose, 2e Étage, 40, Rue 1079 - Quartier Hippodrome.",
        "Comment vous contacter ?": "Vous pouvez nous contacter par téléphone au 689 89 34 87 ou 653 90 29 74, ou par email à Info@Linksyscapital.Com. Nos bureaux sont ouverts du lundi au vendredi de 08h00 à 16h00.",
        "Quels sont vos domaines d'investissement ?": "Nous investissons principalement dans les secteurs suivants : énergies renouvelables, agriculture durable, microfinance, technologies et innovations, infrastructures durables, et entrepreneuriat local. Tous nos investissements visent à générer un impact positif en Afrique."
    };
    
    // Toggle chatbox
    if (chatboxToggle && chatbox && chatboxClose) {
        chatboxToggle.addEventListener('click', function() {
            chatbox.classList.add('active');
        });
        
        chatboxClose.addEventListener('click', function() {
            chatbox.classList.remove('active');
        });
    }
    
    // Handle FAQ buttons
    if (faqButtons.length > 0) {
        faqButtons.forEach(button => {
            button.addEventListener('click', function() {
                const question = this.getAttribute('data-question');
                const response = faqResponses[question] || "Je n'ai pas de réponse à cette question pour le moment.";
                
                addMessage('user', question);
                
                // Simulate typing delay
                setTimeout(() => {
                    addMessage('bot', response);
                }, 500);
            });
        });
    }
    
    // Historique de la conversation pour le contexte IA
    const chatHistory = [];
    
    // Handle form submission
    if (chatboxForm && chatboxInput) {
        chatboxForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const message = chatboxInput.value.trim();
            if (message === '') return;
            
            addMessage('user', message);
            chatboxInput.value = '';
            
            // Ajoute le message utilisateur à l'historique
            chatHistory.push({ role: 'user', content: message });
            
            // Affiche un message de chargement temporaire
            const loadingDiv = document.createElement('div');
            loadingDiv.classList.add('message', 'bot', 'loading');
            loadingDiv.innerHTML = `
                <div class="lynka-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                </div>
                <div class="message-content">Lynka réfléchit...</div>
            `;
            chatboxMessages.appendChild(loadingDiv);
            chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
            
            let response;
            try {
                // Prépare l'historique formaté pour l'API
                const formattedHistory = chatHistory.map(msg => `${msg.role === 'user' ? 'User' : 'Bot'}: ${msg.content}`).join('\n');
                // Envoie tout l'historique dans "text"
                const res = await fetch('https://lynksys-oxg1.vercel.app/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: formattedHistory })
                });
                if (!res.ok) throw new Error('Erreur API');
                const data = await res.json();
                response = data.choices?.[0]?.message?.content?.trim();
            } catch (err) {
                // Fallback sur la FAQ locale
                for (const [question, answer] of Object.entries(faqResponses)) {
                    if (message.toLowerCase().includes(question.toLowerCase())) {
                        response = answer;
                        break;
                    }
                }
                if (!response) {
                    response = "Merci pour votre message. Un membre de notre équipe vous répondra dans les plus brefs délais. Pour des réponses immédiates, n'hésitez pas à consulter notre FAQ ou à nous appeler directement.";
                }
            }
            // Supprime le message de chargement
            loadingDiv.remove();
            addMessage('bot', response);
            // Ajoute la réponse du bot à l'historique
            chatHistory.push({ role: 'bot', content: response });
        });
    }
    
    // Affichage et masquage du message de bienvenue de la bulle de chat
    const chatboxGreeting = document.getElementById('chatbox-greeting');
    if (chatboxGreeting) {
        setTimeout(() => {
            chatboxGreeting.classList.add('hide');
        }, 3500); // Affiche 3,5 secondes
    }
    
    // Function to add a message to the chat
    function addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', type);
        
        if (type === 'bot') {
            messageDiv.innerHTML = `
                <div class="lynka-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                    </svg>
                </div>
                <div class="message-content">${content}</div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">${content}</div>
            `;
        }
        
        chatboxMessages.appendChild(messageDiv);
        chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
    }
    
    // Animation au scroll : ajoute la classe .visible quand l'élément entre dans le viewport
    function handleScrollAnimations() {
        const animatedEls = document.querySelectorAll('.fade-in-scroll, .slide-in-left, .zoom-in-scroll, .parallax-img');
        animatedEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.93) {
                el.classList.add('visible');
            } else {
                el.classList.remove('visible');
            }
        });
    }
    window.addEventListener('scroll', handleScrollAnimations);
    window.addEventListener('DOMContentLoaded', handleScrollAnimations);

    // Marquee défilant pour les titres si besoin (optionnel)
    // function startMarquee() {
    //     const marquees = document.querySelectorAll('.marquee');
    //     marquees.forEach(mq => {
    //         mq.innerHTML = `<span>${mq.textContent}</span><span>${mq.textContent}</span>`;
    //     });
    // }
    // window.addEventListener('DOMContentLoaded', startMarquee);
    
    // Splashscreen hide logic
    window.addEventListener('load', function() {
        const splash = document.getElementById('splashscreen');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.style.display = 'none', 600);
        }
    });
});