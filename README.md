# 🔒 XMR Exchange Comparator

Comparateur de taux d'échange pour Monero (XMR). Compare les meilleurs taux de ChangeNow, FixedFloat, StealthEX et SimpleSwap.

## 🚀 Fonctionnalités

- ✅ Comparaison en temps réel de 4 exchanges
- ✅ Interface moderne et responsive
- ✅ Mode sombre (déjà actif)
- ✅ Liens d'affiliation intégrés
- ✅ Aucune base de données nécessaire
- ✅ 100% gratuit pour les utilisateurs

## 📊 Exchanges intégrés

1. **ChangeNow** - API publique
2. **FixedFloat** - API publique
3. **StealthEX** - API publique
4. **SimpleSwap** - API publique

## 🛠️ Installation

### 1. Télécharger les fichiers

Les fichiers sont déjà prêts dans `/Users/admin/Desktop/CRYPTO/xmr-comparator/`

### 2. Configurer les IDs d'affiliation

Ouvre `app.js` et remplace les IDs d'affiliation ligne 8-12 :

```javascript
const AFFILIATE_IDS = {
    changenow: 'TON_ID_CHANGENOW',
    fixedfloat: 'TON_ID_FIXEDFLOAT',
    stealthex: 'TON_ID_STEALTHEX'
};
```

### 3. Obtenir les clés API (GRATUIT)

**⚠️ IMPORTANT** : Les APIs nécessitent des clés, mais elles sont **100% gratuites** !

#### ChangeNow
1. Va sur [changenow.io](https://changenow.io)
2. Crée un compte
3. Va dans API → Create API Key
4. Copie ta clé et mets-la dans `app.js` ligne 22
5. **Bonus** : Inscris-toi aussi au [programme d'affiliation](https://changenow.io/affiliate) (0.5-1% de commission)

#### FixedFloat
1. Va sur [fixedfloat.com](https://fixedfloat.com)
2. Crée un compte
3. Va dans Settings → API
4. Génère une clé API (gratuite)
5. Copie ta clé et mets-la dans `app.js` ligne 47
6. **Bonus** : Contact le support pour le programme d'affiliation (~0.5%)

#### StealthEX
1. Va sur [stealthex.io](https://stealthex.io)
2. Crée un compte
3. Va sur [Dashboard API](https://stealthex.io/partners/api)
4. Génère une clé API gratuite
5. Copie ta clé et mets-la dans `app.js` ligne 86
6. **Bonus** : Inscris-toi au [programme d'affiliation](https://stealthex.io/affiliate) (~0.5%)

#### SimpleSwap
1. Va sur [simpleswap.io](https://simpleswap.io)
2. Crée un compte
3. Contact le support pour obtenir une clé API gratuite : support@simpleswap.io
4. Copie ta clé et mets-la dans `app.js` ligne 112
5. **Bonus** : Demande aussi à rejoindre le programme d'affiliation

### 4. Tester localement

Ouvre simplement `index.html` dans ton navigateur !

Ou utilise un serveur local :
```bash
cd /Users/admin/Desktop/CRYPTO/xmr-comparator
python3 -m http.server 8000
```

Puis ouvre : `http://localhost:8000`

## 🌐 Déploiement sur Netlify

### Option 1 : Drag & Drop
1. Va sur [netlify.com](https://www.netlify.com)
2. Glisse-dépose le dossier `xmr-comparator`
3. C'est en ligne ! 🎉

### Option 2 : Via Git
```bash
cd /Users/admin/Desktop/CRYPTO/xmr-comparator
git init
git add .
git commit -m "Initial commit XMR Comparator"
# Créé un repo GitHub puis :
git remote add origin https://github.com/TON-USERNAME/xmr-comparator.git
git push -u origin main
```

Puis connecte le repo sur Netlify.

## 💰 Monétisation

### Revenus estimés

**Scénario conservateur** :
- 100 visiteurs/jour
- 5% de conversion (5 échanges/jour)
- Montant moyen : 500€
- Commission : 0.5%
- **Revenus** : 375€/mois

**Scénario optimiste** :
- 1000 visiteurs/jour
- 10% conversion
- Montant moyen : 1000€
- Commission : 1%
- **Revenus** : 30 000€/mois

### Stratégies d'acquisition

1. **SEO** :
   - Mots-clés : "acheter XMR", "BTC vers XMR", "meilleur taux Monero"
   - Créer du contenu : guides, comparatifs

2. **Reddit** :
   - r/Monero (communauté très active)
   - r/CryptoCurrency
   - r/PrivacyToolsIO

3. **Twitter/X** :
   - Hashtags : #Monero #XMR #Privacy #Crypto

4. **Partenariats** :
   - Contacter des influenceurs crypto
   - Forums Monero

## 🎨 Personnalisation

### Changer les couleurs

Dans `index.html`, modifie les variables CSS (ligne ~15) :

```css
:root {
    --primary: #FF6600;  /* Couleur principale (orange Monero) */
    --bg-dark: #1a1a1a;  /* Fond sombre */
    --success: #00C853;  /* Vert pour le meilleur taux */
}
```

### Ajouter d'autres paires

Dans `index.html`, ajoute des devises dans les `<select>` (ligne ~150) :

```html
<option value="bnb">BNB</option>
<option value="ada">ADA</option>
```

## 🔒 Sécurité & Légal

### Tu es un comparateur

- ✅ Tu ne touches JAMAIS les fonds
- ✅ Tu ne gères AUCUNE transaction
- ✅ Tu es juste un "Google pour les cryptos"
- ✅ Pas de licence nécessaire (en général)

### CGU recommandées

Ajoute dans le footer :

> "Nous sommes un service de comparaison indépendant. Nous ne gérons aucune transaction.
> Les échanges sont effectués par nos partenaires (ChangeNow, FixedFloat, etc.).
> Nous recevons une commission d'affiliation si vous utilisez nos liens."

## 📈 Prochaines étapes

### Améliorations possibles

1. **Alertes de taux** :
   - Email/Notification quand le taux dépasse un seuil

2. **Historique des taux** :
   - Graphique 7/30 jours

3. **Plus d'exchanges** :
   - Ajouter Sideshift, Exolix, etc.

4. **API publique** :
   - Proposer ton API agrégée

5. **Widget embeddable** :
   - Code pour intégrer sur d'autres sites

## 🐛 Résolution de problèmes

### Les taux ne s'affichent pas

1. Vérifie la console du navigateur (F12)
2. Problème de CORS ? Normal en local, déploie sur Netlify
3. APIs down ? Teste individuellement

### Erreur CORS

Les APIs peuvent bloquer les requêtes depuis `file://`.
Solutions :
- Utilise un serveur local (`python3 -m http.server`)
- Déploie sur Netlify

## 📞 Support

Si tu as des questions :
- Consulte la doc des APIs des exchanges
- Teste avec Postman/Insomnia

## 📄 Licence

Projet personnel - Utilisation libre

---

**Fait avec ❤️ pour la communauté Monero**

Enjoy ! 🚀
