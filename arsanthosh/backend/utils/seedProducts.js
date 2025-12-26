const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const Product = require("../models/Product");
const User = require("../models/User");
const Review = require("../models/Review");

// Load env vars
dotenv.config({ path: "./.env" });

const categories = [
    { name: "Living Room", items: ["Modern Sofa", "Coffee Table", "Lounge Chair", "TV Unit", "Bookshelf", "Floor Lamp", "Rug", "Side Table", "Recliner", "Console Table", "Wall Art", "Bean Bag"] },
    { name: "Dining Room", items: ["Dining Table", "Dining Chair", "Bar Stool", "Sideboard", "Pendant Light", "Wine Rack", "Serving Cart", "Table Runner", "Buffet", "Display Cabinet", "Coasters", "Placemats"] },
    { name: "Bedroom", items: ["Queen Bed", "Nightstand", "Wardrobe", "Dresser", "Full Length Mirror", "Bed Bench", "Table Lamp", "Chest of Drawers", "Vanity Table", "Headboard", "Pillows", "Blanket"] },
    { name: "Office", items: ["Executive Desk", "Ergonomic Chair", "Filing Cabinet", "Desk Lamp", "Bookshelf", "Conference Table", "Visitor Chair", "Monitor Stand", "Meeting Table", "Office Sofa", "Whiteboard", "Organizer"] }
];

const images = [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-b0346efee539?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1631679706909-194416753f4e?auto=format&fit=crop&w=800&q=80"
];

const features = [
    "Premium solid wood construction",
    "Handcrafted finish",
    "Ergonomic design for comfort",
    "Easy assembly required",
    "5-year warranty included",
    "Sustainable materials",
    "Stain-resistant fabric",
    "Modern aesthetic",
    "Durable hardware",
    "Perfect for small spaces"
];

const whyChoose = [
    "Unmatched quality and durability",
    "Designed by award-winning architects",
    "Ethically sourced materials",
    "Free shipping and returns",
    "Customer satisfaction guarantee"
];

const comments = [
    "Absolutely love this! The quality is amazing.",
    "Great value for money. Fits perfectly in my room.",
    "Delivery was fast and assembly was easy. Highly recommend!",
    "Looks exactly like the pictures. Very happy with my purchase.",
    "Good product but shipping took a bit longer than expected.",
    "The finish is beautiful. Adds a touch of class to my home.",
    "Comfortable and stylish. Just what I needed.",
    "Solid build and great design. 5 stars!",
    "A bit pricey but worth every penny.",
    "Service was excellent. Will buy again."
];

const dummyUsers = [
    { name: "Alice Johnson", email: "alice@example.com", password: "password123" },
    { name: "Bob Smith", email: "bob@example.com", password: "password123" },
    { name: "Charlie Davis", email: "charlie@example.com", password: "password123" },
    { name: "Diana Prince", email: "diana@example.com", password: "password123" },
    { name: "Ethan Hunt", email: "ethan@example.com", password: "password123" }
];

const seedDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in .env");
        }

        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        // 1. Clear Data (Except Admins if possible, but let's clear all for simplicity in dev)
        // await User.deleteMany({ role: { $ne: "admin" } }); // Keep admin? User probably wants a fresh start or we can just add users.
        // Let's just add users. Duplicate email checks might fail if we don't clear.
        // For safety, let's delete only dummy users based on email domain or just ensure we don't error on dupes.
        // Actually, let's clear Reviews and Products completely.
        await Review.deleteMany({});
        await Product.deleteMany({});
        console.log("Cleared Products and Reviews.");

        // 2. Create/Get Dummy Users
        const createdUsers = [];
        for (const u of dummyUsers) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(u.password, 10);
                user = await User.create({
                    name: u.name,
                    email: u.email,
                    password: hashedPassword,
                    role: "user"
                });
                console.log(`Created user: ${u.name}`);
            }
            createdUsers.push(user);
        }

        // 3. Generate Products
        let products = [];
        categories.forEach((cat, catIdx) => {
            cat.items.forEach((item, itemIdx) => {
                const price = Math.floor(Math.random() * (50000 - 5000) + 5000); // 5k to 50k
                const imgIndex = (catIdx * 10 + itemIdx) % images.length;
                const productImages = [
                    images[imgIndex],
                    images[(imgIndex + 1) % images.length],
                    images[(imgIndex + 2) % images.length]
                ];

                products.push({
                    name: item,
                    slug: item.toLowerCase().replace(/ /g, "-") + "-" + Math.floor(Math.random() * 10000),
                    description: `Experience the elegance of our ${item}. ${cat.name} furniture that combines style with functionality. Crafted with precision to elevate your home decor.`,
                    price: price,
                    category: cat.name,
                    images: productImages,
                    videos: [],
                    features: [features[itemIdx % features.length], features[(itemIdx + 3) % features.length], features[(itemIdx + 6) % features.length]],
                    whyChoose: whyChoose,
                    stock: Math.floor(Math.random() * 50) + 5,
                    status: "published",
                    isFeatured: Math.random() > 0.8,
                    averageRating: 0,
                    numReviews: 0
                });
            });
        });

        const savedProducts = await Product.insertMany(products);
        console.log(`Seeded ${savedProducts.length} products.`);

        // 4. Generate Reviews
        const reviews = [];
        for (const product of savedProducts) {
            const numReviews = Math.floor(Math.random() * 6); // 0 to 5 reviews
            if (numReviews === 0) continue;

            let totalRating = 0;
            const productReviews = [];

            for (let i = 0; i < numReviews; i++) {
                const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
                const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly

                // Check if this user already reviewed this product to avoid dupe index error
                const alreadyReviewed = productReviews.find(r => r.userId.toString() === user._id.toString());
                if (alreadyReviewed) continue;

                const review = {
                    productId: product._id,
                    userId: user._id,
                    userName: user.name,
                    rating: rating,
                    comment: comments[Math.floor(Math.random() * comments.length)],
                    createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)) // Random past time
                };

                productReviews.push(review);
                reviews.push(review);
                totalRating += rating;
            }

            // Update product stats
            if (productReviews.length > 0) {
                product.numReviews = productReviews.length;
                product.averageRating = totalRating / productReviews.length;
                await product.save();
            }
        }

        await Review.insertMany(reviews);
        console.log(`Seeded ${reviews.length} reviews.`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
