-- Catalog expansion: add Galvanized Plain Sheets + Colour Coated Roofing Sheet brand variant pages
-- to match the old site's actual mega-menu structure (rsgprofilesheets.com)
-- Run: npm run migrate

INSERT INTO products (slug, name, description, specs, display_order) VALUES
('galvanized-plain-sheets', 'Galvanized Plain Sheets',
 'Cold-rolled mild steel sheets coated with zinc through galvanization to protect against corrosion and rust. These sheets are plain and flat (not corrugated), offering a smooth surface finish, uniform thickness, and good weldability and formability — suitable for automobile body parts, electrical panels and enclosures, ducting and ventilation systems, and fabrication of furniture, racks, and cabinets.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Material', 'value', 'Cold-rolled mild steel, zinc galvanized'),
   JSON_OBJECT('label', 'Form', 'value', 'Plain / flat (non-corrugated)'),
   JSON_OBJECT('label', 'Surface Finish', 'value', 'Smooth, uniform thickness'),
   JSON_OBJECT('label', 'Properties', 'value', 'Good weldability and formability, rust resistant'),
   JSON_OBJECT('label', 'Applications', 'value', 'Automobile body parts, electrical panels/enclosures, ducting, furniture & racks')
 ), 11),

('jsw-colouron', 'JSW Colouron+',
 'JSW Colouron+ is a strong and durable roofing solution designed to withstand all kinds of weather conditions — heavy rains, salty coastal air, high humidity, cold snow, or extreme heat. High-quality steel is coated with special anti-corrosion layers, comes in a wide range of colours, and carries a 15-year warranty. It is India''s first ISI certified colour coated sheet, offering Galvalume-based superior corrosion resistance and heat-reflective performance for cooler interiors.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.70mm (0.50mm standard)'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Al-Zn Alloy Steel (Galvalume)'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70 / AZ150'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Warranty', 'value', '15 years')
 ), 12),

('jsw-silveron', 'JSW Silveron+',
 'JSW Silveron+ is a premium category roofing sheet coated with Aluminium-Zinc-Silicon alloy substrate, applied via the hot-dipping process for superior corrosion resistance compared to traditional zinc-coated steel. Its lightweight construction, excellent heat reflectivity, and rupture protection make it an effective roofing and wall profile solution for residential, commercial, and industrial projects, backed by JSW''s commitment to durable, sustainable performance.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.70mm (0.50mm standard)'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Al-Zn-Si Alloy Steel'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70 / AZ150'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Applications', 'value', 'Roofing & wall profiles — residential, commercial, industrial')
 ), 13),

('jsw-pragati', 'JSW Pragati+',
 'JSW Pragati+ is a high-quality, Aluminium-Zinc alloy coated, pre-painted roofing sheet with anti-corrosion technology, available in a vibrant range of colours and designs. JSW''s colour coating technology ensures constant coating thickness and enhanced sheet life, combining the strength of steel, enhanced corrosion resistance, the aesthetic appeal of paint, and all-weather protection with a high load-bearing capacity backed by a 7-year warranty.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.70mm (0.50mm standard)'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Al-Zn Alloy Steel'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Warranty', 'value', '7 years')
 ), 14),

('jsw-endura', 'JSW Endura+',
 'JSW Endura+ is the next evolution in colour coated roofing sheets and coils — blending high-tensile steel with vibrant, UV-resistant colours and BIS-certified quality. Its advanced Al-Zn alloy coating shields against rust and corrosion in coastal or polluted environments, while a precision profile delivers structural strength for rain, wind, and seismic conditions. Lightweight and easy to install, JSW Endura+ suits residential, industrial, institutional, and agricultural buildings, offering durability and value backed by JSW Steel''s 37.5 MTPA manufacturing scale.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Substrate', 'value', 'High-tensile Al-Zn Alloy Steel'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70, BIS Approved (IS 15965)'),
   JSON_OBJECT('label', 'Certification', 'value', 'BIS certified'),
   JSON_OBJECT('label', 'Properties', 'value', 'UV-resistant colours, corrosion resistant, high structural strength'),
   JSON_OBJECT('label', 'Applications', 'value', 'Residential, industrial sheds, institutional & agricultural buildings')
 ), 15),

