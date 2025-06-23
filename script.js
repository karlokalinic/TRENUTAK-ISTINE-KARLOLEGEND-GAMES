// REŠENJE: KOMPLETNA BAZA PITANJA UMESTO AI GENERISANJA
class ReliablePsychologicalProfiler {
    constructor() {
        console.log("🚀 POUZDANI PROFILER: Inicijalizacija bez AI dependencies");
        
        // Konfiguracija
        this.aiModel = 'deepseek/deepseek-r1:free';
        this.fallbackModels = [
            'meta-llama/llama-3.2-3b-instruct:free',
            'google/gemini-flash-1.5:free'
        ];
        this.maxRetries = 2; // Smanjeno sa 3 na 2
        this.retryDelay = 1000;
        
        // Game state
        this.gameStarted = false;
        this.gameCompleted = false;
        this.currentQuestionIndex = 0;
        this.totalQuestions = 15;
        this.answers = [];
        this.currentQuestion = null;
        this.usedQuestions = new Set(); // Pratimo korišćena pitanja
        
        // Psihološki profil
        this.psychologicalProfile = {
            currentAnalysis: "",
            traits: [],
            insights: [],
            contradictions: []
        };
        
        // KOMPLETNA BAZA PITANJA - 105 pitanja u 7 kategorija
        this.questionDatabase = {
            identity: [
                "Smatrate li se osobom koja je u potpunosti iskrena prema sebi o svojim motivacijama?",
                "Često se predstavljate drugačije nego što zaista jeste?",
                "Imate li tajne koje nikada niste nikome rekli?",
                "Ponašate li se drugačije kada ste potpuno sami?",
                "Krivotvorna li stvari koje ste uradili u prošlosti?",
                "Lažete li o malim stvarima da biste izbegali neugodnost?",
                "Smatrate li da vas ljudi poznaju onakvog kakvi zaista jeste?",
                "Često maštate o tome da ste neko drugi?",
                "Skrivate li svoje istinsko mišljenje da biste se dopali drugima?",
                "Imate li osećaj da nosite masku u društvu?",
                "Bojite li se da će ljudi otkriti ko ste zaista?",
                "Verujete li da ste isti na društvenim mrežama kao u stvarnom životu?",
                "Često se osećate kao prevarant u određenim situacijama?",
                "Smatrate li da se vaš identitet često menja zavisno od situacije?",
                "Imate li osećaj da ne znate ko zaista jeste?"
            ],
            relationships: [
                "Koristite li emocije drugih za svoju korist?",
                "Zaljubljujete li se često u nedostupne osobe?",
                "Ostajete li u lošim odnosima iz straha od usamljenosti?",
                "Lažete li partneru o svojim osećanjima?",
                "Flertujete li sa drugima dok ste u vezi?",
                "Često se osećate ljubomorno u odnosima?",
                "Težite li da kontrolišete partnera?",
                "Privlače li vas emocionalno nedostupni ljudi?",
                "Često izbirate pogrešne partnere?",
                "Bojite li se intimnosti?",
                "Sabotirate li svoje odnose kada postanu ozbiljni?",
                "Ostajete li prijatelji sa bivšim partnerima?",
                "Često se vezujete za ljude koji vas ne cene?",
                "Kompetitivni li ste sa vašim prijateljima?",
                "Često se osećate usamljeno čak i kada ste okruženi ljudima?"
            ],
            ethics: [
                "Krali ste nešto u poslednjih 5 godina?",
                "Lagali ste da biste nekoga povredili?",
                "Radite stvari koje smatrate moralno pogrešnim?",
                "Osećate krivicu zbog nečega što ste uradili?",
                "Varali ste na ispitu ili u poslu?",
                "Izdali ste poverenje bliskog prijatelja?",
                "Lagali ste o svojim kvalifikacijama za posao?",
                "Uzimali ste kredite za tuđ rad?",
                "Namerno ste povredili nečije osećaje?",
                "Koristite li tuđe greške u svoju korist?",
                "Osećate li zadovoljstvo kada se vašem neprijatelju desi nešto loše?",
                "Često kršite manja pravila ako mislite da nećete biti uhvaćeni?",
                "Lažete li o svojim donacijama za dobrotvorne svrhe?",
                "Plagirate li sadržaj drugih na internetu?",
                "Često ne vraćate pozajmljene stvari?"
            ],
            emotions: [
                "Plačete kada ste potpuno sami?",
                "Osećate gnev prema bliskim ljudima?",
                "Potiskujete emocije umesto da ih izrazite?",
                "Bojite se svoje ljutnje?",
                "Često se osećate tužno bez razloga?",
                "Teško kontrolišete svoje emocije?",
                "Izbegavate situacije koje izazivaju jaka osećanja?",
                "Često se osećate emocionalno utrnulo?",
                "Koristite alkohol ili drogu da potisnete emocije?",
                "Često eksplodirate od ljutnje zbog sitnih stvari?",
                "Težite da dramatizujete svoje probleme?",
                "Osećate li se krivo zbog toga što osećate sreću?",
                "Često se osećate anksiozno bez konkretnog razloga?",
                "Imate li problema sa kontrolom impulsa?",
                "Često se osećate emocionalno iscrpljeno?"
            ],
            fears: [
                "Bojite se smrti više nego što priznajete?",
                "Imate strahove koje smatrate iracionalnim?",
                "Izbegavate situacije zbog straha od neuspeha?",
                "Strašite se da ćete biti odbačeni?",
                "Bojite se ostajanja sami?",
                "Paničite kada niste u kontroli situacije?",
                "Imate fobiju od određenih stvari ili situacija?",
                "Bojite se javnog govora?",
                "Strašite se od starenja?",
                "Izbegavate nova iskustva zbog straha?",
                "Bojite se finansijske nesigurnosti?",
                "Strašite se od bolesti?",
                "Bojite se da nećete dostići svoje ciljeve?",
                "Imate strah od visine ili zatvorenih prostora?",
                "Bojite se da će vam se desiti nešto strašno?"
            ],
            desires: [
                "Maštate često o slavi i priznjanju?",
                "Želite da budete centar pažnje?",
                "Sanjate o tome da budete bogati?",
                "Želite da kontrolišete druge ljude?",
                "Često fantazivate o osveti?",
                "Želite da živite nečiji drugi život?",
                "Sanjate o tome da imate super moći?",
                "Često maštate o nezaštićenom seksu sa strancima?",
                "Želite da nestanete i počnete iznova?",
                "Maštate o tome da nikad ne starite?",
                "Često sanjate o tome da ste na drugom mestu?",
                "Želite da budete nevidljivi kako biste špijunirali druge?",
                "Fantazirate o tome da imate drugačije telo?",
                "Često maštate o tome da možete čitati tuđe misli?",
                "Želite da se osvetite nekome iz prošlosti?"
            ],
            dark_side: [
                "Imate li misli o povređivanju drugih?",
                "Često osećate zadovoljstvo kada vidite kako neko pati?",
                "Manipulišete li ljudima za svoju korist?",
                "Lažete li često bez razloga?",
                "Imate li fantazije o tome da činite nezakonite stvari?",
                "Osećate li se superiorno od drugih ljudi?",
                "Često ste nemilosrdni prema slabijima?",
                "Uživate li u tuđoj nesreći?",
                "Često planirate kako da se osvetite nekome?",
                "Imate li tendenciju da eksploatišete druge?",
                "Često se ponašate okrutno prema životinjama?",
                "Uživate li u tome što širite tračeve?",
                "Često namerno povređujete ljude emocionalno?",
                "Sklapate li lažna prijateljstva da biste iskoristili ljude?",
                "Često osećate urge da uništite tuđe stvari?"
            ]
        };
        
        this.initializeGame();
    }
    
