// --- PRESETS DATA ---
const PRESETS = [
    {
        id: 'ivy',
        name: 'Ivy Valentine',
        series: 'SoulCalibur',
        data: {
            skinColor: '#FFF0E6',
            hairColor: '#F0F0F0',
            eyeColor: '#3498DB',
            clothesColor: '#663399', // Deep Purple
            hairFront: 'short',
            hairBack: 'short',
            eyes: 'sharp',
            clothes: 'leather',
            accessory: 'none',
            breastSize: 'huge',
            isRevealing: true,
            footwear: 'heels',
            age: 32,
            mouth: 'smirk',
            brows: 'angry',
            pose: 'standing'
        }
    },
    {
        id: 'kitana',
        name: 'Kitana',
        series: 'Mortal Kombat',
        data: {
            skinColor: '#D2A38E',
            hairColor: '#1A1A1A',
            eyeColor: '#2D2D2D',
            clothesColor: '#0047AB', // Cobalt Blue
            hairFront: 'parted',
            hairBack: 'ponytail',
            eyes: 'sharp',
            clothes: 'bikini',
            accessory: 'mask',
            breastSize: 'large',
            isRevealing: true,
            footwear: 'boots',
            age: 99,
            mouth: 'neutral',
            brows: 'angry',
            pose: 'hands_on_hips'
        }
    },
    {
        id: 'faye',
        name: 'Faye Valentine',
        series: 'Cowboy Bebop',
        data: {
            skinColor: '#FFE4D6',
            hairColor: '#8E44AD', // Deep Purple
            eyeColor: '#27AE60',
            clothesColor: '#F1C40F', // Bright Yellow
            hairFront: 'parted',
            hairBack: 'short',
            eyes: 'wide',
            clothes: 'crop_top',
            accessory: 'none',
            breastSize: 'medium',
            isRevealing: true,
            footwear: 'boots',
            age: 23,
            mouth: 'smirk',
            brows: 'neutral',
            pose: 'standing'
        }
    },
    {
        id: 'asuka',
        name: 'Asuka Langley',
        series: 'Neon Genesis Evangelion',
        data: {
            skinColor: '#FFE4D6',
            hairColor: '#D35400', // Burnt Orange
            eyeColor: '#2980B9',
            clothesColor: '#C0392B', // Deep Red
            hairFront: 'straight',
            hairBack: 'twintails',
            eyes: 'sharp',
            clothes: 'leather',
            accessory: 'none',
            breastSize: 'flat',
            isRevealing: false,
            footwear: 'sneakers',
            age: 18,
            mouth: 'angry',
            brows: 'angry',
            pose: 'hands_on_hips'
        }
    },
    {
        id: '2b',
        name: '2B',
        series: 'Nier: Automata',
        data: {
            skinColor: '#FFF5F0',
            hairColor: '#ECF0F1',
            eyeColor: '#34495E',
            clothesColor: '#181818', // Black
            hairFront: 'hime',
            hairBack: 'short',
            eyes: 'neutral',
            clothes: 'dress',
            accessory: 'blindfold',
            breastSize: 'large',
            isRevealing: false,
            footwear: 'boots',
            age: 20,
            mouth: 'neutral',
            brows: 'neutral',
            pose: 'standing'
        }
    },
    {
        id: 'yumi',
        name: 'Yumi',
        series: 'Senran Kagura',
        data: {
            skinColor: '#FFF0E6',
            hairColor: '#BDC3C7', // Silver
            eyeColor: '#3498DB',
            clothesColor: '#F0F8FF', // White/Blueish
            hairFront: 'hime',
            hairBack: 'ponytail',
            eyes: 'cute',
            clothes: 'dress',
            accessory: 'none',
            breastSize: 'huge',
            isRevealing: false,
            footwear: 'heels',
            age: 18,
            mouth: 'neutral',
            brows: 'neutral',
            pose: 'standing'
        }
    },
    {
        id: 'rapi',
        name: 'Rapi',
        series: 'NIKKE',
        data: {
            skinColor: '#FFE4D6',
            hairColor: '#5D4037',
            eyeColor: '#C0392B',
            clothesColor: '#E74C3C',
            hairFront: 'straight',
            hairBack: 'long',
            eyes: 'neutral',
            clothes: 'office',
            accessory: 'none',
            breastSize: 'large',
            isRevealing: true,
            footwear: 'boots',
            age: 20,
            mouth: 'neutral',
            brows: 'neutral',
            pose: 'hands_on_hips'
        }
    }
];

// --- SVG ASSETS & DATA ---

