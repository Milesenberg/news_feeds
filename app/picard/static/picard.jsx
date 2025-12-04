const { useState, useEffect } = React;

// Font Awesome Icon Component Helper
const FAIcon = ({ icon, size, className = "" }) => (
    <i className={`fas fa-${icon} ${className}`} style={{ fontSize: size ? `${size}px` : 'inherit' }}></i>
);

// --- Data: The Episode Database ---
const EPISODE_DB = [
    {
        id: 'tng-1x01',
        title: 'Encounter at Farpoint',
        series: 'TNG',
        season: 1,
        episode: 1,
        type: 'episode',
        tags: ['q', 'philosophy', 'essential'],
        runtime: 90,
        desc: 'The entity Q puts humanity on trial. Essential for Picard S2.',
        why: 'Sets up the entire Q vs Picard dynamic.'
    },
    {
        id: 'tng-2x09',
        title: 'The Measure of a Man',
        series: 'TNG',
        season: 2,
        episode: 9,
        type: 'episode',
        tags: ['data', 'philosophy', 'law', 'family'],
        runtime: 45,
        desc: 'A courtroom drama determining if Data is property or a sentient being.',
        why: 'Crucial for understanding Picard\'s love for Data.'
    },
    {
        id: 'tng-2x16',
        title: 'Q Who',
        series: 'TNG',
        season: 2,
        episode: 16,
        type: 'episode',
        tags: ['q', 'borg', 'action', 'essential'],
        runtime: 45,
        desc: 'Q introduces the Federation to the Borg to humble Picard.',
        why: 'The origin of the Borg threat and Guinan\'s history.'
    },
    {
        id: 'tng-3x16',
        title: 'The Offspring',
        series: 'TNG',
        season: 3,
        episode: 16,
        type: 'episode',
        tags: ['data', 'family', 'emotional'],
        runtime: 45,
        desc: 'Data builds a daughter, Lal, and tries to raise her.',
        why: 'Foundational for the fatherhood themes in Picard S3.'
    },
    {
        id: 'tng-3x26',
        title: 'The Best of Both Worlds',
        series: 'TNG',
        season: 3,
        episode: '26/01',
        type: 'episode',
        tags: ['borg', 'action', 'trauma', 'essential'],
        runtime: 90,
        desc: 'Picard is assimilated by the Borg. The ultimate cliffhanger.',
        why: 'The source of Picard\'s PTSD and the Federation\'s fear.'
    },
    {
        id: 'tng-4x02',
        title: 'Family',
        series: 'TNG',
        season: 4,
        episode: 2,
        type: 'episode',
        tags: ['family', 'trauma', 'emotional'],
        runtime: 45,
        desc: 'Picard visits his brother in France to heal after the Borg.',
        why: 'Establishes the Château and Picard\'s human vulnerability.'
    },
    {
        id: 'tng-4x03',
        title: 'Brothers',
        series: 'TNG',
        season: 4,
        episode: 3,
        type: 'episode',
        tags: ['data', 'lore', 'family'],
        runtime: 45,
        desc: 'Data is summoned by his creator and meets his evil brother, Lore.',
        why: 'Context for the Data/Lore conflict in Picard S3.'
    },
    {
        id: 'tng-6x15',
        title: 'Tapestry',
        series: 'TNG',
        season: 6,
        episode: 15,
        type: 'episode',
        tags: ['q', 'philosophy', 'character'],
        runtime: 45,
        desc: 'Picard dies and Q gives him a chance to change his past.',
        why: 'Explains Q\'s tough love approach to Picard.'
    },
    {
        id: 'tng-7x25',
        title: 'All Good Things...',
        series: 'TNG',
        season: 7,
        episode: 25,
        type: 'episode',
        tags: ['q', 'philosophy', 'essential', 'time'],
        runtime: 90,
        desc: 'The series finale. Q returns to finish the trial.',
        why: 'The emotional anchor for the entire TNG crew.'
    },
    {
        id: 'mov-fc',
        title: 'Star Trek: First Contact',
        series: 'Movie',
        season: 0,
        episode: 8,
        type: 'movie',
        tags: ['borg', 'action', 'horror', 'essential'],
        runtime: 111,
        desc: 'The Borg travel back in time. Picard loses his cool.',
        why: 'Introduces the Borg Queen and the Enterprise-E.'
    },
    {
        id: 'voy-scorp',
        title: 'Scorpion (Voyager)',
        series: 'VOY',
        season: 3,
        episode: '26/01',
        type: 'episode',
        tags: ['borg', 'seven', 'action'],
        runtime: 90,
        desc: 'Janeway allies with the Borg. Seven of Nine is severed.',
        why: 'Origin story for Seven of Nine.'
    },
    {
        id: 'mov-nem',
        title: 'Star Trek: Nemesis',
        series: 'Movie',
        season: 0,
        episode: 10,
        type: 'movie',
        tags: ['data', 'action', 'clones', 'essential'],
        runtime: 116,
        desc: 'Picard fights his clone. Data makes a sacrifice.',
        why: 'Direct prequel context for Picard Season 1 & 3.'
    }
];

