-- ═══════════════════════════════════════════════════════════════════════════════
-- SAUZULE SEED DATA
-- Run this in the Neon SQL Editor after the schema has been pushed.
-- Go to: https://console.neon.tech → your project → SQL Editor → paste & run
-- ═══════════════════════════════════════════════════════════════════════════════

-- Coach: patrick@sauzule.com / Sauzule2024!
-- (bcrypt hash of "Sauzule2024!" with 12 rounds)
INSERT INTO "Coach" ("id", "email", "name", "passwordHash", "amazonTag")
VALUES (
  'coach_sauzule_01',
  'patrick@sauzule.com',
  'Patrick Kennedy',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGFKlJDBGVMjLu5NbBRoW0SsKOC',
  'sauzule-20'
)
ON CONFLICT ("email") DO NOTHING;

-- Pricing Plans
INSERT INTO "PricingPlan" ("id", "coachId", "name", "priceMonthly", "features", "isActive")
VALUES
  ('plan_starter', 'coach_sauzule_01', 'Starter', 3900,
   ARRAY['7-day AI meal plan', 'Food swap tool', 'Sunday check-in', 'Fast food logger'],
   true),
  ('plan_standard', 'coach_sauzule_01', 'Standard', 5900,
   ARRAY['Everything in Starter', 'Supplement recommendations', 'Weekly AI adjustments', 'Priority support'],
   true),
  ('plan_elite', 'coach_sauzule_01', 'Elite', 9900,
   ARRAY['Everything in Standard', 'Direct coach messaging', 'Custom macros', 'Monthly 1-on-1 call'],
   true)
ON CONFLICT DO NOTHING;

-- ─── SUPPLEMENT STACKS ────────────────────────────────────────────────────────

-- FAT LOSS stack
INSERT INTO "SupplementStack" ("id", "coachId", "goal", "name", "priority", "dosage", "timing", "benefits", "amazonUrl", "sortOrder")
VALUES
  ('supp_fl_1', 'coach_sauzule_01', 'FAT_LOSS', 'Whey Protein Isolate', 'ESSENTIAL',
   '1 scoop (25g protein)', 'Post-workout or between meals',
   'Preserves lean muscle during fat loss, keeps you full, highest bioavailability protein source',
   'https://www.amazon.com/dp/B002DYJ0M4?tag=sauzule-20', 1),

  ('supp_fl_2', 'coach_sauzule_01', 'FAT_LOSS', 'Creatine Monohydrate', 'ESSENTIAL',
   '5g daily', 'Any time, with water',
   'Maintains strength and muscle volume during caloric deficit, supports high-intensity training',
   'https://www.amazon.com/dp/B002DYIZZQ?tag=sauzule-20', 2),

  ('supp_fl_3', 'coach_sauzule_01', 'FAT_LOSS', 'Caffeine + L-Theanine', 'RECOMMENDED',
   '200mg caffeine + 400mg L-theanine', '30 min before training',
   'Boosts fat oxidation during cardio, improves focus without jitters, thermogenic effect',
   'https://www.amazon.com/dp/B01DBTFO98?tag=sauzule-20', 3),

  ('supp_fl_4', 'coach_sauzule_01', 'FAT_LOSS', 'Omega-3 Fish Oil', 'RECOMMENDED',
   '2-3g EPA/DHA daily', 'With meals',
   'Reduces inflammation, improves insulin sensitivity, supports lean body composition',
   'https://www.amazon.com/dp/B001LF39S8?tag=sauzule-20', 4),

  ('supp_fl_5', 'coach_sauzule_01', 'FAT_LOSS', 'Vitamin D3 + K2', 'RECOMMENDED',
   '5000 IU D3 + 100mcg K2', 'With breakfast',
   'Optimizes hormone production, immune function, and calcium metabolism for body composition',
   'https://www.amazon.com/dp/B078GXDNVJ?tag=sauzule-20', 5),

  ('supp_fl_6', 'coach_sauzule_01', 'FAT_LOSS', 'Magnesium Glycinate', 'OPTIONAL',
   '400mg', 'Before bed',
   'Improves sleep quality (critical for fat loss hormones), reduces cortisol, muscle recovery',
   'https://www.amazon.com/dp/B00T2VJN6O?tag=sauzule-20', 6),

  ('supp_fl_7', 'coach_sauzule_01', 'FAT_LOSS', 'Psyllium Husk', 'OPTIONAL',
   '5-10g', 'Before meals with 12oz water',
   'Dramatically increases satiety, slows digestion, improves gut health during caloric deficit',
   'https://www.amazon.com/dp/B000WS3AMU?tag=sauzule-20', 7);

