import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Sauzule database...')

  // Create coach account
  const passwordHash = await bcrypt.hash('Sauzule2024!', 12)
  const coach = await prisma.coach.upsert({
    where: { email: 'patrick@sauzule.com' },
    update: {},
    create: {
      email: 'patrick@sauzule.com',
      name: 'Patrick Kennedy',
      passwordHash,
      amazonTag: 'sauzule-20',
    },
  })

  // Create default pricing plans
  const plans = [
    { name: 'Starter', priceMonthly: 3900, features: ['AI meal plan', 'Food preference setup', 'Basic food logging', 'Coach messaging'] },
    { name: 'Standard', priceMonthly: 5900, features: ['Everything in Starter', 'Fast food logging (40+ chains)', 'Sunday weekly reset', 'Food swapping'] },
    { name: 'Elite', priceMonthly: 9900, features: ['Everything in Standard', 'Supplement stack recommendations', 'Amazon affiliate links', 'Priority coach access'] },
  ]

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { id: `${coach.id}-${plan.name.toLowerCase()}` },
      update: plan,
      create: { ...plan, coachId: coach.id },
    })
  }

  // Seed supplement stacks
  const supplements = [
    // Fat Loss
    { goal: 'FAT_LOSS', name: 'Whey Protein Isolate', priority: 'ESSENTIAL', dosage: '25–40g daily', timing: 'Post-workout or between meals', benefits: 'Muscle retention during calorie deficit, satiety', amazonUrl: 'https://www.amazon.com/s?k=whey+protein+isolate&tag=sauzule-20', sortOrder: 1 },
    { goal: 'FAT_LOSS', name: 'Thermogenic Fat Burner', priority: 'RECOMMENDED', dosage: '2 capsules AM', timing: 'Morning, fasted', benefits: 'Caffeine + green tea extract + L-carnitine blend', amazonUrl: 'https://www.amazon.com/s?k=thermogenic+fat+burner&tag=sauzule-20', sortOrder: 2 },
    { goal: 'FAT_LOSS', name: 'Fish Oil Omega-3', priority: 'ESSENTIAL', dosage: '2–4g EPA/DHA daily', timing: 'With meals', benefits: 'Anti-inflammatory, cardiovascular support, fat metabolism', amazonUrl: 'https://www.amazon.com/s?k=fish+oil+omega+3&tag=sauzule-20', sortOrder: 3 },
    { goal: 'FAT_LOSS', name: 'CLA (Conjugated Linoleic Acid)', priority: 'RECOMMENDED', dosage: '3g daily', timing: 'With meals', benefits: 'Body composition, metabolism support', amazonUrl: 'https://www.amazon.com/s?k=cla+supplement&tag=sauzule-20', sortOrder: 4 },
    { goal: 'FAT_LOSS', name: 'Magnesium Glycinate', priority: 'OPTIONAL', dosage: '400mg', timing: 'Before bed', benefits: 'Sleep quality, muscle recovery, cortisol regulation', amazonUrl: 'https://www.amazon.com/s?k=magnesium+glycinate&tag=sauzule-20', sortOrder: 5 },
    // Muscle Gain
    { goal: 'MUSCLE_GAIN', name: 'Creatine Monohydrate', priority: 'ESSENTIAL', dosage: '5g daily', timing: 'Any time, consistent daily use', benefits: 'Strength, power output, muscle volume', amazonUrl: 'https://www.amazon.com/s?k=creatine+monohydrate&tag=sauzule-20', sortOrder: 1 },
    { goal: 'MUSCLE_GAIN', name: 'Whey Protein', priority: 'ESSENTIAL', dosage: '25–50g daily', timing: 'Post-workout', benefits: 'Muscle protein synthesis, recovery', amazonUrl: 'https://www.amazon.com/s?k=whey+protein&tag=sauzule-20', sortOrder: 2 },
    { goal: 'MUSCLE_GAIN', name: 'Beta-Alanine', priority: 'RECOMMENDED', dosage: '3.2–6.4g daily', timing: 'Pre-workout', benefits: 'Endurance, reduced muscle fatigue', amazonUrl: 'https://www.amazon.com/s?k=beta+alanine&tag=sauzule-20', sortOrder: 3 },
    { goal: 'MUSCLE_GAIN', name: 'Mass Gainer', priority: 'OPTIONAL', dosage: '1 serving', timing: 'Between meals or post-workout', benefits: 'Caloric surplus support for hard gainers', amazonUrl: 'https://www.amazon.com/s?k=mass+gainer&tag=sauzule-20', sortOrder: 4 },
  ]

  for (const supp of supplements) {
    await prisma.supplementStack.create({
      data: { ...supp, coachId: coach.id } as any,
    })
  }

  console.log('✓ Seed complete')
  console.log(`  Coach: ${coach.email}`)
  console.log('  Default password: Sauzule2024!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
