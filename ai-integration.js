/**
 * TRENUTAK ISTINE - AI INTEGRACIJA
 * Ovaj fajl ide u tvoju web stranicu (trenutak-istine.netlify.app)
 * Spaja tvoju igru s AI-om iz Hugging Face Space-a
 */

// Konfiguracija za spajanje na Hugging Face Space
const AI_CONFIG = {
    spaceUrl: "karlolegend1/TRENUTAK-ISTINE",  // Tvoj HF Space
    apiEndpoint: "https://karlolegend1-trenutak-istine.hf.space/api/predict",
    timeout: 10000, // 10 sekundi timeout
    retryAttempts: 3
};

class TrenutakIstineAI {
    constructor() {
        this.connected = false;
        this.cache = new Map(); // Cache za brže odgovore
        this.requestQueue = []; // Queue za rate limiting
        this.isProcessing = false;

        // Fallback komentari ako AI ne radi
        this.fallbackKomentari = [
            "Tvoj odgovor otkriva zanimljive aspekte tvoje osobnosti...",
            "Ova iskrenost pokazuje dubinu tvog karaktera...",
            "Zanimljivo kako razmišljaš o ovome... to govori puno.",
            "Ovakav pristup rijetko viđam... fascinantno.",
            "Tvoja reakcija otkriva skrivene slojeve tvoje ličnosti..."
        ];

        console.log("🤖 AI sustav inicijaliziran");
        this.testConnection();
    }

    /**
     * Testiraj konekciju s Hugging Face Space
     */
    async testConnection() {
        try {
            console.log("🔌 Testiram konekciju s AI...");

            // Jednostavan test poziv
            const testResponse = await this.makeAIRequest(
                "Test pitanje", 
                "Test odgovor", 
                true // označava da je test
            );

            if (testResponse) {
                this.connected = true;
                console.log("✅ AI konekcija uspješna!");
                this.showConnectionStatus(true);
            } else {
                throw new Error("Test neuspješan");
            }

        } catch (error) {
            console.warn("⚠️ AI nije dostupan, koristim fallback:", error);
            this.connected = false;
            this.showConnectionStatus(false);
        }
    }

    /**
     * Glavni poziv AI-u za generiranje komentara
     */
    async generateGameComment(pitanje, odgovor, gameContext = {}) {
        // Generiraj jedinstveni ključ za cache
        const cacheKey = this.generateCacheKey(pitanje, odgovor);

        // Provjeri cache prvo
        if (this.cache.has(cacheKey)) {
            console.log("📋 Koristim cached AI odgovor");
            return this.cache.get(cacheKey);
        }

        // Ako AI nije spojen, koristi fallback
        if (!this.connected) {
            console.log("📴 AI offline, koristim fallback");
            return this.getFallbackResponse();
        }

        try {
            // Prikaži loading indicator
            this.showLoadingState(true);

            // Napravi AI zahtjev
            const aiKomentar = await this.makeAIRequest(pitanje, odgovor, false, gameContext);

            if (aiKomentar) {
                // Spremi u cache
                this.cache.set(cacheKey, aiKomentar);
                console.log("✨ AI komentar:", aiKomentar);
                return aiKomentar;
            } else {
                throw new Error("AI vratio prazan odgovor");
            }

        } catch (error) {
            console.error("❌ Greška pri AI pozivu:", error);
            return this.getFallbackResponse();
        } finally {
            this.showLoadingState(false);
        }
    }

    /**
     * Napravi HTTP zahtjev na Hugging Face Space
     */
    async makeAIRequest(pitanje, odgovor, isTest = false, gameContext = {}) {
        try {
            // Pripremi podatke za slanje
            const requestData = {
                data: [pitanje, odgovor]
            };

            // Napravi HTTP zahtjev
            const response = await fetch(AI_CONFIG.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
                signal: AbortSignal.timeout(AI_CONFIG.timeout)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            // Obradi odgovor
            let aiKomentar = result.data?.[0] || "";

            if (!aiKomentar && !isTest) {
                throw new Error("Prazan AI odgovor");
            }

            return this.postprocessResponse(aiKomentar);

        } catch (error) {
            if (error.name === 'TimeoutError') {
                console.error("⏰ AI zahtjev timeout");
            } else if (error.name === 'AbortError') {
                console.error("🚫 AI zahtjev prekinut");
            } else {
                console.error("🔥 AI zahtjev error:", error);
            }

            if (isTest) return null;
            throw error;
        }
    }

    /**
     * Obradi i očisti AI odgovor
     */
    postprocessResponse(response) {
        if (!response) return this.getFallbackResponse();

        // Ukloni lišnje razmake
        response = response.trim();

        // Ograniči duljinu (max 150 znakova)
        if (response.length > 150) {
            response = response.substring(0, 147) + "...";
        }

        // Dodaj dramatičnost ako nedostaje
        if (!response.includes('...') && !response.includes('!') && !response.includes('?')) {
            response += '...';
        }

        return response;
    }

    /**
     * Generiraj fallback odgovor ako AI ne radi
     */
    getFallbackResponse() {
        const randomIndex = Math.floor(Math.random() * this.fallbackKomentari.length);
        return this.fallbackKomentari[randomIndex];
    }

    /**
     * Generiraj cache ključ
     */
    generateCacheKey(pitanje, odgovor) {
        return btoa(encodeURIComponent(pitanje + "|" + odgovor)).substring(0, 32);
    }

    /**
     * Prikaži status konekcije u UI
     */
    showConnectionStatus(connected) {
        const statusElement = document.getElementById('ai-status');
        if (statusElement) {
            statusElement.innerHTML = connected 
                ? '<span style="color: #00ff00;">🟢 AI Spojen</span>'
                : '<span style="color: #ff6600;">🟡 AI Offline</span>';
        }
    }

    /**
     * Prikaži/sakrij loading state
     */
    showLoadingState(loading) {
        const loadingElement = document.getElementById('ai-loading');
        if (loadingElement) {
            loadingElement.style.display = loading ? 'block' : 'none';
        }
    }

    /**
     * Počisti cache (pozovi povremeno)
     */
    clearCache() {
        this.cache.clear();
        console.log("🗑️ AI cache očišćen");
    }
}

// Kreiraj globalnu instancu AI sustava
window.trenutakAI = new TrenutakIstineAI();

// Debug funkcije za testiranje (pozovi u konzoli)
window.testAI = async function() {
    console.log("🧪 Testiram AI...");
    const result = await window.trenutakAI.generateGameComment(
        "Što je najgora laž koju ste ikad rekli?",
        "Rekao sam mami da je torta bila ukusna."
    );
    console.log("🎯 Test rezultat:", result);
    return result;
};

window.clearAICache = function() {
    window.trenutakAI.clearCache();
};

console.log("🚀 AI integracija učitana! Pozovi testAI() za test.");
