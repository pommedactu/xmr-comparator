// Script de collecte automatique des taux BTC → XMR
// Exécuté toutes les heures par GitHub Actions

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const AMOUNT = 1; // Montant de référence : 1 BTC (pour correspondre au comparateur)
const FROM = 'btc';
const TO = 'xmr';

// Clés API
const CHANGENOW_KEY = '16b13fe15b7c2a05ac1104aba4de256361d8e2b643f15d724bcc07538cd8dccd';
const STEALTHEX_KEY = 'b66e38ef-2b8e-4df3-bc2a-13bd1c44c105';
const EXOLIX_BEARER = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxlYm9ueG1yQGdtYWlsLmNvbSIsInN1YiI6NDc1NDMsImlhdCI6MTc2NzE4MTIxNSwiZXhwIjoxOTI0OTY5MjE1fQ.LMvovfoZmca3yAgZ_8iBV9KD9AXqt-2WQhpPHf_ss24';
const LETSEXCHANGE_BEARER = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImRhdGEiOnsiaWQiOjE0NjcsImhhc2giOiJleUpwZGlJNkluVjBkemsxWEM4M1VqZG9aRzVzYlVKb1NGUkZUa3RuUFQwaUxDSjJZV3gxWlNJNklsSlFObHd2UkVWSlpXMW5hM1Z1WW5KallXWkNZMlJ2V1hCSFNqZDNSa2xqTmxNNU5WaHVUVVFyTUU5SmJWa3dVbEpVVVVWSFVFVktTbTVLWTJWQlNscG1jRk5PWTNKS2EzcE1lVTFEUTBaUGEyOHlSVGxYTmxkU1dtNHpVaXRXTTBjME1IVk1VVmt6Y1ZVd1p6MGlMQ0p0WVdNaU9pSXhNV1k1TVdFeE0yRmxZV0prWXpVeE1XVmpaR0poTVdZd09XVmxZV1kxTnpJMlpUTXhPR1ptTnpoak56a3hOMlF6WXpnMU1qTTRPR0l5TVdRNFlXSTFJbjA9In0sImlzcyI6Imh0dHBzOlwvXC9hcGkubGV0c2V4Y2hhbmdlLmlvXC9hcGlcL3YxXC9hcGkta2V5IiwiaWF0IjoxNzY3MTgzOTAzLCJleHAiOjIwODg1OTE5MDMsIm5iZiI6MTc2NzE4MzkwMywianRpIjoia01OaUlSRkNxcGY2M29TdyJ9.zyJlour8j8m5xPlgVCKGo41L1xRORoHvDi8Ys-T34SI';
const SIMPLESWAP_KEY = 'eb26a789-26d0-4f50-bc26-03c457ed4547';

// Fonction pour récupérer les taux de tous les exchanges
async function collectRates() {
    console.log('🔍 Collecte des taux en cours...');

    const timestamp = new Date().toISOString();
    const rates = {};

    try {
        // ChangeNow
        const cn = await fetch(`https://api.changenow.io/v1/exchange-amount/${AMOUNT}/${FROM}_${TO}/?api_key=${CHANGENOW_KEY}`);
        if (cn.ok) {
            const data = await cn.json();
            rates.changenow = parseFloat(data.estimatedAmount) / AMOUNT;
            console.log('✅ ChangeNow:', rates.changenow);
        }
    } catch (e) {
        console.log('❌ ChangeNow error:', e.message);
    }

    try {
        // Exolix
        const ex = await fetch(`https://exolix.com/api/v2/rate?coinFrom=${FROM.toUpperCase()}&coinTo=${TO.toUpperCase()}&amount=${AMOUNT}&rateType=float`, {
            headers: { 'Authorization': EXOLIX_BEARER }
        });
        if (ex.ok) {
            const data = await ex.json();
            rates.exolix = parseFloat(data.rate);
            console.log('✅ Exolix:', rates.exolix);
        }
    } catch (e) {
        console.log('❌ Exolix error:', e.message);
    }

    try {
        // Godex
        const gd = await fetch('https://api.godex.io/api/v1/info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ from: FROM.toUpperCase(), to: TO.toUpperCase(), amount: AMOUNT.toString() })
        });
        if (gd.ok) {
            const data = await gd.json();
            rates.godex = parseFloat(data.rate);
            console.log('✅ Godex:', rates.godex);
        }
    } catch (e) {
        console.log('❌ Godex error:', e.message);
    }

    try {
        // LetsExchange
        const le = await fetch('https://api.letsexchange.io/api/v1/info', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': LETSEXCHANGE_BEARER
            },
            body: JSON.stringify({ from: FROM.toUpperCase(), to: TO.toUpperCase(), amount: AMOUNT.toString() })
        });
        if (le.ok) {
            const data = await le.json();
            rates.letsexchange = parseFloat(data.rate);
            console.log('✅ LetsExchange:', rates.letsexchange);
        }
    } catch (e) {
        console.log('❌ LetsExchange error:', e.message);
    }

    try {
        // StealthEX
        const sx = await fetch(`https://api.stealthex.io/api/v2/estimate/${FROM}/${TO}?amount=${AMOUNT}&api_key=${STEALTHEX_KEY}&fixed=false`);
        if (sx.ok) {
            const data = await sx.json();
            rates.stealthex = parseFloat(data.estimated_amount) / AMOUNT;
            console.log('✅ StealthEX:', rates.stealthex);
        }
    } catch (e) {
        console.log('❌ StealthEX error:', e.message);
    }

    try {
        // SimpleSwap
        const ss = await fetch(`https://api.simpleswap.io/v3/estimates?tickerFrom=${FROM}&tickerTo=${TO}&networkFrom=${FROM}&networkTo=${TO}&amount=${AMOUNT}&fixed=false`, {
            headers: {
                'Accept': 'application/json',
                'X-API-KEY': SIMPLESWAP_KEY
            }
        });
        if (ss.ok) {
            const data = await ss.json();
            rates.simpleswap = parseFloat(data.result.estimatedAmount) / AMOUNT;
            console.log('✅ SimpleSwap:', rates.simpleswap);
        }
    } catch (e) {
        console.log('❌ SimpleSwap error:', e.message);
    }

    return {
        timestamp,
        rates
    };
}

// Sauvegarder dans le fichier JSON
async function saveRates() {
    const historyPath = path.join(__dirname, '../data/rate-history.json');

    // Lire l'historique existant
    let history = { lastUpdated: null, rates: [] };
    if (fs.existsSync(historyPath)) {
        const content = fs.readFileSync(historyPath, 'utf8');
        history = JSON.parse(content);
    }

    // Collecter les nouveaux taux
    const newData = await collectRates();

    // Ajouter au début du tableau
    history.rates.unshift(newData);
    history.lastUpdated = newData.timestamp;

    // Garder seulement les 168 dernières heures (7 jours)
    if (history.rates.length > 168) {
        history.rates = history.rates.slice(0, 168);
    }

    // Sauvegarder
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));

    console.log('💾 Données sauvegardées ! Total:', history.rates.length, 'points');
}

// Exécuter
saveRates().catch(err => {
    console.error('❌ Erreur:', err);
    process.exit(1);
});
