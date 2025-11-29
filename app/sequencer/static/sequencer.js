// --- Audio Engine Constants ---
const TOTAL_STEPS = 16;
const DEFAULT_BPM = 125;
const SCHEDULE_AHEAD_TIME = 0.1; // s

// --- State ---
let isPlaying = false;
let currentStep = 0;
let bpm = DEFAULT_BPM;
let volume = 0.8;
let filterFreq = 20000;
let distortionAmt = 20;
let isInitialized = false;

// Sampler State
let isRecording = false;
let hasSample = false;
let sampleSource = null; // 'mic' or 'file'
let samplePitch = 1.0;

// Grid State
let grid = [
    [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0], // Kick
    [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0], // Snare
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // CH
    [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0], // OH
    [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0], // Acid Bass
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // Stab
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0], // Sampler
];

// --- Audio Context & Nodes ---
let audioCtx = null;
let masterGainNode = null;
let masterFilterNode = null;
let distortionNode = null;
let nextNoteTime = 0.0;
let timerID = null;

// Sampler Buffers
let sampleBuffer = null;
let mediaRecorder = null;

// --- Helper Functions ---
const createDistortionCurve = (amount) => {
    const k = typeof amount === 'number' ? amount : 50;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
    }
    return curve;
};

// --- Initialization ---
const initAudio = async () => {
    if (audioCtx) return;

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();

    // Master Chain
    masterGainNode = audioCtx.createGain();
    masterGainNode.gain.value = volume;

    masterFilterNode = audioCtx.createBiquadFilter();
    masterFilterNode.type = 'lowpass';
    masterFilterNode.frequency.value = filterFreq;
    masterFilterNode.Q.value = 1;

    distortionNode = audioCtx.createWaveShaper();
    distortionNode.curve = createDistortionCurve(distortionAmt);
    distortionNode.oversample = '4x';

    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    // Connect Chain: MasterGain -> Distortion -> Filter -> Compressor -> Destination
    masterGainNode.connect(distortionNode);
    distortionNode.connect(masterFilterNode);
    masterFilterNode.connect(compressor);
    compressor.connect(audioCtx.destination);

    if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
    }

    isInitialized = true;
    updateUIState();
};

// --- Sound Synthesis ---
const playKick = (time) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(masterGainNode);
    osc.frequency.setValueAtTime(150, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    osc.start(time);
    osc.stop(time + 0.5);
};

const playSnare = (time) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'triangle';
    const oscGain = audioCtx.createGain();
    osc.connect(oscGain);
    oscGain.connect(masterGainNode);
    osc.frequency.setValueAtTime(250, time);
    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);

    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    const noiseGain = audioCtx.createGain();
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGainNode);
    noiseGain.gain.setValueAtTime(0.8, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    osc.start(time); osc.stop(time + 0.2);
    noise.start(time); noise.stop(time + 0.2);
};

const playHiHat = (time, open = false) => {
    const bufferSize = audioCtx.sampleRate * 0.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) { data[i] = Math.random() * 2 - 1; }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 10000;
    filter.Q.value = 1;
    const gain = audioCtx.createGain();
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainNode);
    const decay = open ? 0.4 : 0.05;
    gain.gain.setValueAtTime(0.3, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + decay);
    noise.start(time);
    noise.stop(time + decay);
};

const playAcidBass = (time) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 8;
    const gain = audioCtx.createGain();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainNode);
    const freq = 55;
    osc.frequency.setValueAtTime(freq, time);
    filter.frequency.setValueAtTime(200, time);
    filter.frequency.exponentialRampToValueAtTime(2000, time + 0.1);
    filter.frequency.exponentialRampToValueAtTime(200, time + 0.3);
    gain.gain.setValueAtTime(0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    osc.start(time);
    osc.stop(time + 0.4);
};

