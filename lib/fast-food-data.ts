export interface FastFoodItem {
  restaurant: string
  item: string
  calories: number
  protein: number
  carbs: number
  fat: number
  isHealthy: boolean  // true = meets healthy criteria (high protein, lower cal)
}

// Healthy = ≥20g protein AND ≤600 cal AND ≤30g fat
export const FAST_FOOD_DB: FastFoodItem[] = [
  // ── McDONALD'S ──────────────────────────────────────────────────────────────
  { restaurant: "McDonald's", item: "McDouble", calories: 400, protein: 22, carbs: 33, fat: 20, isHealthy: false },
  { restaurant: "McDonald's", item: "Grilled Chicken Sandwich", calories: 380, protein: 28, carbs: 44, fat: 7, isHealthy: true },
  { restaurant: "McDonald's", item: "Side Salad (no dressing)", calories: 15, protein: 1, carbs: 3, fat: 0, isHealthy: true },
  { restaurant: "McDonald's", item: "Egg McMuffin", calories: 310, protein: 17, carbs: 30, fat: 13, isHealthy: false },
  { restaurant: "McDonald's", item: "Fruit & Maple Oatmeal", calories: 320, protein: 6, carbs: 64, fat: 4, isHealthy: false },
  { restaurant: "McDonald's", item: "McChicken", calories: 400, protein: 14, carbs: 41, fat: 20, isHealthy: false },
  { restaurant: "McDonald's", item: "Big Mac", calories: 550, protein: 25, carbs: 46, fat: 30, isHealthy: false },
  { restaurant: "McDonald's", item: "Quarter Pounder with Cheese", calories: 520, protein: 30, carbs: 41, fat: 26, isHealthy: false },

  // ── CHICK-FIL-A ─────────────────────────────────────────────────────────────
  { restaurant: "Chick-fil-A", item: "Grilled Chicken Sandwich", calories: 380, protein: 28, carbs: 44, fat: 7, isHealthy: true },
  { restaurant: "Chick-fil-A", item: "Grilled Nuggets (8 pc)", calories: 140, protein: 25, carbs: 3, fat: 3, isHealthy: true },
  { restaurant: "Chick-fil-A", item: "Grilled Chicken Cool Wrap", calories: 350, protein: 42, carbs: 29, fat: 13, isHealthy: true },
  { restaurant: "Chick-fil-A", item: "Spicy Grilled Chicken Sandwich", calories: 370, protein: 37, carbs: 31, fat: 6, isHealthy: true },
  { restaurant: "Chick-fil-A", item: "Chicken Sandwich (fried)", calories: 440, protein: 28, carbs: 40, fat: 19, isHealthy: false },
  { restaurant: "Chick-fil-A", item: "Waffle Potato Fries (sm)", calories: 360, protein: 5, carbs: 45, fat: 19, isHealthy: false },
  { restaurant: "Chick-fil-A", item: "Market Salad (grilled)", calories: 340, protein: 27, carbs: 35, fat: 12, isHealthy: true },

  // ── CHIPOTLE ─────────────────────────────────────────────────────────────────
  { restaurant: "Chipotle", item: "Chicken Bowl (no rice, extra veg)", calories: 390, protein: 40, carbs: 22, fat: 15, isHealthy: true },
  { restaurant: "Chipotle", item: "Steak Bowl (rice + beans + salsa)", calories: 660, protein: 38, carbs: 72, fat: 18, isHealthy: false },
  { restaurant: "Chipotle", item: "Chicken Salad Bowl", calories: 410, protein: 38, carbs: 28, fat: 15, isHealthy: true },
  { restaurant: "Chipotle", item: "Barbacoa Bowl", calories: 580, protein: 35, carbs: 65, fat: 17, isHealthy: false },
  { restaurant: "Chipotle", item: "Sofritas Bowl (vegan)", calories: 560, protein: 18, carbs: 73, fat: 21, isHealthy: false },
  { restaurant: "Chipotle", item: "Chicken Burrito", calories: 870, protein: 47, carbs: 98, fat: 29, isHealthy: false },

  // ── SUBWAY ───────────────────────────────────────────────────────────────────
  { restaurant: "Subway", item: "6\" Turkey Breast (wheat, no mayo)", calories: 280, protein: 18, carbs: 46, fat: 3, isHealthy: true },
  { restaurant: "Subway", item: "6\" Rotisserie Chicken (wheat)", calories: 350, protein: 28, carbs: 44, fat: 8, isHealthy: true },
  { restaurant: "Subway", item: "6\" Veggie Delite", calories: 200, protein: 8, carbs: 39, fat: 2, isHealthy: false },
  { restaurant: "Subway", item: "Grilled Chicken Salad", calories: 200, protein: 25, carbs: 14, fat: 5, isHealthy: true },
  { restaurant: "Subway", item: "6\" Meatball Marinara", calories: 480, protein: 23, carbs: 61, fat: 18, isHealthy: false },

  // ── PANERA BREAD ─────────────────────────────────────────────────────────────
  { restaurant: "Panera", item: "Strawberry Poppyseed Salad w/ Chicken", calories: 340, protein: 27, carbs: 42, fat: 8, isHealthy: true },
  { restaurant: "Panera", item: "Fuji Apple Chicken Salad", calories: 570, protein: 31, carbs: 51, fat: 27, isHealthy: false },
  { restaurant: "Panera", item: "Turkey Chili (1 cup)", calories: 230, protein: 21, carbs: 28, fat: 3, isHealthy: true },
  { restaurant: "Panera", item: "Chicken Noodle Soup (1 cup)", calories: 150, protein: 11, carbs: 18, fat: 4, isHealthy: true },
  { restaurant: "Panera", item: "Bacon Turkey Bravo Sandwich", calories: 680, protein: 44, carbs: 68, fat: 24, isHealthy: false },

  // ── STARBUCKS ────────────────────────────────────────────────────────────────
  { restaurant: "Starbucks", item: "Protein Box - Eggs & Cheese", calories: 470, protein: 25, carbs: 38, fat: 25, isHealthy: false },
  { restaurant: "Starbucks", item: "Sous Vide Egg Bites (2 pc)", calories: 170, protein: 13, carbs: 9, fat: 9, isHealthy: true },
  { restaurant: "Starbucks", item: "Chicken & Quinoa Protein Bowl", calories: 420, protein: 27, carbs: 52, fat: 11, isHealthy: true },
  { restaurant: "Starbucks", item: "Tall Latte (2% milk)", calories: 150, protein: 10, carbs: 15, fat: 6, isHealthy: true },

  // ── TACO BELL ────────────────────────────────────────────────────────────────
  { restaurant: "Taco Bell", item: "Fresco Grilled Steak Soft Taco", calories: 150, protein: 10, carbs: 18, fat: 4, isHealthy: true },
  { restaurant: "Taco Bell", item: "Power Bowl - Chicken (no sauce)", calories: 470, protein: 29, carbs: 49, fat: 17, isHealthy: false },
  { restaurant: "Taco Bell", item: "Bean Burrito", calories: 380, protein: 14, carbs: 57, fat: 11, isHealthy: false },
  { restaurant: "Taco Bell", item: "Crunchy Taco (chicken)", calories: 170, protein: 9, carbs: 13, fat: 9, isHealthy: false },

  // ── BURGER KING ──────────────────────────────────────────────────────────────
  { restaurant: "Burger King", item: "Whopper Jr (no mayo)", calories: 310, protein: 17, carbs: 31, fat: 14, isHealthy: false },
  { restaurant: "Burger King", item: "Garden Grilled Chicken Sandwich", calories: 400, protein: 27, carbs: 45, fat: 10, isHealthy: true },
  { restaurant: "Burger King", item: "Side Garden Salad (no dressing)", calories: 50, protein: 2, carbs: 7, fat: 2, isHealthy: true },

  // ── WENDY'S ──────────────────────────────────────────────────────────────────
  { restaurant: "Wendy's", item: "Grilled Chicken Sandwich", calories: 370, protein: 34, carbs: 36, fat: 8, isHealthy: true },
  { restaurant: "Wendy's", item: "Apple Pecan Salad (full, grilled)", calories: 520, protein: 34, carbs: 49, fat: 18, isHealthy: false },
  { restaurant: "Wendy's", item: "Small Chili", calories: 170, protein: 15, carbs: 18, fat: 5, isHealthy: true },
  { restaurant: "Wendy's", item: "Jr. Hamburger Patty (plain)", calories: 230, protein: 14, carbs: 26, fat: 8, isHealthy: false },

  // ── POPEYES ──────────────────────────────────────────────────────────────────
  { restaurant: "Popeyes", item: "Blackened Chicken Tenders (3 pc)", calories: 170, protein: 30, carbs: 3, fat: 4, isHealthy: true },
  { restaurant: "Popeyes", item: "Classic Chicken Sandwich (no mayo)", calories: 360, protein: 27, carbs: 34, fat: 11, isHealthy: true },
  { restaurant: "Popeyes", item: "Regular Chicken (spicy, leg)", calories: 290, protein: 22, carbs: 10, fat: 18, isHealthy: false },

  // ── KFC ──────────────────────────────────────────────────────────────────────
  { restaurant: "KFC", item: "Grilled Chicken Breast", calories: 180, protein: 37, carbs: 0, fat: 4, isHealthy: true },
  { restaurant: "KFC", item: "Kentucky Grilled Chicken Thigh", calories: 170, protein: 22, carbs: 0, fat: 9, isHealthy: true },
  { restaurant: "KFC", item: "Green Beans (side)", calories: 20, protein: 1, carbs: 4, fat: 0, isHealthy: true },
  { restaurant: "KFC", item: "Extra Crispy Chicken Breast", calories: 490, protein: 34, carbs: 20, fat: 30, isHealthy: false },

  // ── PANDA EXPRESS ────────────────────────────────────────────────────────────
  { restaurant: "Panda Express", item: "Grilled Teriyaki Chicken", calories: 275, protein: 36, carbs: 8, fat: 12, isHealthy: true },
  { restaurant: "Panda Express", item: "Broccoli Beef (side)", calories: 150, protein: 9, carbs: 13, fat: 7, isHealthy: true },
  { restaurant: "Panda Express", item: "String Bean Chicken Breast", calories: 190, protein: 14, carbs: 13, fat: 8, isHealthy: true },
  { restaurant: "Panda Express", item: "Orange Chicken", calories: 490, protein: 25, carbs: 51, fat: 21, isHealthy: false },

  // ── FIVE GUYS ────────────────────────────────────────────────────────────────
  { restaurant: "Five Guys", item: "Little Hamburger (no bun, lettuce wrap)", calories: 270, protein: 20, carbs: 2, fat: 20, isHealthy: false },
  { restaurant: "Five Guys", item: "Veggie Sandwich (no bun)", calories: 165, protein: 5, carbs: 14, fat: 11, isHealthy: false },

  // ── IN-N-OUT ─────────────────────────────────────────────────────────────────
  { restaurant: "In-N-Out", item: "Protein Style Burger (lettuce wrap)", calories: 240, protein: 16, carbs: 11, fat: 17, isHealthy: false },
  { restaurant: "In-N-Out", item: "Hamburger Patty (no bun)", calories: 140, protein: 13, carbs: 0, fat: 9, isHealthy: true },

  // ── SHAKE SHACK ──────────────────────────────────────────────────────────────
  { restaurant: "Shake Shack", item: "SmokeShack Burger", calories: 580, protein: 31, carbs: 40, fat: 33, isHealthy: false },
  { restaurant: "Shake Shack", item: "Chicken Shack (no sauce)", calories: 580, protein: 34, carbs: 47, fat: 27, isHealthy: false },

  // ── DOMINO'S ─────────────────────────────────────────────────────────────────
  { restaurant: "Domino's", item: "Thin Crust Chicken (2 slices)", calories: 320, protein: 22, carbs: 30, fat: 12, isHealthy: false },
  { restaurant: "Domino's", item: "Pacific Veggie Thin Crust (2 slices)", calories: 290, protein: 12, carbs: 31, fat: 14, isHealthy: false },

  // ── PIZZA HUT ────────────────────────────────────────────────────────────────
  { restaurant: "Pizza Hut", item: "Skinny Bee (2 slices, thin crust)", calories: 340, protein: 20, carbs: 38, fat: 12, isHealthy: false },
  { restaurant: "Pizza Hut", item: "Veggie Thin Crust (2 slices)", calories: 310, protein: 13, carbs: 38, fat: 12, isHealthy: false },

  // ── OLIVE GARDEN ─────────────────────────────────────────────────────────────
  { restaurant: "Olive Garden", item: "Herb-Grilled Salmon", calories: 530, protein: 50, carbs: 36, fat: 20, isHealthy: true },
  { restaurant: "Olive Garden", item: "Chicken Margherita", calories: 590, protein: 51, carbs: 32, fat: 28, isHealthy: false },
  { restaurant: "Olive Garden", item: "Minestrone Soup (1 cup)", calories: 110, protein: 5, carbs: 20, fat: 1, isHealthy: true },

  // ── APPLEBEE'S ───────────────────────────────────────────────────────────────
  { restaurant: "Applebee's", item: "Cedar Salmon with Maple Dijon", calories: 490, protein: 42, carbs: 24, fat: 24, isHealthy: true },
  { restaurant: "Applebee's", item: "Grilled Chicken Caesar Salad", calories: 540, protein: 42, carbs: 18, fat: 33, isHealthy: false },

  // ── JASON'S DELI ─────────────────────────────────────────────────────────────
  { restaurant: "Jason's Deli", item: "Turkey Breast (plain)", calories: 290, protein: 24, carbs: 32, fat: 7, isHealthy: true },
  { restaurant: "Jason's Deli", item: "Chicken Wrap (whole wheat)", calories: 450, protein: 32, carbs: 48, fat: 13, isHealthy: true },

  // ── SMOOTHIE KING ────────────────────────────────────────────────────────────
  { restaurant: "Smoothie King", item: "Lean1 Chocolate (20 oz)", calories: 290, protein: 26, carbs: 43, fat: 5, isHealthy: true },
  { restaurant: "Smoothie King", item: "Gladiator Strawberry (20 oz)", calories: 290, protein: 45, carbs: 17, fat: 5, isHealthy: true },

  // ── JERSEY MIKE'S ────────────────────────────────────────────────────────────
  { restaurant: "Jersey Mike's", item: "Turkey Breast on Whole Wheat (regular)", calories: 520, protein: 34, carbs: 62, fat: 14, isHealthy: false },
  { restaurant: "Jersey Mike's", item: "Tuna on Wheat (no mayo)", calories: 450, protein: 28, carbs: 58, fat: 12, isHealthy: false },

  // ── WINGSTOP ─────────────────────────────────────────────────────────────────
  { restaurant: "Wingstop", item: "Classic Wings (6 pc, naked)", calories: 240, protein: 32, carbs: 0, fat: 12, isHealthy: true },
  { restaurant: "Wingstop", item: "Thighs (3 pc, plain)", calories: 380, protein: 30, carbs: 3, fat: 27, isHealthy: false },

  // ── SWEETGREEN ───────────────────────────────────────────────────────────────
  { restaurant: "Sweetgreen", item: "Harvest Bowl", calories: 605, protein: 31, carbs: 64, fat: 25, isHealthy: false },
  { restaurant: "Sweetgreen", item: "Chicken + Brussels Bowl", calories: 470, protein: 36, carbs: 37, fat: 19, isHealthy: true },
  { restaurant: "Sweetgreen", item: "Shroomami Bowl", calories: 510, protein: 22, carbs: 62, fat: 21, isHealthy: false },

  // ── HABIT BURGER ─────────────────────────────────────────────────────────────
  { restaurant: "Habit Burger", item: "Ahi Tuna Salad (no dressing)", calories: 330, protein: 27, carbs: 29, fat: 10, isHealthy: true },
  { restaurant: "Habit Burger", item: "Charburger (no sauce)", calories: 490, protein: 29, carbs: 38, fat: 24, isHealthy: false },
]

export const RESTAURANTS = [...new Set(FAST_FOOD_DB.map(i => i.restaurant))].sort()

export function searchFastFood(query: string, healthyOnly = false): FastFoodItem[] {
  const q = query.toLowerCase()
  return FAST_FOOD_DB.filter(item => {
    const match =
      item.restaurant.toLowerCase().includes(q) ||
      item.item.toLowerCase().includes(q)
    return match && (!healthyOnly || item.isHealthy)
  }).slice(0, 20)
}

export function getByRestaurant(restaurant: string, healthyOnly = false): FastFoodItem[] {
  return FAST_FOOD_DB.filter(
    item => item.restaurant === restaurant && (!healthyOnly || item.isHealthy)
  )
}
