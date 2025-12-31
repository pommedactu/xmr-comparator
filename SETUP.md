# 🚀 Configuration rapide - XMR Comparator

## Étape 1 : Obtenir les clés API (15 minutes)

### ✅ ChangeNow (FONCTIONNE DÉJÀ SANS CLÉ)
- Ton site affiche déjà ChangeNow !
- **Optionnel** : Crée un compte sur [changenow.io](https://changenow.io) pour obtenir une clé API + affiliate ID

### 🔑 FixedFloat
1. Va sur **[fixedfloat.com](https://fixedfloat.com)**
2. Clique sur **Sign Up** (en haut à droite)
3. Crée ton compte (email + mot de passe)
4. Va dans **Settings → API**
5. Clique sur **Generate API Key**
6. **Copie la clé** (tu ne pourras plus la revoir)

### 🔑 StealthEX
1. Va sur **[stealthex.io](https://stealthex.io)**
2. Clique sur **Sign Up**
3. Crée ton compte
4. Va sur **[stealthex.io/partners/api](https://stealthex.io/partners/api)**
5. Clique sur **Get API Key**
6. **Copie la clé**

### 🔑 SimpleSwap
1. Va sur **[simpleswap.io](https://simpleswap.io)**
2. Crée un compte
3. Envoie un email à : **support@simpleswap.io**
   ```
   Objet : API Key Request

   Hello,

   I would like to request a free API key to compare exchange rates on my website.

   My email: [TON EMAIL]

   Thank you!
   ```
4. Attends leur réponse (24-48h max)

---

## Étape 2 : Configurer app.js

Ouvre le fichier `app.js` et remplace les clés API :

```javascript
// Ligne 22 - ChangeNow
`https://api.changenow.io/v1/exchange-amount/${amount}/${from}_${to}/?api_key=TA_CLE_CHANGENOW`

// Ligne 47 - FixedFloat
// Ajoute dans le headers :
headers: {
    'Content-Type': 'application/json',
    'X-API-KEY': 'TA_CLE_FIXEDFLOAT'
}

// Ligne 86 - StealthEX
`https://api.stealthex.io/api/v2/estimate/${from}/${to}?amount=${amount}&api_key=TA_CLE_STEALTHEX&fixed=false`

// Ligne 112 - SimpleSwap
`https://api.simpleswap.io/get_estimated?api_key=TA_CLE_SIMPLESWAP&fixed=false&currency_from=${from}&currency_to=${to}&amount=${amount}`
```

---

## Étape 3 : Tester

1. Ouvre `index.html` dans Chrome/Firefox
2. Entre **1 BTC → XMR**
3. Clique sur **Comparer les taux**
4. Tu devrais voir **4 exchanges** !

---

## Étape 4 : Déployer sur Netlify

```bash
cd /Users/admin/Desktop/CRYPTO/xmr-comparator
# Glisse-dépose le dossier sur netlify.com
# Ou utilise Git
```

---

## 💰 Bonus : Programmes d'affiliation (optionnel)

Une fois que tout fonctionne, inscris-toi aux programmes d'affiliation pour gagner des commissions :

- **ChangeNow** : [changenow.io/affiliate](https://changenow.io/affiliate)
- **FixedFloat** : Contact support@fixedfloat.com
- **StealthEX** : [stealthex.io/affiliate](https://stealthex.io/affiliate)
- **SimpleSwap** : Demande au support

Tu recevras un **affiliate ID** à mettre dans `app.js` ligne 6-10.

---

## 🐛 Problèmes ?

### "Only ChangeNow shows up"
→ Tu n'as pas encore mis les clés API des autres exchanges

### "CORS error"
→ Normal en local avec `file://`. Déploie sur Netlify ou utilise :
```bash
python3 -m http.server 8000
```

### "API error 401"
→ Ta clé API est incorrecte, vérifie-la

---

**C'est tout ! Tu auras un comparateur XMR multi-exchanges en 15 minutes** 🚀
