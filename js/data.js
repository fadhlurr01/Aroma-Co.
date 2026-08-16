/* ==========================================================================
   AROMA & CO. COFFEE ROASTERS - MASTER DATA
   ========================================================================== */

const COFFEE_MENU = [
  {
    id: "prod-1",
    name: "Golden Velvet Espresso",
    category: "espresso",
    price: 35000,
    rating: 4.9,
    badge: "Signature",
    badgeClass: "badge-gold",
    description: "Espresso ganda dengan crema tebal berwarna karamel. Memiliki catatan rasa cokelat hitam, caramelized brown sugar, dan sentuhan citrus.",
    flavorProfile: { acidity: "Sedang", body: "Tebal (Full)", sweetness: "Manis Caramel", aroma: "Floral & Dark Chocolate" },
    tags: ["Hot", "Specialty", "Espresso Bar"],
    svgType: "espresso"
  },
  {
    id: "prod-2",
    name: "Smoked Vanilla Cold Brew",
    category: "cold",
    price: 42000,
    rating: 4.8,
    badge: "Best Seller",
    badgeClass: "badge-amber",
    description: "Cold brew yang diseduh dingin selama 18 jam, dipadukan dengan vanila madagascar asap artisan dan oat milk lembut.",
    flavorProfile: { acidity: "Rendah", body: "Creamy", sweetness: "Sedang", aroma: "Smoky Vanilla" },
    tags: ["Iced", "Dairy-Free Option", "Cold Brew"],
    svgType: "coldbrew"
  },
  {
    id: "prod-3",
    name: "Single Origin V60 Pour Over",
    category: "manual",
    price: 45000,
    rating: 5.0,
    badge: "Micro-lot",
    badgeClass: "badge-gold",
    description: "Seduhan manual biji kopi pilihan (Sumatra Gayo / Bali Kintamani). Mengekstrak kejelasan rasa fruity, jasmine, dan aftertaste manis madu.",
    flavorProfile: { acidity: "Cerah (Bright)", body: "Ringan-Sedang", sweetness: "Madu Alami", aroma: "Jasmine & Bergamot" },
    tags: ["Hot", "Single Origin", "Manual Brew"],
    svgType: "pourover"
  },
  {
    id: "prod-4",
    name: "Sea Salt Caramel Latte",
    category: "espresso",
    price: 40000,
    rating: 4.9,
    badge: "Popular",
    badgeClass: "badge-amber",
    description: "Perpaduan espresso espresso house blend, susu segar, sirup karamel bakar buatan sendiri, dan garam laut Bali.",
    flavorProfile: { acidity: "Rendah", body: "Creamy Full", sweetness: "Salted Caramel", aroma: "Toasted Sugar" },
    tags: ["Hot/Iced", "Sweet & Savory"],
    svgType: "latte"
  },
  {
    id: "prod-5",
    name: "Japanese Iced Drip (Kintamani)",
    category: "cold",
    price: 44000,
    rating: 4.8,
    badge: "Fresh & Crisp",
    badgeClass: "badge-amber",
    description: "Drip kopi panas yang langsung menetes ke batu es kristal. Mengunci keharuman rasa jeruk tangerine dan plum hitam.",
    flavorProfile: { acidity: "Cerah Berkilau", body: "Clean Light", sweetness: "Fruit Sweetness", aroma: "Citrus Blossom" },
    tags: ["Iced", "Manual Drip"],
    svgType: "icedrip"
  },
  {
    id: "prod-6",
    name: "Artisan Matcha Oat Latte",
    category: "noncoffee",
    price: 42000,
    rating: 4.7,
    badge: "Superfood",
    badgeClass: "badge-amber",
    description: "Matcha kualitas ceremonial impor dari Uji, Kyoto. Dikocok dengan susu gandum (Oatside) & sedikit madu murni.",
    flavorProfile: { acidity: "Tidak ada", body: "Silky Creamy", sweetness: "Umani Mild", aroma: "Fresh Matcha" },
    tags: ["Hot/Iced", "Dairy-Free", "Non-Coffee"],
    svgType: "matcha"
  },
  {
    id: "prod-7",
    name: "French Press Dark Roast",
    category: "manual",
    price: 38000,
    rating: 4.6,
    badge: "Classic",
    badgeClass: "badge-amber",
    description: "Ekstraksi perendaman sempurna yang mempertahankan minyak alami kopi. Karakter rasa tebal, rempah-rempah hangat, dan toasted hazelnut.",
    flavorProfile: { acidity: "Sangat Rendah", body: "Heavy Body", sweetness: "Dark Cocoa", aroma: "Nutty & Spicy" },
    tags: ["Hot", "Bold Flavor"],
    svgType: "frenchpress"
  },
  {
    id: "prod-8",
    name: "Butter Croissant Artisan",
    category: "pastry",
    price: 28000,
    rating: 4.9,
    badge: "Fresh Baked",
    badgeClass: "badge-gold",
    description: "Pastry butter khas Prancis dipanggang segar setiap pagi. Renyah di luar dan berlapis-lapis lembut beraroma mentega gurih.",
    flavorProfile: { acidity: "-", body: "Flaky & Buttery", sweetness: "Gurih Savory", aroma: "Fresh Baked Bakery" },
    tags: ["Bakery", "Pairing Kopi"],
    svgType: "croissant"
  }
];

