const { useState, useEffect, useMemo } = React;

// Font Awesome Icon Helper Component
const FAIcon = ({ icon, size = 16, className = "" }) => (
    <i className={`fas fa-${icon} ${className}`} style={{ fontSize: `${size}px` }}></i>
);

// --- Game Constants & Data ---

const MAX_TURNS = 6;
const MAX_CARDS_PER_LOCATION = 4;

const CARDS_DB = [
    { id: 'c1', name: 'The Sprinter', cost: 1, power: 2, color: 'bg-red-600', desc: 'Lightning fast.', image: '/justice/static/images/hero_duel_sprinter_1765820610230.png' },
    { id: 'c2', name: 'The Sidekick', cost: 1, power: 1, color: 'bg-green-600', ability: 'buff_self', abilityVal: 2, desc: 'On Reveal: +2 Power.', image: '/justice/static/images/hero_duel_sidekick_1765820641385.png' },
    { id: 'c3', name: 'The Jester', cost: 2, power: 3, color: 'bg-pink-600', desc: 'Unpredictable chaos.', image: '/justice/static/images/hero_duel_jester_1765820670659.png' },
    { id: 'c13', name: 'The Burglar', cost: 2, power: 3, color: 'bg-purple-800', desc: 'Stealthy thief.', image: '/justice/static/images/hero_duel_burglar_1765821392051.png' },
    { id: 'c4', name: 'The Android', cost: 2, power: 4, color: 'bg-gray-500', desc: 'Cybernetic defense.', image: '/justice/static/images/hero_duel_android_1765821412816.png' },
    { id: 'c5', name: 'The Vigilante', cost: 3, power: 4, color: 'bg-slate-800', ability: 'buff_loc', abilityVal: 1, desc: 'On Reveal: +1 Power to allies here.', image: '/justice/static/images/hero_duel_vigilante_1765821429652.png' },
    { id: 'c6', name: 'The Warden', cost: 3, power: 5, color: 'bg-green-500', desc: 'Construct creator.', image: '/justice/static/images/hero_duel_warden_1765821675808.png' },
    { id: 'c7', name: 'The Sea King', cost: 4, power: 6, color: 'bg-orange-500', desc: 'Ruler of the deep.', image: '/justice/static/images/hero_duel_seaking_1765821692608.png' },
    { id: 'c8', name: 'The Amazon', cost: 4, power: 7, color: 'bg-red-700', desc: 'Warrior strength.', image: '/justice/static/images/hero_duel_amazon_1765821715278.png' },
    { id: 'c9', name: 'The Madman', cost: 5, power: 3, color: 'bg-purple-600', ability: 'debuff_opp', abilityVal: -1, desc: 'On Reveal: -1 Power to enemies here.', image: '/justice/static/images/hero_duel_madman_1765823314724.png' },
    { id: 'c10', name: 'The Paragon', cost: 6, power: 12, color: 'bg-blue-600', desc: 'Ultimate power.', image: '/justice/static/images/hero_duel_paragon_1765823333905.png' },
    { id: 'c11', name: 'The Mastermind', cost: 5, power: 8, color: 'bg-green-800', desc: 'Genius intellect.', image: '/justice/static/images/hero_duel_mastermind_1765823351393.png' },
    { id: 'c12', name: 'The Tyrant', cost: 6, power: 11, color: 'bg-gray-900', ability: 'destroy', desc: 'On Reveal: Sacrifice ally for +3 Power.', image: '/justice/static/images/hero_duel_tyrant_1765823370375.png' },
];

