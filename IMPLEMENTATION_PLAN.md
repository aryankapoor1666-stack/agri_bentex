# Bentex Agro Industries website implementation plan

## Objective

Deliver a complete product catalogue with phone and WhatsApp enquiries.
Customer journey: find a part → check details → select quantity → enquire.
Use lightweight HTML, CSS and JavaScript, a central product data file, and
later a small build script to generate category and product pages.

## Phase 1 — Repair the foundation

- [x] Back up the current HTML, CSS and JavaScript before editing.
- [x] Remove explanatory prose, Markdown and sample HTML from the stylesheet.
- [x] Fix product button class mismatches and missing section layouts.
- [x] Separate catalogue data from UI code; organize rendering, navigation,
  search and enquiry-link functions.
- [x] Remove the empty TU-26 array slot caused by a duplicate comma.
- [x] Replace inline interaction handlers with event listeners; use input
  events for search and reuse one scroll observer.
- [ ] Verify all sections, navigation, search and rendering in a browser.

Acceptance: consistent section layouts and working navigation without
JavaScript errors. Missing product photography is tracked in Phase 2.

## Phase 2 — Clean up the catalogue

- [x] Audit all 222 product records and assign stable IDs.
- [x] Resolve product photography using the supplied Word catalogue tables; preserve the 89 legacy photos unchanged.
- [x] Replace all 222 product image paths with photos extracted from their source records.
- [x] Add verified category/catalogue group and source provenance.
- [ ] Confirm detailed compatibility, descriptions and specifications with the business where the source is insufficient.
- [x] Use “Contact for price” unless the business supplies actual prices.

Acceptance: valid product records and no broken image requests.
The initial 220 missing image references are resolved using the supplied DOCX
assets. All 222 products now have local photos. Detailed specifications and two
source naming ambiguities still need business input; see [catalogue audit](docs/CATALOG_AUDIT.md).

## Phase 3 — Finish desktop and mobile design

- [x] Refine the green/yellow Bentex identity and consistent page layouts.
- [x] Add mobile navigation and prominent contact actions.
- [x] Build product detail layouts and show photos without important cropping.
- [ ] Verify keyboard access, focus, labels, contrast and reduced motion.

Acceptance: usable mobile, tablet and desktop layouts without horizontal overflow.

## Phase 4 — Product discovery

- [x] Search names, IDs and source-backed catalogue groups. Detailed compatibility remains unverified.
- [x] Add power-sprayer catalogue group filtering, result counts, reset and empty states.
- [x] Generate shareable category and product URLs.
- [x] Support refresh and browser Back/Forward.
- [x] Include catalogue content in generated HTML for discoverability.

Acceptance: a customer can find a part and share a direct link to it.

## Phase 5 — Enquiry flow

- [x] Retain individual phone and WhatsApp enquiry links.
- [x] Add an enquiry list with quantities, removal and refresh persistence.
- [x] Prepare WhatsApp messages with IDs, names, quantities and optional notes.
- [x] Add a copy-message fallback.
- [x] Explain that pricing and order confirmation happen with the business.

Acceptance: a multiple-product enquiry opens WhatsApp with the correct message.
Opening WhatsApp does not prove that a message was sent or an order accepted.

## Phase 6 — Business content and search visibility

- [ ] Verify contact details, opening hours, service area and business claims.
- [ ] Add titles, descriptions, sharing metadata, favicon, sitemap and robots file.
- [ ] Add accurate LocalBusiness structured data.
- [ ] Add product structured data only where actual data meets requirements.
- [ ] Add a directions link.

Acceptance: accurate content and indexable public pages; rankings are not guaranteed.

## Phase 7 — Verification and launch

- [ ] Check image paths, IDs, links and enquiry message generation automatically.
- [ ] Test navigation, filters, quantities, persistence and responsive layouts.
- [ ] Check browser errors, keyboard access and loading performance.
- [ ] Prepare a preview, review it, then configure the chosen domain and HTTPS.
- [ ] Document product/image maintenance and deployment.

Acceptance: the complete browse-to-enquiry flow passes on the deployed website.
Dependencies: confirmed business content, required photos, hosting and domain choice.

## Optional expansion

Admin dashboard, live stock, payments, accounts and order tracking need a
backend and a separate scope. They are outside the initial catalogue launch.

## Research references

