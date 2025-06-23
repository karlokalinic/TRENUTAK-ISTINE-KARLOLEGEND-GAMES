# Trenutak Istine - AI-Powered TV Show

Rekonstrukcija kultnog TV showa "The Moment of Truth" iz 2008. godine s naprednom AI analizom korištenjem DeepSeek R1 modela.

## 🚀 Značajke

- **Napredna AI Analiza**: Koristi DeepSeek R1 0528 Qwen3 8B model za psihološku analizu
- **Dramatični TV Show Stil**: Autentična rekonstrukcija originalnog formata
- **Adaptivno Postavljanje Pitanja**: AI odabira sljedeća pitanja na temelju odgovora
- **Varijabilna Dubina**: Od 15 do 30 pitanja ovisno o željenim analizama
- **Realtime Komentari**: Instant AI komentari na svaki odgovor

## 🛠️ Tehnologije

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Netlify Functions (Node.js)
- **AI Model**: DeepSeek R1 0528 Qwen3 8B (via OpenRouter)
- **Hosting**: Netlify

## 📋 Preduvjeti

- GitHub račun
- Netlify račun
- OpenRouter API ključ (besplatan)

## 🔧 Instalacija

1. **Kloniraj projekt**:
   ```bash
   git clone [your-github-repo]
   cd trenutak-istine
   ```

2. **Instaliraj dependencies**:
   ```bash
   npm install
   ```

3. **Postavi environment varijable** u Netlify:
   - `OPENROUTER_API_KEY`: Tvoj OpenRouter API ključ

4. **Deploy na Netlify**:
   - Povezaj GitHub repo s Netlify
   - Deploy automatski

## 🎮 Kako Koristiti

1. Otvori web stranicu
2. Odaberi dubinu analize (15, 21 ili 30 pitanja)
3. Odgovori iskreno na pitanja s DA/NE
4. AI će analizirati svaki odgovor i dati komentar
5. Na kraju dobij kompletnu psihološku procjenu

## 🔑 API Ključevi

### OpenRouter Setup:
1. Idi na [openrouter.ai](https://openrouter.ai)
2. Registriraj se (besplatno)
3. Generiraj API ključ
4. Dodaj u Netlify Environment Variables kao `OPENROUTER_API_KEY`

## 📁 Struktura Projekta

```
trenutak-istine/
├── index.html              # Glavna HTML stranica
├── style.css               # Stilovi
├── script.js               # Frontend JavaScript
├── netlify.toml            # Netlify konfiguracija
├── package.json            # Node.js dependencies
├── netlify/
│   └── functions/
│       └── get-ai-comment.js  # AI funkcija
└── README.md
```

## 🧪 Testiranje

Za testiranje AI veze, otvori developer console i pozovi:
```javascript
testAIConnection()
```

## 🚨 Upozorenja

- Igra koristi naprednu AI analizu
- Odgovori se analiziraju u realnom vremenu
- Nema spremanja podataka - sve ostaje lokalno
- Preporučuje se iskrenost za bolje rezultate

## 📊 AI Model Info

- **Model**: DeepSeek R1 0528 Qwen3 8B
- **Provider**: OpenRouter
- **Cijena**: BESPLATNO
- **Limit**: 50 zahtjeva/dan (besplatni tier)
- **Kontekst**: 131,072 tokena

## 🤝 Doprinosi

Pull requests su dobrodošli! Za veće promjene, molimo prvo otvorite issue.

## 📄 Licenca

MIT License - slobodno koristite i modificirajte.

## 🆘 Support

Za pitanja ili probleme, otvorite GitHub issue ili kontaktirajte autora.

---

**⚠️ NAPOMENA**: Ova aplikacija je kreirana samo u edukacijske i zabavne svrhe. Nije namijenjena za stvarnu psihološku procjenu.