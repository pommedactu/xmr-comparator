// Graphique d'évolution des taux BTC → XMR sur 24h
// Utilise Chart.js pour l'affichage

async function loadRateHistory() {
    try {
        const response = await fetch('/data/rate-history.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur chargement historique:', error);
        return null;
    }
}

function createRateChart(history) {
    const ctx = document.getElementById('rateChart').getContext('2d');

    // Préparer les données pour les dernières 24h
    const last24h = history.rates.slice(0, 24).reverse();

    if (last24h.length === 0) {
        document.getElementById('rate-chart-container').innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted);">
                📊 Collecte des données en cours...<br>
                <small>Le graphique sera disponible après 24h de collecte</small>
            </div>
        `;
        return;
    }

    // Labels (heures)
    const labels = last24h.map(point => {
        const date = new Date(point.timestamp);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    });

    // Datasets pour chaque exchange
    const exchanges = ['changenow', 'exolix', 'godex', 'letsexchange', 'stealthex'];
    const colors = {
        changenow: '#4CAF50',
        exolix: '#FF6600',
        godex: '#2196F3',
        letsexchange: '#9C27B0',
        stealthex: '#FF9800'
    };

    const datasets = exchanges.map(exchange => {
        return {
            label: exchange.charAt(0).toUpperCase() + exchange.slice(1),
            data: last24h.map(point => point.rates[exchange] || null),
            borderColor: colors[exchange],
            backgroundColor: colors[exchange] + '33',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 3,
            pointHoverRadius: 6
        };
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Évolution des taux BTC → XMR (24h)',
                    color: '#ffffff',
                    font: { size: 18, weight: 'bold' }
                },
                legend: {
                    labels: { color: '#ffffff' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + (context.parsed.y ? context.parsed.y.toFixed(4) + ' XMR' : 'N/A');
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#999999',
                        callback: function(value) {
                            return value.toFixed(2) + ' XMR';
                        }
                    },
                    grid: { color: '#2a2a2a' }
                },
                x: {
                    ticks: { color: '#999999' },
                    grid: { color: '#2a2a2a' }
                }
            }
        }
    });

    // Afficher les stats
    displayStats(last24h, exchanges);
}

function displayStats(last24h, exchanges) {
    const statsContainer = document.getElementById('rate-stats');

    // Calculer le meilleur taux actuel et le meilleur des dernières 24h
    const latest = last24h[last24h.length - 1];
    let bestNow = { exchange: '', rate: 0 };
    let best24h = { exchange: '', rate: 0, time: '' };

    // Meilleur taux actuel
    exchanges.forEach(ex => {
        if (latest.rates[ex] && latest.rates[ex] > bestNow.rate) {
            bestNow = { exchange: ex, rate: latest.rates[ex] };
        }
    });

    // Meilleur taux sur 24h
    last24h.forEach(point => {
        exchanges.forEach(ex => {
            if (point.rates[ex] && point.rates[ex] > best24h.rate) {
                best24h = {
                    exchange: ex,
                    rate: point.rates[ex],
                    time: new Date(point.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                };
            }
        });
    });

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-label">Meilleur taux actuel</div>
            <div class="stat-value">${bestNow.rate.toFixed(4)} XMR</div>
            <div class="stat-exchange">${bestNow.exchange}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Meilleur moment (24h)</div>
            <div class="stat-value">${best24h.rate.toFixed(4)} XMR</div>
            <div class="stat-exchange">${best24h.exchange} à ${best24h.time}</div>
        </div>
    `;
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    const history = await loadRateHistory();
    if (history && history.rates.length > 0) {
        createRateChart(history);
    }
});
