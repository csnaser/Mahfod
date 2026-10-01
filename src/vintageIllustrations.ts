// =========================================================================
// INLINE VECTOR CATALOG ASSETS (مصفوفة الرسوم التوضيحية المتجهية للكتالوج الفني)
// نمط براءات الاختراع والكتالوجات التقنية القديمة (Vintage Technical Engraving)
// =========================================================================

export type VintageVectorType =
  | 'airpods'
  | 'car_keys'
  | 'keys'
  | 'wallet'
  | 'student_id'
  | 'backpack'
  | 'laptop'
  | 'notebook'
  | 'calculator'
  | 'watch'
  | 'tote_bag'
  | 'tote';

// Helper to generate the common catalog header and bevel-inset frame
function getCatalogFrame(figNumber: number, titleAr: string, titleEn: string, hatchId: string): { top: string; bottom: string } {
  const top = `
    <defs>
      <!-- Diagonal Hatching (45 deg) -->
      <pattern id="${hatchId}" width="5" height="5" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="5" stroke="#3A271D" stroke-width="0.8" opacity="0.45" />
      </pattern>
      <!-- Crosshatch for deep shadows -->
      <pattern id="${hatchId}-cross" width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="4" stroke="#2C1D11" stroke-width="0.8" opacity="0.6" />
        <line x1="0" y1="0" x2="4" y2="0" stroke="#2C1D11" stroke-width="0.8" opacity="0.6" />
      </pattern>
    </defs>

    <!-- Warm Beige Paper Base (#EFE7D8) with Bevel-Inset Framing -->
    <rect width="100%" height="100%" fill="#EFE7D8" />
    <rect x="6" y="6" width="388" height="288" rx="8" fill="none" stroke="#2C1D11" stroke-width="1.8" />
    <rect x="10" y="10" width="380" height="280" rx="6" fill="none" stroke="#8C7768" stroke-width="0.8" stroke-dasharray="4,2" />
    
    <!-- Drafting Corner Ticks -->
    <path d="M 2 6 L 14 6 M 6 2 L 6 14 M 386 2 L 386 14 M 398 6 L 386 6 M 6 286 L 6 298 M 2 288 L 14 288 M 386 286 L 386 298 M 398 288 L 386 288" stroke="#2C1D11" stroke-width="1" />

    <!-- Top Technical Banner -->
    <text x="18" y="24" font-family="'Amiri', 'Traditional Arabic', serif" font-size="9" fill="#5A3E2B" font-weight="bold">جامعة شقراء — أمانات الحرم الجامعي | الكتالوج الفني الموحد</text>
    <text x="382" y="24" text-anchor="end" font-family="monospace" font-size="8.5" font-weight="bold" fill="#3A271D">SHQ-PAT. 1447</text>
    <line x1="18" y1="28" x2="382" y2="28" stroke="#CFC2B2" stroke-width="0.8" />
  `;

  const bottom = `
    <!-- Bottom Technical Label -->
    <rect x="40" y="254" width="320" height="22" rx="3" fill="#E8DEC9" stroke="#2C1D11" stroke-width="1.2" />
    <text x="200" y="269" text-anchor="middle" font-family="'Amiri', serif" font-size="10.5" font-weight="bold" fill="#2C1D11">FIG. ${figNumber} — ${titleAr} (${titleEn})</text>
  `;

  return { top, bottom };
}

