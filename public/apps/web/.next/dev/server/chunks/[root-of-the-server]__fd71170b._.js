module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/food-app/apps/web/src/data/restaurants.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "restaurants",
    ()=>restaurants
]);
const restaurants = [
    {
        id: 'r1',
        name: "Mama Cee's Buka",
        description: "Authentic Yoruba home cooking — egusi, efo riro, amala, and classic Nigerian soups",
        cuisine: 'Yoruba',
        rating: 4.7,
        reviewCount: 342,
        deliveryTime: '25–40 min',
        deliveryFee: 1.49,
        minimumOrder: 8,
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
        isOpen: true,
        address: '12 Bode Thomas St, Surulere',
        categories: [
            'Soups',
            'Swallow',
            'Rice Dishes',
            'Drinks'
        ]
    },
    {
        id: 'r2',
        name: 'Suya Spot',
        description: "Northern Nigeria's finest suya, kilishi, and open-flame grills straight from the skewer",
        cuisine: 'Hausa',
        rating: 4.8,
        reviewCount: 519,
        deliveryTime: '15–30 min',
        deliveryFee: 0.99,
        minimumOrder: 5,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
        isOpen: true,
        address: '7 Wuse Market Rd, Abuja',
        categories: [
            'Suya & Grills',
            'Kilishi',
            'Sides',
            'Drinks'
        ]
    },
    {
        id: 'r3',
        name: 'Jollof Kitchen',
        description: "Party jollof, fried rice, ofada stew, and all your Lagos rice-dish favourites",
        cuisine: 'Lagos',
        rating: 4.6,
        reviewCount: 287,
        deliveryTime: '20–35 min',
        deliveryFee: 1.99,
        minimumOrder: 10,
        imageUrl: 'https://i.pinimg.com/originals/fc/6c/cf/fc6ccf6314f207173840e9e368cc20b0.jpg',
        isOpen: true,
        address: '34 Awolowo Rd, Ikoyi',
        categories: [
            'Rice Dishes',
            'Proteins',
            'Sides',
            'Drinks'
        ]
    },
    {
        id: 'r4',
        name: 'Naija Delicacy',
        description: "Traditional Igbo soups — ofe onugbu, oha, ogbono, and freshly pounded fufu",
        cuisine: 'Igbo',
        rating: 4.5,
        reviewCount: 198,
        deliveryTime: '30–45 min',
        deliveryFee: 2.49,
        minimumOrder: 12,
        imageUrl: 'https://i.pinimg.com/originals/fc/6c/cf/fc6ccf6314f207173840e9e368cc20b0.jpg',
        isOpen: true,
        address: '5 Ogui Rd, Enugu',
        categories: [
            'Soups',
            'Swallow',
            'Pepper Soup',
            'Drinks'
        ]
    }
];
}),
"[project]/food-app/apps/web/src/data/menu-items.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "menuItems",
    ()=>menuItems
]);
const menuItems = [
    // ── Mama Cee's Buka ─────────────────────────────────────────────────
    {
        id: 'm1',
        restaurantId: 'r1',
        category: 'Soups',
        name: 'Egusi Soup',
        description: 'Ground melon seeds cooked with assorted meat, palm oil, and leafy greens',
        price: 6.99,
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm2',
        restaurantId: 'r1',
        category: 'Soups',
        name: 'Efo Riro',
        description: 'Rich Yoruba vegetable soup with spinach, assorted meat, and crayfish',
        price: 6.49,
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm3',
        restaurantId: 'r1',
        category: 'Soups',
        name: 'Gbegiri & Ewedu',
        description: "Smooth bean soup paired with jute leaf ewedu — Mama Cee's signature combo",
        price: 5.99,
        imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm4',
        restaurantId: 'r1',
        category: 'Swallow',
        name: 'Pounded Yam',
        description: 'Smooth, stretchy pounded yam — pairs perfectly with any soup',
        price: 3.49,
        imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm5',
        restaurantId: 'r1',
        category: 'Swallow',
        name: 'Amala',
        description: 'Dark, soft yam flour swallow — the classic companion to gbegiri and ewedu',
        price: 3.49,
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm6',
        restaurantId: 'r1',
        category: 'Rice Dishes',
        name: 'White Rice & Stew',
        description: 'Fluffy white rice served with rich Nigerian tomato stew and fried plantain',
        price: 5.49,
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm7',
        restaurantId: 'r1',
        category: 'Drinks',
        name: 'Zobo (Hibiscus Drink)',
        description: 'Chilled homemade zobo with ginger, cloves, and pineapple flavour',
        price: 2.49,
        imageUrl: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=400&q=80',
        isAvailable: true
    },
    // ── Suya Spot ────────────────────────────────────────────────────────
    {
        id: 'm8',
        restaurantId: 'r2',
        category: 'Suya & Grills',
        name: 'Beef Suya',
        description: 'Thin-sliced beef skewers marinated in yaji spice, grilled over open flame',
        price: 7.99,
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm9',
        restaurantId: 'r2',
        category: 'Suya & Grills',
        name: 'Chicken Suya',
        description: 'Juicy chicken pieces coated in spicy yaji and grilled to perfection',
        price: 8.49,
        imageUrl: 'https://images.unsplash.com/photo-1598515213692-b85d59a9a7af?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm10',
        restaurantId: 'r2',
        category: 'Suya & Grills',
        name: 'Ram Suya (Asun)',
        description: 'Spicy peppered goat meat — smoky, tender, and fiery hot',
        price: 9.99,
        imageUrl: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm11',
        restaurantId: 'r2',
        category: 'Kilishi',
        name: 'Kilishi (Beef Jerky)',
        description: 'Sun-dried spiced beef strips — the Northern Nigerian premium snack',
        price: 6.99,
        imageUrl: 'https://images.unsplash.com/photo-1588347818036-c5a46d2f4a3f?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm12',
        restaurantId: 'r2',
        category: 'Sides',
        name: 'Roasted Corn & Ube',
        description: 'Charcoal-roasted sweet corn served with African pear (ube)',
        price: 3.99,
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm13',
        restaurantId: 'r2',
        category: 'Drinks',
        name: 'Kunu Zaki',
        description: 'Chilled millet drink spiced with ginger and pepper — a Northern classic',
        price: 2.49,
        imageUrl: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80',
        isAvailable: true
    },
    // ── Jollof Kitchen ──────────────────────────────────────────────────
    {
        id: 'm14',
        restaurantId: 'r3',
        category: 'Rice Dishes',
        name: 'Party Jollof Rice',
        description: 'Smoky, tomato-based jollof rice cooked over firewood — the real deal',
        price: 7.49,
        imageUrl: 'https://i.pinimg.com/originals/fc/6c/cf/fc6ccf6314f207173840e9e368cc20b0.jpg',
        isAvailable: true
    },
    {
        id: 'm15',
        restaurantId: 'r3',
        category: 'Rice Dishes',
        name: 'Nigerian Fried Rice',
        description: 'Colourful stir-fried rice with mixed vegetables, liver, and prawns',
        price: 7.99,
        imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm16',
        restaurantId: 'r3',
        category: 'Rice Dishes',
        name: 'Ofada Rice & Ayamase',
        description: 'Local ofada rice served with green pepper ofada stew and assorted meat',
        price: 8.49,
        imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm17',
        restaurantId: 'r3',
        category: 'Proteins',
        name: 'Grilled Chicken',
        description: 'Whole seasoned chicken marinated in Nigerian spices and charcoal grilled',
        price: 9.99,
        imageUrl: 'https://images.unsplash.com/photo-1598515213692-b85d59a9a7af?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm18',
        restaurantId: 'r3',
        category: 'Sides',
        name: 'Fried Plantain (Dodo)',
        description: 'Sweet ripe plantain slices fried golden — a Nigerian table staple',
        price: 3.49,
        imageUrl: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm19',
        restaurantId: 'r3',
        category: 'Drinks',
        name: 'Chapman',
        description: 'Nigerian party cocktail — Fanta, Sprite, Ribena, cucumber, and grenadine',
        price: 3.99,
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
        isAvailable: true
    },
    // ── Naija Delicacy ──────────────────────────────────────────────────
    {
        id: 'm20',
        restaurantId: 'r4',
        category: 'Soups',
        name: 'Ofe Onugbu (Bitter Leaf Soup)',
        description: 'Traditional Igbo soup with bitter leaf, cocoyam, and assorted meat',
        price: 7.49,
        imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm21',
        restaurantId: 'r4',
        category: 'Soups',
        name: 'Oha Soup',
        description: 'Delicate Igbo soup made with oha leaves, cocoyam thickener, and palm oil',
        price: 7.99,
        imageUrl: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm22',
        restaurantId: 'r4',
        category: 'Soups',
        name: 'Ogbono Soup',
        description: 'Thick, draw soup made from ground ogbono seeds with leafy vegetables',
        price: 6.99,
        imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm23',
        restaurantId: 'r4',
        category: 'Swallow',
        name: 'Fufu (Cassava)',
        description: 'Soft, fermented cassava fufu — the classic Igbo swallow',
        price: 3.49,
        imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm24',
        restaurantId: 'r4',
        category: 'Pepper Soup',
        name: 'Catfish Pepper Soup',
        description: 'Spicy, aromatic pepper soup with fresh catfish and native spices',
        price: 8.99,
        imageUrl: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=400&q=80',
        isAvailable: true
    },
    {
        id: 'm25',
        restaurantId: 'r4',
        category: 'Drinks',
        name: 'Palm Wine',
        description: 'Fresh naturally fermented palm wine — mildly sweet with a gentle fizz',
        price: 3.49,
        imageUrl: 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=400&q=80',
        isAvailable: true
    }
];
}),
"[project]/food-app/apps/web/src/app/api/restaurants/[id]/menu/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$restaurants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/data/restaurants.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$menu$2d$items$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/data/menu-items.ts [app-route] (ecmascript)");
;
;
;
async function GET(_req, { params }) {
    const { id } = await params;
    const restaurant = __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$restaurants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["restaurants"].find((r)=>r.id === id);
    if (!restaurant) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Restaurant not found'
        }, {
            status: 404
        });
    }
    const items = __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$menu$2d$items$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["menuItems"].filter((m)=>m.restaurantId === id);
    const categories = restaurant.categories.filter((cat)=>items.some((item)=>item.category === cat));
    return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        categories,
        items
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fd71170b._.js.map