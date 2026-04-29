// Netlify Scheduled Function — runs every Sunday at 12:00 PM UTC (7 AM EST)
// Schedule is set in netlify.toml: "0 12 * * 0"

export default async () => {
  const baseUrl = process.env.NEXTAUTH_URL || process.env.URL || 'http://localhost:3000'
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error('CRON_SECRET not set')
    return
  }

  try {
    const response = await fetch(`${baseUrl}/api/sunday-reset`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${cronSecret}` },
    })

    const result = await response.json()
    console.log('Sunday reset complete:', JSON.stringify(result))
  } catch (err) {
    console.error('Sunday reset cron failed:', err)
  }
}

export const config = { schedule: '0 12 * * 0' }