// 1. AirPods Pro (علبة شحن وسماعة بمظهر كتالوج هندسي)
const SVG_AIRPODS = (() => {
  const f = getCatalogFrame(1, 'سَمَّاعَات أَبْل اللَّاسِلْكِيَّة مَعَ عُلْبَةِ الشَّحْن', 'AirPods Pro', 'h-airpods');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <!-- Case Base Shadow -->
    <ellipse cx="140" cy="205" rx="55" ry="10" fill="url(#h-airpods-cross)" opacity="0.3" />

    <!-- Case Outer Body -->
    <path d="M 85 140 C 85 110, 195 110, 195 140 L 195 180 C 195 205, 85 205, 85 180 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
    <path d="M 85 160 C 85 195, 120 205, 140 205 C 160 205, 195 195, 195 160 L 195 180 C 195 205, 85 205, 85 180 Z" fill="url(#h-airpods)" />

    <!-- Open Interior Dock -->
    <ellipse cx="140" cy="140" rx="52" ry="16" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.5" />
    <ellipse cx="118" cy="140" rx="14" ry="10" fill="#3A271D" opacity="0.85" />
    <ellipse cx="162" cy="140" rx="14" ry="10" fill="#3A271D" opacity="0.85" />
    <circle cx="118" cy="140" r="3" fill="#CFC2B2" />
    <circle cx="162" cy="140" r="3" fill="#CFC2B2" />

    <!-- Open Lid -->
    <path d="M 86 138 C 82 85, 198 85, 194 138 C 175 125, 105 125, 86 138 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
    <circle cx="140" cy="165" r="2" fill="#5A3E2B" stroke="#2C1D11" stroke-width="0.5" />
    <line x1="86" y1="140" x2="194" y2="140" stroke="#5A3E2B" stroke-width="1" />

    <!-- Floating Earbud (Right Perspective) -->
    <g transform="translate(230, 75)">
      <ellipse cx="30" cy="130" rx="20" ry="6" fill="url(#h-airpods-cross)" opacity="0.25" />
      <ellipse cx="16" cy="36" rx="15" ry="10" transform="rotate(-25 16 36)" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.5" />
      <path d="M 22 25 C 38 18, 52 35, 42 50 C 35 60, 24 55, 22 45 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
      <ellipse cx="38" cy="36" rx="4" ry="7" fill="#3A271D" stroke="#2C1D11" stroke-width="1" />
      <path d="M 30 52 L 38 108 C 38 114, 28 114, 28 108 L 22 56 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.6" />
      <path d="M 28 54 L 32 108 L 38 108 L 30 52 Z" fill="url(#h-airpods)" />
      <rect x="25" y="70" width="3" height="14" rx="1.5" fill="#D5C8B7" stroke="#3A271D" stroke-width="0.8" />
      <path d="M 28 106 L 38 106 L 38 109 C 38 113, 28 113, 28 109 Z" fill="#CFC2B2" stroke="#2C1D11" stroke-width="1.2" />
    </g>

    <!-- Calibration / Dimension Annotations -->
    <line x1="70" y1="110" x2="70" y2="205" stroke="#7D6859" stroke-width="0.8" stroke-dasharray="3,2" />
    <text x="62" y="160" font-family="monospace" font-size="7" fill="#7D6859" text-anchor="end">45.2 mm</text>
  </g>
  ${f.bottom}
</svg>`;
})();

// 2. Car Keys (مفاتيح سيارة مع ميدالية محفورة)
const SVG_CAR_KEYS = (() => {
  const f = getCatalogFrame(2, 'مَفَاتِيح مَرْكَبَة مَعَ مِيدَالِيَّة جَامِعَة شَقْرَاء', 'Vehicular Keys & Medallion', 'h-keys');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <ellipse cx="140" cy="190" rx="90" ry="16" fill="url(#h-keys-cross)" opacity="0.25" />

    <!-- Key Fob -->
    <g transform="translate(60, 55)">
      <path d="M 20 20 C 50 10, 80 10, 100 30 C 115 50, 115 100, 95 130 C 75 150, 35 150, 18 125 C 0 95, 0 40, 20 20 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />
      <path d="M 18 125 C 0 95, 0 40, 20 20 L 35 35 C 20 50, 20 90, 35 110 Z" fill="url(#h-keys)" />
      <!-- Remote Buttons -->
      <rect x="42" y="38" width="30" height="22" rx="4" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />
      <path d="M 53 47 C 53 43, 61 43, 61 47 L 61 50 L 53 50 Z" fill="none" stroke="#2C1D11" stroke-width="1.2" />
      <rect x="51" y="50" width="12" height="7" rx="1" fill="#3A271D" />
      <rect x="42" y="66" width="30" height="22" rx="4" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />
      <path d="M 53 74 C 53 70, 61 70, 61 74" fill="none" stroke="#2C1D11" stroke-width="1.2" />
      <circle cx="48" cy="102" r="6" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
      <circle cx="66" cy="102" r="6" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
    </g>

    <!-- Ring and Blade -->
    <g transform="translate(180, 105)">
      <circle cx="20" cy="20" r="26" fill="none" stroke="#2C1D11" stroke-width="4" />
      <circle cx="20" cy="20" r="26" fill="none" stroke="#EFE7D8" stroke-width="1" />
      <g transform="translate(-10, 35) rotate(20)">
        <path d="M 0 0 L 12 0 L 14 65 L 8 72 L 0 65 Z" fill="#D5C8B7" stroke="#2C1D11" stroke-width="1.4" />
        <path d="M 4 8 L 4 58 L 8 52 L 8 12" fill="#3A271D" />
      </g>
    </g>

    <!-- Shaqra University Engraved Medallion -->
    <g transform="translate(230, 55)">
      <rect x="18" y="0" width="24" height="32" rx="3" fill="#7D6859" stroke="#2C1D11" stroke-width="1.4" />
      <circle cx="30" cy="16" r="3.5" fill="#D5C8B7" stroke="#2C1D11" stroke-width="1" />
      <circle cx="30" cy="78" r="48" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2.2" />
      <circle cx="30" cy="78" r="44" fill="none" stroke="#8C7768" stroke-width="1" stroke-dasharray="3,1.5" />
      <circle cx="30" cy="78" r="36" fill="#DFD3BE" stroke="#5A3E2B" stroke-width="1.2" />
      <!-- University Letter (ش) with authentic diacritic dot -->
      <text x="30" y="88" text-anchor="middle" font-family="'Amiri', 'Traditional Arabic', serif" font-size="34" font-weight="bold" fill="#2C1D11">ش</text>
      <text x="30" y="54" text-anchor="middle" font-family="'Amiri', serif" font-size="7" font-weight="bold" fill="#5A3E2B">جامعة شقراء</text>
      <text x="30" y="104" text-anchor="middle" font-family="monospace" font-size="5.5" font-weight="bold" fill="#7D6859" letter-spacing="1">SHAQRA UNIV.</text>
    </g>
  </g>
  ${f.bottom}
</svg>`;
})();

