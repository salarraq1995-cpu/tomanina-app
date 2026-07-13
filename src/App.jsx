import React, { useState } from 'react';
import { BookOpen, Compass, Sun, Moon, Volume2, Play, Pause } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('azkar');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [counter, setCounter] = useState(0);

  const azkarList = [
    { id: 1, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, hint: "حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ" },
    { id: 2, text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100, hint: "ممحاة للذنوب ومجلبة للرزق" }
  ];

  return (
    <div className={"min-h-screen flex flex-col justify-between " + (isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-800')}>
      <header className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
        <h1 class="text-xl font-bold text-teal-600">طُمأنينة</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full">
          {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
        </button>
      </header>

      <main className="flex-grow p-4 max-w-md mx-auto w-full pb-24">
        {activeTab === 'azkar' && (
          <div className="space-y-4">
            {azkarList.map((zikr) => (
              <div key={zikr.id} className={"p-4 rounded-2xl border " + (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100')}>
                <p className="text-lg font-semibold mb-2 text-right">{zikr.text}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400">{zikr.hint}</span>
                  <button onClick={() => setCounter(prev => prev + 1)} className="bg-teal-600 text-white w-12 h-12 rounded-full">+</button>
                </div>
              </div>
            ))}
            <div className="text-center p-4 text-slate-400">مجموع الأذكار: {counter}</div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 p-2 border-t flex justify-around bg-white dark:bg-slate-950">
        <button onClick={() => setActiveTab('azkar')} className={activeTab === 'azkar' ? 'text-teal-600' : 'text-slate-400'}>
          <BookOpen size={20} />
        </button>
      </nav>
    </div>
  );
}
