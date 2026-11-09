// ============================================================
//  menuData.js  –  Aromea Café  (CLEAN FINAL)
//  Only items with proper real photos
//  No broken image dependencies
//  13 items total, 2 non-veg, 2 desserts
// ============================================================

const menuItems = [

    // ── COFFEE (5 items) ──────────────────────────────────────
    {
        id: 1,
        name: "Classic Espresso",
        category: "Coffee",
        description: "Rich and bold single origin espresso shot.",
        price: 1,
        isVeg: true, isAvailable: true,
        isBestseller: true, isSpecial: false,
        image: "images/espresso.jpg"        // ✅ real photo
    },
    {
        id: 2,
        name: "Caramel Macchiato",
        category: "Coffee",
        description: "Espresso with steamed milk and sweet caramel drizzle.",
        price: 200,
        isVeg: true, isAvailable: true,
        isBestseller: false, isSpecial: true,
        image: "images/car.jpg"             // ✅ real macchiato photo
    },
    {
        id: 7,
        name: "Matcha Latte",
        category: "Coffee",
        description: "Premium green tea powder whisked with steamed oat milk.",
        price: 180,
        isVeg: true, isAvailable: false,
        isBestseller: false, isSpecial: false,
        image: "images/matcha.jpg"          // ✅ real photo
    },
    {
        id: 13,
        name: "Cold Brew",
        category: "Coffee",
        description: "Smooth, chilled cold brew coffee with a perfect balance of flavor.",
        price: 120,
        isVeg: true, isAvailable: true,
        isBestseller: false, isSpecial: true,
        image: "images/latte.jpg"           // ✅ real iced coffee photo
    },
    {
        id: 16,
        name: "Mocha",
        category: "Coffee",
        description: "Rich combination of espresso and velvety chocolate milk.",
        price: 180,
        isVeg: true, isAvailable: true,
        isBestseller: true, isSpecial: false,
        image: "images/mocha.jpg"
    },

    // ── SNACKS (3 items) ──────────────────────────────────────
    {
        id: 3,
        name: "Avocado Toast",
        category: "Snacks",
        description: "Sourdough toast topped with smashed avocado and cherry tomatoes.",
        price: 180,
        isVeg: true, isAvailable: true,
        isBestseller: false, isSpecial: false,
        image: "images/avacoda.jpg"         // ✅ real photo
    },
    {
        id: 4,
        name: "Grilled Paneer Sandwich",
        category: "Snacks",
        description: "Soft paneer slices grilled with spices, lettuce, tomato and creamy mayo.",
        price: 350,
        isVeg: true, isAvailable: true,
        isBestseller: true, isSpecial: false,
        image: "images/paneer.jpg"          // ✅ real photo
    },
    {
        id: 8,
        name: "Smoked Salmon Bagel",
        category: "Snacks",
        description: "Toasted bagel with cream cheese, smoked salmon, and capers.",
        price: 385,
        isVeg: false, isAvailable: true,    // ← non-veg #1
        isBestseller: false, isSpecial: false,
        image: "images/bagel.jpg"           // ✅ real photo
    },

    // ── DESSERTS (2 items only) ───────────────────────────────
    {
        id: 5,
        name: "Tiramisu",
        category: "Desserts",
        description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone.",
        price: 225,
        isVeg: false, isAvailable: true,    // ← non-veg #2
        isBestseller: true, isSpecial: false,
        image: "images/tiramisu.jpg"        // ✅ real photo
    },
    {
        id: 6,
        name: "Vegan Chocolate Brownie",
        category: "Desserts",
        description: "Rich, fudgy brownie made with almond flour and dark chocolate.",
        price: 215,
        isVeg: true, isAvailable: true,
        isBestseller: false, isSpecial: true,
        image: "images/brwonie.jpg"         // ✅ real photo
    },

    // ── HIGH PROTEIN (3 items) ────────────────────────────────
    {
        id: 10,
        name: "Egg White Spinach Omelette",
        category: "High Protein",
        description: "Fluffy egg whites, feta cheese, and spinach. (25g Protein)",
        price: 150,
        isVeg: false,   // eggs = non-veg isAvailable: true,
        isBestseller: false, isSpecial: false,
        image: "images/egg.jpg"             // ✅ real photo
    },
    {
        id: 9,
        name: "Grilled Chicken Quinoa Bowl",
        category: "High Protein",
        description: "Power bowl with 35g of protein, fresh greens, and house vinaigrette.",
        price: 275,
        isVeg: false, isAvailable: true,
        isBestseller: false, isSpecial: true,
        image: "images/quinowa.webp"        // ✅ real photo
    },
    {
        id: 12,
        name: "Açaí Superfood Bowl",
        category: "High Protein",
        description: "Açaí topped with chia seeds, peanut butter, and almonds. (15g Protein)",
        price: 215,
        isVeg: true, isAvailable: true,
        isBestseller: true, isSpecial: false,
        image: "images/acai.jpg"            // ✅ real photo
    }
];

