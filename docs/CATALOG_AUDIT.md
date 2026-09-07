# Phase 2 catalogue and asset audit

Updated: 2026-09-07

## Source documents

Read from Downloads without modifying the originals:

- `POWER SPRAYER LIST (PHOTO).docx`
- `HTP PUMP LIST (PHOTO).docx`
- `BATTERY PUMP LIST (PHOTO).docx`

Each populated table record contains a serial number, picture, name, quantity
and price cell. Records are arranged in two groups of five cells per row.
Photos were matched using the image relationship in the same record as the
name, not ZIP image order or a filename guess. The source has no supplied prices.

| Website group | Products | Local photo mappings | Source numbering |
| --- | ---: | ---: | --- |
| TU-26 | 93 | 93 | 1–93 |
| 139-F | 20 | 20 | 1–17, 19–21 |
| GX-35 | 13 | 13 | 1–13 |
| HTP | 34 | 34 | 1–10, 12–35 |
| Battery | 62 | 62 | 1–62 |
| Total | 222 | 222 | |

## Completed

- Matched all 222 existing product names to the corresponding source records.
- Extracted a local browser-compatible JPEG/PNG for every product.
- Kept the 89 original files in `images/parts/` unchanged. The source documents
  supersede the need to guess mappings for those legacy files. They are no
  longer referenced by product cards; a higher-resolution photo review is optional.
- Added permanent IDs such as `TU26-001`, `139F-019` and `HTP-012`.
- Stored source document, table, row, original name, serial number and media member
  on each record; stored image hashes in `catalog-asset-manifest.json`.
- Added catalogue group/category fields and explicit “Contact for price”.
- Displayed IDs, catalogue group and price status on product cards; included IDs
  in the prepared WhatsApp message so similarly named products are distinguishable.
- Retained existing human-readable product names, with source spelling recorded separately.

## Source limitations and review notes

- HTP skips serial 11; 139-F skips serial 18. These are source numbering gaps,
  not deleted products. Blank numbered cells were not imported as products.
- TU-26 serials 49 and 50 have almost identical valve assembly names. Keep both
  because the source lists them separately; the business should confirm the distinction.
- TU-26 serials 89 and 90 say “CYLENSER BOLT” in the source. The existing site
  calls them “Cylinder Bolt Short/Long”. This naming discrepancy needs business
  confirmation; no additional compatibility claim was inferred.
- The 222 mappings contain 208 distinct image hashes. Reused source photographs
  are retained and do not establish that two catalogue records are interchangeable.
- Extracted photos are only 108–353 pixels wide. They are suitable as catalogue
  thumbnails; sharper originals would improve large product-detail views.
- Category/group membership is source-backed. It is not a guarantee that every
  listed accessory fits every engine in that group. Detailed compatibility,
  specifications, stock and descriptions require further verified business input.

## Verification

- JavaScript syntax and all five category counts checked.
- All 222 files decoded successfully with positive pixel dimensions.
- Unique IDs, local paths and SHA-256 image hashes checked by `scripts/verify-catalog.mjs`.
- Source relationship mapping checked against the Word tables.
- Representative photos from all five groups visually inspected.
- Full DOCX page rendering was unavailable because LibreOffice is not installed;
  table XML and embedded photos were inspected instead. Original DOCX layout fidelity
  is not claimed, and no modified DOCX is being delivered.
- Browser visual/interaction QA remains pending because no browser was connected
  during Phase 1. Static checks do not establish responsive rendering or interaction quality.

## Maintenance

Edit `catalog-data.js` to update website records. Keep IDs stable even when sorting
or renaming products. Retain the source metadata when replacing an asset, and update
its manifest hash after verifying the replacement. Do not infer fitment or prices.

With Node installed, run from the repository root:

```sh
node --input-type=module -e "import('./scripts/verify-catalog.mjs').then(m => m.verifyCatalog())"
```

`catalog-image-dimensions.json` records the imported image dimensions. The documents
in Downloads remain the source of truth for the extracted photos and serial numbers.
