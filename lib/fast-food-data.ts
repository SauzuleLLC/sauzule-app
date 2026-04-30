// lib/fast-food-data.ts
// Top 40 Fast Food Chains — Nutrition Database
// Data sourced from official restaurant nutrition pages (2024-2025)

export interface FastFoodItem {
  restaurant: string
  item: string
  calories: number
  protein: number  // g
  carbs: number    // g
  fat: number      // g
  sodium: number   // mg
  fiber: number    // g
  sugar: number    // g
  isHealthy: boolean
  category: string // 'burger'|'sandwich'|'bowl'|'salad'|'wrap'|'tacos'|'pizza'|'chicken'|'seafood'|'breakfast'|'sides'|'pasta'|'drink'
  goalFit: string[] // ['FAT_LOSS','MUSCLE_GAIN','RECOMPOSITION','MAINTENANCE','ATHLETIC_PERFORMANCE']
}

function h(item: Omit<FastFoodItem, 'isHealthy'>): FastFoodItem {
  return {
    ...item,
    isHealthy: item.protein >= 20 && item.calories <= 600 && item.fat <= 30 && item.sodium <= 1200,
  }
}

export const FAST_FOOD_DATA: FastFoodItem[] = [

  // ── McDONALD'S ──
  h({ restaurant: "McDonald's", item: "Egg McMuffin", calories: 310, protein: 17, carbs: 30, fat: 13, sodium: 770, fiber: 2, sugar: 3, category: 'breakfast', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "McDonald's", item: "McDouble", calories: 400, protein: 22, carbs: 33, fat: 20, sodium: 840, fiber: 2, sugar: 7, category: 'burger', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "McDonald's", item: "Grilled Chicken Sandwich", calories: 380, protein: 37, carbs: 44, fat: 6, sodium: 820, fiber: 3, sugar: 11, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "McDonald's", item: "Big Mac", calories: 550, protein: 25, carbs: 46, fat: 30, sodium: 1010, fiber: 3, sugar: 9, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "McDonald's", item: "Quarter Pounder with Cheese", calories: 530, protein: 30, carbs: 42, fat: 27, sodium: 1090, fiber: 2, sugar: 10, category: 'burger', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "McDonald's", item: "Side Salad (no dressing)", calories: 20, protein: 1, carbs: 4, fat: 0, sodium: 15, fiber: 1, sugar: 2, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),

  // ── CHICK-FIL-A ──
  h({ restaurant: "Chick-fil-A", item: "Grilled Nuggets (8 pc)", calories: 130, protein: 25, carbs: 2, fat: 3, sodium: 440, fiber: 0, sugar: 1, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "Chick-fil-A", item: "Grilled Chicken Sandwich", calories: 320, protein: 29, carbs: 41, fat: 6, sodium: 800, fiber: 3, sugar: 8, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Chick-fil-A", item: "Egg White Grill", calories: 300, protein: 26, carbs: 30, fat: 7, sodium: 970, fiber: 1, sugar: 5, category: 'breakfast', goalFit: ['FAT_LOSS', 'RECOMPOSITION', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Chick-fil-A", item: "Grilled Market Salad (no dressing)", calories: 200, protein: 27, carbs: 17, fat: 6, sodium: 580, fiber: 4, sugar: 11, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Chick-fil-A", item: "Spicy Deluxe Sandwich", calories: 550, protein: 37, carbs: 48, fat: 26, sodium: 1390, fiber: 2, sugar: 6, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Chick-fil-A", item: "Cobb Salad (Grilled, no dressing)", calories: 420, protein: 40, carbs: 16, fat: 22, sodium: 1280, fiber: 5, sugar: 7, category: 'salad', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),

  // ── CHIPOTLE ──
  h({ restaurant: "Chipotle", item: "Chicken Salad Bowl (romaine, no dressing)", calories: 275, protein: 28, carbs: 14, fat: 10, sodium: 750, fiber: 6, sugar: 2, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Chipotle", item: "Chicken Burrito Bowl (no rice)", calories: 395, protein: 33, carbs: 26, fat: 17, sodium: 910, fiber: 9, sugar: 3, category: 'bowl', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Chipotle", item: "Steak Burrito Bowl", calories: 490, protein: 36, carbs: 49, fat: 17, sodium: 980, fiber: 10, sugar: 3, category: 'bowl', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Chipotle", item: "Barbacoa Tacos (soft, 3)", calories: 480, protein: 42, carbs: 45, fat: 16, sodium: 1080, fiber: 9, sugar: 3, category: 'tacos', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Chipotle", item: "Veggie Burrito Bowl", calories: 370, protein: 14, carbs: 53, fat: 12, sodium: 840, fiber: 14, sugar: 4, category: 'bowl', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),
  h({ restaurant: "Chipotle", item: "Sofritas Bowl (plant-based)", calories: 380, protein: 15, carbs: 48, fat: 15, sodium: 900, fiber: 12, sugar: 5, category: 'bowl', goalFit: ['MAINTENANCE'] }),

  // ── SUBWAY ──
  h({ restaurant: "Subway", item: "Rotisserie-Style Chicken (6\")", calories: 350, protein: 28, carbs: 41, fat: 9, sodium: 760, fiber: 3, sugar: 6, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Subway", item: "Turkey Breast & Ham (6\")", calories: 280, protein: 18, carbs: 39, fat: 4, sodium: 790, fiber: 2, sugar: 5, category: 'sandwich', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Subway", item: "Steak & Cheese (6\")", calories: 380, protein: 26, carbs: 42, fat: 12, sodium: 920, fiber: 3, sugar: 7, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Subway", item: "Veggie Delite (6\")", calories: 200, protein: 8, carbs: 39, fat: 2, sodium: 310, fiber: 3, sugar: 5, category: 'sandwich', goalFit: ['FAT_LOSS', 'MAINTENANCE'] }),
  h({ restaurant: "Subway", item: "Chicken Caesar Salad (no dressing)", calories: 170, protein: 21, carbs: 11, fat: 4, sodium: 600, fiber: 3, sugar: 3, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Subway", item: "Tuna (6\")", calories: 380, protein: 17, carbs: 40, fat: 16, sodium: 560, fiber: 2, sugar: 6, category: 'sandwich', goalFit: ['MAINTENANCE'] }),

  // ── TACO BELL ──
  h({ restaurant: "Taco Bell", item: "Grilled Chicken Soft Taco", calories: 200, protein: 17, carbs: 21, fat: 6, sodium: 530, fiber: 2, sugar: 2, category: 'tacos', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Taco Bell", item: "Power Menu Bowl - Chicken", calories: 470, protein: 26, carbs: 50, fat: 19, sodium: 1200, fiber: 8, sugar: 4, category: 'bowl', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Taco Bell", item: "Cantina Chicken Bowl", calories: 490, protein: 28, carbs: 55, fat: 16, sodium: 1290, fiber: 9, sugar: 3, category: 'bowl', goalFit: ['MAINTENANCE', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Taco Bell", item: "Chicken Quesadilla", calories: 510, protein: 28, carbs: 38, fat: 26, sodium: 1050, fiber: 2, sugar: 3, category: 'wrap', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Taco Bell", item: "Fiesta Veggie Burrito", calories: 390, protein: 13, carbs: 58, fat: 11, sodium: 910, fiber: 7, sugar: 4, category: 'wrap', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),
  h({ restaurant: "Taco Bell", item: "Black Bean Crunchwrap Supreme", calories: 440, protein: 11, carbs: 65, fat: 14, sodium: 1050, fiber: 8, sugar: 5, category: 'wrap', goalFit: ['MAINTENANCE'] }),

  // ── BURGER KING ──
  h({ restaurant: "Burger King", item: "Grilled Chicken Sandwich", calories: 430, protein: 37, carbs: 44, fat: 11, sodium: 900, fiber: 2, sugar: 8, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Burger King", item: "Whopper", calories: 660, protein: 28, carbs: 49, fat: 40, sodium: 980, fiber: 2, sugar: 11, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Burger King", item: "Garden Chicken Salad (no dressing)", calories: 340, protein: 33, carbs: 15, fat: 17, sodium: 650, fiber: 3, sugar: 6, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Burger King", item: "Impossible Whopper", calories: 630, protein: 25, carbs: 58, fat: 34, sodium: 1080, fiber: 4, sugar: 12, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Burger King", item: "Egg-Normous Burrito", calories: 680, protein: 34, carbs: 55, fat: 36, sodium: 1540, fiber: 4, sugar: 3, category: 'breakfast', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── WENDY'S ──
  h({ restaurant: "Wendy's", item: "Grilled Chicken Sandwich", calories: 370, protein: 34, carbs: 36, fat: 8, sodium: 830, fiber: 2, sugar: 7, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Wendy's", item: "Apple Pecan Salad (half, grilled, no dressing)", calories: 340, protein: 30, carbs: 30, fat: 9, sodium: 870, fiber: 5, sugar: 22, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Wendy's", item: "Chili (large)", calories: 300, protein: 25, carbs: 31, fat: 8, sodium: 1160, fiber: 8, sugar: 9, category: 'sides', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Wendy's", item: "Dave's Single", calories: 590, protein: 30, carbs: 41, fat: 34, sodium: 1080, fiber: 2, sugar: 9, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Wendy's", item: "Baconator", calories: 950, protein: 57, carbs: 40, fat: 61, sodium: 1830, fiber: 2, sugar: 9, category: 'burger', goalFit: ['ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Wendy's", item: "Taco Salad (no shell, no dressing)", calories: 430, protein: 28, carbs: 36, fat: 20, sodium: 1150, fiber: 8, sugar: 7, category: 'salad', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),

  // ── STARBUCKS ──
  h({ restaurant: "Starbucks", item: "Egg White & Roasted Red Pepper Sous Vide Bites", calories: 170, protein: 13, carbs: 12, fat: 7, sodium: 370, fiber: 0, sugar: 1, category: 'breakfast', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Starbucks", item: "Spinach Feta & Egg White Wrap", calories: 290, protein: 19, carbs: 33, fat: 10, sodium: 830, fiber: 3, sugar: 4, category: 'wrap', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Starbucks", item: "Chicken & Quinoa Protein Bowl", calories: 420, protein: 27, carbs: 50, fat: 11, sodium: 880, fiber: 6, sugar: 12, category: 'bowl', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Starbucks", item: "Lentils & Veggies Protein Box", calories: 460, protein: 22, carbs: 60, fat: 14, sodium: 580, fiber: 11, sugar: 18, category: 'bowl', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),
  h({ restaurant: "Starbucks", item: "Double-Smoked Bacon, Cheddar & Egg Sandwich", calories: 500, protein: 25, carbs: 42, fat: 25, sodium: 1060, fiber: 1, sugar: 5, category: 'breakfast', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),

  // ── DUNKIN' ──
  h({ restaurant: "Dunkin'", item: "Egg & Cheese Wake-Up Wrap", calories: 180, protein: 9, carbs: 17, fat: 9, sodium: 470, fiber: 1, sugar: 1, category: 'breakfast', goalFit: ['FAT_LOSS'] }),
  h({ restaurant: "Dunkin'", item: "Turkey Sausage Flatbread", calories: 280, protein: 14, carbs: 37, fat: 8, sodium: 670, fiber: 2, sugar: 5, category: 'breakfast', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Dunkin'", item: "Veggie Egg White Omelet (English Muffin)", calories: 330, protein: 20, carbs: 44, fat: 8, sodium: 770, fiber: 3, sugar: 4, category: 'breakfast', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Dunkin'", item: "Bacon, Egg & Cheese on Bagel", calories: 560, protein: 24, carbs: 69, fat: 20, sodium: 1110, fiber: 2, sugar: 6, category: 'breakfast', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),

  // ── KFC ──
  h({ restaurant: "KFC", item: "Grilled Chicken Breast", calories: 220, protein: 38, carbs: 0, fat: 7, sodium: 710, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "KFC", item: "Grilled Chicken Thigh", calories: 190, protein: 21, carbs: 0, fat: 11, sodium: 600, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "KFC", item: "Original Recipe Breast", calories: 390, protein: 39, carbs: 11, fat: 21, sodium: 1080, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "KFC", item: "Chicken Littles (Classic)", calories: 310, protein: 13, carbs: 29, fat: 16, sodium: 640, fiber: 1, sugar: 4, category: 'sandwich', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "KFC", item: "House Side Salad (no dressing)", calories: 15, protein: 1, carbs: 2, fat: 0, sodium: 10, fiber: 1, sugar: 1, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),

  // ── POPEYES ──
  h({ restaurant: "Popeyes", item: "Blackened Chicken Tenders (3 pc)", calories: 170, protein: 27, carbs: 1, fat: 6, sodium: 690, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Popeyes", item: "Mild Chicken Breast (1 pc)", calories: 440, protein: 43, carbs: 23, fat: 18, sodium: 1330, fiber: 1, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Popeyes", item: "Classic Chicken Sandwich", calories: 700, protein: 28, carbs: 70, fat: 42, sodium: 1443, fiber: 3, sugar: 8, category: 'sandwich', goalFit: ['ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Popeyes", item: "Red Beans & Rice (regular)", calories: 230, protein: 8, carbs: 30, fat: 9, sodium: 870, fiber: 4, sugar: 1, category: 'sides', goalFit: ['MAINTENANCE'] }),

  // ── PANDA EXPRESS ──
  h({ restaurant: "Panda Express", item: "Grilled Teriyaki Chicken", calories: 300, protein: 36, carbs: 13, fat: 13, sodium: 530, fiber: 0, sugar: 10, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Panda Express", item: "String Bean Chicken Breast", calories: 190, protein: 14, carbs: 15, fat: 9, sodium: 520, fiber: 3, sugar: 3, category: 'chicken', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Panda Express", item: "Super Greens", calories: 90, protein: 6, carbs: 11, fat: 3, sodium: 400, fiber: 5, sugar: 5, category: 'sides', goalFit: ['FAT_LOSS', 'RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "Panda Express", item: "Broccoli Beef", calories: 150, protein: 9, carbs: 13, fat: 7, sodium: 710, fiber: 2, sugar: 5, category: 'sides', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Panda Express", item: "Orange Chicken", calories: 490, protein: 23, carbs: 51, fat: 22, sodium: 820, fiber: 1, sugar: 20, category: 'chicken', goalFit: ['ATHLETIC_PERFORMANCE', 'MAINTENANCE'] }),
  h({ restaurant: "Panda Express", item: "Kung Pao Chicken", calories: 290, protein: 19, carbs: 19, fat: 17, sodium: 860, fiber: 2, sugar: 6, category: 'chicken', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),

  // ── FIVE GUYS ──
  h({ restaurant: "Five Guys", item: "Little Hamburger", calories: 480, protein: 23, carbs: 40, fat: 26, sodium: 580, fiber: 2, sugar: 9, category: 'burger', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Five Guys", item: "Hamburger", calories: 700, protein: 34, carbs: 42, fat: 42, sodium: 790, fiber: 2, sugar: 9, category: 'burger', goalFit: ['ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Five Guys", item: "Veggie Sandwich (lettuce wrap)", calories: 200, protein: 8, carbs: 29, fat: 7, sodium: 520, fiber: 4, sugar: 8, category: 'sandwich', goalFit: ['FAT_LOSS', 'MAINTENANCE'] }),
  h({ restaurant: "Five Guys", item: "Little Cheeseburger", calories: 550, protein: 26, carbs: 40, fat: 32, sodium: 740, fiber: 2, sugar: 9, category: 'burger', goalFit: ['MAINTENANCE'] }),

  // ── IN-N-OUT BURGER ──
  h({ restaurant: "In-N-Out Burger", item: "Hamburger (Protein Style, no bun)", calories: 240, protein: 13, carbs: 11, fat: 17, sodium: 370, fiber: 3, sugar: 7, category: 'burger', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "In-N-Out Burger", item: "Double-Double (Protein Style)", calories: 520, protein: 33, carbs: 11, fat: 39, sodium: 1000, fiber: 3, sugar: 7, category: 'burger', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "In-N-Out Burger", item: "Cheeseburger (Protein Style)", calories: 330, protein: 18, carbs: 11, fat: 25, sodium: 720, fiber: 3, sugar: 7, category: 'burger', goalFit: ['RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "In-N-Out Burger", item: "Double-Double (with bun)", calories: 670, protein: 37, carbs: 41, fat: 41, sodium: 1440, fiber: 3, sugar: 10, category: 'burger', goalFit: ['ATHLETIC_PERFORMANCE', 'MUSCLE_GAIN'] }),

  // ── SHAKE SHACK ──
  h({ restaurant: "Shake Shack", item: "Grilled Chicken Sandwich", calories: 480, protein: 40, carbs: 40, fat: 14, sodium: 1140, fiber: 2, sugar: 6, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Shake Shack", item: "ShackBurger", calories: 500, protein: 26, carbs: 40, fat: 26, sodium: 860, fiber: 2, sugar: 8, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Shake Shack", item: "Chick'n Shack", calories: 570, protein: 34, carbs: 50, fat: 26, sodium: 1290, fiber: 2, sugar: 6, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Shake Shack", item: "'Shroom Burger", calories: 490, protein: 21, carbs: 38, fat: 32, sodium: 890, fiber: 3, sugar: 7, category: 'burger', goalFit: ['MAINTENANCE'] }),

  // ── PANERA BREAD ──
  h({ restaurant: "Panera Bread", item: "Turkey Chili (bowl)", calories: 270, protein: 20, carbs: 30, fat: 7, sodium: 960, fiber: 8, sugar: 5, category: 'sides', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Panera Bread", item: "Green Goddess Cobb Salad with Chicken", calories: 540, protein: 45, carbs: 22, fat: 31, sodium: 1250, fiber: 9, sugar: 9, category: 'salad', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Panera Bread", item: "Fuji Apple Chicken Salad (full)", calories: 540, protein: 37, carbs: 52, fat: 22, sodium: 1090, fiber: 8, sugar: 33, category: 'salad', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Panera Bread", item: "Chicken Noodle Soup (bowl)", calories: 160, protein: 12, carbs: 17, fat: 4, sodium: 910, fiber: 2, sugar: 2, category: 'sides', goalFit: ['FAT_LOSS', 'MAINTENANCE'] }),
  h({ restaurant: "Panera Bread", item: "Steel Cut Oatmeal with Almonds & Honey", calories: 370, protein: 10, carbs: 55, fat: 10, sodium: 130, fiber: 7, sugar: 13, category: 'breakfast', goalFit: ['FAT_LOSS', 'MAINTENANCE'] }),
  h({ restaurant: "Panera Bread", item: "Turkey & Avocado BLT (whole)", calories: 670, protein: 36, carbs: 73, fat: 28, sodium: 1490, fiber: 9, sugar: 9, category: 'sandwich', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── JERSEY MIKE'S ──
  h({ restaurant: "Jersey Mike's", item: "Club Sub Mini (on wheat)", calories: 385, protein: 22, carbs: 40, fat: 14, sodium: 1050, fiber: 2, sugar: 7, category: 'sandwich', goalFit: ['RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "Jersey Mike's", item: "Turkey Breast & Provolone (regular, wheat)", calories: 550, protein: 35, carbs: 64, fat: 16, sodium: 1480, fiber: 3, sugar: 10, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Jersey Mike's", item: "Roast Beef & Provolone (regular, wheat)", calories: 600, protein: 38, carbs: 62, fat: 22, sodium: 1300, fiber: 3, sugar: 9, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Jersey Mike's", item: "Chicken Philly (regular)", calories: 640, protein: 40, carbs: 67, fat: 22, sodium: 1850, fiber: 3, sugar: 12, category: 'sandwich', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── JIMMY JOHN'S ──
  h({ restaurant: "Jimmy John's", item: "Country Club Unwich (lettuce wrap)", calories: 280, protein: 16, carbs: 5, fat: 22, sodium: 940, fiber: 1, sugar: 3, category: 'sandwich', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Jimmy John's", item: "Hunter's Club Unwich", calories: 360, protein: 24, carbs: 4, fat: 28, sodium: 1140, fiber: 1, sugar: 2, category: 'sandwich', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Jimmy John's", item: "Turkey Tom (8\" French)", calories: 530, protein: 29, carbs: 64, fat: 18, sodium: 1230, fiber: 3, sugar: 8, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Jimmy John's", item: "Big John (8\" French)", calories: 560, protein: 30, carbs: 62, fat: 20, sodium: 1100, fiber: 3, sugar: 7, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),

  // ── WINGSTOP ──
  h({ restaurant: "Wingstop", item: "Classic Wings Plain (6 pc)", calories: 360, protein: 32, carbs: 0, fat: 26, sodium: 590, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Wingstop", item: "Classic Wings Lemon Pepper (6 pc)", calories: 460, protein: 40, carbs: 2, fat: 32, sodium: 1040, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Wingstop", item: "Boneless Wings Buffalo (8 pc)", calories: 570, protein: 38, carbs: 44, fat: 22, sodium: 1640, fiber: 1, sugar: 2, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Wingstop", item: "Chicken Sandwich (Classic)", calories: 650, protein: 33, carbs: 62, fat: 29, sodium: 1830, fiber: 3, sugar: 7, category: 'sandwich', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── BUFFALO WILD WINGS ──
  h({ restaurant: "Buffalo Wild Wings", item: "Naked Tenders (3 pc, no sauce)", calories: 210, protein: 32, carbs: 0, fat: 9, sodium: 960, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Buffalo Wild Wings", item: "Traditional Wings (6 pc, no sauce)", calories: 430, protein: 38, carbs: 0, fat: 30, sodium: 430, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Buffalo Wild Wings", item: "Grilled Chicken Sandwich", calories: 400, protein: 37, carbs: 41, fat: 8, sodium: 870, fiber: 2, sugar: 8, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Buffalo Wild Wings", item: "Garden Grilled Chicken Salad (no dressing)", calories: 330, protein: 35, carbs: 17, fat: 12, sodium: 870, fiber: 5, sugar: 9, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),

  // ── ARBY'S ──
  h({ restaurant: "Arby's", item: "Classic Roast Beef", calories: 360, protein: 23, carbs: 37, fat: 14, sodium: 970, fiber: 1, sugar: 5, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Arby's", item: "Roast Turkey Farm Fresh Salad (no dressing)", calories: 230, protein: 26, carbs: 17, fat: 7, sodium: 820, fiber: 4, sugar: 10, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Arby's", item: "Beef & Cheddar Classic", calories: 450, protein: 26, carbs: 40, fat: 20, sodium: 1310, fiber: 1, sugar: 9, category: 'sandwich', goalFit: ['MAINTENANCE', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Arby's", item: "Roast Chicken Wrap", calories: 580, protein: 36, carbs: 51, fat: 24, sodium: 1390, fiber: 3, sugar: 4, category: 'wrap', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),

  // ── JACK IN THE BOX ──
  h({ restaurant: "Jack in the Box", item: "Grilled Chicken Salad (no dressing)", calories: 310, protein: 33, carbs: 19, fat: 10, sodium: 660, fiber: 3, sugar: 6, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Jack in the Box", item: "Chicken Fajita Pita", calories: 340, protein: 22, carbs: 33, fat: 12, sodium: 800, fiber: 2, sugar: 5, category: 'wrap', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Jack in the Box", item: "Breakfast Jack (Egg & Cheese)", calories: 290, protein: 16, carbs: 29, fat: 12, sodium: 760, fiber: 1, sugar: 5, category: 'breakfast', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Jack in the Box", item: "Sirloin Swiss & Grilled Onion Burger", calories: 620, protein: 35, carbs: 45, fat: 31, sodium: 1180, fiber: 2, sugar: 9, category: 'burger', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),

  // ── SONIC DRIVE-IN ──
  h({ restaurant: "Sonic Drive-In", item: "Grilled Chicken Sandwich", calories: 350, protein: 30, carbs: 38, fat: 7, sodium: 870, fiber: 2, sugar: 8, category: 'sandwich', goalFit: ['FAT_LOSS', 'RECOMPOSITION', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Sonic Drive-In", item: "Chicken Slinger", calories: 390, protein: 24, carbs: 38, fat: 16, sodium: 900, fiber: 2, sugar: 7, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Sonic Drive-In", item: "Jr. Deluxe Burger", calories: 420, protein: 18, carbs: 40, fat: 22, sodium: 730, fiber: 2, sugar: 7, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Sonic Drive-In", item: "Breakfast Burrito Jr.", calories: 320, protein: 14, carbs: 29, fat: 16, sodium: 730, fiber: 1, sugar: 2, category: 'breakfast', goalFit: ['MAINTENANCE'] }),

  // ── WHATABURGER ──
  h({ restaurant: "Whataburger", item: "Grilled Chicken Sandwich", calories: 430, protein: 35, carbs: 44, fat: 11, sodium: 990, fiber: 2, sugar: 9, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Whataburger", item: "Apple & Cranberry Salad (grilled, no dressing)", calories: 300, protein: 28, carbs: 29, fat: 8, sodium: 700, fiber: 4, sugar: 21, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Whataburger", item: "Whataburger", calories: 590, protein: 26, carbs: 60, fat: 26, sodium: 1100, fiber: 3, sugar: 10, category: 'burger', goalFit: ['MAINTENANCE', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Whataburger", item: "Egg Sandwich", calories: 290, protein: 13, carbs: 36, fat: 10, sodium: 640, fiber: 2, sugar: 4, category: 'breakfast', goalFit: ['MAINTENANCE'] }),

  // ── RAISING CANE'S ──
  h({ restaurant: "Raising Cane's", item: "Chicken Finger (1 pc)", calories: 130, protein: 10, carbs: 9, fat: 5, sodium: 250, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Raising Cane's", item: "3 Finger Combo (no fries, no toast)", calories: 390, protein: 30, carbs: 27, fat: 15, sodium: 750, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Raising Cane's", item: "Box Combo (4 fingers, no fries/toast)", calories: 520, protein: 40, carbs: 36, fat: 20, sodium: 1000, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Raising Cane's", item: "Chicken Sandwich", calories: 630, protein: 37, carbs: 59, fat: 26, sodium: 1520, fiber: 2, sugar: 7, category: 'sandwich', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── EL POLLO LOCO ──
  h({ restaurant: "El Pollo Loco", item: "Skinless Chicken Breast (1 pc)", calories: 180, protein: 35, carbs: 1, fat: 4, sodium: 470, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "El Pollo Loco", item: "Double Chicken Avocado Bowl", calories: 460, protein: 43, carbs: 41, fat: 14, sodium: 1110, fiber: 9, sugar: 4, category: 'bowl', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION', 'FAT_LOSS'] }),
  h({ restaurant: "El Pollo Loco", item: "Original Pollo Bowl", calories: 530, protein: 37, carbs: 65, fat: 12, sodium: 1290, fiber: 7, sugar: 3, category: 'bowl', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "El Pollo Loco", item: "Tostada Salad (no tortilla, no dressing)", calories: 320, protein: 28, carbs: 26, fat: 11, sodium: 900, fiber: 7, sugar: 4, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),

  // ── CULVER'S ──
  h({ restaurant: "Culver's", item: "Grilled Chicken Sandwich", calories: 370, protein: 35, carbs: 34, fat: 7, sodium: 790, fiber: 2, sugar: 7, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Culver's", item: "ButterBurger Single", calories: 390, protein: 21, carbs: 34, fat: 18, sodium: 590, fiber: 1, sugar: 6, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Culver's", item: "North Atlantic Cod (2 pc, no bun)", calories: 330, protein: 30, carbs: 16, fat: 15, sodium: 730, fiber: 0, sugar: 0, category: 'seafood', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Culver's", item: "Cod Fillet Sandwich", calories: 510, protein: 22, carbs: 59, fat: 19, sodium: 890, fiber: 3, sugar: 5, category: 'seafood', goalFit: ['MAINTENANCE'] }),

  // ── HARDEE'S / CARL'S JR. ──
  h({ restaurant: "Hardee's / Carl's Jr.", item: "Low Carb Charbroiled Chicken", calories: 260, protein: 30, carbs: 5, fat: 14, sodium: 690, fiber: 1, sugar: 3, category: 'chicken', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Hardee's / Carl's Jr.", item: "Grilled Chicken Sandwich", calories: 380, protein: 29, carbs: 38, fat: 9, sodium: 930, fiber: 2, sugar: 8, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Hardee's / Carl's Jr.", item: "Low Carb Six Dollar Burger", calories: 490, protein: 36, carbs: 10, fat: 34, sodium: 1150, fiber: 2, sugar: 5, category: 'burger', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Hardee's / Carl's Jr.", item: "1/3 lb Famous Star Burger", calories: 640, protein: 27, carbs: 44, fat: 37, sodium: 1020, fiber: 2, sugar: 8, category: 'burger', goalFit: ['MAINTENANCE'] }),

  // ── WHITE CASTLE ──
  h({ restaurant: "White Castle", item: "Chicken Slider (original)", calories: 170, protein: 8, carbs: 20, fat: 6, sodium: 360, fiber: 1, sugar: 3, category: 'sandwich', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "White Castle", item: "Hamburger Slider (original)", calories: 140, protein: 6, carbs: 15, fat: 6, sodium: 290, fiber: 1, sugar: 2, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "White Castle", item: "Impossible Slider", calories: 200, protein: 11, carbs: 19, fat: 9, sodium: 380, fiber: 1, sugar: 3, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "White Castle", item: "Breakfast Slider (egg & cheese)", calories: 200, protein: 10, carbs: 18, fat: 9, sodium: 430, fiber: 1, sugar: 3, category: 'breakfast', goalFit: ['MAINTENANCE'] }),

  // ── QDOBA ──
  h({ restaurant: "Qdoba", item: "Grilled Chicken Bowl (no rice, no beans)", calories: 330, protein: 33, carbs: 18, fat: 13, sodium: 860, fiber: 5, sugar: 3, category: 'bowl', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Qdoba", item: "Chicken Protein Bowl (no cheese)", calories: 420, protein: 38, carbs: 45, fat: 11, sodium: 1020, fiber: 12, sugar: 4, category: 'bowl', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Qdoba", item: "Steak Burrito", calories: 630, protein: 38, carbs: 74, fat: 18, sodium: 1380, fiber: 10, sugar: 5, category: 'wrap', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Qdoba", item: "3 Cheese Nachos with Chicken", calories: 770, protein: 38, carbs: 73, fat: 38, sodium: 1720, fiber: 10, sugar: 5, category: 'sides', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── MOE'S SOUTHWEST GRILL ──
  h({ restaurant: "Moe's Southwest Grill", item: "Homewrecker Bowl (chicken, no rice)", calories: 380, protein: 34, carbs: 32, fat: 12, sodium: 1100, fiber: 9, sugar: 4, category: 'bowl', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Moe's Southwest Grill", item: "Stack Burrito (chicken)", calories: 580, protein: 36, carbs: 70, fat: 16, sodium: 1420, fiber: 8, sugar: 5, category: 'wrap', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Moe's Southwest Grill", item: "Art Vandalay Burrito (steak)", calories: 620, protein: 38, carbs: 72, fat: 18, sodium: 1380, fiber: 9, sugar: 5, category: 'wrap', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),

  // ── DEL TACO ──
  h({ restaurant: "Del Taco", item: "Grilled Chicken Taco (1 pc)", calories: 160, protein: 14, carbs: 18, fat: 5, sodium: 400, fiber: 1, sugar: 2, category: 'tacos', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Del Taco", item: "Chicken Avocado Burrito", calories: 540, protein: 31, carbs: 60, fat: 19, sodium: 1150, fiber: 7, sugar: 4, category: 'wrap', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Del Taco", item: "Veggie Works Burrito", calories: 490, protein: 17, carbs: 71, fat: 14, sodium: 1060, fiber: 11, sugar: 5, category: 'wrap', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Del Taco", item: "Beyond Avocado Taco", calories: 220, protein: 10, carbs: 22, fat: 11, sodium: 500, fiber: 4, sugar: 3, category: 'tacos', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),

  // ── ZAXBY'S ──
  h({ restaurant: "Zaxby's", item: "Grilled Chicken Sandwich", calories: 380, protein: 38, carbs: 37, fat: 7, sodium: 870, fiber: 2, sugar: 6, category: 'sandwich', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Zaxby's", item: "Chicken Fingerz (5 pc, no sauce)", calories: 410, protein: 36, carbs: 27, fat: 16, sodium: 1000, fiber: 1, sugar: 1, category: 'chicken', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Zaxby's", item: "Zalad - Chicken Fingerz (no dressing)", calories: 440, protein: 42, carbs: 32, fat: 16, sodium: 1100, fiber: 4, sugar: 8, category: 'salad', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Zaxby's", item: "Wings & Things Meal (6 wings, no sides)", calories: 480, protein: 42, carbs: 4, fat: 34, sodium: 1300, fiber: 0, sugar: 0, category: 'chicken', goalFit: ['MUSCLE_GAIN'] }),

  // ── PIZZA HUT ──
  h({ restaurant: "Pizza Hut", item: "Veggie Lovers (2 slices, 12\" thin crust)", calories: 380, protein: 14, carbs: 50, fat: 14, sodium: 880, fiber: 4, sugar: 5, category: 'pizza', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Pizza Hut", item: "BBQ Chicken (2 slices, 12\" thin crust)", calories: 440, protein: 22, carbs: 58, fat: 12, sodium: 1000, fiber: 2, sugar: 12, category: 'pizza', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),
  h({ restaurant: "Pizza Hut", item: "Skinny Chicken (2 slices, 12\" thin)", calories: 360, protein: 22, carbs: 42, fat: 12, sodium: 840, fiber: 2, sugar: 4, category: 'pizza', goalFit: ['RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "Pizza Hut", item: "Supreme (2 slices, 12\" thin crust)", calories: 520, protein: 22, carbs: 52, fat: 24, sodium: 1120, fiber: 3, sugar: 5, category: 'pizza', goalFit: ['MAINTENANCE', 'ATHLETIC_PERFORMANCE'] }),

  // ── DOMINO'S ──
  h({ restaurant: "Domino's", item: "Thin Crust Chicken (2 slices, medium)", calories: 350, protein: 22, carbs: 38, fat: 12, sodium: 760, fiber: 2, sugar: 3, category: 'pizza', goalFit: ['RECOMPOSITION', 'MAINTENANCE'] }),
  h({ restaurant: "Domino's", item: "Pacific Veggie (2 slices, large hand toss)", calories: 400, protein: 16, carbs: 52, fat: 15, sodium: 870, fiber: 4, sugar: 6, category: 'pizza', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Domino's", item: "Memphis BBQ Chicken (2 slices, large)", calories: 470, protein: 24, carbs: 62, fat: 14, sodium: 1060, fiber: 2, sugar: 14, category: 'pizza', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Domino's", item: "Chicken Apple Pecan Salad (no dressing)", calories: 240, protein: 24, carbs: 19, fat: 8, sodium: 500, fiber: 3, sugar: 15, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),

  // ── NOODLES & COMPANY ──
  h({ restaurant: "Noodles & Company", item: "Zoodles with Grilled Chicken (small)", calories: 290, protein: 26, carbs: 20, fat: 12, sodium: 710, fiber: 5, sugar: 10, category: 'pasta', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Noodles & Company", item: "Med Chicken Noodle Soup (regular)", calories: 260, protein: 24, carbs: 22, fat: 8, sodium: 1080, fiber: 2, sugar: 4, category: 'sides', goalFit: ['FAT_LOSS', 'MAINTENANCE'] }),
  h({ restaurant: "Noodles & Company", item: "Pad Thai with Chicken (regular)", calories: 590, protein: 28, carbs: 84, fat: 15, sodium: 1380, fiber: 4, sugar: 14, category: 'pasta', goalFit: ['ATHLETIC_PERFORMANCE', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Noodles & Company", item: "Japanese Pan Noodles with Chicken (regular)", calories: 590, protein: 30, carbs: 86, fat: 14, sodium: 1530, fiber: 5, sugar: 15, category: 'pasta', goalFit: ['ATHLETIC_PERFORMANCE'] }),

  // ── WABA GRILL ──
  h({ restaurant: "Waba Grill", item: "Chicken Bowl", calories: 425, protein: 34, carbs: 55, fat: 7, sodium: 740, fiber: 2, sugar: 8, category: 'bowl', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION', 'FAT_LOSS'] }),
  h({ restaurant: "Waba Grill", item: "Shrimp Bowl", calories: 380, protein: 26, carbs: 55, fat: 6, sodium: 780, fiber: 2, sugar: 8, category: 'seafood', goalFit: ['FAT_LOSS', 'RECOMPOSITION', 'MUSCLE_GAIN'] }),
  h({ restaurant: "Waba Grill", item: "Steak Bowl", calories: 480, protein: 32, carbs: 57, fat: 11, sodium: 860, fiber: 2, sugar: 9, category: 'bowl', goalFit: ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'] }),
  h({ restaurant: "Waba Grill", item: "Veggie & Tofu Bowl", calories: 390, protein: 18, carbs: 60, fat: 8, sodium: 620, fiber: 5, sugar: 10, category: 'bowl', goalFit: ['MAINTENANCE', 'RECOMPOSITION'] }),

  // ── LONG JOHN SILVER'S ──
  h({ restaurant: "Long John Silver's", item: "Grilled Tilapia Platter (2 pc, no sides)", calories: 220, protein: 38, carbs: 2, fat: 6, sodium: 880, fiber: 0, sugar: 0, category: 'seafood', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Long John Silver's", item: "Battered Fish Taco (1 pc)", calories: 230, protein: 11, carbs: 26, fat: 9, sodium: 430, fiber: 1, sugar: 3, category: 'tacos', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Long John Silver's", item: "Battered Shrimp (6 pc)", calories: 230, protein: 8, carbs: 22, fat: 13, sodium: 570, fiber: 0, sugar: 0, category: 'seafood', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Long John Silver's", item: "Grilled Salmon Platter (1 pc)", calories: 260, protein: 30, carbs: 4, fat: 13, sodium: 740, fiber: 0, sugar: 2, category: 'seafood', goalFit: ['FAT_LOSS', 'MUSCLE_GAIN', 'RECOMPOSITION'] }),

  // ── HABIT BURGER ──
  h({ restaurant: "Habit Burger", item: "Charburger (single, lettuce wrap)", calories: 290, protein: 18, carbs: 10, fat: 21, sodium: 690, fiber: 2, sugar: 6, category: 'burger', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Habit Burger", item: "Ahi Tuna Club Sandwich", calories: 490, protein: 38, carbs: 44, fat: 16, sodium: 1060, fiber: 3, sugar: 8, category: 'sandwich', goalFit: ['MUSCLE_GAIN', 'RECOMPOSITION'] }),
  h({ restaurant: "Habit Burger", item: "Grilled Chicken Salad (no dressing)", calories: 320, protein: 34, carbs: 16, fat: 12, sodium: 750, fiber: 5, sugar: 9, category: 'salad', goalFit: ['FAT_LOSS', 'RECOMPOSITION'] }),
  h({ restaurant: "Habit Burger", item: "The Charburger (double)", calories: 560, protein: 32, carbs: 42, fat: 28, sodium: 1080, fiber: 2, sugar: 9, category: 'burger', goalFit: ['MUSCLE_GAIN', 'MAINTENANCE'] }),

  // ── CHECKERS / RALLY'S ──
  h({ restaurant: "Checkers / Rally's", item: "Fully Loaded Fry Burger (single)", calories: 420, protein: 19, carbs: 40, fat: 20, sodium: 890, fiber: 2, sugar: 6, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Checkers / Rally's", item: "Champ Burger", calories: 490, protein: 24, carbs: 43, fat: 24, sodium: 920, fiber: 2, sugar: 8, category: 'burger', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Checkers / Rally's", item: "Spicy Chicken Sandwich", calories: 430, protein: 22, carbs: 45, fat: 18, sodium: 1100, fiber: 2, sugar: 6, category: 'sandwich', goalFit: ['MAINTENANCE'] }),
  h({ restaurant: "Checkers / Rally's", item: "Big Buford Burger", calories: 670, protein: 35, carbs: 45, fat: 37, sodium: 1320, fiber: 2, sugar: 9, category: 'burger', goalFit: ['ATHLETIC_PERFORMANCE'] }),

]

// ── HELPERS ──

export const RESTAURANTS = [...new Set(FAST_FOOD_DATA.map(i => i.restaurant))].sort()

export function getBestForGoal(goal: string, restaurant?: string): FastFoodItem[] {
  let items = FAST_FOOD_DATA.filter(i => i.goalFit.includes(goal) && i.isHealthy)
  if (restaurant) items = items.filter(i => i.restaurant === restaurant)
  return items.sort((a, b) => {
    if (goal === 'FAT_LOSS') return a.calories - b.calories
    if (goal === 'MUSCLE_GAIN' || goal === 'ATHLETIC_PERFORMANCE') return b.protein - a.protein
    return a.calories - b.calories
  }).slice(0, 10)
}

export function getHighProteinItems(minProtein = 25, maxCalories = 700, restaurant?: string): FastFoodItem[] {
  let items = FAST_FOOD_DATA.filter(i => i.protein >= minProtein && i.calories <= maxCalories)
  if (restaurant) items = items.filter(i => i.restaurant === restaurant)
  return items.sort((a, b) => b.protein - a.protein)
}

export function getLowCalItems(maxCalories = 400, restaurant?: string): FastFoodItem[] {
  let items = FAST_FOOD_DATA.filter(i => i.calories <= maxCalories)
  if (restaurant) items = items.filter(i => i.restaurant === restaurant)
  return items.sort((a, b) => a.calories - b.calories)
}

export function searchItems(query: string, restaurant?: string): FastFoodItem[] {
  const q = query.toLowerCase()
  let items = FAST_FOOD_DATA.filter(i =>
    i.item.toLowerCase().includes(q) ||
    i.category.toLowerCase().includes(q) ||
    i.restaurant.toLowerCase().includes(q)
  )
  if (restaurant) items = items.filter(i => i.restaurant === restaurant)
  return items
}

export function getByCategory(category: string, restaurant?: string): FastFoodItem[] {
  let items = FAST_FOOD_DATA.filter(i => i.category === category)
  if (restaurant) items = items.filter(i => i.restaurant === restaurant)
  return items.sort((a, b) => b.protein - a.protein)
}
