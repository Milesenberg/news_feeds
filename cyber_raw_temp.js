import React, { useState, useRef } from 'react';
import {
    Zap,
    Palette,
    Scissors,
    Shirt,
    Save,
    Shuffle,
    Glasses,
    Cpu,
    Sparkles,
    Loader2,
    Wifi,
    Circle,
    Flame,
    Users,
    Calendar,
    Footprints,
    Accessibility,
    Aperture,
    Terminal,
    Smile
} from 'lucide-react';

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
    { id: 'flux', name: 'Flux (Best)', icon: Sparkles },
    { id: 'turbo', name: 'Turbo (Fast)', icon: Flame },
    { id: 'pixel', name: 'Pixel Art', icon: Cpu },
    { id: 'midjourney', name: 'MJ Style', icon: Palette },
];

// PART_2_PLACEHOLDER
