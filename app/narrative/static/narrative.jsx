const { useState, useEffect, useRef, useCallback } = React;

// Font Awesome Icon Component Helper
const FAIcon = ({ icon, size, className = "" }) => (
    <i className={`fas fa-${icon} ${className}`} style={{ fontSize: size ? `${size}px` : 'inherit' }}></i>
);

/**
 * CYBERPUNK NARRATIVE INTERFACE v3.3
 * ----------------------------------
 * Adapted for CDN usage with Font Awesome icons
 */

// --- Game Data ---
const STORY_DATA = {
    start: {
        id: 'start',
        location: 'neo_tokyo_slums',
        locationName: 'Sector 7: The Dregs',
        bgImage: '/narrative/static/images/sector7_slums_bg_1764928832835.png',
        character: 'unknown',
        speakerName: 'System',
        text: "Boot sequence initiated... Neural link established. Welcome back to the grid, runner. Your vitals are stabilising, but memory sectors seem corrupted.",
        choices: [
            { text: "Where am I?", next: 'wake_up' },
            { text: "[Run Diagnostics]", next: 'diagnostics' }
        ]
    },
    wake_up: {
        id: 'wake_up',
        location: 'clinic_alley',
        locationName: 'Doc Stitch\'s Back Alley',
        bgImage: '/narrative/static/images/clinic_alley_bg_1764928786118.png',
        character: 'doc_stitch',
        speakerName: 'Doc Stitch',
        text: "Easy there, chrome-dome. You took a nasty shock from that ICE breaker. Had to replace your subnet processor with a spare I found in a toaster.",
        choices: [
            { text: "A toaster? You serious?", next: 'toaster_joke' },
            { text: "Just give me the bill.", next: 'business' }
        ]
    },
    diagnostics: {
        id: 'diagnostics',
        location: 'internal_mind',
        locationName: 'Neural Interface [DEBUG MODE]',
        bgImage: '/narrative/static/images/neural_interface_bg_1764928815915.png',
        character: 'ai_companion',
        speakerName: 'A.L.I.C.E.',
        text: "Running system check... CRITICAL ERROR. Credits: 0. Street Cred: Low. Hardware integrity: 64%. You really messed up this time.",
        choices: [
            { text: "Wake up.", next: 'wake_up' }
        ]
    },
    toaster_joke: {
        id: 'toaster_joke',
        location: 'clinic_alley',
        locationName: 'Doc Stitch\'s Back Alley',
        bgImage: '/narrative/static/images/clinic_alley_bg_1764928786118.png',
        character: 'doc_stitch',
        speakerName: 'Doc Stitch',
        text: "Hey, it was a high-end toaster. Military grade heating coils. You should feel warmer already. That'll be 500 creds.",
        actionSlide: {
            type: 'item',
            icon: 'toaster',
            color: 'text-orange-500',
            label: 'MIL-SPEC COIL'
        },
        choices: [
            { text: "I don't have that kind of scratch.", next: 'debt' },
            { text: "Put it on my tab.", next: 'debt' }
        ]
    },
    business: {
        id: 'business',
        location: 'clinic_alley',
        locationName: 'Doc Stitch\'s Back Alley',
        bgImage: '/narrative/static/images/clinic_alley_bg_1764928786118.png',
        character: 'doc_stitch',
        speakerName: 'Doc Stitch',
        text: "Cold as always. I respect that. 500 creds for the patch job. Don't make me repossess your arm.",
        actionSlide: {
            type: 'threat',
            icon: 'blade',
            color: 'text-red-500',
            label: 'THREAT DETECTED'
        },
        choices: [
            { text: "I'm good for it. Eventually.", next: 'debt' }
        ]
    },
    debt: {
        id: 'debt',
        location: 'street_market',
        locationName: 'Neon Market',
        bgImage: '/narrative/static/images/neon_market_bg_1764928801671.png',
        character: 'fixer_jax',
        speakerName: 'Jax (The Fixer)',
        text: "Hearing you owe people money, Runner. I might have a job that can wipe the slate clean. High risk, high reward. Interested?",
        choices: [
            { text: "I'm listening.", next: 'start' },
            { text: "Not interested.", next: 'start' }
        ]
    }
};

// --- Sound Engine (Web Audio API) ---

