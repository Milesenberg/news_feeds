// --- PRESETS DATA ---
const PRESETS = [
    {
        id: 'ivy',
        name: 'Ivy Valentine',
        series: 'SoulCalibur',
        data: {
            gender: 'female',
            skinColor: '#F0F0F0', // Pale synthetic skin
            hairColor: '#FFFFFF',
            eyeColor: '#3498DB', // Glowing blue eyes
            clothesColor: '#8E44AD', // Neon Purple
            hairFront: 'short',
            hairBack: 'short',
            eyes: 'sharp',
            clothes: 'leather', // Netrunner suit
            accessory: 'none',
            breastSize: 'huge',
            isRevealing: true,
            footwear: 'heels',
            age: 32,
            mouth: 'smirk',
            brows: 'angry',
            pose: 'standing',
            cyberware: 'light'
        }
    },
    {
        id: 'david',
        name: 'David M.',
        series: 'Edgerunners',
        data: {
            gender: 'male',
            skinColor: '#D2A38E',
            hairColor: '#5D4037',
            eyeColor: '#34495E',
            clothesColor: '#F1C40F', // Yellow jacket
            hairFront: 'spiked',
            hairBack: 'shaved',
            eyes: 'neutral',
            clothes: 'casual',
            accessory: 'choker', // Sandevistan spine proxy
            breastSize: 'flat',
            isRevealing: false,
            footwear: 'sneakers',
            age: 18,
            mouth: 'smirk',
            brows: 'angry',
            pose: 'standing',
            cyberware: 'heavy'
        }
    },
    {
        id: 'takemura',
        name: 'Goro T.',
        series: 'Cyberpunk 2077',
        data: {
            gender: 'male',
            skinColor: '#FFE4D6',
            hairColor: '#111111',
            eyeColor: '#FFFFFF', // Cyber optics
            clothesColor: '#2C3E50',
            hairFront: 'slicked',
            hairBack: 'ponytail',
            eyes: 'sharp',
            clothes: 'office', // Suit
            accessory: 'none',
            breastSize: 'flat',
            isRevealing: false,
            footwear: 'boots',
            age: 45,
            mouth: 'neutral',
            brows: 'angry',
            pose: 'hands_on_hips',
            cyberware: 'light'
        }
    },
    {
        id: 'kitana',
        name: 'Kitana',
        series: 'Mortal Kombat',
        data: {
            gender: 'female',
            skinColor: '#D2A38E',
            hairColor: '#111111',
            eyeColor: '#2D2D2D',
            clothesColor: '#0047AB', // Cyber Blue
            hairFront: 'parted',
            hairBack: 'ponytail',
            eyes: 'sharp',
            clothes: 'bikini', // Tactical gear
            accessory: 'mask',
            breastSize: 'large',
            isRevealing: true,
            footwear: 'boots',
            age: 25,
            mouth: 'neutral',
            brows: 'angry',
            pose: 'hands_on_hips',
            cyberware: 'heavy'
        }
    },
    {
        id: 'faye',
        name: 'Faye Valentine',
        series: 'Cowboy Bebop',
        data: {
            gender: 'female',
            skinColor: '#FFE4D6',
            hairColor: '#8E44AD',
            eyeColor: '#00FF00', // Cyber Green
            clothesColor: '#F1C40F', // Hazard Yellow
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
            pose: 'standing',
            cyberware: 'light'
        }
    },
    {
        id: 'asuka',
        name: 'Asuka Langley',
        series: 'Neon Genesis Evangelion',
        data: {
            gender: 'female',
            skinColor: '#FFE4D6',
            hairColor: '#D35400',
            eyeColor: '#3498DB',
            clothesColor: '#E74C3C', // Pilot Red
            hairFront: 'straight',
            hairBack: 'twintails',
            eyes: 'sharp',
            clothes: 'leather', // Plugsuit
            accessory: 'none',
            breastSize: 'flat',
            isRevealing: false,
            footwear: 'sneakers',
            age: 18,
            mouth: 'angry',
            brows: 'angry',
            pose: 'hands_on_hips',
            cyberware: 'organic'
        }
    },
    {
        id: '2b',
        name: '2B',
        series: 'Nier: Automata',
        data: {
            gender: 'female',
            skinColor: '#FFFFFF', // Synthetic
            hairColor: '#ECF0F1',
            eyeColor: '#34495E',
            clothesColor: '#000000',
            hairFront: 'hime',
            hairBack: 'short',
            eyes: 'neutral',
            clothes: 'dress',
            accessory: 'blindfold', // Visor
            breastSize: 'large',
            isRevealing: false,
            footwear: 'boots',
            age: 20,
            mouth: 'neutral',
            brows: 'neutral',
            pose: 'standing',
            cyberware: 'android'
        }
    },
    {
        id: 'yumi',
        name: 'Yumi',
        series: 'Senran Kagura',
        data: {
            gender: 'female',
            skinColor: '#E0F7FA', // Icy sheen
            hairColor: '#BDC3C7',
            eyeColor: '#00FFFF', // Neon Cyan
            clothesColor: '#F0F8FF',
            hairFront: 'hime',
            hairBack: 'ponytail',
            eyes: 'cute',
            clothes: 'dress', // Cyber Kimono
            accessory: 'none',
            breastSize: 'huge',
            isRevealing: false,
            footwear: 'heels',
            age: 18,
            mouth: 'neutral',
            brows: 'neutral',
            pose: 'standing',
            cyberware: 'light'
        }
    },
    {
        id: 'rapi',
        name: 'Rapi',
        series: 'NIKKE',
        data: {
            gender: 'female',
            skinColor: '#FFE4D6',
            hairColor: '#5D4037',
            eyeColor: '#FF0000', // LED Red
            clothesColor: '#E74C3C',
            hairFront: 'straight',
            hairBack: 'long',
            eyes: 'neutral',
            clothes: 'office', // Uniform
            accessory: 'none',
            breastSize: 'large',
            isRevealing: true,
            footwear: 'boots',
            age: 20,
            mouth: 'neutral',
            brows: 'neutral',
            pose: 'hands_on_hips',
            cyberware: 'android'
        }
    }
];

