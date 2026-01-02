// ============================================================================
// XMR EXCHANGE COMPARATOR
// ============================================================================

// IDs d'affiliation - Tu peux personnaliser ces IDs après inscription
// Pour ChangeNow : va sur changenow.io/affiliate → Referral link → copie ton ID
// Pour StealthEX : va sur stealthex.io/affiliate → copie ton referral code
// Pour Exolix : récupère ton referral ID depuis exolix.com/affiliate-program
const AFFILIATE_IDS = {
    changenow: '3b25776136a4ef',  // ✅ Ton ID ChangeNow configuré !
    stealthex: 'IzL7syI1vy',  // ✅ Ton ID StealthEX configuré !
    exolix: '4C9EF425CD02A5386531CC4C199F64DC',  // ✅ Ton ID Exolix configuré !
    godex: 'Kf4tZwtpYEOliAB2',  // ✅ Ton ID Godex configuré !
    letsexchange: 'uNYqUmSs0u2CXccL'  // ✅ Ton ID LetsExchange configuré !
};

// État global
let currentRates = [];

// ============================================================================
// ANCIENNES FONCTIONS API (maintenant gérées par Netlify Function)
// ============================================================================
// Les appels API directs ont été déplacés vers /.netlify/functions/get-rates
// pour sécuriser les clés API (non exposées côté client)

// FixedFloat removed - requires user data storage (IP, user-agent) for 1 year

// Fonctions API supprimées - Tout est maintenant géré par la Netlify Function
// pour sécuriser les clés API côté serveur

// ============================================================================
// RÉCUPÉRER TOUS LES TAUX (via Netlify Function pour éviter CORS)
// ============================================================================

async function getAllRates(from, to, amount) {
    // 🔒 SÉCURISÉ : Utilise la fonction Netlify pour cacher les clés API
    try {
        const response = await fetch(`/.netlify/functions/get-rates?from=${from}&to=${to}&amount=${amount}`);

        if (!response.ok) {
            throw new Error('Netlify function error');
        }

        const data = await response.json();
        return data.rates || [];
    } catch (error) {
        console.error('Error fetching rates:', error);
        return [];
    }
}

// ============================================================================
// RÉCUPÉRER LES PRIX EN EUR (temps réel)
// ============================================================================

// Mapping des symboles crypto vers IDs CoinGecko
const COINGECKO_IDS = {
    'xmr': 'monero',
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'usdc': 'usd-coin',
    'ltc': 'litecoin',
    'eur': 'eur'
};