const COFFEE_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Bagaimana Anda menyukai tingkat keasaman (acidity) dalam cangkir kopi Anda?",
    options: [
      { text: "Suka rasa fruity & segar seperti jeruk atau berry", score: "manual" },
      { text: "Keseimbangan sedang, tidak terlalu asam", score: "espresso" },
      { text: "Tidak suka asam sama sekali, ingin rasa tebal & bold", score: "frenchpress" },
      { text: "Saya lebih menyukai minuman manis/creamy", score: "cold" }
    ]
  },
  {
    id: 2,
    question: "Kapan waktu favorit Anda untuk menikmati kopi?",
    options: [
      { text: "Pagi hari untuk menambah semangat energi", score: "espresso" },
      { text: "Siang hari saat cuaca hangat & santai", score: "cold" },
      { text: "Sore hari sambil membaca atau bekerja", score: "manual" },
      { text: "Malam hari tanpa kafein tinggi", score: "noncoffee" }
    ]
  },
  {
    id: 3,
    question: "Apa tekstur (body) kopi yang paling Anda nikmati?",
    options: [
      { text: "Ringan & bersih (Clean & Light Body)", score: "manual" },
      { text: "Kental, creamy, dan gurih susu", score: "cold" },
      { text: "Intens, pekat, dan crema tebal", score: "espresso" },
      { text: "Tebal dan berkarakter (Heavy & Rich)", score: "frenchpress" }
    ]
  }
];

const OUTLETS_DATA = [
  {
    id: "out-1",
    name: "Aroma Flagship Store - Downtown",
    address: "Jl. Jend. Sudirman No. 88, Jakarta Selatan",
    hours: "Senin - Minggu: 07.00 - 22.00 WIB",
    phone: "+62 21 555 8901",
    features: ["Indoor AC", "Coffee Bar Counter", "VIP Meeting Room", "High-Speed Wi-Fi"],
    isPopular: true
  },
  {
    id: "out-2",
    name: "Aroma Garden Pavilion - Senopati",
    address: "Jl. Senopati Raya No. 45, Jakarta Selatan",
    hours: "Senin - Minggu: 08.00 - 23.00 WIB",
    phone: "+62 21 555 9902",
    features: ["Outdoor Garden Terrace", "Live Music Stage", "Pet Friendly", "Roasting Lab"],
    isPopular: false
  },
  {
    id: "out-3",
    name: "Aroma Artisan Lab - Bandung",
    address: "Jl. Dago No. 120, Bandung",
    hours: "Senin - Minggu: 07.30 - 21.30 WIB",
    phone: "+62 22 420 7711",
    features: ["Cupping Tasting Room", "Manual Brew Bar", "Pastry Kitchen", "Parking Area"],
    isPopular: false
  }
];

const BREWING_GUIDES_DATA = [
  {
    id: "v60",
    name: "V60 Pour Over",
    ratio: "1:15",
    grindSize: "Medium Fine (Seperti garam meja)",
    defaultCoffeeGrams: 15,
    temp: "90°C - 92°C",
    totalTimeSeconds: 150, // 2:30 mins
    phases: [
      { name: "Bloom (Pemekaran)", startSec: 0, endSec: 45, waterPercent: 20, desc: "Tuang air 20% dari total, biarkan kopi mekar dan melepaskan CO2." },
      { name: "First Pour", startSec: 45, endSec: 90, waterPercent: 60, desc: "Tuang perlahan memutar searah jarum jam hingga 60% total air." },
      { name: "Final Pour & Drawdown", startSec: 90, endSec: 150, waterPercent: 100, desc: "Tuang sisa air hingga 100%, biarkan air menetes habis secara konsisten." }
    ]
  },
  {
    id: "frenchpress",
    name: "French Press",
    ratio: "1:14",
    grindSize: "Coarse (Kasar seperti garam laut)",
    defaultCoffeeGrams: 20,
    temp: "93°C",
    totalTimeSeconds: 240, // 4:00 mins
    phases: [
      { name: "Steeping (Perendaman)", startSec: 0, endSec: 60, waterPercent: 100, desc: "Tuang seluruh air panas, aduk perlahan 3 kali." },
      { name: "Crust Break", startSec: 60, endSec: 210, waterPercent: 100, desc: "Tutup French Press, biarkan terekstraksi tenang selama 3.5 menit." },
      { name: "Press & Pour", startSec: 210, endSec: 240, waterPercent: 100, desc: "Tekan plunger secara lembut dan tuang segera ke cangkir." }
    ]
  },
  {
    id: "aeropress",
    name: "AeroPress",
    ratio: "1:12",
    grindSize: "Fine to Medium Fine",
    defaultCoffeeGrams: 16,
    temp: "88°C",
    totalTimeSeconds: 90, // 1:30 mins
    phases: [
      { name: "Infusion", startSec: 0, endSec: 45, waterPercent: 100, desc: "Tuang air hangat, aduk mutar 10 detik dengan spatula." },
      { name: "Plunge", startSec: 45, endSec: 90, waterPercent: 100, desc: "Pasang plunger dan tekan perlahan dengan beban konsisten." }
    ]
  }
];