// --- ASSETS & DATA ---

const CYBERWARE_LEVELS = [
    { id: 'organic', name: 'Organic', desc: 'natural skin, minimal tech' },
    { id: 'light', name: 'Light Augs', desc: 'tech lines on skin, glowing eyes, data ports' },
    { id: 'heavy', name: 'Heavy Chrome', desc: 'robotic limbs, metal skin plating, exposed wiring' },
    { id: 'android', name: 'Full Borg', desc: 'fully synthetic body, doll-like joints, artificial skin' }
];

const COLOR_PALETTES = {
    skin: [
        { hex: '#FFE4D6', name: 'Natural' },
        { hex: '#D2A38E', name: 'Tanned' },
        { hex: '#8D5524', name: 'Dark' },
        { hex: '#E0F7FA', name: 'Synth-White' },
        { hex: '#B0BEC5', name: 'Chrome' },
        { hex: '#2C3E50', name: 'Carbon' }
    ],
    hair: [
        { hex: '#00FFFF', name: 'Neon Cyan' },
        { hex: '#FF00FF', name: 'Neon Pink' },
        { hex: '#CCFF00', name: 'Acid Green' },
        { hex: '#FFFFFF', name: 'White' },
        { hex: '#111111', name: 'Void Black' },
        { hex: '#FF3333', name: 'Laser Red' },
        { hex: '#9B59B6', name: 'Electric Purple' },
        { hex: '#E6C8A1', name: 'Natural Blonde' },
        { hex: '#5D4037', name: 'Brown' }
    ],
    eyes: [
        { hex: '#00FFFF', name: 'Cyan LED' },
        { hex: '#FF0000', name: 'Red Optic' },
        { hex: '#FFFF00', name: 'Gold Sensor' },
        { hex: '#FFFFFF', name: 'White Glow' },
        { hex: '#3498DB', name: 'Blue' },
        { hex: '#000000', name: 'Black Sclera' }
    ],
    clothes: [
        { hex: '#111111', name: 'Matte Black' },
        { hex: '#00FFFF', name: 'Holo Cyan' },
        { hex: '#FF00FF', name: 'Hot Pink' },
        { hex: '#FFFF00', name: 'Caution Yellow' },
        { hex: '#E74C3C', name: 'Crimson' },
        { hex: '#FFFFFF', name: 'Lab White' },
        { hex: '#7F8C8D', name: 'Gunmetal' },
        { hex: '#5D3FD3', name: 'Ultra Violet' }
    ],
    bg: ['#050505', '#001a1a', '#1a001a', '#000033', '#1a1a1a', '#2c0000']
};

