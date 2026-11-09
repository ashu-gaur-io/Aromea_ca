// data.js — fallback static data (matches menuData.js exactly)
// Used as emergency fallback only. menuData.js is the primary source.

const menuItems = [
    { id:1,  name:"Classic Espresso",          category:"Coffee",       price:1,   isVeg:true,  isAvailable:true,  isBestseller:true,  isSpecial:false, image:"images/espresso.jpg"  },
    { id:2,  name:"Caramel Macchiato",          category:"Coffee",       price:200, isVeg:true,  isAvailable:true,  isBestseller:false, isSpecial:true,  image:"images/car.jpg"       },
    { id:7,  name:"Matcha Latte",               category:"Coffee",       price:180, isVeg:true,  isAvailable:false, isBestseller:false, isSpecial:false, image:"images/matcha.jpg"    },
    { id:13, name:"Cold Brew",                  category:"Coffee",       price:120, isVeg:true,  isAvailable:true,  isBestseller:false, isSpecial:true,  image:"images/latte.jpg"     },
    { id:16, name:"Mocha",                      category:"Coffee",       price:180, isVeg:true,  isAvailable:true,  isBestseller:true,  isSpecial:false, image:"images/espresso.jpg"  },
    { id:3,  name:"Avocado Toast",              category:"Snacks",       price:180, isVeg:true,  isAvailable:true,  isBestseller:false, isSpecial:false, image:"images/avacoda.jpg"   },
    { id:4,  name:"Grilled Paneer Sandwich",    category:"Snacks",       price:350, isVeg:true,  isAvailable:true,  isBestseller:true,  isSpecial:false, image:"images/paneer.jpg"    },
    { id:8,  name:"Smoked Salmon Bagel",        category:"Snacks",       price:385, isVeg:false, isAvailable:true,  isBestseller:false, isSpecial:false, image:"images/bagel.jpg"     },
    { id:5,  name:"Tiramisu",                   category:"Desserts",     price:225, isVeg:false, isAvailable:true,  isBestseller:true,  isSpecial:false, image:"images/tiramisu.jpg"  },
    { id:6,  name:"Vegan Chocolate Brownie",    category:"Desserts",     price:215, isVeg:true,  isAvailable:true,  isBestseller:false, isSpecial:true,  image:"images/brwonie.jpg"   },
    { id:10, name:"Egg White Spinach Omelette", category:"High Protein", price:150, isVeg:true,  isAvailable:true,  isBestseller:false, isSpecial:false, image:"images/egg.jpg"       },
    { id:9,  name:"Grilled Chicken Quinoa Bowl",category:"High Protein", price:275, isVeg:false, isAvailable:true,  isBestseller:false, isSpecial:true,  image:"images/quinowa.webp"  },
    { id:12, name:"Açaí Superfood Bowl",        category:"High Protein", price:215, isVeg:true,  isAvailable:true,  isBestseller:true,  isSpecial:false, image:"images/acai.jpg"      }
];

window.menuItems = menuItems;
