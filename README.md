# Infinite Designs — website

All 45 files sit loose in this folder. There are no subfolders, so you can select everything and drag it in one go.

## What the files are

- `index.html` — the home page
- `about.html`, `services.html`, `work.html`, `insights.html`, `careers.html`, `contact.html`, `privacy.html`, `terms.html` — the main pages
- `services-*.html` — the 13 service pages
- `work-*.html` — the 10 case study pages
- `insights-*.html` — the 6 articles
- `404.html` — shown if someone visits a page that doesn't exist
- `styles.css` — all the design: colours, fonts, spacing, layout
- `site.js` — the animations only; the site reads fine without it
- `vercel.json` — tells Vercel the web addresses. **Do not delete this file.** Without it, `/work/ostara-bank` and the other inner pages won't open.
- `sitemap.xml`, `robots.txt` — help Google find your pages

The filenames use hyphens, but the web addresses stay clean. `work-ostara-bank.html` is served at `yoursite.com/work/ostara-bank`. `vercel.json` is what does that.

## Getting it online

**1.** Go to **github.com/new**, name it `infinite-designs-website`, leave the three checkboxes unticked, click **Create repository**.

**2.** Click the link "**uploading an existing file**".

**3.** Open this folder, press **Ctrl+A** (Windows) or **Cmd+A** (Mac) to select all 45 files, and drag them onto the GitHub page.

**4.** Wait for the list to finish, then click **Commit changes** at the bottom.

**5.** Go to **vercel.com/new**, click **Import** next to your repository.

**6.** Set **Framework Preset** to **Other**. Leave Build Command, Output Directory and Install Command empty.

**7.** Click **Deploy**. Done in about twenty seconds.

If something looks wrong after deploying, check that `vercel.json` actually uploaded — it's the one file that matters most.

## Changing things later

Open any `.html` file on GitHub, click the pencil icon, edit, save. Vercel updates the live site in about thirty seconds.

To change colours or fonts, open `styles.css` and edit the values at the very top:

```css
:root{
  --ink-900:#07060D;      /* page background      */
  --violet:#7B5CFF;       /* main accent colour   */
  --cyan:#3AE0D0;         /* second accent colour */
  --marigold:#FFAE3B;     /* the big numbers      */
  --txt:#EDEBF7;          /* body text            */
}
```

Change those and the whole site changes with them.

The header and footer are repeated in every page file. To change a menu link or the address in the footer, use your editor's find-and-replace across all files.

## Three things to do before you share the site

**1. The clients are invented.** Ostara Bank, Prottasha Health, Veloce Retail, Lumenpay, Textura Mills, Skolar, Rundo Logistics, Aurelia Living, Cirrus Energy and Bayleaf Hospitality are made-up companies. They exist so you could see how a finished portfolio looks. Replace them with your real clients, or remove the case studies for now. Then delete these three notices:

- the paragraph in the footer of every page beginning `Portfolio, client names and testimonials on this site are sample content…`
- the notice near the top of `work.html`
- the "Portfolio content" section in `terms.html`

**2. The contact details are placeholders.** The Gulshan address, both phone numbers and the email addresses are examples. Search for `infinitedesigns.com.bd` and `Gulshan` across the files and replace them.

**3. The contact form doesn't send yet.** It checks that the fields are filled in correctly, then tells the visitor it isn't connected. To make it send, open `site.js`, find the comment `replace these two lines to POST to your endpoint`, and connect it to Formspree (free, no server needed) or your own email service.

## Checked before packaging

All 38 pages load with their own content, all 38 internal links work, the stylesheet loads on every page, there are no JavaScript errors, and nothing scrolls sideways on a phone.
