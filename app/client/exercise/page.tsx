'use client'
import { useState, useEffect } from 'react'

type Exercise = { name: string; sets: string; reps: string; rest: string; tip: string; yt: string }
type Day = { day: string; label: string; focus: string; exercises: Exercise[]; isRest?: boolean }

const WORKOUTS: Record<string, Day[]> = {
  FAT_LOSS: [
    { day: 'Mon', label: 'Monday', focus: 'Full Body Circuit', exercises: [
      { name: 'Jumping Jacks', sets: '3', reps: '30 reps', rest: '20s', tip: 'Keep arms and legs in sync. Great warm-up.', yt: 'jumping+jacks+exercise' },
      { name: 'Bodyweight Squats', sets: '3', reps: '15 reps', rest: '45s', tip: 'Sit back into your heels. Chest tall.', yt: 'bodyweight+squat+form' },
      { name: 'Push-ups', sets: '3', reps: '10–15 reps', rest: '45s', tip: 'Core tight, lower chest to floor.', yt: 'push+up+proper+form' },
      { name: 'Mountain Climbers', sets: '3', reps: '30 sec', rest: '30s', tip: 'Drive knees toward chest. Fast but controlled.', yt: 'mountain+climbers+exercise' },
      { name: 'Burpees', sets: '3', reps: '8–10 reps', rest: '60s', tip: 'Explode up at the top. Land soft.', yt: 'burpees+proper+form' },
    ]},
    { day: 'Tue', label: 'Tuesday', focus: 'Cardio + Core', exercises: [
      { name: 'Brisk Walk or Jog', sets: '1', reps: '20 min', rest: '—', tip: 'Keep pace where you can still talk.', yt: 'brisk+walking+exercise+benefits' },
      { name: 'Plank Hold', sets: '3', reps: '45 sec', rest: '30s', tip: 'Straight line head to heels. Squeeze glutes.', yt: 'plank+hold+proper+form' },
      { name: 'Bicycle Crunches', sets: '3', reps: '20 reps', rest: '30s', tip: 'Rotate fully. Slow is better than fast.', yt: 'bicycle+crunches+form' },
      { name: 'Leg Raises', sets: '3', reps: '15 reps', rest: '30s', tip: 'Lower back pressed to floor the whole time.', yt: 'leg+raises+core+exercise' },
      { name: 'Russian Twists', sets: '3', reps: '20 reps', rest: '30s', tip: 'Lean back 45°. Keep feet off ground.', yt: 'russian+twists+exercise' },
    ]},
    { day: 'Wed', label: 'Wednesday', focus: 'Active Recovery', isRest: true, exercises: [
      { name: '20–30 Min Walk', sets: '1', reps: 'Easy pace', rest: '—', tip: 'Keep it relaxed. This aids recovery.', yt: 'walking+for+fat+loss' },
      { name: 'Full Body Stretch', sets: '1', reps: '10 min', rest: '—', tip: 'Hold each stretch 30 sec. Breathe deeply.', yt: 'full+body+stretching+routine' },
    ]},
    { day: 'Thu', label: 'Thursday', focus: 'Full Body Strength', exercises: [
      { name: 'Goblet Squats', sets: '4', reps: '12 reps', rest: '60s', tip: 'Hold dumbbell at chest. Drop low.', yt: 'goblet+squat+form' },
      { name: 'Dumbbell Rows', sets: '3', reps: '10 reps each', rest: '45s', tip: 'Pull elbow back past hip. Squeeze back.', yt: 'dumbbell+row+proper+form' },
      { name: 'Dumbbell Deadlifts', sets: '3', reps: '12 reps', rest: '60s', tip: 'Hinge at hips, soft bend in knees. Flat back.', yt: 'dumbbell+deadlift+form' },
      { name: 'Reverse Lunges', sets: '3', reps: '10 each leg', rest: '45s', tip: 'Step back far enough to make 90° angles.', yt: 'reverse+lunge+form' },
      { name: 'Shoulder Press', sets: '3', reps: '12 reps', rest: '45s', tip: 'Drive straight up. Don't arch lower back.', yt: 'dumbbell+shoulder+press+form' },
    ]},
    { day: 'Fri', label: 'Friday', focus: 'HIIT Cardio', exercises: [
      { name: 'Jump Squats', sets: '4', reps: '12 reps', rest: '30s', tip: 'Land soft with knees bent. Absorb impact.', yt: 'jump+squat+exercise' },
      { name: 'High Knees', sets: '4', reps: '30 sec', rest: '20s', tip: 'Drive knees to hip height. Pump arms.', yt: 'high+knees+exercise' },
      { name: 'Push-up Burpees', sets: '3', reps: '8 reps', rest: '60s', tip: 'Full push-up each rep. Max effort.', yt: 'push+up+burpee+exercise' },
      { name: 'Jump Lunges', sets: '3', reps: '10 reps', rest: '45s', tip: 'Switch legs in the air. Land stable.', yt: 'jump+lunge+plyometric' },
      { name: 'Sprint in Place', sets: '5', reps: '20 sec', rest: '40s', tip: 'Max effort. Drive arms hard.', yt: 'sprinting+in+place+exercise' },
    ]},
    { day: 'Sat', label: 'Saturday', focus: 'Light Activity', isRest: true, exercises: [
      { name: 'Bike Ride or Swim', sets: '1', reps: '30 min easy', rest: '—', tip: 'Keep heart rate low. Enjoyment focus.', yt: 'low+intensity+cardio+fat+loss' },
      { name: 'Mobility Work', sets: '1', reps: '10 min', rest: '—', tip: 'Hip circles, chest openers, shoulder rolls.', yt: 'full+body+mobility+routine' },
    ]},
    { day: 'Sun', label: 'Sunday', focus: 'Full Rest', isRest: true, exercises: [
      { name: 'Complete Rest', sets: '—', reps: '—', rest: '—', tip: 'Sleep well. Your body transforms during rest.', yt: 'recovery+importance+fitness' },
    ]},
  ],
  MUSCLE_GAIN: [
    { day: 'Mon', label: 'Monday', focus: 'Push — Chest / Shoulders / Triceps', exercises: [
      { name: 'Bench Press', sets: '4', reps: '6–8 reps', rest: '2 min', tip: 'Control the descent. Touch chest lightly.', yt: 'bench+press+proper+form' },
      { name: 'Incline Dumbbell Press', sets: '3', reps: '8–10 reps', rest: '90s', tip: '30–45° incline. Full range of motion.', yt: 'incline+dumbbell+press+form' },
      { name: 'Overhead Press', sets: '3', reps: '8–10 reps', rest: '90s', tip: 'Brace core. Press straight overhead.', yt: 'overhead+press+form+tutorial' },
      { name: 'Lateral Raises', sets: '3', reps: '12–15 reps', rest: '60s', tip: 'Slight bend in elbow. Lead with pinkies.', yt: 'lateral+raise+form+tips' },
      { name: 'Tricep Pushdowns', sets: '3', reps: '12–15 reps', rest: '60s', tip: 'Lock elbows at sides. Full extension.', yt: 'tricep+pushdown+form' },
      { name: 'Skull Crushers', sets: '3', reps: '10–12 reps', rest: '60s', tip: 'Lower bar to forehead. Keep elbows in.', yt: 'skull+crushers+exercise+form' },
    ]},
    { day: 'Tue', label: 'Tuesday', focus: 'Pull — Back / Biceps', exercises: [
      { name: 'Pull-ups or Lat Pulldown', sets: '4', reps: '6–10 reps', rest: '2 min', tip: 'Pull elbows down and back. Squeeze lats.', yt: 'pull+up+lat+pulldown+form' },
      { name: 'Barbell Rows', sets: '4', reps: '8–10 reps', rest: '90s', tip: 'Hinge 45°. Pull bar to belly button.', yt: 'barbell+row+proper+form' },
      { name: 'Seated Cable Row', sets: '3', reps: '10–12 reps', rest: '60s', tip: 'Chest tall. Squeeze scapula together.', yt: 'seated+cable+row+form' },
      { name: 'Face Pulls', sets: '3', reps: '15 reps', rest: '60s', tip: 'Pull to ear level. External rotation at top.', yt: 'face+pull+exercise+form' },
      { name: 'Barbell Curls', sets: '3', reps: '10–12 reps', rest: '60s', tip: 'Don't swing. Pause at top for a second.', yt: 'barbell+curl+proper+form' },
      { name: 'Hammer Curls', sets: '3', reps: '10–12 reps', rest: '60s', tip: 'Neutral grip. Targets brachialis.', yt: 'hammer+curl+exercise' },
    ]},
    { day: 'Wed', label: 'Wednesday', focus: 'Legs — Quads / Hamstrings / Calves', exercises: [
      { name: 'Back Squat', sets: '4', reps: '6–8 reps', rest: '2 min', tip: 'Hit parallel or below. Knees track toes.', yt: 'back+squat+proper+form' },
      { name: 'Romanian Deadlifts', sets: '3', reps: '8–10 reps', rest: '90s', tip: 'Feel hamstring stretch. Hip hinge, not squat.', yt: 'romanian+deadlift+form' },
      { name: 'Leg Press', sets: '3', reps: '10–12 reps', rest: '90s', tip: 'Full range. Don't lock out knees at top.', yt: 'leg+press+proper+form' },
      { name: 'Leg Curls', sets: '3', reps: '12–15 reps', rest: '60s', tip: 'Curl to glutes. Squeeze at top.', yt: 'leg+curl+exercise+form' },
      { name: 'Leg Extensions', sets: '3', reps: '12–15 reps', rest: '60s', tip: 'Full extension. Pause and squeeze quads.', yt: 'leg+extension+exercise' },
      { name: 'Standing Calf Raises', sets: '4', reps: '15–20 reps', rest: '45s', tip: 'Full stretch at bottom. Pause at top.', yt: 'calf+raise+exercise+form' },
    ]},
    { day: 'Thu', label: 'Thursday', focus: 'Rest / Active Recovery', isRest: true, exercises: [
      { name: 'Light Walk', sets: '1', reps: '20 min', rest: '—', tip: 'Promotes blood flow and recovery.', yt: 'active+recovery+tips' },
      { name: 'Foam Rolling', sets: '1', reps: '10 min', rest: '—', tip: 'Focus on quads, lats, upper back.', yt: 'foam+rolling+full+body' },
    ]},
    { day: 'Fri', label: 'Friday', focus: 'Push — Strength Focus', exercises: [
      { name: 'Dumbbell Bench Press', sets: '4', reps: '8–10 reps', rest: '90s', tip: 'Greater range of motion than barbell.', yt: 'dumbbell+bench+press+form' },
      { name: 'Arnold Press', sets: '3', reps: '10 reps', rest: '60s', tip: 'Rotate palms out as you press up.', yt: 'arnold+press+exercise' },
      { name: 'Cable Flyes', sets: '3', reps: '12–15 reps', rest: '60s', tip: 'Slight bend in elbow. Squeeze at center.', yt: 'cable+fly+chest+exercise' },
      { name: 'Dips', sets: '3', reps: '10–12 reps', rest: '60s', tip: 'Lean forward for chest. Upright for triceps.', yt: 'dips+exercise+form' },
      { name: 'Overhead Tricep Extension', sets: '3', reps: '12 reps', rest: '60s', tip: 'Lock upper arms. Move only the forearm.', yt: 'overhead+tricep+extension+form' },
    ]},
    { day: 'Sat', label: 'Saturday', focus: 'Pull + Legs (Light)', exercises: [
      { name: 'Cable Rows', sets: '3', reps: '12 reps', rest: '60s', tip: 'Moderate weight. Focus on mind-muscle.', yt: 'cable+row+form' },
      { name: 'Incline Dumbbell Curls', sets: '3', reps: '12 reps', rest: '60s', tip: 'Full stretch at bottom. Great for peak.', yt: 'incline+dumbbell+curl+form' },
      { name: 'Bulgarian Split Squats', sets: '3', reps: '10 each', rest: '60s', tip: 'Back foot elevated. Drop straight down.', yt: 'bulgarian+split+squat+form' },
      { name: 'Hip Thrusts', sets: '3', reps: '15 reps', rest: '60s', tip: 'Drive hips up. Squeeze glutes hard at top.', yt: 'hip+thrust+exercise+form' },
    ]},
    { day: 'Sun', label: 'Sunday', focus: 'Full Rest', isRest: true, exercises: [
      { name: 'Complete Rest', sets: '—', reps: '—', rest: '—', tip: 'Muscle is built during rest. Protect your sleep.', yt: 'sleep+muscle+recovery' },
    ]},
  ],
}

WORKOUTS.RECOMPOSITION = WORKOUTS.FAT_LOSS.map((d, i) =>
  i % 2 === 0 ? d : { ...d, focus: d.isRest ? d.focus : 'Strength + Cardio Mix', exercises: [...(WORKOUTS.MUSCLE_GAIN[i]?.exercises.slice(0,3) || d.exercises), ...d.exercises.slice(0,2)] }
)
WORKOUTS.MAINTENANCE = WORKOUTS.FAT_LOSS
WORKOUTS.ATHLETIC_PERFORMANCE = WORKOUTS.MUSCLE_GAIN

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const GOAL_LABELS: Record<string, string> = {
  FAT_LOSS: 'Fat Loss', MUSCLE_GAIN: 'Muscle Building', RECOMPOSITION: 'Recomposition',
  MAINTENANCE: 'Maintenance', ATHLETIC_PERFORMANCE: 'Athletic Performance',
}

export default function ExercisePage() {
  const [profile, setProfile] = useState<{ goal: string; currentWeight: number; name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [todayIdx] = useState(() => new Date().getDay() === 0 ? 6 : new Date().getDay() - 1)
  const [activeDay, setActiveDay] = useState(todayIdx)
  const [doneExercises, setDoneExercises] = useState<Set<string>>(new Set())
  const [expandedEx, setExpandedEx] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/client/profile')
      .then(r => r.json())
      .then(d => { setProfile(d); setLoading(false) })
      .catch(() => { setProfile({ goal: 'FAT_LOSS', currentWeight: 180, name: '' }); setLoading(false) })
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
      <div style={{ width: 32, height: 32, border: '2px solid #b8985a', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )

  const goal = profile?.goal || 'FAT_LOSS'
  const plan = WORKOUTS[goal] || WORKOUTS.FAT_LOSS
  const day = plan[activeDay]
  const waterOz = Math.round((profile?.currentWeight || 180) * 0.67)
  const sleepHrs = ['MUSCLE_GAIN', 'ATHLETIC_PERFORMANCE'].includes(goal) ? 9 : 8

  function toggleDone(key: string) {
    setDoneExercises(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  const totalToday = day.exercises.filter(e => e.sets !== '—').length
  const doneToday = day.exercises.filter((e, i) => doneExercises.has(activeDay + '-' + i)).length

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: '#b8985a', letterSpacing: '0.1em', marginBottom: '4px' }}>
          {GOAL_LABELS[goal]} Program
        </div>
        <h1 style={{ fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', color: '#e8e0d0', margin: 0 }}>
          Your Workout Plan
        </h1>
      </div>

      {/* Daily targets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.08em', marginBottom: '6px' }}>💧 DAILY WATER</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#b8985a' }}>{waterOz}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>oz per day</div>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>≈ {Math.ceil(waterOz / 8)} glasses of water</div>
        </div>
        <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '14px' }}>
          <div style={{ fontSize: '10px', color: '#555', letterSpacing: '0.08em', marginBottom: '6px' }}>😴 NIGHTLY SLEEP</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#b8985a' }}>{sleepHrs}</div>
          <div style={{ fontSize: '11px', color: '#666' }}>hours minimum</div>
          <div style={{ fontSize: '10px', color: '#444', marginTop: '4px' }}>Best gains happen during sleep</div>
        </div>
      </div>

      {/* Day selector */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        {plan.map((d, i) => {
          const isToday = i === todayIdx
          const isActive = i === activeDay
          return (
            <button key={i} onClick={() => setActiveDay(i)}
              style={{ flex: '0 0 auto', padding: '8px 12px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer',
                fontWeight: isActive ? 700 : 400,
                background: isActive ? '#b8985a' : (isToday ? '#1a1508' : '#111'),
                border: `1px solid ${isActive ? '#b8985a' : isToday ? '#b8985a66' : '#1e1e1e'}`,
                color: isActive ? '#080808' : isToday ? '#b8985a' : '#888' }}>
              {d.day}
              {isToday && !isActive && <span style={{ display: 'block', fontSize: '8px', color: '#b8985a' }}>Today</span>}
            </button>
          )
        })}
      </div>

      {/* Today's workout */}
      <div style={{ background: '#111', border: '1px solid #1e1e1e', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#555', marginBottom: '3px' }}>{day.label}</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: day.isRest ? '#555' : '#e8e0d0' }}>{day.focus}</div>
          </div>
          {!day.isRest && totalToday > 0 && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: doneToday === totalToday ? '#22c55e' : '#b8985a' }}>
                {doneToday}/{totalToday}
              </div>
              <div style={{ fontSize: '10px', color: '#555' }}>done</div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {day.exercises.map((ex, i) => {
            const key = activeDay + '-' + i
            const done = doneExercises.has(key)
            const expanded = expandedEx === key
            return (
              <div key={i}
                style={{ background: done ? 'rgba(34,197,94,0.06)' : '#0d0d0d', borderRadius: '10px',
                  border: `1px solid ${done ? '#22c55e44' : '#1e1e1e'}`, overflow: 'hidden', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', cursor: 'pointer' }}
                  onClick={() => setExpandedEx(expanded ? null : key)}>
                  {ex.sets !== '—' && (
                    <button onClick={e => { e.stopPropagation(); toggleDone(key) }}
                      style={{ width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
                        border: `2px solid ${done ? '#22c55e' : '#333'}`,
                        background: done ? '#22c55e' : 'transparent', fontSize: '12px', color: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done ? '✓' : ''}
                    </button>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: done ? '#22c55e' : '#e8e0d0', textDecoration: done ? 'line-through' : 'none' }}>
                      {ex.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                      {ex.sets !== '—' ? `${ex.sets} sets × ${ex.reps}  ·  rest ${ex.rest}` : ex.reps}
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#444' }}>{expanded ? '▲' : '▼'}</span>
                </div>
                {expanded && (
                  <div style={{ padding: '0 14px 14px', borderTop: '1px solid #1a1a1a' }}>
                    <p style={{ fontSize: '12px', color: '#888', margin: '10px 0 12px', lineHeight: 1.6 }}>
                      💡 {ex.tip}
                    </p>
                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.yt + ' tutorial')}`}
                      target="_blank" rel="noopener"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600,
                        color: '#e8e0d0', background: '#1e0000', border: '1px solid #ff444444', borderRadius: '8px',
                        padding: '8px 14px', textDecoration: 'none' }}>
                      ▶ Watch How To Do This Exercise
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Supplement timing reminder */}
      <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', borderRadius: '12px', padding: '14px' }}>
        <div style={{ fontSize: '11px', color: '#b8985a', letterSpacing: '0.08em', marginBottom: '8px' }}>💊 SUPPLEMENT TIMING TODAY</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { time: 'Morning', items: 'Creatine · Vitamin D · Fish Oil' },
            { time: '30 min pre-workout', items: 'Protein shake (if training today)' },
            { time: 'Post-workout', items: 'Protein + fast carbs within 30 min' },
            { time: 'Night', items: 'Magnesium Glycinate · ZMA (if applicable)' },
          ].map(s => (
            <div key={s.time} style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
              <span style={{ color: '#555', minWidth: '110px', flexShrink: 0 }}>{s.time}</span>
              <span style={{ color: '#888' }}>{s.items}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
