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
"[project]/food-app/apps/web/src/app/api/restaurants/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$restaurants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/data/restaurants.ts [app-route] (ecmascript)");
;
;
function GET() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        restaurants: __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$restaurants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["restaurants"]
    });
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b0aff946._.js.map