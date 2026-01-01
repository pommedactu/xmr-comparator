# 🔍 Le Bon XMR

**Le comparateur français n°1 pour acheter du Monero (XMR) au meilleur taux.**

Compare en temps réel les taux de 5 exchanges sans KYC et trouve le meilleur prix pour tes conversions BTC/ETH/USDT → XMR.

🌐 **Site live** : [lebonxmr.com](https://lebonxmr.com)

---

## 🎯 Pourquoi Le Bon XMR ?

- **🚀 Temps réel** : Taux actualisés toutes les heures
- **💰 Meilleur prix** : Compare 6 exchanges en un clic
- **🔐 Sans KYC** : Tous les exchanges sont no-KYC
- **📊 Graphique 24h** : Visualise l'évolution des taux
- **📚 Guides français** : Tutoriels complets pour débutants
- **⚡ 100% gratuit** : Aucun frais supplémentaire

---

## ✨ Fonctionnalités

### 🔄 Comparateur de taux
Compare instantanément les taux de 6 exchanges :
- **ChangeNow** - Rapide et fiable
- **StealthEX** - Interface simple
- **Exolix** - Bons taux
- **Godex** - Pas de limite
- **LetsExchange** - Stable
- **SimpleSwap** - Frais compétitifs

### 📈 Graphique d'historique
- Évolution des taux sur 24h
- Collecte automatique toutes les heures (GitHub Actions)
- Visualisation interactive (Chart.js)

### 📚 Guides en français
- Comment acheter du Monero en France
- XMR vs BTC : quelle différence ?
- Monero pour les débutants
- Les meilleurs exchanges pour XMR

### 🎓 Wizard "Premier achat"
Assistant pas-à-pas pour les débutants absolus :
1. Créer un wallet Monero
2. Acheter sa première crypto
3. Convertir en XMR
4. Recevoir ses XMR

---

## 🛠️ Stack technique

### Frontend
- **HTML/CSS/JavaScript** vanilla (pas de framework)
- **Chart.js** pour les graphiques
- Design responsive, mobile-first
- Mode sombre uniquement

### Backend / Automatisation
- **GitHub Actions** : Collecte automatique des taux (cron horaire)
- **Netlify** : Hébergement et déploiement auto
- Aucune base de données (fichier JSON statique)

### APIs utilisées
- ChangeNow API
- StealthEX API
- Exolix API
- Godex API
- LetsExchange API
- SimpleSwap API

### Structure du projet
```
xmr-comparator/
├── index.html              # Page principale
├── app.js                  # Logique du comparateur
├── rate-chart.js           # Graphique d'historique
├── wizard.js               # Assistant premier achat
├── guides/                 # Guides en français
│   ├── index.html
│   ├── acheter-monero-france.html
│   ├── xmr-vs-btc.html
│   ├── monero-debutant.html
│   └── meilleurs-exchanges-monero.html
├── data/
│   └── rate-history.json   # Historique des taux (auto-généré)
├── scripts/
│   └── collect-rates.js    # Script de collecte (GitHub Actions)
└── .github/workflows/
    └── collect-rates.yml   # Workflow automatique
```

---

## 🚀 Installation & Développement

### Prérequis
- Un navigateur web moderne
- Node.js (pour le script de collecte)
- Git

### Installation locale

1. **Clone le repo**
```bash
git clone https://github.com/pommedactu/xmr-comparator.git
cd xmr-comparator
```

2. **Lance un serveur local**
```bash
# Option 1 : Python
python3 -m http.server 8000

# Option 2 : Node.js
npx http-server
```

3. **Ouvre dans ton navigateur**
```
http://localhost:8000
```

### Configuration des IDs d'affiliation

Si tu veux utiliser tes propres IDs d'affiliation, modifie `app.js` :

```javascript
const AFFILIATE_IDS = {
    changenow: 'TON_ID_ICI',
    stealthex: 'TON_ID_ICI',
    exolix: 'TON_ID_ICI',
    godex: 'TON_ID_ICI',
    letsexchange: 'TON_ID_ICI',
    simpleswap: 'TON_ID_ICI'
};
```

### Déploiement

Le site est auto-déployé sur **Netlify** à chaque push sur `main`.

Workflow :
1. Push sur GitHub
2. Netlify détecte le changement
3. Build & déploiement automatique
4. Site live en ~30 secondes

---

## 📊 Collecte automatique des taux

Un GitHub Action (`collect-rates.yml`) collecte les taux toutes les heures :

```yaml
schedule:
  - cron: '0 * * * *'  # Toutes les heures
```

Le script `scripts/collect-rates.js` :
1. Appelle les 5 APIs
2. Récupère les taux BTC→XMR
3. Sauvegarde dans `data/rate-history.json`
4. Commit & push automatique

Les données sont ensuite utilisées par `rate-chart.js` pour afficher le graphique.

---

## 🤝 Contribution

Les contributions sont les bienvenues !

### Comment contribuer

1. Fork le projet
2. Crée une branche (`git checkout -b feature/amelioration`)
3. Commit tes changements (`git commit -m 'Ajout fonctionnalité X'`)
4. Push (`git push origin feature/amelioration`)
5. Ouvre une Pull Request

### Idées de contributions

- 🌐 Traductions (anglais, espagnol...)
- 📊 Nouveaux exchanges
- 🎨 Améliorations UI/UX
- 📝 Nouveaux guides
- 🐛 Corrections de bugs

---

## 📈 Roadmap

### ✅ Fait
- [x] Comparateur 6 exchanges
- [x] Graphique historique 24h
- [x] Guides français complets
- [x] Wizard premier achat
- [x] Collecte automatique des taux
- [x] Design responsive
- [x] Mode sombre
- [x] SimpleSwap intégré

### 🔜 À venir
- [ ] Graphique 7 jours
- [ ] Alertes de taux par email
- [ ] Traduction anglaise
- [ ] Comparaison XMR→BTC (inverse)
- [ ] Widget embeddable
- [ ] Mode clair (optionnel)

---

## 🔒 Disclaimer & Légal

### Nature du service

**Le Bon XMR** est un **comparateur indépendant**. Nous ne gérons, n'exécutons ni ne stockons aucune transaction.

- ❌ Nous ne touchons JAMAIS les fonds
- ❌ Nous ne gérons AUCUNE transaction
- ✅ Nous comparons uniquement les taux
- ✅ Les échanges sont effectués par les plateformes partenaires

### Affiliation

Le site participe aux programmes d'affiliation des exchanges listés. Une commission peut être versée lors d'un échange via nos liens, **sans surcoût pour l'utilisateur**.

Cette commission finance le développement et la maintenance du site.

### Vie privée

- **Aucun tracking** : pas de Google Analytics ou autre
- **Aucun cookie** : le site ne stocke rien
- **Aucune collecte de données** : respect total de votre vie privée

### Responsabilité

Les taux affichés sont fournis à titre indicatif. Le Bon XMR ne peut être tenu responsable :
- Des échanges effectués sur les plateformes tierces
- De l'exactitude des taux en temps réel
- Des délais de transaction
- Des problèmes techniques des exchanges

Pour toute réclamation, contactez directement la plateforme concernée.

---

## 🐛 Bugs connus

Aucun bug critique connu pour le moment.

Si tu trouves un bug, ouvre une [issue sur GitHub](https://github.com/pommedactu/xmr-comparator/issues).

---

## 📞 Contact

- **Email** : lebonxmr@gmail.com
- **GitHub** : [@pommedactu](https://github.com/pommedactu)
- **Site** : [lebonxmr.com](https://lebonxmr.com)

---

## 📄 Licence

Ce projet est sous licence **MIT**.

Tu peux :
- ✅ Utiliser le code librement
- ✅ Modifier et distribuer
- ✅ Utiliser à des fins commerciales

Avec mention de l'auteur original.

---

## 💝 Remerciements

- La communauté **Monero** pour la crypto qui tient ses promesses
- Les exchanges **ChangeNow, StealthEX, Exolix, Godex, LetsExchange, SimpleSwap** pour leurs APIs
- **Chart.js** pour les graphiques
- **Netlify** pour l'hébergement gratuit

---

**Fait avec ❤️ pour la communauté crypto française**

*Monero : la seule crypto vraiment privée.* 💎

---

## ⭐ Star le projet

Si ce projet t'aide, n'hésite pas à lui mettre une étoile sur GitHub ! ⭐
