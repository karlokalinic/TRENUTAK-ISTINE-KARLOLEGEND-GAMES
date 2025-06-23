// OPTIMIZOVANI PSIHOLOŠKI PROFILER SA KRAĆIM PROMPTOVIMA I RETRY LOGIKOM
class OptimizedPsychologicalProfiler {
    constructor() {
        console.log("🚀 OPTIMIZOVANI PROFILER: Inicijalizacija");
        
        // Konfiguracija
        this.aiModel = 'deepseek/deepseek-r1:free';
        this.fallbackModels = [
            'meta-llama/llama-3.2-3b-instruct:free',
            'google/gemini-flash-1.5:free'
        ];
        this.maxRetries = 3;
        this.retryDelay = 1000;
        
        // Game state
        this.gameStarted = false;
        this.gameCompleted = false;
        this.currentQuestionIndex = 0;
        this.totalQuestions = 15;
        this.answers = [];
        this.currentQuestion = null;
        
        // Skraćeni psihološki profil
        this.psychologicalProfile = {
            currentAnalysis: "",
            traits: [],
            insights: [],
            contradictions: []
        };
        
        // Optimizovane kratke kategorije pitanja
        this.questionCategories = {
            identity: [
                "Često lažete o malim stvarima da izbegnete neugodnost?",
                "Imate li tajne koje nikad niste nikome rekli?",
                "Ponašate li se drugačije kada ste sami?",
                "Krivotvorna li stvari koje ste uradili u prošlosti?"
            ],
            relationships: [
                "Koristite li emocije drugih za svoju korist?",
                "Zaljubljujete li se često u nedostupne osobe?",
                "Ostajete li u lošim odnosima iz straha od usamljenosti?",
                "Lažete li partneru o svojim osećanjima?"
            ],
            ethics: [
                "Krali ste nešto u poslednjih 5 godina?",
                "Lagali ste da biste nekoga povredili?",
                "Radite stvari koje smatrate moralno pogrešnim?",
                "Osećate krivicu zbog nečega što ste uradili?"
            ],
            emotions: [
                "Plačete kada ste potpuno sami?",
                "Osećate gnev prema bliskim ljudima?",
                "Potiskujete emocije umesto da ih izrazite?",
                "Bojite se vlastite ljutnje?"
            ],
            fears: [
                "Bojite se smrti više nego što priznajete?",
                "Imate strahove koje smatrate irracionalnim?",
                "Izbegavate situacije zbog straha od neuspеha?",
                "Strašite se da ćete biti odbačeni?"
            ]
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        console.log("🎮 INICIJALIZACIJA: Pokretanje optimizovane igre");
        
        const appContainer = document.getElementById('app-container');
        if (!appContainer) {
            console.error("❌ GREŠKA: app-container ne postoji!");
            return;
        }
        
        let gameContainer = document.getElementById('game-container');
        if (!gameContainer) {
            gameContainer = document.createElement('div');
            gameContainer.id = 'game-container';
            gameContainer.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                text-align: center;
            `;
            appContainer.appendChild(gameContainer);
        }
        
        this.gameContainer = gameContainer;
        this.setupEventListeners();
        this.displayWelcomeScreen();
    }
    
    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('depth-option')) {
                const depth = parseInt(e.target.dataset.depth);
                this.selectGameDepth(depth);
            }
            
            if (e.target.classList.contains('answer-btn')) {
                const answer = e.target.dataset.answer;
                this.handleAnswer(answer);
            }
            
            if (e.target.classList.contains('continue-btn')) {
                if (window.continueGame) window.continueGame();
            }
        });
    }
    
    displayWelcomeScreen() {
        this.gameContainer.innerHTML = `
            <div class="welcome-container">
                <h1>🎭 TRENUTAK ISTINE</h1>
                <h2>Optimizovana AI Psihološka Analiza</h2>
                
                <div class="doctor-intro">
                    <div class="doctor-avatar">🎭</div>
                    <div class="doctor-text">
                        <p><strong>Dr. Veritas:</strong> "Dobrodošli u optimizovanu verziju psihološke analize. 
                        Koristim napredne AI tehnike sa retry mehanizmom za maksimalnu pouzdanost."</p>
                    </div>
                </div>
                
                <h3>Odaberite dubinu analize:</h3>
                <div class="depth-options">
                    <button class="depth-option" data-depth="10">Brza analiza (10 pitanja)</button>
                    <button class="depth-option" data-depth="15">Standardna (15 pitanja)</button>
                    <button class="depth-option" data-depth="21">Duboka (21 pitanje)</button>
                </div>
                
                <div class="warning">
                    ⚠️ <strong>NAPOMENA:</strong> Optimizovana verzija koristi kratke promptove i 
                    retry mehanizam za bolje performanse.
                </div>
            </div>
        `;
    }
    
    selectGameDepth(depth) {
        console.log("🎯 DUBINA ODABRANA:", depth);
        this.totalQuestions = depth;
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        
        const hostMessage = `Odlično! Odabrali ste ${depth}-pitanjsku analizu. 
        Koristim optimizovane promptove za brže rezultate. Počinjemo...`;
        
        this.displayHostMessage(hostMessage, () => {
            this.startGame();
        });
    }
    
    async startGame() {
        console.log("🎮 START: Pokretanje optimizovane igre");
        
        try {
            const firstQuestion = await this.generateOptimizedQuestion();
            this.displayQuestion(firstQuestion);
        } catch (error) {
            console.error("❌ GREŠKA:", error);
            this.handleError("Greška pri pokretanju. Pokušavam ponovno...");
        }
    }
    
    async generateOptimizedQuestion() {
        console.log("🧠 GENERIRAM: Optimizovano pitanje");
        
        // Kratki, efikasni prompt
        const categories = Object.keys(this.questionCategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const questions = this.questionCategories[randomCategory];
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        
        // Pokušaj AI generiranje, ali imaj fallback
        try {
            const context = this.buildShortContext();
            const systemPrompt = `Generiraj kratko psihološko pitanje (DA/NE). 
Kontekst: ${context}
Format: {"category": "${randomCategory}", "question": "Pitanje?", "reasoning": "Kratko objašnjenje"}`;
            
            const aiResponse = await this.callAIWithRetry(systemPrompt, "", 2);
            const questionData = JSON.parse(aiResponse);
            return questionData;
        } catch (error) {
            console.log("🔄 FALLBACK: Koristim lokalno pitanje");
            return {
                category: randomCategory,
                question: randomQuestion,
                reasoning: "Lokalno generirano pitanje zbog AI greške"
            };
        }
    }
    
    buildShortContext() {
        if (this.answers.length === 0) return "Početak analize";
        
        const lastAnswer = this.answers[this.answers.length - 1];
        return `Prošlo: "${lastAnswer.question}" - ${lastAnswer.response}. Osobine: ${this.psychologicalProfile.traits.join(', ')}.`;
    }
    
    displayQuestion(questionData) {
        const progressPercent = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        
        this.gameContainer.innerHTML = `
            <div class="question-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    <span>Pitanje ${this.currentQuestionIndex + 1} od ${this.totalQuestions}</span>
                </div>
                
                <div class="doctor-section">
                    <div class="doctor-avatar">🎭</div>
                    <div class="doctor-name">Dr. Veritas</div>
                </div>
                
                <div class="category">${this.getCategoryDisplayName(questionData.category)}</div>
                
                <h2 class="question">${questionData.question}</h2>
                
                <div class="reasoning">
                    <em>Razlog: ${questionData.reasoning}</em>
                </div>
                
                <div class="answer-buttons">
                    <button class="answer-btn yes-btn" data-answer="DA">DA</button>
                    <button class="answer-btn no-btn" data-answer="NE">NE</button>
                </div>
                
                ${this.psychologicalProfile.currentAnalysis ? `
                    <div class="current-analysis">
                        <h4>Trenutna analiza:</h4>
                        <p>${this.psychologicalProfile.currentAnalysis}</p>
                    </div>
                ` : ''}
                
                <div class="debug-info">
                    Model: ${this.aiModel} | Pitanje: ${this.currentQuestionIndex + 1}/${this.totalQuestions}
                </div>
            </div>
        `;
        
        this.currentQuestion = questionData;
    }
    
    getCategoryDisplayName(category) {
        const displayMap = {
            identity: "Identitet i samopercepcija",
            relationships: "Odnosi i veze", 
            ethics: "Etika i moral",
            emotions: "Emocije",
            fears: "Strahovi i nesigurnosti"
        };
        return displayMap[category] || category;
    }
    
    async handleAnswer(answer) {
        console.log("💬 ODGOVOR:", answer);
        
        const answerData = {
            question: this.currentQuestion.question,
            response: answer,
            category: this.currentQuestion.category,
            questionIndex: this.currentQuestionIndex,
            timestamp: new Date().toISOString()
        };
        
        this.answers.push(answerData);
        this.currentQuestionIndex++;
        
        this.showAnalysisLoading();
        
        try {
            const analysis = await this.generateOptimizedAnalysis(answerData);
            this.updateProfile(analysis);
            await this.displayAnalysis(analysis);
            
            if (this.currentQuestionIndex >= this.totalQuestions) {
                await this.endGame();
            } else {
                const nextQuestion = await this.generateOptimizedQuestion();
                this.displayQuestion(nextQuestion);
            }
        } catch (error) {
            console.error("❌ GREŠKA:", error);
            this.handleError("Greška pri analizi. Nastavljam...");
        }
    }
    
    showAnalysisLoading() {
        this.gameContainer.innerHTML = `
            <div class="loading-container">
                <div class="doctor-avatar">🎭</div>
                <h3>Dr. Veritas analizira...</h3>
                <div class="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </div>
                <p>Koristim optimizovane AI algoritme sa retry mehanizmom...</p>
                <div class="debug-info">
                    Status: Analiziram odgovor "${this.answers[this.answers.length - 1]?.response}"
                </div>
            </div>
        `;
    }
    
    async generateOptimizedAnalysis(answerData) {
        console.log("🧠 ANALIZA:", answerData);
        
        const shortContext = this.buildShortContext();
        
        // Kraći, optimizovani prompt
        const systemPrompt = `Kratka psihološka analiza odgovora. 
Pitanje: "${answerData.question}" - Odgovor: ${answerData.response}
Kontekst: ${shortContext}
Format JSON: {"insight": "Kratak uvid", "analysis": "Kratka analiza 2-3 rečenice", "traits": ["nova", "svojstva"], "profile": "Ažurirana kratka analiza"}`;
        
        try {
            const aiResponse = await this.callAIWithRetry(systemPrompt, "", 2);
            const analysis = JSON.parse(aiResponse);
            return analysis;
        } catch (error) {
            console.log("🔄 FALLBACK ANALIZA");
            return this.getFallbackAnalysis(answerData);
        }
    }
    
    getFallbackAnalysis(answerData) {
        return {
            insight: `Odgovor "${answerData.response}" otkriva važne aspekte ličnosti.`,
            analysis: `Ovaj odgovor na pitanje o ${answerData.category} pokazuje dublju dinamiku. Ispitanik demonstrira samosvest i spreman je za introspektivnost.`,
            traits: ["samosvest", "otvorenost"],
            profile: `Ispitanik pokazuje znakove psihološke zrelosti i kapacitet za rast. ${this.psychologicalProfile.currentAnalysis || ''} Dodatno, ovaj odgovor potkrepljuje sposobnost samoanalizu.`
        };
    }
    
    updateProfile(analysis) {
        if (analysis.traits) {
            analysis.traits.forEach(trait => {
                if (!this.psychologicalProfile.traits.includes(trait)) {
                    this.psychologicalProfile.traits.push(trait);
                }
            });
        }
        
        this.psychologicalProfile.currentAnalysis = analysis.profile || analysis.analysis;
        this.psychologicalProfile.insights.push(analysis.insight || analysis.analysis);
    }
    
    async displayAnalysis(analysis) {
        return new Promise((resolve) => {
            this.gameContainer.innerHTML = `
                <div class="analysis-container">
                    <div class="doctor-avatar">🎭</div>
                    <h3>Psihološka analiza</h3>
                    
                    <div class="insight">
                        <h4>Trenutni uvid:</h4>
                        <p>${analysis.insight || analysis.analysis}</p>
                    </div>
                    
                    <div class="analysis">
                        <h4>Dublja analiza:</h4>
                        <p>${analysis.analysis || analysis.profile}</p>
                    </div>
                    
                    ${analysis.traits ? `
                        <div class="new-traits">
                            <h4>Nova svojstva:</h4>
                            <ul>${analysis.traits.map(trait => `<li>${trait}</li>`).join('')}</ul>
                        </div>
                    ` : ''}
                    
                    <div class="updated-profile">
                        <h4>Ažuriran profil:</h4>
                        <p>${analysis.profile || this.psychologicalProfile.currentAnalysis}</p>
                    </div>
                    
                    <button class="continue-btn">Nastavi →</button>
                    
                    <div class="debug-info">
                        Ukupno svojstava: ${this.psychologicalProfile.traits.length} | 
                        Uvidi: ${this.psychologicalProfile.insights.length}
                    </div>
                </div>
            `;
            
            const autoAdvance = setTimeout(resolve, 5000);
            window.continueGame = () => {
                clearTimeout(autoAdvance);
                resolve();
            };
        });
    }
    
    async endGame() {
        console.log("🏁 KRAJ IGRE");
        this.gameCompleted = true;
        
        try {
            const finalAnalysis = await this.generateFinalAnalysis();
            this.displayFinalResults(finalAnalysis);
        } catch (error) {
            console.error("❌ GREŠKA:", error);
            this.displayFinalResults(this.getFallbackFinalAnalysis());
        }
    }
    
    async generateFinalAnalysis() {
        const allAnswers = this.answers.map(a => `"${a.question}" - ${a.response}`).join(', ');
        
        const systemPrompt = `Finalna kratka psihološka analiza. 
Odgovori: ${allAnswers}
Svojstva: ${this.psychologicalProfile.traits.join(', ')}
Format JSON: {"title": "Naslov", "summary": "Kratko sažetak 3-4 rečenice", "traits": ["glavna", "svojstva"], "conclusion": "Zaključak 2-3 rečenice"}`;
        
        try {
            const aiResponse = await this.callAIWithRetry(systemPrompt, "", 2);
            return JSON.parse(aiResponse);
        } catch (error) {
            return this.getFallbackFinalAnalysis();
        }
    }
    
    getFallbackFinalAnalysis() {
        return {
            title: "Kompleksna ličnost sa potencijalom za rast",
            summary: `Kroz ${this.answers.length} pitanja otkrivena je složena ličnost sa ${this.psychologicalProfile.traits.length} identifikovanih svojstava. Ispitanik pokazuje kapacitet za samoanalizu i psihološku zrelost.`,
            traits: this.psychologicalProfile.traits.length > 0 ? this.psychologicalProfile.traits : ["samosvest", "složenost", "autentičnost"],
            conclusion: "Preporučuje se nastavak rada na ličnom razvoju. Visok potencijal za psihološki rast i samoaktualizaciju."
        };
    }
    
    displayFinalResults(finalAnalysis) {
        this.gameContainer.innerHTML = `
            <div class="final-results">
                <h1>🏆 FINALNA ANALIZA</h1>
                <div class="doctor-avatar">🎭</div>
                <div class="doctor-name">Dr. Veritas - Finalni zaključak</div>
                
                <h2>${finalAnalysis.title}</h2>
                
                <div class="summary">
                    <h3>Sažetak analize:</h3>
                    <p>${finalAnalysis.summary}</p>
                </div>
                
                <div class="dominant-traits">
                    <h3>Glavna svojstva ličnosti:</h3>
                    <ul>
                        ${finalAnalysis.traits.map(trait => `<li>${trait}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="conclusion">
                    <h3>Finalni zaključak:</h3>
                    <p>${finalAnalysis.conclusion}</p>
                </div>
                
                <div class="statistics">
                    <h3>Statistike analize:</h3>
                    <p>Odgovoreno pitanja: ${this.answers.length}</p>
                    <p>Otkrivena svojstva: ${this.psychologicalProfile.traits.length}</p>
                    <p>Duboki uvidi: ${this.psychologicalProfile.insights.length}</p>
                </div>
                
                <div class="actions">
                    <button onclick="location.reload()">Nova analiza</button>
                    <button onclick="profiler.shareResults()">Podeli rezultate</button>
                </div>
                
                <div class="disclaimer">
                    <strong>Napomena:</strong> Ova analiza je kreirana AI-jem za zabavne svrhe. 
                    Nije zamena za profesionalnu psihološku procenu.
                </div>
            </div>
        `;
    }
    
    shareResults() {
        const shareText = `Završio sam psihološku analizu u igri "Trenutak Istine"! 
${this.psychologicalProfile.traits.length} svojstava, ${this.answers.length} pitanja. 
Pokušaj i ti: https://trenutak-istine.netlify.app/`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Trenutak Istine - Rezultati',
                text: shareText,
                url: 'https://trenutak-istine.netlify.app/'
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Rezultati kopirani u clipboard!');
            });
        }
    }
    
    async callAIWithRetry(systemPrompt, userPrompt, maxRetries = 3) {
        let lastError;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                console.log(`🔄 AI POZIV: Pokušaj ${attempt + 1}/${maxRetries}`);
                return await this.callAI(systemPrompt, userPrompt);
            } catch (error) {
                lastError = error;
                console.log(`❌ POKUŠAJ ${attempt + 1} NEUSPEŠAN:`, error.message);
                
                if (attempt < maxRetries - 1) {
                    const delay = this.retryDelay * Math.pow(2, attempt);
                    console.log(`⏳ ČEKAM: ${delay}ms`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
    }
    
    async callAI(systemPrompt, userPrompt) {
        const requestData = {
            model: this.aiModel,
            systemPrompt: systemPrompt,
            userPrompt: userPrompt || "",
            temperature: 0.7,
            max_tokens: 1000 // Kraći odgovori
        };
        
        const response = await fetch('/.netlify/functions/get-ai-comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestData)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data.success && data.fallback_response) {
            console.log("🔄 KORISTEFALLBACK ODGOVOR");
        }
        
        return data.comment || data.response || data.content;
    }
    
    handleError(message) {
        this.gameContainer.innerHTML = `
            <div class="error-container">
                <h3>⚠️ Privremena greška</h3>
                <p>${message}</p>
                <button onclick="location.reload()">Restartuj igru</button>
                <div class="debug-info">
                    Pokušajte osvežiti stranicu ili proveriti internetsku vezu.
                </div>
            </div>
        `;
    }
    
    displayHostMessage(message, callback) {
        this.gameContainer.innerHTML = `
            <div class="host-message">
                <div class="doctor-avatar">🎭</div>
                <div class="doctor-name">Dr. Veritas</div>
                <p>${message}</p>
                <button class="continue-btn">Nastavi</button>
            </div>
        `;
        
        window.continueGame = callback;
        setTimeout(callback, 3000);
    }
}

// Inicijalizacija
let profiler;

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 OPTIMIZOVANI PROFILER: Pokretanje");
    
    try {
        profiler = new OptimizedPsychologicalProfiler();
        window.profiler = profiler;
        console.log("✅ PROFILER SPREMAN");
    } catch (error) {
        console.error("❌ GREŠKA:", error);
        alert("Greška pri pokretanju. Osvežite stranicu.");
    }
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error("🚨 GLOBALNA GREŠKA:", e.message);
});

console.log("📋 OPTIMIZOVANI SCRIPT UČITAN");