const COLOR_PALETTES = {
    skin: [
        { hex: '#FFF0E6', name: 'pale' },
        { hex: '#FFE4D6', name: 'fair' },
        { hex: '#FFDAB9', name: 'light' },
        { hex: '#E8BEAC', name: 'tan' },
        { hex: '#D2A38E', name: 'medium dark' },
        { hex: '#8D5524', name: 'dark' }
    ],
    hair: [
        { hex: '#2D2D2D', name: 'black' },
        { hex: '#4A3B2A', name: 'brown' },
        { hex: '#E6C8A1', name: 'blonde' },
        { hex: '#B5525C', name: 'red' },
        { hex: '#3B7080', name: 'blue' },
        { hex: '#FF99CC', name: 'pink' },
        { hex: '#9B59B6', name: 'purple' },
        { hex: '#FFFFFF', name: 'white' },
        { hex: '#E74C3C', name: 'bright red' },
        { hex: '#F1C40F', name: 'gold' },
        { hex: '#808080', name: 'silver' }
    ],
    eyes: [
        { hex: '#3498DB', name: 'blue' },
        { hex: '#2ECC71', name: 'green' },
        { hex: '#9B59B6', name: 'purple' },
        { hex: '#F1C40F', name: 'gold' },
        { hex: '#E74C3C', name: 'red' },
        { hex: '#34495E', name: 'grey' },
        { hex: '#E91E63', name: 'pink' },
        { hex: '#1ABC9C', name: 'teal' },
        { hex: '#000000', name: 'black' }
    ],
    clothes: [
        { hex: '#2C3E50', name: 'black' },
        { hex: '#34495E', name: 'dark blue' },
        { hex: '#E74C3C', name: 'red' },
        { hex: '#3498DB', name: 'blue' },
        { hex: '#9B59B6', name: 'purple' },
        { hex: '#2ECC71', name: 'green' },
        { hex: '#F39C12', name: 'orange' },
        { hex: '#ECF0F1', name: 'white' },
        { hex: '#FF69B4', name: 'hot pink' }
    ],
    bg: ['#FFDEE9', '#B5FFFC', '#D4FC79', '#E0C3FC', '#FFFFFF', '#2C3E50', '#1a1a1a']
};

const BREAST_SIZES = [
    { id: 'flat', name: 'Flat', prompt: 'flat chest', path: null },
    { id: 'medium', name: 'Medium', prompt: 'medium breasts', path: "M85,215 Q100,222 115,215" },
    { id: 'large', name: 'Large', prompt: "large breasts", path: "M80,215 Q100,235 120,215" },
    { id: 'huge', name: 'Huge', prompt: "huge breasts, voluptuous", path: "M75,215 Q100,250 125,215" }
];

const FOOTWEAR = [
    { id: 'sneakers', name: 'Sneakers', prompt: 'wearing sneakers', path: "M65,415 L65,425 Q65,435 75,435 L85,435 L85,415 Z M115,415 L115,435 L125,435 Q135,435 135,425 L135,415 Z" },
    { id: 'boots', name: 'Boots', prompt: 'wearing knee-high boots', path: "M70,350 L90,350 L90,435 L70,435 Z M110,350 L130,350 L130,435 L110,435 Z" },
    { id: 'heels', name: 'High Heels', prompt: 'wearing high heels, stiletto heels', path: "M70,420 L65,440 L85,440 L85,420 Z M115,420 L115,440 L135,440 L130,420 Z" }
];

const POSES = [
    {
        id: 'standing',
        name: 'Standing',
        prompt: 'standing pose, hands at sides',
        transform: ''
    },
    {
        id: 'bending_over',
        name: 'Bending Over',
        prompt: 'bent over deeply at waist, hips raised high, back to camera, looking back at viewer over shoulder, provocative pose, jack-o challenge style',
        transform: 'rotate(15, 100, 300) translate(0, 30)'
    },
    {
        id: 'kneeling',
        name: 'Kneeling',
        prompt: 'kneeling down on floor, looking up at viewer',
        transform: 'translate(0, 60)'
    },
    {
        id: 'hands_on_hips',
        name: 'Hands on Hips',
        prompt: 'standing pose, hands on hips, confident stance',
        transform: ''
    },
    {
        id: 'sitting_crossed',
        name: 'Sitting',
        prompt: 'sitting cross-legged on the floor, elegant pose',
        transform: 'translate(0, 80)'
    }
];

const AI_MODELS = [
    { id: 'flux', name: 'Flux (Best Accuracy)', icon: 'fa-wand-magic-sparkles' },
    { id: 'turbo', name: 'Turbo (Fast)', icon: 'fa-fire' },
    { id: 'pixel', name: 'Pixel Art', icon: 'fa-microchip' },
    { id: 'midjourney', name: 'Midjourney Style', icon: 'fa-palette' },
];

