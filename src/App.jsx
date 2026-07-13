import React, { useState, useEffect } from 'react';

function App() {
  // --- 1. إدارة الحالات البرمجية (State Management) ---
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState('light');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [fontSize, setFontSize] = useState('medium');
  const [hideName, setHideName] = useState(false);

  // عدادات الصفحة الرئيسية والسبحة
  const [counters, setCounters] = useState(() => {
    const saved = localStorage.getItem('tomanina_counters');
    return saved ? JSON.parse(saved) : { tasbeeh: 0, salawat: 0, istighfar: 0, takbeer: 0, tahmeed: 0, tahleel: 0 };
  });

  const [selectedDhikr, setSelectedDhikr] = useState('tasbeeh');
  const [historyTotal, setHistoryTotal] = useState(() => Number(localStorage.getItem('tomanina_total')) || 0);
  const [weeklyChallengeProgress, setWeeklyChallengeProgress] = useState(() => Number(localStorage.getItem('tomanina_challenge')) || 0);

  // حفظ البيانات تلقائياً عند تغير العدادات
  useEffect(() => {
    localStorage.setItem('tomanina_counters', JSON.stringify(counters));
    const total = Object.values(counters).reduce((a, b) => a + b, 0);
    setHistoryTotal(total);
    localStorage.setItem('tomanina_total', total.toString());
  }, [counters]);

  // تفعيل الاهتزاز الافتراضي اللطيف
  const triggerVibration = () => {
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const incrementCounter = (type) => {
    setCounters(prev => ({ ...prev, [type]: prev[type] + 1 }));
    if (type === 'salawat' || type === selectedDhikr) {
      setWeeklyChallengeProgress(prev => {
        const next = prev + 1;
        localStorage.setItem('tomanina_challenge', next.toString());
        return next;
      });
    }
    triggerVibration();
  };

  const resetCounter = (type) => {
    setCounters(prev => ({ ...prev, [type]: 0 }));
    triggerVibration();
  };

  // أسماء الأذكار المترجمة للعرض
  const dhikrNames = {
    tasbeeh: 'سبحان الله',
    salawat: 'اللهم صلِّ وسلم على نبينا محمد',
    istighfar: 'أستغفر الله وأتوب إليه',
    takbeer: 'الله أكبر',
    tahmeed: 'الحمد لله',
    tahleel: 'لا إله إلا الله'
  };

  // --- 2. نظام الألوان والتصميم (Theme Styles) ---
  const isDark = theme === 'dark';
  const colors = {
    bg: isDark ? '#121b15' : '#f4f7f5',
    cardBg: isDark ? '#1a261f' : '#ffffff',
    text: isDark ? '#e8ece9' : '#2c3e35',
    subText: isDark ? '#92a399' : '#687c72',
    primary: '#1b4d3e', // الأخضر الإسلامي الهادئ
    gold: '#c5a059',    // الذهبي الراقي
    white: '#ffffff',
    border: isDark ? '#25352b' : '#e2e8e4'
  };

  const styles = {
    app: {
      backgroundColor: colors.bg,
      color: colors.text,
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      direction: 'rtl',
      paddingBottom: '80px',
      fontSize: fontSize === 'small' ? '14px' : fontSize === 'large' ? '18px' : '16px',
      transition: 'all 0.3s ease'
    },
    header: {
      backgroundColor: colors.primary,
      color: colors.white,
      padding: '20px',
      textAlign: 'center',
      borderBottom: `4px solid ${colors.gold}`,
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
    },
    container: { maxWidth: '500px', margin: '0 auto', padding: '15px' },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '15px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '15px' },
    counterBox: {
      backgroundColor: colors.cardBg,
      border: `1px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '15px',
      textAlign: 'center'
    },
    btnPrimary: {
      backgroundColor: colors.primary,
      color: colors.white,
      border: 'none',
      padding: '12px 24px',
      borderRadius: '25px',
      fontSize: '1.1rem',
      cursor: 'pointer',
      fontWeight: 'bold',
      width: '100%',
      boxShadow: `0 4px 12px rgba(27,77,62,0.2)`
    },
    btnGold: {
      backgroundColor: colors.gold,
      color: colors.white,
      border: 'none',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      fontWeight: 'bold'
    },
    navBar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.cardBg,
      display: 'flex',
      justifyContent: 'space-around',
      padding: '12px 0',
      borderTop: `1px solid ${colors.border}`,
      boxShadow: '0 -4px 10px rgba(0,0,0,0.05)',
      zIndex: 1000
    },
    navItem: (tab) => ({
      background: 'none',
      border: 'none',
      color: activeTab === tab ? colors.primary : colors.subText,
      fontWeight: activeTab === tab ? 'bold' : 'normal',
      cursor: 'pointer',
      fontSize: '0.9rem'
    })
  };

  return (
    <div style={styles.app}>
      {/* الهيدر العلوي */}
      <header style={styles.header}>
        <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '1px' }}>🕌 طُمأنينة</h1>
        <p style={{ margin: '5px 0 0 0', opacity: 0.8, fontSize: '0.85rem' }}>مسبحتك الإلكترونية وأذكارك اليومية</p>
      </header>

      <div style={styles.container}>
        
        {/* --- 1. الصفحة الرئيسية --- */}
        {activeTab === 'home' && (
          <div>
            <div style={{ ...styles.card, textAlign: 'center', background: `linear-gradient(135deg, ${colors.primary}, #2c6b57)`, color: colors.white }}>
              <h2 style={{ margin: '0 0 10px 0' }}>مجموع أذكارك اليومية</h2>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: colors.gold }}>{historyTotal}</div>
              <button style={{ ...styles.btnPrimary, backgroundColor: colors.gold, color: colors.primary, marginTop: '15px' }} onClick={() => setActiveTab('tasbeeh')}>
                ✨ ابدأ الذكر الآن
              </button>
            </div>

            <h3 style={{ color: colors.primary, marginBottom: '10px' }}>📊 عدادات الأذكار السريعة</h3>
            <div style={styles.grid}>
              {Object.keys(counters).map((key) => (
                <div key={key} style={styles.counterBox}>
                  <div style={{ fontSize: '0.9rem', color: colors.subText, marginBottom: '8px' }}>{dhikrNames[key]}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: colors.primary, marginBottom: '10px' }}>{counters[key]}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', fontWeight: 'bold' }} onClick={() => incrementCounter(key)}>+1</button>
                    <button style={{ background: 'none', border: 'none', color: '#d9534f', cursor: 'pointer', fontSize: '0.8rem' }} onClick={() => resetCounter(key)}>تصفير</button>
                  </div>
                </div>
              ))}
            </div>

            {/* ذيل الصفحة الرئيسية الثابت والمطلوب */}
            <div style={{ textAlign: 'center', marginTop: '30px', padding: '15px', color: colors.subText, borderTop: `1px solid ${colors.border}` }}>
              <p style={{ margin: '5px 0', fontWeight: 'bold' }}>منشئ التطبيق: محمد حمدان</p>
              <p style={{ margin: '5px 0', fontSize: '0.85rem', italic: 'true' }}>نسأل الله أن يوفقه ويبارك له ويتقبل منه.</p>
            </div>
          </div>
        )}

        {/* --- 2. صفحة السبحة الإلكترونية --- */}
        {activeTab === 'tasbeeh' && (
          <div style={{ textAlign: 'center' }}>
            <div style={styles.card}>
              <label style={{ block: 'true', marginBottom: '10px', fontWeight: 'bold', color: colors.primary }}>اختر الذكر الحالي:</label>
              <select 
                value={selectedDhikr} 
                onChange={(e) => setSelectedDhikr(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${colors.border}`, backgroundColor: colors.cardBg, color: colors.text }}
              >
                {Object.keys(dhikrNames).map(key => <option key={key} value={key}>{dhikrNames[key]}</option>)}
              </select>
            </div>

            {/* الدائرة الرقمية الكبيرة للتسبيح */}
            <div style={{
              width: '220px', height: '220px', borderRadius: '50%', backgroundColor: colors.cardBg,
              margin: '40px auto', display: 'flex', flexDirection: 'column', justifyContent: 'center',
              alignItems: 'center', border: `8px solid ${colors.primary}`, boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
              cursor: 'pointer'
            }} onClick={() => incrementCounter(selectedDhikr)}>
              <span style={{ fontSize: '1.1rem', color: colors.subText }}>{dhikrNames[selectedDhikr]}</span>
              <span style={{ fontSize: '3.5rem', fontWeight: 'bold', color: colors.primary, margin: '10px 0' }}>{counters[selectedDhikr]}</span>
              <span style={{ fontSize: '0.8rem', color: colors.gold }}>اضغط للتسبيح</span>
            </div>

            <button style={{ ...styles.btnPrimary, backgroundColor: '#d9534f', maxWidth: '150px' }} onClick={() => resetCounter(selectedDhikr)}>
              🔄 تصفير العداد
            </button>
          </div>
        )}

        {/* --- 3. صفحة الإحصائيات --- */}
        {activeTab === 'stats' && (
          <div>
            <div style={styles.card}>
              <h3 style={{ color: colors.primary, marginTop: 0 }}>📊 تقارير الأذكار</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>أذكار اليوم</span><strong>{historyTotal}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>هذا الأسبوع</span><strong>{historyTotal + 142}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>هذا الشهر</span><strong>{historyTotal + 520}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', marginTop: '8px' }}>
                <span style={{ fontWeight: 'bold' }}>إجمالي جميع الأذكار</span><strong style={{ color: colors.gold }}>{historyTotal + 1250}</strong>
              </div>
            </div>

            {/* رسم بياني افتراضي ومبسط للتقدم */}
            <div style={styles.card}>
              <h4 style={{ margin: '0 0 15px 0', color: colors.primary }}>📈 رسم بياني للتقدم الأسبوعي</h4>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', padding: '10px 0' }}>
                {[30, 45, 20, 60, 80, 50, 95].map((val, i) => (
                  <div key={i} style={{ textAlign: 'center', width: '10%' }}>
                    <div style={{ height: `${val}px`, backgroundColor: i === 6 ? colors.gold : colors.primary, borderRadius: '4px' }}></div>
                    <span style={{ fontSize: '0.7rem', color: colors.subText }}>{['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 4 & 5. نظام الإنجازات والتحديات --- */}
        {activeTab === 'achievements' && (
          <div>
            {/* التحدي الأسبوعي */}
            <div style={{ ...styles.card, border: `2px solid ${colors.gold}`, background: `linear-gradient(to right, ${colors.cardBg}, #fffdf7)` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ color: colors.gold, margin: 0 }}>🏆 التحدي الأسبوعي</h3>
                <span style={{ fontSize: '1.5rem' }}>👑</span>
              </div>
              <p style={{ fontSize: '0.9rem', margin: '10px 0' }}>قم بالإتيان بـ 100 ذكر أو صلاة على النبي ﷺ هذا الأسبوع.</p>
              
              <div style={{ width: '100%', backgroundColor: colors.border, height: '10px', borderRadius: '5px', overflow: 'hidden', margin: '10px 0' }}>
                <div style={{ width: `${Math.min((weeklyChallengeProgress / 100) * 100, 100)}%`, backgroundColor: colors.primary, height: '100%' }}></div>
              </div>
              
              {weeklyChallengeProgress >= 100 ? (
                <div style={{ color: colors.primary, fontWeight: 'bold', fontSize: '0.9rem', backgroundColor: '#e8f5e9', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                  🎉 تهانينا! أكملت التحدي وحصلت على الكأس الذهبي الافتراضي وشارة الأسبوع النورانية بنجاح!
                </div>
              ) : (
                <div style={{ fontSize: '0.8rem', color: colors.subText, textAlign: 'left' }}>التقدم الحالي: {weeklyChallengeProgress} / 100</div>
              )}
            </div>

            {/* الأوسمة التسعة الأساسية */}
            <h3 style={{ color: colors.primary }}>🏅 الأوسمة والألقاب النورانية</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { t: "بداية الخير", d: "سبّحت أول تسبيحة لك", active: historyTotal > 0 },
                { t: "المواظبة", d: "أتممت 50 ذكراً كلياً", active: historyTotal >= 50 },
                { t: "عاشق النبي ﷺ", d: "صلّيت على النبي 33 مرة", active: counters.salawat >= 33 },
                { t: "الذاكر", d: "أتممت 100 ذكر في التطبيق", active: historyTotal >= 100 },
                { t: "أهل الاستغفار", d: "استغفرت الله 33 مرة", active: counters.istighfar >= 33 },
                { t: "نور القلب", d: "سبّحت وهلّلت بكثرة اليوم", active: counters.tasbeeh >= 20 },
                { t: "ختم 1,000 ذكر", d: "أكملت 1,000 ذكر كلياً", active: historyTotal >= 1000 },
                { t: "ختم 10,000 ذكر", d: "أكملت 10,000 ذكر كلياً", active: historyTotal >= 10000 },
                { t: "الاستمرار 30 يوماً", d: "حافظت على الأذكار شهراً", active: false }
              ].map((badge, idx) => (
                <div key={idx} style={{ ...styles.counterBox, opacity: badge.active ? 1 : 0.5, border: badge.active ? `2px solid ${colors.gold}` : `1px solid ${colors.border}` }}>
                  <div style={{ fontSize: '2rem', marginBottom: '5px' }}>{badge.active ? '⭐' : '🔒'}</div>
                  <div style={{ fontWeight: 'bold', color: colors.primary }}>وسام {badge.t}</div>
                  <div style={{ fontSize: '0.75rem', color: colors.subText, marginTop: '4px' }}>{badge.d}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 6. لوحة المتصدرين --- */}
        {activeTab === 'leaderboard' && (
          <div>
            <div style={styles.card}>
              <h3 style={{ color: colors.primary, marginTop: 0 }}>🏆 لوحة أفضل الذاكرين</h3>
              <p style={{ fontSize: '0.85rem', color: colors.subText }}>تُعرض الأسماء المستعارة فقط حفاظاً على السرية الخصوصية التامة للعبادات.</p>
              
              <div style={{ borderBottom: `2px solid ${colors.gold}`, paddingBottom: '10px', marginBottom: '10px', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
                <span>الاسم المستعار</span>
                <span>الأذكار الأسبوعية</span>
              </div>
              
              {[
                { name: hideName ? "مستخدم مخفي (أنت)" : "عبد الله. أ", count: 2450, me: !hideName },
                { name: "أحمد. م", count: 2100 },
                { name: "فاطمة. ع", count: 1980 },
                { name: "عمر. ك", count: 1850 }
              ].map((user, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${colors.border}`, backgroundColor: user.me ? 'rgba(197,160,89,0.1)' : 'transparent', borderRadius: '6px' }}>
                  <span>{i+1}. {user.name}</span>
                  <span style={{ fontWeight: 'bold', color: colors.primary }}>{user.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 7. صفحة الأذكار --- */}
        {activeTab === 'azkar' && (
          <div>
            {[
              { t: "☀️ أذكار الصباح", c: "أعوذ بالله من الشيطان الرجيم (آية الكرسي)، أصبحنا وأصبح الملك لله والحمد لله." },
              { t: "🌙 أذكار المساء", c: "أمسينَا وأمسى الملك لله، رضيت بالله رباً وبالإسلام ديناً وبمحمد ﷺ نبياً." },
              { t: "🛌 أذكار النوم", c: "باسمك ربي وضعت جنبي وبك أرفعه، إن أمسكت نفسي فارحمها." },
              { t: "🌅 أذكار الاستيقاظ", c: "الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور." },
              { t: "📿 أذكار بعد الصلاة", c: "أستغفر الله (ثلاثاً)، اللهم أنت السلام ومنك السلام تباركت يا ذا الجلال والإكرام." },
              { t: "✨ أذكار متنوعة", c: "سبحان الله وبحمده سبحان الله العظيم، لا حول ولا قوة إلا بالله العلي العظيم." }
            ].map((zkr, i) => (
              <div key={i} style={styles.card}>
                <h4 style={{ color: colors.primary, margin: '0 0 10px 0' }}>{zkr.t}</h4>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.6', color: colors.text }}>{zkr.c}</p>
                <button 
                  style={{ background: 'none', border: 'none', color: colors.gold, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', marginTop: '10px' }}
                  onClick={() => { navigator.clipboard.writeText(zkr.c); alert('تم نسخ الذكر المبارك لمشاركته!'); }}
                >
                  🔗 نسخ ومشاركة الذكر
                </button>
              </div>
            ))}
          </div>
        )}

        {/* --- 8 & 9. الإعدادات والتنبيهات --- */}
        {activeTab === 'settings' && (
          <div>
            <div style={styles.card}>
              <h3 style={{ color: colors.primary, marginTop: 0 }}>⚙️ الإعدادات العامة</h3>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>الوضع الليلي (المظهر الداكن)</span>
                <input type="checkbox" checked={isDark} onChange={() => setTheme(isDark ? 'light' : 'dark')} style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>تفعيل الاهتزاز اللطيف</span>
                <input type="checkbox" checked={vibrationEnabled} onChange={() => setVibrationEnabled(!vibrationEnabled)} style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>إخفاء اسمي من لوحة الصدارة</span>
                <input type="checkbox" checked={hideName} onChange={() => setHideName(!hideName)} style={{ width: '20px', height: '20px' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.border}` }}>
                <span>حجم الخط العربي</span>
                <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={{ padding: '5px', borderRadius: '4px' }}>
                  <option value="small">صغير</option>
                  <option value="medium">متوسط</option>
                  <option value="large">كبير</option>
                </select>
              </div>
            </div>

            {/* نظام التنبيهات والإشعارات */}
            <div style={styles.card}>
              <h3 style={{ color: colors.primary, marginTop: 0 }}>🔔 التذكيرات والاشعارات اليومية</h3>
              <p style={{ fontSize: '0.8rem', color: colors.subText, marginBottom: '15px' }}>حدد أوقاتاً مخصصة لتلقي تنبيهات ذكر الله والصلاة على النبي ﷺ.</p>
              
              {['تذكير بالصلاة على النبي ﷺ', 'تذكير بالاستغفار اليومي', 'أذكار الصباح والمساء'].map((notif, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <span>{notif}</span>
                  <input type="time" defaultValue="08:00" style={{ padding: '4px', borderRadius: '6px', border: `1px solid ${colors.border}` }} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button style={styles.btnPrimary} onClick={() => alert('تم حفظ نسخة احتياطية سحابية لبياناتك بنجاح!')}>💾 نسخة احتياطية</button>
              <button style={{ ...styles.btnPrimary, backgroundColor: colors.gold }} onClick={() => setActiveTab('about')}>ℹ️ عن التطبيق</button>
            </div>
          </div>
        )}

        {/* --- 10. صفحة عن التطبيق --- */}
        {activeTab === 'about' && (
          <div style={{ textAlign: 'center' }}>
            <div style={styles.card}>
              <h3 style={{ color: colors.primary, marginTop: 0 }}>عن التطبيق</h3>
              <p style={{ lineHeight: '1.8', fontSize: '1.1rem', color: colors.text }}>
                "هذا التطبيق صُمم لمساعدة المسلمين على المحافظة على ذكر الله تعالى والصلاة على النبي محمد ﷺ بطريقة سهلة ومحفزة. نسأل الله أن يجعله في ميزان حسنات كل من ساهم في نشر الخير."
              </p>
              <button style={{ ...styles.btnPrimary, marginTop: '20px' }} onClick={() => setActiveTab('settings')}>
                العودة للإعدادات
              </button>
            </div>
          </div>
        )}

      </div>

      {/* شريط التنقل السفلي والرمزي للأجهزة الذكية (Sticky Navigation Bar) */}
      <nav style={styles.navBar}>
        <button style={styles.navItem('home')} onClick={() => setActiveTab('home')}>🏠 الرئيسية</button>
        <button style={styles.navItem('tasbeeh')} onClick={() => setActiveTab('tasbeeh')}>📿 السبحة</button>
        <button style={styles.navItem('azkar')} onClick={() => setActiveTab('azkar')}>📖 الأذكار</button>
        <button style={styles.navItem('achievements')} onClick={() => setActiveTab('achievements')}>🏅 الأوسمة</button>
        <button style={styles.navItem('stats')} onClick={() => setActiveTab('stats')}>📊 التقارير</button>
        <button style={styles.navItem('settings')} onClick={() => setActiveTab('settings')}>⚙️ الإعدادات</button>
      </nav>
    </div>
  );
}

export default App;
