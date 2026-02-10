// Dummy data for design preview — replaces API calls

export const DUMMY_CATEGORIES = [
  {
    id: "cat-1",
    name: "Electronics",
    image: "https://picsum.photos/seed/electronics/200/200",
  },
  {
    id: "cat-2",
    name: "Clothing",
    image: "https://picsum.photos/seed/clothing/200/200",
  },
  {
    id: "cat-3",
    name: "Books",
    image: "https://picsum.photos/seed/books/200/200",
  },
  {
    id: "cat-4",
    name: "Home & Garden",
    image: "https://picsum.photos/seed/homegarden/200/200",
  },
  {
    id: "cat-5",
    name: "Sports",
    image: "https://picsum.photos/seed/sports/200/200",
  },
];

export const DUMMY_PRODUCTS = [
  {
    id: "prod-1",
    slug: "wireless-bluetooth-headphones",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium noise-cancelling wireless headphones with 30-hour battery life. Features deep bass, crystal-clear highs, and ultra-comfortable memory foam ear cushions for extended listening sessions.",
    price: 129.99,
    images: [
      "https://picsum.photos/seed/headphones1/800/800",
      "https://picsum.photos/seed/headphones2/800/800",
      "https://picsum.photos/seed/headphones3/800/800",
    ],
    category: { id: "cat-1", name: "Electronics" },
    createdAt: "2025-12-01T10:00:00Z",
  },
  {
    id: "prod-2",
    slug: "smart-fitness-watch",
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracker with heart rate monitoring, GPS tracking, sleep analysis, and 7-day battery life. Water-resistant up to 50 meters with a vibrant AMOLED display.",
    price: 249.99,
    images: [
      "https://picsum.photos/seed/watch1/800/800",
      "https://picsum.photos/seed/watch2/800/800",
    ],
    category: { id: "cat-1", name: "Electronics" },
    createdAt: "2025-12-05T14:30:00Z",
  },
  {
    id: "prod-3",
    slug: "organic-cotton-t-shirt",
    name: "Organic Cotton T-Shirt",
    description:
      "Sustainably made 100% organic cotton t-shirt. Soft, breathable, and available in a range of earth-toned colors. Perfect for everyday wear with a relaxed modern fit.",
    price: 34.99,
    images: ["https://picsum.photos/seed/tshirt1/800/800"],
    category: { id: "cat-2", name: "Clothing" },
    createdAt: "2025-12-10T09:15:00Z",
  },
  {
    id: "prod-4",
    slug: "leather-crossbody-bag",
    name: "Leather Crossbody Bag",
    description:
      "Handcrafted genuine leather crossbody bag with adjustable strap and multiple compartments. Elegant minimalist design suitable for both casual and formal occasions.",
    price: 89.99,
    images: [
      "https://picsum.photos/seed/bag1/800/800",
      "https://picsum.photos/seed/bag2/800/800",
    ],
    category: { id: "cat-2", name: "Clothing" },
    createdAt: "2025-12-15T11:45:00Z",
  },
  {
    id: "prod-5",
    slug: "the-art-of-programming",
    name: "The Art of Programming",
    description:
      "A comprehensive guide to modern software development practices. Covers algorithms, design patterns, and clean code principles with real-world examples and exercises.",
    price: 42.5,
    images: ["https://picsum.photos/seed/book1/800/800"],
    category: { id: "cat-3", name: "Books" },
    createdAt: "2025-12-18T08:00:00Z",
  },
  {
    id: "prod-6",
    slug: "mindful-living-journal",
    name: "Mindful Living Journal",
    description:
      "A beautifully designed guided journal for mindfulness and daily reflection. Features prompts, gratitude sections, and weekly goal-setting pages on premium paper.",
    price: 24.99,
    images: ["https://picsum.photos/seed/journal1/800/800"],
    category: { id: "cat-3", name: "Books" },
    createdAt: "2025-12-20T13:20:00Z",
  },
  {
    id: "prod-7",
    slug: "ceramic-plant-pot-set",
    name: "Ceramic Plant Pot Set",
    description:
      "Set of 3 minimalist ceramic plant pots in graduated sizes with bamboo saucers. Modern matte finish in neutral tones — perfect for indoor plants and succulents.",
    price: 45.0,
    images: [
      "https://picsum.photos/seed/pot1/800/800",
      "https://picsum.photos/seed/pot2/800/800",
    ],
    category: { id: "cat-4", name: "Home & Garden" },
    createdAt: "2025-12-22T16:00:00Z",
  },
  {
    id: "prod-8",
    slug: "bamboo-cutting-board",
    name: "Bamboo Cutting Board",
    description:
      "Extra-large organic bamboo cutting board with juice grooves and easy-grip handles. Naturally antimicrobial and knife-friendly. A must-have for any kitchen.",
    price: 29.99,
    images: ["https://picsum.photos/seed/board1/800/800"],
    category: { id: "cat-4", name: "Home & Garden" },
    createdAt: "2025-12-25T10:30:00Z",
  },
  {
    id: "prod-9",
    slug: "yoga-mat-pro",
    name: "Yoga Mat Pro",
    description:
      "Extra-thick 6mm non-slip yoga mat with alignment markers. Made from eco-friendly TPE material with a carrying strap included. Ideal for yoga, Pilates, and floor exercises.",
    price: 54.99,
    images: [
      "https://picsum.photos/seed/yoga1/800/800",
      "https://picsum.photos/seed/yoga2/800/800",
    ],
    category: { id: "cat-5", name: "Sports" },
    createdAt: "2025-12-28T07:45:00Z",
  },
  {
    id: "prod-10",
    slug: "stainless-steel-water-bottle",
    name: "Stainless Steel Water Bottle",
    description:
      "Double-walled vacuum insulated 750ml water bottle. Keeps drinks cold for 24 hours or hot for 12 hours. Leak-proof lid with a sleek brushed metal finish.",
    price: 32.0,
    images: ["https://picsum.photos/seed/bottle1/800/800"],
    category: { id: "cat-5", name: "Sports" },
    createdAt: "2026-01-02T12:00:00Z",
  },
  {
    id: "prod-11",
    slug: "portable-bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    description:
      "Compact waterproof Bluetooth speaker with 360° sound and 20-hour playtime. Features built-in microphone for hands-free calls and a carabiner clip for on-the-go use.",
    price: 79.99,
    images: [
      "https://picsum.photos/seed/speaker1/800/800",
      "https://picsum.photos/seed/speaker2/800/800",
    ],
    category: { id: "cat-1", name: "Electronics" },
    createdAt: "2026-01-05T15:00:00Z",
  },
  {
    id: "prod-12",
    slug: "denim-jacket-classic",
    name: "Denim Jacket Classic",
    description:
      "Timeless classic-fit denim jacket with button closure and chest pockets. Washed indigo finish for a vintage look. Versatile layering piece for all seasons.",
    price: 69.99,
    images: ["https://picsum.photos/seed/denim1/800/800"],
    category: { id: "cat-2", name: "Clothing" },
    createdAt: "2026-01-08T09:30:00Z",
  },
];
