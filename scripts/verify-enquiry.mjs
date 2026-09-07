import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {Script,createContext} from 'node:vm';
import assert from 'node:assert/strict';
export async function verifyEnquiry(root='.') {
    const context=createContext({});
    for(const file of ['catalog-data.js','enquiry-utils.js'])new Script(await readFile(resolve(root,file),'utf8')).runInContext(context);
    new Script(await readFile(resolve(root,'enquiry.js'),'utf8'));
    const {products,u}=new Script('({products:[...tu26Parts,...f139Parts,...gx35Parts,...htpParts,...batteryParts],u:EnquiryUtils})').runInContext(context);
    const plain=x=>JSON.parse(JSON.stringify(x));
    const raw={version:1,items:[{id:'BATTERY-001',quantity:2},{id:'TU26-003',quantity:4}],notes:'Pump model & delivery: Delhi\nPlease confirm fitment.'};
    const memory=new Map([[u.key,JSON.stringify(raw)]]);
    const storage={getItem:key=>memory.get(key)??null};
    assert.deepEqual(plain(u.load(storage,products).state),raw);
    const message=u.message(raw,products);
    assert.match(message,/Double Motor Heavy \(BATTERY-001\) — Qty: 2/);
    assert.match(message,/Ignition Coil TU-26 \(TU26-003\) — Qty: 4/);
    assert.ok(message.includes(raw.notes));
    assert.equal(new URL('https://wa.me/919266769669?text='+encodeURIComponent(message)).searchParams.get('text'),message);
    assert.equal(u.message({version:1,items:[],notes:'test'},products),'');
    assert.equal(u.sanitize({version:1,items:[{id:'fake',quantity:1},{id:'BATTERY-001',quantity:0},{id:'TU26-001',quantity:1.5}]},products).items.length,0);
    const duplicates=u.sanitize({version:1,items:[{id:'BATTERY-001',quantity:1},{id:'BATTERY-001',quantity:3}],notes:'x'.repeat(1100)},products);
    assert.equal(duplicates.items.length,1);assert.equal(duplicates.items[0].quantity,3);assert.equal(duplicates.notes.length,1000);
    assert.equal(u.load({getItem:()=>'{broken'},products).state.items.length,0);
    assert.equal(u.load({getItem:()=>{throw Error('denied');}},products).available,false);
    assert.equal(u.sanitize({version:999,items:raw.items},products).items.length,0);
    console.log('PASS: enquiry storage round-trip, quantities, invalid/stale records, duplicate IDs, notes limits, message contents/encoding and storage failure.');
}
