/* ==========================================================================
   AROMA & CO. COFFEE ROASTERS - MASTER DATA (RICH ARTISAN DATA & SENSORY)
   ========================================================================== */

export const COFFEE_MENU = [
  {
    id: "prod-1",
    name: "Golden Velvet Espresso",
    category: "espresso",
    price: 35000,
    rating: 4.9,
    qScore: 89.5,
    altitude: "1.600 mdpl",
    origin: "Aceh Gayo & Flores Bajawa Blend",
    process: "Giling Basah & Washed",
    roastLevel: "Medium-Dark Roast",
    roastDots: 3,
    badge: "House Signature",
    badgeClass: "badge-gold",
    description: "Espresso ganda dengan crema tebal keemasan. Karakter rasa cokelat hitam Belgia, gula karamel bakar, dan sentuhan kesegaran jeruk citrus manis.",
    flavorProfile: {
      acidity: "Sedang Berseimbang",
      body: "Tebal & Berat (Full Body)",
      sweetness: "Karamel Madu",
      aroma: "Dark Cocoa & Floral",
      aftertaste: "Panjang & Manis"
    },
    tastingNotes: ["Dark Chocolate", "Caramelized Sugar", "Citrus Zest", "Toasted Walnut"],
    recommendedBrew: {
      temp: "92°C",
      ratio: "1:2 (Espresso Double)",
      time: "26-28 detik"
    },
    tags: ["Hot", "Specialty", "Espresso Bar"],
    svgType: "espresso",
    image: "/assets/images/prod-1.jpg"
  },
  {
    id: "prod-2",
    name: "Smoked Vanilla Cold Brew",
    category: "cold",
    price: 42000,
    rating: 4.8,
    qScore: 88.0,
    altitude: "1.450 mdpl",
    origin: "Bali Kintamani & Java Preanger",
    process: "Cold Extraction 18-Jam",
    roastLevel: "Medium Roast",
    roastDots: 2,
    badge: "Best Seller",
    badgeClass: "badge-amber",
    description: "Cold brew yang diseduh dingin secara perlahan selama 18 jam, dipadukan dengan ekstrak vanila madagascar asap artisan dan oat milk lembut pilihan.",
    flavorProfile: {
      acidity: "Rendah Lembut",
      body: "Kental Creamy",
      sweetness: "Manis Vanila Alami",
      aroma: "Smoky Vanilla & Hazelnut",
      aftertaste: "Clean & Velvety"
    },
    tastingNotes: ["Smoked Vanilla", "Creamy Oat", "Molasses", "Milk Chocolate"],
    recommendedBrew: {
      temp: "4°C (Ice Chilled)",
      ratio: "1:8 (Cold Steep)",
      time: "18 Jam Ekstraksi"
    },
    tags: ["Iced", "Dairy-Free Option", "Cold Brew"],
    svgType: "coldbrew",
    image: "/assets/images/prod-2.jpg"
  },
  {
    id: "prod-3",
    name: "Single Origin V60 Pour Over",
    category: "manual",
    price: 45000,
    rating: 5.0,
    qScore: 91.2,
    altitude: "1.700 mdpl",
    origin: "Toraja Sapan & Gayo Highlands",
    process: "Full Washed Micro-lot",
    roastLevel: "Light-Medium Roast",
    roastDots: 1,
    badge: "Artisan Micro-Lot",
    badgeClass: "badge-gold",
    description: "Seduhan manual dengan filter V60 presisi. Mengekstrak kejernihan rasa buah plum manis, aroma melati liar, dan aftertaste manis madu hutan yang luar biasa.",
    flavorProfile: {
      acidity: "Cerah & Berkilau (Bright)",
      body: "Ringan Bersih (Silky)",
      sweetness: "Madu Liar Nusantara",
      aroma: "Jasmine Blossom & Bergamot",
      aftertaste: "Sangat Bersih & Floral"
    },
    tastingNotes: ["Ripe Plum", "Jasmine Flower", "Wild Honey", "Bergamot Citrus"],
    recommendedBrew: {
      temp: "91°C",
      ratio: "1:15 (15g Kopi / 225ml Air)",
      time: "2 menit 30 detik"
    },
    tags: ["Hot", "Single Origin", "Manual Brew"],
    svgType: "pourover",
    image: "/assets/images/prod-3.jpg"
  },
  {
    id: "prod-4",
    name: "Sea Salt Caramel Latte",
    category: "espresso",
    price: 40000,
    rating: 4.9,
    qScore: 88.5,
    altitude: "1.500 mdpl",
    origin: "House Blend Artisan",
    process: "Semi-Washed",
    roastLevel: "Medium Roast",
    roastDots: 2,
    badge: "Popular Favorite",
    badgeClass: "badge-amber",
    description: "Perpaduan harmonis antara espresso house blend pekat, susu segar bertekstur microfoam, saus karamel mentega buatan sendiri, dan garam laut murni Kusamba Bali.",
    flavorProfile: {
      acidity: "Sangat Rendah",
      body: "Krim Sutra (Silky Creamy)",
      sweetness: "Salted Butter Caramel",
      aroma: "Toasted Brown Sugar",
      aftertaste: "Gurih Manis Seimbang"
    },
    tastingNotes: ["Salted Caramel", "Butterscotch", "Sweet Toffee", "Roasted Hazelnut"],
    recommendedBrew: {
      temp: "65°C (Steamed Milk)",
      ratio: "1 Shot Espresso + 180ml Susu",
      time: "Freshly Pulled"
    },
    tags: ["Hot/Iced", "Sweet & Savory", "Specialty Latte"],
    svgType: "latte",
    image: "/assets/images/prod-4.jpg"
  },
  {
    id: "prod-5",
    name: "Japanese Iced Drip (Kintamani)",
    category: "cold",
    price: 44000,
    rating: 4.8,
    qScore: 90.0,
    altitude: "1.400 mdpl",
    origin: "Kintamani, Bali",
    process: "Natural Anaerobic",
    roastLevel: "Light Roast",
    roastDots: 1,
    badge: "Fresh & Crisp",
    badgeClass: "badge-amber",
    description: "Drip kopi panas yang langsung menetes dan terkunci di atas bongkahan es kristal. Mengunci keharuman rasa jeruk tangerine Bali yang menyegarkan dahaga.",
    flavorProfile: {
      acidity: "Cerah Buah Jeruk (Citrus Crisp)",
      body: "Jernih Ringan (Clean Light)",
      sweetness: "Gula Buah Alami",
      aroma: "Orange Blossom & Peach",
      aftertaste: "Segar Menyegarkan"
    },
    tastingNotes: ["Tangerine Citrus", "White Peach", "Orange Blossom", "Cane Sugar"],
    recommendedBrew: {
      temp: "93°C Drip over Ice",
      ratio: "1:10 Air Panas + Es Batu",
      time: "2 menit 45 detik"
    },
    tags: ["Iced", "Manual Drip", "Single Origin"],
    svgType: "icedrip",
    image: "/assets/images/prod-5.jpg"
  },
  {
    id: "prod-6",
    name: "Artisan Matcha Oat Latte",
    category: "noncoffee",
    price: 42000,
    rating: 4.7,
    qScore: 89.0,
    altitude: "Ceremonial Grade",
    origin: "Uji, Kyoto, Japan",
    process: "Stone Ground Shade-Grown",
    roastLevel: "Ceremonial Matcha",
    roastDots: 0,
    badge: "Superfood Classic",
    badgeClass: "badge-amber",
    description: "Matcha kualitas ceremonial murni dari Uji Kyoto. Dikocok tradisional dengan chasen bambu dan disajikan bersama susu gandum premium (Oatside).",
    flavorProfile: {
      acidity: "Tidak Ada Asam",
      body: "Kental Halus (Silky Creamy)",
      sweetness: "Umami Manis Ringan",
      aroma: "Fresh Green Tea & Seaweed",
      aftertaste: "Umami Halus Bertahan"
    },
    tastingNotes: ["Ceremonial Matcha", "Toasted Oats", "Earthy Umami", "Mild Honey"],
    recommendedBrew: {
      temp: "75°C (Chasen Whisked)",
      ratio: "3g Matcha Powder + 200ml Oatmilk",
      time: "Hand Whisked"
    },
    tags: ["Hot/Iced", "Dairy-Free", "Non-Coffee", "Superfood"],
    svgType: "matcha",
    image: "/assets/images/prod-6.jpg"
  },
  {
    id: "prod-7",
    name: "French Press Dark Roast",
    category: "manual",
    price: 38000,
    rating: 4.6,
    qScore: 87.5,
    altitude: "1.350 mdpl",
    origin: "Sumatra Mandheling & Java",
    process: "Wet-Hulled Traditional",
    roastLevel: "Dark Roast",
    roastDots: 4,
    badge: "Bold & Classic",
    badgeClass: "badge-amber",
    description: "Ekstraksi perendaman penuh yang meloloskan minyak esensial alami biji kopi. Karakter rasa tebal, rempah-rempah kayu manis hangat, dan cokelat pekat.",
    flavorProfile: {
      acidity: "Sangat Rendah (Low)",
      body: "Sangat Tebal & Pekat (Heavy Body)",
      sweetness: "Dark Cocoa Bittersweet",
      aroma: "Nutty & Spicy Wood",
      aftertaste: "Pekat Hangat Menenangkan"
    },
    tastingNotes: ["Dark Cocoa", "Cinnamon Spice", "Roasted Hazelnut", "Earthy Cedar"],
    recommendedBrew: {
      temp: "94°C",
      ratio: "1:14 (20g Kopi / 280ml Air)",
      time: "4 menit perendaman"
    },
    tags: ["Hot", "Bold Flavor", "Heavy Body"],
    svgType: "frenchpress",
    image: "/assets/images/prod-7.jpg"
  },
  {
    id: "prod-8",
    name: "Butter Croissant Artisan",
    category: "pastry",
    price: 28000,
    rating: 4.9,
    qScore: 92.0,
    altitude: "French Bakery Lab",
    origin: "Normandy Butter Recipe",
    process: "Laminated Dough 72-Layers",
    roastLevel: "Golden Brown Baked",
    roastDots: 0,
    badge: "Fresh Baked Daily",
    badgeClass: "badge-gold",
    description: "Pastry mentega murni ala Prancis yang dipanggang segar setiap pagi hari. Renyah keemasan di luar dengan lapisan dalam yang lembut dan kaya rasa mentega gurih.",
    flavorProfile: {
      acidity: "Tidak Ada",
      body: "Flaky & Buttery Layers",
      sweetness: "Gurih Mentega Alami",
      aroma: "Fresh Baked French Butter",
      aftertaste: "Lezat Memanjakan Lidah"
    },
    tastingNotes: ["French Normandy Butter", "Flaky Golden Crust", "Toasted Brioche", "Mild Sweetness"],
    recommendedBrew: {
      temp: "Warm 180°C Reheat",
      ratio: "Cocok dipadukan dengan Cappuccino / Flat White",
      time: "Freshly Warmed"
    },
    tags: ["Bakery", "Pairing Kopi", "Fresh Baked"],
    svgType: "croissant",
    image: "/assets/images/prod-8.jpg"
  }
];

