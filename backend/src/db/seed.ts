import bcrypt from 'bcrypt';
import { pool } from './connection';

async function seed() {
  const email = process.env.ADMIN_EMAIL || 'admin@rsgprofilesheets.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@RSG2024';
  const hash = await bcrypt.hash(password, 12);

  await pool.query(
    'INSERT IGNORE INTO admin_users (email, password_hash, name) VALUES (?, ?, ?)',
    [email, hash, 'Admin']
  );

  await pool.query(`
    INSERT IGNORE INTO settings (\`key\`, value) VALUES
    ('whatsapp_number', '919918522988'),
    ('business_email', 'shivamgupta@rsgprofilesheets.com'),
    ('business_address', '53-A, Industrial Estate, Dada Nagar, Kanpur, Uttar Pradesh 208022, India'),
    ('business_hours', 'Mon–Sat 10 AM – 6 PM, Closed Sunday'),
    ('business_phone', '+91-9918522988')
  `);

  const products = [
    ['colour-coated-roofing-sheet', 'Colour Coated Roofing Sheet', 1],
    ['ms-plate-channel-angle', 'MS Plate, Channel & Angle', 2],
    ['ms-pipe', 'MS Pipe', 3],
    ['decking-sheet', 'Decking Sheet', 4],
    ['purlins', 'Purlins', 5],
    ['polycarbonate-sheet', 'Polycarbonate Sheet', 6],
    ['crimping-sheet', 'Crimping Sheet', 7],
    ['self-drilling-screws', 'Self Drilling Screws', 8],
    ['turbo-air-ventilator', 'Turbo Air Ventilator', 9],
    ['accessories', 'Accessories', 10],
  ];

  for (const [slug, name, order] of products) {
    await pool.query(
      'INSERT IGNORE INTO products (slug, name, display_order) VALUES (?, ?, ?)',
      [slug, name, order]
    );
  }

  const [[{ testimonialCount }]] = await pool.query(
    'SELECT COUNT(*) as testimonialCount FROM testimonials'
  ) as [{ testimonialCount: number }[], unknown];
  if (testimonialCount === 0) {
    await pool.query(`
      INSERT INTO testimonials (text, author_name, author_city, rating, source, active) VALUES
      ('Satisfactory service and behaviour.', 'Shivkant Dixit', 'Kanpur', 4.5, 'google', TRUE),
      ('Extremely professional company with good quality products.', 'Arvind Yadav', 'Kanpur', 5.0, 'google', TRUE),
      ('Very Nice and Good approaching system in this organisation.', 'Vijay Prajapati', 'Mumbai', 4.0, 'indiamart', TRUE),
      ('Good quality and timely delivery.', 'Santosh Gupta', 'Mumbai', 4.0, 'indiamart', TRUE)
    `);
  }

  const blogPosts = [
    {
      slug: 'how-to-choose-color-coated-roofing-sheet',
      title: 'How to Choose the Right Colour Coated Roofing Sheet for Your Industrial Project',
      category: 'Roofing Guides',
      excerpt: 'Choosing the wrong roofing sheet can cost you in repairs and replacements within a few years. Here’s how to pick the right coating, gauge, and profile for your project.',
      featured_image: '/images/products/colour-coated-roofing-sheet-new.png',
      author_name: 'Mohit Sharma',
      days_ago: 2,
      body: `
        <p>Choosing a roofing sheet isn't just about price per square foot &mdash; the coating type, base metal, and profile all affect how long your roof lasts and how much maintenance it needs. Here's what to check before you place a bulk order.</p>
        <h2>1. Base Metal: GI vs Galvalume</h2>
        <p>Most colour coated sheets start as either <strong>Galvanized Iron (GI)</strong> or <strong>Galvalume Steel</strong> (Aluminium-Zinc Alloy Steel).</p>
        <ul>
          <li><strong>GI</strong> is more affordable and widely available, suited for standard residential/commercial roofing in moderate climates.</li>
          <li><strong>Galvalume</strong> offers better corrosion resistance and heat reflectivity &mdash; recommended for coastal areas or industrial sheds exposed to chemical fumes.</li>
        </ul>
        <h2>2. Coating Type: PPGI vs PPGL</h2>
        <p>Pre-painted sheets (PPGI/PPGL) add a polymer top coat over the base metal for colour, UV resistance, and an extra corrosion barrier. PPGL (Galvalume base) generally outlasts PPGI in harsh environments.</p>
        <h2>3. Sheet Gauge &amp; Thickness</h2>
        <p>Thicker sheets (lower gauge number) cost more upfront but resist denting from hail, foot traffic during installation, and wind uplift. For industrial sheds, we typically recommend 0.45mm&ndash;0.50mm TCT; for residential, 0.35mm&ndash;0.40mm is common.</p>
        <h2>4. Profile</h2>
        <p>Trapezoidal profiles handle longer spans with fewer purlins; corrugated/crimped profiles are better suited for curved roofs and aesthetic finishes.</p>
        <h3>Need Help Choosing?</h3>
        <p>Our team can recommend the right specification based on your span, location, and budget &mdash; get in touch for a factory-direct quote.</p>
      `,
    },
    {
      slug: 'gi-vs-galvalume-steel-coating-comparison',
      title: 'GI vs Galvalume: Which Steel Coating Lasts Longer in Indian Weather?',
      category: 'Roofing Guides',
      excerpt: 'Monsoons, coastal humidity, and industrial fumes all test a coating differently. Here’s a side-by-side look at GI and Galvalume steel for Indian conditions.',
      featured_image: '/images/products/galvanized-plain-sheets.png',
      author_name: 'Shivam Gupta',
      days_ago: 9,
      body: `
        <p>For bulk buyers comparing roofing or cladding materials, the GI vs Galvalume question comes up constantly. Both resist corrosion better than bare mild steel, but they perform differently depending on environment.</p>
        <h2>How GI Sheets Hold Up</h2>
        <p>Galvanized Iron sheets get a zinc coating through hot-dip galvanization. Zinc protects the steel sacrificially &mdash; it corrodes first, shielding the base metal underneath. GI performs reliably in standard inland conditions with moderate humidity.</p>
        <h2>How Galvalume Sheets Hold Up</h2>
        <p>Galvalume combines aluminium, zinc, and silicon in its coating. The aluminium content gives superior resistance to coastal salt spray and industrial pollutants, while the zinc still provides sacrificial protection at cut edges.</p>
        <h2>Our Recommendation</h2>
        <p>For godowns and sheds in coastal Gujarat, Odisha, or near chemical industries, Galvalume is worth the marginal price premium. For general industrial and residential roofing across UP and inland India, GI remains a cost-effective, dependable choice.</p>
        <p>Talk to our team with your project location and we'll recommend the right base metal and coating combination for your order.</p>
      `,
    },
    {
      slug: 'ms-pipes-vs-ms-plates-structural-steel-guide',
      title: 'MS Pipes vs MS Plates: Choosing the Right Structural Steel for Your Project',
      category: 'Structural Steel',
      excerpt: 'Pipes, plates, channels, and angles each serve a different structural purpose. Here’s how to match the right MS product to your fabrication or construction need.',
      featured_image: '/images/products/ms-pipe.png',
      author_name: 'Mohit Sharma',
      days_ago: 16,
      body: `
        <p>Contractors and fabricators often ask whether MS pipes or MS plates are the right base material for a given job. The honest answer: it depends on the load path and the joinery involved.</p>
        <h2>When to Use MS Pipes</h2>
        <p>Pipes excel where you need a hollow structural section &mdash; columns, scaffolding, railings, and furniture frames. Their circular or square cross-section distributes load evenly and resists bending well for their weight.</p>
        <h2>When to Use MS Plates, Channels &amp; Angles</h2>
        <p>Flat plates and open sections like channels and angles are better suited to bolted or welded connections, base plates, brackets, and truss components where you need flat mating surfaces.</p>
        <h2>Mixing Both in One Structure</h2>
        <p>Most industrial sheds and PEB structures use a combination &mdash; MS pipes or sections for columns, channels and angles for bracing and connections, and plates for base plates and gusset connections.</p>
        <p>Share your structural drawing or BOQ with our team and we'll quote the full material list at factory-direct wholesale rates.</p>
      `,
    },
    {
      slug: 'why-isi-certification-matters-bulk-roofing-orders',
      title: 'Why ISI Certification Matters When Buying Roofing Sheets in Bulk',
      category: 'Industry Insights',
      excerpt: 'Skipping ISI verification on a bulk order can mean inconsistent thickness, weak coating, and early failure. Here’s why certification should be non-negotiable.',
      featured_image: '/images/product-page/quality.jpg',
      author_name: 'Shivam Gupta',
      days_ago: 23,
      body: `
        <p>When you're placing a bulk order for roofing sheets or structural steel, it's tempting to chase the lowest quoted price. But uncertified material can cost far more in the long run.</p>
        <h2>What ISI Certification Actually Verifies</h2>
        <p>ISI marking confirms the product has been tested against Bureau of Indian Standards (BIS) specifications for thickness tolerance, coating weight, tensile strength, and dimensional accuracy &mdash; not just at one sample, but as part of an ongoing quality system.</p>
        <h2>What Happens Without It</h2>
        <p>Uncertified suppliers can under-gauge sheets, skip coating thickness, or vary quality batch to batch. The defects often aren't visible until months later &mdash; rust spots, premature fading, or sheets that buckle under wind load.</p>
        <h2>How to Verify Before You Order</h2>
        <p>Ask your supplier for their BIS license number and request a recent test certificate for the batch you're buying. A manufacturer confident in their quality will share this without hesitation.</p>
        <p>Every batch leaving our Kanpur facility is ISI-tested and verified before dispatch &mdash; ask for your test certificate with your next order.</p>
      `,
    },
    {
      slug: 'signs-industrial-shed-roof-needs-replacement',
      title: '5 Signs Your Industrial Shed Roof Needs Replacement',
      category: 'Roofing Guides',
      excerpt: 'A failing shed roof rarely announces itself with one big problem &mdash; it shows up in small warning signs first. Here’s what to watch for before a leak shuts down production.',
      featured_image: '/images/product-page/roof-install.jpg',
      author_name: 'Mohit Sharma',
      days_ago: 30,
      body: `
        <p>For factory and warehouse owners, a roof failure means more than water damage &mdash; it means halted production, damaged inventory, and unplanned downtime. Catching these five warning signs early can save you from an emergency replacement.</p>
        <h2>1. Visible Rust at Seams and Fasteners</h2>
        <p>Surface rust around screws or overlap joints usually means the coating has worn through. Left unchecked, this spreads and weakens the sheet's structural integrity.</p>
        <h2>2. Chalking or Fading Coating</h2>
        <p>A powdery residue on the surface (chalking) signals UV degradation of the paint layer &mdash; the sheet is still structurally sound but losing its protective top coat.</p>
        <h2>3. Sagging Between Purlins</h2>
        <p>Visible dips between support points often indicate the sheet gauge was too thin for the span, or purlins have shifted over time.</p>
        <h2>4. Leaks After Heavy Monsoon</h2>
        <p>Persistent leaks despite sealant repairs usually mean the sheet overlap or fasteners have failed structurally, not just cosmetically.</p>
        <h2>5. Sheets Older Than 15&ndash;20 Years</h2>
        <p>Even well-maintained GI sheets have a practical service life. If your roof is approaching two decades, a planned replacement is more cost-effective than reactive repairs.</p>
        <p>We can survey your span and load requirements and recommend the right replacement specification &mdash; reach out for a site-specific quote.</p>
      `,
    },
    {
      slug: 'rsg-expands-production-capacity-kanpur',
      title: 'RSG Profile Manufacturing Expands Production Capacity in Kanpur',
      category: 'Company News',
      excerpt: 'To meet growing demand from contractors and traders across Uttar Pradesh, RSG has added new roll-forming lines at its Dada Nagar facility.',
      featured_image: '/images/product-page/factory.jpg',
      author_name: 'RSG Profile Manufacturing',
      days_ago: 45,
      body: `
        <p>RSG Profile Manufacturing Pvt. Ltd. has expanded production capacity at its Dada Nagar Industrial Estate facility in Kanpur, adding new roll-forming lines to meet rising demand for roofing sheets and structural steel products across Uttar Pradesh.</p>
        <h2>Faster Turnaround on Bulk Orders</h2>
        <p>The added capacity reduces lead times on large project orders, allowing us to serve contractors and traders with tighter project timelines without compromising on ISI quality checks.</p>
        <h2>Continued Investment in Quality Control</h2>
        <p>Alongside the capacity expansion, we've strengthened in-line quality inspection at every production stage &mdash; from raw coil sourcing to final dispatch &mdash; ensuring every batch meets the same consistent standard our customers rely on.</p>
        <p>Whether you're sourcing for a single project or setting up a recurring wholesale supply arrangement, our team is ready to support your volume &mdash; get in touch for current lead times and pricing.</p>
      `,
    },
  ];

  for (const post of blogPosts) {
    await pool.query(
      `INSERT IGNORE INTO blog_posts
        (slug, title, category, excerpt, featured_image, author_name, body, published, published_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, TRUE, DATE_SUB(NOW(), INTERVAL ? DAY), DATE_SUB(NOW(), INTERVAL ? DAY))`,
      [post.slug, post.title, post.category, post.excerpt, post.featured_image, post.author_name, post.body, post.days_ago, post.days_ago]
    );
  }

  const events = [
    {
      slug: 'india-roofing-infra-expo-2026',
      title: 'RSG Profile at India Roofing & Infra Expo 2026',
      event_type: 'Trade Show',
      location: 'Pragati Maidan, New Delhi',
      excerpt: 'Visit RSG Profile at Booth #B-42 to see our latest colour coated roofing sheets, MS structural range, and turbo ventilators up close.',
      cover_image: '/images/product-page/factory.jpg',
      start_offset_days: 84,
      end_offset_days: 86,
      body: `
        <p><strong>📍 Pragati Maidan, New Delhi &nbsp;|&nbsp; 📅 Sept 12&ndash;14, 2026 &nbsp;|&nbsp; Booth #B-42</strong></p>
        <p>RSG Profile Manufacturing will be showcasing our full product range at this year's India Roofing &amp; Infra Expo &mdash; including our latest Galvalume colour coated sheets, MS structural products, and the Turbo Air Ventilator range.</p>
        <h2>What to Expect at Our Booth</h2>
        <ul>
          <li>Live samples of all 9 product categories</li>
          <li>Special bulk-order pricing for on-site inquiries</li>
          <li>Meet our technical team for project-specific recommendations</li>
        </ul>
        <h2>Plan Your Visit</h2>
        <p>Drop by Booth #B-42, or get in touch to schedule a meeting with our team in advance.</p>
      `,
    },
    {
      slug: 'up-industrial-builders-meet-2026',
      title: 'RSG Profile Sponsors UP Industrial Builders Meet 2026',
      event_type: 'Trade Show',
      location: 'Kanpur Trade Centre, Kanpur',
      excerpt: 'A regional gathering of contractors, builders, and structural fabricators from across Uttar Pradesh — RSG will present its wholesale supply programs for bulk buyers.',
      cover_image: '/images/product-page/warehouse.jpg',
      start_offset_days: 27,
      end_offset_days: 27,
      body: `
        <p><strong>📍 Kanpur Trade Centre, Kanpur &nbsp;|&nbsp; 📅 July 2026</strong></p>
        <p>RSG Profile Manufacturing is proud to sponsor this year's UP Industrial Builders Meet, bringing together contractors, builders, and structural fabricators from across the region.</p>
        <h2>On the Agenda</h2>
        <ul>
          <li>Live product demonstrations of our roofing and structural steel range</li>
          <li>One-on-one consultations on bulk and project-based pricing</li>
          <li>Networking with regional contractors and trade partners</li>
        </ul>
        <p>Reach out to our team to arrange a meeting on the day, or to reserve samples in advance.</p>
      `,
    },
    {
      slug: 'festive-season-bulk-order-discount-2026',
      title: 'Festive Season Offer — Bulk Order Discounts on Roofing Sheets',
      event_type: 'Promotion',
      location: undefined,
      excerpt: 'Get special pricing on Colour Coated Roofing Sheets and Crimping Sheets for orders placed during the festive season — limited to stock availability.',
      cover_image: '/images/products/colour-coated-roofing-sheet-new.png',
      start_offset_days: 40,
      end_offset_days: 70,
      body: `
        <p>To celebrate the festive season, RSG Profile Manufacturing is offering special wholesale pricing on Colour Coated Roofing Sheets and Crimping Sheets for bulk orders placed during this period.</p>
        <h2>Offer Details</h2>
        <ul>
          <li>Discounted factory-direct rates on qualifying bulk orders</li>
          <li>Priority production slotting for confirmed orders</li>
          <li>Valid while stock lasts &mdash; subject to availability at order confirmation</li>
        </ul>
        <p>Contact our sales team with your required quantity and specification to lock in festive pricing before stock runs out.</p>
      `,
    },
    {
      slug: 'rsg-crosses-80-satisfied-clients',
      title: 'RSG Profile Crosses 80+ Satisfied Clients Milestone',
      event_type: 'Company News',
      location: undefined,
      excerpt: 'A look back at how RSG has grown since 2019, now serving 80+ clients across India with consistent quality and on-time delivery.',
      cover_image: '/images/product-page/quality.jpg',
      start_offset_days: -50,
      end_offset_days: -50,
      body: `
        <p>RSG Profile Manufacturing Pvt. Ltd. has crossed a major milestone &mdash; 80+ satisfied clients across India, spanning contractors, builders, traders, and industrial buyers.</p>
        <h2>Built on Consistency</h2>
        <p>Since our founding in 2019, we've focused on one thing above all: consistent, ISI-certified quality batch after batch &mdash; backed by reliable, on-time delivery that contractors can plan around.</p>
        <p>Thank you to every client who has trusted RSG with their roofing and structural steel requirements &mdash; we look forward to continuing to grow alongside you.</p>
      `,
    },
    {
      slug: 'new-roll-forming-line-launch',
      title: 'RSG Launches New Roll-Forming Line for Decking Sheets',
      event_type: 'Company News',
      location: undefined,
      excerpt: 'A dedicated roll-forming line for composite decking sheets goes live at our Kanpur facility, increasing capacity for multi-storey construction projects.',
      cover_image: '/images/products/decking-sheet.png',
      start_offset_days: -18,
      end_offset_days: -18,
      body: `
        <p>RSG Profile Manufacturing has commissioned a dedicated roll-forming line for composite decking sheets at our Dada Nagar facility in Kanpur, expanding our capacity to serve multi-storey construction and mezzanine flooring projects.</p>
        <h2>What This Means for Bulk Buyers</h2>
        <p>The new line allows faster turnaround on large decking sheet orders without affecting lead times on our other product lines &mdash; ideal for contractors managing tight project schedules.</p>
        <p>Get in touch with your project requirement and our team will confirm current availability and lead times.</p>
      `,
    },
  ];

  for (const event of events) {
    await pool.query(
      `INSERT IGNORE INTO events
        (slug, title, event_type, location, excerpt, cover_image, body, event_date, end_date, published, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, DATE_ADD(CURDATE(), INTERVAL ? DAY), DATE_ADD(CURDATE(), INTERVAL ? DAY), TRUE, NOW())`,
      [event.slug, event.title, event.event_type, event.location ?? null, event.excerpt, event.cover_image, event.body, event.start_offset_days, event.end_offset_days]
    );
  }

  console.log('Seed complete');
  await pool.end();
}

seed().catch(err => { console.error(err); process.exit(1); });
