const { useState, useEffect, useRef } = React;

// Font Awesome Icon Components
const FAIcon = ({ icon, size, className = "" }) => (
    <i className={`fas fa-${icon} ${className}`} style={{ fontSize: size ? `${size}px` : 'inherit' }}></i>
);

//--- UTILITIES ---
const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(date);
};

const playSound = (freq, type, duration) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
        osc.stop(ctx.currentTime + duration);
    } catch (e) { }
};

// --- CHAOS ENGINE (The Logic of Consequence) ---
const calculateTimeline = (action, year) => {
    const act = action.toLowerCase();

    // 1. FINANCIAL ACTIONS
    if (act.includes('buy') || act.includes('invest') || act.includes('stock')) {
        if (act.includes('apple') && year < 1980) return "TECH_OLIGARCH";
        if (act.includes('bitcoin') && year < 2010) return "CRYPTO_KING";
        if (act.includes('google') && year < 2004) return "SEARCH_MONOPOLY";
        return "RICH_BUT_UNKNOWN";
    }

    // 2. VIOLENCE / ASSASSINATION
    if (act.includes('kill') || act.includes('murder') || act.includes('assassinate')) {
        if (act.includes('hitler') && year < 1945) return "Paradox: A worse dictator replaced him. The Cold War went hot in 1960.";
        if (act.includes('lincoln') && year < 1865) return "The Confederacy survived. North America is fractured into 4 nations.";
        if (act.includes('kennedy') || act.includes('jfk')) return "The Space Race was abandoned. We never went to the moon.";
        return "CRIMINAL_RECORD";
    }

    // 3. PREVENTION / SAVING
    if (act.includes('save') || act.includes('prevent') || act.includes('stop')) {
        if (act.includes('titanic') && year === 1912) return "Maritime laws never improved. A larger tragedy occurred in 1920.";
        if (act.includes('lincoln')) return "Reconstruction succeeded. Civil Rights movement happened 50 years early.";
        return "HERO_SYNDROME";
    }

    // 4. INVENTION / TECH
    if (act.includes('invent') || act.includes('teach') || act.includes('show')) {
        if ((act.includes('iphone') || act.includes('phone')) && year < 2000) return "Steve Jobs sued you for patent infringement. You died penniless.";
        if (act.includes('internet') && year < 1960) return "The Hive Mind took over. Humanity is now a single digital consciousness.";
        return "TECH_DISRUPTOR";
    }

    return "UNKNOWN_VARIABLE";
};

// --- STARFIELD COMPONENT ---
const Starfield = ({ speed, isWarping }) => {
    const canvasRef = useRef(null);
    const starsRef = useRef([]);
    const requestRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const initStars = () => {
            starsRef.current = Array.from({ length: 800 }, () => ({
                x: Math.random() * width - width / 2,
                y: Math.random() * height - height / 2,
                z: Math.random() * width
            }));
        };
        initStars();

        const animate = () => {
            ctx.fillStyle = isWarping ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(0, 0, width, height);
            const cx = width / 2;
            const cy = height / 2;
            const warpColor = isWarping ? '200, 255, 255' : '150, 150, 150';

            starsRef.current.forEach(star => {
                star.z -= speed;
                if (star.z <= 0) {
                    star.z = width;
                    star.x = Math.random() * width - width / 2;
                    star.y = Math.random() * height - height / 2;
                }
                const x = (star.x / star.z) * width + cx;
                const y = (star.y / star.z) * height + cy;
                const size = (1 - star.z / width) * (isWarping ? 4 : 2);

                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    ctx.beginPath();
                    ctx.fillStyle = `rgb(${warpColor})`;
                    if (isWarping) {
                        const prevX = (star.x / (star.z + speed * 2)) * width + cx;
                        const prevY = (star.y / (star.z + speed * 2)) * height + cy;
                        ctx.moveTo(prevX, prevY);
                        ctx.lineTo(x, y);
                        ctx.strokeStyle = `rgb(${warpColor})`;
                        ctx.lineWidth = size / 2;
                        ctx.stroke();
                    } else {
                        ctx.arc(x, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            });
            requestRef.current = requestAnimationFrame(animate);
        };
        animate();
        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
            initStars();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(requestRef.current);
        };
    }, [speed, isWarping]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none" />;
};

