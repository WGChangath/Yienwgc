document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const backToTopBtn = document.getElementById('back-to-top');
    const currentYearEl = document.getElementById('year');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const revealElements = document.querySelectorAll('.reveal');
    const THEME_KEY = 'portfolio-theme';
    const getStoredTheme = () => localStorage.getItem(THEME_KEY);
    const setStoredTheme = (t) => localStorage.setItem(THEME_KEY, t);
    const applyTheme = (t) => htmlElement.setAttribute('data-theme', t);
    const initTheme = () => {
        const stored = getStoredTheme();
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(stored || (prefersDark ? 'dark' : 'light'));
    };
    if (themeToggle) themeToggle.addEventListener('click', () => {
        const cur = htmlElement.getAttribute('data-theme');
        const nxt = cur === 'dark' ? 'light' : 'dark';
        applyTheme(nxt); setStoredTheme(nxt);
    });
    initTheme();
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();
    window.addEventListener('scroll', () => {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        if (backToTopBtn) backToTopBtn.classList.toggle('visible', window.scrollY > 500);
    });
    if (backToTopBtn) backToTopBtn.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
    if (navToggle && navMenu) navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    navLinks.forEach(l => l.addEventListener('click', () => {
        if (navToggle) navToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
    }));
    const sections = document.querySelectorAll('section[id]');
    const secObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const id = e.target.getAttribute('id');
                navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id || l.getAttribute('href').endsWith('#' + id)));
            }
        });
    }, {root:null, rootMargin:'-20% 0px -60% 0px', threshold:0});
    sections.forEach(s => secObs.observe(s));
    const revObs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('active'); revObs.unobserve(e.target); } });
    }, {threshold:0.1});
    revealElements.forEach(el => revObs.observe(el));
    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.skill-progress').forEach(p => p.style.width = p.getAttribute('data-progress') + '%');
                skillObs.unobserve(e.target);
            }
        });
    }, {threshold:0.3});
    document.querySelectorAll('.skills-category').forEach(c => skillObs.observe(c));
    filterBtns.forEach(btn => btn.addEventListener('click', () => {
        filterBtns.forEach(b=>b.classList.remove('active')); btn.classList.add('active');
        const f = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            const cat = card.getAttribute('data-category');
            card.classList.toggle('hidden', !(f==='all' || cat===f));
        });
    }));
    const openModal = (c) => { modalBody.innerHTML=c; projectModal.classList.add('open'); document.body.style.overflow='hidden'; };
    const closeModal = () => { projectModal.classList.remove('open'); document.body.style.overflow=''; modalBody.innerHTML=''; };
    document.querySelectorAll('.project-btn').forEach(btn => btn.addEventListener('click', (e) => {
        const card = e.target.closest('.project-card'); if(!card) return;
        const title = card.querySelector('h3')?.textContent || '';
        const desc = card.querySelector('p')?.textContent || '';
        const img = card.querySelector('img')?.getAttribute('src') || '';
        const tags = Array.from(card.querySelectorAll('.project-tags span')).map(t=>t.textContent);
        const links = card.querySelector('.project-links')?.innerHTML || '';
        let html='';
        if(img) html += '<img src="'+img+'" alt="'+title+'">';
        html += '<h3>'+title+'</h3><p>'+desc+'</p>';
        if(tags.length){ html += '<div class="project-tags" style="margin-bottom:1.5rem;">'; tags.forEach(t=>html+='<span>'+t+'</span>'); html+='</div>'; }
        if(links) html += '<div class="project-links">'+links+'</div>';
        openModal(html);
    }));
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (projectModal) projectModal.addEventListener('click', (e)=>{ if(e.target===projectModal) closeModal(); });
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && projectModal?.classList.contains('open')) closeModal(); });
    if (contactForm) {
        const name=document.getElementById('name'), email=document.getElementById('email'), subject=document.getElementById('subject'), msg=document.getElementById('message');
        const nE=document.getElementById('name-error'), eE=document.getElementById('email-error'), sE=document.getElementById('subject-error'), mE=document.getElementById('message-error');
        const show=(i,er,m)=>{ if(i)i.classList.add('error'); if(er)er.textContent=m; };
        const clr=(i,er)=>{ if(i)i.classList.remove('error'); if(er)er.textContent=''; };
        const validEmail=v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
        [name,email,subject,msg].forEach(i=>{ if(i) i.addEventListener('input',()=>clr(i,document.getElementById(i.id+'-error'))); });
        contactForm.addEventListener('submit', (e)=>{
            e.preventDefault(); let ok=true;
            if(name && name.value.trim().length<2){ show(name,nE,'Name must be at least 2 characters'); ok=false; } else if(name) clr(name,nE);
            if(email && !validEmail(email.value)){ show(email,eE,'Please enter a valid email'); ok=false; } else if(email) clr(email,eE);
            if(subject && subject.value.trim().length<3){ show(subject,sE,'Subject too short'); ok=false; } else if(subject) clr(subject,sE);
            if(msg && msg.value.trim().length<10){ show(msg,mE,'Message too short'); ok=false; } else if(msg) clr(msg,mE);
            if(ok){ if(formSuccess) formSuccess.classList.add('show'); contactForm.reset(); setTimeout(()=>formSuccess?.classList.remove('show'),5000); }
        });
    }
});
