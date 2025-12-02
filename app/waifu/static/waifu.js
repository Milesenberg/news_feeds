// --- STATE ---
let character = {
    skinColor: window.COLOR_PALETTES.skin[0].hex,
    hairColor: window.COLOR_PALETTES.hair[0].hex,
    eyeColor: window.COLOR_PALETTES.eyes[0].hex,
    clothesColor: window.COLOR_PALETTES.clothes[0].hex,
    bgColor: window.COLOR_PALETTES.bg[0],
    hairFront: 'hime',
    hairBack: 'long',
    eyes: 'cute',
    brows: 'neutral',
    mouth: 'smile',
    clothes: 'school',
    accessory: 'none',
    breastSize: 'medium',
    isRevealing: false,
    footwear: 'sneakers',
    age: 21,
    pose: 'standing'
};

let activeTab = 'face';
let aiModel = 'flux';
let isGenerating = false;

// --- HELPER FUNCTIONS ---

const getColorName = (hex, type) => {
    const palette = window.COLOR_PALETTES[type];
    if (!palette) return 'custom color';
    if (Array.isArray(palette)) {
        if (typeof palette[0] === 'string') return hex;
        const found = palette.find(c => c.hex === hex);
        return found ? found.name : 'custom';
    }
    return 'custom';
};

const generatePrompt = (char) => {
    const skin = getColorName(char.skinColor, 'skin');
    const hairC = getColorName(char.hairColor, 'hair');
    const eyeC = getColorName(char.eyeColor, 'eyes');
    const clothC = getColorName(char.clothesColor, 'clothes');

    const hairStyleFront = window.ASSETS.hairFront.find(h => h.id === char.hairFront)?.desc || 'bangs';
    const hairStyleBack = window.ASSETS.hairBack.find(h => h.id === char.hairBack)?.desc || 'hair';
    const eyeShape = window.ASSETS.eyes.find(e => e.id === char.eyes)?.desc || 'anime eyes';
    const acc = window.ASSETS.accessories.find(a => a.id === char.accessory);
    const accessoryDesc = acc && acc.id !== 'none' ? `, ${acc.desc}` : '';
    const expression = char.mouth === 'smirk' ? ', smirking confident expression' : '';

    const breastSize = window.BREAST_SIZES.find(b => b.id === char.breastSize)?.prompt || 'medium breasts';
    const currentPose = window.POSES.find(p => p.id === char.pose)?.prompt || 'standing pose';

    const clothesObj = window.ASSETS.clothes.find(c => c.id === char.clothes);
    const outfit = char.isRevealing ? (clothesObj?.descRev || clothesObj?.desc) : clothesObj?.desc;

    const footwearPrompt = window.FOOTWEAR.find(f => f.id === char.footwear)?.prompt || 'wearing shoes';

    let vibe = 'anime style, vibrant colors';
    if (char.hairBack === 'wolf') vibe += ', messy texture, wild, punk';
    if (char.isRevealing) vibe += ', sexy, attractive';

    const loadedPreset = window.PRESETS.find(p =>
        p.data.hairColor === char.hairColor &&
        p.data.clothes === char.clothes &&
        p.data.accessory === char.accessory
    );
    const characterName = loadedPreset ? `(${loadedPreset.name} from ${loadedPreset.series})` : '';

    const style = "anime art style, masterpiece, best quality, detailed shading, vibrant colors, professional illustration, high resolution";

    return `${style}, full body shot, entire character visible from head to toe, ${char.age} year old ${vibe} anime girl ${characterName} ${expression}, ${skin} skin, ${hairC} hair, ${hairStyleFront}, ${hairStyleBack}, ${eyeC} ${eyeShape}, ${currentPose}, wearing ${clothC} ${outfit}, ${breastSize}${accessoryDesc}, ${footwearPrompt}, detailed anatomy, shoes visible`;
};

// --- RENDER LOGIC ---

