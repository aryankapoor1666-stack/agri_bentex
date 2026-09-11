(() => {
    'use strict';
    const products = [...tu26Parts,...f139Parts,...gx35Parts,...htpParts,...batteryParts];
    const byId = new Map(products.map(item=>[item.id,item]));
    const storage = {getItem:key=>window.localStorage.getItem(key), setItem:(key,value)=>window.localStorage.setItem(key,value)};
    let loaded = EnquiryUtils.load(storage,products);
    let state = loaded.state;
    let available = loaded.available;
    const notice = document.getElementById('enquiry-notice');
    const list = document.getElementById('enquiry-items');
    const notes = document.getElementById('enquiry-notes');
    let noticeTimer;
    function announce(text) {
        clearTimeout(noticeTimer);
        notice.textContent = text + (available ? '' : ' Browser storage is unavailable. Your list will not survive navigation or refresh; copy it before leaving this page.');
        if(available) noticeTimer=setTimeout(()=>{notice.textContent='';},5000);
    }
    function save() {
        try { storage.setItem(EnquiryUtils.key,JSON.stringify(state)); available=true; }
        catch { available=false; }
    }
    function updateSummary() {
        document.querySelectorAll('[data-enquiry-count]').forEach(el=>{el.textContent=String(state.items.length);});
        document.querySelectorAll('[data-add-enquiry]').forEach(button=>{
            const added=state.items.some(item=>item.id===button.dataset.addEnquiry);
            button.textContent=added?'Added · view enquiry':'+ Add to enquiry';
        });
        if (!list) return;
        document.getElementById('enquiry-empty').hidden=state.items.length>0;
        document.getElementById('enquiry-content').hidden=!state.items.length;
        const summaryCount=document.getElementById('enquiry-summary-count');
        if(summaryCount)summaryCount.textContent=`${state.items.length} selected ${state.items.length===1?'part':'parts'}`;
        const message=EnquiryUtils.message(state,products);
        document.getElementById('enquiry-preview').textContent=message;
        document.getElementById('enquiry-copy-text').value=message;
        const url='https://wa.me/919266769669?text='+encodeURIComponent(message);
        const send=document.getElementById('send-enquiry');
        // Keep large lists copyable instead of relying on an oversized URL.
        const tooLong=url.length>7000;
        send.href=tooLong?'https://wa.me/919266769669':url;
        send.textContent=tooLong?'Open WhatsApp to paste message':'Enquire on WhatsApp';
        document.getElementById('enquiry-long').hidden=!tooLong;
    }
    function render() {
        if (list) {
            list.replaceChildren();
            for (const entry of state.items) {
                const item=byId.get(entry.id);
                const row=document.createElement('article');row.className='enquiry-row';
                const imageLink=document.createElement('a');imageLink.className='enquiry-product-image';imageLink.href=`products/${item.id.toLowerCase()}.html`;
                const image=document.createElement('img');image.src=item.image;image.alt=item.name;image.width=120;image.height=90;
                imageLink.append(image);
                const info=document.createElement('div');info.className='enquiry-product-info';
                const link=document.createElement('a');link.href=`products/${item.id.toLowerCase()}.html`;link.textContent=item.name;
                const id=document.createElement('p');id.className='item-num';id.textContent=item.id;
                const group=document.createElement('p');group.textContent=item.catalogGroup;
                info.append(link,id,group);
                const label=document.createElement('label');label.className='quantity-field';label.textContent='Quantity';
                const control=document.createElement('div');control.className='quantity-control';
                const minus=document.createElement('button');minus.type='button';minus.textContent='-';minus.setAttribute('aria-label',`Decrease quantity for ${item.name}`);
                const input=document.createElement('input');input.type='number';input.min='1';input.max='9999';input.step='1';input.value=String(entry.quantity);input.required=true;
                input.setAttribute('aria-label',`Quantity for ${item.name}`);
                const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label',`Increase quantity for ${item.name}`);
                function setQuantity(value){
                    entry.quantity=Math.min(9999,Math.max(1,value));input.value=String(entry.quantity);minus.disabled=entry.quantity<=1;input.removeAttribute('aria-invalid');save();updateSummary();
                }
                minus.addEventListener('click',()=>{setQuantity(entry.quantity-1);announce('Quantity updated.');});
                plus.addEventListener('click',()=>{setQuantity(entry.quantity+1);announce('Quantity updated.');});
                minus.disabled=entry.quantity<=1;
                input.addEventListener('input',()=>{
                    const value=input.valueAsNumber;
                    if (!input.validity.valid || !Number.isInteger(value)) {
                        input.setAttribute('aria-invalid','true');
                        input.setCustomValidity('Enter a whole quantity from 1 to 9999.');
                        // Reset custom validity to allow the next corrected input to validate.
                        input.reportValidity();input.setCustomValidity('');return;
                    }
                    setQuantity(value);announce('Quantity saved.');
                });
                input.addEventListener('blur',()=>{input.value=String(entry.quantity);input.removeAttribute('aria-invalid');});
                control.append(minus,input,plus);label.append(control);
                const remove=document.createElement('button');remove.type='button';remove.className='remove-enquiry';remove.textContent='Remove';remove.setAttribute('aria-label',`Remove ${item.name}`);
                remove.addEventListener('click',()=>{
                    const index=state.items.indexOf(entry);state.items.splice(index,1);save();render();announce(`${item.name} removed.`);
                    const next=list.querySelectorAll('button')[Math.min(index,state.items.length-1)];
                    if(next)next.focus();else document.querySelector('#enquiry-empty a').focus();
                });
                row.append(imageLink,info,label,remove);list.append(row);
            }
            notes.value=state.notes;
        }
        updateSummary();
    }
    document.querySelectorAll('[data-add-enquiry]').forEach(button=>button.addEventListener('click',()=>{
        const id=button.dataset.addEnquiry;
        if(state.items.some(item=>item.id===id)){window.location.href=new URL('enquiry.html',document.baseURI).href;return;}
        state.items.push({id,quantity:1});save();updateSummary();announce(`${byId.get(id).name} added to your enquiry.`);
    }));
    if(notes)notes.addEventListener('input',()=>{state.notes=notes.value.slice(0,1000);save();updateSummary();if(!available)announce('Notes updated.');});
    document.getElementById('copy-enquiry')?.addEventListener('click',async()=>{
        const message=EnquiryUtils.message(state,products);if(!message)return;
        const status=document.getElementById('enquiry-copy-status');
        try{await navigator.clipboard.writeText(message);status.textContent='Message copied. Paste it into WhatsApp.';document.getElementById('copy-enquiry-fallback').hidden=true;}
        catch{document.getElementById('copy-enquiry-fallback').hidden=false;const field=document.getElementById('enquiry-copy-text');field.value=message;field.focus();field.select();status.textContent='Select and copy the message below.';}
    });
    function reload(){loaded=EnquiryUtils.load(storage,products);state=loaded.state;available=loaded.available;render();if(!available)announce('');}
    window.addEventListener('pageshow',event=>{if(event.persisted)reload();});
    window.addEventListener('storage',event=>{if(event.key===EnquiryUtils.key || event.key===null){reload();announce('Enquiry updated from another tab.');}});
    render();if(!available)announce('');
})();