- [W3C accessibility checks](https://www.w3.org/WAI/test-evaluate/preliminary/)
- [Google LocalBusiness structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Google product structured data](https://developers.google.com/search/docs/appearance/structured-data/product)

## Work log

- 2026-09-07: Phase 1 implementation started. Original source backed up outside
  the repository at `../agri-business-backups/20260907-230508/`.
  Existing image edits and other local changes preserved. Image mapping,
  permanent URLs and enquiry lists remain assigned to later phases.

### Phase 1 validation

- Both JavaScript files passed syntax parsing.
- Catalogue evaluation confirmed 222 entries across five dense arrays.
- HTML IDs are unique; navigation targets and script loading order passed checks.
- Local HTTP preview served HTML, CSS and both JavaScript files successfully.
- Browser visual/interaction verification remains pending: browser discovery
  returned no connected browsers. Phase 1 implementation is ready for that check.
- At Phase 1 close: product images needed repair (resolved in Phase 2 below).
  Permanent URLs/history (Phase 4) and enquiry lists (Phase 5) remain pending.

### Phase 2 progress — 2026-09-07

- Inspected all three supplied Word catalogues: 126 power-sprayer, 34 HTP
  and 62 battery product/photo records. Original DOCX files remain unchanged.
- Imported 222 source-mapped images, stable IDs, source metadata and price status.
- Preserved source numbering gaps and separately listed near-duplicate products.
- Product cards show IDs/group/price status; WhatsApp messages include IDs.
- All 222 photos decode; syntax, counts, unique IDs, asset paths and hashes pass.
- Phase 2 core catalogue/image repair is implemented. Business confirmation of
  uncertain names and detailed product information remains open. Browser QA is pending.
- See [catalogue audit and maintenance notes](docs/CATALOG_AUDIT.md),
  [asset provenance](docs/catalog-asset-manifest.json) and
  [verification script](scripts/verify-catalog.mjs).

### Phase 3 progress — 2026-09-07

- Added collapsible mobile navigation with expanded-state announcements, Escape
  handling and focus management after page changes.
- Added a skip link, larger interaction targets and persistent mobile contact actions.
- Replaced external homepage stock images with local catalogue product photos.
- Added product details using a native modal dialog: source photo, stable ID,
  catalogue group, price status, and product-specific WhatsApp enquiry link.
- Added responsive detail layouts, contained photography, and retained reduced-motion rules.
- JavaScript/catalogue verification and HTML nesting, IDs, ARIA/navigation targets,
  local image paths and diff whitespace checks passed. CSS brace balance checked.
- Browser connection retried but no browser was available. Visual layouts at
  320/375/768/1440px, keyboard focus/return, Escape closing, contrast and actual
  navigation/search interaction remain unverified. Phase 3 implementation is ready
  for browser QA; do not treat its acceptance gate as passed yet.
- Product details currently open in a modal. Shareable product/category URLs
  remain Phase 4; enquiry quantities and persistence remain Phase 5.

### User screenshot verification — 2026-09-07

Reviewed 10 screenshots supplied by the user from Chrome at localhost:8765.

Confirmed within the supplied views:

- Home, Power Sprayer, Battery Pump and Contact render with matching active navigation.
- Homepage category photos and the shown TU-26 product photos load.
- Battery search for `motor` displays Double Motor Heavy, Single Motor Heavy
  and Motor Head Kit, retaining their stable IDs.
- Double Motor Heavy details display the matching photo, BATTERY-001 ID,
  catalogue group, price status and contact actions.
- The WhatsApp destination displays Bentex Agro Industries and the prepared
  message containing Double Motor Heavy and BATTERY-001. Sending/delivery was not tested.
- At the displayed 320px viewport, the homepage shows the collapsed Menu control,
  wrapped hero content and fixed contact buttons without obvious horizontal clipping.

Still pending: HTP page interaction, all-image visual review, search clear/empty
states, mobile menu expansion and selection, mobile product dialog, keyboard focus
trapping/return, Escape closing, console inspection, contrast measurement and
additional tablet/mobile widths. Screenshots confirm visible states, not every
interaction or the absence of runtime errors. Phase 1/3 acceptance remains partial.

Visual refinement opportunity: category introductions take much of the first
screen before the products; a more compact category header could make browsing faster.

### Phase 4 progress — 2026-09-07

- Generated 227 standalone HTML pages: Home, Contact, three categories and 222 products.
- Replaced the Phase 3 modal with permanent product detail pages and native links.
- Added name/ID/group search with whitespace/punctuation normalization, group filters,
  result counts, clear controls, hidden empty sections and a no-results message.
- Search/filter state lives in query parameters and restores on page load/history
  traversal; individual keystrokes replace the current entry rather than flooding history.
- Added product-link copying with a selectable-link fallback if clipboard access fails.
- Shortened category headers so catalogue browsing begins sooner.
- Catalogue content and mobile navigation remain available without JavaScript.
- Added rebuild and verification instructions in [README.md](README.md).
- Automated checks pass for 222 records/assets, search cases, enquiry encoding,
  227 generated pages, unique IDs, HTML nesting, local links and fragment targets.
- Browser connection retried: no browser available. Actual history/refresh, copy-link,
  filters and responsive behaviour on this build still require browser verification.
  Phase 4 implementation is complete; browser acceptance remains pending.

Suggested manual checks: open `categories/battery-pump.html?q=motor`, open a product,
use browser Back, refresh, clear filters, and copy a product URL into a new tab.
Then check `categories/power-sprayer.html?group=GX-35&q=starter` (two results).

### Phase 5 progress — 2026-09-08

- User reported the Phase 4 site working before Phase 5 started.
- Added Add to enquiry controls to all catalogue cards and product pages; adding
  the same product again opens the list instead of creating duplicate rows.
- Added `enquiry.html` with item counts, quantities (whole numbers 1–9999), removal,
  optional notes, empty state and prepared message preview.
- Versioned local browser storage retains IDs/quantities/notes across page loads;
  restored data is validated against the current catalogue. Cross-tab changes and
  back-forward cache restoration update the list. Storage failure is disclosed.
- Added combined WhatsApp enquiries and clipboard copying with a selectable text
  fallback. Long encoded messages use copy/paste instead of an oversized link.
- Opening WhatsApp does not clear the list or claim that the message was sent.
- Rebuilt 228 static pages; catalogue, discovery, enquiry state/message tests and
  all generated HTML/link/asset checks pass.
- Browser interaction QA for Phase 5 remains pending. Test adding two products,
  quantity changes, removal, refresh, notes, message preview and WhatsApp handoff.

### Visual design pass — 2026-09-08

- Compared the current site with the supplied Bentex Liquid Glass reference screenshots.
- Added a full-width local farm-sunrise hero with slow zoom, glow, trust chips,
  animated entrance, pointer movement and scroll cue.
- Added Barlow Condensed/DM Sans typography with system fallbacks, an olive/cream/gold
  palette, translucent sticky-header state, active-link underline motion, button sheen,
  pointer glow, card lift, image hover scale and scroll-reveal transitions.
- Replaced the homepage’s flat category presentation with image-led editorial cards
  while retaining actual catalogue photos and generated links.
- Added local `images/site/farm-sunrise.jpg` and `images/site/grower.jpg`; the latter is
  reserved for a future editorial section. Product imagery remains locally extracted
  from the supplied Word catalogues.
- Rebuilt all 228 static pages. Automated catalogue, enquiry, discovery and HTML checks pass.
- Reduced-motion users receive a static presentation. Google Fonts are requested for the
  reference typography when available, with system fallbacks when offline.
- The supplied screenshots remain the visual QA reference. Browser interaction QA for
  this animation layer still needs to be checked at desktop and mobile widths.

### Screenshot contrast fix — 2026-09-08

- Fixed contact-card headings and details that were inheriting dark text on the olive
  card background.
- Fixed enquiry-row product names, IDs, quantity labels and detail links for the same
  contrast issue.
- Rebuilt all 228 pages after the CSS correction.
- Static site verification passes: 228 HTML pages, local links/assets, unique IDs,
  page structure and 222 catalogue cards.
- Refresh the local server with a hard reload (`Cmd+Shift+R`) before checking the
  Contact and Enquiry pages so the corrected stylesheet is not cached.

### Brand logo update — 2026-09-08

- Added the supplied circular Bentex Agro mark as a cleaned transparent local asset at
  `images/site/bentex-agro-mark.png`.
- Restored the readable `BENTEX / AGRO INDUSTRIES` wordmark beside the icon on all
  228 generated pages.
- Added responsive logo sizing for desktop and mobile layouts and removed the old
  checkerboard/full-card logo asset.
