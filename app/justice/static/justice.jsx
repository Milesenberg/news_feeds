const { useState, useEffect, useMemo } = React;

// Font Awesome Icon Helper Component
const FAIcon = ({ icon, size = 16, className = "" }) => (
    <i className={`fas fa-${icon} ${className}`} style={{ fontSize: `${size}px` }}></i>
);

// --- Game Constants & Data ---

const MAX_TURNS = 6;
const MAX_CARDS_PER_LOCATION = 4;

const CARDS_DB = [
    { id: 'c1', name: 'The Flash', cost: 1, power: 2, color: 'bg-red-600', desc: 'Fast start.', image: '/justice/static/images/flash_portrait_card_1764961461610.png' },
    { id: 'c2', name: 'Robin', cost: 1, power: 1, color: 'bg-green-600', ability: 'buff_self', abilityVal: 2, desc: 'On Reveal: +2 Power.', image: '/justice/static/images/robin_portrait_card_1764961477327.png' },
    { id: 'c3', name: 'Harley Quinn', cost: 2, power: 3, color: 'bg-pink-600', desc: 'Chaos agent.', image: '/justice/static/images/harley_quinn_portrait_1764961494644.png' },
    { id: 'c13', name: 'Catwoman', cost: 2, power: 3, color: 'bg-purple-800', desc: 'Feline thief.', image: '/justice/static/images/catwoman_portrait_card_1764965955979.png' },
    { id: 'c4', name: 'Cyborg', cost: 2, power: 4, color: 'bg-gray-500', desc: 'Solid tech defence.', image: '/justice/static/images/cyborg_portrait_card_1764961510189.png' },
    { id: 'c5', name: 'Batman', cost: 3, power: 4, color: 'bg-slate-800', ability: 'buff_loc', abilityVal: 1, desc: 'On Reveal: +1 Power to allies here.', image: '/justice/static/images/batman_portrait_card_1764961208368.png' },
    { id: 'c6', name: 'Green Lantern', cost: 3, power: 5, color: 'bg-green-500', desc: 'Willpower construct.', image: '/justice/static/images/green_lantern_portrait_1764961524844.png' },
    { id: 'c7', name: 'Aquaman', cost: 4, power: 6, color: 'bg-orange-500', desc: 'King of Atlantis.', image: '/justice/static/images/aquaman_portrait_card_1764961541671.png' },
    { id: 'c8', name: 'Wonder Woman', cost: 4, power: 7, color: 'bg-red-700', desc: 'Amazonian strength.', image: '/justice/static/images/wonder_woman_portrait_v2_1764961408971.png' },
    { id: 'c9', name: 'The Joker', cost: 5, power: 3, color: 'bg-purple-600', ability: 'debuff_opp', abilityVal: -1, desc: 'On Reveal: -1 Power to enemies here.', image: '/justice/static/images/joker_portrait_card_1764961557070.png' },
    { id: 'c10', name: 'Superman', cost: 6, power: 12, color: 'bg-blue-600', desc: 'Man of Steel.', image: '/justice/static/images/superman_portrait_card_1764961223519.png' },
    { id: 'c11', name: 'Lex Luthor', cost: 5, power: 8, color: 'bg-green-800', desc: 'Genius intellect.', image: '/justice/static/images/lex_luthor_portrait_1764961571316.png' },
    { id: 'c12', name: 'Darkseid', cost: 6, power: 11, color: 'bg-gray-900', ability: 'destroy', desc: 'On Reveal: Sacrifice ally for +3 Power.', image: '/justice/static/images/darkseid_portrait_card_1764961586925.png' },
];

