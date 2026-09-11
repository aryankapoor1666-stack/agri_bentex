import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Script, createContext } from 'node:vm';

export async function buildSite(root = '.') {
    const context = createContext({});
    new Script(await readFile(resolve(root, 'catalog-data.js'), 'utf8') + '\n' + await readFile(resolve(root, 'catalog-utils.js'), 'utf8')).runInContext(context);
    const {groups, utils} = new Script('({groups: {"grid-tu26":tu26Parts,"grid-139f":f139Parts,"grid-gx35":gx35Parts,"grid-htp":htpParts,"grid-battery":batteryParts},utils:CatalogUtils})').runInContext(context);
    const products = Object.values(groups).flat();
    const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const url = page => page === 'home' ? 'index.html' : page === 'contact' ? 'contact.html' : page === 'enquiry' ? 'enquiry.html' : `categories/${page}.html`;
    const productUrl = item => `products/${item.id.toLowerCase()}.html`;
    const thumbUrl = item => item.image.replace('images/catalog/', 'images/catalog/thumbs/').replace(/\.(?:jpe?g|png)$/i, '.jpg');
    const titles = {home:'Quality Sprayer Parts',contact:'Contact Bentex','power-sprayer':'Power Sprayer Pump Parts','htp-pump':'HTP Pump Parts','battery-pump':'Battery Pump Parts'};
    const categoryCounts = {
        'power-sprayer': groups['grid-tu26'].length + groups['grid-139f'].length + groups['grid-gx35'].length,
        'htp-pump': groups['grid-htp'].length,
        'battery-pump': groups['grid-battery'].length
    };
    const catalogueNav = page => `<nav class="catalogue-nav" aria-label="Catalogue categories">
<a class="${page==='power-sprayer'?'active ':''}catalogue-pill" href="${url('power-sprayer')}">Power Sprayer <span>${categoryCounts['power-sprayer']}</span></a>
<a class="${page==='htp-pump'?'active ':''}catalogue-pill" href="${url('htp-pump')}">HTP Pump <span>${categoryCounts['htp-pump']}</span></a>
<a class="${page==='battery-pump'?'active ':''}catalogue-pill" href="${url('battery-pump')}">Battery Pump <span>${categoryCounts['battery-pump']}</span></a>
</nav>`;
    const productSummary = item => `Genuine & imported ${item.catalogGroup} spare part from Bentex Agro Industries. Share the product ID while enquiring for faster compatibility confirmation.`;
    const card = item => `<article class="part-card reveal" data-product-id="${item.id}">
<div class="part-img-wrapper"><img src="${escape(thumbUrl(item))}" alt="${escape(item.name)}" loading="lazy" width="600" height="450"></div>
<div class="part-info"><div class="product-badges"><span>${escape(item.catalogGroup)}</span><span>Direct enquiry</span></div><div class="item-num">${item.id}</div><h3>${escape(item.name)}</h3><p class="part-group">Sprayer spare part</p><p class="part-price">Contact for price</p><a class="btn-details" href="${productUrl(item)}">View details →</a></div>
<button class="add-enquiry" type="button" data-add-enquiry="${item.id}">Add to enquiry</button><div class="card-actions"><a href="tel:+919266769669" class="btn-card-yellow" aria-label="Call about ${escape(item.name)}">📞 CALL</a><a href="${escape(utils.enquiryLink(item))}" class="btn-card-green" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp about ${escape(item.name)}">💬 WHATSAPP</a></div></article>`;
    let template = await readFile(resolve(root, 'site-template.html'), 'utf8');
    template = template.replace(/<dialog\b[\s\S]*?<\/dialog>/, '');
    template = template.replace(/<a href="#([^"]+)" data-page="[^"]+"/g, (_,page) => `<a href="${url(page)}" data-page="${page}"`);
    template = template.replace(/href="#(power-sprayer|htp-pump|battery-pump)"/g, (_,page) => `href="${url(page)}"`);
    template = template.replace(/<button class="back-btn" data-page="home">([\s\S]*?)<\/button>/g, '<a class="back-btn" href="index.html">$1</a>');
    template = template.replace('<script src="script.js"></script>', '<script src="catalog-utils.js"></script>\n    <script src="enquiry-utils.js"></script>\n    <script src="script.js"></script>\n    <script src="enquiry.js"></script>');
    template = template.replace('</nav>', '<a href="enquiry.html" class="nav-link" id="nav-enquiry">ENQUIRY <span data-enquiry-count>0</span></a></nav>');
    template = template.replace('<!-- Footer -->', '<p class="enquiry-notice" id="enquiry-notice" role="status"></p><!-- Footer -->');
    const mains = [...template.matchAll(/<main\b[\s\S]*?<\/main>/g)].map(m => m[0]);
    const shell = template.replace(/<main\b[\s\S]*?<\/main>/g, (match, offset) => offset === template.indexOf(mains[0]) ? '<!-- PAGE_CONTENT -->' : '');
    const render = (content, page, title, nested, description) => {
        let html = shell.replace('<!-- PAGE_CONTENT -->', content);
        html = html.replace('<head>', `<head>\n    <base href="${nested ? '../' : './'}">`);
        html = html.replace(/<title>.*?<\/title>/, `<title>${escape(title)} | BENTEX Agro Industries</title>\n    <meta name="description" content="${escape(description)}">`);
        html = html.replace(/class="nav-link(?: active)?"/g, 'class="nav-link"');
        html = html.replace(`class="nav-link" id="nav-${page}"`, `class="nav-link active" aria-current="page" id="nav-${page}"`);
        html = html.replace('href="#page-home"', `href="${url(page)}#main-content"`);
        return '<!-- Generated by scripts/build-site.mjs. Edit site-template.html or catalog-data.js. -->\n'+html.split('\n').map(line => line.trimEnd()).join('\n');
    };
    await mkdir(resolve(root,'categories'),{recursive:true});
    await mkdir(resolve(root,'products'),{recursive:true});
    for (const [page,title] of Object.entries(titles)) {
        let content = mains.find(m=>m.includes(`id="page-${page}"`)).replace(/id="page-[^"]+" class="page-content(?: active)?"/, 'id="main-content" class="page-content active"');
        for (const [id,items] of Object.entries(groups)) content = content.replace(`<div class="parts-grid" id="${id}"></div>`, `<div class="parts-grid" id="${id}">${items.map(card).join('\n')}</div>`);
        if (!['home','contact'].includes(page)) {
            content = content.replace('</div>\n\n        <div class="search-box">', `</div>\n\n        ${catalogueNav(page)}\n\n        <div class="search-box">`);
            content = content.replace(/<div class="search-box">[\s\S]*?<\/div>/, `<form class="search-box catalogue-tools" action="${url(page)}" method="get" data-catalog-search>
<div><label for="catalog-query">Search parts</label><input id="catalog-query" name="q" type="search" placeholder="Name, product ID or catalogue group"></div>
${page==='power-sprayer'?'<div><label for="catalog-group">Catalogue group</label><select id="catalog-group" name="group"><option value="">All groups</option><option>TU-26</option><option>139-F</option><option>GX-35</option></select></div>':''}
<button class="btn-yellow search-submit" type="submit">Search</button><button class="btn-details" type="reset">Clear filters</button>
<p class="search-status" role="status" aria-live="polite" id="search-status"></p>
<noscript><p>Search requires JavaScript. All products are listed below.</p></noscript></form>
<div id="search-empty" class="empty-state" hidden><h2>No matching parts</h2><p>Try a shorter name or product ID, or clear the filters to see all parts.</p></div>`);
        }
        await writeFile(resolve(root,url(page)),render(content,page,title,page!=='home'&&page!=='contact',`${title}. Browse Bentex Agro Industries parts and enquire by phone or WhatsApp.`));
    }
    for (const item of products) {
        const groupItems = products.filter(candidate => candidate.catalogGroup === item.catalogGroup && candidate.id !== item.id).slice(0,4);
        const related = groupItems.length ? `<section class="related-products"><div class="section-heading compact"><h2>Related ${escape(item.catalogGroup)} Parts</h2><p>Commonly checked with this catalogue group.</p></div><div class="related-grid">${groupItems.map(card).join('\n')}</div></section>` : '';
        const content = `<main id="main-content" class="page-content active product-page" tabindex="-1"><a class="back-btn" href="${url(item.category)}">← Back to ${escape(titles[item.category])}</a>
<article class="product-detail standalone-product">
<div class="detail-gallery"><div class="detail-image"><img src="${escape(thumbUrl(item))}" alt="${escape(item.name)}" width="600" height="450"></div><div class="detail-thumbs"><img src="${escape(thumbUrl(item))}" alt="" width="120" height="90"><span>Catalogue image</span></div></div>
<div class="detail-info product-buybox"><div class="product-badges"><span>${escape(item.catalogGroup)}</span><span>Genuine / imported</span></div><p class="item-num">SKU ${item.id}</p><h1>${escape(item.name)}</h1><p class="detail-summary">${escape(productSummary(item))}</p><dl class="detail-specs"><dt>Catalogue group</dt><dd>${escape(item.catalogGroup)}</dd><dt>Availability</dt><dd>Confirm on call</dd><dt>Price</dt><dd>Contact for price</dd><dt>Ordering</dt><dd>Call or WhatsApp</dd></dl><div class="detail-actions"><button class="add-enquiry" type="button" data-add-enquiry="${item.id}">Add to enquiry</button><a href="tel:+919266769669" class="btn-yellow">Call to enquire</a><a href="${escape(utils.enquiryLink(item))}" class="btn-green" target="_blank" rel="noopener noreferrer">Enquire on WhatsApp</a><button type="button" class="btn-details" id="copy-product-link">Copy product link</button><p id="copy-status" role="status"></p></div></div>
</article>
<section class="product-info-panels"><div><h2>Compatibility Help</h2><p>Send your pump model, product ID and required quantity. Bentex will confirm fitment, availability and pricing before dispatch.</p></div><div><h2>Ordering Notes</h2><ul><li>Use product ID ${item.id} while enquiring.</li><li>Photos are for identification; confirm model compatibility before purchase.</li><li>Bulk and repeat orders can be prepared in the enquiry list.</li></ul></div></section>${related}</main>`;
        await writeFile(resolve(root,productUrl(item)),render(content,item.category,item.name,true,`${item.name} (${item.id}), ${item.catalogGroup}. Contact Bentex Agro Industries for price and availability.`).replace(`href="${url(item.category)}#main-content"`, `href="${productUrl(item)}#main-content"`));
    }
    const enquiry = await readFile(resolve(root,'enquiry-content.html'),'utf8');
    await writeFile(resolve(root,'enquiry.html'),render(enquiry,'enquiry','Your enquiry list',false,'Prepare a multi-product parts enquiry for Bentex Agro Industries.'));
    console.log(`Built ${products.length+6} static pages, including ${products.length} product pages.`);
    return {pages:products.length+6,products:products.length};
}