// 3. Leather Wallet (محفظة جلدية بطيات وخياطة دقيقة)
const SVG_WALLET = (() => {
  const f = getCatalogFrame(3, 'مَحْفَظَة جِلْدِيَّة مَعَ تَفَاصِيل الخِيَاطَة', 'Leather Bifold Wallet', 'h-wallet');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <polygon points="50,210 320,210 340,225 30,225" fill="url(#h-wallet-cross)" opacity="0.3" />

    <!-- Open Wallet Leather Body -->
    <path d="M 40 70 L 180 55 L 180 195 L 35 205 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />
    <path d="M 180 55 L 325 70 L 330 205 L 180 195 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />

    <!-- Spine Crease -->
    <line x1="180" y1="55" x2="180" y2="195" stroke="#2C1D11" stroke-width="1.8" />
    <path d="M 175 55 L 185 55 L 185 195 L 175 195 Z" fill="url(#h-wallet-cross)" opacity="0.35" />

    <!-- Perimeter Saddle Stitching (Fine Dashed Lines) -->
    <path d="M 44 74 L 176 60 M 176 190 L 40 200 M 40 76 L 36 200" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />
    <path d="M 184 60 L 320 74 M 325 200 L 184 190 M 321 76 L 326 200" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />

    <!-- Left Slots -->
    <path d="M 50 100 L 170 88 L 170 115 L 48 125 Z" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />
    <path d="M 55 85 L 165 74 L 165 92 L 55 102 Z" fill="#D5C8B7" stroke="#3A271D" stroke-width="1" />
    <rect x="62" y="87" width="12" height="8" rx="1" fill="#3A271D" />
    <path d="M 47 130 L 170 120 L 170 148 L 44 158 Z" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />
    <path d="M 43 162 L 170 152 L 170 188 L 40 196 Z" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />

    <!-- Right Window Inset -->
    <rect x="195" y="78" width="118" height="105" rx="5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.4" />
    <rect x="205" y="86" width="98" height="88" rx="4" fill="#F8F3E8" stroke="#7D6859" stroke-width="1" />
    <circle cx="230" cy="115" r="10" fill="#5A3E2B" opacity="0.6" />
    <line x1="248" y1="110" x2="290" y2="110" stroke="#7D6859" stroke-width="1.5" />
    <line x1="248" y1="118" x2="280" y2="118" stroke="#7D6859" stroke-width="1.5" />
    <line x1="215" y1="150" x2="290" y2="150" stroke="#3A271D" stroke-width="2" stroke-dasharray="2,1" />
  </g>
  ${f.bottom}
</svg>`;
})();

// 4. Shaqra University Student ID (بطاقة جامعية رسمية بخطوط معتقة)
const SVG_STUDENT_ID = (() => {
  const f = getCatalogFrame(4, 'بِطَاقَة جَامِعِيَّة وَهُوِيَّة طَالِب', 'Shaqra University Student ID', 'h-id');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <rect x="65" y="45" width="245" height="160" rx="14" fill="url(#h-id-cross)" opacity="0.25" transform="translate(6, 6)" />

    <!-- Card Base -->
    <rect x="65" y="45" width="245" height="160" rx="12" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />
    <rect x="70" y="50" width="235" height="150" rx="9" fill="none" stroke="#7D6859" stroke-width="1" stroke-dasharray="3,1" />

    <!-- Header Banner -->
    <rect x="72" y="52" width="231" height="32" rx="6" fill="#3A271D" />
    <text x="187" y="68" text-anchor="middle" font-family="'Amiri', 'Traditional Arabic', serif" font-size="14" font-weight="bold" fill="#F8F3E8">جَامِعَة شَقْرَاء</text>
    <text x="187" y="78" text-anchor="middle" font-family="monospace" font-size="6" font-weight="bold" fill="#DFD3BE" letter-spacing="1">SHAQRA UNIVERSITY • عمادة شؤون الطلاب</text>

    <!-- Student Photo Box -->
    <rect x="228" y="92" width="65" height="78" rx="4" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.4" />
    <circle cx="260" cy="120" r="15" fill="#5A3E2B" />
    <path d="M 238 152 C 238 138, 282 138, 282 152 Z" fill="#5A3E2B" stroke="#2C1D11" stroke-width="1" />

    <!-- Data Lines -->
    <g transform="translate(85, 96)">
      <text x="0" y="10" font-family="'Amiri', serif" font-size="8" fill="#7D6859">اسم الطالب:</text>
      <text x="50" y="10" font-family="'Amiri', serif" font-size="9" font-weight="bold" fill="#2C1D11">سلطان بن فهد العتيبي</text>
      <text x="0" y="26" font-family="'Amiri', serif" font-size="8" fill="#7D6859">الرقم الجامعي:</text>
      <text x="55" y="26" font-family="monospace" font-size="9" font-weight="bold" fill="#3A271D">441008922</text>
      <text x="0" y="42" font-family="'Amiri', serif" font-size="8" fill="#7D6859">الكلية:</text>
      <text x="35" y="42" font-family="'Amiri', serif" font-size="8.5" font-weight="bold" fill="#2C1D11">الحاسب وتقنية المعلومات</text>
    </g>

    <!-- Smart Chip & Barcode -->
    <rect x="85" y="162" width="26" height="20" rx="3" fill="#D5C8B7" stroke="#2C1D11" stroke-width="1.2" />
    <g transform="translate(125, 164)">
      <line x1="0" y1="0" x2="0" y2="18" stroke="#2C1D11" stroke-width="2" />
      <line x1="4" y1="0" x2="4" y2="18" stroke="#2C1D11" stroke-width="1" />
      <line x1="7" y1="0" x2="7" y2="18" stroke="#2C1D11" stroke-width="3" />
      <line x1="12" y1="0" x2="12" y2="18" stroke="#2C1D11" stroke-width="1" />
      <line x1="16" y1="0" x2="16" y2="18" stroke="#2C1D11" stroke-width="2" />
      <line x1="22" y1="0" x2="22" y2="18" stroke="#2C1D11" stroke-width="4" />
      <line x1="28" y1="0" x2="28" y2="18" stroke="#2C1D11" stroke-width="2" />
      <line x1="33" y1="0" x2="33" y2="18" stroke="#2C1D11" stroke-width="1" />
      <line x1="38" y1="0" x2="38" y2="18" stroke="#2C1D11" stroke-width="3" />
      <line x1="45" y1="0" x2="45" y2="18" stroke="#2C1D11" stroke-width="2" />
    </g>
  </g>
  ${f.bottom}
</svg>`;
})();

