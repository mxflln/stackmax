import { useState } from 'react';
import Head from 'next/head';

const GOALS = [
  { id: 'skin', label: 'Skin & Appearance', emoji: '✨', color: 'purple' },
  { id: 'muscle', label: 'Muscle & Strength', emoji: '💪', color: 'orange' },
  { id: 'fat', label: 'Fat Loss', emoji: '🔥', color: 'red' },
  { id: 'sleep', label: 'Sleep & Recovery', emoji: '😴', color: 'blue' },
  { id: 'energy', label: 'Energy & Focus', emoji: '⚡', color: 'accent' },
  { id: 'hair', label: 'Hair & Nails', emoji: '💈', color: 'purple' },
  { id: 'gut', label: 'Gut Health', emoji: '🌿', color: 'accent' },
  { id: 'hormones', label: 'Hormones & Libido', emoji: '⚡', color: 'orange' },
  { id: 'immune', label: 'Immune System', emoji: '🛡️', color: 'blue' },
  { id: 'joint', label: 'Joints & Mobility', emoji: '🦴', color: 'gray' },
  { id: 'mood', label: 'Mood & Stress', emoji: '🧠', color: 'purple' },
  { id: 'longevity', label: 'Longevity & Anti-aging', emoji: '⏳', color: 'accent' },
];

const PILL_COLORS = {
  purple: 'pill-purple', orange: 'pill-orange', red: 'pill-red',
  blue: 'pill-blue', accent: 'pill-accent', gray: 'pill-gray'
};

const PRO_PRICE = 'A$9.99';
const PRO_UNLOCK_KEY = 'stackmax_pro';