// --- MAIN APP ---
const App = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [targetDate, setTargetDate] = useState("1985-10-26T01:20");
    const [isPowered, setIsPowered] = useState(false);
    const [isJumping, setIsJumping] = useState(false);
    const [warpSpeed, setWarpSpeed] = useState(0.5);
    const [logs, setLogs] = useState(["System Standby. Waiting for power initialization..."]);
    const [fluxLevel, setFluxLevel] = useState(0);
    const [paradoxInhibitor, setParadoxInhibitor] = useState(true);

    // Narrative State
    const [divergence, setDivergence] = useState(null);
    const [userAction, setUserAction] = useState("");
    const [showTerminal, setShowTerminal] = useState(false);

    const addLog = (msg) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString('en-GB')}] ${msg}`, ...prev.slice(0, 8)]);
    };

    // --- DATE MANIPULATION HANDLERS ---
    const adjustYear = (amount) => {
        if (!targetDate) return;
        const date = new Date(targetDate);
        date.setFullYear(date.getFullYear() + amount);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        const yearStr = year.toString().padStart(4, '0');
        setTargetDate(`${yearStr}-${month}-${day}T${hours}:${minutes}`);
        playSound(400, 'square', 0.05);
    };

    const setPresetYear = (year) => {
        const date = new Date(targetDate || new Date());
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        setTargetDate(`${year}-${month}-${day}T${hours}:${minutes}`);
        playSound(600, 'square', 0.1);
    };

    const togglePower = () => {
        if (isJumping) return;
        if (!isPowered) {
            setIsPowered(true);
            addLog("Power core initialising...");
            playSound(150, 'sine', 0.5);
            let level = 0;
            const interval = setInterval(() => {
                level += 5;
                setFluxLevel(level);
                if (level >= 100) {
                    clearInterval(interval);
                    addLog("Capacitors fully charged. Ready for input.");
                    playSound(400, 'sine', 0.3);
                }
            }, 50);
        } else {
            setIsPowered(false);
            setFluxLevel(0);
            setDivergence(null);
            addLog("System shutdown sequence completed.");
        }
    };

    const commitAction = (e) => {
        e.preventDefault();
        if (!userAction.trim()) return;

        addLog(`> ACTION LOGGED: "${userAction.toUpperCase()}"`);
        playSound(800, 'square', 0.1);

        const consequence = calculateTimeline(userAction, currentDate.getFullYear());
        setDivergence(consequence);

        setUserAction("");
        setShowTerminal(false);
        addLog("CAUSALITY RIPPLE CALCULATED. RETURN VECTOR UPDATED.");
    };

    const handleJump = () => {
        if (!isPowered || isJumping) return;

        const destination = new Date(targetDate);
        if (isNaN(destination.getTime())) {
            addLog("ERROR: Invalid temporal coordinates.");
            return;
        }

        setIsJumping(true);
        addLog(`Engaging temporal displacement to ${formatDate(destination)}...`);
        playSound(100, 'sawtooth', 1.0);

        let speed = 0.5;
        const rampUp = setInterval(() => {
            speed *= 1.2;
            setWarpSpeed(speed);
            if (speed > 50) clearInterval(rampUp);
        }, 100);

        setTimeout(() => {
            clearInterval(rampUp);
            setWarpSpeed(0.5);
            setIsJumping(false);
            setCurrentDate(destination);

            const year = destination.getFullYear();
            let flavorText = "";

            if (year >= 2024 && divergence) {
                addLog("ARRIVAL: ALTERNATIVE TIMELINE DETECTED.");
                playSound(150, 'sawtooth', 0.8);

                switch (divergence) {
                    case "TECH_OLIGARCH": flavorText = "You own 51% of global GDP. Your face is on the currency."; break;
                    case "CRYPTO_KING": flavorText = "You live on a private citadel on Mars. Earth is a distant memory."; break;
                    case "SEARCH_MONOPOLY": flavorText = "You invented the search engine in 1999. You are... me?"; break;
                    case "RICH_BUT_UNKNOWN": flavorText = "Bank accounts updated. You are wealthy, but history remains mostly intact."; break;
                    case "HERO_SYNDROME": flavorText = "Statues of you exist in every major city. World Peace was achieved in 1990."; break;
                    case "TECH_DISRUPTOR": flavorText = "Technology is 50 years advanced. Flying cars are standard traffic."; break;
                    case "CRIMINAL_RECORD": flavorText = "You were arrested immediately upon landing. Temporal Crimes Division is en route."; break;
                    case "UNKNOWN_VARIABLE": flavorText = "Reality feels... thin. Minor alterations detected in the food chain."; break;
                    default: flavorText = divergence;
                }
            }
            else {
                if (year < 2024) {
                    setShowTerminal(true);
                } else {
                    setShowTerminal(false);
                }

                const isDivergentRandom = !paradoxInhibitor && Math.random() > 0.3;

                if (isDivergentRandom && year !== 1985) {
                    if (year < 1900) flavorText = "CRITICAL: Anachronism detected. Steam engines running on cold fusion.";
                    else if (year < 2025) flavorText = "Reality Shift: The internet does not exist here. Telepathic relays active.";
                    else flavorText = "Paradox: Time has folded. You are currently staring at yourself from 5 minutes ago.";
                    addLog("WARNING: INHIBITOR FAILURE. RANDOM DIVERGENCE.");
                } else {
                    if (year === 1985) flavorText = "Plutonium readings negative. 1.21 Gigawatts required.";
                    else if (year < 1900) flavorText = "Atmosphere contains high coal particulate levels.";
                    else if (year < 1990) flavorText = "Analog signals dominant. No global network detected.";
                    else if (year < 2025) flavorText = "Local wireless networks detected. Silicon era.";
                    else if (year < 3000) flavorText = "Atmosphere clear. Orbital arrays detected.";
                    else flavorText = "Warning: Radiation levels elevated. Civilization structures undetectable.";
                }
            }

            addLog(`Arrival confirmed. Welcome to ${year}.`);
            addLog(flavorText);
            if (!divergence) playSound(600, 'sine', 0.5);

        }, 4000);
    };

    const getTimeDiff = () => {
        const diff = new Date(targetDate) - currentDate;
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
        return `${Math.abs(years)} Years ${years >= 0 ? 'Future' : 'Past'}`;
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-cyan-400 font-mono overflow-hidden select-none">
            <Starfield speed={warpSpeed} isWarping={isJumping} />

            <div className="fixed inset-0 pointer-events-none z-10 bg-[radial-gradient(circle,transparent_50%,black_150%)]"></div>
            <div className="fixed inset-0 pointer-events-none z-10 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <div className={`relative z-20 flex flex-col items-center justify-center min-h-screen p-4 transition-opacity duration-500 ${isJumping ? 'opacity-40 shake-animation' : 'opacity-100'}`}>

                <header className="mb-8 text-center border-b-2 border-cyan-500/30 pb-4 w-full max-w-3xl bg-black/80 p-4 rounded-xl backdrop-blur-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <FAIcon icon="clock" className="animate-pulse text-cyan-400" />
                            <h1 className="text-2xl md:text-3xl font-bold tracking-widest text-white shadow-cyan-500/50 drop-shadow-lg">CHRONOS MK-V</h1>
                        </div>
                        <div className="text-xs text-cyan-600 border border-cyan-800 px-2 py-1 rounded">
                            SYS.VER. 5.1.0 (QoL)
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">

                    <div className="bg-gray-900/80 backdrop-blur-md border border-cyan-700/50 p-6 rounded-lg shadow-lg relative overflow-hidden group">
                        <h2 className="text-sm text-cyan-600 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                            <FAIcon icon="map-marker-alt" size={16} /> Temporal Coordinates
                        </h2>

                        <div className="mb-4 bg-black/50 p-4 rounded border border-cyan-900/50">
                            <label className="block text-xs text-gray-500 mb-1">PRESENT LOCAL TIME</label>
                            <div className="text-xl md:text-2xl text-amber-400 font-bold font-mono tracking-wider">
                                {formatDate(currentDate)}
                            </div>
                            {divergence && (
                                <div className="mt-2 text-xs bg-red-900/30 text-red-400 border border-red-800 p-1 px-2 rounded inline-block animate-pulse">
                                    ⚠ TIMELINE ALTERED
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-xs text-cyan-500 mb-1">DESTINATION VECTOR</label>
                            <input
                                type="datetime-local"
                                value={targetDate}
                                disabled={!isPowered || isJumping}
                                onChange={(e) => setTargetDate(e.target.value)}
                                className={`w-full bg-gray-800 border-2 ${isPowered ? 'border-cyan-600 text-white' : 'border-gray-700 text-gray-600'} rounded p-3 text-lg focus:outline-none focus:border-cyan-400 transition-all`}
                            />
                        </div>

                        <div className={`grid grid-cols-4 gap-2 mb-4 transition-opacity ${!isPowered ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            <button onClick={() => adjustYear(-100)} className="bg-gray-800 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-900 rounded p-2 flex justify-center" title="-100 Years">
                                <FAIcon icon="angle-double-left" size={16} />
                            </button>
                            <button onClick={() => adjustYear(-10)} className="bg-gray-800 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-900 rounded p-2 flex justify-center" title="-10 Years">
                                <FAIcon icon="chevron-left" size={16} />
                            </button>
                            <button onClick={() => adjustYear(10)} className="bg-gray-800 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-900 rounded p-2 flex justify-center" title="+10 Years">
                                <FAIcon icon="chevron-right" size={16} />
                            </button>
                            <button onClick={() => adjustYear(100)} className="bg-gray-800 hover:bg-cyan-900/50 text-cyan-400 border border-cyan-900 rounded p-2 flex justify-center" title="+100 Years">
                                <FAIcon icon="angle-double-right" size={16} />
                            </button>
                        </div>

                        <div className={`flex gap-2 justify-between transition-opacity ${!isPowered ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                            {[1885, 1955, 1985, 2077].map(year => (
                                <button
                                    key={year}
                                    onClick={() => setPresetYear(year)}
                                    className="flex-1 bg-gray-900 border border-gray-700 hover:border-cyan-500 text-xs text-gray-400 hover:text-cyan-300 py-1 rounded transition-colors"
                                >
                                    {year}
                                </button>
                            ))}
                        </div>

                        <div className="text-right text-xs text-cyan-300 mt-2">
                            Trajectory: {getTimeDiff()}
                        </div>
                    </div>

                    <div className="bg-gray-900/80 backdrop-blur-md border border-cyan-700/50 p-6 rounded-lg shadow-lg flex flex-col justify-between relative overflow-hidden">

                        {!showTerminal ? (
                            <>
                                <h2 className="text-sm text-cyan-600 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                                    <FAIcon icon="chart-line" size={16} /> Engineering Status
                                </h2>

                                <div className="flex items-center justify-between mb-6">
                                    <div className="relative w-16 h-16 flex items-center justify-center border-2 border-gray-700 rounded-full bg-black">
                                        <FAIcon
                                            icon="bolt"
                                            size={32}
                                            className={`${isPowered && fluxLevel === 100 ? 'text-yellow-400 animate-bounce' : 'text-gray-700'}`}
                                        />
                                        {isPowered && (
                                            <div className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span>FLUX CAPACITANCE</span>
                                            <span>{fluxLevel}%</span>
                                        </div>
                                        <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden border border-gray-700">
                                            <div
                                                className="h-full bg-gradient-to-r from-cyan-600 to-yellow-400 transition-all duration-300"
                                                style={{ width: `${fluxLevel}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between bg-black/40 p-3 rounded border border-gray-700 mb-6">
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <FAIcon icon="exclamation-triangle" size={16} className={paradoxInhibitor ? "text-green-500" : "text-red-500 animate-pulse"} />
                                        <span>Paradox Inhibitor</span>
                                    </div>
                                    <button
                                        onClick={() => isPowered && setParadoxInhibitor(!paradoxInhibitor)}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${paradoxInhibitor ? 'bg-green-900' : 'bg-red-900'}`}
                                        disabled={!isPowered}
                                    >
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${paradoxInhibitor ? 'left-7' : 'left-1'}`}></div>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-auto">
                                    <button
                                        onClick={togglePower}
                                        className={`flex items-center justify-center gap-2 p-4 rounded font-bold uppercase tracking-wider transition-all ${isPowered ? 'bg-red-900/50 border border-red-600 text-red-200 hover:bg-red-800' : 'bg-gray-700 border border-gray-500 text-gray-300 hover:bg-gray-600'}`}
                                    >
                                        <FAIcon icon="power-off" size={18} /> {isPowered ? "Shutdown" : "Power On"}
                                    </button>

                                    <button
                                        onClick={handleJump}
                                        disabled={!isPowered || fluxLevel < 100}
                                        className={`flex items-center justify-center gap-2 p-4 rounded font-bold uppercase tracking-wider border transition-all duration-200
                      ${!isPowered || fluxLevel < 100
                                                ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                                                : 'bg-cyan-900/80 border-cyan-400 text-cyan-100 hover:bg-cyan-700 shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-95'
                                            }`}
                                    >
                                        <FAIcon icon="sync" size={18} className={isJumping ? "fa-spin" : ""} />
                                        {isJumping ? "JUMPING..." : "ENGAGE"}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex flex-col">
                                <h2 className="text-sm text-green-400 mb-4 flex items-center gap-2 font-bold uppercase tracking-wider animate-pulse">
                                    <FAIcon icon="terminal" size={16} /> INTERACTION TERMINAL
                                </h2>
                                <div className="flex-1 bg-black/80 border border-green-800 p-2 font-mono text-sm text-green-300 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-green-900/10 pointer-events-none"></div>
                                    <p className="mb-2">History is malleable. Enter action:</p>
                                    <form onSubmit={commitAction} className="flex gap-2">
                                        <FAIcon icon="chevron-right" size={16} className="mt-1" />
                                        <input
                                            type="text"
                                            autoFocus
                                            className="bg-transparent border-none outline-none flex-1 text-green-400 placeholder-green-800"
                                            placeholder="e.g., Buy Apple Stock..."
                                            value={userAction}
                                            onChange={(e) => setUserAction(e.target.value)}
                                        />
                                    </form>
                                    <div className="mt-4 text-xs text-green-700">
                                        * ACTIONS MAY HAVE UNFORESEEN CONSEQUENCES.<br />
                                        * RETURN TO FUTURE TO OBSERVE RIPPLES.
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTerminal(false)}
                                    className="mt-4 w-full border border-green-800 text-green-600 hover:bg-green-900/30 p-2 text-xs uppercase"
                                >
                                    Close Terminal
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="md:col-span-2 bg-black border border-gray-700 p-4 rounded-lg font-mono text-xs md:text-sm h-48 overflow-y-auto shadow-inner shadow-black">
                        <div className="sticky top-0 bg-black pb-2 border-b border-gray-800 mb-2 flex items-center gap-2 text-gray-400 uppercase">
                            <FAIcon icon="lock" size={12} /> Mission Log
                        </div>
                        <div className="flex flex-col-reverse gap-1">
                            {logs.map((log, idx) => (
                                <div key={idx} className={`${idx === 0 ? 'text-green-400 font-bold' : 'text-gray-500'}`}>
                                    <span className="mr-2 text-gray-700">{'>'}</span>{log}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
        .shake-animation {
          animation: shake 0.5s;
          animation-iteration-count: infinite;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #111; 
        }
        ::-webkit-scrollbar-thumb {
          background: #333; 
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #06b6d4; 
        }
      `}</style>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