const renderCharacter = () => {
    const {
        skinColor, hairColor, eyeColor, clothesColor, bgColor,
        hairFront, hairBack, eyes, brows, mouth, clothes, accessory, breastSize, isRevealing, footwear, pose
    } = character;

    const currentHairBack = window.ASSETS.hairBack.find(h => h.id === hairBack);
    const currentHairFront = window.ASSETS.hairFront.find(h => h.id === hairFront);
    const currentEyes = window.ASSETS.eyes.find(e => e.id === eyes);
    const currentBrows = window.ASSETS.brows.find(b => b.id === brows);
    const currentMouth = window.ASSETS.mouths.find(m => m.id === mouth);
    const currentClothes = window.ASSETS.clothes.find(c => c.id === clothes);
    const currentAccessory = window.ASSETS.accessories.find(a => a.id === accessory);
    const currentBreastSize = window.BREAST_SIZES.find(b => b.id === breastSize);
    const currentFootwear = window.FOOTWEAR.find(f => f.id === footwear);
    const currentPoseTransform = window.POSES.find(p => p.id === pose)?.transform || '';

    const clothesPath = isRevealing && currentClothes.pathRev ? currentClothes.pathRev : currentClothes.path;

    const svgContent = `
    <rect width="200" height="450" fill="${bgColor}" rx="10" />

        <g transform="translate(0, 10) ${currentPoseTransform}">
            <path d="${currentHairBack?.path}" fill="${hairColor}" stroke="#000" stroke-width="2" />

            <path d="${window.ASSETS.body.legs}" fill="${skinColor}" stroke="#000" stroke-width="2" />

            <path d="${currentFootwear?.path}" fill="#333" stroke="#000" stroke-width="1" />

            <path d="${window.ASSETS.body.base}" fill="${skinColor}" stroke="#000" stroke-width="2" />

            <path d="${clothesPath}" fill="${clothesColor}" stroke="#000" stroke-width="2" />

            ${currentBreastSize?.path ? `
                <path 
                    d="${currentBreastSize.path}" 
                    fill="none" 
                    stroke="#000" 
                    stroke-width="1.5" 
                    opacity="0.4"
                />
            ` : ''}

            <path d="${window.ASSETS.body.face}" fill="${skinColor}" stroke="#000" stroke-width="2" />

            <g>
                <path d="${currentEyes?.pathL}" fill="#fff" stroke="${eyeColor}" stroke-width="1.5" />
                <path d="${currentEyes?.pathR}" fill="#fff" stroke="${eyeColor}" stroke-width="1.5" />
                ${currentEyes?.type !== 'line' ? `
                    <circle cx="82" cy="95" r="${currentEyes?.pupil + 2}" fill="${eyeColor}" />
                    <circle cx="118" cy="95" r="${currentEyes?.pupil + 2}" fill="${eyeColor}" />
                    <circle cx="82" cy="95" r="1.5" fill="white" />
                    <circle cx="118" cy="95" r="1.5" fill="white" />
                ` : ''}
            </g>

            <path d="${currentBrows?.pathL}" fill="none" stroke="${hairColor}" stroke-width="2" />
            <path d="${currentBrows?.pathR}" fill="none" stroke="${hairColor}" stroke-width="2" />

            <path d="${currentMouth?.path}" fill="${currentMouth?.fill ? '#FFC0CB' : 'none'}" stroke="#333" stroke-width="2" stroke-linecap="round" />

            <path d="${currentHairFront?.path}" fill="${hairColor}" stroke="#000" stroke-width="2" opacity="0.95" />

            ${currentAccessory ? currentAccessory.render(character.clothesColor) : ''}
        </g>
`;

    const svgContainer = document.getElementById('character-preview');
    if (svgContainer) {
        svgContainer.innerHTML = svgContent;
    }

    const promptDisplay = document.getElementById('prompt-display');
    if (promptDisplay) {
        promptDisplay.textContent = generatePrompt(character);
    }
};

// --- ACTIONS ---

const loadPreset = (presetId) => {
    const preset = window.PRESETS.find(p => p.id === presetId);
    if (preset) {
        character = { ...character, ...preset.data };
        renderCharacter();
        renderControls(activeTab);
    }
};

