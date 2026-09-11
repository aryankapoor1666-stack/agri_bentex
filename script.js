/* Progressive enhancements. Product content and navigation work as static HTML. */
(() => {
    'use strict';
    document.documentElement.classList.add('js');
    const products = [...tu26Parts, ...f139Parts, ...gx35Parts, ...htpParts, ...batteryParts];
    const byId = new Map(products.map(item => [item.id, item]));
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    function setMenu(open) {
        nav.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
    }
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            toggle.focus();
        }
    });
    const desktop = window.matchMedia('(min-width: 1101px)');
    desktop.addEventListener('change', () => {
        if (desktop.matches) {
            const focused = document.activeElement === toggle;
            setMenu(false);
            if (focused) nav.querySelector('.active').focus();
        } else if (nav.contains(document.activeElement)) setMenu(true);
    });

    const header = document.querySelector('.site-header');
    const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const revealObserver = 'IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? new IntersectionObserver(entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        }), { threshold: 0.12 })
        : null;
    document.querySelectorAll('.reveal, .feature-card, .category-card, .banner-cta, .c-card').forEach(element => {
        element.classList.add('reveal-on-scroll');
        revealObserver?.observe(element);
    });

    window.addEventListener('pointermove', event => {
        if (window.matchMedia('(pointer: fine)').matches) {
            document.documentElement.style.setProperty('--mx', `${event.clientX}px`);
            document.documentElement.style.setProperty('--my', `${event.clientY}px`);
        }
    }, { passive: true });
    const hero = document.querySelector('.hero-home');
    const heroContent = hero?.querySelector('.hero-content');
    hero?.addEventListener('pointermove', event => {
        if (!heroContent || !window.matchMedia('(pointer: fine)').matches) return;
        const x = (event.clientX / hero.clientWidth - 0.5) * 8;
        const y = (event.clientY / hero.clientHeight - 0.5) * 8;
        heroContent.style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
    hero?.addEventListener('pointerleave', () => { if (heroContent) heroContent.style.transform = ''; });

    const form = document.querySelector('[data-catalog-search]');
    if (form) {
        const query = form.elements.namedItem('q');
        const group = form.elements.namedItem('group');
        const cards = [...document.querySelectorAll('.part-card')];
        function filter(updateUrl = true) {
            let count = 0;
            cards.forEach(card => {
                const visible = CatalogUtils.matches(byId.get(card.dataset.productId), query.value, group?.value || '');
                card.hidden = !visible;
                if (visible) count++;
            });
            document.querySelectorAll('.parts-catalog').forEach(section => {
                section.hidden = !section.querySelector('.part-card:not([hidden])');
            });
            document.getElementById('search-status').textContent = count === 0 ? 'No matching parts' : 'Showing matching parts';
            document.getElementById('search-empty').hidden = count !== 0;
            if (updateUrl) {
                const url = new URL(window.location.href);
                for (const [key,value] of [['q',query.value],['group',group?.value || '']]) {
                    if (value) url.searchParams.set(key,value);
                    else url.searchParams.delete(key);
                }
                window.history.replaceState(null,'',url);
            }
        }
        function restore() {
            const params = new URLSearchParams(window.location.search);
            query.value = params.get('q') || '';
            if (group) group.value = params.get('group') || '';
            filter(false);
        }
        form.addEventListener('input', () => filter());
        form.addEventListener('change', () => filter());
        form.addEventListener('submit', event => { event.preventDefault(); filter(); });
        form.addEventListener('reset', event => {
            event.preventDefault();
            query.value = '';
            if (group) group.value = '';
            filter();
            query.focus();
        });
        window.addEventListener('popstate',restore);
        window.addEventListener('pageshow',restore);
        restore();
    }
    const copy = document.getElementById('copy-product-link');
    if (copy) copy.addEventListener('click', async () => {
        const status = document.getElementById('copy-status');
        try {
            await navigator.clipboard.writeText(window.location.href);
            status.textContent = 'Product link copied.';
        } catch {
            status.textContent = 'Copy this link: ';
            const field = document.createElement('input');
            field.type = 'text';
            field.readOnly = true;
            field.value = window.location.href;
            field.setAttribute('aria-label','Product link to copy');
            status.append(field);
            field.focus();
            field.select();
        }
    });
})();