export const COFFEE_QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Bagaimana preferensi tingkat keasaman (acidity) dalam cangkir kopi Anda?",
    options: [
      { text: "Citarasa cerah fruity, asam segar seperti buah jeruk & berry manis", score: "manual", tag: "Cerah & Fruity" },
      { text: "Keseimbangan rasa manis karamel yang lembut dan ramah di lambung", score: "espresso", tag: "Seimbang" },
      { text: "Tanpa rasa asam, menginginkan sensasi rasa pekat, tebal, dan aroma cokelat gelap", score: "frenchpress", tag: "Pekat & Bold" },
      { text: "Minuman kopi dingin yang manis, bertekstur kental creamy, dan memanjakan", score: "cold", tag: "Creamy & Manis" }
    ]
  },
  {
    id: 2,
    question: "Kapan waktu paling favorit Anda untuk menikmati kopi?",
    options: [
      { text: "Pagi hari untuk suntikan energi dan konsentrasi kerja maksimal", score: "espresso", tag: "Pagi Hari" },
      { text: "Siang hari yang cerah saat bersantai atau menikmati waktu luang", score: "cold", tag: "Siang Santai" },
      { text: "Sore hari yang tenang sambil membaca buku atau diskusi santai", score: "manual", tag: "Sore Hari" },
      { text: "Malam hari tanpa kandungan kafein yang terlalu keras untuk tubuh", score: "noncoffee", tag: "Malam Hari" }
    ]
  },
  {
    id: 3,
    question: "Tekstur dan karakter rasa apa yang paling Anda idamkan?",
    options: [
      { text: "Ringan, jernih bersih, dan aromatik seperti teh melati (Clean & Silky)", score: "manual", tag: "Silky & Clean" },
      { text: "Kental, lembut, rasa vanila susu karamel yang memanjakan lidah", score: "cold", tag: "Rich Creamy" },
      { text: "Intens, pekat, aroma cokelat tebal dengan crema keemasan", score: "espresso", tag: "Intense Espresso" },
      { text: "Tebal berkarakter, rempah aromatik, dan aroma sangrai klasik menenangkan", score: "frenchpress", tag: "Heavy Body" }
    ]
  }
];