const ASSETS = {
    body: {
        base: "M85,160 Q75,180 70,220 L70,300 L130,300 L130,220 Q125,180 115,160",
        face: "M60,90 Q60,160 100,175 Q140,160 140,90 Q140,30 100,30 Q60,30 60,90",
        legs: "M75,300 L75,410 Q75,430 65,435 L85,435 Q90,420 90,360 L90,300 M110,300 L110,360 Q110,420 115,435 L135,435 Q125,430 125,410 L125,300"
    },
    eyes: [
        { id: 'cute', name: 'Cute', desc: 'large, cute anime eyes', pathL: "M75,95 Q82,80 90,95 Q82,110 75,95", pathR: "M110,95 Q118,80 125,95 Q118,110 110,95", pupil: 3.5 },
        { id: 'sleepy', name: 'Tareme', desc: 'droopy, sleepy tareme eyes', pathL: "M75,98 Q82,92 90,98", pathR: "M110,98 Q118,92 125,98", pupil: 2.5, type: 'line' },
        { id: 'sharp', name: 'Tsurime', desc: 'sharp, angular tsurime eyes', pathL: "M73,92 Q82,85 92,90 L90,96 Q80,92 73,92", pathR: "M108,90 Q118,85 127,92 L125,96 Q118,92 108,90", pupil: 3 },
        { id: 'wide', name: 'Wide', desc: 'wide, surprised eyes', pathL: "M72,90 Q82,75 92,90 Q82,105 72,90", pathR: "M108,90 Q118,75 128,90 Q118,105 108,90", pupil: 4 }
    ],
    brows: [
        { id: 'neutral', name: 'Neutral', pathL: "M75,80 Q82,78 90,80", pathR: "M110,80 Q118,78 125,80" },
        { id: 'sad', name: 'Sad', pathL: "M75,78 Q82,82 90,80", pathR: "M110,80 Q118,82 125,78" },
        { id: 'angry', name: 'Angry', pathL: "M75,78 L90,85", pathR: "M110,85 L125,78" },
    ],
    mouths: [
        { id: 'smile', name: 'Smile', path: "M90,125 Q100,135 110,125" },
        { id: 'smirk', name: 'Smirk', path: "M92,132 Q100,138 108,128" },
        { id: 'happy', name: 'Happy', path: "M90,125 Q100,140 110,125 Z", fill: true },
        { id: 'neutral', name: 'Neutral', path: "M95,130 L105,130" },
        { id: 'cat', name: 'Cat', path: "M92,128 Q97,132 100,128 Q103,132 108,128" },
        { id: 'surprised', name: 'Surprised', path: "M95,125 Q100,125 105,125 Q105,135 100,135 Q95,135 95,125", fill: true }
    ],
    hairFront: [
        { id: 'hime', name: 'Hime Cut', desc: 'hime cut hairstyle with straight bangs and sidelocks', path: "M60,80 C60,80 60,140 60,140 L75,140 L75,80 L85,80 L85,110 L115,110 L115,80 L125,80 L125,140 L140,140 C140,140 140,80 140,80 C140,20 60,20 60,80" },
        { id: 'parted', name: 'Parted', desc: 'middle parted bangs', path: "M100,30 C60,30 55,100 55,130 C65,120 90,40 100,40 C110,40 135,120 145,130 C145,100 140,30 100,30" },
        { id: 'messy', name: 'Messy', desc: 'messy, textured bangs', path: "M60,80 Q50,120 55,140 L70,100 L80,120 L90,90 L100,110 L110,90 L120,120 L130,100 L145,140 Q150,120 140,80 Q140,20 60,20" },
        { id: 'straight', name: 'Straight', desc: 'straight bangs across forehead', path: "M60,60 Q60,120 60,150 L140,150 Q140,120 140,60 Q140,20 60,20" },
        { id: 'wolf', name: 'Wolf Cut', desc: 'wild wolf cut with shaggy, layered bangs', path: "M60,60 Q60,100 50,130 L70,110 L80,140 L90,90 L100,130 L110,90 L120,140 L130,110 L150,130 Q140,100 140,60 Q140,20 60,20" }
    ],
    hairBack: [
        { id: 'short', name: 'Short', desc: 'short bob haircut', path: "M50,80 Q45,130 60,140 L140,140 Q155,130 150,80 Q150,10 50,10" },
        { id: 'long', name: 'Long', desc: 'long straight flowing hair', path: "M50,80 Q40,180 50,220 L150,220 Q160,180 150,80 Q150,10 50,10 M50,220 L50,380 L150,380 L150,220" },
        { id: 'twintails', name: 'Twintails', desc: 'long twin tails hairstyle', path: "M50,80 Q20,120 30,200 Q40,150 60,120 M140,120 Q160,150 170,200 Q180,120 150,80 M50,80 Q50,10 150,10 Q150,80 150,80 M30,200 L30,380 M170,200 L170,380" },
        { id: 'ponytail', name: 'Ponytail', desc: 'high ponytail hairstyle', path: "M50,80 Q50,10 150,10 Q150,80 150,80 M80,40 Q60,150 80,200 Q100,220 120,200 Q140,150 120,40 M80,200 L90,420 L110,420 L120,200" },
        { id: 'wolf', name: 'Wolf Cut', desc: 'layered shaggy wolf cut back', path: "M50,80 Q40,140 35,170 L50,160 L60,190 L80,160 L120,160 L140,190 L150,160 L165,170 Q160,140 150,80 Q150,10 50,10 M60,190 L55,350 M140,190 L145,350" }
    ],
    clothes: [
        {
            id: 'school',
            name: 'School',
            desc: 'Japanese school uniform sailor fuku',
            descRev: 'cropped school uniform, midriff exposed, micro skirt',
            path: "M70,220 L130,220 L130,300 L140,380 L60,380 L70,300 Z M70,220 Q100,240 130,220 L120,180 Q100,200 80,180 Z M90,220 L100,250 L110,220",
            pathRev: "M70,220 L130,220 L130,255 L70,255 Z M65,300 L135,300 L140,330 L60,330 Z M70,220 Q100,240 130,220 L120,180 Q100,200 80,180 Z M90,220 L100,255 L110,220",
            collar: true
        },
        {
            id: 'casual',
            name: 'Hoodie',
            desc: 'oversized casual hoodie with shorts',
            descRev: 'cropped hoodie, midriff exposed, tiny shorts',
            path: "M65,190 Q100,210 135,190 L135,330 L65,330 Z M90,190 L90,300",
            pathRev: "M65,190 Q100,210 135,190 L135,240 Q100,250 65,240 Z M90,190 L90,240 M65,300 L135,300 L135,330 L65,330 Z"
        },
        {
            id: 'dress',
            name: 'Dress',
            desc: 'elegant long dress',
            descRev: 'strapless cocktail dress with high slit',
            path: "M70,190 Q100,210 130,190 L140,430 L60,430 L70,190 Z M70,190 Q60,200 55,220 L65,230 Q70,210 75,200",
            pathRev: "M75,205 Q100,215 125,205 L135,420 L65,420 L75,205 Z M95,240 L115,430 L85,430 Z"
        },
        {
            id: 'leather',
            name: 'Jacket',
            desc: 'cool streetwear leather jacket with pants',
            descRev: 'open leather jacket showing bikini top, shorts',
            path: "M65,190 Q100,185 135,190 L140,300 L60,300 Z M65,190 L80,215 L90,195 M135,190 L120,215 L110,195 M70,300 L130,300 L125,435 L75,435 Z",
            pathRev: "M60,190 L75,300 L60,300 Z M140,190 L125,300 L140,300 Z M65,190 L80,215 L90,195 M135,190 L120,215 L110,195 M85,215 Q100,230 115,215 M70,320 L130,320 L125,350 L75,350 Z"
        },
        {
            id: 'maid',
            name: 'Maid',
            desc: 'classic victorian maid outfit with apron',
            descRev: 'french maid outfit, short skirt, cleavage',
            path: "M70,200 L130,200 L140,410 L60,410 Z M60,410 L140,410 L145,430 L55,430 Z M80,200 L120,200 L115,320 L85,320 Z",
            pathRev: "M75,210 L125,210 L135,320 L65,320 Z M65,320 Q100,340 135,320 L140,350 L60,350 Z M80,210 L80,250 Q100,260 120,250 L120,210"
        },
        {
            id: 'office',
            name: 'Office',
            desc: 'professional office lady suit, pencil skirt, blazer',
            descRev: 'unbuttoned office blouse, mini pencil skirt, stockings',
            path: "M65,190 L135,190 L135,300 L65,300 Z M90,190 L100,230 L110,190 M75,300 L125,300 L120,390 L80,390 Z",
            pathRev: "M70,190 L130,190 L130,270 L70,270 Z M100,190 L100,270 M75,300 L125,300 L125,330 L75,330 Z M80,390 L120,390 L120,435 L80,435 Z"
        },
        {
            id: 'crop_top',
            name: 'Crop Top',
            desc: 'tight crop top, midriff exposed, jeans',
            descRev: 'micro crop top, underboob, shorts',
            path: "M70,180 L130,180 L135,230 Q100,240 65,230 Z M70,300 L130,300 L125,435 L75,435 Z",
            pathRev: "M75,180 L125,180 L125,215 Q100,225 75,215 Z M70,300 L130,300 L130,330 L70,330 Z"
        },
        {
            id: 'bikini',
            name: 'Bikini',
            desc: 'revealing bikini swimwear',
            descRev: 'micro string bikini',
            path: "M70,210 Q85,240 98,210 L98,200 Q85,180 70,200 Z M102,210 Q115,240 130,210 L130,200 Q115,180 102,200 Z M70,300 Q100,320 130,300 L130,320 L70,320 Z",
            pathRev: "M75,210 L90,210 L82,190 Z M110,210 L125,210 L118,190 Z M90,300 L110,300 L100,320 Z"
        }
    ],
    accessories: [
        { id: 'none', name: 'None', desc: '', render: () => '' },
        {
            id: 'glasses', name: 'Glasses', desc: 'wearing red framed glasses', render: (color) => `
        <g stroke="${color}" stroke-width="2" fill="none">
          <circle cx="82" cy="95" r="12" fill="rgba(255,255,255,0.2)" />
          <circle cx="118" cy="95" r="12" fill="rgba(255,255,255,0.2)" />
          <line x1="94" y1="95" x2="106" y2="95" />
        </g>
      `},
        {
            id: 'cat_ears', name: 'Cat Ears', desc: 'wearing cute cat ears', render: (color) => `
        <g fill="${color}">
          <path d="M60,50 L40,20 L80,40 Z" />
          <path d="M140,50 L160,20 L120,40 Z" />
          <path d="M60,50 L45,30 L70,42 Z" fill="#FFB6C1" />
          <path d="M140,50 L155,30 L130,42 Z" fill="#FFB6C1" />
        </g>
      `},
        {
            id: 'blindfold', name: 'Blindfold', desc: 'wearing a black blindfold covering eyes', render: (color) => `
        <path d="M60,90 Q100,85 140,90 L140,105 Q100,100 60,105 Z" fill="#111" />
      `},
        {
            id: 'mask', name: 'Mask', desc: 'wearing a face mask', render: (color) => `
        <path d="M70,120 L130,120 L125,145 Q100,155 75,145 Z" fill="${color}" stroke="#333" />
      `},
        {
            id: 'blush', name: 'Blush', desc: 'blushing cheeks', render: () => `
        <g fill="#FFB6C1" opacity="0.6">
          <ellipse cx="70" cy="125" rx="8" ry="4" />
          <ellipse cx="130" cy="125" rx="8" ry="4" />
          <line x1="65" y1="122" x2="75" y2="128" stroke="#FF69B4" stroke-width="1" />
          <line x1="65" y1="128" x2="75" y2="122" stroke="#FF69B4" stroke-width="1" />
          <line x1="125" y1="122" x2="135" y2="128" stroke="#FF69B4" stroke-width="1" />
          <line x1="125" y1="128" x2="135" y2="122" stroke="#FF69B4" stroke-width="1" />
        </g>
      `},
        {
            id: 'choker', name: 'Choker', desc: 'wearing a black punk choker', render: () => `
        <path d="M87,165 Q100,170 113,165" stroke="#111" stroke-width="3" fill="none" />
      `}
    ]
};