const randomize = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randColor = (arr) => arr[Math.floor(Math.random() * arr.length)].hex;

    character = {
        skinColor: randColor(window.COLOR_PALETTES.skin),
        hairColor: randColor(window.COLOR_PALETTES.hair),
        eyeColor: randColor(window.COLOR_PALETTES.eyes),
        clothesColor: randColor(window.COLOR_PALETTES.clothes),
        bgColor: rand(window.COLOR_PALETTES.bg),
        hairFront: rand(window.ASSETS.hairFront).id,
        hairBack: rand(window.ASSETS.hairBack).id,
        eyes: rand(window.ASSETS.eyes).id,
        brows: rand(window.ASSETS.brows).id,
        mouth: rand(window.ASSETS.mouths).id,
        clothes: rand(window.ASSETS.clothes).id,
        accessory: rand(window.ASSETS.accessories).id,
        breastSize: rand(window.BREAST_SIZES).id,
        footwear: rand(window.FOOTWEAR).id,
        isRevealing: Math.random() > 0.7,
        age: Math.floor(Math.random() * (35 - 18 + 1)) + 18,
        pose: rand(window.POSES).id
    };
    renderCharacter();
    renderControls(activeTab);
};

const generateAIImage = () => {
    if (isGenerating) return;
    isGenerating = true;

    const btn = document.getElementById('generate-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    btn.disabled = true;
    btn.classList.add('opacity-50', 'cursor-not-allowed');

    const prompt = generatePrompt(character);
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=1024&seed=${seed}&nologo=true&model=${aiModel}`;

    const img = new Image();
    img.onload = () => {
        const previewContainer = document.getElementById('preview-container');
        previewContainer.innerHTML = `
            <div class="relative group w-full max-w-[500px] flex flex-col items-center">
                <img src="${imageUrl}" alt="Generated Character" class="w-auto max-h-[600px] border-4 border-pink-400/50 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-in fade-in duration-700 mb-4 rounded-lg">
                <button onclick="downloadImage('${imageUrl}', 'character.jpg')" class="bg-pink-500 text-white px-6 py-2 font-bold rounded-lg flex items-center gap-2 hover:bg-pink-400 transition-all shadow-lg">
                    <i class="fas fa-download"></i> Download Image
                </button>
                <button onclick="resetPreview()" class="mt-2 text-xs text-slate-500 hover:text-pink-400 underline">Back to Editor</button>
            </div>
        `;
        isGenerating = false;
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    };
    img.onerror = () => {
        alert("Failed to connect to image server. Please try again.");
        isGenerating = false;
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    };
    img.src = imageUrl;
};

const resetPreview = () => {
    const previewContainer = document.getElementById('preview-container');
    previewContainer.innerHTML = `
        <div class="w-full max-w-[300px] aspect-[9/20] relative transform transition-all hover:scale-[1.01] duration-300">
            <svg id="character-preview" viewBox="0 0 200 450" class="w-full h-full shadow-2xl rounded-lg bg-white border-2 border-pink-300" xmlns="http://www.w3.org/2000/svg"></svg>
        </div>
    `;
    renderCharacter();
};

const downloadImage = (url, filename) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadSvg = () => {
    const svgElement = document.getElementById('character-preview');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 500;
        canvas.height = 1125;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 500, 1125);
        const pngUrl = canvas.toDataURL("image/png");
        downloadImage(pngUrl, "character_draft.png");
    };
    img.src = url;
};

// --- UI UPDATES & RENDERING ---

const switchTab = (tabId) => {
    activeTab = tabId;
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`tab-${tabId}`).classList.remove('hidden');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('text-pink-400', 'border-pink-500', 'bg-slate-900');
            btn.classList.remove('text-slate-600', 'border-transparent');
        } else {
            btn.classList.remove('text-pink-400', 'border-pink-500', 'bg-slate-900');
            btn.classList.add('text-slate-600', 'border-transparent');
        }
    });

    renderControls(tabId);
};

const renderControls = (tabId) => {
    const container = document.getElementById(`tab-${tabId}`);
    if (!container) return;

    let html = '';

    if (tabId === 'face') {
        html = `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-id-card"></i> <span>Identity</span>
                </div>
                <div class="bg-slate-900 p-4 border border-slate-800 rounded-lg">
                    <div class="flex justify-between mb-2 text-xs font-mono text-slate-400">
                        <span>AGE</span>
                        <span id="age-display" class="text-pink-400">${character.age}</span>
                    </div>
                    <input type="range" id="age-input" min="18" max="99" value="${character.age}" class="w-full accent-pink-500 h-1 bg-slate-800 appearance-none cursor-pointer rounded-lg">
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-eye"></i> <span>Eyes</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${window.ASSETS.eyes.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.eyes === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="eyes" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-smile"></i> <span>Expression</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    ${window.ASSETS.mouths.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.mouth === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="mouth" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-angry"></i> <span>Brows</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    ${window.ASSETS.brows.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.brows === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="brows" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (tabId === 'hair') {
        html = `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-cut"></i> <span>Front Style</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${window.ASSETS.hairFront.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.hairFront === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="hairFront" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-cut"></i> <span>Back Style</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${window.ASSETS.hairBack.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.hairBack === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="hairBack" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (tabId === 'outfit') {
        html = `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-tshirt"></i> <span>Attire</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${window.ASSETS.clothes.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.clothes === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="clothes" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-fire"></i> <span>Mode</span>
                </div>
                <button id="revealing-btn" class="w-full py-3 border font-mono text-xs uppercase transition-all rounded-lg flex items-center justify-center gap-2 ${character.isRevealing ? 'border-pink-500 bg-pink-900/20 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-slate-700 bg-black text-slate-500 hover:border-slate-500'}">
                    ${character.isRevealing ? '<i class="fas fa-fire"></i> REVEALING' : '<i class="fas fa-check"></i> STANDARD'}
                </button>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-child"></i> <span>Pose</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${window.POSES.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.pose === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="pose" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-shoe-prints"></i> <span>Footwear</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    ${window.FOOTWEAR.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.footwear === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="footwear" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-circle"></i> <span>Physique</span>
                </div>
                <div class="grid grid-cols-2 gap-2">
                    ${window.BREAST_SIZES.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.breastSize === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="breastSize" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-glasses"></i> <span>Accessories</span>
                </div>
                <div class="grid grid-cols-3 gap-2">
                    ${window.ASSETS.accessories.map(opt => `
                        <button class="p-2 text-[10px] uppercase font-mono tracking-tight border transition-all rounded ${character.accessory === opt.id ? 'bg-pink-950/50 border-pink-500 text-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'}" data-category="accessory" data-id="${opt.id}">${opt.name}</button>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (tabId === 'colors') {
        const renderColorPicker = (label, category, colors) => {
            return `
                <div class="mb-6">
                    <label class="block text-xs text-slate-500 mb-2 font-mono uppercase">${label}</label>
                    <div class="flex flex-wrap gap-2">
                        ${colors.map(c => `
                            <button 
                                class="w-8 h-8 rounded-sm border transition-all hover:scale-110 ${character[category] === (c.hex || c) ? 'border-pink-400 shadow-[0_0_10px_rgba(236,72,153,0.5)] ring-2 ring-pink-400' : 'border-slate-700'}" 
                                style="background-color: ${c.hex || c}" 
                                title="${c.name || c}"
                                data-color-category="${category}"
                                data-hex="${c.hex || c}"
                            ></button>
                        `).join('')}
                    </div>
                </div>
            `;
        };
        html = `
            ${renderColorPicker('Skin', 'skinColor', window.COLOR_PALETTES.skin)}
            ${renderColorPicker('Hair', 'hairColor', window.COLOR_PALETTES.hair)}
            ${renderColorPicker('Eyes', 'eyeColor', window.COLOR_PALETTES.eyes)}
            ${renderColorPicker('Clothes', 'clothesColor', window.COLOR_PALETTES.clothes)}
            ${renderColorPicker('Background', 'bgColor', window.COLOR_PALETTES.bg)}
        `;
    } else if (tabId === 'presets') {
        html = `
            <div class="mb-6">
                <div class="flex items-center gap-2 mb-3 text-pink-400 font-bold uppercase tracking-wider text-sm border-b border-pink-900/50 pb-1">
                    <i class="fas fa-users"></i> <span>Famous Characters</span>
                </div>
                <div class="space-y-3">
                    ${window.PRESETS.map(preset => `
                        <button onclick="window.loadPreset('${preset.id}')" class="w-full text-left p-4 bg-slate-900 border border-slate-800 hover:border-pink-500/50 hover:bg-slate-800 transition-all rounded-lg flex justify-between items-center group">
                            <div>
                                <span class="font-bold text-slate-300 group-hover:text-pink-400 block text-sm">${preset.name}</span>
                                <span class="text-[10px] text-slate-600 font-mono uppercase">${preset.series}</span>
                            </div>
                            <span class="text-[10px] text-pink-900 font-mono bg-pink-900/20 px-2 py-1 border border-pink-900/50 group-hover:text-pink-400 group-hover:border-pink-400 rounded">LOAD</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (tabId === 'ai') {
        html = `
            <div class="bg-slate-900/50 p-6 border border-pink-500/30 relative overflow-hidden rounded-lg">
                <div class="absolute top-0 right-0 p-2 opacity-20 text-pink-500"><i class="fas fa-camera fa-3x"></i></div>
                <h3 class="text-lg font-black flex items-center gap-2 mb-2 text-pink-400 uppercase"><i class="fas fa-camera"></i> AI Generator</h3>
                <p class="text-slate-400 text-xs font-mono mb-6 leading-relaxed">
                    Transform your character into a high-quality AI-generated image using Pollinations.ai
                </p>
                
                <div class="flex items-center gap-2 text-[10px] font-mono bg-black p-2 border border-slate-800 mb-4 text-slate-500 uppercase rounded">
                    <i class="fas fa-wifi"></i>
                    <span>Connection: Public [Flux/Anime]</span>
                </div>

                <div class="mb-6">
                   <label class="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-2 block">Select Model</label>
                   <div class="grid grid-cols-2 gap-2">
                     ${window.AI_MODELS.map(m => `
                       <button class="model-btn p-3 text-xs font-bold flex items-center justify-center gap-2 transition-all border rounded-lg ${aiModel === m.id ? 'bg-pink-900/40 border-pink-500 text-white shadow-[0_0_10px_rgba(236,72,153,0.3)]' : 'bg-black border-slate-800 text-slate-500 hover:border-slate-600'}" data-model="${m.id}">
                         ${m.name}
                       </button>
                    `).join('')}
                   </div>
                </div>

                <button id="generate-btn" onclick="window.generateAIImage()" class="w-full py-4 font-black uppercase tracking-widest text-white bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(236,72,153,0.4)] rounded-lg">
                    <i class="fas fa-sparkles"></i> Execute
                </button>
            </div>

            <div class="p-4 bg-black border border-slate-800 rounded-lg mt-6">
                <h4 class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Current Prompt</h4>
                <p id="prompt-display" class="text-[10px] text-slate-600 font-mono bg-slate-950 p-3 border border-slate-900 break-words opacity-70 rounded">
                    ${generatePrompt(character)}
                </p>
            </div>
        `;
    }

    container.innerHTML = html;
    attachControlListeners(tabId);
};

const attachControlListeners = (tabId) => {
    if (tabId === 'face') {
        const ageInput = document.getElementById('age-input');
        if (ageInput) {
            ageInput.addEventListener('input', (e) => {
                character.age = parseInt(e.target.value);
                document.getElementById('age-display').textContent = character.age;
                renderCharacter();
            });
        }
    }

    if (tabId === 'outfit') {
        const revBtn = document.getElementById('revealing-btn');
        if (revBtn) {
            revBtn.addEventListener('click', () => {
                character.isRevealing = !character.isRevealing;
                renderCharacter();
                renderControls(activeTab);
            });
        }
    }

    if (tabId === 'ai') {
        document.querySelectorAll('.model-btn').forEach(btn => {
            btn.addEventListener('click', () => setAiModel(btn.dataset.model));
        });
    }

    document.querySelectorAll('[data-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            character[category] = btn.dataset.id;
            renderCharacter();
            renderControls(activeTab);
        });
    });

    document.querySelectorAll('[data-color-category]').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.colorCategory;
            character[category] = btn.dataset.hex;
            renderCharacter();
            renderControls(activeTab);
        });
    });
};

const setAiModel = (modelId) => {
    aiModel = modelId;
    renderControls('ai');
};

// --- INITIALIZATION ---

const init = () => {
    renderCharacter();
    switchTab('face');

    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
};

// Expose functions to global scope for HTML onclicks
window.randomize = randomize;
window.downloadSvg = downloadSvg;
window.generateAIImage = generateAIImage;
window.downloadImage = downloadImage;
window.loadPreset = loadPreset;
window.resetPreview = resetPreview;

// Start
document.addEventListener('DOMContentLoaded', init);
