// --- STATE MANAGEMENT ---
const initialState = {
    gender: 'female',
    skinColor: '#FFE4D6',
    hairColor: '#00FFFF',
    eyeColor: '#00FFFF',
    clothesColor: '#111111',
    hairFront: 'straight',
    hairBack: 'long',
    eyes: 'cute',
    clothes: 'school',
    accessory: 'none',
    breastSize: 'medium',
    isRevealing: false,
    footwear: 'sneakers',
    age: 20,
    mouth: 'smile',
    brows: 'neutral',
    pose: 'standing',
    cyberware: 'organic'
};

let state = { ...initialState };

// --- DOM ELEMENTS ---
let previewContainer, controlsContainer, promptDisplay, randomizeBtn, renderBtn;

// --- TAB SYSTEM ---
let currentTab = 'body';

// --- HELPER FUNCTIONS ---

function getPoseTransform(poseId) {
    const pose = POSES.find(p => p.id === poseId);
    return pose ? pose.transform : '';
}

function renderSVG() {
    const {
        gender, skinColor, hairColor, eyeColor, clothesColor,
        hairFront, hairBack, eyes, clothes, accessory,
        breastSize, isRevealing, footwear, age, mouth, brows,
        pose, cyberware
    } = state;

    const bodyData = ASSETS.body[gender];
    const poseTransform = getPoseTransform(pose);

    // Helper to find asset by ID
    const getAsset = (category, id) => ASSETS[category].find(i => i.id === id);

    const hairFrontData = getAsset('hairFront', hairFront);
    const hairBackData = getAsset('hairBack', hairBack);
    const eyesData = getAsset('eyes', eyes);
    const browsData = getAsset('brows', brows);
    const mouthData = getAsset('mouths', mouth);
    const clothesData = getAsset('clothes', clothes);
    const accessoryData = getAsset('accessories', accessory);
    const breastData = BREAST_SIZES.find(b => b.id === breastSize);
    const footwearData = FOOTWEAR.find(f => f.id === footwear);

    // Cyberware overlays
    let cyberOverlay = '';
    if (cyberware !== 'organic') {
        const opacity = cyberware === 'light' ? 0.3 : cyberware === 'heavy' ? 0.6 : 0.9;
        cyberOverlay = `
            <path d="${bodyData.base}" fill="url(#cyber-pattern)" opacity="${opacity}" />
            <path d="${bodyData.legs}" fill="url(#cyber-pattern)" opacity="${opacity}" />
        `;
    }

    // Clothes paths
    let clothesPath = clothesData.path;
    if (isRevealing && clothesData.pathRev) clothesPath = clothesData.pathRev;
    if (gender === 'male' && clothesData.pathMale) clothesPath = clothesData.pathMale;

    // Breast path (female only)
    let breastPath = '';
    if (gender === 'female' && breastData && breastData.path) {
        breastPath = `<path d="${breastData.path}" fill="none" stroke="#000" stroke-width="1" opacity="0.2" />`;
    }

    return `
    <svg viewBox="0 0 200 500" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
        <defs>
            <linearGradient id="cyber-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${hairColor}" />
                <stop offset="100%" stop-color="${clothesColor}" />
            </linearGradient>
            <pattern id="cyber-pattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="10" height="10" fill="none" />
                <path d="M0 10 L10 0" stroke="${hairColor}" stroke-width="0.5" opacity="0.5" />
            </pattern>
        </defs>

        <g transform="${poseTransform}">
            <!-- LAYER 1: Hair Back -->
            <path d="${hairBackData.path}" fill="${hairColor}" stroke="#000" stroke-width="1" fill-opacity="1" />

            <!-- LAYER 2: Body Base -->
            <path d="${bodyData.base}" fill="${skinColor}" stroke="#000" stroke-width="1" fill-opacity="1" />
            
            <!-- LAYER 3: Legs -->
            <path d="${bodyData.legs}" fill="${skinColor}" stroke="#000" stroke-width="1" fill-opacity="1" />

            <!-- LAYER 4: Face Base -->
            <path d="${bodyData.face}" fill="${skinColor}" stroke="#000" stroke-width="1" fill-opacity="1" />

            <!-- LAYER 5: Cyberware Overlay -->
            ${cyberOverlay}

            <!-- LAYER 6: Footwear -->
            <path d="${footwearData.path}" fill="${clothesColor}" stroke="#333" stroke-width="1" fill-opacity="1" />

            <!-- LAYER 7: Clothes -->
            <path d="${clothesPath}" fill="${clothesColor}" stroke="#000" stroke-width="1" fill-opacity="1" />
            ${clothesData.collar ? `<path d="M75,180 Q100,190 125,180" fill="none" stroke="#FFF" stroke-width="2" />` : ''}

            <!-- LAYER 8: Breasts -->
            ${breastPath}

            <!-- LAYER 9: Face Details -->
            <g fill="${eyeColor}">
                <path d="${eyesData.pathL}" fill-opacity="1" />
                <path d="${eyesData.pathR}" fill-opacity="1" />
                <circle cx="82" cy="95" r="${eyesData.pupil}" fill="#000" fill-opacity="1" />
                <circle cx="118" cy="95" r="${eyesData.pupil}" fill="#000" fill-opacity="1" />
            </g>

            <g fill="none" stroke="${hairColor}" stroke-width="2">
                <path d="${browsData.pathL}" />
                <path d="${browsData.pathR}" />
            </g>

            <path d="${mouthData.path}" fill="${mouthData.fill ? '#A93226' : 'none'}" stroke="#000" stroke-width="1" fill-opacity="1" />

            <!-- LAYER 10: Hair Front -->
            <path d="${hairFrontData.path}" fill="${hairColor}" stroke="#000" stroke-width="1" fill-opacity="1" />

            <!-- LAYER 11: Accessories -->
            ${accessoryData.render(hairColor)}
        </g>
    </svg>
    `;
}