const LOCATIONS_DB = [
    { id: 'l1', name: 'Gotham City', color: 'from-slate-800 to-slate-900', effect: 'No special effect.', bgImage: '/justice/static/images/gotham_city_background_1764963558076.png' },
    { id: 'l2', name: 'Metropolis', color: 'from-blue-400 to-blue-600', effect: 'Cards here get +1 Power.', bgImage: '/justice/static/images/metropolis_background_1764963572865.png' },
    { id: 'l3', name: 'Themyscira', color: 'from-yellow-600 to-red-600', effect: 'Only cards costing 4+ can be played here.', bgImage: '/justice/static/images/themyscira_background_1764963587114.png' },
    { id: 'l4', name: 'Arkham Asylum', color: 'from-green-900 to-slate-900', effect: 'Cards here have -1 Power.', bgImage: '/justice/static/images/arkham_asylum_background_1764963601763.png' },
    { id: 'l5', name: 'Fortress of Solitude', color: 'from-cyan-100 to-blue-200', effect: 'Turn 5: Cards here swap sides (Not implemented).', bgImage: '/justice/static/images/fortress_solitude_background_1764963618102.png' },
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

const Location = ({ data, index, playerCards, opponentCards, onSelect, activeTurn, totalPowerPlayer, totalPowerOpponent }) => {
    const isWinning = totalPowerPlayer > totalPowerOpponent;
    const isLosing = totalPowerPlayer < totalPowerOpponent;
    const isTied = totalPowerPlayer === totalPowerOpponent;

    // Calculate specific status style
    let borderClass = "border-slate-600";
    let bgStatus = "bg-slate-700";

    if (totalPowerPlayer > totalPowerOpponent) {
        borderClass = "border-yellow-500";
        bgStatus = "bg-yellow-600";
    } else if (totalPowerPlayer < totalPowerOpponent) {
        borderClass = "border-red-500";
        bgStatus = "bg-red-600";
    }

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
                {data.revealed && (
                    <p className="text-[9px] text-gray-300 text-center px-2 leading-none mt-1 max-w-[120px]">{data.effect}</p>
                )}
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
                <div className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center border-2 shadow-md ${bgStatus} border-white`}>
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
        // 1. Setup Decks
        const pDeck = getRandomDeck();
        const oDeck = getRandomDeck();

        // 2. Draw initial hands (3 cards)
        const pHand = pDeck.splice(0, 3);
        const oHand = oDeck.splice(0, 3);

        // 3. Setup Locations (Pick 3 random unique)
        const allLocs = shuffle([...LOCATIONS_DB]);
        const gameLocs = allLocs.slice(0, 3).map((l, i) => ({
            ...l,
            revealed: i === 0 // Reveal first location immediately, others later (Snap style: 1, 2, 3)
        }));

        setPlayerDeck(pDeck);
        setPlayerHand(pHand);
        setOpponentDeck(oDeck);
        setOpponentHand(oHand);
        setLocations(gameLocs);
        setPlayerBoard({ 0: [], 1: [], 2: [] });
        setOpponentBoard({ 0: [], 1: [], 2: [] });
        setTurn(1);
        setEnergy(1);
        setGameStatus('playing');
        setSelectedCardId(null);
    };

    // Turn Logic
    const handleCardSelect = (card) => {
        if (gameStatus !== 'playing') return;
        if (selectedCardId === card.id) {
            setSelectedCardId(null); // Deselect
        } else {
            if (card.cost <= energy) {
                setSelectedCardId(card.id);
            } else {
                // Maybe show error toast "Not enough energy"
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
            // Themyscira: Only cards costing 4+ can be played here
            if (location.id === 'l3' && card.cost < 4) {
                console.warn(`${card.name} (cost ${card.cost}) cannot be played at ${location.name} - requires cost 4+`);
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
            if (loc.revealed && loc.id === 'l2') power += 1; // Metropolis +1
            if (loc.revealed && loc.id === 'l4') power -= 1; // Arkham -1

            // Robin: Self buff (+2 power)
            if (card.ability === 'buff_self' && card.abilityVal) {
                power += card.abilityVal;
            }

            total += power;
        });

        // Batman: Buff other friendly cards (+1 power each)
        const batmanCount = cards.filter(c => c.ability === 'buff_loc').length;
        if (batmanCount > 0) {
            const otherCardsCount = cards.length - batmanCount;
            total += batmanCount * otherCardsCount; // Each Batman gives +1 to every other card
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

        // 2. Reveal AI Cards
        const revealedBoard = { ...tempAiBoard };
        [0, 1, 2].forEach(idx => {
            revealedBoard[idx] = revealedBoard[idx].map(c => ({ ...c, revealed: true }));
        });
        setOpponentBoard(revealedBoard);

        // 3. Reveal Locations Logic
        const newLocs = [...locations];
        if (turn === 1 && newLocs[1]) newLocs[1].revealed = true;
        if (turn === 2 && newLocs[2]) newLocs[2].revealed = true;
        setLocations(newLocs);

        // 4. Check End Game
        if (turn >= MAX_TURNS) {
            setGameStatus('ended');
            return;
        }

        // 5. Next Turn Setup
        const nextTurn = turn + 1;
        setTurn(nextTurn);
        setEnergy(nextTurn); // Energy refills to Turn #

        // Draw Card Player
        if (playerDeck.length > 0) {
            const newCard = playerDeck[0];
            setPlayerHand(prev => [...prev, newCard]);
            setPlayerDeck(prev => prev.slice(1));
        }
        // Draw Card Opponent
        if (opponentDeck.length > 0) {
            const newCard = opponentDeck[0];
            setOpponentHand(prev => [...prev, newCard]);
            setOpponentDeck(prev => prev.slice(1));
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
                <div className="text-center">
                    <h1 className="text-lg font-black tracking-wider text-yellow-500 italic uppercase">Justice Duel</h1>
                    <div className="text-[10px] text-slate-400 font-bold">TURN {turn}/{MAX_TURNS}</div>
                </div>
                <div className="w-8"></div> {/* Spacer */}
            </div>

            {/* Main Game Area */}
            <div className="flex-1 flex flex-col relative">

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
