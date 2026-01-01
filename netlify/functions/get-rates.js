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
        const EXOLIX_BEARER = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxlYm9ueG1yQGdtYWlsLmNvbSIsInN1YiI6NDc1NDMsImlhdCI6MTc2NzE4MTIxNSwiZXhwIjoxOTI0OTY5MjE1fQ.LMvovfoZmca3yAgZ_8iBV9KD9AXqt-2WQhpPHf_ss24';
        const EXOLIX_AFFILIATE = '4C9EF425CD02A5386531CC4C199F64DC';
        const GODEX_AFFILIATE = 'Kf4tZwtpYEOliAB2';
        const LETSEXCHANGE_BEARER = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0b2tlbiIsImRhdGEiOnsiaWQiOjE0NjcsImhhc2giOiJleUpwZGlJNkluVjBkemsxWEM4M1VqZG9aRzVzYlVKb1NGUkZUa3RuUFQwaUxDSjJZV3gxWlNJNklsSlFObHd2UkVWSlpXMW5hM1Z1WW5KallXWkNZMlJ2V1hCSFNqZDNSa2xqTmxNNU5WaHVUVVFyTUU5SmJWa3dVbEpVVVVWSFVFVktTbTVLWTJWQlNscG1jRk5PWTNKS2EzcE1lVTFEUTBaUGEyOHlSVGxYTmxkU1dtNHpVaXRXTTBjME1IVk1VVmt6Y1ZVd1p6MGlMQ0p0WVdNaU9pSXhNV1k1TVdFeE0yRmxZV0prWXpVeE1XVmpaR0poTVdZd09XVmxZV1kxTnpJMlpUTXhPR1ptTnpoak56a3hOMlF6WXpnMU1qTTRPR0l5TVdRNFlXSTFJbjA9In0sImlzcyI6Imh0dHBzOlwvXC9hcGkubGV0c2V4Y2hhbmdlLmlvXC9hcGlcL3YxXC9hcGkta2V5IiwiaWF0IjoxNzY3MTgzOTAzLCJleHAiOjIwODg1OTE5MDMsIm5iZiI6MTc2NzE4MzkwMywianRpIjoia01OaUlSRkNxcGY2M29TdyJ9.zyJlour8j8m5xPlgVCKGo41L1xRORoHvDi8Ys-T34SI';
        const LETSEXCHANGE_AFFILIATE = 'uNYqUmSs0u2CXccL';
        // SimpleSwap removed - identical rates to StealthEX (uses same backend)
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
                .catch(() => null),

            // Exolix
            fetch(`https://exolix.com/api/v2/rate?coinFrom=${from.toUpperCase()}&coinTo=${to.toUpperCase()}&amount=${amount}&rateType=float`, {
                headers: { 'Authorization': EXOLIX_BEARER }
            })
                .then(async res => {
                    if (!res.ok) return null;
                    const data = await res.json();
                    return {
                        exchange: 'Exolix',
                        estimatedAmount: parseFloat(data.toAmount),
                        rate: parseFloat(data.rate),
                        url: `https://exolix.com/?ref=${EXOLIX_AFFILIATE}`
                    };
                })
                .catch(() => null),

            // Godex
            fetch('https://api.godex.io/api/v1/info', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ from: from.toUpperCase(), to: to.toUpperCase(), amount: amount.toString() })
            })
                .then(async res => {
                    if (!res.ok) return null;
                    const data = await res.json();
                    return {
                        exchange: 'Godex',
                        estimatedAmount: parseFloat(data.amount),
                        rate: parseFloat(data.rate),
                        url: `https://godex.io/?aff_id=${GODEX_AFFILIATE}&utm_source=affiliate&utm_medium=le_bon_xmr&utm_campaign=${GODEX_AFFILIATE}`
                    };
                })
                .catch(() => null),

            // LetsExchange
            fetch('https://api.letsexchange.io/api/v1/info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': LETSEXCHANGE_BEARER
                },
                body: JSON.stringify({
                    from: from.toUpperCase(),
                    to: to.toUpperCase(),
                    amount: amount.toString(),
                    affiliate_id: LETSEXCHANGE_AFFILIATE
                })
            })
                .then(async res => {
                    if (!res.ok) return null;
                    const data = await res.json();
                    return {
                        exchange: 'LetsExchange',
                        estimatedAmount: parseFloat(data.amount),
                        rate: parseFloat(data.rate),
                        url: `https://letsexchange.io/?ref_id=${LETSEXCHANGE_AFFILIATE}`
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