function generatePrompt() {
    const {
        gender, skinColor, hairColor, eyeColor, clothesColor,
        hairFront, hairBack, eyes, clothes, accessory,
        breastSize, isRevealing, footwear, age, mouth, brows,
        pose, cyberware
    } = state;

    const getAssetName = (cat, id) => ASSETS[cat].find(i => i.id === id)?.name || id;
    const getAssetDesc = (cat, id) => ASSETS[cat].find(i => i.id === id)?.desc || '';

    let prompt = `(best quality, masterpiece:1.2), cyberpunk, sci-fi, `;
    prompt += `${gender}, ${age} years old, `;
    prompt += `${skinColor} skin, ${hairColor} hair, ${eyeColor} eyes, `;
    prompt += `${getAssetName('hairFront', hairFront)} and ${getAssetName('hairBack', hairBack)} hairstyle, `;
    prompt += `${getAssetDesc('eyes', eyes)}, `;
    prompt += `${getAssetName('clothes', clothes)} (${clothesColor}), `;

    if (accessory !== 'none') prompt += `${getAssetDesc('accessories', accessory)}, `;
    if (gender === 'female') prompt += `${BREAST_SIZES.find(b => b.id === breastSize).prompt}, `;

    prompt += `${FOOTWEAR.find(f => f.id === footwear).prompt}, `;
    prompt += `${POSES.find(p => p.id === pose).prompt}, `;
    prompt += `${CYBERWARE_LEVELS.find(c => c.id === cyberware).desc}, `;
    prompt += `neon lights, futuristic city background`;

    return prompt;
}

function updatePreview() {
    if (previewContainer) {
        previewContainer.innerHTML = renderSVG();
    }
    if (promptDisplay) {
        promptDisplay.value = generatePrompt();
    }
}

function randomize() {
    const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

    state = {
        ...state,
        gender: Math.random() > 0.5 ? 'female' : 'male',
        skinColor: randomItem(COLOR_PALETTES.skin).hex,
        hairColor: randomItem(COLOR_PALETTES.hair).hex,
        eyeColor: randomItem(COLOR_PALETTES.eyes).hex,
        clothesColor: randomItem(COLOR_PALETTES.clothes).hex,
        hairFront: randomItem(ASSETS.hairFront).id,
        hairBack: randomItem(ASSETS.hairBack).id,
        eyes: randomItem(ASSETS.eyes).id,
        clothes: randomItem(ASSETS.clothes).id,
        accessory: randomItem(ASSETS.accessories).id,
        breastSize: randomItem(BREAST_SIZES).id,
        footwear: randomItem(FOOTWEAR).id,
        pose: randomItem(POSES).id,
        cyberware: randomItem(CYBERWARE_LEVELS).id,
    };
    updatePreview();
    updateControls();
}

// --- UI GENERATION ---

