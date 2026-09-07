import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Script, createContext } from 'node:vm';
import { resolve } from 'node:path';

// Run from the project directory:
// node --input-type=module -e "import('./scripts/verify-catalog.mjs').then(m => m.verifyCatalog())"
export async function verifyCatalog(root = '.') {
    const source = await readFile(resolve(root, 'catalog-data.js'), 'utf8');
    new Script(await readFile(resolve(root, 'script.js'), 'utf8'));
    const context = createContext({});
    new Script(source).runInContext(context);
    const groups = new Script('({tu26Parts, f139Parts, gx35Parts, htpParts, batteryParts})').runInContext(context);
    const expected = {tu26Parts: 93, f139Parts: 20, gx35Parts: 13, htpParts: 34, batteryParts: 62};
    const manifest = JSON.parse(await readFile(resolve(root, 'docs/catalog-asset-manifest.json'), 'utf8'));
    const records = Object.values(groups).flat();
    const assert = (condition, message) => { if (!condition) throw new Error(message); };
    assert(records.length === 222, 'Expected 222 product records');
    assert(new Set(records.map(p => p.id)).size === records.length, 'Duplicate product IDs');
    assert(manifest.length === records.length, 'Manifest count mismatch');
    assert(new Set(manifest.map(m => m.id)).size === manifest.length, 'Duplicate manifest IDs');
    for (const [name, items] of Object.entries(groups)) {
        assert(items.length === expected[name], `Wrong count: ${name}`);
        assert(Object.keys(items).length === items.length, `Sparse array: ${name}`);
    }
    for (const product of records) {
        assert(/^(TU26|139F|GX35|HTP|BATTERY)-\d{3}$/.test(product.id), `Invalid ID: ${product.id}`);
        assert(product.name && product.catalogGroup && product.category, `Missing metadata: ${product.id}`);
        assert(product.price === null && product.priceLabel === 'Contact for price', `Unverified price: ${product.id}`);
        assert(/^images\/catalog\/[a-z0-9-]+\.(jpeg|png)$/.test(product.image), `Unsafe image path: ${product.id}`);
        const asset = manifest.find(m => m.id === product.id);
        assert(asset && asset.image === product.image, `Missing asset provenance: ${product.id}`);
        assert(JSON.stringify(asset.source) === JSON.stringify(product.source), `Source mismatch: ${product.id}`);
        const bytes = await readFile(resolve(root, product.image));
        assert(bytes.length > 100, `Empty asset: ${product.id}`);
        assert(createHash('sha256').update(bytes).digest('hex') === asset.sha256, `Changed image bytes: ${product.id}`);
    }
    console.log('PASS: JavaScript syntax, 222 products, unique IDs, category counts, pricing, image paths and SHA-256 provenance.');
    return {products: records.length, images: manifest.length};
}
