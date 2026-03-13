document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────
    // 1. STICKY NAVBAR – add .scrolled class
    // ─────────────────────────────────────────
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    // ─────────────────────────────────────────
    // 2. SMOOTH SCROLL for nav links
    // ─────────────────────────────────────────
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = navbar ? navbar.offsetHeight : 0;
                    window.scrollTo({
                        top: target.getBoundingClientRect().top + window.scrollY - offset - 16,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ─────────────────────────────────────────
    // 3. ACTIVE NAV LINK on scroll
    // ─────────────────────────────────────────
    const sections = document.querySelectorAll('#about, #education, #internship, #contact');
    const navLinks = document.querySelectorAll('.nav-links a');

    const setActiveLink = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // ─────────────────────────────────────────
    // 4. MODAL – open / close for project & internship cards
    // ─────────────────────────────────────────
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalTags = document.getElementById('modalTags');
    const modalClose = document.getElementById('modalClose');

    // Detail data keyed by data-detail attribute value - UPDATED for Sasmitha
    const details = {
        project1: {
            title: 'Personal Portfolio Website',
            desc: 'A fully responsive personal portfolio website built with HTML, CSS, and JavaScript. Features a modern glass-morphism design, interactive UI elements, and smooth animations. Demonstrates front-end development skills and responsive design principles.',
            tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'UI/UX']
        },
        project2: {
            title: 'RPA Demo Bot',
            desc: 'Basic robotic process automation script developed during internship at National Softech. Automates data entry tasks and demonstrates fundamental RPA concepts including workflow automation and process optimization.',
            tags: ['RPA', 'Automation', 'Python', 'Workflow', 'Data Entry']
        },
        intern1: {
            title: 'Futurik Technologies – .Net Basics Internship',
            desc: 'Completed an internship focused on .NET fundamentals. Learned C# programming basics, .NET framework architecture, and developed small console applications. Gained hands-on experience with Visual Studio and basic OOP concepts.',
            tags: ['.Net', 'C#', 'Visual Studio', 'OOP', 'Programming Basics']
        },
        intern2: {
            title: 'National Softech – Robotics Process Automation',
            desc: 'Participated in an RPA internship program exploring automation tools and techniques. Learned about process automation, bot development, and implemented basic automation scripts. Understood industry applications of RPA in business processes.',
            tags: ['Robotics Process Automation', 'RPA Tools', 'Automation', 'Process Optimization', 'National Softech']
        }
    };

    const openModal = (key) => {
        const data = details[key];
        if (!data || !modal) return;

        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalTags.innerHTML = data.tags.map(t => `<span>${t}</span>`).join('');

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('open');
        document.body.style.overflow = '';
    };

    // Attach click to all .card elements that carry a data-detail value
    document.querySelectorAll('.card[data-detail]').forEach(card => {
        card.addEventListener('click', () => openModal(card.dataset.detail));
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);

    // Close on backdrop click
    if (modal) {
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    // ─────────────────────────────────────────
    // 5. SOCIAL ICONS – open profiles (placeholders with educational message)
    // ─────────────────────────────────────────
    const linkedinIcon = document.getElementById('linkedinIcon');
    const githubIcon = document.getElementById('githubIcon');
    const toast = document.getElementById('liveToast');
    const toastMsg = document.getElementById('toastMessage');

    const showToast = (msg) => {
        if (!toast) return;
        toastMsg.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3500);
    };

    if (linkedinIcon) {
        linkedinIcon.addEventListener('click', () => {
            showToast('📌 LinkedIn profile not yet created. Add your URL in script.js');
            // window.open('https://www.linkedin.com/in/your-profile', '_blank');
        });
    }

    if (githubIcon) {
        githubIcon.addEventListener('click', () => {
            showToast('📌 GitHub profile not yet created. Add your URL in script.js');
            // window.open('https://github.com/your-username', '_blank');
        });
    }

    // ─────────────────────────────────────────
    // 6. DOWNLOAD RESUME BUTTON
    // ─────────────────────────────────────────
    const downloadBtn = document.getElementById('downloadResumeBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            // On file:// we cannot verify the file exists and clicking a
            // missing anchor opens a broken tab. Show a guide toast instead.
            if (location.protocol === 'file:') {
                showToast('📄  Add resume.pdf to your portfolio folder to enable download.');
                return;
            }
            // On a real server: verify before downloading
            fetch('resume.pdf', { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        const link = document.createElement('a');
                        link.href = 'resume.pdf';
                        link.download = 'Sasmitha_S_Resume.pdf';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        showToast('⬇️  Downloading resume...');
                    } else {
                        showToast('📄  resume.pdf not found — place it in the portfolio folder.');
                    }
                })
                .catch(() => showToast('⚠️  Could not reach the file. Please try again.'));
        });
    }

    // ─────────────────────────────────────────
    // 7. SCROLL-REVEAL (IntersectionObserver)
    // ─────────────────────────────────────────
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    // Reveal these elements on scroll
    document.querySelectorAll(
        '.objective-card, .edu-soft-row, .card, .contact-section, ' +
        '.interest-item, footer'
    ).forEach((el, i) => {
        el.classList.add('reveal');
        el.style.transitionDelay = `${i * 0.05}s`;
        revealObserver.observe(el);
    });

    // Staggered skill tag animation
    document.querySelectorAll('.skill-tag span').forEach((tag, i) => {
        tag.classList.add('reveal');
        tag.style.transitionDelay = `${i * 0.06}s`;
        revealObserver.observe(tag);
    });

    // ─────────────────────────────────────────
    // 8. CHIP HOVER – tooltip-like ripple effect
    // ─────────────────────────────────────────
    document.querySelectorAll('.chip').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.style.transform = 'scale(0.95)';
            setTimeout(() => { chip.style.transform = ''; }, 150);
        });
    });

});