-- Sauzule Diet App — Full Schema
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE "Goal" AS ENUM ('FAT_LOSS','MUSCLE_GAIN','MAINTENANCE','ATHLETIC_PERFORMANCE','RECOMPOSITION');
CREATE TYPE "ActivityLevel" AS ENUM ('SEDENTARY','LIGHT','MODERATE','VERY_ACTIVE','ATHLETE');
CREATE TYPE "DietType" AS ENUM ('HIGH_PROTEIN','BALANCED','LOW_CARB','KETO','MEDITERRANEAN','VEGAN','VEGETARIAN');
CREATE TYPE "Sex" AS ENUM ('MALE','FEMALE');
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIAL','ACTIVE','PAST_DUE','PAUSED','CANCELED');
CREATE TYPE "FoodCategory" AS ENUM ('PROTEIN','CARB','FAT','VEGETABLE','FRUIT','DAIRY','OTHER');
CREATE TYPE "FoodPref" AS ENUM ('LOVE','LIKE','DISLIKE','ALLERGIC');
CREATE TYPE "PlanStatus" AS ENUM ('PENDING_APPROVAL','APPROVED','ACTIVE','ARCHIVED');
CREATE TYPE "MealType" AS ENUM ('BREAKFAST','LUNCH','DINNER','SNACK_1','SNACK_2');
CREATE TYPE "SupplementPriority" AS ENUM ('ESSENTIAL','RECOMMENDED','OPTIONAL');

CREATE TABLE IF NOT EXISTS "Coach" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "email" TEXT UNIQUE NOT NULL,
  "name" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "stripeAccountId" TEXT,
  "amazonTag" TEXT NOT NULL DEFAULT 'sauzule-20',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "PricingPlan" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "coachId" TEXT NOT NULL REFERENCES "Coach"("id"),
  "name" TEXT NOT NULL,
  "priceMonthly" INTEGER NOT NULL,
  "stripePriceId" TEXT,
  "features" TEXT[] NOT NULL DEFAULT '{}',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Client" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "coachId" TEXT NOT NULL REFERENCES "Coach"("id"),
  "email" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "stripeCustomerId" TEXT,
  "inviteToken" TEXT UNIQUE,
  "inviteAccepted" BOOLEAN NOT NULL DEFAULT false,
  "goal" "Goal" NOT NULL DEFAULT 'FAT_LOSS',
  "activityLevel" "ActivityLevel" NOT NULL DEFAULT 'MODERATE',
  "dietType" "DietType" NOT NULL DEFAULT 'HIGH_PROTEIN',
  "currentWeight" FLOAT,
  "targetWeight" FLOAT,
  "heightInches" INTEGER,
  "age" INTEGER,
  "sex" "Sex" NOT NULL DEFAULT 'MALE',
  "tdee" INTEGER,
  "targetCalories" INTEGER,
  "targetProtein" INTEGER,
  "targetCarbs" INTEGER,
  "targetFat" INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "ClientSubscription" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT UNIQUE NOT NULL REFERENCES "Client"("id"),
  "planId" TEXT NOT NULL REFERENCES "PricingPlan"("id"),
  "stripeSubscriptionId" TEXT UNIQUE,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIAL',
  "trialEndsAt" TIMESTAMPTZ,
  "currentPeriodEnd" TIMESTAMPTZ,
  "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "FoodPreference" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "foodName" TEXT NOT NULL,
  "foodId" TEXT,
  "category" "FoodCategory" NOT NULL,
  "pref" "FoodPref" NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE("clientId","foodName")
);

CREATE TABLE IF NOT EXISTS "MealPlan" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "weekStartDate" TIMESTAMPTZ NOT NULL,
  "status" "PlanStatus" NOT NULL DEFAULT 'PENDING_APPROVAL',
  "approvedAt" TIMESTAMPTZ,
  "approvedByCoach" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT,
  "generatedByAI" BOOLEAN NOT NULL DEFAULT true,
  "aiModel" TEXT,
  "generationPrompt" TEXT,
  "avgCalories" INTEGER,
  "avgProtein" INTEGER,
  "avgCarbs" INTEGER,
  "avgFat" INTEGER,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "MealPlanDay" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "mealPlanId" TEXT NOT NULL REFERENCES "MealPlan"("id") ON DELETE CASCADE,
  "dayOfWeek" INTEGER NOT NULL,
  "date" TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS "Meal" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "dayId" TEXT NOT NULL REFERENCES "MealPlanDay"("id") ON DELETE CASCADE,
  "mealType" "MealType" NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "servingSize" TEXT,
  "calories" INTEGER NOT NULL,
  "protein" FLOAT NOT NULL,
  "carbs" FLOAT NOT NULL,
  "fat" FLOAT NOT NULL,
  "ingredients" TEXT[] NOT NULL DEFAULT '{}',
  "prepTime" INTEGER,
  "isSwappable" BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS "FoodSwap" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "mealId" TEXT,
  "originalFood" TEXT NOT NULL,
  "swappedFood" TEXT NOT NULL,
  "reason" TEXT,
  "swapCount" INTEGER NOT NULL DEFAULT 1,
  "isPermanent" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "FastFoodLog" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "loggedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "restaurant" TEXT NOT NULL,
  "itemName" TEXT NOT NULL,
  "calories" INTEGER NOT NULL,
  "protein" FLOAT NOT NULL,
  "carbs" FLOAT NOT NULL,
  "fat" FLOAT NOT NULL,
  "isHealthy" BOOLEAN NOT NULL DEFAULT false,
  "compensationApplied" BOOLEAN NOT NULL DEFAULT true,
  "remainingCalories" INTEGER
);

CREATE TABLE IF NOT EXISTS "SundayCheckIn" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT NOT NULL REFERENCES "Client"("id"),
  "weekDate" TIMESTAMPTZ NOT NULL,
  "adherenceRating" INTEGER NOT NULL,
  "energyRating" INTEGER NOT NULL,
  "trainingSessions" INTEGER NOT NULL,
  "foodSwapRequest" TEXT,
  "weightChange" FLOAT,
  "aiAdjustment" TEXT,
  "newPlanId" TEXT,
  "submittedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "autoRenewed" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS "SupplementStack" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "coachId" TEXT NOT NULL REFERENCES "Coach"("id"),
  "goal" "Goal" NOT NULL,
  "name" TEXT NOT NULL,
  "priority" "SupplementPriority" NOT NULL,
  "dosage" TEXT NOT NULL,
  "timing" TEXT NOT NULL,
  "benefits" TEXT NOT NULL,
  "amazonUrl" TEXT NOT NULL,
  "asin" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "AffiliateClick" (
  "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "clientId" TEXT,
  "supplementId" TEXT,
  "amazonUrl" TEXT NOT NULL,
  "clickedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "userAgent" TEXT
);