export const OUTLETS_DATA = [
  {
    id: "out-1",
    name: "Aroma Flagship HQ - Senopati",
    address: "Jl. Senopati Raya No. 45, Kebayoran Baru, Jakarta Selatan",
    hours: "Senin - Minggu: 07.00 - 23.00 WIB",
    phone: "+62 21 555 8901",
    features: ["Indoor AC Lounge", "Roasting Lab Experience", "VIP Private Meeting Room", "High-Speed Wi-Fi", "Valet Parking"],
    isPopular: true,
    image: "/assets/images/hero-bg.jpg"
  },
  {
    id: "out-2",
    name: "Aroma Garden Pavilion - Menteng",
    address: "Jl. Teuku Umar No. 18, Menteng, Jakarta Pusat",
    hours: "Senin - Minggu: 07.30 - 22.30 WIB",
    phone: "+62 21 555 9902",
    features: ["Heritage Garden Terrace", "Manual Brew Bar", "Live Acoustic Stage", "Pet Friendly", "Outdoor Seating"],
    isPopular: false,
    image: "/assets/images/roastery.jpg"
  },
  {
    id: "out-3",
    name: "Aroma Artisan Lab - Bandung",
    address: "Jl. Dago No. 120, Coblong, Kota Bandung",
    hours: "Senin - Minggu: 07.30 - 22.00 WIB",
    phone: "+62 22 420 7711",
    features: ["Cupping Tasting Room", "Pastry Open Kitchen", "Mountain View Terrace", "Free Wi-Fi & Power Plugs"],
    isPopular: false,
    image: "/assets/images/hero-bg.jpg"
  }
];

