// MuscleLock Meals — GLP-1 optimized meal library

export type MealTag = "injection" | "low-nausea" | "quick" | "high-protein" | "evening";

export interface Ingredient {
  item: string;
  protein: number; // grams
  note?: string;
}

export interface Meal {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  protein: number;
  calories: number;
  carbs: number;
  fat: number;
  prepTime: number; // minutes
  tags: MealTag[];
  ingredients: Ingredient[];
  instructions: string[];
  glp1Tip: string;
  coachNote: string;
  free: boolean;
}

export const MEAL_FILTERS: { id: MealTag | "all"; icon: string; label: string }[] = [
  { id: "all", icon: "🍽️", label: "All" },
  { id: "injection", icon: "💉", label: "Injection Day" },
  { id: "low-nausea", icon: "🤢", label: "Low Nausea" },
  { id: "quick", icon: "⚡", label: "Under 5 Min" },
  { id: "high-protein", icon: "🥛", label: "High Protein" },
  { id: "evening", icon: "🌙", label: "Evening" },
];

export const MEALS: Meal[] = [
  {
    id: "greek-yogurt-bowl",
    emoji: "🥣",
    name: "Greek Yogurt Power Bowl",
    subtitle: "High protein, zero nausea risk",
    protein: 32,
    calories: 285,
    carbs: 18,
    fat: 6,
    prepTime: 3,
    tags: ["injection", "low-nausea", "quick", "high-protein"],
    ingredients: [
      { item: "200g Greek yogurt (0% fat)", protein: 20 },
      { item: "2 tbsp whey protein powder", protein: 10 },
      { item: "1 tbsp almond butter", protein: 2, note: "adds satiety" },
      { item: "Mixed berries (½ cup)", protein: 0, note: "antioxidants" },
    ],
    instructions: [
      "Spoon Greek yogurt into a bowl.",
      "Mix in whey protein powder until smooth.",
      "Drizzle almond butter on top.",
      "Add mixed berries and serve immediately.",
    ],
    glp1Tip: "Best eaten 2 hours AFTER injection to maximize digestion.",
    coachNote: "On injection days, GLP-1 slows gastric emptying. This bowl is specifically portioned to avoid nausea while still hitting 32g protein.",
    free: true,
  },
  {
    id: "egg-white-scramble",
    emoji: "🥚",
    name: "Egg White Scramble",
    subtitle: "Classic muscle fuel, easy on the stomach",
    protein: 28,
    calories: 220,
    carbs: 4,
    fat: 8,
    prepTime: 7,
    tags: ["injection", "low-nausea", "high-protein"],
    ingredients: [
      { item: "6 egg whites", protein: 22 },
      { item: "1 whole egg", protein: 6 },
      { item: "Handful spinach", protein: 0, note: "iron + folate" },
      { item: "Salt, pepper, turmeric", protein: 0, note: "anti-inflammatory" },
    ],
    instructions: [
      "Whisk egg whites and whole egg together.",
      "Heat non-stick pan on medium-low.",
      "Add spinach, cook 1 minute until wilted.",
      "Pour in eggs, stir gently until just set.",
      "Season with salt, pepper, turmeric.",
    ],
    glp1Tip: "Cook on lower heat — gentle textures are easier to tolerate on GLP-1.",
    coachNote: "Egg whites are the most bioavailable protein source. Your body uses nearly 100% of it for muscle repair.",
    free: true,
  },
  {
    id: "protein-shake-banana",
    emoji: "🥤",
    name: "Banana Protein Shake",
    subtitle: "Drinkable protein when eating feels hard",
    protein: 35,
    calories: 340,
    carbs: 32,
    fat: 7,
    prepTime: 2,
    tags: ["low-nausea", "quick", "high-protein"],
    ingredients: [
      { item: "1.5 scoops whey protein", protein: 30 },
      { item: "1 medium banana", protein: 1, note: "easy digestion" },
      { item: "1 cup almond milk", protein: 1 },
      { item: "1 tbsp peanut butter", protein: 3, note: "healthy fats" },
      { item: "Ice cubes", protein: 0 },
    ],
    instructions: [
      "Add almond milk and peanut butter to blender.",
      "Add banana (broken in pieces) and protein powder.",
      "Add ice cubes and blend until smooth.",
      "Drink slowly over 15 minutes.",
    ],
    glp1Tip: "Liquid meals bypass the slowed stomach emptying — ideal for nausea days.",
    coachNote: "When solid food feels impossible, this shake delivers 35g protein without triggering nausea. Sip slowly to avoid overwhelming your GLP-1 slowed gut.",
    free: true,
  },
  {
    id: "chicken-rice-bowl",
    emoji: "🍗",
    name: "Grilled Chicken Rice Bowl",
    subtitle: "Simple, filling, macro-friendly",
    protein: 42,
    calories: 480,
    carbs: 38,
    fat: 12,
    prepTime: 20,
    tags: ["high-protein", "evening"],
    ingredients: [
      { item: "150g grilled chicken breast", protein: 38 },
      { item: "½ cup jasmine rice (cooked)", protein: 2 },
      { item: "Steamed broccoli", protein: 2, note: "fiber + fullness" },
      { item: "1 tsp olive oil", protein: 0, note: "healthy fat" },
      { item: "Soy sauce + lemon", protein: 0 },
    ],
    instructions: [
      "Season chicken with salt, pepper, and lemon.",
      "Grill or pan-fry chicken for 6 min per side.",
      "Cook rice according to package directions.",
      "Steam broccoli for 3-4 minutes.",
      "Assemble bowl: rice, chicken (sliced), broccoli.",
      "Drizzle with olive oil and soy sauce.",
    ],
    glp1Tip: "Eat this 3+ hours after injection when appetite starts to normalize.",
    coachNote: "42g protein in one meal gets you nearly a third of your daily target. Time this for when your GLP-1 appetite suppression eases — usually dinner.",
    free: false,
  },
  {
    id: "cottage-cheese-snack",
    emoji: "🧀",
    name: "Cottage Cheese Crunch",
    subtitle: "Casein protein for overnight muscle repair",
    protein: 24,
    calories: 195,
    carbs: 12,
    fat: 5,
    prepTime: 2,
    tags: ["evening", "quick", "low-nausea"],
    ingredients: [
      { item: "1 cup low-fat cottage cheese", protein: 22 },
      { item: "1 tbsp honey", protein: 0, note: "flavor" },
      { item: "2 tbsp granola", protein: 2, note: "crunch" },
      { item: "Cinnamon dash", protein: 0 },
    ],
    instructions: [
      "Spoon cottage cheese into a bowl.",
      "Drizzle honey and sprinkle cinnamon.",
      "Top with granola for crunch.",
    ],
    glp1Tip: "Eat before bed — casein protein releases slowly overnight, protecting muscle while you sleep.",
    coachNote: "Cottage cheese contains casein, which feeds your muscles for 6-8 hours overnight. This is one of the most underrated muscle-preservation foods on GLP-1.",
    free: false,
  },
  {
    id: "salmon-sweet-potato",
    emoji: "🐟",
    name: "Salmon & Sweet Potato",
    subtitle: "Omega-3s + protein powerhouse",
    protein: 38,
    calories: 520,
    carbs: 35,
    fat: 22,
    prepTime: 25,
    tags: ["high-protein", "evening"],
    ingredients: [
      { item: "150g salmon fillet", protein: 34 },
      { item: "1 medium sweet potato", protein: 2 },
      { item: "Steamed asparagus", protein: 2, note: "fiber" },
      { item: "Lemon + dill", protein: 0 },
      { item: "1 tsp olive oil", protein: 0 },
    ],
    instructions: [
      "Preheat oven to 400°F / 200°C.",
      "Cube sweet potato, toss in olive oil, roast 20 min.",
      "Season salmon with lemon, dill, salt.",
      "Pan-sear salmon 4 min per side.",
      "Serve with roasted sweet potato and steamed asparagus.",
    ],
    glp1Tip: "Omega-3s from salmon reduce GLP-1-related inflammation and support muscle recovery.",
    coachNote: "This is the gold standard muscle-preservation meal. Salmon's omega-3s + 38g protein make it the best dinner option for GLP-1 users.",
    free: false,
  },
  {
    id: "tuna-rice-cake",
    emoji: "🍘",
    name: "Tuna Rice Cakes",
    subtitle: "Portable, quick, high protein",
    protein: 26,
    calories: 210,
    carbs: 14,
    fat: 5,
    prepTime: 4,
    tags: ["quick", "low-nausea", "high-protein"],
    ingredients: [
      { item: "1 can tuna (in water, drained)", protein: 24 },
      { item: "2 rice cakes", protein: 1 },
      { item: "1 tsp Greek yogurt", protein: 1 },
      { item: "Everything bagel seasoning", protein: 0 },
    ],
    instructions: [
      "Drain tuna and mix with Greek yogurt.",
      "Spread onto rice cakes.",
      "Sprinkle everything bagel seasoning.",
    ],
    glp1Tip: "Rice cakes are gentle on a GLP-1 stomach. Small portions prevent nausea.",
    coachNote: "When you can't face a full meal, these give you 26g protein in 3 bites. Perfect for nausea days when you still need to hit your target.",
    free: false,
  },
  {
    id: "overnight-oats",
    emoji: "🫙",
    name: "Protein Overnight Oats",
    subtitle: "Prep tonight, eat tomorrow",
    protein: 30,
    calories: 365,
    carbs: 42,
    fat: 8,
    prepTime: 5,
    tags: ["quick", "injection"],
    ingredients: [
      { item: "½ cup rolled oats", protein: 5 },
      { item: "1 scoop protein powder", protein: 20 },
      { item: "¾ cup milk", protein: 5 },
      { item: "1 tbsp chia seeds", protein: 2, note: "fiber + omega-3" },
      { item: "Berries for topping", protein: 0 },
    ],
    instructions: [
      "Combine oats, protein powder, and chia seeds in a jar.",
      "Pour in milk and stir well.",
      "Refrigerate overnight (at least 6 hours).",
      "Top with berries before eating.",
    ],
    glp1Tip: "Prep on non-injection days for an effortless breakfast the next morning.",
    coachNote: "Zero morning effort and 30g protein. The chia seeds add soluble fiber that works WITH your GLP-1 to keep you full longer.",
    free: false,
  },
  {
    id: "bone-broth-protein",
    emoji: "🍵",
    name: "Bone Broth Protein Sip",
    subtitle: "Warm, soothing, surprisingly high protein",
    protein: 20,
    calories: 90,
    carbs: 0,
    fat: 1,
    prepTime: 3,
    tags: ["low-nausea", "quick", "injection"],
    ingredients: [
      { item: "1.5 cups bone broth", protein: 15 },
      { item: "1 tbsp collagen peptides", protein: 5 },
      { item: "Pinch of salt + ginger", protein: 0, note: "anti-nausea" },
    ],
    instructions: [
      "Heat bone broth in a mug (microwave 2 min or stovetop).",
      "Stir in collagen peptides until dissolved.",
      "Add salt and fresh grated ginger.",
      "Sip slowly over 20 minutes.",
    ],
    glp1Tip: "Ginger actively reduces GLP-1 nausea. This is your emergency protein source.",
    coachNote: "On your worst nausea days, this warm sip gives you 20g protein with almost zero stomach effort. The ginger is clinically proven to reduce GLP-1 side effects.",
    free: true,
  },
  {
    id: "turkey-lettuce-wraps",
    emoji: "🥬",
    name: "Turkey Lettuce Wraps",
    subtitle: "Light but protein-packed",
    protein: 34,
    calories: 260,
    carbs: 6,
    fat: 10,
    prepTime: 10,
    tags: ["low-nausea", "high-protein"],
    ingredients: [
      { item: "150g ground turkey (lean)", protein: 30 },
      { item: "Butter lettuce leaves", protein: 1 },
      { item: "Diced cucumber", protein: 0, note: "cooling" },
      { item: "Sriracha + soy sauce", protein: 0 },
      { item: "Sesame seeds", protein: 1, note: "healthy fat" },
    ],
    instructions: [
      "Brown ground turkey in a non-stick pan.",
      "Season with soy sauce and a dash of sriracha.",
      "Spoon into lettuce cups.",
      "Top with diced cucumber and sesame seeds.",
    ],
    glp1Tip: "Lettuce wraps are lighter than bread — easier on your GLP-1 slowed digestion.",
    coachNote: "34g protein without the bloating of a wrap or sandwich. The lettuce keeps it light while the turkey delivers muscle-building amino acids.",
    free: false,
  },
];
