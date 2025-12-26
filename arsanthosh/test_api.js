async function testAddProduct() {
    const BASE_URL = "http://127.0.0.1:5000/api";

    try {
        console.log("1. Logging in...");
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "tester-admin@example.com",
                password: "AdminPassword123",
                secretKey: "SECRET123"
            })
        });

        const loginData = await loginRes.json();
        if (!loginData.success) {
            console.error("Login Failed:", loginData);
            return;
        }

        const token = loginData.data.token;
        console.log("Logged in. Token acquired.");

        console.log("2. Adding a test product...");
        const productData = {
            name: "Test Architectural Handle v4",
            description: "A premium brass handle for modern interiors.",
            price: 2700,
            category: "Hardware",
            stock: 70,
            status: "published",
            isFeatured: true,
            features: ["Solid Brass", "Matt Finish", "Ergonomic Design"],
            whyChoose: ["Durable", "Elegant"],
            images: ["https://example.com/image3.jpg"]
        };

        const addRes = await fetch(`${BASE_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(productData)
        });

        const addData = await addRes.json();
        if (addRes.ok) {
            console.log("Success! Product Added:");
            console.log(JSON.stringify(addData, null, 2));
        } else {
            console.error("Add Product Failed:", addData);
        }

    } catch (error) {
        console.error("Test Failed:", error.message);
    }
}

testAddProduct();