const createSoundEngine = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    let ambienceNode = null;
    let gainNode = null;

    const createPinkNoise = () => {
        const bufferSize = 4096;
        const pinkNoise = (function () {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            const node = ctx.createScriptProcessor(bufferSize, 1, 1);
            node.onaudioprocess = function (e) {
                const output = e.outputBuffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    const white = Math.random() * 2 - 1;
                    b0 = 0.99886 * b0 + white * 0.0555179;
                    b1 = 0.99332 * b1 + white * 0.0750759;
                    b2 = 0.96900 * b2 + white * 0.1538520;
                    b3 = 0.86650 * b3 + white * 0.3104856;
                    b4 = 0.55000 * b4 + white * 0.5329522;
                    b5 = -0.7616 * b5 - white * 0.0168980;
                    output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                    output[i] *= 0.11;
                    b6 = white * 0.115926;
                }
            };
            return node;
        })();

        gainNode = ctx.createGain();
        gainNode.gain.value = 0.05;
        pinkNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        ambienceNode = pinkNoise;
    };

    const playTone = (freq, type, duration, vol = 0.1) => {
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => { });
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(vol, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    return {
        init: () => { if (!ambienceNode) createPinkNoise(); },
        resume: () => { if (ctx.state === 'suspended') ctx.resume(); },
        playType: () => playTone(800 + Math.random() * 200, 'sine', 0.05, 0.02),
        playHover: () => playTone(400, 'triangle', 0.1, 0.05),
        playClick: () => playTone(200, 'square', 0.2, 0.05),
        playSlide: () => playTone(150, 'sawtooth', 0.3, 0.05),
        context: ctx
    };
};

// --- Components ---

const NeonRain = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        const columns = Math.floor(width / 20);
        const drops = new Array(columns).fill(1);

        let animationFrameId;

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
            ctx.fillRect(0, 0, width, height);
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = String.fromCharCode(0x30A0 + Math.random() * 96);
                const x = i * 20;
                const y = drops[i] * 20;
                ctx.fillStyle = Math.random() > 0.95 ? '#fff' : (Math.random() > 0.8 ? '#0ff' : '#00aa00');
                ctx.fillText(text, x, y);
                if (y > height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30 pointer-events-none" />;
};

const GlitchText = ({ text }) => {
    return (
        <span className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span aria-hidden="true" className="absolute top-0 left-0 -ml-0.5 translate-x-[2px] text-red-500 opacity-0 group-hover:opacity-70 animate-pulse z-0 select-none">
                {text}
            </span>
            <span aria-hidden="true" className="absolute top-0 left-0 -ml-0.5 -translate-x-[2px] text-cyan-500 opacity-0 group-hover:opacity-70 animate-pulse delay-75 z-0 select-none">
                {text}
            </span>
        </span>
    );
};