const BREAST_SIZES = [
    { id: 'flat', name: 'Flat', prompt: 'flat chest', path: null },
    { id: 'medium', name: 'Medium', prompt: 'medium breasts', path: "M85,215 Q100,222 115,215" },
    { id: 'large', name: 'Large', prompt: "large breasts", path: "M80,215 Q100,235 120,215" },
    { id: 'huge', name: 'Huge', prompt: "huge breasts, voluptuous", path: "M75,215 Q100,250 125,215" }
];

const FOOTWEAR = [
    { id: 'sneakers', name: 'Hi-Tops', prompt: 'wearing glowing futuristic high-top sneakers', path: "M65,415 L65,425 Q65,435 75,435 L85,435 L85,415 Z M115,415 L115,435 L125,435 Q135,435 135,425 L135,415 Z" },
    { id: 'boots', name: 'Combat Boots', prompt: 'wearing heavy tactical combat boots', path: "M70,350 L90,350 L90,435 L70,435 Z M110,350 L130,350 L130,435 L110,435 Z" },
    { id: 'heels', name: 'Cyber Heels', prompt: 'wearing chrome stiletto heels', path: "M70,420 L65,440 L85,440 L85,420 Z M115,420 L115,440 L135,440 L130,420 Z" }
];

const POSES = [
    {
        id: 'standing',
        name: 'Standing',
        prompt: 'standing pose, confident netrunner stance',
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
        prompt: 'kneeling down on floor, looking up at viewer, submissive or hacking pose',
        transform: 'translate(0, 60)'
    },
    {
        id: 'hands_on_hips',
        name: 'Hands on Hips',
        prompt: 'standing pose, hands on hips, arrogant corporate stance',
        transform: ''
    },
    {
        id: 'sitting_crossed',
        name: 'Sitting',
        prompt: 'sitting cross-legged on the floor, meditating or hacking',
        transform: 'translate(0, 80)'
    }
];

const AI_MODELS = [
    { id: 'flux', name: 'Flux (Best)', icon: 'sparkles' },
    { id: 'turbo', name: 'Turbo (Fast)', icon: 'flame' },
    { id: 'pixel', name: 'Pixel Art', icon: 'cpu' },
    { id: 'midjourney', name: 'MJ Style', icon: 'palette' },
];