// 5. Canvas Scholastic Backpack (حقيبة طلابية بخطوط سحاب وجيوب)
const SVG_BACKPACK = (() => {
  const f = getCatalogFrame(5, 'حَقِيبَة ظَهْر دِرَاسِيَّة قُمَاشِيَّة', 'Scholastic Canvas Rucksack', 'h-backpack');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <ellipse cx="180" cy="218" rx="85" ry="12" fill="url(#h-backpack-cross)" opacity="0.3" />

    <!-- Grab Handle & Straps -->
    <path d="M 155 45 C 155 25, 205 25, 205 45 L 195 45 C 195 33, 165 33, 165 45 Z" fill="#3A271D" stroke="#2C1D11" stroke-width="1.4" />
    <path d="M 130 55 C 90 80, 80 160, 95 200" fill="none" stroke="#3A271D" stroke-width="5" />
    <path d="M 230 55 C 270 80, 280 160, 265 200" fill="none" stroke="#3A271D" stroke-width="5" />

    <!-- Main Pack Dome -->
    <path d="M 115 210 C 100 205, 95 100, 130 55 C 150 40, 210 40, 230 55 C 265 100, 260 205, 245 210 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />
    <path d="M 115 210 C 100 205, 95 100, 130 55 L 145 65 C 115 105, 120 185, 135 210 Z" fill="url(#h-backpack)" />

    <!-- Main Zipper -->
    <path d="M 110 135 C 105 85, 140 60, 180 60 C 220 60, 255 85, 250 135" fill="none" stroke="#2C1D11" stroke-width="2" stroke-dasharray="2,1" />

    <!-- Front Utility Pocket -->
    <path d="M 120 135 C 120 125, 240 125, 240 135 L 245 205 C 245 215, 115 215, 115 205 Z" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.8" />
    <path d="M 118 140 L 242 140 L 242 145 L 118 145 Z" fill="#3A271D" stroke="#2C1D11" stroke-width="1" />
    <polygon points="180,90 190,102 180,114 170,102" fill="#7D6859" stroke="#2C1D11" stroke-width="1.2" />

    <!-- Mesh Side Pocket -->
    <path d="M 245 150 C 265 155, 265 195, 243 205 Z" fill="#D5C8B7" stroke="#2C1D11" stroke-width="1.4" />
    <path d="M 245 150 C 265 155, 265 195, 243 205 Z" fill="url(#h-backpack-cross)" opacity="0.6" />
  </g>
  ${f.bottom}
</svg>`;
})();

// 6. Laptop Computer (حاسب محمول مفتوح بخطوط تقنية)
const SVG_LAPTOP = (() => {
  const f = getCatalogFrame(6, 'حَاسِب مَحْمُول فَائِق النَّحَافَة', 'Portable Laptop Computer', 'h-laptop');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <polygon points="40,215 320,215 350,225 10,225" fill="url(#h-laptop-cross)" opacity="0.3" />

    <!-- Screen Lid (Angled Perspective) -->
    <polygon points="70,45 290,45 305,155 55,155" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
    <polygon points="78,52 282,52 296,148 64,148" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />
    <polygon points="90,52 140,52 100,148 50,148" fill="url(#h-laptop)" />
    <polygon points="170,52 240,52 220,148 150,148" fill="url(#h-laptop)" />
    <circle cx="180" cy="50" r="1.5" fill="#2C1D11" />

    <!-- Hinge Bar -->
    <rect x="100" y="152" width="160" height="5" rx="1.5" fill="#3A271D" stroke="#2C1D11" stroke-width="1" />

    <!-- Keyboard Deck -->
    <polygon points="55,155 305,155 340,210 20,210" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
    <polygon points="72,160 288,160 306,192 54,192" fill="#D9CCB4" stroke="#3A271D" stroke-width="1" />

    <!-- Chiclet Key Rows -->
    <g stroke="#2C1D11" stroke-width="0.8" fill="#3A271D" opacity="0.85">
      <polygon points="75,162 285,162 287,166 73,166" />
      <polygon points="72,168 288,168 291,172 69,172" />
      <polygon points="68,174 292,174 296,178 64,178" />
      <polygon points="63,180 297,180 301,184 59,184" />
      <polygon points="58,186 302,186 306,190 54,190" />
    </g>

    <!-- Trackpad -->
    <polygon points="145,195 215,195 220,208 140,208" fill="#DFD3BE" stroke="#5A3E2B" stroke-width="1" />
  </g>
  ${f.bottom}
</svg>`;
})();

