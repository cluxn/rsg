-- Product descriptions and specs seed
-- Run: npm run migrate

UPDATE products SET
  description = 'High-quality colour coated roofing sheets manufactured using Galvalume, PPGI, PPGL, and Aluminium-Zinc coated base material. Ideal for industrial, commercial, and residential roofing and wall cladding applications. Available in custom lengths and a wide range of colours to suit any project, combining long-term weather resistance with a clean, modern finish.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Base Material', 'value', 'GI, Galvalume, PPGI, PPGL, Aluminium-Zinc'),
    JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.80mm'),
    JSON_OBJECT('label', 'Width', 'value', '900mm – 1250mm'),
    JSON_OBJECT('label', 'Length', 'value', 'Custom cut to length'),
    JSON_OBJECT('label', 'Finish', 'value', 'Polyester / PVDF coating'),
    JSON_OBJECT('label', 'Colour Options', 'value', 'Wide range, RAL shades available')
  )
WHERE slug = 'colour-coated-roofing-sheet';

UPDATE products SET
  description = 'Structural mild steel plates, channels, and angles supplied to precise specifications for fabrication, framing, and general engineering work. Manufactured from quality MS billets and rolled to consistent tolerances, our plates, channels, and angles form the structural backbone for industrial sheds, warehouses, and pre-engineered buildings.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'MS Plate Thickness', 'value', '4mm – 50mm'),
    JSON_OBJECT('label', 'MS Channel Sizes', 'value', '75x40mm – 400x100mm (ISMC)'),
    JSON_OBJECT('label', 'MS Angle Sizes', 'value', '25x25x3mm – 150x150x15mm'),
    JSON_OBJECT('label', 'Standard Length', 'value', '6m / 12m'),
    JSON_OBJECT('label', 'Grade', 'value', 'IS 2062 E250 / equivalent'),
    JSON_OBJECT('label', 'Surface Finish', 'value', 'Mill finish / primer coated on request')
  )
WHERE slug = 'ms-plate-channel-angle';

UPDATE products SET
  description = 'MS pipes available in seamless and semi-seamless (ERW) construction, manufactured to consistent wall thickness and roundness for structural, fencing, scaffolding, and general fabrication applications. Seamless pipes offer superior strength and pressure handling, while semi-seamless pipes provide a cost-effective option for lighter structural and architectural uses.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Type', 'value', 'Seamless / Semi-Seamless (ERW)'),
    JSON_OBJECT('label', 'Outer Diameter', 'value', '15mm – 150mm (1/2" – 6")'),
    JSON_OBJECT('label', 'Wall Thickness', 'value', '1.2mm – 6mm'),
    JSON_OBJECT('label', 'Standard Length', 'value', '3m / 6m'),
    JSON_OBJECT('label', 'Finish', 'value', 'Black / Galvanized'),
    JSON_OBJECT('label', 'Applications', 'value', 'Structural framing, fencing, scaffolding, fabrication')
  )
WHERE slug = 'ms-pipe';

UPDATE products SET
  description = 'High-strength steel decking sheets designed for use as permanent shuttering in composite concrete floor slabs. The profiled trapezoidal shape provides excellent load-bearing capacity while reducing concrete and reinforcement requirements, speeding up construction on multi-storey buildings, mezzanine floors, and industrial structures.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Material', 'value', 'Galvalume / GI coated steel'),
    JSON_OBJECT('label', 'Thickness', 'value', '0.80mm – 1.20mm'),
    JSON_OBJECT('label', 'Profile Height', 'value', '50mm – 75mm'),
    JSON_OBJECT('label', 'Cover Width', 'value', '600mm – 1000mm'),
    JSON_OBJECT('label', 'Key Use', 'value', 'Composite floor slabs, mezzanine flooring'),
    JSON_OBJECT('label', 'Benefits', 'value', 'Faster construction, reduced concrete & reinforcement')
  )
WHERE slug = 'decking-sheet';

UPDATE products SET
  description = 'Cold-formed C and Z purlins manufactured to precise dimensional tolerances for use as secondary structural members in roofing and wall cladding systems. Engineered for optimal strength-to-weight ratio, our purlins support roof sheeting across long spans while keeping overall structure weight and cost down — ideal for industrial sheds, warehouses, and pre-engineered steel buildings.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Profile Types', 'value', 'C-Purlin, Z-Purlin'),
    JSON_OBJECT('label', 'Depth Range', 'value', '100mm – 300mm'),
    JSON_OBJECT('label', 'Thickness', 'value', '1.5mm – 3.0mm'),
    JSON_OBJECT('label', 'Standard Length', 'value', 'Up to 12m'),
    JSON_OBJECT('label', 'Material', 'value', 'GI / pre-galvanized steel coil'),
    JSON_OBJECT('label', 'Typical Spans', 'value', '4m – 8m, depending on profile and loading')
  )