-- MUSCLE GAIN stack
INSERT INTO "SupplementStack" ("id", "coachId", "goal", "name", "priority", "dosage", "timing", "benefits", "amazonUrl", "sortOrder")
VALUES
  ('supp_mg_1', 'coach_sauzule_01', 'MUSCLE_GAIN', 'Whey Protein Isolate', 'ESSENTIAL',
   '1-2 scoops (25-50g protein)', 'Post-workout within 30 min',
   'Maximizes muscle protein synthesis, fast-digesting for optimal post-workout recovery window',
   'https://www.amazon.com/dp/B002DYJ0M4?tag=sauzule-20', 1),

  ('supp_mg_2', 'coach_sauzule_01', 'MUSCLE_GAIN', 'Creatine Monohydrate', 'ESSENTIAL',
   '5g daily', 'Any time (consistency matters)',
   '#1 most researched supplement for muscle gain. Increases strength, power output, and muscle volume',
   'https://www.amazon.com/dp/B002DYIZZQ?tag=sauzule-20', 2),

  ('supp_mg_3', 'coach_sauzule_01', 'MUSCLE_GAIN', 'Mass Gainer (if underweight)', 'ESSENTIAL',
   '1 serving (600-1200 cal)', 'Between meals or post-workout',
   'Hits caloric surplus required for muscle growth when whole foods alone are insufficient',
   'https://www.amazon.com/dp/B007GIS4YE?tag=sauzule-20', 3),

  ('supp_mg_4', 'coach_sauzule_01', 'MUSCLE_GAIN', 'Beta-Alanine', 'RECOMMENDED',
   '3.2g daily', 'Pre-workout',
   'Increases muscular endurance, allows more reps per set, builds more total volume for hypertrophy',
   'https://www.amazon.com/dp/B002GD3OPC?tag=sauzule-20', 4),

  ('supp_mg_5', 'coach_sauzule_01', 'MUSCLE_GAIN', 'Citrulline Malate', 'RECOMMENDED',
   '6-8g', '30-60 min pre-workout',
   'Dramatically improves muscle pumps, blood flow, and nitric oxide production for better workouts',
   'https://www.amazon.com/dp/B00E1RXMB2?tag=sauzule-20', 5),

  ('supp_mg_6', 'coach_sauzule_01', 'MUSCLE_GAIN', 'ZMA (Zinc, Magnesium, B6)', 'RECOMMENDED',
   '1 serving', 'Before bed on empty stomach',
   'Optimizes testosterone production, deep sleep, and overnight muscle recovery',
   'https://www.amazon.com/dp/B0013OXKHC?tag=sauzule-20', 6),

  ('supp_mg_7', 'coach_sauzule_01', 'MUSCLE_GAIN', 'Casein Protein', 'OPTIONAL',
   '1 scoop (24g protein)', 'Before bed',
   'Slow-digesting protein feeds muscles overnight for 7-8 hours — maximizes the anabolic window',
   'https://www.amazon.com/dp/B000GIQT2O?tag=sauzule-20', 7);

-- MAINTENANCE stack (shorter)
INSERT INTO "SupplementStack" ("id", "coachId", "goal", "name", "priority", "dosage", "timing", "benefits", "amazonUrl", "sortOrder")
VALUES
  ('supp_mn_1', 'coach_sauzule_01', 'MAINTENANCE', 'Whey Protein', 'RECOMMENDED',
   '1 scoop as needed', 'When dietary protein is low',
   'Convenient protein source to hit daily targets without excess calories',
   'https://www.amazon.com/dp/B002DYJ0M4?tag=sauzule-20', 1),
  ('supp_mn_2', 'coach_sauzule_01', 'MAINTENANCE', 'Omega-3 Fish Oil', 'RECOMMENDED',
   '2g EPA/DHA', 'With meals',
   'Foundational health supplement: heart, brain, inflammation, joint health',
   'https://www.amazon.com/dp/B001LF39S8?tag=sauzule-20', 2),
  ('supp_mn_3', 'coach_sauzule_01', 'MAINTENANCE', 'Multivitamin', 'RECOMMENDED',
   '1 daily', 'With breakfast',
   'Insurance against micronutrient gaps in a flexible diet',
   'https://www.amazon.com/dp/B00280DM5Y?tag=sauzule-20', 3);

-- ═══════════════════════════════════════════════════════════════════════════════
-- NOTE: The bcrypt hash above corresponds to: Sauzule2024!
-- Your login: patrick@sauzule.com / Sauzule2024!
-- Change this password immediately after first login.
-- ═══════════════════════════════════════════════════════════════════════════════