// --- Components ---

const Button = ({ onClick, children, className, variant = 'primary' }) => {
    const baseStyle = "px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2";
    const variants = {
        primary: "bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]",
        secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-500",
        outline: "bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500/10",
        lcars: "bg-purple-500 hover:bg-purple-400 text-white rounded-r-full rounded-l-none border-l-4 border-black w-full justify-start pl-6"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

const Tag = ({ type }) => {
    const styles = {
        q: "bg-purple-900/50 text-purple-200 border-purple-500",
        borg: "bg-green-900/50 text-green-200 border-green-500",
        data: "bg-yellow-900/50 text-yellow-200 border-yellow-500",
        family: "bg-blue-900/50 text-blue-200 border-blue-500",
        action: "bg-red-900/50 text-red-200 border-red-500",
        philosophy: "bg-indigo-900/50 text-indigo-200 border-indigo-500",
        essential: "bg-amber-500 text-black font-bold border-amber-500",
        seven: "bg-slate-700 text-slate-200 border-slate-500"
    };

    return (
        <span className={`text-xs px-2 py-0.5 rounded border ${styles[type] || "bg-gray-800 text-gray-300"}`}>
            {type.toUpperCase()}
        </span>
    );
};

function TrekCurator() {
    const [view, setView] = useState('welcome'); // welcome, quiz, loading, results
    const [answers, setAnswers] = useState({});
    const [playlist, setPlaylist] = useState([]);

    // --- Quiz Questions ---
    const questions = [
        {
            id: 'vibe',
            text: "What kind of stories usually grip you the most?",
            options: [
                { label: "Deep philosophical questions & moral dilemmas", value: 'philosophy', icon: 'brain' },
                { label: "High-stakes action & terrifying villains", value: 'action', icon: 'bolt' },
                { label: "Complex character relationships & emotional growth", value: 'emotional', icon: 'heart' }
            ]
        },
        {
            id: 'time',
            text: "How much time do you have to prepare?",
            options: [
                { label: "I want the full experience (The Weekend Binge)", value: 'full', icon: 'tv' },
                { label: "Just the absolute essentials (The Surgical Strike)", value: 'short', icon: 'clock' }
            ]
        },
        {
            id: 'villain',
            text: "Pick a flavour of antagonist:",
            options: [
                { label: "An omnipotent trickster god (Q)", value: 'q', icon: 'star' },
                { label: "A relentless cybernetic hive mind (Borg)", value: 'borg', icon: 'sync' },
                { label: "I prefer internal conflicts (Man vs Self)", value: 'internal', icon: 'brain' }
            ]
        }
    ];

    const [currentQuestion, setCurrentQuestion] = useState(0);

    const handleStart = () => {
        setView('quiz');
        setCurrentQuestion(0);
        setAnswers({});
    };

    const handleAnswer = (value) => {
        const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            generatePlaylist(newAnswers);
        }
    };

    const generatePlaylist = (finalAnswers) => {
        setView('loading');

        setTimeout(() => {
            let scores = EPISODE_DB.map(ep => ({ ...ep, score: 0 }));

            // Scoring Logic
            scores.forEach(ep => {
                // Base score for simply existing
                ep.score += 1;

                // Vibe matching
                if (finalAnswers.vibe === 'philosophy' && (ep.tags.includes('philosophy') || ep.tags.includes('q'))) ep.score += 5;
                if (finalAnswers.vibe === 'action' && (ep.tags.includes('action') || ep.tags.includes('borg'))) ep.score += 5;
                if (finalAnswers.vibe === 'emotional' && (ep.tags.includes('family') || ep.tags.includes('character'))) ep.score += 5;

                // Villain matching
                if (finalAnswers.villain === 'q' && ep.tags.includes('q')) ep.score += 10;
                if (finalAnswers.villain === 'borg' && (ep.tags.includes('borg') || ep.tags.includes('seven'))) ep.score += 10;
                if (finalAnswers.villain === 'internal' && (ep.tags.includes('data') || ep.tags.includes('family'))) ep.score += 10;

                // Essentials ALWAYS get a boost, but bigger boost if time is short
                if (ep.tags.includes('essential')) {
                    ep.score += (finalAnswers.time === 'short' ? 50 : 5);
                }
            });

            // Sorting
            scores.sort((a, b) => {
                // First strictly by score
                if (b.score !== a.score) return b.score - a.score;
                // Then by chronological order
                return 0;
            });

            // Chronological Re-sort of top picks
            const cutOff = finalAnswers.time === 'short' ? 6 : 14;
            let topPicks = scores.slice(0, cutOff);

            // Restore chronological order for viewing
            const seriesOrder = { 'TNG': 1, 'VOY': 2, 'Movie': 3 };
            topPicks.sort((a, b) => {
                if (seriesOrder[a.series] !== seriesOrder[b.series]) return seriesOrder[a.series] - seriesOrder[b.series];
                if (a.season !== b.season) return a.season - b.season;
                return a.episode - b.episode;
            });

            setPlaylist(topPicks);
            setView('results');
        }, 1500);
    };

    const getTotalTime = () => {
        const minutes = playlist.reduce((acc, ep) => acc + ep.runtime, 0);
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    // --- Sub-Views ---

    const renderWelcome = () => (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-8 animate-fadeIn">
            <div className="w-24 h-24 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] mb-4">
                <FAIcon icon="play" size={48} className="text-black ml-2" />
            </div>
            <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 tracking-tighter mb-4">
                    TREK PROTOCOL
                </h1>
                <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
                    Prepare for <strong>Star Trek: Picard</strong>. This algorithm will analyze your personality and calculate the most efficient path to maximum emotional impact.
                </p>
            </div>
            <Button onClick={handleStart} className="w-full max-w-xs text-lg">
                Initiate Onboarding
            </Button>
        </div>
    );

    const renderQuiz = () => {
        const q = questions[currentQuestion];
        return (
            <div className="flex flex-col h-full max-w-2xl mx-auto w-full p-6">
                <div className="mb-8">
                    <div className="flex justify-between text-xs text-amber-500 mb-2 font-mono uppercase">
                        <span>Query {currentQuestion + 1} of {questions.length}</span>
                        <span>Input Required</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-500"
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-8">{q.text}</h2>

                <div className="space-y-4">
                    {q.options.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => handleAnswer(opt.value)}
                            className="w-full text-left p-6 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 hover:border-amber-500/50 rounded-xl transition-all duration-200 group flex items-center gap-4"
                        >
                            <div className="p-3 bg-slate-900 rounded-lg text-amber-500 group-hover:text-amber-400 group-hover:scale-110 transition-transform">
                                <FAIcon icon={opt.icon} size={24} />
                            </div>
                            <span className="text-lg font-medium text-slate-200 group-hover:text-white">{opt.label}</span>
                            <FAIcon icon="chevron-right" className="ml-auto text-slate-600 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    const renderLoading = () => (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <FAIcon icon="sync" size={48} className="text-amber-500 fa-spin" />
            <div className="font-mono text-amber-500 animate-pulse">
                CALCULATING OPTIMAL NARRATIVE PATH...
            </div>
        </div>
    );

    const renderResults = () => (
        <div className="h-full flex flex-col max-w-3xl mx-auto w-full">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Your Warp Path</h2>
                        <p className="text-slate-400 text-sm">
                            Estimated viewing time: <span className="text-amber-500 font-mono">{getTotalTime()}</span>
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleStart} className="text-sm px-3 py-2">
                        Reset
                    </Button>
                </div>

                {/* LCARS Decoration */}
                <div className="flex gap-1 h-2">
                    <div className="w-16 bg-amber-500 rounded-full" />
                    <div className="w-8 bg-blue-400 rounded-full" />
                    <div className="flex-1 bg-purple-500 rounded-full opacity-50" />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {playlist.map((ep, idx) => (
                    <div key={ep.id} className="relative pl-8 group animate-slideIn" style={{ animationDelay: `${idx * 100}ms` }}>
                        {/* Timeline Line */}
                        <div className="absolute left-[11px] top-8 bottom-[-24px] w-0.5 bg-slate-800 group-last:bottom-0"></div>
                        <div className="absolute left-0 top-6 w-6 h-6 bg-slate-900 border-2 border-amber-500 rounded-full flex items-center justify-center z-10">
                            <span className="text-[10px] font-mono text-amber-500">{idx + 1}</span>
                        </div>

                        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 hover:border-amber-500/30 transition-colors">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {ep.tags.map(tag => <Tag key={tag} type={tag} />)}
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{ep.title}</h3>
                            <div className="text-xs font-mono text-slate-500 mb-3 uppercase tracking-wider">
                                {ep.series === 'Movie' ? 'Feature Film' : `${ep.series} • S${ep.season} E${ep.episode}`} • {ep.runtime}m
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="text-slate-300">
                                    <span className="text-slate-500 font-bold block text-xs uppercase mb-1">Plot</span>
                                    {ep.desc}
                                </div>
                                <div className="bg-amber-900/10 p-3 rounded-lg border border-amber-900/20">
                                    <span className="text-amber-500 font-bold block text-xs uppercase mb-1 flex items-center gap-1">
                                        <FAIcon icon="info-circle" size={12} /> Why it matters for Picard
                                    </span>
                                    <span className="text-amber-200/80 italic">{ep.why}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className="p-8 text-center text-slate-500">
                    <p className="mb-4">You are now prepared to engage.</p>
                    <div className="inline-block px-4 py-2 border border-slate-700 rounded text-sm font-mono">
                        NEXT: STAR TREK PICARD S02E01
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-amber-500/30">
            <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
          opacity: 0;
        }
      `}</style>
            <div className="max-w-4xl mx-auto min-h-screen shadow-2xl bg-slate-900 flex flex-col relative overflow-hidden">

                {/* Ambient Background Effects */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 opacity-50" />
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* View Router */}
                {view === 'welcome' && renderWelcome()}
                {view === 'quiz' && renderQuiz()}
                {view === 'loading' && renderLoading()}
                {view === 'results' && renderResults()}

            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<TrekCurator />);