const LOCATIONS_DB = [
    { id: 'l1', name: 'Shadow City', color: 'from-slate-800 to-slate-900', effect: 'No special effect.', bgImage: '/justice/static/images/hero_duel_shadow_city_1765823555133.png' },
    { id: 'l2', name: 'Solar City', color: 'from-blue-400 to-blue-600', effect: 'Cards here get +1 Power.', bgImage: '/justice/static/images/hero_duel_solar_city_1765823571520.png' },
    { id: 'l3', name: 'Warrior\'s Isle', color: 'from-yellow-600 to-red-600', effect: 'Only cards costing 4+ can be played here.', bgImage: '/justice/static/images/hero_duel_warriors_isle_1765823587112.png' },
    { id: 'l4', name: 'The Sanatorium', color: 'from-green-900 to-slate-900', effect: 'Cards here have -1 Power.', bgImage: '/justice/static/images/hero_duel_sanatorium_1765823603358.png' },
    { id: 'l5', name: 'Frozen Citadel', color: 'from-cyan-100 to-blue-200', effect: 'Turn 5: Cards here swap sides (Not implemented).', bgImage: '/justice/static/images/hero_duel_frozen_citadel_1765823619914.png' },
];

// --- Helper Functions ---

const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};

const getRandomDeck = () => shuffle([...CARDS_DB]); // Simple copy for now

// --- Components ---