// ── ID → image (all real photos, no broken SVGs) ──────────────
const IMAGE_BY_ID = {
    1:  'images/espresso.jpg',
    2:  'images/car.jpg',
    3:  'images/avacoda.jpg',
    4:  'images/paneer.jpg',
    5:  'images/tiramisu.jpg',
    6:  'images/brwonie.jpg',
    7:  'images/matcha.jpg',
    8:  'images/bagel.jpg',
    9:  'images/quinowa.webp',
    10: 'images/egg.jpg',
    12: 'images/acai.jpg',
    13: 'images/latte.jpg',
    16: 'images/mocha.jpg'
};

// ── mapLocalImage: ID (number) OR name (string) ───────────────
function mapLocalImage(nameOrId) {
    const asNum = Number(nameOrId);
    if (!isNaN(asNum) && IMAGE_BY_ID[asNum]) return IMAGE_BY_ID[asNum];

    const n = String(nameOrId).toLowerCase();
    if (n.includes('espresso'))                             return 'images/espresso.jpg';
    if (n.includes('caramel') || n.includes('macchiato'))  return 'images/car.jpg';
    if (n.includes('mocha'))                                return 'images/mocha.jpg';
    if (n.includes('cold brew'))                            return 'images/latte.jpg';
    if (n.includes('matcha'))                               return 'images/matcha.jpg';
    if (n.includes('latte') || n.includes('whey'))         return 'images/latte.jpg';
    if (n.includes('avocado'))                              return 'images/avacoda.jpg';
    if (n.includes('paneer'))                               return 'images/paneer.jpg';
    if (n.includes('bagel') || n.includes('salmon'))       return 'images/bagel.jpg';
    if (n.includes('tiramisu'))                             return 'images/tiramisu.jpg';
    if (n.includes('brownie'))                              return 'images/brwonie.jpg';
    if (n.includes('quinoa') || n.includes('chicken'))     return 'images/quinowa.webp';
    if (n.includes('egg') || n.includes('omelette'))       return 'images/egg.jpg';
    if (n.includes('açaí') || n.includes('acai'))          return 'images/acai.jpg';
    if (n.includes('smoothie'))                             return 'images/acai.jpg';
    return 'images/placeholder.jpg';
}

// ── normalizeMenuItem ─────────────────────────────────────────
function normalizeMenuItem(item) {
    const id   = item.id || item.item_id || null;
    const name = item.name || 'Unnamed Item';
    let image  = item.image;
    if (!image || image.includes('undefined')) {
        image = id ? (IMAGE_BY_ID[id] || mapLocalImage(name)) : mapLocalImage(name);
    }
    return {
        id, item_id: id, name,
        category:     item.category     || item.category_name || 'Other',
        description:  item.description  || '',
        price:        Number(item.price  || 0),
        isVeg:        !!(item.isVeg || item.is_veg === 1 || item.is_veg === true),
        isAvailable:  !!(item.isAvailable || item.is_available === 1 || item.is_available === true),
        isSpecial:    item.isSpecial    ?? item.is_special    ?? false,
        isBestseller: item.isBestseller ?? item.is_bestseller ?? false,
        image
    };
}

window.normalizeMenuItem = normalizeMenuItem;
window.mapLocalImage     = mapLocalImage;
window.menuItems         = menuItems.map(normalizeMenuItem);

// ── Fetch from backend, merge with static ────────────────────
async function fetchMenuFromAPI() {
    try {
        const res = await fetch('http://localhost:5000/api/menu');
        if (!res.ok) throw new Error('not ok');
        const dbItems = await res.json();
        if (!dbItems || dbItems.length === 0) return;

        // Only keep items in our curated list
        const allowedIds = new Set(menuItems.map(m => m.id));

        const apiItems = dbItems
            .filter(item => allowedIds.has(item.item_id || item.id))
            .map(item => {
                const id = item.item_id || item.id;
                const staticMatch = menuItems.find(m => m.id === id) || {};
                return normalizeMenuItem({
                    id, item_id: id,
                    name:         item.name,
                    category:     item.category_name  || staticMatch.category    || 'Other',
                    description:  item.description    || staticMatch.description || '',
                    price:        item.price,
                    isVeg:        item.is_veg,
                    isAvailable:  item.is_available,
                    isSpecial:    staticMatch.isSpecial    ?? false,
                    isBestseller: staticMatch.isBestseller ?? false,
                    image:        IMAGE_BY_ID[id] || mapLocalImage(id)
                });
            });

        if (apiItems.length > 0) window.menuItems = apiItems;

        if (typeof renderMenu          === 'function') renderMenu(window.menuItems);
        if (typeof renderCatalogue     === 'function') renderCatalogue();
        if (typeof renderFeaturedItems === 'function') {
            ['specials-grid','bestsellers-grid'].forEach(gid => {
                const el = document.getElementById(gid); if (el) el.innerHTML = '';
            });
            renderFeaturedItems('specials-grid',    i => i.isSpecial,    'ribbon-special',    "Today's Special");
            renderFeaturedItems('bestsellers-grid', i => i.isBestseller, 'ribbon-bestseller', "Best Seller");
        }
    } catch (e) {
        console.log('Backend unavailable, using static data.');
    }
}

fetchMenuFromAPI();
