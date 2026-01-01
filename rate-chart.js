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
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    const history = await loadRateHistory();
    if (history && history.rates.length > 0) {
        createRateChart(history);
    }
});