const Card = ({ card, onClick, isSelected, isOpponent, mini = false }) => {
    if (isOpponent) {
        return (
            <div className={`
        ${mini ? 'w-12 h-16 text-[8px]' : 'w-20 h-28 text-xs'}
        bg-slate-700 rounded-lg border-2 border-slate-500 shadow-md flex items-center justify-center
        transform transition-transform hover:scale-105
      `}>
                <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                    <FAIcon icon="shield-alt" size={12} className="text-slate-400" />
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={() => onClick && onClick(card)}
            className={`
        relative flex flex-col items-center justify-between p-1
        ${mini ? 'w-14 h-20' : 'w-24 h-32'}
        ${card.color} text-white rounded-lg shadow-lg cursor-pointer
        transform transition-all duration-200
        ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-4 scale-110 z-10' : 'hover:-translate-y-1 hover:shadow-xl border border-white/20'}
      `}
        >
            {/* Cost Badge */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 font-bold text-sm">
                {card.cost}
            </div>

            {/* Power Badge */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm z-10 font-bold text-sm">
                {card.basePower || card.power}
            </div>

            {/* Art Placeholder */}
            <div className={`w-full ${mini ? 'h-8' : 'h-14'} bg-black/20 rounded mt-3 flex items-center justify-center overflow-hidden`}>
                {card.image ? (
                    <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                ) : (
                    <span className={`${mini ? 'text-[8px]' : 'text-[10px]'} font-bold opacity-80 uppercase tracking-wider text-center px-1`}>
                        {card.name.split(' ')[0]}
                    </span>
                )}
            </div>

            {/* Text */}
            {!mini && (
                <div className="text-[9px] text-center leading-tight px-1 h-8 flex items-center justify-center opacity-90 overflow-hidden">
                    {card.desc}
                </div>
            )}

            {/* Name for non-mini */}
            {!mini && <div className="font-bold text-[10px] mt-auto mb-1 truncate w-full text-center">{card.name}</div>}
        </div>
    );
};

const Location = ({ data, index, playerCards, opponentCards, onSelect, activeTurn }) => {
    // Calculate total power at this location
    const totalPowerPlayer = playerCards.reduce((sum, c) => sum + c.power, 0);
    const totalPowerOpponent = opponentCards.reduce((sum, c) => sum + c.power, 0);

    // Determine border color based on winning status
    let borderClass = 'border-slate-700';
    if (totalPowerPlayer > totalPowerOpponent) borderClass = 'border-blue-500';
    else if (totalPowerOpponent > totalPowerPlayer) borderClass = 'border-red-500';
    else if (totalPowerPlayer > 0 && totalPowerPlayer === totalPowerOpponent) borderClass = 'border-yellow-500'; // Tie

    // Guard against undefined data (though parent should prevent this)
    if (!data) return <div className="flex-1 bg-slate-900 rounded-xl animate-pulse"></div>;

    return (
        <div
            onClick={onSelect}
            className={`
        flex-1 h-full min-h-[350px] flex flex-col items-center justify-between
        bg-gradient-to-b ${data.color || 'from-gray-800 to-gray-900'} rounded-xl border-4 ${borderClass} shadow-2xl overflow-hidden relative
      `}
            style={(data.bgImage && data.revealed) ? {
                backgroundImage: `url(${data.bgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            } : {}}
        >
            {/* Dark overlay for readability */}
            {(data.bgImage && data.revealed) && <div className="absolute inset-0 bg-black/50 z-0"></div>}
            {/* Opponent Side */}
            <div className="w-full flex-1 p-2 flex flex-col items-center justify-start gap-1 bg-black/30 relative z-10">
                <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center border-2 border-slate-600 shadow-md mb-2">
                    {totalPowerOpponent}
                </div>
                <div className="grid grid-cols-2 gap-1 w-full max-w-[140px]">
                    {opponentCards.map((c, i) => (
                        <div key={i} className="flex justify-center">
                            <Card card={c} isOpponent={!c.revealed} mini />
                        </div>
                    ))}
                </div>
            </div>

            {/* Location Info */}
            <div className="w-full py-2 bg-black/60 backdrop-blur-sm border-y border-white/10 flex flex-col items-center justify-center z-20">
                <h3 className="text-white font-bold text-xs uppercase tracking-widest shadow-black drop-shadow-md text-center px-1">
                    {data.revealed ? data.name : "Unrevealed"}
                </h3>
                <p className="text-[9px] text-slate-300 text-center px-2 leading-tight">
                    {data.revealed ? data.effect : "???"}
                </p>
            </div>

            {/* Player Side (Interactive Zone) */}
            <div className={`w-full flex-1 p-2 flex flex-col items-center justify-end gap-1 hover:bg-white/5 transition-colors cursor-pointer relative z-10 ${activeTurn ? 'ring-inset hover:ring-2 ring-white/30' : ''}`}>
                <div className="grid grid-cols-2 gap-1 w-full max-w-[140px] mb-2">
                    {playerCards.map((c, i) => (
                        <div key={i} className="flex justify-center">
                            <Card card={c} isOpponent={false} mini />
                        </div>
                    ))}
                    {/* Placeholder slots */}
                    {Array.from({ length: Math.max(0, 4 - playerCards.length) }).map((_, i) => (
                        <div key={`empty-${i}`} className="w-12 h-16 rounded border border-white/10 bg-white/5 mx-auto"></div>
                    ))}
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center border-2 border-slate-400 shadow-md transform translate-y-2">
                    {totalPowerPlayer}
                </div>
            </div>
        </div>
    );
};

// --- Main App Component ---

function JusticeDuel() {
    // Game State
    const [turn, setTurn] = useState(1);
    const [energy, setEnergy] = useState(1);
    const [gameStatus, setGameStatus] = useState('playing'); // playing, ended

    // Player State
    const [playerDeck, setPlayerDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // Opponent State
    const [opponentDeck, setOpponentDeck] = useState([]);
    const [opponentHand, setOpponentHand] = useState([]);

    // Board State
    // Locations: Array of 3 objects
    const [locations, setLocations] = useState([]);
    // Placed Cards: Maps location index (0-2) to array of cards
    const [playerBoard, setPlayerBoard] = useState({ 0: [], 1: [], 2: [] });
    const [opponentBoard, setOpponentBoard] = useState({ 0: [], 1: [], 2: [] });

    // Init Game
    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        // Reset State
        setTurn(1);
        setEnergy(1);
        setGameStatus('playing');
        setPlayerBoard({ 0: [], 1: [], 2: [] });
        setOpponentBoard({ 0: [], 1: [], 2: [] });
        setSelectedCardId(null);

        // Shuffle Decks
        const pDeck = [...CARDS_DB].sort(() => Math.random() - 0.5);
        const oDeck = [...CARDS_DB].sort(() => Math.random() - 0.5);

        // Deal Initial Hands (3 cards)
        setPlayerHand(pDeck.splice(0, 3));
        setPlayerDeck(pDeck);

        setOpponentHand(oDeck.splice(0, 3));
        setOpponentDeck(oDeck);

        // Setup Locations (Pick 3 random unique)
        const locs = [...LOCATIONS_DB].sort(() => Math.random() - 0.5).slice(0, 3);
        // Set initial revealed state
        locs[0].revealed = true; // First one revealed
        locs[1].revealed = false;
        locs[2].revealed = false;
        setLocations(locs);
    };

    // Turn Logic
    const handleCardSelect = (card) => {
        if (gameStatus !== 'playing') return;
        if (selectedCardId === card.id) {
            setSelectedCardId(null); // Deselect
            setErrorMessage(null);
        } else {
            if (card.cost <= energy) {
                setSelectedCardId(card.id);
                setErrorMessage(null);
            } else {
                setErrorMessage(`Not enough energy! Need ${card.cost}, have ${energy}`);
                setTimeout(() => setErrorMessage(null), 2000);
            }
        }
    };

    const handleLocationSelect = (locIndex) => {
        if (gameStatus !== 'playing' || !selectedCardId) return;

        // Validate Move
        if (playerBoard[locIndex].length >= MAX_CARDS_PER_LOCATION) return;

        // Find card
        const cardIndex = playerHand.findIndex(c => c.id === selectedCardId);
        if (cardIndex === -1) return;
        const card = playerHand[cardIndex];

        // Double check energy
        if (energy < card.cost) return;

        // Location-specific restrictions
        const location = locations[locIndex];
        if (location && location.revealed) {
            // Warrior's Isle (was l3): Only cards costing 4+ can be played here
            if (location.id === 'l3' && card.cost < 4) {
                setErrorMessage(`${location.name} requires cards costing 4 or more!`);
                setTimeout(() => setErrorMessage(null), 2000);
                setSelectedCardId(null);
                return; // Block the move
            }
        }

        // Execute Move
        const newHand = [...playerHand];
        newHand.splice(cardIndex, 1);

        setPlayerHand(newHand);
        setPlayerBoard(prev => ({
            ...prev,
            [locIndex]: [...prev[locIndex], { ...card, revealed: true }] // Player sees their own cards
        }));
        setEnergy(prev => prev - card.cost);
        setSelectedCardId(null);
    };


    const calculatePower = (boardSide, locIndex) => {
        // Safety check for empty locations (during init)
        if (!locations[locIndex]) return 0;

        let total = 0;
        const loc = locations[locIndex];
        const cards = boardSide[locIndex];

        // Calculate base power with location effects
        cards.forEach(card => {
            let power = card.power;

            // Location Effects
            if (loc.revealed && loc.id === 'l2') power += 1; // Solar City +1
            if (loc.revealed && loc.id === 'l4') power -= 1; // Sanatorium -1

            // The Sidekick: Self buff (+2 power)
            if (card.ability === 'buff_self' && card.abilityVal) {
                power += card.abilityVal;
            }

            total += power;
        });

        // The Vigilante: Buff other friendly cards (+1 power each)
        const vigilanteCount = cards.filter(c => c.ability === 'buff_loc').length;
        if (vigilanteCount > 0) {
            const otherCardsCount = cards.length - vigilanteCount;
            total += vigilanteCount * otherCardsCount; // Each Vigilante gives +1 to every other card
        }

        return Math.max(0, total);
    };



    const handleEndTurn = () => {
        if (gameStatus !== 'playing') return;

        // 1. AI Turn - STRATEGIC PLAYING
        let aiEnergy = turn; // AI has same energy logic
        let tempAiHand = [...opponentHand];
        let tempAiBoard = { ...opponentBoard };

        // Evaluate each location's status
        const evaluateLocation = (locIdx) => {
            const playerPower = calculatePower(playerBoard, locIdx);
            const aiPower = calculatePower(tempAiBoard, locIdx);
            return {
                playerPower,
                aiPower,
                diff: playerPower - aiPower, // Positive = player winning
                isFull: tempAiBoard[locIdx].length >= MAX_CARDS_PER_LOCATION
            };
        };

        // Sort cards by value (power/cost ratio), prioritize high-value cards
        tempAiHand.sort((a, b) => (b.power / b.cost) - (a.power / a.cost));

        const cardsToPlay = [];

        for (let i = 0; i < tempAiHand.length; i++) {
            const card = tempAiHand[i];
            if (card.cost > aiEnergy) continue; // Can't afford

            // Find best location for this card
            const locationScores = [0, 1, 2].map(idx => {
                const eval = evaluateLocation(idx);
                if (eval.isFull) return { idx, score: -999 }; // Can't play here

                // Score = how much it helps AI win this location
                // Prioritize: losing locations > tied > already winning
                let score = 0;
                if (eval.diff > 0) score = eval.diff + 10; // Player winning - try to contest
                else if (eval.diff === 0) score = 5; // Tied - push advantage
                else score = -eval.diff; // AI winning - maintain lead

                return { idx, score };
            });

            // Pick best location
            locationScores.sort((a, b) => b.score - a.score);
            const bestLoc = locationScores[0];

            if (bestLoc.score > -999) {
                tempAiBoard[bestLoc.idx] = [...tempAiBoard[bestLoc.idx], { ...card, revealed: false }];
                aiEnergy -= card.cost;
                cardsToPlay.push({ card, loc: bestLoc.idx });
                tempAiHand.splice(i, 1);
                i--; // Adjust index after removal
            }
        }


        setOpponentBoard(tempAiBoard);
        setOpponentHand(tempAiHand);

        // 2. Resolve Turn
        // Reveal cards? (Already revealed for player, simple logic for now)

        // 3. Reveal Location?
        const newTurn = turn + 1;
        const newLocs = [...locations];
        if (newTurn === 2) newLocs[1].revealed = true;
        if (newTurn === 3) newLocs[2].revealed = true;
        setLocations(newLocs);

        // 4. Update Turn State
        if (newTurn > MAX_TURNS) {
            setGameStatus('ended');
        } else {
            setTurn(newTurn);
            setEnergy(newTurn); // Energy = Turn Number

            // Draw Cards
            const newPlayerDeck = [...playerDeck];
            const newPlayerHand = [...playerHand]; // Use current playerHand
            if (newPlayerDeck.length > 0) newPlayerHand.push(newPlayerDeck.shift());

            const newOpponentDeck = [...opponentDeck];
            const newOpponentHand = [...tempAiHand]; // Use the AI hand after playing cards
            if (newOpponentDeck.length > 0) newOpponentHand.push(newOpponentDeck.shift());

            setPlayerDeck(newPlayerDeck);
            setPlayerHand(newPlayerHand);
            setOpponentDeck(newOpponentDeck);
            setOpponentHand(newOpponentHand);
        }
    };

    // Determine Winner
    const getWinner = () => {
        let playerWins = 0;
        let opponentWins = 0;
        let totalPowerDiff = 0; // Tiebreaker

        [0, 1, 2].forEach(i => {
            const pPower = calculatePower(playerBoard, i);
            const oPower = calculatePower(opponentBoard, i);
            if (pPower > oPower) playerWins++;
            if (oPower > pPower) opponentWins++;
            totalPowerDiff += (pPower - oPower);
        });

        if (playerWins > opponentWins) return "You Win!";
        if (opponentWins > playerWins) return "Defeat!";
        if (totalPowerDiff > 0) return "You Win! (Tiebreaker)";
        if (totalPowerDiff < 0) return "Defeat! (Tiebreaker)";
        return "Draw!";
    };

    return (
        <div className="w-full h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden flex flex-col max-w-md mx-auto shadow-2xl border-x border-slate-800">

            {/* Header / Top Bar */}
            <div className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-20 shadow-md">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold">OP</div>
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-bold uppercase">Opponent</span>
                        <div className="flex gap-1">
                            {Array.from({ length: opponentHand.length }).map((_, i) => (
                                <div key={i} className="w-2 h-3 bg-red-500 rounded-sm"></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h1 className="text-base font-black italic tracking-widest text-yellow-500 shadow-yellow-500/20 drop-shadow-sm uppercase">HERO DUEL</h1>
                    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-bold">TURN {turn}/{MAX_TURNS}</span>
                </div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col relative">

                {/* Error Message Toast */}
                {errorMessage && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg font-bold text-sm animate-in slide-in-from-top duration-300">
                        <FAIcon icon="exclamation-circle" size={16} className="inline mr-2" />
                        {errorMessage}
                    </div>
                )}

                {/* Victory/Defeat Overlay */}
                {gameStatus === 'ended' && (
                    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
                        <FAIcon icon="trophy" size={64} className="text-yellow-400 mb-4" />
                        <h2 className="text-4xl font-black text-white mb-2 tracking-tighter uppercase italic">{getWinner()}</h2>
                        <button
                            onClick={startNewGame}
                            className="mt-6 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 flex items-center gap-2"
                        >
                            <FAIcon icon="sync-alt" size={18} /> Play Again
                        </button>
                    </div>
                )}

                {/* Lanes Container */}
                <div className="flex-1 flex gap-1 p-2 items-stretch h-full overflow-hidden">
                    {locations.length === 3 ? [0, 1, 2].map(i => (
                        <Location
                            key={i}
                            index={i}
                            data={locations[i]}
                            playerCards={playerBoard[i]}
                            opponentCards={opponentBoard[i]}
                            onSelect={() => handleLocationSelect(i)}
                            activeTurn={gameStatus === 'playing'}
                            totalPowerPlayer={calculatePower(playerBoard, i)}
                            totalPowerOpponent={calculatePower(opponentBoard, i)}
                        />
                    )) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 animate-pulse">
                            Initializing Battlefield...
                        </div>
                    )}
                </div>
            </div>

            {/* Player Controls Area */}
            <div className="h-48 bg-slate-900 border-t border-slate-800 flex flex-col relative z-20">

                {/* Hand */}
                <div className="flex-1 flex items-center justify-center gap-2 px-2 overflow-x-auto overflow-y-visible py-2 no-scrollbar">
                    {playerHand.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            onClick={handleCardSelect}
                            isSelected={selectedCardId === card.id}
                        />
                    ))}
                    {playerHand.length === 0 && (
                        <div className="text-slate-600 text-sm italic">Out of cards!</div>
                    )}
                </div>

                {/* Action Bar */}
                <div className="h-14 bg-slate-950 flex items-center justify-between px-4 border-t border-slate-800">
                    {/* Energy Meter */}
                    <div className="flex items-center gap-1">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-2 border-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]">
                            <span className="font-bold text-lg">{energy}</span>
                        </div>
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider ml-1">Energy</span>
                    </div>

                    {/* End Turn Button */}
                    <button
                        onClick={handleEndTurn}
                        disabled={gameStatus !== 'playing'}
                        className={`
                    px-6 py-2 rounded-full font-bold uppercase tracking-wider transition-all
                    ${gameStatus === 'playing'
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg hover:shadow-orange-500/20 hover:scale-105 active:scale-95'
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                `}
                    >
                        {gameStatus === 'playing' ? 'End Turn' : 'Game Over'}
                    </button>
                </div>
            </div>

        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<JusticeDuel />);
