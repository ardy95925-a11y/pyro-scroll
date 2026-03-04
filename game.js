// Game State
const gameState = {
    points: 0,
    baseClickValue: 1,
    totalClicksEver: 0,
    upgrades: {
        doubleClick: 0,
        tripleClick: 0,
        masterStrike: 0,
        resonance: 0,
        ascension: 0,
        void: 0,
        eternity: 0,
        consciousness: 0
    }
};

// DOM Elements
const clickButton = document.getElementById('clickButton');
const pointsDisplay = document.getElementById('pointsDisplay');
const skillTreeBtn = document.getElementById('skillTreeBtn');
const resetBtn = document.getElementById('resetBtn');
const skillTreeModal = document.getElementById('skillTreeModal');
const closeSkillTree = document.getElementById('closeSkillTree');

// Initialize
function init() {
    loadGameState();
    updateDisplay();
    attachEventListeners();
}

// Event Listeners
function attachEventListeners() {
    clickButton.addEventListener('click', handleClick);
    skillTreeBtn.addEventListener('click', openSkillTree);
    closeSkillTree.addEventListener('click', closeSkillTreeModal);
    resetBtn.addEventListener('click', resetGame);
    skillTreeModal.addEventListener('click', closeOnBackdropClick);
}

// Handle click on main button
function handleClick(e) {
    const clickValue = calculateClickValue();
    gameState.points += clickValue;
    gameState.totalClicksEver += 1;

    // Animate button
    clickButton.classList.add('pulse');
    setTimeout(() => clickButton.classList.remove('pulse'), 600);

    // Floating points
    createFloatingPoints(e, clickValue);

    // Update display
    updateDisplay();

    // Auto-save
    saveGameState();
}

// Calculate click value with upgrades
function calculateClickValue() {
    let value = gameState.baseClickValue;

    if (gameState.upgrades.doubleClick > 0) {
        value *= (1 + gameState.upgrades.doubleClick * 1);
    }

    if (gameState.upgrades.tripleClick > 0) {
        value *= (1 + gameState.upgrades.tripleClick * 1.5);
    }

    if (gameState.upgrades.masterStrike > 0) {
        value *= (1 + gameState.upgrades.masterStrike * 2);
    }

    if (gameState.upgrades.resonance > 0) {
        value *= Math.pow(1.3, gameState.upgrades.resonance);
    }

    if (gameState.upgrades.ascension > 0) {
        value *= Math.pow(1.5, gameState.upgrades.ascension);
    }

    if (gameState.upgrades.void > 0) {
        value *= Math.pow(2, gameState.upgrades.void);
    }

    if (gameState.upgrades.eternity > 0) {
        value *= Math.pow(3, gameState.upgrades.eternity);
    }

    if (gameState.upgrades.consciousness > 0) {
        value += gameState.totalClicksEver * gameState.upgrades.consciousness * 0.1;
    }

    return Math.floor(value);
}

// Create floating points animation
function createFloatingPoints(e, value) {
    const floatingPoint = document.createElement('div');
    floatingPoint.classList.add('floating-points');
    floatingPoint.textContent = '+' + value.toLocaleString();

    const rect = clickButton.getBoundingClientRect();
    floatingPoint.style.left = rect.left + rect.width / 2 + 'px';
    floatingPoint.style.top = rect.top + 'px';

    document.body.appendChild(floatingPoint);

    // Animate and remove
    let opacity = 1;
    let posY = 0;
    const interval = setInterval(() => {
        posY -= 2;
        opacity -= 0.02;
        floatingPoint.style.transform = `translateY(${posY}px) translateX(-50%)`;
        floatingPoint.style.opacity = opacity;

        if (opacity <= 0) {
            clearInterval(interval);
            floatingPoint.remove();
        }
    }, 16);
}

// Update display
function updateDisplay() {
    pointsDisplay.textContent = gameState.points.toLocaleString();
}

// Skill Tree Modal
function openSkillTree() {
    skillTreeModal.classList.add('active');
    renderSkillTree();
}

function closeSkillTreeModal() {
    const book = document.querySelector('.book');
    book.classList.add('book-close');
    setTimeout(() => {
        skillTreeModal.classList.remove('active');
        book.classList.remove('book-close');
    }, 800);
}

function closeOnBackdropClick(e) {
    if (e.target === skillTreeModal) {
        closeSkillTreeModal();
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        gameState.points = 0;
        gameState.totalClicksEver = 0;
        for (let key in gameState.upgrades) {
            gameState.upgrades[key] = 0;
        }
        updateDisplay();
        saveGameState();
    }
}

// LocalStorage
function saveGameState() {
    localStorage.setItem('ascendGameState', JSON.stringify(gameState));
}

function loadGameState() {
    const saved = localStorage.getItem('ascendGameState');
    if (saved) {
        const loaded = JSON.parse(saved);
        Object.assign(gameState, loaded);
    }
}

// Initialize game on load
window.addEventListener('DOMContentLoaded', init);