const Scanlines = () => (
    <>
        <style>
            {`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scan {
          animation: scan 4s linear infinite;
        }
      `}
        </style>
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden h-full w-full">
            <div className="w-full h-24 bg-gradient-to-b from-transparent via-white/5 to-transparent absolute top-0 animate-scan"
                style={{ boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}></div>
            <div className="w-full h-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_3px,3px_100%] pointer-events-none opacity-50"></div>
        </div>
    </>
);

const SlideInGraphic = ({ data }) => {
    if (!data) return null;

    const getIcon = () => {
        if (data.icon === 'blade') return <FAIcon icon="cut" size={120} className="text-red-500 animate-pulse" />;
        if (data.icon === 'toaster') return <FAIcon icon="bolt" size={120} className="text-orange-500 animate-pulse" />;
        return <FAIcon icon="chart-line" size={120} className="text-cyan-500" />;
    };

    return (
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-0 z-30 transition-transform duration-700 ease-out animate-in slide-in-from-right-full">
            <div className={`
        bg-black/90 border-l-4 border-b-4 ${data.type === 'threat' ? 'border-red-600' : 'border-orange-500'} 
        p-6 pr-12 shadow-2xl backdrop-blur-md clip-path-polygon
      `}>
                <div className="flex flex-col items-center gap-4">
                    {getIcon()}
                    <span className={`text-xl font-bold tracking-widest ${data.color}`}>{data.label}</span>
                </div>
            </div>
        </div>
    );
};

const CharacterDisplay = ({ characterId }) => {
    const getCharacterData = () => {
        switch (characterId) {
            case 'doc_stitch':
                return {
                    image: '/narrative/static/images/doc_stitch_portrait_1764928742522.png',
                    borderColor: 'border-yellow-600',
                    glowColor: 'shadow-[0_0_20px_rgba(202,138,4,0.5)]'
                };
            case 'fixer_jax':
                return {
                    image: '/narrative/static/images/jax_fixer_portrait_1764928757273.png',
                    borderColor: 'border-purple-600',
                    glowColor: 'shadow-[0_0_20px_rgba(147,51,234,0.5)]'
                };
            case 'ai_companion':
                return {
                    image: '/narrative/static/images/alice_ai_portrait_1764928771507.png',
                    borderColor: 'border-cyan-600',
                    glowColor: 'shadow-[0_0_20px_rgba(8,145,178,0.5)]'
                };
            default:
                return null;
        }
    };

    if (characterId === 'unknown') return null;

    const charData = getCharacterData();
    if (!charData) return null;

    return (
        <div className="w-48 h-48 md:w-64 md:h-64 transition-all duration-500 ease-in-out transform translate-y-0 opacity-100">
            <div className={`w-full h-full overflow-hidden border-4 ${charData.borderColor} ${charData.glowColor} bg-black`}>
                <img
                    src={charData.image}
                    alt="Character Portrait"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
};

const Typewriter = ({ text, speed = 20, onComplete, playSound }) => {
    const [displayedText, setDisplayedText] = useState('');
    const lastLength = useRef(0);

    useEffect(() => {
        setDisplayedText('');
        lastLength.current = 0;

        let i = 0;
        const timer = setInterval(() => {
            i++;
            if (playSound && i > lastLength.current && i <= text.length) {
                if (i % 2 === 0) playSound();
            }
            lastLength.current = i;

            setDisplayedText(text.slice(0, i));

            if (i >= text.length) {
                clearInterval(timer);
                if (onComplete) onComplete();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, playSound]); // Removed onComplete from dependencies

    return <span>{displayedText}</span>;
};

// --- Voice Synthesis Component ---

const VoicePlayer = ({ text, characterId, enabled, onComplete, onPlayStateChange }) => {
    const audioRef = useRef(new Audio());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const lastPlayedRef = useRef(null);

    // Stop audio when disabled or unmounted
    useEffect(() => {
        if (!enabled) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            if (onPlayStateChange) onPlayStateChange(false);
        }
    }, [enabled, onPlayStateChange]);

    useEffect(() => {
        if (!enabled || !text) return;

        // Prevent re-playing the same text/char combo immediately
        const playKey = `${characterId}:${text.substring(0, 20)}`;
        if (lastPlayedRef.current === playKey) return;

        const playVoice = async () => {
            setIsLoading(true);
            setError(null);
            if (onPlayStateChange) onPlayStateChange(true);

            try {
                // Create abort controller for 3-second timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000);

                const response = await fetch('/narrative/api/voice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text, character_id: characterId }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) throw new Error('Voice generation failed');

                const blob = await response.blob();

                // Check if response is actually audio (not error JSON)
                if (blob.size === 0 || blob.type.includes('json')) {
                    throw new Error('Empty or invalid audio response');
                }

                const url = URL.createObjectURL(blob);

                audioRef.current.src = url;
                audioRef.current.play().catch(e => console.warn("Audio play blocked:", e));

                lastPlayedRef.current = playKey;

                audioRef.current.onended = () => {
                    if (onComplete) onComplete();
                    if (onPlayStateChange) onPlayStateChange(false);
                    URL.revokeObjectURL(url);
                };

                audioRef.current.onerror = () => {
                    console.warn("Audio playback error - continuing without voice");
                    if (onPlayStateChange) onPlayStateChange(false);
                    if (onComplete) onComplete();
                };

            } catch (err) {
                // Silent fallback - just log and continue
                if (err.name === 'AbortError') {
                    console.warn("Voice generation timeout - continuing without voice");
                } else {
                    console.warn("Voice error (continuing silently):", err.message);
                }
                setError(err);
                if (onPlayStateChange) onPlayStateChange(false);
                // Mark complete immediately - text will show without voice
                if (onComplete) onComplete();
            } finally {
                setIsLoading(false);
            }
        };

        playVoice();

        return () => {
            audioRef.current.pause();
            // Don't revoke URL here immediately as it might cut off
        };
    }, [text, characterId, enabled, onComplete, onPlayStateChange]);

    return null; // Invisible component
};

// --- Main Application ---

function App() {
    const [currentSceneId, setCurrentSceneId] = useState('start');
    const [isTextFinished, setIsTextFinished] = useState(false);
    const [history, setHistory] = useState([]);

    // Voice State
    const [voiceEnabled, setVoiceEnabled] = useState(true);
    const [isVoicePlaying, setIsVoicePlaying] = useState(false);

    const soundEngine = useRef(null);

    useEffect(() => {
        soundEngine.current = createSoundEngine();
        soundEngine.current.init();
    }, []);

    const playTypeSound = useCallback(() => { soundEngine.current?.playType(); }, []);
    const playHoverSound = useCallback(() => { soundEngine.current?.playHover(); }, []);
    const ensureAudio = useCallback(() => { soundEngine.current?.resume(); }, []);
    const handleTextComplete = useCallback(() => { setIsTextFinished(true); }, []);

    const currentScene = STORY_DATA[currentSceneId];
    const lastHistoryItem = history.length > 0 ? history[history.length - 1] : null;
    const lastSceneData = lastHistoryItem ? STORY_DATA[lastHistoryItem.id] : null;

    // Image Preloading Hook
    useEffect(() => {
        if (currentScene.choices) {
            currentScene.choices.forEach(choice => {
                const nextScene = STORY_DATA[choice.next];
                if (nextScene && nextScene.bgImage) {
                    const img = new Image();
                    img.src = nextScene.bgImage;
                }
                // Optional: Preload voice here if we wanted to get fancy
            });
        }
    }, [currentScene]);

    const handleChoice = (nextId, choiceText) => {
        ensureAudio();
        soundEngine.current?.playClick();
        setHistory([...history, { id: currentSceneId, choice: choiceText }]);
        setIsTextFinished(false);
        setCurrentSceneId(nextId);
    };

    const toggleVoice = (e) => {
        e.stopPropagation();
        setVoiceEnabled(!voiceEnabled);
    };

    useEffect(() => {
        if (currentScene.actionSlide) {
            soundEngine.current?.playSlide();
        }
    }, [currentSceneId, currentScene.actionSlide]);

    return (
        <div className="relative w-full h-screen overflow-hidden text-zinc-100 font-mono" onClick={ensureAudio}>

            {/* Voice Player */}
            <VoicePlayer
                text={currentScene.text}
                characterId={currentScene.character}
                enabled={voiceEnabled}
                // When voice finishes, nothing special needs to happen for now, 
                // as text completion controls the choices.
                onPlayStateChange={setIsVoicePlaying}
            />

            {/* BACKGROUND LAYER */}
            <div className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out">
                {currentScene.bgImage ? (
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
                        style={{ backgroundImage: `url(${currentScene.bgImage})` }}
                    />
                ) : (
                    <div className={`absolute inset-0 ${currentScene.bgClass || 'bg-zinc-900'}`} />
                )}

                <div className="absolute inset-0 bg-black/70"></div>

                <NeonRain />
                <Scanlines />
            </div>

            {/* ACTION SLIDE GRAPHIC LAYER */}
            <SlideInGraphic data={currentScene.actionSlide} />

            {/* UI LAYER */}
            <div className="absolute inset-0 z-40 overflow-y-auto flex flex-col">

                <header className="p-4 flex justify-between items-center border-b border-zinc-800/50 bg-black/40 backdrop-blur-sm sticky top-0 z-50">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <FAIcon icon="terminal" size={18} />
                        <span className="text-sm tracking-widest font-bold hidden md:inline">CYBER_NARRATIVE_OS_v3.3</span>
                    </div>
                    <div className="flex gap-4 text-xs md:text-sm items-center">
                        {/* Voice Toggle */}
                        <button
                            onClick={toggleVoice}
                            className={`flex items-center gap-1 transition-colors ${voiceEnabled ? 'text-cyan-400' : 'text-zinc-600'}`}
                            title={voiceEnabled ? "Mute Voice" : "Enable Voice"}
                        >
                            <FAIcon icon={voiceEnabled ? "microphone" : "microphone-slash"} size={14} />
                            <span className="hidden md:inline">{voiceEnabled ? "VOICE: ON" : "VOICE: OFF"}</span>
                        </button>

                        <div className="flex items-center gap-1 text-green-400">
                            <FAIcon icon="shield-alt" size={14} />
                            <span className="hidden md:inline">SYNC: 98%</span>
                        </div>
                        <div className="flex items-center gap-1 text-zinc-400">
                            <FAIcon icon="map-marker-alt" size={14} />
                            <span>{currentScene.locationName}</span>
                        </div>
                        <div className={`flex items-center gap-1 ${isVoicePlaying ? 'text-cyan-400 animate-pulse' : 'text-zinc-500'}`}>
                            <FAIcon icon={isVoicePlaying ? "wave-square" : "volume-up"} size={14} />
                            <span className="text-[10px]">{isVoicePlaying ? "TRANSMITTING..." : "AUDIO_READY"}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-grow flex flex-col items-center justify-center p-4 min-h-[500px]">
                    <div className="mb-8 relative z-20">
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent blur-xl transform scale-150 pointer-events-none"></div>
                        <CharacterDisplay characterId={currentScene.character} />
                    </div>

                    <section className="w-full max-w-4xl mx-auto pb-12 px-2 md:px-0">

                        {lastSceneData && (
                            <div className="mb-6 opacity-60 hover:opacity-100 transition-opacity duration-300 group select-none">
                                <div className="flex items-baseline gap-2 mb-1 ml-4 md:ml-0">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest border-b border-zinc-700 pb-1">
                    // ARCHIVE: {lastSceneData.speakerName}
                                    </span>
                                </div>
                                <div className="bg-black/40 border-l-2 border-zinc-600 pl-4 py-3 text-sm md:text-base text-zinc-400 italic mb-2">
                                    "{lastSceneData.text}"
                                </div>
                                <div className="flex justify-end mt-1 mr-4 md:mr-0">
                                    <div className="bg-zinc-900/80 border-r-2 border-cyan-500 pr-4 py-2 pl-6 text-right inline-block">
                                        <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-widest mr-2 block">
                                            YOU CHOSE //
                                        </span>
                                        <span className="text-cyan-400 font-medium text-sm">
                                            "{lastHistoryItem.choice}"
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-baseline gap-2 mb-[-2px] ml-4 md:ml-0">
                            <div className="bg-cyan-600 text-black px-4 py-1 font-bold text-sm uppercase skew-x-[-10deg] border-r-4 border-white shadow-[0_0_10px_rgba(8,145,178,0.5)]">
                                <span className="skew-x-[10deg] inline-block">{currentScene.speakerName}</span>
                            </div>
                        </div>

                        <div className="bg-zinc-950/90 border-t-2 border-l-2 border-r-2 border-cyan-700 p-6 md:p-8 min-h-[160px] shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-cyan-400"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-cyan-400"></div>

                            <div className="text-lg md:text-xl leading-relaxed text-zinc-100 font-medium drop-shadow-sm">
                                <Typewriter
                                    key={currentSceneId}
                                    text={currentScene.text}
                                    onComplete={handleTextComplete}
                                    speed={20}
                                    playSound={voiceEnabled ? null : playTypeSound} // Disable type sound if voice is on
                                />
                                {isTextFinished && <span className="inline-block w-2 h-5 bg-cyan-400 ml-1 animate-pulse align-middle"></span>}
                            </div>
                        </div>

                        <div
                            key={currentSceneId}
                            className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4"
                        >
                            {currentScene.choices.map((choice, idx) => (
                                <button
                                    key={idx}
                                    disabled={!isTextFinished}
                                    onMouseEnter={() => isTextFinished && playHoverSound()}
                                    onClick={() => handleChoice(choice.next, choice.text)}
                                    className={`
                    group relative overflow-hidden p-4 text-left border border-zinc-700 bg-zinc-900/95 transition-all duration-300
                    ${isTextFinished
                                            ? 'hover:border-pink-500 hover:bg-zinc-800 cursor-pointer opacity-100 hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] translate-y-0'
                                            : 'opacity-0 cursor-default translate-y-4'}
                  `}
                                    style={{ transitionDelay: isTextFinished ? `${idx * 150}ms` : '0ms' }}
                                >
                                    <div className="flex items-center justify-between relative z-10">
                                        <span className="text-zinc-300 group-hover:text-pink-400 font-bold tracking-wide">
                                            <span className="text-xs text-zinc-600 mr-2">0{idx + 1} //</span>
                                            <GlitchText text={choice.text} />
                                        </span>
                                        <FAIcon icon="chevron-right" size={16} className="text-zinc-600 group-hover:text-pink-400 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <div className="absolute inset-0 bg-pink-900/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 origin-left"></div>
                                </button>
                            ))}
                        </div>
                    </section>
                </main>

                <footer className="p-2 text-center text-[10px] text-zinc-600 border-t border-zinc-800 bg-black/80">
                    SYSTEM STATUS: ONLINE | CONNECTION: ENCRYPTED | MEMORY: 16TB
                </footer>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