// --- STATE ---
let character = {
    skinColor: COLOR_PALETTES.skin[1].hex,
    hairColor: COLOR_PALETTES.hair[2].hex,
    eyeColor: COLOR_PALETTES.eyes[0].hex,
    clothesColor: COLOR_PALETTES.clothes[0].hex,
    bgColor: COLOR_PALETTES.bg[0],
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
let isGenerating = false;
let generatedImage = null;
let aiError = null;
let aiModel = 'flux';

// --- HELPER FUNCTIONS ---

const getColorName = (hex, type) => {
    const palette = COLOR_PALETTES[type];
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

    const hairStyleFront = ASSETS.hairFront.find(h => h.id === char.hairFront)?.desc || 'bangs';
    const hairStyleBack = ASSETS.hairBack.find(h => h.id === char.hairBack)?.desc || 'hair';
    const eyeShape = ASSETS.eyes.find(e => e.id === char.eyes)?.desc || 'anime eyes';
    const acc = ASSETS.accessories.find(a => a.id === char.accessory);
    const accessoryDesc = acc && acc.id !== 'none' ? `, ${acc.desc}` : '';
    const expression = char.mouth === 'smirk' ? ', smirking confident expression' : '';

    const breastSize = BREAST_SIZES.find(b => b.id === char.breastSize)?.prompt || 'medium breasts';
    const currentPose = POSES.find(p => p.id === char.pose)?.prompt || 'standing pose';

    const clothesObj = ASSETS.clothes.find(c => c.id === char.clothes);
    const outfit = char.isRevealing ? (clothesObj?.descRev || clothesObj?.desc) : clothesObj?.desc;

    const footwearPrompt = FOOTWEAR.find(f => f.id === char.footwear)?.prompt || 'wearing shoes';

    let vibe = 'cute';
    if (char.clothes === 'leather') vibe = 'cool, edgy, streetwear aesthetic, leather texture';
    if (char.clothes === 'bikini') vibe = 'revealing, summer, swimsuit model';
    if (char.clothes === 'crop_top') vibe = 'trendy, casual, streetwear';
    if (char.clothes === 'maid') vibe = 'maid cafe, victorian';
    if (char.clothes === 'office') vibe = 'professional, office lady';
    if (char.hairBack === 'wolf') vibe += ', messy texture, wild';
    if (char.isRevealing) vibe += ', sexy, revealing style';

    // Inject character name if loaded from preset for better accuracy
    const loadedPreset = PRESETS.find(p =>
        p.data.hairColor === char.hairColor &&
        p.data.clothes === char.clothes &&
        p.data.accessory === char.accessory
    );
    const characterName = loadedPreset ? `(cosplaying as ${loadedPreset.name} from ${loadedPreset.series})` : '';

    // AESTHETIC STYLE KEYWORDS
    const style = "aesthetic anime illustration, masterpiece, best quality, vibrant cel-shaded style, clean lines, soft cinematic lighting, lush detailed fantasy background, stylized environment, vibrant colors";

    return `${style}, full body shot, wide angle shot, entire character visible from head to toe, ${char.age} year old ${vibe} anime girl ${characterName} ${expression}, ${skin} skin, ${hairC} hair, ${hairStyleFront}, ${hairStyleBack}, ${eyeC} ${eyeShape}, ${currentPose}, wearing ${clothC} ${outfit}, ${breastSize}${accessoryDesc}, ${footwearPrompt}, detailed shading, shoes visible`;
};

// --- ACTIONS ---

const loadPreset = (presetId) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
        character = { ...character, ...preset.data };
        render();
    }
};