// 7. Wirebound Notebook & Pen (دفتر ملاحظات سلك مع قلم حبر هندسي)
const SVG_NOTEBOOK = (() => {
  const f = getCatalogFrame(7, 'دَفْتَر مُلَاحَظَات سِلْك مَعَ قَلَم', 'Wirebound Notebook & Pen', 'h-notebook');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <!-- Base Shadow -->
    <polygon points="70,220 310,220 330,230 50,230" fill="url(#h-notebook-cross)" opacity="0.3" />

    <!-- Notebook Hardcover Body -->
    <rect x="75" y="42" width="220" height="175" rx="5" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />
    <!-- Cover Hatch Shading on Right Edge -->
    <rect x="280" y="42" width="15" height="175" fill="url(#h-notebook)" />

    <!-- Lined Paper Sheet Inset -->
    <rect x="95" y="48" width="194" height="163" rx="3" fill="#FAF6EE" stroke="#3A271D" stroke-width="1.2" />

    <!-- Ruled Academic Notebook Lines -->
    <line x1="125" y1="48" x2="125" y2="211" stroke="#D57A7A" stroke-width="1" /> <!-- Red Margin Line -->
    <line x1="128" y1="48" x2="128" y2="211" stroke="#D57A7A" stroke-width="0.5" stroke-dasharray="2,2" />
    
    <!-- Header Note Block -->
    <rect x="135" y="56" width="145" height="18" rx="2" fill="#EFE7D8" stroke="#8C7768" stroke-width="0.8" />
    <text x="140" y="68" font-family="'Amiri', serif" font-size="8" font-weight="bold" fill="#5A3E2B">جامعة شقراء — سجل الملاحظات</text>

    <!-- Horizontal Notebook Lines -->
    <g stroke="#CFC2B2" stroke-width="0.9">
      <line x1="95" y1="84" x2="289" y2="84" />
      <line x1="95" y1="98" x2="289" y2="98" />
      <line x1="95" y1="112" x2="289" y2="112" />
      <line x1="95" y1="126" x2="289" y2="126" />
      <line x1="95" y1="140" x2="289" y2="140" />
      <line x1="95" y1="154" x2="289" y2="154" />
      <line x1="95" y1="168" x2="289" y2="168" />
      <line x1="95" y1="182" x2="289" y2="182" />
      <line x1="95" y1="196" x2="289" y2="196" />
    </g>

    <!-- Spiral Wire Binding Loops (Down Left Spine) -->
    <g fill="#3A271D" stroke="#2C1D11" stroke-width="1">
      <!-- Spiral punch holes -->
      <circle cx="85" cy="54" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="72" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="90" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="108" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="126" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="144" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="162" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="180" r="3.5" fill="#2C1D11" />
      <circle cx="85" cy="198" r="3.5" fill="#2C1D11" />

      <!-- Metallic Double Wire Rings -->
      <path d="M 75 50 C 68 50, 68 58, 88 56" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 68 C 68 68, 68 76, 88 74" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 86 C 68 86, 68 94, 88 92" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 104 C 68 104, 68 112, 88 110" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 122 C 68 122, 68 130, 88 128" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 140 C 68 140, 68 148, 88 146" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 158 C 68 158, 68 166, 88 164" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 176 C 68 176, 68 184, 88 182" fill="none" stroke="#2C1D11" stroke-width="2.5" />
      <path d="M 75 194 C 68 194, 68 202, 88 200" fill="none" stroke="#2C1D11" stroke-width="2.5" />
    </g>

    <!-- Drafting Fountain Pen Resting Across Notebook (Diagonal Angle) -->
    <g transform="translate(195, 120) rotate(-35)">
      <!-- Pen Shadow -->
      <rect x="0" y="8" width="125" height="12" rx="4" fill="url(#h-notebook-cross)" opacity="0.35" />
      <!-- Pen Barrel -->
      <rect x="0" y="0" width="125" height="12" rx="3" fill="#3A271D" stroke="#2C1D11" stroke-width="1.6" />
      <line x1="0" y1="6" x2="125" y2="6" stroke="#5A3E2B" stroke-width="1" />
      <!-- Gold / Brass Accent Band -->
      <rect x="35" y="0" width="6" height="12" fill="#D5C8B7" stroke="#2C1D11" stroke-width="1" />
      <rect x="90" y="0" width="5" height="12" fill="#D5C8B7" stroke="#2C1D11" stroke-width="1" />
      <!-- Steel Pocket Clip -->
      <rect x="85" y="-3" width="30" height="3.5" rx="1.5" fill="#8C7768" stroke="#2C1D11" stroke-width="0.8" />
      <circle cx="87" cy="-1.5" r="2" fill="#2C1D11" />
      <!-- Triangular Metal Nib -->
      <polygon points="0,0 -20,6 0,12" fill="#EFE7D8" stroke="#2C1D11" stroke-width="1.4" />
      <!-- Nib Ink Breather Hole and Slit -->
      <line x1="0" y1="6" x2="-14" y2="6" stroke="#2C1D11" stroke-width="0.8" />
      <circle cx="-10" cy="6" r="1.2" fill="#2C1D11" />
    </g>
  </g>
  ${f.bottom}
</svg>`;
})();

// 8. Scientific Calculator (حاسبة علمية بأزرار وشاشة واضحة)
const SVG_CALCULATOR = (() => {
  const f = getCatalogFrame(8, 'آلَة حَاسِبَة عِلْمِيَّة مُتَطَوِّرَة', 'Scientific Calculator', 'h-calc');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <rect x="125" y="35" width="145" height="205" rx="16" fill="url(#h-calc-cross)" opacity="0.25" transform="translate(6, 6)" />

    <!-- Casing -->
    <path d="M 130 35 L 265 35 C 272 35, 275 42, 275 50 L 270 230 C 270 238, 264 242, 255 242 L 140 242 C 131 242, 125 238, 125 230 L 120 50 C 120 42, 123 35, 130 35 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2" />
    <text x="135" y="48" font-family="sans-serif" font-size="7" font-weight="bold" fill="#2C1D11">CASIO</text>
    <text x="175" y="48" font-family="monospace" font-size="6" fill="#7D6859">fx-991EX</text>

    <!-- Solar Cell -->
    <rect x="230" y="40" width="34" height="11" rx="1.5" fill="#3A271D" stroke="#2C1D11" stroke-width="0.8" />

    <!-- LCD Screen -->
    <rect x="132" y="55" width="131" height="42" rx="3" fill="#D9CCB4" stroke="#2C1D11" stroke-width="1.6" />
    <text x="138" y="68" font-family="monospace" font-size="7" fill="#3A271D">f(x)=∫[0→π] sin(x)dx</text>
    <text x="256" y="88" text-anchor="end" font-family="monospace" font-size="12" font-weight="bold" fill="#2C1D11">2</text>

    <!-- 4-Way Nav Pad -->
    <circle cx="197" cy="114" r="13" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.4" />
    <circle cx="197" cy="114" r="6" fill="#F8F3E8" stroke="#7D6859" stroke-width="0.8" />

    <!-- Function Keys -->
    <g fill="#3A271D" stroke="#2C1D11" stroke-width="0.8">
      <rect x="135" y="102" width="14" height="8" rx="2" fill="#CFC2B2" />
      <rect x="155" y="102" width="14" height="8" rx="2" fill="#CFC2B2" />
      <rect x="225" y="102" width="14" height="8" rx="2" fill="#CFC2B2" />
      <rect x="245" y="102" width="14" height="8" rx="2" fill="#CFC2B2" />
    </g>

    <!-- Numeric Keypad Matrix -->
    <g transform="translate(132, 136)">
      <!-- 7, 8, 9 -->
      <rect x="0" y="0" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="11" y="9.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">7</text>
      <rect x="27" y="0" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="38" y="9.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">8</text>
      <rect x="54" y="0" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="65" y="9.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">9</text>
      <rect x="81" y="0" width="22" height="13" rx="2.5" fill="#CFC2B2" stroke="#2C1D11" stroke-width="1" />
      <text x="92" y="9" text-anchor="middle" font-family="monospace" font-size="6" font-weight="bold" fill="#3A271D">DEL</text>
      <rect x="108" y="0" width="22" height="13" rx="2.5" fill="#7D6859" stroke="#2C1D11" stroke-width="1" />
      <text x="119" y="9" text-anchor="middle" font-family="monospace" font-size="6" font-weight="bold" fill="#F8F3E8">AC</text>

      <!-- 4, 5, 6 -->
      <rect x="0" y="18" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="11" y="27.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">4</text>
      <rect x="27" y="18" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="38" y="27.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">5</text>
      <rect x="54" y="18" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="65" y="27.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">6</text>
      <rect x="81" y="18" width="22" height="13" rx="2.5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
      <text x="92" y="27.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">×</text>
      <rect x="108" y="18" width="22" height="13" rx="2.5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
      <text x="119" y="27.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">÷</text>

      <!-- 1, 2, 3 -->
      <rect x="0" y="36" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="11" y="45.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">1</text>
      <rect x="27" y="36" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="38" y="45.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">2</text>
      <rect x="54" y="36" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="65" y="45.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">3</text>
      <rect x="81" y="36" width="22" height="13" rx="2.5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
      <text x="92" y="45.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">+</text>
      <rect x="108" y="36" width="22" height="13" rx="2.5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
      <text x="119" y="45.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">−</text>

      <!-- 0, ., EXE -->
      <rect x="0" y="54" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="11" y="63.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">0</text>
      <rect x="27" y="54" width="22" height="13" rx="2.5" fill="#FAF6EB" stroke="#2C1D11" stroke-width="1" />
      <text x="38" y="63.5" text-anchor="middle" font-family="monospace" font-size="8" font-weight="bold" fill="#2C1D11">•</text>
      <rect x="54" y="54" width="22" height="13" rx="2.5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
      <text x="65" y="63" text-anchor="middle" font-family="monospace" font-size="5" font-weight="bold" fill="#2C1D11">Ans</text>
      <rect x="81" y="54" width="49" height="13" rx="2.5" fill="#3A271D" stroke="#2C1D11" stroke-width="1" />
      <text x="105" y="63" text-anchor="middle" font-family="monospace" font-size="7" font-weight="bold" fill="#F8F3E8">EXE =</text>
    </g>
  </g>
  ${f.bottom}
</svg>`;
})();

