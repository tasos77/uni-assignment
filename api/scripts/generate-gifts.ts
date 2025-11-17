import { faker } from "@faker-js/faker";

// store definitions
const stores = [
  {
    name: "ChickenMax",
    category: "Food",
    logo: "/logos/chicken-logo.jpg",
    image: "/images/chicken.jpg",
  },
  {
    name: "BakeryBite",
    category: "Food",
    logo: "/logos/bakery-logo.jpg",
    image: "/images/bakery.jpg",
  },
  {
    name: "PizzaWorld",
    category: "Pizza",
    logo: "/logos/pizza-logo.jpg",
    image: "/images/pizza.jpg",
  },
  {
    name: "CoffeeCentral",
    category: "Coffee",
    logo: "/logos/coffee-logo.jpg",
    image: "/images/coffee.jpg",
  },
  {
    name: "BarHub",
    category: "Bars",
    logo: "/logos/drinks-logo.jpg",
    image: "/images/drinks.jpg",
  },
];

// generate context-based description
function generateDescription(title, store, type) {
  const brand = store.name;
  const base = title.toLowerCase();

  if (base.includes("pizza")) {
    return `${brand} is offering students a delicious pizza treat, perfect for study breaks or late-night cravings.`;
  }
  if (base.includes("coffee") || store.category === "Coffee") {
    return `Grab your caffeine boost from ${brand} with this special offer made just for students.`;
  }
  if (base.includes("bakery") || store.name === "BakeryBite") {
    return `Enjoy freshly baked pastries from ${brand} and make your mornings a little sweeter.`;
  }
  if (base.includes("chicken") || store.name === "ChickenMax") {
    return `Tasty chicken meals from ${brand} at an unbeatable student price, don’t miss this ${type} offer.`;
  }
  if (base.includes("bar") || store.category === "Bars") {
    return `Celebrate with friends at ${brand} and enjoy exclusive drink deals during your student nights.`;
  }
  return `${brand} brings you a special ${type}, ideal for students looking to save and enjoy.`;
}

// generate context-based terms
function generateTerms(title, channel) {
  const channelPart =
    channel === "online"
      ? "Apply this offer during checkout on the website."
      : "Show this offer and your student ID at the counter.";

  if (title.toLowerCase().includes("free")) {
    return `Enjoy your free item — no purchase necessary. ${channelPart}`;
  }
  if (title.toLowerCase().includes("discount")) {
    return `Discount applied automatically when redeeming. ${channelPart}`;
  }
  if (title.toLowerCase().includes("buy 1 get 1")) {
    return `Buy one and get one free of equal or lesser value. ${channelPart}`;
  }
  if (title.toLowerCase().includes("happy hour")) {
    return `Valid only during designated happy hour times. ${channelPart}`;
  }
  if (title.toLowerCase().includes("meal deal")) {
    return `Offer applies to selected student meal combos only. ${channelPart}`;
  }
  return `Limited time offer, while supplies last. ${channelPart}`;
}

// helper to create a single offer
function generateOffer(store) {
  const title = faker.helpers.arrayElement([
    "Free Pizza Slice",
    "Buy 1 Get 1 Coffee",
    "Free Pastry",
    "Discount on Chicken Meals",
    "2-for-1 Cocktails",
    "Student Meal Deal",
    "Half Price Latte",
    "Free Dessert",
    "Happy Hour Special",
    "Free Topping Upgrade",
  ]);

  const type = faker.helpers.arrayElement([
    "student-discount",
    "freebie",
    "general-sale",
  ]);
  const channel = faker.helpers.arrayElement(["online", "instore"]);
  const status = faker.helpers.arrayElement(["NEW_IN", "ENDING_SOON"]);

  return {
    title,
    category: store.category,
    description: generateDescription(title, store, type),
    terms: generateTerms(title, channel),
    brandTitle: store.name,
    brandLogoUrl: store.logo,
    imageUrl: store.image,
    type,
    channel,
    status,
  };
}

// offer generation logic
const offers = [];
const storeUsage = new Map(stores.map((s) => [s.name, 0]));

// ensure each store appears at least once
for (const store of stores) {
  offers.push(generateOffer(store));
  storeUsage.set(store.name, 1);
}

// randomly add more offers (up to 15 total, max 3 per store)
while (offers.length < 15) {
  const availableStores = stores.filter((s) => storeUsage.get(s.name) < 3);
  if (availableStores.length === 0) break;

  const store = faker.helpers.arrayElement(availableStores);
  offers.push(generateOffer(store));
  storeUsage.set(store.name, storeUsage.get(store.name) + 1);
}

// shuffle to randomize order
const shuffledOffers = faker.helpers.shuffle(offers);

// save to JSON file using Bun
const filePath = "./studentGifts.json";
await Bun.write(filePath, JSON.stringify(shuffledOffers, null, 2));

console.log(
  `✅ ${shuffledOffers.length} context-aware gifts generated and saved to ${filePath}`
);