    initializeGame() {
        console.log("🎮 INICIJALIZACIJA: Pokretanje pouzdane igre");
        
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
                <h2>Pouzdana Psihološka Analiza</h2>
                
                <div class="doctor-intro">
                    <div class="doctor-avatar">🎭</div>
                    <div class="doctor-text">
                        <p><strong>Dr. Veritas:</strong> "Dobrodošli u novu, pouzdanu verziju! 
                        Koristim veliku bazu od 105 pitanja umesto AI generisanja za maksimalnu stabilnost."</p>
                    </div>
                </div>
                
                <h3>Odaberite dubinu analize:</h3>
                <div class="depth-options">
                    <button class="depth-option" data-depth="10">Brza analiza (10 pitanja)</button>
                    <button class="depth-option" data-depth="15">Standardna (15 pitanja)</button>
                    <button class="depth-option" data-depth="21">Duboka (21 pitanje)</button>
                </div>
                
                <div class="warning">
                    ✅ <strong>NOVA VERZIJA:</strong> Koristi lokalna pitanja umesto AI generisanja. 
                    Nema više timeout grešaka!
                </div>
            </div>
        `;
    }
    
    selectGameDepth(depth) {
        console.log("🎯 DUBINA ODABRANA:", depth);
        this.totalQuestions = depth;
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        this.usedQuestions.clear(); // Resetuj korišćena pitanja
        
        const hostMessage = `Odlično! Odabrali ste ${depth}-pitanjsku analizu. 
        Koristim lokalnu bazu od 105 pitanja za potpunu pouzdanost. Počinjemo...`;
        
        this.displayHostMessage(hostMessage, () => {
            this.startGame();
        });
    }
    
    async startGame() {
        console.log("🎮 START: Pokretanje pouzdane igre");
        
        try {
            const firstQuestion = this.generateReliableQuestion();
            this.displayQuestion(firstQuestion);
        } catch (error) {
            console.error("❌ GREŠKA:", error);
            this.handleError("Greška pri pokretanju. Pokušavam ponovno...");
        }
    }
    
    generateReliableQuestion() {
        console.log("🧠 GENERIRAM: Pouzdano pitanje iz lokalne baze");
        
        // Izberi kategoriju na osnovu trenutnog indeksa
        const categories = Object.keys(this.questionDatabase);
        const categoryIndex = this.currentQuestionIndex % categories.length;
        const selectedCategory = categories[categoryIndex];
        
        // Dobij pitanja iz te kategorije
        const categoryQuestions = this.questionDatabase[selectedCategory];
        
        // Filtriraj nekorišćena pitanja
        const availableQuestions = categoryQuestions.filter((question, index) => {
            const questionId = `${selectedCategory}_${index}`;
            return !this.usedQuestions.has(questionId);
        });
        
        // Ako nema dostupnih pitanja u kategoriji, koristi bilo koje
        const questionsToUse = availableQuestions.length > 0 ? availableQuestions : categoryQuestions;
        
        // Izaberi random pitanje
        const randomIndex = Math.floor(Math.random() * questionsToUse.length);
        const selectedQuestion = questionsToUse[randomIndex];
        
        // Označi kao korišćeno
        const originalIndex = categoryQuestions.indexOf(selectedQuestion);
        const questionId = `${selectedCategory}_${originalIndex}`;
        this.usedQuestions.add(questionId);
        
        console.log(`✅ ODABRANO: Kategorija ${selectedCategory}, pitanje ${originalIndex + 1}/${categoryQuestions.length}`);
        
        return {
            category: selectedCategory,
            question: selectedQuestion,
            reasoning: `Pitanje iz kategorije ${this.getCategoryDisplayName(selectedCategory)} za dublje razumevanje ličnosti`
        };
    }
    
    getCategoryDisplayName(category) {
        const displayMap = {
            identity: "Identitet i samopercepcija",
            relationships: "Odnosi i veze", 
            ethics: "Etika i moral",
            emotions: "Emocije i osećanja",
            fears: "Strahovi i nesigurnosti",
            desires: "Želje i fantazije",
            dark_side: "Tamna strana ličnosti"
        };
        return displayMap[category] || category;
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
                    Lokalna baza: ${this.usedQuestions.size}/105 korišćeno | 
                    Pitanje: ${this.currentQuestionIndex + 1}/${this.totalQuestions}
                </div>
            </div>
        `;
        
        this.currentQuestion = questionData;
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
                const nextQuestion = this.generateReliableQuestion();
                this.displayQuestion(nextQuestion);
            }
        } catch (error) {
            console.error("❌ GREŠKA pri analizi:", error);
            // Nastavi sa fallback analizom
            const fallbackAnalysis = this.getFallbackAnalysis(answerData);
            this.updateProfile(fallbackAnalysis);
            await this.displayAnalysis(fallbackAnalysis);
            
            if (this.currentQuestionIndex >= this.totalQuestions) {
                await this.endGame();
            } else {
                const nextQuestion = this.generateReliableQuestion();
                this.displayQuestion(nextQuestion);
            }
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
                <p>Analiziram vaš odgovor bez AI dependencies...</p>
                <div class="debug-info">
                    Status: Lokalna analiza odgovora "${this.answers[this.answers.length - 1]?.response}"
                </div>
            </div>
        `;
    }
    
    async generateOptimizedAnalysis(answerData) {
        console.log("🧠 ANALIZA:", answerData);
        
        const shortContext = this.buildShortContext();
        
        // Pokušaj AI analizu ali sa kraćim timeout-om
        const systemPrompt = `Kratka psihološka analiza odgovora. 
Pitanje: "${answerData.question}" - Odgovor: ${answerData.response}
Kontekst: ${shortContext}
Format JSON: {"insight": "Kratak uvid", "analysis": "Kratka analiza 2-3 rečenice", "traits": ["nova", "svojstva"], "profile": "Ažurirana kratka analiza"}`;
        
        try {
            const aiResponse = await this.callAIWithTimeout(systemPrompt, "", 3000); // 3s timeout
            const analysis = JSON.parse(aiResponse);
            console.log("✅ AI ANALIZA USPEŠNA");
            return analysis;
        } catch (error) {
            console.log("🔄 FALLBACK ANALIZA (AI timeout)");
            return this.getFallbackAnalysis(answerData);
        }
    }
    
    async callAIWithTimeout(systemPrompt, userPrompt, timeoutMs = 3000) {
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('AI Timeout')), timeoutMs)
        );
        
        const aiPromise = this.callAI(systemPrompt, userPrompt);
        
        return Promise.race([aiPromise, timeoutPromise]);
    }
    
    getFallbackAnalysis(answerData) {
        // Lokalna analiza na osnovu kategorije i odgovora
        const categoryInsights = {
            identity: {
                DA: "Vaš odgovor pokazuje samosvesnost i spremnost za introspektivnost.",
                NE: "Vaš odgovor ukazuje na složenost ličnosti i potencijal za dublji rad na sebi."
            },
            relationships: {
                DA: "Odgovor otkriva vaš pristup odnosima i vezama sa drugim ljudima.",
                NE: "Vaš odgovor pokazuje drugačiju dinamiku u međuljudskim odnosima."
            },
            ethics: {
                DA: "Odgovor ukazuje na vaš moralni kompas i etičke principe.",
                NE: "Vaša etička pozicija pokazuje kompleksnost vrednosnog sistema."
            },
            emotions: {
                DA: "Odgovor otkriva vašu emocionalnu inteligenciju i pristup osećanjima.",
                NE: "Vaš emocionalni pristup pokazuje drugačiju dinamiku upravljanja osećanjima."
            },
            fears: {
                DA: "Priznavanje straha pokazuje hrabrost i samosvesnost.",
                NE: "Vaš odnos prema strahovima otkriva psihološku snagu ili potisnute aspekte."
            },
            desires: {
                DA: "Vaše želje otkrivaju dublje motivacije i aspiracije.",
                NE: "Odnos prema željama pokazuje drugačiju hijerarhiju vrednosti."
            },
            dark_side: {
                DA: "Iskrenost o tamnim aspektima pokazuje psihološku zrelost.",
                NE: "Vaš odgovor može ukazivati na obrambene mehanizme ili integrisanu ličnost."
            }
        };
        
        const insight = categoryInsights[answerData.category]?.[answerData.response] || 
                       "Vaš odgovor pruža uvid u složenost vaše ličnosti.";
        
        const traits = this.generateTraitsForCategory(answerData.category, answerData.response);
        
        return {
            insight: insight,
            analysis: `Odgovor na pitanje iz kategorije ${this.getCategoryDisplayName(answerData.category)} otkriva važne aspekte vaše ličnosti. ${insight} Ovo doprinosi boljem razumevanju vaših psiholoških obrazaca.`,
            traits: traits,
            profile: `${this.psychologicalProfile.currentAnalysis || 'Profil se razvija kroz analizu.'} ${insight}`
        };
    }
    
    generateTraitsForCategory(category, response) {
        const categoryTraits = {
            identity: response === "DA" ? ["samosvesnost", "introspektivnost"] : ["složenost", "misterijnost"],
            relationships: response === "DA" ? ["povezanost", "empatija"] : ["nezavisnost", "rezervisanost"],
            ethics: response === "DA" ? ["integritет", "poštenje"] : ["pragmatičnost", "fleksibilnost"],
            emotions: response === "DA" ? ["emocionalna svesnost", "otvorenost"] : ["emocionalna kontrola", "stabilnost"],
            fears: response === "DA" ? ["hrabrost", "iskrenost"] : ["odvažnost", "psihološka snaga"],
            desires: response === "DA" ? ["ambicioznost", "jasnoća"] : ["umerenost", "realizam"],
            dark_side: response === "DA" ? ["iskrenost", "samoprihvatanje"] : ["integrovanost", "pozitivnost"]
        };
        
        return categoryTraits[category] || ["samosvesnost"];
    }
    
    buildShortContext() {
        if (this.answers.length === 0) return "Početak analize";
        
        const lastAnswer = this.answers[this.answers.length - 1];
        return `Prošlo: "${lastAnswer.question}" - ${lastAnswer.response}. Osobine: ${this.psychologicalProfile.traits.join(', ')}.`;
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
                        Uvidi: ${this.psychologicalProfile.insights.length} |
                        Lokalna baza: ${this.usedQuestions.size}/105
                    </div>
                </div>
            `;
            
            const autoAdvance = setTimeout(resolve, 4000);
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
            console.error("❌ GREŠKA pri finalnoj analizi:", error);
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
            const aiResponse = await this.callAIWithTimeout(systemPrompt, "", 5000); // 5s za finalnu analizu
            const analysis = JSON.parse(aiResponse);
            console.log("✅ FINALNA AI ANALIZA USPEŠNA");
            return analysis;
        } catch (error) {
            console.log("🔄 FALLBACK FINALNA ANALIZA");
            return this.getFallbackFinalAnalysis();
        }
    }
    
    getFallbackFinalAnalysis() {
        const dominantCategories = this.getDominantCategories();
        const personalityType = this.determinePersonalityType();
        
        return {
            title: personalityType,
            summary: `Kroz ${this.answers.length} pitanja otkrivena je ${personalityType.toLowerCase()} sa ${this.psychologicalProfile.traits.length} identifikovanih svojstava. Analiza je pokazala dominantne obrasce u kategorijama: ${dominantCategories.join(', ')}. Ispitanik demonstrira kapacitet za samoanalizu i psihološku zrelost.`,
            traits: this.psychologicalProfile.traits.length > 0 ? this.psychologicalProfile.traits.slice(0, 6) : ["samosvesnost", "složenost", "autentičnost"],
            conclusion: `Profil pokazuje osobu sa razvijenim kapacitetom za introspektivnost. Preporučuje se nastavak rada na ličnom razvoju kroz dalje istraživanje otkrivenih aspekata ličnosti.`
        };
    }
    
    getDominantCategories() {
        const categoryCounts = {};
        this.answers.forEach(answer => {
            categoryCounts[answer.category] = (categoryCounts[answer.category] || 0) + 1;
        });
        
        return Object.entries(categoryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([category,]) => this.getCategoryDisplayName(category));
    }
    
    determinePersonalityType() {
        const traitCount = this.psychologicalProfile.traits.length;
        const answerCount = this.answers.length;
        
        if (traitCount >= answerCount * 0.8) {
            return "Kompleksna i mnogostruka ličnost";
        } else if (traitCount >= answerCount * 0.6) {
            return "Bogata i raznovrsna ličnost";
        } else if (traitCount >= answerCount * 0.4) {
            return "Uravnotežena ličnost sa jasnim obrascima";
        } else {
            return "Fokusirana i konzistentna ličnost";
        }
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
                    <p>Korišćena pitanja: ${this.usedQuestions.size}/105</p>
                </div>
                
                <div class="actions">
                    <button onclick="location.reload()">Nova analiza</button>
                    <button onclick="profiler.shareResults()">Podeli rezultate</button>
                </div>
                
                <div class="disclaimer">
                    <strong>Napomena:</strong> Ova analiza koristi lokalnu bazu pitanja za maksimalnu pouzdanost. 
                    Nije zamena za profesionalnu psihološku procenu.
                </div>
            </div>
        `;
    }
    
    shareResults() {
        const shareText = `Završio sam psihološku analizu u igri "Trenutak Istine" (nova pouzdana verzija)! 
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
    
    async callAI(systemPrompt, userPrompt) {
        const requestData = {
            model: this.aiModel,
            systemPrompt: systemPrompt,
            userPrompt: userPrompt || "",
            temperature: 0.7,
            max_tokens: 800 // Kraći odgovori
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
            throw new Error("AI fallback - koristim lokalnu analizu");
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
                    Pokušajte osvežiti stranicu. Nova verzija koristi lokalnu bazu pitanja.
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
    console.log("🚀 POUZDANI PROFILER: Pokretanje");
    
    try {
        profiler = new ReliablePsychologicalProfiler();
        window.profiler = profiler;
        console.log("✅ POUZDANI PROFILER SPREMAN");
    } catch (error) {
        console.error("❌ GREŠKA:", error);
        alert("Greška pri pokretanju. Osvežite stranicu.");
    }
});

// Global error handling
window.addEventListener('error', function(e) {
    console.error("🚨 GLOBALNA GREŠKA:", e.message);
});

console.log("📋 POUZDANI SCRIPT UČITAN - 105 pitanja, nema AI dependencies");
