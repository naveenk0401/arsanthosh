const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const products = [
  // DOORS (5)
  {
    name: "Premium Teak Wood Front Door",
    slug: "premium-teak-wood-front-door",
    description:
      "Luxury hand-carved teak wood main door with modern minimalist design. Weather-resistant finish.",
    price: 45000.0,
    category: "Doors",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 10,
    status: "published",
    features: ["Grade A Teak Wood", "Termite Proof", "10-Year Warranty"],
    whyChoose: ["Aesthetic Value", "Extreme Durability"],
  },
  {
    name: "Minimalist Internal Flush Door",
    slug: "minimalist-internal-flush-door",
    description:
      "High-density fiberboard flush door with sleek matte finish and soundproofing layer.",
    price: 12500.0,
    category: "Doors",
    images: [
      "https://images.unsplash.com/photo-1481277542470-605612bd2d61?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 25,
    status: "published",
    features: ["Sound Insulated", "Warp Resistant", "Easy Installation"],
    whyChoose: ["Modern Look", "Cost Effective"],
  },
  {
    name: "Sliding Glass Patio Door",
    slug: "sliding-glass-patio-door",
    description:
      "Aluminum framed sliding door with double-glazed tempered glass for maximum natural light.",
    price: 32000.0,
    category: "Doors",
    images: [
      "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 15,
    status: "published",
    features: ["Tempered Glass", "Smooth Sliding", "Energy Efficient"],
    whyChoose: ["Panoramic View", "Space Saving"],
  },
  {
    name: "Designer Veneer Main Door",
    slug: "designer-veneer-main-door",
    description:
      "Premium veneer overlay door with contemporary grooved patterns and rose gold accents.",
    price: 28500.0,
    category: "Doors",
    images: [
      "https://images.unsplash.com/photo-1544207240-8b1025eb7aeb?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 12,
    status: "published",
    features: ["Natural Wood Texture", "Scratch Resistant", "Heavy Duty"],
    whyChoose: ["Elegant Finish", "Unique Pattern"],
  },
  {
    name: "Classic Oak Security Door",
    slug: "classic-oak-security-door",
    description:
      "Solid oak wood door with reinforced steel core for ultimate home security and style.",
    price: 55000.0,
    category: "Doors",
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 8,
    status: "published",
    features: ["Steel Reinforced", "Multipoint Lock", "Classic Aesthetic"],
    whyChoose: ["Peace of Mind", "Timeless Beauty"],
  },

  // CUPBOARDS (5)
  {
    name: "Modern Walk-in Wardrobe System",
    slug: "modern-walk-in-wardrobe-system",
    description:
      "Customizable open-concept walk-in wardrobe with soft-close drawers and integrated lighting.",
    price: 85000.0,
    category: "Cupboards",
    images: [
      "https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 5,
    status: "published",
    features: ["Modular Design", "Soft Close", "Motion Sensors"],
    whyChoose: ["Maximum Storage", "Luxury Appeal"],
  },
  {
    name: "Sleek Sliding Cupboard",
    slug: "sleek-sliding-cupboard",
    description:
      "Space-saving sliding door wardrobe with floor-to-ceiling mirror and adjustable shelving.",
    price: 42000.0,
    category: "Cupboards",
    images: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 20,
    status: "published",
    features: ["Space Efficient", "Full Mirror", "Dust Proof"],
    whyChoose: ["Compact Build", "Functional Design"],
  },
  {
    name: "Minimalist Wall-Mounted Cabinet",
    slug: "minimalist-wall-mounted-cabinet",
    description:
      "Floating wall cabinet with handle-less push-to-open mechanism for a clean look.",
    price: 18500.0,
    category: "Cupboards",
    images: [
      "https://images.unsplash.com/photo-1558997519-53bb7ad09e5e?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 30,
    status: "published",
    features: ["Floating Design", "Push-to-Open", "Sturdy Brackets"],
    whyChoose: ["Easy Cleaning", "Modern Vibe"],
  },
  {
    name: "Traditional Teak Almirah",
    slug: "traditional-teak-almirah",
    description:
      "Timeless freestanding teak wood almirah with brass handles and secret lockers.",
    price: 65000.0,
    category: "Cupboards",
    images: [
      "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 6,
    status: "published",
    features: ["Solid Wood", "Antique Finish", "Security Locker"],
    whyChoose: ["Generational Quality", "High Resale Value"],
  },
  {
    name: "Children's Colorful Storage Unit",
    slug: "childrens-colorful-storage-unit",
    description:
      "Fun and safe storage unit for kids with rounded corners and easy-access baskets.",
    price: 9500.0,
    category: "Cupboards",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 40,
    status: "published",
    features: ["Kid-Safe Paint", "Rounded Edges", "Lightweight"],
    whyChoose: ["Easy Cleanup", "Safe Design"],
  },

  // TV UNITS (4)
  {
    name: "Floating Marble TV Unit",
    slug: "floating-marble-tv-unit",
    description:
      "Elegant floating console with Carrara marble finish and hidden cable management.",
    price: 24500.0,
    category: "TV Units",
    images: [
      "https://images.unsplash.com/photo-1594488651837-9940f6da5817?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 15,
    status: "published",
    features: ["Marble Top", "Cable Management", "Space Loading 50kg"],
    whyChoose: ["Sophisticated Look", "Easy Maintenance"],
  },
  {
    name: "Industrial Wood & Steel Unit",
    slug: "industrial-wood-steel-unit",
    description:
      "Robust TV stand combining reclaimed wood texture with matte black steel frames.",
    price: 16800.0,
    category: "TV Units",
    images: [
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 22,
    status: "published",
    features: ["Heavy Steel Frame", "Eco-friendly Wood", "Open Shelving"],
    whyChoose: ["Rugged Durability", "Trendy Design"],
  },
  {
    name: "Corner Entertainment Center",
    slug: "corner-entertainment-center",
    description:
      "Efficiently designed corner unit that fits perfectly in smaller living rooms.",
    price: 13500.0,
    category: "TV Units",
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c20360a59?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 18,
    status: "published",
    features: ["Corner Optimized", "Plenty of Shelves", "Lightweight"],
    whyChoose: ["Value for Money", "Space Optimizer"],
  },
  {
    name: "Grand Cinephile Wall System",
    slug: "grand-cinephile-wall-system",
    description:
      "A full-wall entertainment system with space for home theater, books, and decor.",
    price: 58000.0,
    category: "TV Units",
    images: [
      "https://images.unsplash.com/photo-1594488651837-9940f6da5817?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 4,
    status: "published",
    features: ["Integrated LED", "Wine Rack", "Glass Shelves"],
    whyChoose: ["All-in-one Storage", "Statement Piece"],
  },

  // POOJA UNITS (4)
  {
    name: "Divine Teak Wood Mandir",
    slug: "divine-teak-wood-mandir",
    description:
      "Handcrafted teak wood temple with intricate bells and gold leaf finish.",
    price: 38000.0,
    category: "Pooja Units",
    images: [
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 7,
    status: "published",
    features: ["Gold Leaf Work", "Prasad Drawer", "Bell Hangings"],
    whyChoose: ["Spiritual Aura", "Authentic Craft"],
  },
  {
    name: "Modern CNC-Cut Pooja Unit",
    slug: "modern-cnc-cut-pooja-unit",
    description:
      "Contemporary white backlit mandir with precise laser-cut Jali patterns.",
    price: 21000.0,
    category: "Pooja Units",
    images: [
      "https://images.unsplash.com/photo-1512351735230-a07ebdf5b5e1?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 12,
    status: "published",
    features: ["LED Backlit", "Marble Base", "White Matte Finish"],
    whyChoose: ["Compact & Holy", "Modern Design"],
  },
  {
    name: "Wall-Hung Compact Mandir",
    slug: "wall-hung-compact-mandir",
    description:
      "Space-saving wall-mounted devotional unit for modern apartments.",
    price: 8500.0,
    category: "Pooja Units",
    images: [
      "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 25,
    status: "published",
    features: ["Space Saving", "Durable Ply", "Easy to Clean"],
    whyChoose: ["Budget Friendly", "Smart Design"],
  },
  {
    name: "Grand Marble Temple Stand",
    slug: "grand-marble-temple-stand",
    description:
      "Pure white Makrana marble temple stand for high-end residential interiors.",
    price: 120000.0,
    category: "Pooja Units",
    images: [
      "https://images.unsplash.com/photo-1512351735230-a07ebdf5b5e1?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 2,
    status: "published",
    features: ["Solid Marble", "Everlasting Polish", "Hand Carved"],
    whyChoose: ["Ultimate Luxury", "Sacred Presence"],
  },

  // PLYWOODS (5)
  {
    name: "Prime Marine Grade Plywood",
    slug: "prime-marine-grade-plywood",
    description:
      "BWP (Boiling Water Proof) grade plywood, ideal for kitchen and bathroom cabinets.",
    price: 185.0, // per sqft
    category: "Plywoods",
    images: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 500,
    status: "published",
    features: ["72 Hours BWP", "Termite Resistant", "Calibration Guarantee"],
    whyChoose: ["Kitchen Essential", "Long Life"],
  },
  {
    name: "Ultra-Strong Neem Ply",
    slug: "ultra-strong-neem-ply",
    description:
      "Plywood made from 100% natural neem wood cores for inherent pest resistance.",
    price: 145.0,
    category: "Plywoods",
    images: [
      "https://images.unsplash.com/photo-1610660246444-1d54e4725831?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 800,
    status: "published",
    features: ["Anti-Pest Ply", "High Load Bearing", "Eco-friendly"],
    whyChoose: ["Natural Protection", "Eco conscious"],
  },
  {
    name: "Flexible Core Plywood",
    slug: "flexible-core-plywood",
    description:
      "Specialized bendable plywood for creating curved furniture and artistic shapes.",
    price: 160.0,
    category: "Plywoods",
    images: [
      "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 150,
    status: "published",
    features: ["High Flexibility", "Minimum Cracking", "Designer's Choice"],
    whyChoose: ["Creative Freedom", "Custom Shapes"],
  },
  {
    name: "Fire Retardant Plywood",
    slug: "fire-retardant-plywood",
    description:
      "Safety-first plywood designed to resist fire spread, perfect for commercial spaces.",
    price: 210.0,
    category: "Plywoods",
    images: [
      "https://images.unsplash.com/photo-1589939705351-86a117036657?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 120,
    status: "published",
    features: ["Fire Rated", "Toxic Gas Free", "Structural Integrity"],
    whyChoose: ["Safety First", "Commercial Standard"],
  },
  {
    name: "Veneer Coated Finish Ply",
    slug: "veneer-coated-finish-ply",
    description:
      "Plywood pre-layered with premium American Walnut veneer for immediate finishing.",
    price: 350.0,
    category: "Plywoods",
    images: [
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 60,
    status: "published",
    features: ["Pre-finished", "Rich Texture", "Time Saving"],
    whyChoose: ["Premium Look", "Fast Results"],
  },

  // KITCHEN BASKETS (5)
  {
    name: "Stainless Steel Cutlery Organizer",
    slug: "stainless-steel-cutlery-organizer",
    description:
      "Adjustable compartments for all your spoons, forks, and knives. Grade 304 steel.",
    price: 2800.0,
    category: "Kitchen Baskets",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 50,
    status: "published",
    features: ["Rust Proof", "Dishwasher Safe", "Anti-Slip"],
    whyChoose: ["Organization", "Hygienic"],
  },
  {
    name: "Multi-Tier Pull Out Larder",
    slug: "multi-tier-pull-out-larder",
    description:
      "Massive storage solution for your groceries with height-adjustable baskets.",
    price: 18500.0,
    category: "Kitchen Baskets",
    images: [
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 12,
    status: "published",
    features: ["Soft Close Rails", "High Capacity", "Easy Access"],
    whyChoose: ["Stocking Up", "User Friendly"],
  },
  {
    name: "Under-Sink Waste Basket",
    slug: "under-sink-waste-basket",
    description:
      "Pull-out trash management unit that fits perfectly under your sink.",
    price: 4500.0,
    category: "Kitchen Baskets",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 35,
    status: "published",
    features: ["Twin Bins", "Odour Control", "Compact"],
    whyChoose: ["Kitchen Cleanliness", "Space Saving"],
  },
  {
    name: "Corner Magic Carousel",
    slug: "corner-magic-carousel",
    description:
      "Make the most of your kitchen corners with this rotating steel rack system.",
    price: 12000.0,
    category: "Kitchen Baskets",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 15,
    status: "published",
    features: ["360 Degree Rotation", "Heavy Duty Rod", "Chrome Finish"],
    whyChoose: ["Blind Corner Fix", "Accessibility"],
  },
  {
    name: "Deep Thali Basket",
    slug: "deep-thali-basket",
    description:
      "Reinforced wire basket designed specifically for heavy Indian thalis and plates.",
    price: 3200.0,
    category: "Kitchen Baskets",
    images: [
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 100,
    status: "published",
    features: ["Reinforced Mesh", "Lifetime Rust Warranty", "Smooth Operation"],
    whyChoose: ["Everyday Utility", "Robust Build"],
  },

  // CHIMNEY (4)
  {
    name: "Stealth-90 Filterless Chimney",
    slug: "stealth-90-filterless-chimney",
    description:
      "High-suction black glass chimney with motion sensors and auto-clean tech.",
    price: 24999.0,
    category: "Chimney",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 10,
    status: "published",
    features: ["Filterless Tech", "Motion Control", "Thermal Auto-Clean"],
    whyChoose: ["Low Maintenance", "Modern Look"],
  },
  {
    name: "Classic Stainless Baffle Hood",
    slug: "classic-stainless-baffle-hood",
    description:
      "Traditional baffle filter chimney for heavy oily cooking. Reliable and powerful.",
    price: 15500.0,
    category: "Chimney",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 15,
    status: "published",
    features: ["Baffle Filters", "Powerful Motor", "Easy Installation"],
    whyChoose: ["Traditional Reliability", "Heavy Cooking"],
  },
  {
    name: "Islet Luxury Ceiling Hood",
    slug: "islet-luxury-ceiling-hood",
    description:
      "Designer island chimney that hangs from the ceiling. A statement piece for open kitchens.",
    price: 48000.0,
    category: "Chimney",
    images: [
      "https://images.unsplash.com/photo-1556911261-6bd74154736f?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 3,
    status: "published",
    features: ["Island Mounting", "Remote Control", "High Airflow"],
    whyChoose: ["Kitchen Island Perk", "Luxury Design"],
  },
  {
    name: "Compact T-Box Chimney",
    slug: "compact-t-box-chimney",
    description:
      "Slim T-shaped chimney for kitchens with limited overhead space.",
    price: 12500.0,
    category: "Chimney",
    images: [
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 20,
    status: "published",
    features: ["Space Saving", "Push Button", "Silent Motor"],
    whyChoose: ["Efficiency", "Pocket Friendly"],
  },

  // DOOR HANDLES (4)
  {
    name: "Modern Matte Black Pull",
    slug: "modern-matte-black-pull",
    description:
      "Contemporary 12-inch pull handle with premium matte powder coating.",
    price: 1850.0,
    category: "Door Handles",
    images: [
      "https://images.unsplash.com/photo-1509146756354-d9834797aec4?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 150,
    status: "published",
    features: ["Anti-Fingerprint", "Zinc Alloy", "Mounting Hardware Included"],
    whyChoose: ["Design Forward", "Comfortable Grip"],
  },
  {
    name: "Brass Heritage Mortise Set",
    slug: "brass-heritage-mortise-set",
    description:
      "Traditional brass finish handle with internal locking mechanism for security.",
    price: 3200.0,
    category: "Door Handles",
    images: [
      "https://images.unsplash.com/photo-1590424600062-1a71d939766c?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 80,
    status: "published",
    features: ["Solid Brass", "Security Keys", "Weather Proof"],
    whyChoose: ["Classic Elegance", "Home Security"],
  },
  {
    name: "Rose Gold Cabin Pulls",
    slug: "rose-gold-cabin-pulls",
    description:
      "Small designer pulls for drawers and small cabinets in trendy rose gold.",
    price: 499.0,
    category: "Door Handles",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 300,
    status: "published",
    features: ["Designer Finish", "Easy Fix", "Lightweight"],
    whyChoose: ["Pop of Color", "Budget Luxury"],
  },
  {
    name: "Sleek Chrome Lever Handle",
    slug: "sleek-chrome-lever-handle",
    description:
      "Minimalist lever handle with high-gloss chrome plating. Perfect for office use.",
    price: 1450.0,
    category: "Door Handles",
    images: [
      "https://images.unsplash.com/photo-1509146756354-d9834797aec4?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 200,
    status: "published",
    features: ["Chrome Plated", "Smooth Lever", "Scratch Resistant"],
    whyChoose: ["Professional Finish", "Durability"],
  },

  // FEVICOL GUMS (4)
  {
    name: "Fevicol Marine Waterproof Glue",
    slug: "fevicol-marine-waterproof-glue",
    description:
      "Specialized yellow glue for waterproof wood bonding in kitchens and bathrooms. 1kg.",
    price: 350.0,
    category: "Fevicol Gums",
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 500,
    status: "published",
    features: ["Waterproof", "Quick Setting", "High Bond Strength"],
    whyChoose: ["Reliability", "Industry Standard"],
  },
  {
    name: "Super-Hi Strong Wood Adhesive",
    slug: "super-hi-strong-wood-adhesive",
    description:
      "General purpose wood glue with extra high viscosity and long open time. 5kg.",
    price: 1250.0,
    category: "Fevicol Gums",
    images: [
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 100,
    status: "published",
    features: ["High Viscosity", "Anti-Fungal", "Economical 5kg Pack"],
    whyChoose: ["Value Pack", "Versatile Use"],
  },
  {
    name: "Fast-Dry Instant Bond",
    slug: "fast-dry-instant-bond",
    description: "Small instant glue for quick repairs and edge banding. 250g.",
    price: 180.0,
    category: "Fevicol Gums",
    images: [
      "https://images.unsplash.com/photo-1589939705351-86a117036657?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 250,
    status: "published",
    features: ["Instant Set", "Clear Dry", "Fine Tip"],
    whyChoose: ["Quick Fixes", "Invisible Bond"],
  },
  {
    name: "Pro-Laminate Contact Cement",
    slug: "pro-laminate-contact-cement",
    description:
      "Industrial grade adhesive for sticking laminates to plywood without air bubbles.",
    price: 850.0,
    category: "Fevicol Gums",
    images: [
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=1000&auto=format&fit=crop",
    ],
    stock: 150,
    status: "published",
    features: ["No Bubbles", "Heat Resistant", "Strong Tack"],
    whyChoose: ["Pro Carpentry", "High Quality Finish"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Product = mongoose.model(
      "Product",
      new mongoose.Schema(
        {
          name: { type: String, required: true },
          slug: { type: String, required: true, unique: true },
          description: { type: String, required: true },
          price: { type: Number, required: true },
          category: { type: String, required: true },
          images: [String],
          stock: Number,
          status: String,
          features: [String],
          whyChoose: [String],
        },
        { collection: "ars_products" }
      )
    );

    console.log("Clearing existing products...");
    await Product.deleteMany({});

    console.log(`Seeding ${products.length} products...`);
    await Product.insertMany(products);

    console.log("✅ Seeding Complete!");
  } catch (err) {
    console.error("❌ Seeding Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