export default function Home() {
  const [step, setStep] = useState('landing');
  const [goals, setGoals] = useState([]);
  const [profile, setProfile] = useState({ age: '', sex: '', budget: '', current: '', health: '', diet: '' });
  const [loading, setLoading] = useState(false);
  const [freeStack, setFreeStack] = useState(null);
  const [proStack, setProStack] = useState(null);
  const [activeTab, setActiveTab] = useState('stack');
  const [isPro] = useState(() => typeof window !== 'undefined' && localStorage.getItem(PRO_UNLOCK_KEY) === 'true');

  const toggleGoal = (id) => {
    setGoals(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  };

  const generateStack = async (pro = false) => {
    setLoading(true);
    try {
      const res = await fetch('/api/stack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { ...profile, goals: goals.map(id => GOALS.find(g => g.id === id)?.label) },
          isPro: pro
        })
      });
      const data = await res.json();
      if (pro) {
        setProStack(data);
        setStep('pro-results');
      } else {
        setFreeStack(data);
        setStep('results');
      }
    } catch (e) {
      alert('Something went wrong. Try again.');
    }
    setLoading(false);
  };

  const handleUnlock = () => {
    // In production, redirect to Gumroad / Stripe
    // For now simulate unlock
    if (typeof window !== 'undefined') {
      localStorage.setItem(PRO_UNLOCK_KEY, 'true');
    }
    generateStack(true);
  };

  const priorityColor = (p) => {
    if (!p) return 'pill-gray';
    const lower = p.toLowerCase();
    if (lower.includes('must')) return 'pill-accent';
    if (lower.includes('highly')) return 'pill-orange';
    return 'pill-gray';
  };

  // LANDING
  if (step === 'landing') return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Head><title>StackMax — Build Your Perfect Supplement Stack</title></Head>

      <div style={{ flex: 1, padding: '60px 24px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div className="fade-up" style={{ marginBottom: 8 }}>
            <span className="pill pill-accent">AI-Powered</span>
          </div>
          <h1 className="fade-up-1" style={{ fontSize: 72, lineHeight: 1, color: '#fff', marginBottom: 8 }}>STACK<br /><span style={{ color: 'var(--accent)' }}>MAX</span></h1>
          <p className="fade-up-2" style={{ fontSize: 17, color: 'var(--text2)', lineHeight: 1.6, maxWidth: 320, marginBottom: 40 }}>
            Your personalised supplement stack, built by AI. Optimised for your goals, body, and budget.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
            {[
              { emoji: '🎯', text: 'Tell us your goals' },
              { emoji: '🧬', text: 'AI builds your stack' },
              { emoji: '💊', text: 'Know exactly what to take & when' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg3)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{item.emoji}</div>
                <span style={{ fontSize: 15, color: 'var(--text2)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="fade-up-4">
          <button
            onClick={() => setStep('goals')}
            style={{ width: '100%', background: 'var(--accent)', color: '#0a0a0a', padding: '18px 24px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 600, letterSpacing: 0.3, marginBottom: 12 }}
          >
            Build My Stack — Free
          </button>
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)' }}>
            No account needed · Takes 2 minutes
          </p>
        </div>
      </div>
    </div>
  );

  // GOALS STEP
  if (step === 'goals') return (
    <div style={{ padding: '24px 20px 40px' }}>
      <Head><title>StackMax — Your Goals</title></Head>

      <button onClick={() => setStep('landing')} style={{ background: 'none', color: 'var(--text2)', fontSize: 14, marginBottom: 24, padding: '8px 0' }}>← Back</button>

      <h2 style={{ fontSize: 40, marginBottom: 6 }}>YOUR<br />GOALS</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 24 }}>Select everything you want to optimise. No limit.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 32 }}>
        {GOALS.map(goal => {
          const selected = goals.includes(goal.id);
          return (
            <button
              key={goal.id}
              onClick={() => toggleGoal(goal.id)}
              style={{
                background: selected ? 'var(--accent-dim)' : 'var(--bg2)',
                border: selected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '14px 12px',
                textAlign: 'left',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>{goal.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: selected ? 'var(--accent)' : 'var(--text)', lineHeight: 1.3 }}>{goal.label}</div>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => setStep('profile')}
        disabled={goals.length === 0}
        style={{
          width: '100%', background: goals.length > 0 ? 'var(--accent)' : 'var(--bg3)',
          color: goals.length > 0 ? '#0a0a0a' : 'var(--text3)',
          padding: '18px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 600
        }}
      >
        Continue ({goals.length} selected)
      </button>
    </div>
  );

  // PROFILE STEP
  if (step === 'profile') return (
    <div style={{ padding: '24px 20px 40px' }}>
      <Head><title>StackMax — Your Profile</title></Head>

      <button onClick={() => setStep('goals')} style={{ background: 'none', color: 'var(--text2)', fontSize: 14, marginBottom: 24, padding: '8px 0' }}>← Back</button>

      <h2 style={{ fontSize: 40, marginBottom: 6 }}>YOUR<br />PROFILE</h2>
      <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 28 }}>Help us personalise your stack. All optional.</p>

      {[
        { key: 'age', label: 'Age', placeholder: 'e.g. 24', type: 'number' },
        { key: 'current', label: 'Current supplements', placeholder: 'e.g. Creatine, Vitamin D...' },
        { key: 'budget', label: 'Monthly budget (AUD)', placeholder: 'e.g. 50', type: 'number' },
        { key: 'health', label: 'Health notes / conditions', placeholder: 'e.g. No issues / on medication...' },
        { key: 'diet', label: 'Diet', placeholder: 'e.g. Omnivore, Vegan, Carnivore...' },
      ].map(field => (
        <div key={field.key} style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: 0.05, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 8 }}>{field.label}</label>
          <input
            type={field.type || 'text'}
            placeholder={field.placeholder}
            value={profile[field.key]}
            onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
            style={{
              width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '14px 16px', fontSize: 15,
              color: 'var(--text)', '::placeholder': { color: 'var(--text3)' }
            }}
          />
        </div>
      ))}

      <div style={{ marginBottom: 28 }}>
        <label style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: 0.05, textTransform: 'uppercase', fontWeight: 500, display: 'block', marginBottom: 8 }}>Sex</label>
        <div style={{ display: 'flex', gap: 10 }}>
          {['Male', 'Female', 'Prefer not to say'].map(s => (
            <button
              key={s}
              onClick={() => setProfile(p => ({ ...p, sex: s }))}
              style={{
                flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500,
                background: profile.sex === s ? 'var(--accent-dim)' : 'var(--bg2)',
                border: profile.sex === s ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                color: profile.sex === s ? 'var(--accent)' : 'var(--text2)'
              }}
            >{s}</button>
          ))}
        </div>
      </div>

      <button
        onClick={() => generateStack(false)}
        disabled={loading}
        style={{ width: '100%', background: 'var(--accent)', color: '#0a0a0a', padding: '18px', borderRadius: 'var(--radius)', fontSize: 16, fontWeight: 600 }}
      >
        {loading ? '⏳ Building your stack...' : 'Build My Free Stack →'}
      </button>

      {loading && (
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginTop: 16 }}>
          Analysing your goals & profile...
        </p>
      )}
    </div>
  );

  // FREE RESULTS
  if (step === 'results' && freeStack) return (
    <div style={{ padding: '24px 20px 40px' }}>
      <Head><title>StackMax — Your Stack</title></Head>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <span className="pill pill-accent" style={{ marginBottom: 8, display: 'inline-block' }}>Free Stack</span>
          <h2 style={{ fontSize: 36, lineHeight: 1 }}>YOUR<br />STARTER STACK</h2>
        </div>
        <button onClick={() => setStep('landing')} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
          Restart
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
        {(freeStack.stack || []).map((supp, i) => (
          <div key={i} className={`fade-up-${i + 1}`} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 26 }}>{supp.emoji}</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>{supp.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text2)' }}>{supp.dose}</div>
                </div>
              </div>
              <span className="pill pill-gray">{supp.timing}</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{supp.why}</p>
            {supp.category && <span className="pill pill-accent" style={{ marginTop: 10, display: 'inline-block' }}>{supp.category}</span>}
          </div>
        ))}
      </div>

      {/* PRO UPSELL */}
      <div style={{ background: 'linear-gradient(135deg, rgba(200,245,58,0.08) 0%, rgba(200,245,58,0.02) 100%)', border: '1.5px solid rgba(200,245,58,0.25)', borderRadius: 'var(--radius)', padding: '24px 20px', marginBottom: 20 }}>
        <span className="pill pill-accent" style={{ marginBottom: 12, display: 'inline-block' }}>Unlock Pro</span>
        <h3 style={{ fontSize: 26, marginBottom: 8 }}>GET THE FULL STACK</h3>
        <p style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 18, lineHeight: 1.6 }}>
          Unlock 10–12 supplements, daily timing routine, interaction warnings, Aussie sources & monthly cost breakdown.
        </p>
        <ul style={{ listStyle: 'none', marginBottom: 20 }}>
          {[
            '🔬 Full 10–12 supplement stack',
            '⏰ Morning / pre-workout / evening routine',
            '⚠️ Interaction warnings',
            '🛒 Cheapest AU sources (iHerb, CW, Bulk Nutrients)',
            '💰 Monthly cost breakdown',
          ].map((item, i) => (
            <li key={i} style={{ fontSize: 14, color: 'var(--text2)', padding: '5px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              {item}
            </li>
          ))}
        </ul>
        <button
          onClick={handleUnlock}
          disabled={loading}
          style={{ width: '100%', background: 'var(--accent)', color: '#0a0a0a', padding: '17px', borderRadius: 'var(--radius)', fontSize: 15, fontWeight: 600 }}
        >
          {loading ? 'Building...' : `Unlock Full Stack — ${PRO_PRICE}`}
        </button>
        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text3)', marginTop: 10 }}>One-time payment · Instant access</p>
      </div>
    </div>
  );

  // PRO RESULTS
  if (step === 'pro-results' && proStack) return (
    <div style={{ padding: '24px 20px 40px' }}>
      <Head><title>StackMax Pro — Your Full Stack</title></Head>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <span className="pill pill-accent" style={{ marginBottom: 8, display: 'inline-block' }}>Pro Stack</span>
          <h2 style={{ fontSize: 34, lineHeight: 1 }}>YOUR<br />FULL STACK</h2>
        </div>
        <button onClick={() => setStep('landing')} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 14px', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
          Restart
        </button>
      </div>

      {proStack.totalMonthlyCost && (
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: 'var(--text2)' }}>Est. monthly cost</span>
          <span style={{ fontSize: 20, fontWeight: 600, color: 'var(--accent)' }}>{proStack.totalMonthlyCost}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, background: 'var(--bg2)', borderRadius: 'var(--radius-sm)', padding: 4 }}>
        {['stack', 'routine', 'warnings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '10px', borderRadius: 6, fontSize: 13, fontWeight: 500, textTransform: 'capitalize',
              background: activeTab === tab ? 'var(--accent)' : 'transparent',
              color: activeTab === tab ? '#0a0a0a' : 'var(--text2)',
            }}
          >{tab}</button>
        ))}
      </div>

      {/* Stack Tab */}
      {activeTab === 'stack' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(proStack.stack || []).map((supp, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 24 }}>{supp.emoji}</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{supp.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text2)' }}>{supp.dose} · {supp.timing}</div>
                  </div>
                </div>
                {supp.priority && <span className={`pill ${priorityColor(supp.priority)}`}>{supp.priority}</span>}
              </div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 10 }}>{supp.why}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {supp.source && <span className="pill pill-blue">🛒 {supp.source}</span>}
                {supp.monthlyCost && <span className="pill pill-gray">💰 {supp.monthlyCost}/mo</span>}
                {supp.category && <span className="pill pill-accent">{supp.category}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Routine Tab */}
      {activeTab === 'routine' && proStack.routine && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'morning', label: '☀️ Morning', color: 'var(--orange)' },
            { key: 'preWorkout', label: '🏋️ Pre-Workout', color: 'var(--accent)' },
            { key: 'evening', label: '🌙 Evening', color: 'var(--blue)' },
            { key: 'beforeBed', label: '😴 Before Bed', color: 'var(--purple)' },
          ].map(slot => {
            const items = proStack.routine[slot.key];
            if (!items || items.length === 0) return null;
            return (
              <div key={slot.key} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: slot.color, marginBottom: 10 }}>{slot.label}</div>
                {items.map((item, i) => (
                  <div key={i} style={{ fontSize: 14, color: 'var(--text2)', padding: '5px 0', borderBottom: i < items.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: slot.color, flexShrink: 0, display: 'inline-block' }}></span>
                    {item}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Warnings Tab */}
      {activeTab === 'warnings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(!proStack.interactions || proStack.interactions.length === 0) ? (
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
              <p style={{ fontSize: 15, color: 'var(--text2)' }}>No major interactions found in your stack.</p>
            </div>
          ) : (
            proStack.interactions.map((warn, i) => (
              <div key={i} style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: 'var(--radius)', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6 }}>{warn}</p>
                </div>
              </div>
            ))
          )}
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginTop: 8 }}>
            <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.6 }}>
              ⚕️ StackMax provides general wellness information, not medical advice. Consult your doctor before starting any new supplement regimen.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  // Loading screen
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: 48, height: 48, border: '3px solid var(--border)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: 20 }}></div>
      <h3 style={{ fontSize: 28, marginBottom: 8 }}>BUILDING<br />YOUR STACK</h3>
      <p style={{ fontSize: 14, color: 'var(--text2)' }}>Analysing your goals & profile...</p>
    </div>
  );
}