export const BREWING_GUIDES_DATA = [
  {
    id: "v60",
    name: "V60 Pour Over",
    ratio: "1:15",
    ratioNum: 15,
    grindSize: "Medium Fine (Seperti garam meja halus)",
    defaultCoffeeGrams: 15,
    temp: "90°C - 92°C",
    totalTimeSeconds: 150,
    phases: [
      { name: "Bloom (Pemekaran Kopi)", startSec: 0, endSec: 45, waterPercent: 20, desc: "Tuang 20% air panas (45ml), biarkan bubuk kopi mekar melepaskan gas CO2 selama 45 detik." },
      { name: "First Continuous Pour", startSec: 45, endSec: 90, waterPercent: 60, desc: "Tuang perlahan dengan gerakan spiral searah jarum jam dari tengah ke tepi hingga mencapai 60% total air." },
      { name: "Final Drawdown", startSec: 90, endSec: 150, waterPercent: 100, desc: "Tuangkan sisa air secara lembut dan konsisten. Biarkan seluruh seduhan kopi menetes habis ke server." }
    ]
  },
  {
    id: "frenchpress",
    name: "French Press",
    ratio: "1:14",
    ratioNum: 14,
    grindSize: "Coarse (Kasar seperti butiran garam laut)",
    defaultCoffeeGrams: 20,
    temp: "93°C - 95°C",
    totalTimeSeconds: 240,
    phases: [
      { name: "Initial Infusion", startSec: 0, endSec: 60, waterPercent: 100, desc: "Tuang seluruh takaran air panas ke wadah French Press, aduk perlahan 3 kali agar terbasahi merata." },
      { name: "Steeping Extraction", startSec: 60, endSec: 210, waterPercent: 100, desc: "Pasang penutup dan biarkan ekstraksi perendaman berlangsung tenang selama 3,5 menit tanpa ditekan." },
      { name: "Gentle Press & Serve", startSec: 210, endSec: 240, waterPercent: 100, desc: "Tekan plunger ke bawah dengan tekanan yang lembut dan stabil, lalu segera tuangkan kopi ke cangkir Anda." }
    ]
  },
  {
    id: "aeropress",
    name: "AeroPress Precision",
    ratio: "1:12",
    ratioNum: 12,
    grindSize: "Fine to Medium Fine (Sedikit lebih halus dari V60)",
    defaultCoffeeGrams: 16,
    temp: "86°C - 88°C",
    totalTimeSeconds: 90,
    phases: [
      { name: "Fast Infusion & Stir", startSec: 0, endSec: 45, waterPercent: 100, desc: "Tuangkan air panas suhu 88°C, aduk cepat dengan spatula selama 10 detik lalu pasang plunger." },
      { name: "Smooth Plunge", startSec: 45, endSec: 90, waterPercent: 100, desc: "Tekan plunger secara perlahan dengan beban berat tangan selama 30 detik hingga terdengar bunyi desis udara." }
    ]
  }
];
