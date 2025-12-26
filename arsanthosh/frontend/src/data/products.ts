export interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    numericPrice: number;
    image: string;
    desc: string;
    longDesc?: string;
    specs?: { [key: string]: string };
}

export const products: Product[] = [
    {
        id: "luxury-door-handles",
        name: "Luxury Door Handles",
        category: "Fittings",
        price: "₹4,500",
        numericPrice: 4500,
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        desc: "Handcrafted brass door handles with a sleek obsidian finish.",
        longDesc: "Elevate your entryways with our premium handcrafted brass handles. Featuring an obsidian powder-coated finish, these handles offer both durability and a timeless aesthetic for modern homes. Each pair is meticulously finished to ensure smooth operation and a comfortable grip.",
        specs: {
            Material: "Solid Brass",
            Finish: "Obsidian Black",
            Length: "200mm",
            Warranty: "5 Years"
        }
    },
    {
        id: "smart-bio-locks",
        name: "Smart Bio-Locks",
        category: "Security",
        price: "₹18,200",
        numericPrice: 18200,
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=800&auto=format&fit=crop",
        desc: "Advanced biometric security with remote access control.",
        longDesc: "The ultimate in home security. This biometric lock uses military-grade fingerprint encryption and connects to your smartphone via our dedicated app. Unlock from anywhere, grant temporary access codes to guests, and receive real-time alerts on your device.",
        specs: {
            Type: "Biometric Fingerprint",
            Connectivity: "Wi-Fi, Bluetooth",
            Backup: "Physical Key, Type-C Power",
            Users: "Up to 50"
        }
    },
    {
        id: "designer-cabinet-knobs",
        name: "Designer Cabinet Knobs",
        category: "Hardware",
        price: "₹850",
        numericPrice: 850,
        image: "https://images.unsplash.com/photo-1518481612222-68bbe828eba1?q=80&w=800&auto=format&fit=crop",
        desc: "Minimalist knobs for a contemporary kitchen aesthetic.",
        longDesc: "These minimalist knobs are the perfect subtle upgrade for your kitchen or closet. Crafted from high-density zinc alloy with a fingerprint-resistant matte finish.",
        specs: {
            Diameter: "32mm",
            Material: "Zinc Alloy",
            Includes: "Mounting Screws"
        }
    },
    {
        id: "brushed-gold-faucets",
        name: "Brushed Gold Faucets",
        category: "Kitchen",
        price: "₹7,800",
        numericPrice: 7800,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
        desc: "High-grade stainless steel faucets with premium gold plating.",
        longDesc: "Our brushed gold faucet collection combines Italian design with exceptional engineering. The ceramic disc valve ensures leak-free performance, while the brushed PVD finish resists tarnishing and corrosion.",
        specs: {
            Height: "350mm",
            Valve: "Ceramic Disc",
            Waterway: "Lead-free brass"
        }
    },
    {
        id: "modern-pendant-light",
        name: "Modern Pendant Light",
        category: "Decor",
        price: "₹12,400",
        numericPrice: 12400,
        image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=800&auto=format&fit=crop",
        desc: "Statement lighting for dining areas and grand hallways.",
        longDesc: "Create a focal point in any room with this architectural pendant light. The geometric frame and diffused LED output provide soft, ambient lighting suitable for high-end interiors.",
        specs: {
            Wattage: "45W LED",
            Color: "3000K (Warm White)",
            Dimmable: "Yes"
        }
    },
    {
        id: "hidden-door-hinges",
        name: "Hidden Door Hinges",
        category: "Hardware",
        price: "₹1,200",
        numericPrice: 1200,
        image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=800&auto=format&fit=crop",
        desc: "Concealed 3D adjustable hinges for seamless door design.",
        longDesc: "Achieve the 'invisible door' look with our 3D adjustable concealed hinges. These heavy-duty hinges are designed for flush-fitting doors and can be adjusted after installation without removal.",
        specs: {
            Capacity: "80kg (Pair)",
            Adjustment: "3-Way (Up/Down, Side, Depth)",
            Opening: "180 Degrees"
        }
    }
];