// 9. Classic Wristwatch (ساعة يد كلاسيكية)
const SVG_WATCH = (() => {
  const f = getCatalogFrame(9, 'سَاعَةُ يَدٍ كَلَاسِيكِيَّة دَقِيقَة', 'Precision Wristwatch', 'h-watch');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <ellipse cx="180" cy="225" rx="70" ry="10" fill="url(#h-watch-cross)" opacity="0.25" />

    <!-- Top & Bottom Straps -->
    <path d="M 152 40 L 208 40 L 204 90 L 156 90 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
    <path d="M 152 40 L 208 40 L 204 90 L 156 90 Z" fill="url(#h-watch)" opacity="0.6" />
    <line x1="158" y1="42" x2="160" y2="88" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />
    <line x1="202" y1="42" x2="200" y2="88" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />

    <path d="M 156 190 L 204 190 L 208 240 L 152 240 Z" fill="#F8F3E8" stroke="#2C1D11" stroke-width="1.8" />
    <path d="M 156 190 L 204 190 L 208 240 L 152 240 Z" fill="url(#h-watch)" opacity="0.6" />
    <line x1="160" y1="192" x2="158" y2="238" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />
    <line x1="200" y1="192" x2="202" y2="238" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />

    <circle cx="180" cy="202" r="2.5" fill="#2C1D11" />
    <circle cx="180" cy="214" r="2.5" fill="#2C1D11" />
    <circle cx="180" cy="226" r="2.5" fill="#2C1D11" />

    <!-- Lugs -->
    <path d="M 148 80 L 156 96 L 156 184 L 148 200" fill="none" stroke="#2C1D11" stroke-width="3" />
    <path d="M 212 80 L 204 96 L 204 184 L 212 200" fill="none" stroke="#2C1D11" stroke-width="3" />

    <!-- Case -->
    <circle cx="180" cy="140" r="56" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2.2" />
    <circle cx="180" cy="140" r="50" fill="none" stroke="#8C7768" stroke-width="1" stroke-dasharray="2,2" />
    <circle cx="180" cy="140" r="46" fill="#FAF6EE" stroke="#2C1D11" stroke-width="1.4" />

    <!-- Crown -->
    <rect x="236" y="134" width="8" height="12" rx="2" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1.2" />
    <line x1="238" y1="137" x2="242" y2="137" stroke="#2C1D11" />
    <line x1="238" y1="143" x2="242" y2="143" stroke="#2C1D11" />

    <!-- Hour Marks -->
    <g stroke="#2C1D11" stroke-width="1.5">
      <line x1="180" y1="98" x2="180" y2="106" />
      <line x1="222" y1="140" x2="214" y2="140" />
      <line x1="180" y1="182" x2="180" y2="174" />
      <line x1="138" y1="140" x2="146" y2="140" />
    </g>

    <text x="180" y="125" text-anchor="middle" font-family="'Amiri', serif" font-size="7" font-weight="bold" fill="#5A3E2B">جامعة شقراء</text>
    <text x="180" y="160" text-anchor="middle" font-family="monospace" font-size="5" fill="#7D6859">AUTOMATIC</text>

    <!-- Hands -->
    <line x1="180" y1="140" x2="160" y2="124" stroke="#2C1D11" stroke-width="2.6" stroke-linecap="round" />
    <line x1="180" y1="140" x2="206" y2="112" stroke="#2C1D11" stroke-width="1.8" stroke-linecap="round" />
    <line x1="180" y1="146" x2="180" y2="102" stroke="#A84232" stroke-width="0.8" />
    <circle cx="180" cy="140" r="3.5" fill="#DFD3BE" stroke="#2C1D11" stroke-width="1" />
  </g>
  ${f.bottom}
</svg>`;
})();

// 10. Scholastic Canvas Tote Bag (حقيبة تسوق قماشية)
const SVG_TOTE_BAG = (() => {
  const f = getCatalogFrame(10, 'حَقِيبَةُ تَسَوُّقٍ قُمَاشِيَّة', 'Scholastic Canvas Tote Bag', 'h-tote');
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="100%" height="100%" class="w-full h-full select-none">
  ${f.top}
  <g transform="translate(20, 18)">
    <polygon points="90,230 270,230 290,238 70,238" fill="url(#h-tote-cross)" opacity="0.3" />

    <!-- Handles -->
    <path d="M 125 105 C 125 35, 160 35, 160 105" fill="none" stroke="#2C1D11" stroke-width="5" />
    <path d="M 125 105 C 125 35, 160 35, 160 105" fill="none" stroke="#FAF6EE" stroke-width="2" />
    <path d="M 200 105 C 200 35, 235 35, 235 105" fill="none" stroke="#2C1D11" stroke-width="5" />
    <path d="M 200 105 C 200 35, 235 35, 235 105" fill="none" stroke="#FAF6EE" stroke-width="2" />

    <!-- Body -->
    <polygon points="105,105 255,105 270,225 90,225" fill="#F8F3E8" stroke="#2C1D11" stroke-width="2.2" />
    <polygon points="90,225 105,105 130,105 110,225" fill="url(#h-tote)" />
    <polygon points="255,105 270,225 250,225 235,105" fill="url(#h-tote)" />

    <line x1="106" y1="112" x2="254" y2="112" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />
    <line x1="92" y1="218" x2="268" y2="218" stroke="#5A3E2B" stroke-width="1.2" stroke-dasharray="3,2" />

    <!-- Stamp -->
    <circle cx="180" cy="165" r="32" fill="#FAF6EE" stroke="#3A271D" stroke-width="1.4" />
    <circle cx="180" cy="165" r="28" fill="none" stroke="#7D6859" stroke-width="0.8" stroke-dasharray="2,2" />
    <text x="180" y="172" text-anchor="middle" font-family="'Amiri', serif" font-size="24" font-weight="bold" fill="#2C1D11">ش</text>
    <text x="180" y="148" text-anchor="middle" font-family="'Amiri', serif" font-size="6.5" font-weight="bold" fill="#5A3E2B">جامعة شقراء</text>
    <text x="180" y="184" text-anchor="middle" font-family="monospace" font-size="5" fill="#7D6859" letter-spacing="1">SHAQRA UNIV.</text>
  </g>
  ${f.bottom}
</svg>`;
})();

