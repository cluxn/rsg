# Guide / Lead Magnet — Sample (shows data structure for Guides CMS)

## Metadata (admin fields)

- **Title**: The Complete Buyer's Guide to MS Pipes, Plates, Channels & Angles
- **Slug**: /guides/ms-steel-buyers-guide
- **Type**: Gated (lead capture required to download) — toggle exists per-guide, admin chooses gated vs ungated
- **Category**: Buying Guides
- **Cover image**: photo of MS pipe stock / structural steel (sourced from existing MS Pipe product photos)
- **File attachment**: ms-steel-buyers-guide.pdf (uploaded via Media Library, alt text required)
- **Short description** (shown on listing card): A practical 12-page guide to specifying MS pipes, plates, channels, and angles for construction and fabrication projects — includes size charts and grade comparisons.
- **Gate form fields**: Name, Email, Phone, Company Name (configurable per-guide via admin)

---

## Landing Page Content (rendered on /guides/ms-steel-buyers-guide)

# The Complete Buyer's Guide to MS Pipes, Plates, Channels & Angles

Specifying the wrong grade or size of structural steel leads to costly rework and project delays. This guide walks through:

- Seamless vs. semi-seamless pipe — when to use each
- MS Plate thickness ranges (2mm–100mm+) and common applications
- MS Channel and Angle standard sizes and load considerations
- A quick-reference comparison chart for choosing between manufacturers (Tata, JSW, Jindal, Apollo, Surya)

*[Cover image: MS pipe stacks / structural steel photo]*

### What's Inside

1. Introduction to Mild Steel grades
2. Pipe manufacturing: Seamless vs. Semi-Seamless explained
3. Plate, Channel & Angle size charts
4. How to read a steel specification sheet
5. Checklist: what to ask your supplier before ordering

---

## Gated Download Form (appears on this page if Type = Gated)

```
┌──────────────────────────────────────┐
│  Download the Free Guide              │
│                                        │
│  Name *        [____________]         │
│  Email *       [____________]         │
│  Phone *       [____________]         │
│  Company Name  [____________]         │
│                                        │
│        [ Download PDF ]               │
└──────────────────────────────────────┘
```

On submit: lead saved to admin Leads list (source = "Guide: MS Steel Buyers Guide"), then PDF download triggers / emailed.

---

## Listing Card Preview (how it appears on /guides)

```
┌─────────────────────────────────┐
│ [Cover image]                    │
│ Buying Guides          🔒 Gated  │
│ The Complete Buyer's Guide to    │
│ MS Pipes, Plates, Channels &     │
│ Angles                           │
│ A practical 12-page guide to     │
│ specifying MS pipes, plates...   │
│ [Get the Guide →]                │
└─────────────────────────────────┘
```

## Example Ungated Guide (for contrast)

- **Title**: Roofing Sheet Color & Profile Catalog
- **Type**: Ungated — opens PDF directly in new tab, no form
- Used for lower-friction, lower-value content (catalogs, color charts) vs. high-value guides (buyer's guides, comparison reports) which stay gated.