async function getCryptoPrice(currency) {
    // Si c'est EUR, retourner 1
    if (currency.toLowerCase() === 'eur') {
        return 1;
    }

    const coinId = COINGECKO_IDS[currency.toLowerCase()];
    if (!coinId) {
        console.warn(`Prix non disponible pour ${currency}, utilisation fallback`);
        return 1;
    }

    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=eur`);
        const data = await response.json();
        return data[coinId]?.eur || 1;
    } catch (error) {
        console.error('Erreur récupération prix:', error);
        // Fallback sur prix approximatif si l'API échoue
        const fallbackPrices = { 'xmr': 180, 'btc': 85000, 'eth': 3200, 'usdc': 0.95, 'ltc': 100 };
        return fallbackPrices[currency.toLowerCase()] || 1;
    }
}

// ============================================================================
// AFFICHAGE DES RÉSULTATS
// ============================================================================

async function displayResults(rates, fromCurrency, toCurrency) {
    const grid = document.getElementById('exchanges-grid');
    grid.innerHTML = '';

    if (rates.length === 0) {
        showError('Aucun taux disponible pour le moment. Veuillez réessayer.');
        return;
    }

    // Calculer les économies vs pire taux
    const bestRate = rates[0];
    const worstRate = rates[rates.length - 1];
    const savings = bestRate.estimatedAmount - worstRate.estimatedAmount;

    // Récupérer le prix réel en EUR
    const toCurrencyPriceEUR = await getCryptoPrice(toCurrency);
    const savingsEUR = savings * toCurrencyPriceEUR;

    rates.forEach((rate, index) => {
        const isBest = index === 0;
        const isWorst = index === rates.length - 1;

        const card = document.createElement('div');
        card.className = `exchange-card ${isBest ? 'best' : ''}`;

        // Calculer la différence vs meilleur taux (en montant et en EUR)
        const diffVsBest = rate.estimatedAmount - bestRate.estimatedAmount;
        const diffVsBestEUR = diffVsBest * toCurrencyPriceEUR;
        const diffPercent = ((diffVsBest / bestRate.estimatedAmount) * 100).toFixed(2);

        card.innerHTML = `
            <div class="exchange-logo">
                ${getExchangeLogo(rate.exchange)}
            </div>

            <div class="exchange-info">
                <div class="exchange-name">
                    ${rate.exchange}
                    ${isBest ? '<span class="best-badge">✅ Meilleur taux</span>' : ''}
                    ${!isBest && Math.abs(diffVsBestEUR) > 0.01 ? '<span style="color: #ff9966; margin-left: 10px; font-size: 13px;">−' + Math.abs(diffVsBestEUR).toFixed(2) + '€ vs meilleur</span>' : ''}
                </div>
                <div class="exchange-badges">
                    ${getExchangeBadges(rate.exchange)}
                </div>
                <div class="exchange-rate">
                    1 ${fromCurrency.toUpperCase()} = ${rate.rate.toFixed(6)} ${toCurrency.toUpperCase()}
                </div>
            </div>

            <div class="exchange-amount">
                <div class="amount-value">${rate.estimatedAmount.toFixed(6)}</div>
                <div class="amount-currency">${toCurrency.toUpperCase()}</div>
            </div>

            <button class="exchange-btn" onclick="window.open('${rate.url}', '_blank')">
                Échanger →
            </button>
        `;

        grid.appendChild(card);
    });

    // Mettre à jour le champ "Vous recevez" avec le meilleur taux
    if (rates.length > 0) {
        document.getElementById('to-amount').value = rates[0].estimatedAmount.toFixed(6);
    }
}

function getExchangeLogo(exchangeName) {
    const logos = {
        'ChangeNow': 'CN',
        'StealthEX': 'SX',
        'Exolix': 'EX',
        'Godex': 'GD',
        'LetsExchange': 'LE',
        'SimpleSwap': 'SS'
    };
    return logos[exchangeName] || exchangeName.substring(0, 2);
}

function getExchangeBadges(exchangeName) {
    const badges = {
        'ChangeNow': '⭐ Depuis 2017 · ⚡ Rapide · 💎 Grande marque',
        'StealthEX': '🔐 Privacy-focused · ⭐ Depuis 2018 · 🏆 Communauté XMR',
        'Exolix': '💰 Excellent rapport · ⭐ Depuis 2018 · 🔒 Zero logs',
        'Godex': '🚀 Sans limites · ⭐ Depuis 2017 · 🔐 Ultra no-KYC',
        'LetsExchange': '✅ Support réactif · ⭐ Depuis 2020 · 💳 Large choix'
    };

    const badgeText = badges[exchangeName] || '';
    return badgeText ? `<span class="exchange-badge-line">${badgeText}</span>` : '';
}

// Temps estimés pour chaque exchange (en minutes)
function getExchangeETA(exchangeName) {
    const etas = {
        'ChangeNow': '5-15 min',
        'StealthEX': '5-20 min',
        'Exolix': '5-15 min',
        'Godex': '10-30 min',
        'LetsExchange': '5-20 min',
        'SimpleSwap': '10-20 min'
    };
    return etas[exchangeName] || '10-30 min';
}

// ============================================================================
// GESTION DES ERREURS
// ============================================================================

function showError(message) {
    const errorDiv = document.getElementById('error');
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = message;
    errorDiv.classList.add('active');

    setTimeout(() => {
        errorDiv.classList.remove('active');
    }, 5000);
}

function hideError() {
    document.getElementById('error').classList.remove('active');
}

// ============================================================================
// GESTION DU FORMULAIRE
// ============================================================================

async function compareRates() {
    const fromCurrency = document.getElementById('from-currency').value;
    const toCurrency = document.getElementById('to-currency').value;
    const amount = parseFloat(document.getElementById('from-amount').value);

    // Validation
    if (!amount || amount <= 0) {
        showError('Veuillez entrer un montant valide');
        return;
    }

    if (fromCurrency === toCurrency) {
        showError('Veuillez sélectionner des devises différentes');
        return;
    }

    // UI
    hideError();
    document.getElementById('loading').classList.add('active');
    document.getElementById('results').classList.remove('active');
    document.getElementById('compare-btn').disabled = true;

    try {
        // Récupérer les taux
        const rates = await getAllRates(fromCurrency, toCurrency, amount);
        currentRates = rates;

        // Afficher les résultats
        displayResults(rates, fromCurrency, toCurrency);

        // Afficher la section résultats
        document.getElementById('results').classList.add('active');

    } catch (error) {
        console.error('Error:', error);
        showError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
        document.getElementById('loading').classList.remove('active');
        document.getElementById('compare-btn').disabled = false;
    }
}

// ============================================================================
// ÉVÉNEMENTS
// ============================================================================

document.getElementById('compare-btn').addEventListener('click', compareRates);

document.getElementById('refresh-btn').addEventListener('click', compareRates);

// Comparer au changement de devise
document.getElementById('from-currency').addEventListener('change', () => {
    if (currentRates.length > 0) {
        compareRates();
    }
});

document.getElementById('to-currency').addEventListener('change', () => {
    if (currentRates.length > 0) {
        compareRates();
    }
});

// Entrée : permettre d'appuyer sur Enter
document.getElementById('from-amount').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        compareRates();
    }
});

// ============================================================================
// INITIALISATION
// ============================================================================

// Comparer automatiquement au chargement (optionnel)
// compareRates();

console.log('🔍 Le Bon XMR loaded');