const ASSETS = {
    body: {
        female: {
            base: "M85,160 Q75,180 70,220 L70,300 L130,300 L130,220 Q125,180 115,160",
            face: "M60,90 Q60,160 100,175 Q140,160 140,90 Q140,30 100,30 Q60,30 60,90",
            legs: "M75,300 L75,410 Q75,430 65,435 L85,435 Q90,420 90,360 L90,300 M110,300 L110,360 Q110,420 115,435 L135,435 Q125,430 125,410 L125,300"
        },
        male: {
            base: "M65,160 L65,180 L75,280 L125,280 L135,180 L135,160",
            face: "M60,90 Q60,160 100,180 Q140,160 140,90 Q140,30 100,30 Q60,30 60,90",
            legs: "M75,280 L75,410 L65,435 L85,435 L90,360 L90,280 M110,280 L110,360 L115,435 L135,435 L125,410 L125,280"
        }
    },
    eyes: [
        { id: 'cute', name: 'Cyber', desc: 'glowing cybernetic eyes', pathL: "M75,95 Q82,80 90,95 Q82,110 75,95", pathR: "M110,95 Q118,80 125,95 Q118,110 110,95", pupil: 3.5 },
        { id: 'sleepy', name: 'Tired', desc: 'half-lidded eyes, heavy makeup', pathL: "M75,98 Q82,92 90,98", pathR: "M110,98 Q118,92 125,98", pupil: 2.5, type: 'line' },
        { id: 'sharp', name: 'Optic', desc: 'sharp, angular optic implants', pathL: "M73,92 Q82,85 92,90 L90,96 Q80,92 73,92", pathR: "M108,90 Q118,85 127,92 L125,96 Q118,92 108,90", pupil: 3 },
        { id: 'wide', name: 'Sensor', desc: 'wide, aperture-like sensor eyes', pathL: "M72,90 Q82,75 92,90 Q82,105 72,90", pathR: "M108,90 Q118,75 128,90 Q118,105 108,90", pupil: 4 }
    ],
    brows: [
        { id: 'neutral', name: 'Neutral', pathL: "M75,80 Q82,78 90,80", pathR: "M110,80 Q118,78 125,80" },
        { id: 'sad', name: 'Worried', pathL: "M75,78 Q82,82 90,80", pathR: "M110,80 Q118,82 125,78" },
        { id: 'angry', name: 'Aggro', pathL: "M75,78 L90,85", pathR: "M110,85 L125,78" },
    ],
    mouths: [
        { id: 'smile', name: 'Smile', path: "M90,125 Q100,135 110,125" },
        { id: 'smirk', name: 'Smirk', path: "M92,132 Q100,138 108,128" },
        { id: 'happy', name: 'Laugh', path: "M90,125 Q100,140 110,125 Z", fill: true },
        { id: 'neutral', name: 'Line', path: "M95,130 L105,130" },
        { id: 'cat', name: 'Fang', path: "M92,128 Q97,132 100,128 Q103,132 108,128" },
        { id: 'surprised', name: 'Gasp', path: "M95,125 Q100,125 105,125 Q105,135 100,135 Q95,135 95,125", fill: true }
    ],
    hairFront: [
        { id: 'hime', name: 'Hime Cut', desc: 'hime cut hairstyle with straight bangs', path: "M60,80 C60,80 60,140 60,140 L75,140 L75,80 L85,80 L85,110 L115,110 L115,80 L125,80 L125,140 L140,140 C140,140 140,80 140,80 C140,20 60,20 60,80" },
        { id: 'parted', name: 'Asymmetric', desc: 'asymmetric punk bangs', path: "M100,30 C60,30 55,100 55,130 C65,120 90,40 100,40 C110,40 135,120 145,130 C145,100 140,30 100,30" },
        { id: 'messy', name: 'Messy', desc: 'messy, textured hacker hair', path: "M60,80 Q50,120 55,140 L70,100 L80,120 L90,90 L100,110 L110,90 L120,120 L130,100 L145,140 Q150,120 140,80 Q140,20 60,20" },
        { id: 'straight', name: 'Fringe', desc: 'straight bangs across forehead', path: "M60,60 Q60,120 60,150 L140,150 Q140,120 140,60 Q140,20 60,20" },
        { id: 'wolf', name: 'Shag', desc: 'wild wolf cut shaggy bangs', path: "M60,60 Q60,100 50,130 L70,110 L80,140 L90,90 L100,130 L110,90 L120,140 L130,110 L150,130 Q140,100 140,60 Q140,20 60,20" },
        { id: 'buzz', name: 'Buzz Cut', desc: 'short military buzz cut hairline', path: "M70,60 Q100,55 130,60" },
        { id: 'slicked', name: 'Slicked', desc: 'slicked back corporate hair', path: "M60,70 Q100,40 140,70 L135,50 Q100,20 65,50 Z" },
        { id: 'spiked', name: 'Spiked', desc: 'aggressive punk spikes', path: "M60,70 L50,40 L70,60 L80,20 L100,50 L120,20 L130,60 L150,40 L140,70" },
        { id: 'dreads', name: 'Tech-Locs', desc: 'thick braided dreadlocks with tech beads', path: "M60,50 Q55,100 60,130 L70,130 Q65,100 70,50 M130,50 Q135,100 140,130 L130,130" }
    ],
    hairBack: [
        { id: 'short', name: 'Bob', desc: 'short sharp bob', path: "M50,80 Q45,130 60,140 L140,140 Q155,130 150,80 Q150,10 50,10" },
        { id: 'long', name: 'Long', desc: 'long straight flowing hair', path: "M50,80 Q40,180 50,220 L150,220 Q160,180 150,80 Q150,10 50,10 M50,220 L50,380 L150,380 L150,220" },
        { id: 'twintails', name: 'Pigtails', desc: 'long cyber pigtails', path: "M50,80 Q20,120 30,200 Q40,150 60,120 M140,120 Q160,150 170,200 Q180,120 150,80 M50,80 Q50,10 150,10 Q150,80 150,80 M30,200 L30,380 M170,200 L170,380" },
        { id: 'ponytail', name: 'Ponytail', desc: 'high tactical ponytail', path: "M50,80 Q50,10 150,10 Q150,80 150,80 M80,40 Q60,150 80,200 Q100,220 120,200 Q140,150 120,40 M80,200 L90,420 L110,420 L120,200" },
        { id: 'wolf', name: 'Mullet', desc: 'layered cyberpunk mullet', path: "M50,80 Q40,140 35,170 L50,160 L60,190 L80,160 L120,160 L140,190 L150,160 L165,170 Q160,140 150,80 Q150,10 50,10 M60,190 L55,350 M140,190 L145,350" },
        { id: 'shaved', name: 'Fade', desc: 'shaved back and sides, high fade', path: "M60,90 Q60,140 100,150 Q140,140 140,90" },
        { id: 'mohawk', name: 'Mohawk', desc: 'central punk mohawk strip', path: "M90,30 L85,160 L115,160 L110,30" },
        { id: 'braids', name: 'Braids', desc: 'long cyber braids down the back', path: "M70,80 L60,250 L80,250 L90,80 M130,80 L140,250 L120,250 L110,80" }
    ],
    clothes: [
        {
            id: 'school',
            name: 'Academy',
            desc: 'cyberpunk school uniform, high tech fabric',
            descRev: 'cropped cyber school uniform, exposed midriff, micro skirt',
            path: "M70,220 L130,220 L130,300 L140,380 L60,380 L70,300 Z M70,220 Q100,240 130,220 L120,180 Q100,200 80,180 Z M90,220 L100,250 L110,220",
            pathRev: "M70,220 L130,220 L130,255 L70,255 Z M65,300 L135,300 L140,330 L60,330 Z M70,220 Q100,240 130,220 L120,180 Q100,200 80,180 Z M90,220 L100,255 L110,220",
            pathMale: "M65,180 L135,180 L135,280 L65,280 Z M100,180 L100,280 M65,280 L135,280 L130,420 L70,420 Z", // Gakuran style
            collar: true
        },
        {
            id: 'casual',
            name: 'Street',
            desc: 'oversized tech-hoodie with shorts',
            descRev: 'cropped tech-hoodie, midriff exposed, tiny shorts',
            path: "M65,190 Q100,210 135,190 L135,330 L65,330 Z M90,190 L90,300",
            pathRev: "M65,190 Q100,210 135,190 L135,240 Q100,250 65,240 Z M90,190 L90,240 M65,300 L135,300 L135,330 L65,330 Z",
            pathMale: "M60,180 Q100,200 140,180 L140,300 L60,300 Z M65,300 L135,300 L130,420 L70,420 Z" // Hoodie + Cargo
        },
        {
            id: 'dress',
            name: 'Gown/Robe',
            desc: 'elegant high-tech gown',
            descRev: 'strapless cyber cocktail dress with high slit',
            path: "M70,190 Q100,210 130,190 L140,430 L60,430 L70,190 Z M70,190 Q60,200 55,220 L65,230 Q70,210 75,200",
            pathRev: "M75,205 Q100,215 125,205 L135,420 L65,420 L75,205 Z M95,240 L115,430 L85,430 Z",
            pathMale: "M65,180 L135,180 L140,400 L60,400 Z M100,180 L100,400" // High collar coat
        },
        {
            id: 'leather',
            name: 'Netrunner',
            desc: 'armored leather netrunner suit',
            descRev: 'open netrunner jacket showing tech-bikini, shorts',
            path: "M65,190 Q100,185 135,190 L140,300 L60,300 Z M65,190 L80,215 L90,195 M135,190 L120,215 L110,195 M70,300 L130,300 L125,435 L75,435 Z",
            pathRev: "M60,190 L75,300 L60,300 Z M140,190 L125,300 L140,300 Z M65,190 L80,215 L90,195 M135,190 L120,215 L110,195 M85,215 Q100,230 115,215 M70,320 L130,320 L125,350 L75,350 Z",
            pathMale: "M60,180 L140,180 L135,300 L65,300 Z M70,300 L130,300 L125,420 L75,420 Z M80,180 L80,280 M120,180 L120,280" // Tac Vest
        },
        {
            id: 'maid',
            name: 'Service Droid',
            desc: 'cybernetic maid outfit',
            descRev: 'french maid android chassis, short skirt',
            path: "M70,200 L130,200 L140,410 L60,410 Z M60,410 L140,410 L145,430 L55,430 Z M80,200 L120,200 L115,320 L85,320 Z",
            pathRev: "M75,210 L125,210 L135,320 L65,320 Z M65,320 Q100,340 135,320 L140,350 L60,350 Z M80,210 L80,250 Q100,260 120,250 L120,210",
            pathMale: "M70,180 L130,180 L130,280 L70,280 Z M70,280 L130,280 L125,420 L75,420 Z M100,180 L100,220 L90,220 L100,240 L110,220 L100,220" // Butler Suit
        },
        {
            id: 'office',
            name: 'Corpo Suit',
            desc: 'arasaka style corporate suit',
            descRev: 'unbuttoned corpo blouse, mini skirt',
            path: "M65,190 L135,190 L135,300 L65,300 Z M90,190 L100,230 L110,190 M75,300 L125,300 L120,390 L80,390 Z",
            pathRev: "M70,190 L130,190 L130,270 L70,270 Z M100,190 L100,270 M75,300 L125,300 L125,330 L75,330 Z M80,390 L120,390 L120,435 L80,435 Z",
            pathMale: "M65,180 L135,180 L135,300 L65,300 Z M100,180 L100,300 M70,300 L130,300 L125,420 L75,420 Z" // Sharp Suit
        },
        {
            id: 'crop_top',
            name: 'Tech Top',
            desc: 'tight tech-fabric crop top, exposed midriff, tactical pants',
            descRev: 'micro tech-top, underboob, hotpants',
            path: "M70,180 L130,180 L135,230 Q100,240 65,230 Z M70,300 L130,300 L125,435 L75,435 Z",
            pathRev: "M75,180 L125,180 L125,215 Q100,225 75,215 Z M70,300 L130,300 L130,330 L70,330 Z",
            pathMale: "M70,180 L130,180 L130,280 L70,280 Z M70,300 L130,300 L125,420 L75,420 Z" // Tank top + Pants
        },
        {
            id: 'bikini',
            name: 'Swimsuit',
            desc: 'thermal swimwear',
            descRev: 'micro fiber string bikini',
            path: "M70,210 Q85,240 98,210 L98,200 Q85,180 70,200 Z M102,210 Q115,240 130,210 L130,200 Q115,180 102,200 Z M70,300 Q100,320 130,300 L130,320 L70,320 Z",
            pathRev: "M75,210 L90,210 L82,190 Z M110,210 L125,210 L118,190 Z M90,300 L110,300 L100,320 Z",
            pathMale: "M70,320 L130,320 L130,360 L70,360 Z" // Trunks
        }
    ],
    accessories: [
        { id: 'none', name: 'None', desc: '', render: () => '' },
        {
            id: 'glasses', name: 'Visor', desc: 'wearing glowing high-tech visor', render: (color) => `
      <g stroke="${color}" stroke-width="2" fill="none">
        <path d="M75,95 L125,95 L130,90 L70,90 Z" fill="${color}" opacity="0.5" stroke="none" />
        <line x1="70" y1="90" x2="130" y2="90" stroke="#00FFFF" stroke-width="2" />
      </g>`
        },
        {
            id: 'cat_ears', name: 'Neko Ears', desc: 'wearing cybernetic cat ears', render: (color) => `
      <g fill="#333" stroke="${color}" stroke-width="2">
        <path d="M60,50 L40,20 L80,40 Z" />
        <path d="M140,50 L160,20 L120,40 Z" />
      </g>`
        },
        {
            id: 'blindfold', name: 'Blindfold', desc: 'wearing a tactical blindfold', render: (color) => `
      <path d="M60,90 Q100,85 140,90 L140,105 Q100,100 60,105 Z" fill="#111" stroke="#333" />`
        },
        {
            id: 'mask', name: 'Gas Mask', desc: 'wearing a cybernetic half-mask', render: (color) => `
      <g>
        <path d="M70,120 L130,120 L125,145 Q100,155 75,145 Z" fill="#111" stroke="${color}" />
        <circle cx="85" cy="135" r="5" fill="#333" />
        <circle cx="115" cy="135" r="5" fill="#333" />
      </g>`
        },
        {
            id: 'choker', name: 'Data Port', desc: 'wearing a neck data port', render: () => `
      <rect x="90" y="165" width="20" height="5" fill="#333" stroke="#00FFFF" stroke-width="1" />`
        }
    ]
};
