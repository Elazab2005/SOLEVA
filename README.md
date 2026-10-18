# SOLEVA storefront

SOLEVA is a static, framework-free storefront built with HTML, CSS, and browser JavaScript. It has no build step or package dependencies. Open `index.html` in a browser to preview it, or serve this directory as the site root with any static web server.

## Current scope

- English and Arabic UI with a persisted language choice and RTL layout.
- Product browsing, bilingual search, category, gender, size, color and price filters, sorting, size and color selection, cart, and wishlist use browser storage.
- The catalog is sample data in `js/products.js`. Fifteen of sixteen products use local AI-generated concept images from two supplied image collections; one unmatched style keeps its existing SVG concept illustration. These are portfolio visuals, not verified photos of manufactured stock. Some concepts may contain inaccurate brand-like marks; no affiliation or authenticity is claimed. Replace these visuals with approved product photography before publishing a real catalog.
- The supplied homepage hero image is stored locally at `assets/photography/soleva-home-hero.png`. The homepage also uses two Pexels editorial lifestyle photos that are not represented as specific SOLEVA products.
- Photo sources, attribution/licensing notes and catalog concept mappings are listed in `assets/photography/manifest.md`.
- Checkout is a local form demonstration only. It does not submit orders, process payment, or transmit customer details. No card details are requested.
- Newsletter signup is not connected to a mailing service.

## Production integrations still needed

Connect a trusted product and inventory source, order processing, a payment provider, and any customer or newsletter services before accepting real orders. Confirm shipping and returns policies and add approved contact and policy pages before publishing.

There is no build or automated test command in this static project. Browser behavior and JavaScript syntax were checked manually during this update.
