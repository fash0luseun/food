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
"[externals]/buffer [external] (buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("buffer", () => require("buffer"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/food-app/apps/web/src/lib/jwt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "signToken",
    ()=>signToken,
    "verifyToken",
    ()=>verifyToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/node_modules/jsonwebtoken/index.js [app-route] (ecmascript)");
;
const SECRET = process.env.JWT_SECRET ?? 'dev-secret-change-me';
function signToken(payload) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].sign(payload, SECRET, {
        expiresIn: '7d'
    });
}
function verifyToken(token) {
    try {
        return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$node_modules$2f$jsonwebtoken$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].verify(token, SECRET);
    } catch  {
        return null;
    }
}
}),
"[project]/food-app/apps/web/src/data/users.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNextUserId",
    ()=>getNextUserId,
    "users",
    ()=>users
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
;
// Admin credentials: admin@dandd.ng / Admin@DD2025
const ADMIN_HASH = __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].hashSync('Admin@DD2025', 10);
const users = [
    {
        id: 'u0',
        name: 'D&D Owner',
        email: 'admin@dandd.ng',
        passwordHash: ADMIN_HASH,
        role: 'admin',
        createdAt: '2025-01-01T00:00:00.000Z'
    },
    {
        id: 'u1',
        name: 'Demo User',
        email: 'demo@example.com',
        // bcryptjs hash of "password123"
        passwordHash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        role: 'user',
        createdAt: '2024-01-01T00:00:00.000Z'
    }
];
let nextUserId = 2;
function getNextUserId() {
    return `u${nextUserId++}`;
}
}),
"[project]/food-app/apps/web/src/lib/auth-middleware.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "withAdmin",
    ()=>withAdmin,
    "withAuth",
    ()=>withAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/lib/jwt.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/data/users.ts [app-route] (ecmascript)");
;
;
;
function withAuth(handler) {
    return async (req)=>{
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const token = authHeader.slice(7);
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!payload) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid or expired token'
            }, {
                status: 401
            });
        }
        return handler(req, payload.userId);
    };
}
function withAdmin(handler) {
    return async (req)=>{
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const token = authHeader.slice(7);
        const payload = (0, __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$lib$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["verifyToken"])(token);
        if (!payload) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Invalid or expired token'
            }, {
                status: 401
            });
        }
        const user = __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$users$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["users"].find((u)=>u.id === payload.userId);
        if (!user || user.role !== 'admin') {
            return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Forbidden — admin access only'
            }, {
                status: 403
            });
        }
        return handler(req, payload.userId);
    };
}
}),
"[project]/food-app/apps/web/src/data/orders.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getNextOrderId",
    ()=>getNextOrderId,
    "orders",
    ()=>orders
]);
const orders = [
    {
        id: 'o1',
        userId: 'u1',
        restaurantId: 'r1',
        restaurantName: 'Burger Palace',
        items: [
            {
                menuItemId: 'm1',
                name: 'Classic Cheeseburger',
                price: 9.99,
                quantity: 2
            },
            {
                menuItemId: 'm4',
                name: 'Crispy Fries',
                price: 3.99,
                quantity: 1
            }
        ],
        subtotal: 23.97,
        deliveryFee: 1.99,
        total: 25.96,
        status: 'delivered',
        placedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString()
    }
];
let nextOrderId = 2;
function getNextOrderId() {
    return `o${nextOrderId++}`;
}
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
        imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92a03a05?w=800&q=80',
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
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
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
"[project]/food-app/apps/web/src/app/api/orders/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/lib/auth-middleware.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$orders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/data/orders.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$restaurants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/food-app/apps/web/src/data/restaurants.ts [app-route] (ecmascript)");
;
;
;
;
const GET = (0, __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAuth"])(async (_req, userId)=>{
    const userOrders = __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$orders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orders"].filter((o)=>o.userId === userId);
    return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        orders: userOrders.reverse()
    });
});
const POST = (0, __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$middleware$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["withAuth"])(async (req, userId)=>{
    const { restaurantId, items, deliveryFee } = await req.json();
    if (!restaurantId || !items || items.length === 0) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'restaurantId and items are required'
        }, {
            status: 400
        });
    }
    const restaurant = __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$restaurants$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["restaurants"].find((r)=>r.id === restaurantId);
    if (!restaurant) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Restaurant not found'
        }, {
            status: 404
        });
    }
    const subtotal = items.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    const fee = deliveryFee ?? restaurant.deliveryFee;
    const total = subtotal + fee;
    const order = {
        id: (0, __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$orders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getNextOrderId"])(),
        userId,
        restaurantId,
        restaurantName: restaurant.name,
        items,
        subtotal: Math.round(subtotal * 100) / 100,
        deliveryFee: fee,
        total: Math.round(total * 100) / 100,
        status: 'placed',
        placedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000).toISOString()
    };
    __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$src$2f$data$2f$orders$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["orders"].push(order);
    return __TURBOPACK__imported__module__$5b$project$5d2f$food$2d$app$2f$apps$2f$web$2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
        order
    }, {
        status: 201
    });
});
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ea458de7._.js.map