function renderColorPicker(label, category, currentVal, stateKey) {
    return `
        <div class="mb-6">
            <label class="block mb-3 text-cyan-300 text-sm font-bold uppercase tracking-wider">${label}</label>
            <div class="flex flex-wrap gap-2">
                ${COLOR_PALETTES[category].map(c => `
                    <div class="w-8 h-8 rounded-full cursor-pointer border-2 transition-transform hover:scale-110 ${currentVal === c.hex ? 'border-white shadow-lg' : 'border-transparent'}" 
                         style="background-color: ${c.hex}"
                         onclick="updateState('${stateKey}', '${c.hex}')"
                         title="${c.name}">
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

function renderOptionGrid(label, items, currentVal, stateKey) {
    return `
        <div class="mb-6">
            <label class="block mb-3 text-cyan-300 text-sm font-bold uppercase tracking-wider">${label}</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                ${items.map(item => `
                    <button class="px-3 py-2 bg-gray-900 border text-xs font-medium rounded-lg transition-all ${currentVal === item.id ? 'border-cyan-500 text-cyan-400 bg-cyan-900/20' : 'border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-800'}"
                            onclick="updateState('${stateKey}', '${item.id}')">
                        ${item.name}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function renderControlsContent() {
    let content = '';

    if (currentTab === 'body') {
        content += renderOptionGrid('Gender', [{ id: 'female', name: 'Female' }, { id: 'male', name: 'Male' }], state.gender, 'gender');
        content += renderColorPicker('Skin Tone', 'skin', state.skinColor, 'skinColor');
        content += renderOptionGrid('Body Type', BREAST_SIZES, state.breastSize, 'breastSize');
        content += renderOptionGrid('Pose', POSES, state.pose, 'pose');
        content += renderOptionGrid('Cyberware', CYBERWARE_LEVELS, state.cyberware, 'cyberware');
    } else if (currentTab === 'hair') {
        content += renderColorPicker('Hair Color', 'hair', state.hairColor, 'hairColor');
        content += renderOptionGrid('Bangs', ASSETS.hairFront, state.hairFront, 'hairFront');
        content += renderOptionGrid('Back', ASSETS.hairBack, state.hairBack, 'hairBack');
    } else if (currentTab === 'face') {
        content += renderColorPicker('Eye Color', 'eyes', state.eyeColor, 'eyeColor');
        content += renderOptionGrid('Eyes', ASSETS.eyes, state.eyes, 'eyes');
        content += renderOptionGrid('Brows', ASSETS.brows, state.brows, 'brows');
        content += renderOptionGrid('Mouth', ASSETS.mouths, state.mouth, 'mouth');
    } else if (currentTab === 'gear') {
        content += renderColorPicker('Clothes Color', 'clothes', state.clothesColor, 'clothesColor');
        content += renderOptionGrid('Outfit', ASSETS.clothes, state.clothes, 'clothes');
        content += renderOptionGrid('Footwear', FOOTWEAR, state.footwear, 'footwear');
        content += renderOptionGrid('Accessory', ASSETS.accessories, state.accessory, 'accessory');
        content += `
            <div class="mb-6">
                <label class="flex items-center gap-2 text-cyan-300 text-sm font-medium cursor-pointer">
                    <input type="checkbox" ${state.isRevealing ? 'checked' : ''} 
                           onchange="updateState('isRevealing', this.checked)"
                           class="w-4 h-4 rounded border-gray-700 bg-gray-900 text-cyan-500">
                    <span>Revealing Variant</span>
                </label>
            </div>
        `;
    } else if (currentTab === 'style') {
        content += `
            <div class="mb-6">
                <label class="block mb-3 text-cyan-300 text-sm font-bold uppercase tracking-wider">Presets</label>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    ${PRESETS.map(p => `
                        <button class="px-4 py-3 bg-gray-900 border border-gray-700 text-left rounded-lg transition-all hover:border-cyan-500 hover:bg-cyan-900/10" onclick="loadPreset('${p.id}')">
                            <div class="font-bold text-cyan-400 text-sm">${p.name}</div>
                            <div class="text-xs text-gray-500">${p.series}</div>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    return content;
}

function updateControls() {
    if (controlsContainer) {
        controlsContainer.innerHTML = renderControlsContent();
    }
}

function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            currentTab = tabId;
            updateControls();

            // Update active states
            tabButtons.forEach(b => {
                b.classList.remove('border-cyan-500', 'text-cyan-400', 'bg-cyan-900/20');
                b.classList.add('border-transparent', 'text-gray-600');
            });
            btn.classList.remove('border-transparent', 'text-gray-600');
            btn.classList.add('border-cyan-500', 'text-cyan-400', 'bg-cyan-900/20');
        });
    });

    // Activate first tab
    if (tabButtons.length > 0) {
        tabButtons[0].click();
    }
}

// --- GLOBAL HELPERS ---

window.updateState = function (key, value) {
    state[key] = value;
    updatePreview();
    updateControls();
};

window.loadPreset = function (id) {
    const preset = PRESETS.find(p => p.id === id);
    if (preset) {
        state = { ...state, ...preset.data };
        updatePreview();
        updateControls();
    }
};

// --- INITIALIZATION ---

document.addEventListener('DOMContentLoaded', () => {
    previewContainer = document.getElementById('preview-container');
    controlsContainer = document.getElementById('controls-container');
    promptDisplay = document.getElementById('prompt-display');
    randomizeBtn = document.getElementById('randomize-btn');
    renderBtn = document.getElementById('render-btn');

    initializeTabs();

    if (randomizeBtn) randomizeBtn.addEventListener('click', randomize);

    updatePreview();
    updateControls();
});
