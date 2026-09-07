import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Script, createContext } from 'node:vm';
import assert from 'node:assert/strict';
export async function verifyDiscovery(root = '.') {
    const context = createContext({});
    new Script(await readFile(resolve(root,'catalog-data.js'),'utf8')+'\n'+await readFile(resolve(root,'catalog-utils.js'),'utf8')).runInContext(context);
    const {items, utils} = new Script('({items:[...tu26Parts,...f139Parts,...gx35Parts,...htpParts,...batteryParts],utils:CatalogUtils})').runInContext(context);
    const search = (query,group='') => Array.from(items.filter(item=>utils.matches(item,query,group)),item=>item.id);
    assert.deepEqual(search('motor','Battery Pump'),['BATTERY-001','BATTERY-002','BATTERY-042']);
    assert.deepEqual(search('battery 001'),['BATTERY-001']);
    assert.deepEqual(search('  BATTERY-001  '),['BATTERY-001']);
    assert.equal(search('', 'GX-35').length,13);
    assert.equal(search('carburetor','139-F').length,1);
    assert.equal(search('nonexistentpart987').length,0);
    assert.equal(search('').length,222);
    const special = items.find(item=>item.name.includes('&'));
    assert.equal(new URL(utils.enquiryLink(special)).searchParams.get('text'),`Hi, I am interested in buying: ${special.name} (Product ID: ${special.id})`);
    console.log('PASS: search normalization, IDs, multiple terms, group filtering, empty/reset results and enquiry encoding.');
}
