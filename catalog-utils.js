/* Shared by the website and build verification. */
const CatalogUtils = (() => {
    function normalize(value) {
        return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '');
    }
    function matches(item, query, group = '') {
        if (group && item.catalogGroup !== group) return false;
        const text = normalize([item.id, item.name, item.catalogGroup].join(' '));
        return query.trim().split(/\s+/).filter(Boolean).every(word => text.includes(normalize(word)));
    }
    function enquiryLink(item) {
        return 'https://wa.me/919266769669?text=' + encodeURIComponent(`Hi, I am interested in buying: ${item.name} (Product ID: ${item.id})`);
    }
    return { matches, enquiryLink };
})();