// Named standalone SVG exports matching user specification
export const svg_watch = SVG_WATCH;
export const svg_tote = SVG_TOTE_BAG;
export const svg_wallet = SVG_WALLET;
export const svg_keys = SVG_CAR_KEYS;
export const svg_airpods = SVG_AIRPODS;
export const svg_laptop = SVG_LAPTOP;
export const svg_notebook = SVG_NOTEBOOK;
export const svg_calculator = SVG_CALCULATOR;

// CamelCase aliases
export const watchSvg = SVG_WATCH;
export const toteBagSvg = SVG_TOTE_BAG;
export const walletSvg = SVG_WALLET;
export const keysSvg = SVG_CAR_KEYS;
export const airpodsSvg = SVG_AIRPODS;
export const laptopSvg = SVG_LAPTOP;
export const notebookSvg = SVG_NOTEBOOK;
export const calculatorSvg = SVG_CALCULATOR;
export const idCardSvg = SVG_STUDENT_ID;
export const backpackSvg = SVG_BACKPACK;

// Predefined 8-step Deterministic Round-Robin sequence for newly reported items
export const NEW_ITEMS_SEQUENCE = [
  'watch',
  'tote',
  'wallet',
  'keys',
  'airpods',
  'laptop',
  'notebook',
  'calculator'
] as const;