const randomize = () => {
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const randColor = (arr) => arr[Math.floor(Math.random() * arr.length)].hex;

    character = {
        skinColor: randColor(COLOR_PALETTES.skin),
        hairColor: randColor(COLOR_PALETTES.hair),
        eyeColor: randColor(COLOR_PALETTES.eyes),
        clothesColor: randColor(COLOR_PALETTES.clothes),
        bgColor: rand(COLOR_PALETTES.bg),
        hairFront: rand(ASSETS.hairFront).id,
        hairBack: rand(ASSETS.hairBack).id,
        eyes: rand(ASSETS.eyes).id,
        brows: rand(ASSETS.brows).id,
        mouth: rand(ASSETS.mouths).id,
        clothes: rand(ASSETS.clothes).id,
        accessory: rand(ASSETS.accessories).id,
        breastSize: rand(BREAST_SIZES).id,
        footwear: rand(FOOTWEAR).id,
        isRevealing: Math.random() > 0.7,
        age: Math.floor(Math.random() * (35 - 18 + 1)) + 18,
        pose: rand(POSES).id
    };
    render();
};

const generateAIImage = () => {
    isGenerating = true;
    aiError = null;
    generatedImage = null;
    render(); // Update UI to show loading state

    const prompt = generatePrompt(character);
    const encodedPrompt = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 1000000);

    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=1024&seed=${seed}&nologo=true&model=${aiModel}`;

    const img = new Image();
    img.onload = () => {
        generatedImage = imageUrl;
        isGenerating = false;
        render();
    };
    img.onerror = () => {
        aiError = "Failed to connect to image server. Please try again.";
        isGenerating = false;
        render();
    };
    img.src = imageUrl;
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
    const svgEl = document.querySelector('#preview-container svg');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
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
        downloadImage(pngUrl, "waifu_draft.png");
    };
    img.src = url;
};

// --- RENDERING ---

const renderCharacterSVG = () => {
    const {
        skinColor, hairColor, eyeColor, clothesColor, bgColor,
        hairFront, hairBack, eyes, brows, mouth, clothes, accessory, breastSize, isRevealing, footwear, pose
    } = character;

    const currentHairBack = ASSETS.hairBack.find(h => h.id === hairBack);
    const currentHairFront = ASSETS.hairFront.find(h => h.id === hairFront);
    const currentEyes = ASSETS.eyes.find(e => e.id === eyes);
    const currentBrows = ASSETS.brows.find(b => b.id === brows);
    const currentMouth = ASSETS.mouths.find(m => m.id === mouth);
    const currentClothes = ASSETS.clothes.find(c => c.id === clothes);
    const currentAccessory = ASSETS.accessories.find(a => a.id === accessory);
    const currentBreastSize = BREAST_SIZES.find(b => b.id === breastSize);
    const currentFootwear = FOOTWEAR.find(f => f.id === footwear);
    const currentPoseTransform = POSES.find(p => p.id === pose)?.transform || '';

    const clothesPath = isRevealing && currentClothes.pathRev ? currentClothes.pathRev : currentClothes.path;

    return `
      <svg 
        viewBox="0 0 200 450" 
        class="w-full h-full shadow-xl rounded-lg bg-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="200" height="450" fill="${bgColor}" rx="10" />
        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.5)"/>
        </pattern>
        <rect width="200" height="450" fill="url(#dots)" rx="10" />
  
        <g transform="translate(0, 10) ${currentPoseTransform}">
            <path d="${currentHairBack?.path}" fill="${hairColor}" stroke="#222" stroke-width="2" />
            
            <path d="${ASSETS.body.legs}" fill="${skinColor}" stroke="#333" stroke-width="2" />
            
            <path d="${currentFootwear?.path}" fill="#111" stroke="#333" stroke-width="1" />
  
            <path d="${ASSETS.body.base}" fill="${skinColor}" stroke="#333" stroke-width="2" />
            <path d="${clothesPath}" fill="${clothesColor}" stroke="#333" stroke-width="2" />
            
            ${currentBreastSize?.path ? `
                <path 
                    d="${currentBreastSize.path}" 
                    fill="none" 
                    stroke="#222" 
                    stroke-width="1.5" 
                    opacity="0.6"
                />
            ` : ''}
  
            ${clothes === 'school' ? `
                ${!isRevealing ? '<path d="M80,220 L100,250 L120,220" fill="white" stroke="#333" stroke-width="2"/>' : ''}
                ${!isRevealing ? '<path d="M95,250 L105,250 L100,260 Z" fill="red" stroke="#333" stroke-width="1"/>' : ''}
                ${isRevealing ? '<path d="M80,220 L100,240 L120,220" fill="white" stroke="#333" stroke-width="2"/>' : ''}
            ` : ''}
            ${clothes === 'leather' && !isRevealing ? `
               <line x1="100" y1="220" x2="100" y2="280" stroke="#333" stroke-width="1.5" stroke-dasharray="2,2" />
            ` : ''}
            ${clothes === 'maid' ? `
               <path d="${isRevealing ? "M85,300 Q100,310 115,300" : "M75,300 Q100,320 125,300"}" stroke="white" stroke-width="1" fill="none" opacity="0.5" />
            ` : ''}
  
            <path d="${ASSETS.body.face}" fill="${skinColor}" stroke="#333" stroke-width="2" />
            
            ${accessory === 'blush' ? currentAccessory.render() : ''}
            <g>
                <path d="${currentEyes?.pathL}" fill="white" stroke="#333" stroke-width="1.5" />
                <path d="${currentEyes?.pathR}" fill="white" stroke="#333" stroke-width="1.5" />
                ${currentEyes?.type !== 'line' ? `
                    <circle cx="82" cy="95" r="${currentEyes?.pupil + 4}" fill="${eyeColor}" />
                    <circle cx="118" cy="95" r="${currentEyes?.pupil + 4}" fill="${eyeColor}" />
                    <circle cx="82" cy="95" r="${currentEyes?.pupil}" fill="#222" />
                    <circle cx="118" cy="95" r="${currentEyes?.pupil}" fill="#222" />
                    <circle cx="85" cy="92" r="2" fill="white" opacity="0.8" />
                    <circle cx="121" cy="92" r="2" fill="white" opacity="0.8" />
                ` : ''}
            </g>
            <path d="${currentBrows?.pathL}" fill="none" stroke="${hairColor}" stroke-width="2" />
            <path d="${currentBrows?.pathR}" fill="none" stroke="${hairColor}" stroke-width="2" />
            <path d="${currentMouth?.path}" fill="${currentMouth?.fill ? "#D87093" : "none"}" stroke="#4A3B2A" stroke-width="2" stroke-linecap="round"/>
            <path d="${currentHairFront?.path}" fill="${hairColor}" stroke="#222" stroke-width="2" opacity="0.95" />
            
            ${clothes === 'maid' ? `
                 <path d="M70,40 Q100,10 130,40 L130,60 Q100,30 70,60 Z" fill="white" stroke="#222" stroke-width="1" />
            ` : ''}
            
            ${accessory !== 'blush' && currentAccessory ? currentAccessory.render(character.clothesColor) : ''}
        </g>
      </svg>
    `;
};

const renderControls = () => {
    const container = document.getElementById('controls-content');
    container.innerHTML = '';

    if (activeTab === 'ai') {
        container.innerHTML = `
              <div class="space-y-6 animate-in slide-in-from-right-8 duration-500">
                  <div class="bg-gradient-to-br from-purple-900 to-slate-900 p-6 rounded-2xl text-white shadow-lg border border-purple-500/30">
                      <h3 class="text-lg font-bold flex items-center gap-2 mb-2 text-purple-200"><i class="fa-solid fa-wand-magic-sparkles"></i> Free AI Generator</h3>
                      <p class="text-slate-300 text-sm mb-4 leading-relaxed">
                          Transform your draft into a high-quality illustration for free using Pollinations AI. 
                          No API key required!
                      </p>
                      
                      <div class="flex items-center gap-2 text-xs bg-black/30 p-2 rounded-lg mb-4 text-slate-400">
                          <i class="fa-solid fa-wifi"></i>
                          <span>Uses public generation server (Flux/Anime Model)</span>
                      </div>
  
                      <div class="mb-4">
                         <label class="text-xs font-bold text-slate-400 mb-2 block">Select AI Model</label>
                         <div class="grid grid-cols-2 gap-2">
                           ${AI_MODELS.map(m => `
                             <button 
                               onclick="setAiModel('${m.id}')"
                               class="p-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors border ${aiModel === m.id ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}"
                             >
                               <i class="fa-solid ${m.icon}"></i> ${m.name}
                             </button>
                           `).join('')}
                         </div>
                      </div>
  
                      <button 
                          onclick="generateAIImage()"
                          ${isGenerating ? 'disabled' : ''}
                          class="w-full mt-2 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-purple-900/50 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}"
                      >
                          ${isGenerating ? '<i class="fa-solid fa-spinner animate-spin"></i> Generating...' : '<i class="fa-solid fa-wand-magic-sparkles"></i> Generate Now (Free)'}
                      </button>
  
                      ${aiError ? `
                          <div class="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-xs text-red-300">
                              ${aiError}
                          </div>
                      ` : ''}
                  </div>
  
                  <div class="p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-sm">
                      <h4 class="text-sm font-bold text-slate-400 mb-2">Current Prompt Preview</h4>
                      <p class="text-xs text-slate-500 font-mono bg-slate-900 p-3 rounded-lg border border-slate-800">
                          ${generatePrompt(character)}
                      </p>
                  </div>
              </div>
          `;
    } else if (activeTab === 'presets') {
        container.innerHTML = `
             <div class="space-y-6 animate-in slide-in-from-right-8 duration-500">
                <div class="mb-6">
                  <div class="flex items-center gap-2 mb-3 text-rose-400 font-bold uppercase tracking-wider text-sm">
                    <i class="fa-solid fa-users"></i>
                    <span>Character Presets</span>
                  </div>
                  <div class="space-y-3">
                     ${PRESETS.map(preset => `
                       <button
                         onclick="loadPreset('${preset.id}')"
                         class="w-full text-left p-4 bg-slate-800 rounded-xl border border-slate-700 hover:border-rose-500/50 hover:bg-slate-700 transition-all flex justify-between items-center group shadow-sm"
                       >
                          <span class="font-bold text-slate-200 group-hover:text-rose-400">${preset.name}</span>
                          <span class="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded group-hover:text-rose-400">Load</span>
                       </button>
                     `).join('')}
                   </div>
                </div>
             </div>
          `;
    } else {
        // Render standard controls
        let content = '<div class="space-y-6">';

        if (activeTab === 'face') {
            content += renderControlSection('Age', 'fa-calendar', `
                  <div class="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <div class="flex justify-between mb-2 text-sm font-bold text-slate-300">
                          <span>Character Age</span>
                          <span class="text-rose-400">${character.age}</span>
                      </div>
                      <input 
                          type="range" 
                          min="18" 
                          max="99" 
                          value="${character.age}"
                          oninput="updateCharacter('age', parseInt(this.value))"
                          class="w-full accent-rose-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                      />
                  </div>
              `);
            content += renderOptionGrid('Eyes Shape', 'fa-glasses', ASSETS.eyes, character.eyes, 'eyes');
            content += renderOptionGrid('Eyebrows', 'fa-face-smile', ASSETS.brows, character.brows, 'brows');
            content += renderOptionGrid('Mouth', 'fa-face-smile', ASSETS.mouths, character.mouth, 'mouth');
        } else if (activeTab === 'hair') {
            content += renderOptionGrid('Bangs (Front)', 'fa-scissors', ASSETS.hairFront, character.hairFront, 'hairFront');
            content += renderOptionGrid('Style (Back)', 'fa-scissors', ASSETS.hairBack, character.hairBack, 'hairBack');
        } else if (activeTab === 'outfit') {
            content += renderOptionGrid('Clothing Style', 'fa-shirt', ASSETS.clothes, character.clothes, 'clothes');
            content += renderControlSection('Style Options', 'fa-fire', `
                  <button 
                      onclick="updateCharacter('isRevealing', !character.isRevealing)"
                      class="w-full py-3 rounded-lg border font-bold transition-all flex items-center justify-center gap-2 ${character.isRevealing ? 'border-rose-500 bg-rose-900/20 text-rose-400 shadow-md' : 'border-slate-600 bg-slate-800 text-slate-400 hover:bg-slate-700'}"
                  >
                      ${character.isRevealing ? '🔥 Revealing Style' : '🛡️ Standard Style'}
                  </button>
              `);
            content += renderOptionGrid('Pose', 'fa-person', POSES, character.pose, 'pose');
            content += renderOptionGrid('Footwear', 'fa-shoe-prints', FOOTWEAR, character.footwear, 'footwear');
            content += renderOptionGrid('Chest Size', 'fa-circle', BREAST_SIZES, character.breastSize, 'breastSize');
            content += renderOptionGrid('Accessories', 'fa-glasses', ASSETS.accessories, character.accessory, 'accessory');
        } else if (activeTab === 'colors') {
            content += renderColorPicker('Skin Tone', COLOR_PALETTES.skin, character.skinColor, 'skinColor');
            content += renderColorPicker('Hair Colour', COLOR_PALETTES.hair, character.hairColor, 'hairColor');
            content += renderColorPicker('Eye Colour', COLOR_PALETTES.eyes, character.eyeColor, 'eyeColor');
            content += renderColorPicker('Clothing Colour', COLOR_PALETTES.clothes, character.clothesColor, 'clothesColor');
            content += renderColorPicker('Background', COLOR_PALETTES.bg, character.bgColor, 'bgColor');
        }

        content += '</div>';
        container.innerHTML = content;
    }
};

const renderControlSection = (title, icon, children) => `
      <div class="mb-6 animate-in fade-in duration-500">
        <div class="flex items-center gap-2 mb-3 text-rose-400 font-bold uppercase tracking-wider text-sm">
          <i class="fa-solid ${icon}"></i>
          <span>${title}</span>
        </div>
        <div class="space-y-4">
          ${children}
        </div>
      </div>
  `;

const renderOptionGrid = (title, icon, options, selected, key) => renderControlSection(title, icon, `
      <div class="grid grid-cols-3 gap-2">
        ${options.map(opt => `
          <button
            onclick="updateCharacter('${key}', '${opt.id}')"
            class="p-2 text-xs rounded-md border transition-all ${selected === opt.id
        ? 'bg-rose-900/30 border-rose-500 text-rose-400 font-bold shadow-sm'
        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500'
    }"
          >
            ${opt.name || opt.id}
          </button>
        `).join('')}
      </div>
  `);

const renderColorPicker = (label, colors, selected, key) => `
      <div>
        <label class="block text-xs text-slate-400 mb-2 font-medium">${label}</label>
        <div class="flex flex-wrap gap-2">
          ${colors.map(c => {
    const hex = c.hex || c;
    return `
                <button
                  onclick="updateCharacter('${key}', '${hex}')"
                  class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${selected === hex ? 'border-rose-500 scale-110 shadow-md shadow-rose-500/20' : 'border-slate-600'}"
                  style="background-color: ${hex}"
                  title="${c.name || ''}"
                ></button>
              `;
}).join('')}
        </div>
      </div>
  `;

const render = () => {
    // Render Preview
    const previewContainer = document.getElementById('preview-container');
    if (activeTab === 'ai') {
        if (generatedImage) {
            previewContainer.innerHTML = `
                  <div class="relative group w-full max-w-[500px] flex flex-col items-center">
                    <img 
                      src="${generatedImage}" 
                      alt="Generated Waifu" 
                      class="w-auto max-h-[600px] rounded-lg shadow-lg shadow-black/50 animate-in fade-in duration-700 mb-4"
                    />
                    <button 
                      onclick="downloadImage('${generatedImage}', 'my_ai_waifu.jpg')"
                      class="bg-rose-600 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 hover:bg-rose-500 transition-transform shadow-lg shadow-rose-900/20"
                    >
                        <i class="fa-solid fa-floppy-disk"></i> Download Image
                    </button>
                  </div>
              `;
        } else if (isGenerating) {
            previewContainer.innerHTML = `
                 <div class="text-center space-y-4 animate-pulse">
                    <i class="fa-solid fa-spinner text-rose-500 animate-spin text-5xl mx-auto"></i>
                    <p class="text-rose-400 font-medium">Generating your character...</p>
                    <p class="text-xs text-slate-500">This usually takes 5-10 seconds</p>
                 </div>
              `;
        } else {
            previewContainer.innerHTML = `
                <div class="text-center text-slate-600 space-y-2">
                   <i class="fa-solid fa-wand-magic-sparkles text-6xl mx-auto opacity-50"></i>
                   <p>Ready to generate</p>
                </div>
              `;
        }
    } else {
        previewContainer.innerHTML = `
            <div class="w-full max-w-[300px] aspect-[9/20] relative transform transition-all hover:scale-[1.01] duration-300">
              ${renderCharacterSVG()}
            </div>
          `;
    }

    // Render Controls
    renderControls();

    // Update Tab Styles
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const tab = btn.dataset.tab;
        if (tab === activeTab) {
            btn.classList.remove('text-slate-500', 'border-transparent', 'hover:text-slate-300', 'hover:bg-slate-800/50');
            btn.classList.add('text-rose-400', 'border-rose-500', 'bg-slate-800');
        } else {
            btn.classList.add('text-slate-500', 'border-transparent', 'hover:text-slate-300', 'hover:bg-slate-800/50');
            btn.classList.remove('text-rose-400', 'border-rose-500', 'bg-slate-800');
        }
    });

    // Toggle Action Buttons
    const actionButtons = document.getElementById('action-buttons');
    if (activeTab === 'ai') {
        actionButtons.classList.add('hidden');
    } else {
        actionButtons.classList.remove('hidden');
    }
};

// --- GLOBAL EXPORTS FOR HTML ACCESS ---
window.updateCharacter = (key, value) => {
    character[key] = value;
    render();
};

window.setAiModel = (model) => {
    aiModel = model;
    render();
};

window.loadPreset = loadPreset;
window.generateAIImage = generateAIImage;
window.downloadImage = downloadImage;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Tab Listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            activeTab = btn.dataset.tab;
            render();
        });
    });

    document.getElementById('randomize-btn').addEventListener('click', randomize);
    document.getElementById('save-draft-btn').addEventListener('click', downloadSvg);

    render();
});