('tata-durashine', 'Tata Durashine',
 'DURASHINE is the flagship retail brand of Tata BlueScope Steel, offering colour coated profile sheets as roof and wall solutions for residential, commercial, and industrial applications. Launched in 2008, it has been recognised as Asia''s Most Trusted Brand for Best Colour Coated Steel Sheet by the International Brand Consulting Corporation, USA. Durashine sheets feature a high-quality zinc-aluminium coating for superior corrosion resistance, vibrant UV-resistant colours with a high-gloss finish, lightweight design for easy installation, and great thermal efficiency for cooler interiors.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.70mm (0.50mm standard)'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Al-Zn Alloy Steel'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70 / AZ150'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Brand', 'value', 'Tata BlueScope Steel')
 ), 16),

('jindal-sabrang', 'JINDAL Sabrang',
 'Jindal Sabrang, from Jindal India, brings vibrancy to the traditionally colourless world of structural steel. Derived from the Sanskrit word for "rainbow of colours," Sabrang enhances visual appeal while extending structure lifespan through an additional layer of Zinc/Alu-Zinc coating for corrosion resistance. Jindal''s production line applies a range of coatings — Regular Modified Polyester (RMP), Super Durable Polyester (SDP), Silicone Modified Polyester (SMP), and PVDF — tailored to specific customer requirements with precise quality control.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.70mm (0.50mm standard)'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Al-Zn Alloy Steel'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70 / AZ150 (RMP, SDP, SMP, PVDF options)'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Brand', 'value', 'Jindal India')
 ), 17),

('dura-glow', 'Dura Glow',
 'DuraGlow Roofing Sheets are a premium roofing product by RSG Profile Manufacturing Pvt. Ltd., built with high-strength steel and advanced colour-coating technology for excellent durability, corrosion resistance, and long-lasting shine. Engineered with a precision-formed profile for enhanced load-bearing and wind uplift resistance, a multi-layer protective coating defends against oxidation, chemicals, and UV degradation. Ideal for houses, sheds, warehouses, factories, farm buildings, malls, showrooms, and large-span industrial structures.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.03mm – 0.80mm'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Zinc Coated Steel (80 GSM)'),
   JSON_OBJECT('label', 'Coating', 'value', 'AZ-70 / AZ150'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Brand', 'value', 'RSG Profile Manufacturing Pvt. Ltd.')
 ), 18),

('am-ns', 'AM/NS',
 'AM/NS India, a joint venture between ArcelorMittal and Nippon Steel — two of the world''s leading steel companies — is an integrated flat carbon steel manufacturer from iron ore to ready-to-market products, with manufacturing facilities spanning ironmaking, steelmaking, and downstream operations across India. AM/NS roofing sheets offer exceptional durability, corrosion resistance, lightweight construction, and reflective surfaces for thermal efficiency, with customizable thickness, lengths, and profiles for diverse roofing needs.',
 JSON_ARRAY(
   JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.70mm (0.50mm standard)'),
   JSON_OBJECT('label', 'Width', 'value', '1220mm / 1440mm'),
   JSON_OBJECT('label', 'Substrate', 'value', 'Zn Alloy Steel'),
   JSON_OBJECT('label', 'Coating', 'value', '80 GSM'),
   JSON_OBJECT('label', 'Yield Strength', 'value', '550 MPa'),
   JSON_OBJECT('label', 'Brand', 'value', 'ArcelorMittal Nippon Steel India')
 ), 19)

ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description),
  specs = VALUES(specs),
  display_order = VALUES(display_order);
