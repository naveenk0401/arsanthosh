const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Project = require("../models/Project");

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

const detailedProjects = [
  {
    title: "The Zenith Villa",
    category: "Residential Architecture",
    description:
      "A masterclass in modern luxury, The Zenith Villa redefines suburban living. Perched on a gentle slope in Coimbatore, this 5,000 sq.ft. residence was designed to seamlessly blend indoor and outdoor spaces. The architectural language focuses on clean lines, expansive glass facades, and a floating roof structure that provides deep shade while maximizing natural light.\n\nThe interiors follow a minimalist palette, enriched by warm, natural textures. The central courtyard serves as the heart of the home, around which the living, dining, and private zones are organized. Sustainable design principles, including rainwater harvesting and passive cooling, were integral to the concept.",
    location: "Coimbatore, TN",
    status: "Completed",
    images: [
      "https://images.unsplash.com/photo-1600596542815-2a4d9f300bcc?q=80&w=2075&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1974&auto=format&fit=crop",
    ],
    features: [
      "Double-height Living",
      "Infinity Pool",
      "Smart Home Automation",
    ],

    // New Detailed Fields
    budgetDetails: "₹1.2 Cr (Including Interiors)",
    timeline: "14 Months",
    materials: [
      "Italian Marble",
      "Teak Wood",
      "Toughened Glass",
      "Exposed Concrete",
    ],
    process: [
      {
        title: "Concept & Zoning",
        description:
          "Analyzing the site topography and climate to orient the building for optimal thermal comfort.",
      },
      {
        title: "Structural Design",
        description:
          "Engineering the floating cantilever roof to create a column-free living space.",
      },
      {
        title: "Material Selection",
        description:
          "Curating a palette of locally sourced stone and imported wood for a balance of luxury and sustainability.",
      },
      {
        title: "Execution & Finishes",
        description:
          "Precision joinery and installation of bespoke furniture pieces.",
      },
    ],
    clientTestimonial: {
      name: "Dr. Rajesh Kumar",
      role: "Homeowner",
      comment:
        "Ar. Santhosh didn't just design a house; he crafted a sanctuary. The attention to detail, especially how the light changes throughout the day, is magical. They stayed within budget and delivered a masterpiece.",
      rating: 5,
    },
    whyChooseUs:
      "We delivered a 20% cost saving on materials through direct vendor sourcing, without compromising on the premium finish.",
  },
  {
    title: "TechSpace Office Hub",
    category: "Commercial Architecture",
    description:
      "Designed for a leading fintech startup, TechSpace is an office environment that energizes and inspires. Moving away from traditional cubicles, the layout fosters collaboration through open-plan work zones, varied breakout areas, and acoustic private pods.\n\nThe industrial-chic aesthetic features exposed ductwork, polished concrete floors, and vibrant splashes of brand colors. Biophilic elements, including a vertical garden in the reception, enhance air quality and employee well-being.",
    location: "Tirupur, TN",
    status: "Completed",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop",
    ],
    features: ["Open Plan", "Biophilic Design", "Acoustic Pods"],

    // New Detailed Fields
    budgetDetails: "₹85 Lakhs",
    timeline: "6 Months",
    materials: [
      "Aluminum",
      "Glass Partitions",
      "Polished Concrete",
      "Acoustic Foam",
    ],
    process: [
      {
        title: "Space Planning",
        description:
          "Optimizing the 3,000 sq.ft. floor plate to accommodate 50 workstations and 3 meeting rooms.",
      },
      {
        title: "Interior Fitout",
        description:
          "Installing modular furniture systems and custom lighting solutions.",
      },
      {
        title: "Branding Integration",
        description:
          "Subtly incorporating brand identity through color accents and environmental graphics.",
      },
    ],
    clientTestimonial: {
      name: "Sarah Williams",
      role: "CEO, TechFlow",
      comment:
        "The team understood our culture perfectly. The office feels vibrant and has actually improved our team's productivity. Highly recommended for commercial fit-outs.",
      rating: 5,
    },
    whyChooseUs:
      "Rapid turnaround time of 6 months enabled the client to move in before their previous lease expired, saving them 2 months of rent.",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing projects to avoid duplicates if needed, or just append
    // For this demo, let's clear to ensure clean state with new schema
    await Project.deleteMany({});
    console.log("🗑️ Cleared existing projects");

    for (const data of detailedProjects) {
      // Check if exists (not needed if we cleared, but good practice)
      // Create proper slug
      const project = new Project(data);
      // Slug generation happens in Pre-save or Controller usually,
      // but here we are using Mongoose model directly.
      // The model doesn't have a pre-save hook for slug in the file I read?
      // Ah, the service handles it. The model just implies it.
      // Let's manually add slug here to be safe, matching service logic.
      project.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      await project.save();
      console.log(`✅ Added project: ${project.title}`);
    }

    console.log("🎉 Detailed Seeding Complete!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding data:");
    if (err.errors) {
      Object.keys(err.errors).forEach((key) => {
        console.error(`- ${key}: ${err.errors[key].message}`);
      });
    } else {
      console.error(err);
    }
    process.exit(1);
  }
};

seedDB();
