# Bentex Agro Industries catalogue

A static catalogue with 222 products, category search and phone/WhatsApp enquiries.
No dependencies, database or build framework are required to serve the generated site.

## Preview

From this directory:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open `http://localhost:8765/index.html`.

## Editing and building

- `catalog-data.js`: product records, stable IDs, image paths and source metadata.
- `site-template.html`: shared layout and source content for home/category/contact pages.
- `scripts/build-site.mjs`: card/product page templates and static page generation.
- `script.js`: mobile navigation, search/URL state and copy-link behaviour.
- `catalog-utils.js`: shared search matching and WhatsApp message construction.
- `style.css`: shared responsive styles.

Do not hand-edit `index.html`, `contact.html`, `enquiry.html`, `categories/*.html` or
`products/*.html`: they are generated. After changing catalogue data or templates,
run with Node.js installed:

```sh
node --input-type=module -e "import('./scripts/build-site.mjs').then(m => m.buildSite())"
node --input-type=module -e "import('./scripts/verify-catalog.mjs').then(m => m.verifyCatalog())"
node --input-type=module -e "import('./scripts/verify-discovery.mjs').then(m => m.verifyDiscovery())"
python3 scripts/verify-site.py
```

The build creates 228 pages and must be rerun before publishing content edits.
IDs are permanent. Retired products need their old generated page removed or
redirected deliberately; the builder does not automatically delete existing files.
Deploy the generated pages together with shared CSS, JavaScript and images.

## Example URLs

- `/categories/power-sprayer.html`
- `/categories/power-sprayer.html?group=GX-35&q=starter`
- `/categories/battery-pump.html?q=motor`
- `/products/battery-001.html`

Native links provide refresh, new-tab and browser Back/Forward support. Search
updates the current URL without adding a history entry for every keystroke.
Returning from a product page restores filters from the category URL.
Product details are standalone pages, replacing Phase 3's modal dialog.

Category and product content, navigation, and enquiry links are in the HTML and
remain usable without JavaScript. Search and copy-link need JavaScript. Group
filtering indicates catalogue membership, not guaranteed engine compatibility.

## Verification status

Automated catalogue/search/static HTML checks pass. Phase 3 screenshots confirmed
representative desktop/mobile rendering and a product enquiry reaching WhatsApp.
Phase 4 browser QA remains pending: test history, refresh, filters, mobile menu,
copy-link and no-JavaScript browsing on the current generated build.
See `IMPLEMENTATION_PLAN.md` and `docs/CATALOG_AUDIT.md` for progress and source limits.

## Visual design

The current generated site includes the supplied reference direction: local farm
hero imagery, olive/cream/gold styling, Barlow Condensed display type with
fallbacks, a glassy sticky header, animated hero entrance/zoom/glow, scroll
reveals, hover lift and image sheen. `images/site/` contains the local visual
assets. Rebuild after changing `site-template.html` or the visual layer so all
category and product pages receive the same updates.

## Enquiry list (Phase 5)

Use Add to enquiry on product cards or detail pages, then open Enquiry in the
main navigation. Quantities, removal and notes are available on `/enquiry.html`.
The navigation badge counts distinct products, not total units. Repeated Add
clicks open the existing list; adjust quantity there.

`enquiry-utils.js` validates saved data and builds messages; `enquiry.js` handles
controls and persistence. `enquiry-content.html` is the enquiry page template.
Data is stored under `bentex-enquiry-v1` in this browser's localStorage; this is
not an account or shared server cart. Changing host/domain/browser uses a separate
list. Storage failures are shown; in that case copy the list before navigating away.

Run the additional tests with:

```sh
node --input-type=module -e "import('./scripts/verify-enquiry.mjs').then(m => m.verifyEnquiry())"
```

Messages contain names, IDs, quantities and notes. Prices remain unconfirmed.
Long messages provide a copy/paste handoff. Sending is completed by the customer
in WhatsApp, and the website never treats opening WhatsApp as an accepted order.

Manual acceptance: add products from two categories, set quantities, enter notes,
refresh, remove one product, inspect the message, test Copy message and open
WhatsApp. Also test empty state and narrow/mobile layout. These Phase 5 browser
checks have not yet been completed by the agent.