const playStab = (time) => {
    const createOsc = (detune) => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sawtooth';
        osc.detune.value = detune;
        osc.frequency.value = 440;
        return osc;
    };
    const osc1 = createOsc(-10);
    const osc2 = createOsc(10);
    const osc3 = createOsc(0);
    const sub = createOsc(0);
    sub.frequency.value = 220;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 2000;
    const gain = audioCtx.createGain();
    osc1.connect(filter);
    osc2.connect(filter);
    osc3.connect(filter);
    sub.connect(filter);
    filter.connect(gain);
    gain.connect(masterGainNode);
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);
    const stopTime = time + 0.3;
    osc1.start(time); osc1.stop(stopTime);
    osc2.start(time); osc2.stop(stopTime);
    osc3.start(time); osc3.stop(stopTime);
    sub.start(time); sub.stop(stopTime);
};

const playSample = (time) => {
    if (!sampleBuffer || !audioCtx) return;
    const source = audioCtx.createBufferSource();
    source.buffer = sampleBuffer;
    source.playbackRate.value = samplePitch;
    const sampleGain = audioCtx.createGain();
    sampleGain.gain.value = 0.9;
    source.connect(sampleGain);
    sampleGain.connect(masterGainNode);
    source.start(time);
};

// --- Scheduler ---
const nextNote = () => {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += 0.25 * secondsPerBeat;
    currentStep = (currentStep + 1) % TOTAL_STEPS;
};

const scheduleNote = (stepNumber, time) => {
    // Schedule UI update
    setTimeout(() => {
        updateStepUI(stepNumber);
    }, (time - audioCtx.currentTime) * 1000);

    if (grid[0][stepNumber]) playKick(time);
    if (grid[1][stepNumber]) playSnare(time);
    if (grid[2][stepNumber]) playHiHat(time, false);
    if (grid[3][stepNumber]) playHiHat(time, true);
    if (grid[4][stepNumber]) playAcidBass(time);
    if (grid[5][stepNumber]) playStab(time);
    if (grid[6][stepNumber]) playSample(time);
};

const scheduler = () => {
    while (nextNoteTime < audioCtx.currentTime + SCHEDULE_AHEAD_TIME) {
        scheduleNote(currentStep, nextNoteTime);
        nextNote();
    }
    timerID = requestAnimationFrame(scheduler);
};

// --- UI Updates ---
const updateUIState = () => {
    const initBtn = document.getElementById('init-btn');
    const mainInterface = document.getElementById('main-interface');

    if (isInitialized) {
        initBtn.classList.add('hidden');
        mainInterface.classList.remove('hidden');
    } else {
        initBtn.classList.remove('hidden');
        mainInterface.classList.add('hidden');
    }

    // Update Grid Initial State
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 16; c++) {
            updateCellUI(r, c);
        }
    }
};

const updateStepUI = (step) => {
    // Reset all indicators
    for (let i = 0; i < TOTAL_STEPS; i++) {
        const indicator = document.getElementById(`step-indicator-${i}`);
        if (i === step) {
            indicator.classList.remove('bg-gray-600', 'bg-gray-800');
            indicator.classList.add('bg-white', 'shadow-[0_0_10px_white]');
        } else {
            indicator.classList.remove('bg-white', 'shadow-[0_0_10px_white]');
            indicator.classList.add(i % 4 === 0 ? 'bg-gray-600' : 'bg-gray-800');
        }
    }
};

const updateCellUI = (row, col) => {
    const cell = document.getElementById(`cell-${row}-${col}`);
    const isActive = grid[row][col] === 1;

    if (isActive) {
        cell.classList.add('bg-current', 'shadow-[0_0_8px_currentColor]', 'scale-95');
        cell.classList.remove('bg-gray-800', 'hover:bg-gray-700');
        cell.style.backgroundColor = 'currentColor';
    } else {
        cell.classList.remove('bg-current', 'shadow-[0_0_8px_currentColor]', 'scale-95');
        cell.classList.add('bg-gray-800', 'hover:bg-gray-700');
        cell.style.backgroundColor = '';
    }
};

const updatePlayButton = () => {
    const btn = document.getElementById('play-btn');
    const icon = btn.querySelector('i');
    const text = btn.querySelector('span');

    if (isPlaying) {
        btn.classList.remove('bg-green-600', 'hover:bg-green-500');
        btn.classList.add('bg-pink-600', 'shadow-[0_0_15px_rgba(236,72,153,0.6)]');
        text.textContent = 'STOP';
        icon.setAttribute('data-lucide', 'square');
    } else {
        btn.classList.remove('bg-pink-600', 'shadow-[0_0_15px_rgba(236,72,153,0.6)]');
        btn.classList.add('bg-green-600', 'hover:bg-green-500');
        text.textContent = 'PLAY';
        icon.setAttribute('data-lucide', 'play');
    }
    lucide.createIcons();
};

