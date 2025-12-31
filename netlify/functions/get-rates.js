// Netlify Function - Proxy pour contourner CORS
const crypto = require('crypto');

exports.handler = async (event, context) => {
    // Configuration CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle OPTIONS (preflight)
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const { from, to, amount } = event.queryStringParameters;

        if (!from || !to || !amount) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing parameters' })
            };
        }

        // Clés API et IDs d'affiliation
        const CHANGENOW_KEY = '16b13fe15b7c2a05ac1104aba4de256361d8e2b643f15d724bcc07538cd8dccd';
        const CHANGENOW_AFFILIATE = '3b25776136a4ef';
        const STEALTHEX_KEY = 'b66e38ef-2b8e-4df3-bc2a-13bd1c44c105';
        const STEALTHEX_AFFILIATE = 'IzL7syI1vy';
        // FixedFloat removed - requires user data storage (IP, user-agent) for 1 year

        const results = await Promise.allSettled([
            // ChangeNow
            fetch(`https://api.changenow.io/v1/exchange-amount/${amount}/${from}_${to}/?api_key=${CHANGENOW_KEY}`)
                .then(async res => {
                    if (!res.ok) return null;
                    const data = await res.json();
                    return {
                        exchange: 'ChangeNow',
                        estimatedAmount: parseFloat(data.estimatedAmount),
                        rate: parseFloat(data.estimatedAmount) / parseFloat(amount),
                        url: `https://changenow.io/exchange?from=${from}&to=${to}&amount=${amount}&ref_id=${CHANGENOW_AFFILIATE}`
                    };
                })
                .catch(() => null),

            // StealthEX
            fetch(`https://api.stealthex.io/api/v2/estimate/${from}/${to}?amount=${amount}&api_key=${STEALTHEX_KEY}&fixed=false`)
                .then(async res => {
                    if (!res.ok) return null;
                    const data = await res.json();
                    return {
                        exchange: 'StealthEX',
                        estimatedAmount: parseFloat(data.estimated_amount),
                        rate: parseFloat(data.estimated_amount) / parseFloat(amount),
                        url: `https://stealthex.io/?ref=${STEALTHEX_AFFILIATE}`
                    };
                })
                .catch(() => null)
        ]);

        const rates = results
            .filter(r => r.status === 'fulfilled' && r.value !== null)
            .map(r => r.value)
            .sort((a, b) => b.estimatedAmount - a.estimatedAmount);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ rates })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
