/* Versioned, validated local enquiry data. Only IDs, quantities and notes are saved. */
const EnquiryUtils = (() => {
    const key = 'bentex-enquiry-v1';
    function sanitize(value, products) {
        const ids = new Set(products.map(p => p.id));
        const items = new Map();
        if (value?.version === 1 && Array.isArray(value.items)) {
            for (const item of value.items) {
                if (item && ids.has(item.id) && Number.isInteger(item.quantity) && item.quantity >= 1 && item.quantity <= 9999) {
                    items.set(item.id, {id:item.id, quantity:item.quantity});
                }
            }
        }
        return {version:1, items:[...items.values()], notes:value?.version === 1 && typeof value.notes === 'string' ? value.notes.slice(0,1000) : ''};
    }
    function load(storage, products) {
        try { return {state:sanitize(JSON.parse(storage.getItem(key)),products), available:true}; }
        catch { return {state:sanitize(null,products), available:false}; }
    }
    function message(state, products) {
        const clean = sanitize(state,products);
        if (!clean.items.length) return '';
        const byId = new Map(products.map(p=>[p.id,p]));
        return ['Hi Bentex Agro Industries, please quote for:', '', ...clean.items.map((item,index)=>`${index+1}. ${byId.get(item.id).name} (${item.id}) — Qty: ${item.quantity}`), ...(clean.notes.trim()?['','Notes: '+clean.notes.trim()]:[]), '', 'Please confirm compatibility, availability and pricing.'].join('\n');
    }
    return {key,sanitize,load,message};
})();