// Dictionary of vintage vector SVGs
export const VINTAGE_INLINE_SVGS: Record<VintageVectorType, string> = {
  watch: SVG_WATCH,
  tote: SVG_TOTE_BAG,
  wallet: SVG_WALLET,
  keys: SVG_CAR_KEYS,
  airpods: SVG_AIRPODS,
  laptop: SVG_LAPTOP,
  notebook: SVG_NOTEBOOK,
  calculator: SVG_CALCULATOR,
  car_keys: SVG_CAR_KEYS,
  tote_bag: SVG_TOTE_BAG,
  student_id: SVG_STUDENT_ID,
  backpack: SVG_BACKPACK
};

// Canonical 1:1 mapping for the 8 standard items by ID
export const CANONICAL_ITEM_VECTORS: Record<string, VintageVectorType> = {
  'item-1': 'airpods',
  'item-2': 'car_keys',
  'item-3': 'wallet',
  'item-4': 'student_id',
  'item-5': 'backpack',
  'item-6': 'laptop',
  'item-7': 'notebook',
  'item-8': 'calculator'
};

// Safe getter function with strict priority: ID -> explicit vector -> smart keyword/category
export function renderItemSvg(vectorType?: string): string {
  if (vectorType && vectorType in VINTAGE_INLINE_SVGS) {
    return VINTAGE_INLINE_SVGS[vectorType as VintageVectorType];
  }
  return VINTAGE_INLINE_SVGS.notebook;
}

// Fallback logic when registering a new item so no square turns black
export function getVectorForCategory(category: string, itemName = ''): VintageVectorType {
  const name = itemName.toLowerCase();

  // 1. Calculator (Checked FIRST before laptop/computer so 'آلة حاسبة' or 'حاسبة' never matches laptop)
  if (name.includes('حاسبة') || name.includes('آلة حاسبة') || name.includes('كاسيو') || name.includes('casio') || name.includes('calc')) {
    return 'calculator';
  }

  // 2. Laptop Computer & Smart Devices (Checked BEFORE wallet so 'ماك بوك' never matches 'بوك')
  if (name.includes('لابتوب') || name.includes('ماك') || name.includes('macbook') || name.includes('حاسوب') || name.includes('كمبيوتر') || name.includes('محمول') || name.includes('جوال') || name.includes('هاتف') || name.includes('آيفون') || name.includes('iphone')) {
    return 'laptop';
  }

  // 3. AirPods & Wireless Audio / Smart Watches
  if (name.includes('سماع') || name.includes('إيربود') || name.includes('airpod') || name.includes('سماعه') || name.includes('ساع') || name.includes('watch')) {
    return 'airpods';
  }

  // 4. Vehicular Keys & Medallion
  if (name.includes('مفتاح') || name.includes('مفاتيح') || name.includes('سيار') || name.includes('ريموت')) {
    return 'car_keys';
  }

  // 5. University Student ID & Academic Credentials (strictly separated from wallet)
  if (name.includes('بطاق') || name.includes('هوي') || name.includes('كارنيه') || name.includes('رخص') || name.includes('وثيق') || name.includes('سجل') || name.includes('شهادة')) {
    return 'student_id';
  }

  // 6. Canvas Scholastic Backpack
  if (name.includes('شنط') || name.includes('حقيب') || name.includes('شنطة') || name.includes('باك') || name.includes('backpack')) {
    return 'backpack';
  }

  // 7. Wirebound Notebook & Pen
  if (name.includes('دفتر') || name.includes('كشكول') || name.includes('مذكر') || name.includes('كتاب') || name.includes('قلم') || name.includes('أوراق')) {
    return 'notebook';
  }

  // 8. Leather Wallet & Billfold
  if (name.includes('محفظ') || name.includes('نقود') || name.includes('جلد') || name.includes('بوك')) {
    return 'wallet';
  }

  // Safe category fallbacks (no single default dominating)
  switch (category) {
    case 'electronics':
      return 'laptop';
    case 'documents':
      return 'student_id';
    case 'belongings':
      return 'wallet';
    case 'keys':
      return 'car_keys';
    case 'tools':
      return 'notebook';
    default:
      return 'notebook';
  }
}