WHERE slug = 'purlins';

UPDATE products SET
  description = 'Premium polycarbonate sheets available in solid, multiwall, and corrugated profiles — offering high impact resistance, UV protection, and excellent light transmission. Lightweight yet virtually unbreakable, polycarbonate sheets are ideal for skylights, canopies, partitions, and roofing applications where natural light and durability are both required.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Types Available', 'value', 'Solid, Multiwall, Corrugated'),
    JSON_OBJECT('label', 'Thickness', 'value', '0.8mm – 16mm (type dependent)'),
    JSON_OBJECT('label', 'UV Protection', 'value', 'Co-extruded UV-resistant layer'),
    JSON_OBJECT('label', 'Light Transmission', 'value', 'Up to 90% (clear)'),
    JSON_OBJECT('label', 'Impact Resistance', 'value', 'Up to 200x stronger than glass'),
    JSON_OBJECT('label', 'Applications', 'value', 'Skylights, canopies, roofing, partitions')
  )
WHERE slug = 'polycarbonate-sheet';

UPDATE products SET
  description = 'Crimping sheets are corrugated metal sheets with a small-wave profile, widely used for industrial roofing and wall cladding where a classic ribbed finish is required. Manufactured from GI and colour-coated coils, crimping sheets offer reliable weather protection at an economical price point for sheds, boundary walls, and outbuildings.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Material', 'value', 'GI / Colour Coated steel'),
    JSON_OBJECT('label', 'Thickness', 'value', '0.30mm – 0.50mm'),
    JSON_OBJECT('label', 'Profile', 'value', 'Corrugated (small-wave crimp)'),
    JSON_OBJECT('label', 'Width', 'value', '900mm – 1000mm'),
    JSON_OBJECT('label', 'Applications', 'value', 'Industrial roofing, wall cladding, boundary sheeting')
  )
WHERE slug = 'crimping-sheet';

UPDATE products SET
  description = 'Self drilling screws designed for fast, secure fastening of metal roofing and cladding sheets to steel or timber purlins — eliminating the need for pre-drilling. Each screw features a hardened drill-point tip, corrosion-resistant coating, and an integrated EPDM sealing washer for a weatherproof finish.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Types', 'value', 'Metal-to-metal, Metal-to-wood, Hex head, Flange head'),
    JSON_OBJECT('label', 'Sizes', 'value', '5.5mm x 25mm – 6.3mm x 100mm'),
    JSON_OBJECT('label', 'Coating', 'value', 'Zinc plated / Ruspert coated for corrosion resistance'),
    JSON_OBJECT('label', 'Washer', 'value', 'Bonded EPDM sealing washer'),
    JSON_OBJECT('label', 'Applications', 'value', 'Roofing sheet fixing to steel/timber purlins')
  )
WHERE slug = 'self-drilling-screws';

UPDATE products SET
  description = 'Turbo air ventilators provide natural, power-free ventilation for industrial sheds, warehouses, and factory roofs. Driven by wind and convection, the rotating turbine continuously extracts hot air, smoke, dust, and humidity — improving working conditions and reducing the load on mechanical cooling systems.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Sizes Available', 'value', '450mm, 600mm, 750mm diameter'),
    JSON_OBJECT('label', 'Material', 'value', 'Aluminium / GI blades with bearing assembly'),
    JSON_OBJECT('label', 'Operation', 'value', 'Wind-driven, power-free'),
    JSON_OBJECT('label', 'Airflow Capacity', 'value', 'Up to 3000 m³/hr (size dependent)'),
    JSON_OBJECT('label', 'Applications', 'value', 'Industrial sheds, warehouses, factory roof ventilation')
  )
WHERE slug = 'turbo-air-ventilator';

UPDATE products SET
  description = 'A range of finishing accessories for roofing and cladding projects, including corner accessories, AZ-70 coated plain ridge covers, metal roof flashings, and D-style gutter boxes. These components complete the weatherproofing of a roof system — sealing joints, directing water flow, and providing clean, durable edge and corner finishes.',
  specs = JSON_ARRAY(
    JSON_OBJECT('label', 'Corner Accessories', 'value', 'Custom-formed corner flashings and trims'),
    JSON_OBJECT('label', 'Ridge Cover', 'value', 'AZ-70 Aluminium-Zinc coated plain ridge cover'),
    JSON_OBJECT('label', 'Roof Flashing', 'value', 'Metal flashing for wall-roof junctions and penetrations'),
    JSON_OBJECT('label', 'Gutter Box', 'value', 'D-style gutter box for rainwater drainage'),
    JSON_OBJECT('label', 'Material', 'value', 'GI / Colour Coated / Aluminium-Zinc coated steel')
  )
WHERE slug = 'accessories';