const updateSamplerStatus = () => {
    const status = document.getElementById('sampler-status');
    if (hasSample) {
        status.textContent = sampleSource === 'mic' ? "MIC REC" : "FILE LOADED";
    } else {
        status.textContent = "EMPTY";
    }
};

const updateRecordButton = () => {
    const btn = document.getElementById('record-btn');
    const icon = btn.querySelector('i');

    if (isRecording) {
        btn.classList.remove('bg-gray-800', 'border-gray-600', 'text-gray-300');
        btn.classList.add('bg-red-600', 'border-red-500', 'animate-pulse', 'text-white');
        icon.setAttribute('data-lucide', 'mic-off');
    } else {
        btn.classList.remove('bg-red-600', 'border-red-500', 'animate-pulse', 'text-white');
        btn.classList.add('bg-gray-800', 'border-gray-600', 'text-gray-300');
        icon.setAttribute('data-lucide', 'mic');
    }
    lucide.createIcons();
};

// --- Event Handlers ---
window.toggleGridStep = (row, col) => {
    grid[row][col] = grid[row][col] ? 0 : 1;
    updateCellUI(row, col);
};

const togglePlay = () => {
    if (isPlaying) {
        cancelAnimationFrame(timerID);
        isPlaying = false;
        currentStep = 0;
        updateStepUI(-1); // Clear indicators
    } else {
        if (!audioCtx) initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        nextNoteTime = audioCtx.currentTime + 0.05;
        currentStep = 0;
        isPlaying = true;
        scheduler();
    }
    updatePlayButton();
};

const clearGrid = () => {
    grid = grid.map(row => row.map(() => 0));
    for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 16; c++) {
            updateCellUI(r, c);
        }
    }
};

const toggleRecording = async () => {
    if (isRecording) {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
            isRecording = false;
        }
    } else {
        if (!audioCtx) await initAudio();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
                const arrayBuffer = await blob.arrayBuffer();
                sampleBuffer = await audioCtx.decodeAudioData(arrayBuffer);
                hasSample = true;
                sampleSource = 'mic';
                updateSamplerStatus();
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            isRecording = true;
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    }
    updateRecordButton();
};

const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!audioCtx) await initAudio();

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const arrayBuffer = event.target.result;
            sampleBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            hasSample = true;
            sampleSource = 'file';
            updateSamplerStatus();
        } catch (err) {
            console.error("Error decoding file:", err);
            alert("Sorry, could not extract audio from this file.");
        }
    };
    reader.readAsArrayBuffer(file);
};

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('init-btn').addEventListener('click', initAudio);
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('clear-btn').addEventListener('click', clearGrid);

    document.getElementById('bpm-input').addEventListener('change', (e) => {
        bpm = Number(e.target.value);
    });

    document.getElementById('volume-slider').addEventListener('input', (e) => {
        volume = Number(e.target.value);
        if (masterGainNode) masterGainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.1);
    });

    document.getElementById('filter-slider').addEventListener('input', (e) => {
        filterFreq = Number(e.target.value);
        if (masterFilterNode) {
            const val = Math.max(50, Math.min(filterFreq, 22000));
            masterFilterNode.frequency.setTargetAtTime(val, audioCtx.currentTime, 0.1);
        }
    });

    document.getElementById('distortion-slider').addEventListener('input', (e) => {
        distortionAmt = Number(e.target.value);
        if (distortionNode) distortionNode.curve = createDistortionCurve(distortionAmt);
    });

    document.getElementById('record-btn').addEventListener('click', toggleRecording);

    document.getElementById('upload-btn').addEventListener('click', () => {
        document.getElementById('file-input').click();
    });

    document.getElementById('file-input').addEventListener('change', handleFileUpload);

    document.getElementById('pitch-slider').addEventListener('input', (e) => {
        samplePitch = Number(e.target.value);
    });
});
