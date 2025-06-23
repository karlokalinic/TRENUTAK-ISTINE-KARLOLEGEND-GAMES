// =============================================================================
// TRENUTAK ISTINE - AI POWERED PSYCHOLOGICAL PROFILING GAME
// Napredna psihološka analiza s adaptivnim postavljanjem pitanja
// ISPRAVKA: Riješen problem s game-container elementom i dodano debug praćenje
// =============================================================================

console.log("🎭 TRENUTAK ISTINE - AI IZDANJE - POKRETANJE SISTEMA");
console.log("📋 Verzija: 2.0 - Napredna psihološka analiza");

class PsychologicalProfiler {
    constructor() {
        console.log("🔧 INICIJALIZACIJA: Kreiranje PsychologicalProfiler instance");
        
        // Konfiguracija igre
        this.questionDepthOptions = [15, 21, 30]; // Varijabilna dubina analize
        this.currentQuestionIndex = 0;
        this.totalQuestions = 21; // Default vrijednost
        this.answers = [];
        this.psychologicalProfile = {
            traits: [],
            contradictions: [],
            deepInsights: [],
            behavioralPatterns: [],
            emotionalState: {},
            currentAnalysis: ""
        };
        
        console.log("📊 KONFIGURACIJA: Osnovne postavke učitane", {
            dubineAnalize: this.questionDepthOptions,
            defaultPitanja: this.totalQuestions
        });
        
        // AI model konfiguracija
        this.aiModel = "deepseek/deepseek-r1:free";
        this.conversationHistory = [];
        
        console.log("🤖 AI MODEL: Konfiguriran", {
            model: this.aiModel,
            provider: "OpenRouter"
        });
        
        // Trenutno stanje igre
        this.gameStarted = false;
        this.gameCompleted = false;
        
        // Psihološke kategorije i njihova težina
        this.psychologicalCategories = {
            identity: {
                name: "Identitet i samopercepcija",
                weight: 1.0,
                exploredDepth: 0,
                questions: [
                    "Jeste li ikada slagali na životopisu kako biste dobili posao?",
                    "Jeste li ikada glumili da ste netko drugi kako bi se uklopili u društvo?",
                    "Mislite li da ste u duši dobra osoba?",
                    "Postoji li dio vašeg identiteta koji skrivate od drugih?",
                    "Osjećate li se ponekad kao da nosite masku u javnosti?",
                    "Biste li radije bili poznati ili sretni?",
                    "Vjerujete li da ste bolji od većine ljudi?",
                    "Osjećate li se često neautentično u društvenim situacijama?",
                    "Imate li osjećaj da nikad niste bili potpuno iskreni prema sebi?",
                    "Postoji li verzija vas koju samo vi poznajete?"
                ]
            },
            relationships: {
                name: "Odnosi i privrženost",
                weight: 1.2,
                exploredDepth: 0,
                questions: [
                    "Biste li prihvatili milijun eura da više nikada ne razgovarate s najboljim prijateljem?",
                    "Jeste li ikada bili nevjerni partneru?",
                    "Jeste li ikada izdali povjerenje bliskog prijatelja?",
                    "Jeste li ikada pomislili da biste bili sretniji s nekim drugim partnerom?",
                    "Postoji li osoba kojoj se nikada nećete ispričati iako znate da ste pogriješili?",
                    "Skrivate li neke tajne od svojih najbližih?",
                    "Jeste li ikada koristili nečije emocije da biste dobili što želite?",
                    "Biste li izabrali romantičnu ljubav ili duboko prijateljstvo ako možete imati samo jedno?",
                    "Jeste li ikada namjerno povrijedili nekoga koji vas je volio?",
                    "Postoji li osoba čiju smrt biste potajno pozdravili?"
                ]
            },
            ethics: {
                name: "Etika i moral",
                weight: 1.3,
                exploredDepth: 0,
                questions: [
                    "Jeste li ikada uzeli nešto iz trgovine, a da niste platili?",
                    "Jeste li ikada učinili nešto nemoralno za novac?",
                    "Biste li prekršili zakon ako znate da nećete biti uhvaćeni?",
                    "Jeste li ikada prijavili lažne podatke na poreznoj prijavi?",
                    "Jeste li ikada namjerno povrijedili nekoga?",
                    "Postoji li situacija u kojoj smatrate da je krađa opravdana?",
                    "Biste li prijavili prijatelja koji je počinio ozbiljno kazneno djelo?",
                    "Postoji li neko vaše djelo zbog kojeg bi vas drugi prezirali kad bi znali?",
                    "Jeste li ikada uživali u nečijoj patnji?",
                    "Postoji li osoba koju biste mogli ubiti da znate da nećete biti uhvaćeni?"
                ]
            },
            emotions: {
                name: "Emocije i njihova regulacija",
                weight: 1.1,
                exploredDepth: 0,
                questions: [
                    "Osjećate li često emocije koje ne možete kontrolirati?",
                    "Jeste li ikada željeli zlo nekome tko vam je blizak?",
                    "Osjećate li ponekad zadovoljstvo kad drugi ljudi pate?",
                    "Jeste li ikada poželjeli smrt članu obitelji?",
                    "Skrivate li svoje prave emocije od drugih?",
                    "Jeste li ikada plakali zbog nečega što biste smatrali trivijalnim?",
                    "Imate li noćne more o stvarima koje ste učinili?",
                    "Plašite li se svojih vlastitih misli ponekad?",
                    "Jeste li ikada imali fantazije o nasilju prema drugima?",
                    "Postoji li emocija koju nikad niste pokazali drugoj osobi?"
                ]
            },
            dark_desires: {
                name: "Tamne želje i fantazije",
                weight: 1.5,
                exploredDepth: 0,
                questions: [
                    "Imate li fantazije koje nikada niste podijelili s drugima?",
                    "Jeste li ikada razmišljali o tome kako bi bilo napustiti svoj trenutni život i početi ispočetka?",
                    "Privlači li vas ideja moći nad drugima?",
                    "Imate li seksualne fantazije koje vas srame?",
                    "Jeste li ikada maštali o osveti prema nekome tko vas je povrijedio?",
                    "Imate li tajne ovisnosti koje skrivate od drugih?",
                    "Jeste li ikada fantazirali o tome da učinite nešto ilegalno?",
                    "Postoji li tajna želja za koju mislite da bi šokirala ljude koji vas poznaju?",
                    "Jeste li ikada poželili da možete kontrolirati misli drugih ljudi?",
                    "Postoji li dio vas koji uživa u kontroli i dominaciji nad drugima?"
                ]
            },
            family: {
                name: "Obiteljska dinamika",
                weight: 1.4,
                exploredDepth: 0,
                questions: [
                    "Postoji li član obitelji kojeg ne volite?",
                    "Skrivate li važne aspekte svog života od svoje obitelji?",
                    "Da možete izbrisati jednu osobu iz svoje obitelji, biste li to učinili?",
                    "Vjerujete li da vaši roditelji imaju tajne koje nikada nisu podijelili s vama?",
                    "Jeste li ikada požalili što ste dobili dijete?",
                    "Jeste li ikada osjećali da ne pripadate svojoj obitelji?",
                    "Postoji li obiteljska tajna koju čuvate?",
                    "Osjećate li se ponekad da vas obitelj ne razumije ili ne prihvaća?",
                    "Jeste li ikada poželili da se nikad niste rodili u svojoj obitelji?",
                    "Postoji li član obitelji čiju smrt ne biste oplakivali?"
                ]
            }
        };
        
        console.log("🧠 PSIHOLOŠKE KATEGORIJE: Učitano", {
            brojKategorija: Object.keys(this.psychologicalCategories).length,
            ukupnoPitanja: Object.values(this.psychologicalCategories).reduce((sum, cat) => sum + cat.questions.length, 0)
        });
        
        // Matrica za sljedeće pitanje na temelju kategorije i odgovora
        this.nextQuestionMatrix = {
            identity: {
                yes: ["dark_desires", "ethics", "emotions"],
                no: ["relationships", "family", "identity"]
            },
            relationships: {
                yes: ["ethics", "dark_desires", "family"],
                no: ["identity", "emotions", "relationships"]
            },
            ethics: {
                yes: ["dark_desires", "emotions", "family"],
                no: ["identity", "relationships", "ethics"]
            },
            emotions: {
                yes: ["dark_desires", "family", "ethics"],
                no: ["relationships", "identity", "emotions"]
            },
            dark_desires: {
                yes: ["emotions", "ethics", "family"],
                no: ["identity", "relationships", "dark_desires"]
            },
            family: {
                yes: ["emotions", "dark_desires", "ethics"],
                no: ["relationships", "identity", "family"]
            }
        };
        
        console.log("🎯 MATRICA PITANJA: Konfigurirana za adaptivno postavljanje");
        
        this.initializeGame();
    }
    
    // Inicijalizacija igre i UI elemenata - ISPRAVKA za game-container problem
    initializeGame() {
        console.log("🚀 INICIJALIZACIJA: Pokretanje igre");
        
        // ISPRAVKA: Prvo provjeri postojanje app-container elementa
        const appContainer = document.getElementById('app-container');
        if (!appContainer) {
            console.error("❌ GREŠKA: app-container element ne postoji!");
            alert("Kritična greška: HTML struktura nije ispravna. Molimo kontaktirajte podršku.");
            return;
        }
        
        console.log("✅ APP CONTAINER: Pronađen", appContainer);
        
        // Kreira game-container element unutar app-container ako ne postoji
        let gameContainer = document.getElementById('game-container');
        if (!gameContainer) {
            console.log("🔧 KREIRANJE: game-container element ne postoji, kreiram novi");
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
            appContainer.innerHTML = ''; // Očisti postojeći sadržaj
            appContainer.appendChild(gameContainer);
            console.log("✅ GAME CONTAINER: Kreiran i dodan u DOM");
        }
        
        this.gameContainer = gameContainer;
        console.log("🎮 GAME CONTAINER: Referenca postavljena", this.gameContainer);
        
        this.setupEventListeners();
        this.displayWelcomeScreen();
    }
    
    // Postavljanje event listenera
    setupEventListeners() {
        console.log("🔗 EVENT LISTENERS: Postavljanje event listenera");
        
        // Globalni click handler za sve dugmad
        document.addEventListener('click', (e) => {
            console.log("🖱️ CLICK EVENT:", e.target.className, e.target.dataset);
            
            // Dugmad za dubinu analize
            if (e.target.classList.contains('depth-option')) {
                const depth = parseInt(e.target.dataset.depth);
                console.log("📊 DUBINA ODABRANA:", depth);
                this.selectGameDepth(depth);
            }
            
            // Dugmad za odgovore DA/NE
            if (e.target.classList.contains('answer-btn')) {
                const answer = e.target.dataset.answer;
                console.log("💬 ODGOVOR:", answer);
                this.handleAnswer(answer);
            }
            
            // Continue dugmad
            if (e.target.classList.contains('continue-btn') || e.target.classList.contains('continue-message-btn')) {
                console.log("➡️ NASTAVLJANJE");
                if (window.continueGame) {
                    window.continueGame();
                }
            }
        });
        
        // Debug dugme za testiranje AI veze
        const testButton = document.getElementById('test-ai');
        if (testButton) {
            testButton.addEventListener('click', () => {
                console.log("🧪 TEST AI: Pokretanje testa AI konekcije");
                this.testAIConnection();
            });
        }
        
        console.log("✅ EVENT LISTENERS: Postavljeni uspješno");
    }
    
    // Prikaz početnog ekrana - ISPRAVKA
    displayWelcomeScreen() {
        console.log("🏠 WELCOME SCREEN: Prikaz početnog ekrana");
        
        if (!this.gameContainer) {
            console.error("❌ GREŠKA: gameContainer referenca ne postoji!");
            return;
        }
        
        this.gameContainer.innerHTML = `
            <div class="welcome-screen">
                <h1 class="game-title">TRENUTAK ISTINE</h1>
                <p class="game-subtitle">AI izdanje - Psihološka analiza bez granica</p>
                
                <div class="ai-host-intro">
                    <div class="host-avatar">🎭</div>
                    <div class="host-message">
                        <p><strong>Dr. Veritas:</strong> "Dobrodošli u psihološku laboratoriju uma. Ja sam Dr. Veritas, vaš vodič kroz najdublje zakutke vaše psihe. 
                        Postavljat ću vam pitanja koja će postepno skidati sve maske koje nosite. Svaki vaš odgovor će mi otkriti nove slojeve vaše ličnosti."</p>
                        
                        <p>"Budite spremni suočiti se s istinima koje možda ne želite priznati ni sebi. 
                        Jedini način da prođete ovaj test je potpuna iskrenost - svaka laž će biti otkrivena kroz psihološku analizu."</p>
                    </div>
                </div>
                
                <div class="depth-selection">
                    <h3>Odaberite dubinu psihološke analize:</h3>
                    <div class="depth-options">
                        <button class="depth-option surface" data-depth="15">
                            <span class="depth-number">15</span>
                            <span class="depth-label">Površinska</span>
                            <span class="depth-desc">Osnovni uvid u personalnost</span>
                        </button>
                        <button class="depth-option standard" data-depth="21">
                            <span class="depth-number">21</span>
                            <span class="depth-label">Standardna</span>
                            <span class="depth-desc">Dublja psihološka analiza</span>
                        </button>
                        <button class="depth-option deep" data-depth="30">
                            <span class="depth-number">30</span>
                            <span class="depth-label">Dubinska</span>
                            <span class="depth-desc">Potpuna dekonstrukcija ličnosti</span>
                        </button>
                    </div>
                </div>
                
                <div class="warning-box">
                    <h4>⚠️ UPOZORENJE</h4>
                    <p>Ova igra koristi naprednu AI analizu koja može otkriti duboko skrivene aspekte vaše ličnosti. 
                    Rezultati mogu biti uznemirujući. Igrajte samo ako ste psihički spremni suočiti se s istinom o sebi.</p>
                </div>
                
                <div class="debug-section" style="margin-top: 20px; padding: 10px; background: #333; border-radius: 5px;">
                    <button id="test-ai" style="background: #666; color: white; border: none; padding: 10px; border-radius: 3px; cursor: pointer;">
                        🧪 Test AI konekcije
                    </button>
                </div>
            </div>
        `;
        
        console.log("✅ WELCOME SCREEN: Uspješno prikazan");
        
        // Ponovo postavi event listenere za nova dugmad
        this.setupEventListeners();
    }
    
    // Odabir dubine igre
    selectGameDepth(depth) {
        console.log("🎯 DUBINA ODABRANA:", depth);
        this.totalQuestions = depth;
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        
        // Početna poruka AI host-a
        const hostMessage = `Odlično. Odabrali ste ${depth}-pitanjsku analizu. Pripremite se za putovanje u dubine vaše psihe. 
        Svako pitanje će biti pametno odabrano na temelju vaših prethodnih odgovora. Počinjemo...`;
        
        console.log("🎭 DR. VERITAS:", hostMessage);
        
        this.displayHostMessage(hostMessage, () => {
            console.log("🚀 POKRETANJE: Početak igre");
            this.startGame();
        });
    }
    
    // Početak igre
    async startGame() {
        console.log("🎮 START GAME: Pokretanje glavne igre");
        
        try {
            // Generiraj prvo pitanje pomoću AI-ja
            console.log("🤖 AI: Generiranje prvog pitanja...");
            const firstQuestion = await this.generateSmartQuestion();
            console.log("✅ PRVO PITANJE:", firstQuestion);
            this.displayQuestion(firstQuestion);
        } catch (error) {
            console.error("❌ GREŠKA pri pokretanju igre:", error);
            alert("Došlo je do greške pri pokretanju igre. Molimo pokušajte ponovno.");
        }
    }
    
    // Pametan generator pitanja koji koristi AI
    async generateSmartQuestion() {
        console.log("🧠 AI GENERATOR: Generiranje pametnog pitanja");
        const context = this.buildContextForAI();
        console.log("📋 KONTEKST ZA AI:", context);
        
        const systemPrompt = `Ti si Dr. Veritas, psiholog specijalist za dubinsku analizu ličnosti. 
        Vodiš psihološku igru "Trenutak Istine" gdje postavljaš sve dublja i intimnija pitanja kako bi otkrio sve tajne ispitanika.
        
        TVOJ ZADATAK:
        1. Na temelju konteksta odaberi koje psihološko područje treba istražiti
        2. Postavi pitanje koje je DA/NE tip
        3. Pitanje mora biti intimno, neugodno i direktno
        4. Cilj je doći do najdubljih tajni i srama
        5. Koristi psihološke tehnike za probijanje psihičkih obrana
        
        DOSTUPNE KATEGORIJE: identity, relationships, ethics, emotions, dark_desires, family
        
        KONTEKST DOSADAŠNJIH ODGOVORA: ${context}
        
        Odgovori SAMO sa pitanjem u obliku JSON:
        {"category": "kategorija", "question": "Tvoje pitanje?", "reasoning": "Zašto ovo pitanje"}`;
        
        try {
            console.log("📤 AI ZAHTJEV: Šaljem zahtjev AI modelu");
            const aiResponse = await this.callAI(systemPrompt, "");
            console.log("📥 AI ODGOVOR:", aiResponse);
            
            const questionData = JSON.parse(aiResponse);
            console.log("✅ PARSIRANO PITANJE:", questionData);
            
            return {
                category: questionData.category,
                question: questionData.question,
                reasoning: questionData.reasoning
            };
        } catch (error) {
            console.error("❌ GREŠKA pri generiranju pitanja:", error);
            console.log("🔄 FALLBACK: Koristim rezervno pitanje");
            return this.getFallbackQuestion();
        }
    }
    
    // Izgradnja konteksta za AI na temelju dosadašnjih odgovora
    buildContextForAI() {
        if (this.answers.length === 0) {
            console.log("📋 KONTEKST: Početak analize - nema dosadašnjih odgovora");
            return "Početak analize - nema dosadašnjih odgovora.";
        }
        
        let context = `Dosadašnji odgovori ispitanika (${this.answers.length}/${this.totalQuestions}):\n`;
        
        this.answers.forEach((answer, index) => {
            context += `${index + 1}. "${answer.question}" - Odgovor: ${answer.response}\n`;
            if (answer.category) {
                context += `   Kategorija: ${answer.category}\n`;
            }
        });
        
        context += `\nTrenutna psihološka analiza: ${this.psychologicalProfile.currentAnalysis}\n`;
        context += `\nUtvrđene osobine: ${this.psychologicalProfile.traits.join(', ')}\n`;
        
        console.log("📋 KONTEKST IZGRAĐEN:", context.length, "znakova");
        return context;
    }
    
    // Fallback pitanje ako AI ne radi
    getFallbackQuestion() {
        console.log("🔄 FALLBACK: Generiram rezervno pitanje");
        const allCategories = Object.keys(this.psychologicalCategories);
        const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        const categoryData = this.psychologicalCategories[randomCategory];
        const randomQuestion = categoryData.questions[Math.floor(Math.random() * categoryData.questions.length)];
        
        const fallbackQuestion = {
            category: randomCategory,
            question: randomQuestion,
            reasoning: "Fallback pitanje zbog problema s AI-jem"
        };
        
        console.log("✅ FALLBACK PITANJE:", fallbackQuestion);
        return fallbackQuestion;
    }
    
    // Prikaz pitanja
    displayQuestion(questionData) {
        console.log("❓ PRIKAZ PITANJA:", questionData);
        
        const progressPercent = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        console.log("📊 PROGRES:", `${this.currentQuestionIndex + 1}/${this.totalQuestions} (${progressPercent.toFixed(1)}%)`);
        
        this.gameContainer.innerHTML = `
            <div class="question-screen">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    <span class="progress-text">Pitanje ${this.currentQuestionIndex + 1} od ${this.totalQuestions}</span>
                </div>
                
                <div class="ai-host">
                    <div class="host-avatar">🎭</div>
                    <div class="host-name">Dr. Veritas</div>
                </div>
                
                <div class="question-container">
                    <div class="question-category">${this.getCategoryDisplayName(questionData.category)}</div>
                    <h2 class="current-question">${questionData.question}</h2>
                    
                    <div class="reasoning-box">
                        <small><em>Psihološki razlog ovog pitanja: ${questionData.reasoning}</em></small>
                    </div>
                </div>
                
                <div class="answer-buttons">
                    <button class="answer-btn yes-btn" data-answer="da">
                        <span class="btn-text">DA</span>
                        <span class="btn-subtitle">Istinito</span>
                    </button>
                    <button class="answer-btn no-btn" data-answer="ne">
                        <span class="btn-text">NE</span>
                        <span class="btn-subtitle">Neistinito</span>
                    </button>
                </div>
                
                ${this.psychologicalProfile.currentAnalysis ? `
                    <div class="current-analysis">
                        <h4>Trenutna psihološka analiza:</h4>
                        <p>${this.psychologicalProfile.currentAnalysis}</p>
                    </div>
                ` : ''}
                
                <div class="debug-info" style="margin-top: 20px; padding: 10px; background: #333; border-radius: 5px; font-size: 12px;">
                    <strong>Debug Info:</strong><br>
                    Pitanje: ${this.currentQuestionIndex + 1}/${this.totalQuestions}<br>
                    Kategorija: ${questionData.category}<br>
                    AI Model: ${this.aiModel}
                </div>
            </div>
        `;
        
        // Spremi trenutno pitanje
        this.currentQuestion = questionData;
        console.log("✅ PITANJE PRIKAZANO:", this.currentQuestion);
    }
    
    // Dobivanje display imena kategorije
    getCategoryDisplayName(category) {
        const categoryMap = {
            identity: "Identitet i samopercepcija",
            relationships: "Odnosi i privrženost", 
            ethics: "Etika i moral",
            emotions: "Emocije i regulacija",
            dark_desires: "Tamne želje i fantazije",
            family: "Obiteljska dinamika"
        };
        return categoryMap[category] || category;
    }
    
    // Rukovanje odgovorom
    async handleAnswer(answer) {
        console.log("💬 RUKOVANJE ODGOVOROM:", answer);
        
        // Spremi odgovor
        const answerData = {
            question: this.currentQuestion.question,
            response: answer,
            category: this.currentQuestion.category,
            questionIndex: this.currentQuestionIndex,
            timestamp: new Date().toISOString()
        };
        
        this.answers.push(answerData);
        this.currentQuestionIndex++;
        
        console.log("📝 ODGOVOR SPREMLJEN:", answerData);
        console.log("📊 UKUPNO ODGOVORA:", this.answers.length);
        
        // Prikaži loading dok AI analizira
        this.showAnalysisLoading();
        
        try {
            // Generiraj AI analizu odgovora
            console.log("🧠 AI ANALIZA: Pokretanje analize odgovora");
            const analysis = await this.generatePsychologicalAnalysis(answerData);
            console.log("✅ AI ANALIZA GOTOVA:", analysis);
            
            // Ažuriraj psihološki profil
            this.updatePsychologicalProfile(analysis);
            console.log("📋 PROFIL AŽURIRAN:", this.psychologicalProfile);
            
            // Prikaži analizu
            await this.displayAnalysis(analysis);
            
            // Provjeri je li igra završena
            if (this.currentQuestionIndex >= this.totalQuestions) {
                console.log("🏁 KRAJ IGRE: Sva pitanja odgovorena");
                await this.endGame();
            } else {
                // Generiraj sljedeće pitanje
                console.log("➡️ SLJEDEĆE PITANJE: Generiranje", `${this.currentQuestionIndex + 1}/${this.totalQuestions}`);
                const nextQuestion = await this.generateSmartQuestion();
                this.displayQuestion(nextQuestion);
            }
        } catch (error) {
            console.error("❌ GREŠKA pri rukovanju odgovorom:", error);
            alert("Došlo je do greške. Pokušajte ponovno.");
        }
    }
    
    // Prikaz loading animacije tijekom analize
    showAnalysisLoading() {
        console.log("⏳ LOADING: Prikaz analize u tijeku");
        
        this.gameContainer.innerHTML = `
            <div class="analysis-loading">
                <div class="ai-host">
                    <div class="host-avatar thinking">🎭</div>
                    <div class="host-name">Dr. Veritas</div>
                </div>
                
                <div class="loading-text">
                    <h3>Analiziram vaš odgovor...</h3>
                    <div class="loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                    </div>
                    <p>Prodirijem u dubine vaše psihe...</p>
                </div>
                
                <div class="analysis-progress">
                    <div class="analysis-bar"></div>
                </div>
                
                <div class="debug-loading" style="margin-top: 20px; padding: 10px; background: #333; border-radius: 5px; font-size: 12px;">
                    <strong>AI Status:</strong> Šalje zahtjev na OpenRouter API<br>
                    <strong>Model:</strong> ${this.aiModel}<br>
                    <strong>Odgovor:</strong> ${this.answers[this.answers.length - 1]?.response}
                </div>
            </div>
        `;
    }
    
    // Generiranje psihološke analize pomoću AI-ja
    async generatePsychologicalAnalysis(answerData) {
        console.log("🧠 PSIHOLOŠKA ANALIZA: Pokretanje", answerData);
        
        const context = this.buildFullAnalysisContext();
        
        const systemPrompt = `Ti si Dr. Veritas, renomirani psiholog specijalist za dubinsku analizu ličnosti i psihijatar forenzijske psihologije.
        
        TVOJ ZADATAK je analizirati odgovor ispitanika i proširiti postojeću psihološku analizu.
        
        PRAVILA ANALIZE:
        1. Budi BRUTALNO iskren i direktan - bez cenzure
        2. Koristi stručnu psihološku terminologiju
        3. Analiziraj što odgovor otkriva o ličnosti
        4. Proširuj postojeću analizu - NIKAD je ne mijenjaj potpuno
        5. Ako je odgovor kontradiktorni, objasni psihološki zašto
        6. Idi duboko u motiva, strahove, i potisnute aspekte
        7. Koristi koncepte iz dubinske psihologije, psihoanaliza, kognitivne psihologije
        8. Budi što konkretniji o osobinama ličnosti
        9. Analiziraj mehanizme obrane, projekcije, potiskivanje
        10. Generiraj DUGU (minimum 300 riječi) i detaljnu analizu
        
        TRENUTNI KONTEKST: ${context}
        
        NAJNOVIJI ODGOVOR: "${answerData.question}" - ${answerData.response}
        
        Generiraj detaljnu psihološku analizu ovog odgovora kao JSON:
        {
            "immediateInsight": "Što ovaj odgovor odmah otkriva",
            "deepAnalysis": "Duboka psihološka analiza",
            "personalityTraits": ["lista novih osobina"],
            "psychologicalMechanisms": ["obrasci ponašanja i obrane"],
            "expandedProfile": "Proširena analiza koja nadovezuje na postojeću",
            "contradictions": "Ako je kontradiktorni odgovor, objasni zašto",
            "futureProbing": "Što dalje istražiti"
        }`;
        
        try {
            console.log("📤 AI ZAHTJEV: Šalje se analiza na AI model");
            const aiResponse = await this.callAI(systemPrompt, "");
            console.log("📥 AI ANALIZA ODGOVOR:", aiResponse.substring(0, 200) + "...");
            
            const analysis = JSON.parse(aiResponse);
            console.log("✅ ANALIZA PARSIRANA:", Object.keys(analysis));
            return analysis;
        } catch (error) {
            console.error("❌ GREŠKA pri AI analizi:", error);
            console.log("🔄 FALLBACK: Koristim rezervnu analizu");
            return this.getFallbackAnalysis(answerData);
        }
    }
    
    // Izgradnja punog konteksta za analizu
    buildFullAnalysisContext() {
        let context = `DOSADAŠNJA ANALIZA: ${this.psychologicalProfile.currentAnalysis}\n\n`;
        context += `UTVRĐENE OSOBINE: ${this.psychologicalProfile.traits.join(', ')}\n\n`;
        context += `KONTRADIKCE: ${this.psychologicalProfile.contradictions.join(', ')}\n\n`;
        context += `DOSADAŠNJI ODGOVORI:\n`;
        
        this.answers.forEach((answer, index) => {
            context += `${index + 1}. "${answer.question}" - ${answer.response} (Kategorija: ${answer.category})\n`;
        });
        
        console.log("📋 PUNI KONTEKST IZGRAĐEN:", context.length, "znakova");
        return context;
    }
    
    // Fallback analiza ako AI ne radi
    getFallbackAnalysis(answerData) {
        console.log("🔄 FALLBACK ANALIZA za:", answerData);
        return {
            immediateInsight: `Odgovor "${answerData.response}" na pitanje o ${answerData.category} ukazuje na dublje psihološke obrasce.`,
            deepAnalysis: `Ovaj odgovor otkriva kompleksnu dinamiku u ispitaniku. Na temelju odgovora "${answerData.response}", možemo uočiti određene obrambene mehanizme i emocionalne reakcije koje zaslužuju dublju analizu. Ispitanik pokazuje znakove ambivalentnosti u svojem odgovoru što može ukazivati na unutarnji konflikt između svjesnih i nesvjesnih motivacija.`,
            personalityTraits: ["kompleksnost", "ambivalentnost", "introspektivnost"],
            psychologicalMechanisms: ["potiskivanje", "racionalizacija", "projekcija"],
            expandedProfile: `Ispitanik pokazuje složene psihološke obrasce koji zahtijevaju dublju analizu. ${this.psychologicalProfile.currentAnalysis} Dodatno, najnoviji odgovor sugerira dublje slojeve ličnosti koji možda nisu u potpunosti integrirani u svjesnu samopercepciju.`,
            contradictions: "",
            futureProbing: "Istražiti dublje motivacije i strahove povezane s ovom kategorijom."
        };
    }
    
    // Ažuriranje psihološkog profila
    updatePsychologicalProfile(analysis) {
        console.log("📋 AŽURIRANJE PROFILA:", analysis);
        
        // Dodaj nove osobine
        analysis.personalityTraits.forEach(trait => {
            if (!this.psychologicalProfile.traits.includes(trait)) {
                this.psychologicalProfile.traits.push(trait);
                console.log("➕ NOVA OSOBINA:", trait);
            }
        });
        
        // Dodaj psihološke mehanizme
        analysis.psychologicalMechanisms.forEach(mechanism => {
            if (!this.psychologicalProfile.behavioralPatterns.includes(mechanism)) {
                this.psychologicalProfile.behavioralPatterns.push(mechanism);
                console.log("➕ NOVI MEHANIZAM:", mechanism);
            }
        });
        
        // Ažuriraj glavnu analizu
        this.psychologicalProfile.currentAnalysis = analysis.expandedProfile;
        
        // Dodaj duboke uvide
        this.psychologicalProfile.deepInsights.push(analysis.deepAnalysis);
        
        // Ako postoje kontradikce
        if (analysis.contradictions) {
            this.psychologicalProfile.contradictions.push(analysis.contradictions);
            console.log("⚠️ KONTRADIKCE:", analysis.contradictions);
        }
        
        console.log("✅ PROFIL AŽURIRAN - Osobine:", this.psychologicalProfile.traits.length);
    }
    
    // Prikaz analize
    async displayAnalysis(analysis) {
        console.log("📊 PRIKAZ ANALIZE:", analysis);
        
        return new Promise((resolve) => {
            this.gameContainer.innerHTML = `
                <div class="analysis-display">
                    <div class="ai-host">
                        <div class="host-avatar">🎭</div>
                        <div class="host-name">Dr. Veritas</div>
                    </div>
                    
                    <div class="analysis-content">
                        <h3>Psihološka analiza vašeg odgovora</h3>
                        
                        <div class="immediate-insight">
                            <h4>Trenutni uvid:</h4>
                            <p>${analysis.immediateInsight}</p>
                        </div>
                        
                        <div class="deep-analysis">
                            <h4>Duboka analiza:</h4>
                            <p>${analysis.deepAnalysis}</p>
                        </div>
                        
                        <div class="personality-update">
                            <h4>Nove otkrivene osobine:</h4>
                            <ul>
                                ${analysis.personalityTraits.map(trait => `<li>${trait}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="psychological-mechanisms">
                            <h4>Psihološki mehanizmi:</h4>
                            <ul>
                                ${analysis.psychologicalMechanisms.map(mechanism => `<li>${mechanism}</li>`).join('')}
                            </ul>
                        </div>
                        
                        ${analysis.contradictions ? `
                            <div class="contradictions">
                                <h4>Psihološke kontradikce:</h4>
                                <p>${analysis.contradictions}</p>
                            </div>
                        ` : ''}
                        
                        <div class="expanded-profile">
                            <h4>Ažuriran psihološki profil:</h4>
                            <p>${analysis.expandedProfile}</p>
                        </div>
                    </div>
                    
                    <button class="continue-btn">
                        Nastavi analizu →
                    </button>
                    
                    <div class="debug-analysis" style="margin-top: 15px; padding: 10px; background: #333; border-radius: 5px; font-size: 12px;">
                        <strong>Debug - Analiza Info:</strong><br>
                        Ukupno osobina: ${this.psychologicalProfile.traits.length}<br>
                        Ukupno mehanizama: ${this.psychologicalProfile.behavioralPatterns.length}<br>
                        Duboki uvidi: ${this.psychologicalProfile.deepInsights.length}
                    </div>
                </div>
            `;
            
            // Auto-nastavi nakon 6 sekundi ili na klik
            const autoAdvance = setTimeout(() => {
                console.log("⏰ AUTO-ADVANCE: Nakon 6 sekundi");
                resolve();
            }, 6000);
            
            // Manual advance na klik
            window.continueGame = () => {
                console.log("🖱️ MANUAL ADVANCE: Korisnik kliknuo nastavi");
                clearTimeout(autoAdvance);
                resolve();
            };
        });
    }
    
    // Završetak igre i finalna analiza
    async endGame() {
        console.log("🏁 ZAVRŠETAK IGRE: Pokretanje finalne analize");
        this.gameCompleted = true;
        
        try {
            // Generiraj finalnu analizu
            console.log("🧠 FINALNA AI ANALIZA: Pokretanje");
            const finalAnalysis = await this.generateFinalAnalysis();
            console.log("✅ FINALNA ANALIZA GOTOVA:", finalAnalysis);
            
            this.displayFinalResults(finalAnalysis);
        } catch (error) {
            console.error("❌ GREŠKA pri završetku igre:", error);
        }
    }
    
    // Generiranje finalne analize
    async generateFinalAnalysis() {
        console.log("🧠 FINALNA ANALIZA: Generiranje kompletne analize");
        
        const fullContext = this.buildCompleteGameContext();
        
        const systemPrompt = `Ti si Dr. Veritas, psiholog koji je upravo završio dubinsku psihološku analizu ispitanika kroz ${this.totalQuestions} pitanja.
        
        ZADATAK: Generiraj KOMPLETNU, DETALJNU, BRUTALNO ISKRENU finalnu psihološku analizu.
        
        MORA SADRŽAVATI:
        1. Potpunu dekonstrukciju ličnosti
        2. Sve skrivene aspekte i tamne strane
        3. Psihološke obrasce i mehanizme obrane
        4. Strahove, nesigurnosti, potisknute želje
        5. Prognozu budućeg ponašanja
        6. Preporuke za psihološki rad
        7. Minimum 500 riječi duboke analize
        8. Bez cenzure - potpunu istinu
        
        KONTEKST CIJELE IGRE: ${fullContext}
        
        Generiraj kao JSON:
        {
            "title": "Naslov finalne analize",
            "corePersonality": "Srž ličnosti",
            "dominantTraits": ["glavne osobine"],
            "hiddenAspects": "Skriveni aspekti",
            "psychologicalPatterns": "Psihološki obrasci",
            "defenseMechanisms": "Mehanizmi obrane",
            "darkSide": "Tamna strana ličnosti",
            "fears": "Najdublji strahovi",
            "desires": "Potisnjute želje",
            "prediction": "Prognoza ponašanja",
            "recommendations": "Preporuke",
            "finalVerdict": "Finalni zaključak - minimum 300 riječi"
        }`;
        
        try {
            console.log("📤 FINALNA AI ANALIZA: Šalje zahtjev");
            const aiResponse = await this.callAI(systemPrompt, "");
            console.log("📥 FINALNA AI ANALIZA: Primljen odgovor", aiResponse.substring(0, 100) + "...");
            
            const analysis = JSON.parse(aiResponse);
            console.log("✅ FINALNA ANALIZA PARSIRANA:", Object.keys(analysis));
            return analysis;
        } catch (error) {
            console.error("❌ GREŠKA pri finalnoj analizi:", error);
            console.log("🔄 FALLBACK: Koristim rezervnu finalnu analizu");
            return this.getFallbackFinalAnalysis();
        }
    }
    
    // Izgradnja kompletnog konteksta igre
    buildCompleteGameContext() {
        let context = `KOMPLETNA IGRA - ${this.answers.length} odgovora:\n\n`;
        
        this.answers.forEach((answer, index) => {
            context += `${index + 1}. "${answer.question}" - ${answer.response} (${answer.category})\n`;
        });
        
        context += `\n\nFINALAN PSIHOLOŠKI PROFIL: ${this.psychologicalProfile.currentAnalysis}\n`;
        context += `OSOBINE: ${this.psychologicalProfile.traits.join(', ')}\n`;
        context += `OBRASCI: ${this.psychologicalProfile.behavioralPatterns.join(', ')}\n`;
        context += `KONTRADIKCE: ${this.psychologicalProfile.contradictions.join(', ')}\n`;
        
        console.log("📋 KOMPLETNI KONTEKST:", context.length, "znakova");
        return context;
    }
    
    // Fallback finalna analiza
    getFallbackFinalAnalysis() {
        console.log("🔄 FALLBACK FINALNA ANALIZA");
        return {
            title: "Kompleksna ličnost s dubinskim protivrječnostima",
            corePersonality: "Ispitanik pokazuje složenu ličnost s višeslojnim osobnostnim struktururama.",
            dominantTraits: this.psychologicalProfile.traits.length > 0 ? this.psychologicalProfile.traits : ["složenost", "ambivalentnost", "dubinska priroda"],
            hiddenAspects: "Skrivene dubinske strukture koje zahtijevaju daljnji rad. Postoje neintegrirani dijelovi ličnosti koji se manifestiraju kroz kontradiktorne odgovore i emocionalne reakcije.",
            psychologicalPatterns: "Kompleksni obrasci ponašanja i reagiranja koji ukazuju na duboke unutarnje konflikte i nerazriješene psihološke teme.",
            defenseMechanisms: this.psychologicalProfile.behavioralPatterns.length > 0 ? this.psychologicalProfile.behavioralPatterns.join(', ') : "Racionalizacija, potiskivanje, projekcija",
            darkSide: "Tamni aspekti ličnosti koji zahtijevaju integraciju. Postoje potisnjuti dijelovi koji mogu utjecati na ponašanje na nesvjesnoj razini.",
            fears: "Duboki strahovi vezani uz identitet, odbačenost i autentičnost. Strah od suočavanja s vlastitim tamnim stranama.",
            desires: "Potisnjute potrebe za autentičnošću, prihvaćanjem i dubinskom povezanošću s drugima.",
            prediction: "Ispitanik će vjerojatno nastaviti s kompleksnim obrascima ponašanja dok ne integrira sve aspekte svoje ličnosti kroz dubinski rad.",
            recommendations: "Preporučuje se dubinski psihološki rad, možda psihoterapija usmjerena na integraciju ličnosti i rješavanje unutarnjih konflikata.",
            finalVerdict: `Kroz ovaj dubinski psihološki test otkrivena je kompleksna ličnost koja nosi mnoge maske i slojeve. Ispitanik pokazuje sposobnost introspektivnosti, ali i tendenciju prema unutarnjim borbama i kontradikanjama. 

Analiza otkriva osobu koja je svjesna svojih kompleksnosti, ali možda još uvijek ne u potpunosti integrirana u svim aspektima svoje ličnosti. Postoje jasni znakovi psihološke zrelosti, ali i područja koja zahtijevaju daljnji rad.

Najvažnije otkriće je da ispitanik posjeduje kapacitet za duboku samoanalizu i rast, što je iznimno pozitivna karakteristika. Preporučuje se nastavak rada na sebi kroz različite oblike osobnog razvoja i psihološke podrške.`
        };
    }
    
    // Prikaz finalnih rezultata
    displayFinalResults(finalAnalysis) {
        console.log("🏆 PRIKAZ FINALNIH REZULTATA:", finalAnalysis);
        
        this.gameContainer.innerHTML = `
            <div class="final-results">
                <div class="results-header">
                    <h1>FINALNA PSIHOLOŠKA ANALIZA</h1>
                    <div class="ai-host">
                        <div class="host-avatar">🎭</div>
                        <div class="host-name">Dr. Veritas - Finalni zaključak</div>
                    </div>
                </div>
                
                <div class="analysis-sections">
                    <div class="section core-personality">
                        <h3>${finalAnalysis.title}</h3>
                        <p class="core-desc">${finalAnalysis.corePersonality}</p>
                    </div>
                    
                    <div class="section dominant-traits">
                        <h3>Dominantne osobine ličnosti</h3>
                        <ul class="traits-list">
                            ${finalAnalysis.dominantTraits.map(trait => `<li>${trait}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="section hidden-aspects">
                        <h3>Skriveni aspekti</h3>
                        <p>${finalAnalysis.hiddenAspects}</p>
                    </div>
                    
                    <div class="section psychological-patterns">
                        <h3>Psihološki obrasci</h3>
                        <p>${finalAnalysis.psychologicalPatterns}</p>
                    </div>
                    
                    <div class="section defense-mechanisms">
                        <h3>Mehanizmi obrane</h3>
                        <p>${finalAnalysis.defenseMechanisms}</p>
                    </div>
                    
                    <div class="section dark-side">
                        <h3>Tamna strana ličnosti</h3>
                        <p class="dark-content">${finalAnalysis.darkSide}</p>
                    </div>
                    
                    <div class="section fears">
                        <h3>Najdublji strahovi</h3>
                        <p>${finalAnalysis.fears}</p>
                    </div>
                    
                    <div class="section desires">
                        <h3>Potisnjute želje</h3>
                        <p>${finalAnalysis.desires}</p>
                    </div>
                    
                    <div class="section prediction">
                        <h3>Prognoza budućeg ponašanja</h3>
                        <p>${finalAnalysis.prediction}</p>
                    </div>
                    
                    <div class="section recommendations">
                        <h3>Preporuke</h3>
                        <p>${finalAnalysis.recommendations}</p>
                    </div>
                    
                    <div class="section final-verdict">
                        <h3>Finalni zaključak</h3>
                        <div class="verdict-content">
                            ${finalAnalysis.finalVerdict}
                        </div>
                    </div>
                </div>
                
                <div class="game-stats">
                    <h3>Statistike analize</h3>
                    <p>Odgovoreno pitanja: ${this.answers.length}</p>
                    <p>Otkrivene osobnostne crte: ${this.psychologicalProfile.traits.length}</p>
                    <p>Psihološki obrasci: ${this.psychologicalProfile.behavioralPatterns.length}</p>
                    <p>Duboki uvidi: ${this.psychologicalProfile.deepInsights.length}</p>
                </div>
                
                <div class="action-buttons">
                    <button class="restart-btn" onclick="location.reload()">
                        Nova analiza
                    </button>
                    <button class="share-btn" onclick="profiler.shareResults()">
                        Podijeli rezultate
                    </button>
                </div>
                
                <div class="disclaimer">
                    <p><strong>Odricanje:</strong> Ova analiza je kreirana pomoću AI-ja za zabavne svrhe. 
                    Nije zamjena za profesionalnu psihološku procjenu.</p>
                </div>
                
                <div class="debug-final" style="margin-top: 15px; padding: 10px; background: #333; border-radius: 5px; font-size: 12px;">
                    <strong>Debug - Finalni rezultati:</strong><br>
                    Ukupno odgovora: ${this.answers.length}/${this.totalQuestions}<br>
                    AI poziva: ${this.conversationHistory.length}<br>
                    Analiza završena: ${new Date().toLocaleTimeString()}
                </div>
            </div>
        `;
        
        console.log("✅ FINALNI REZULTATI PRIKAZANI - Igra završena!");
    }
    
    // Dijeljenje rezultata
    shareResults() {
        console.log("📤 DIJELJENJE REZULTATA");
        const shareText = `Upravo sam završio/la psihološku analizu u igri "Trenutak Istine"! 
        ${this.psychologicalProfile.traits.length} otkrivenih osobina, ${this.answers.length} pitanja. 
        Možeš li ti biti jednako iskren/a? https://trenutak-istine.netlify.app/`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Trenutak Istine - Moji rezultati',
                text: shareText,
                url: 'https://trenutak-istine.netlify.app/'
            }).then(() => {
                console.log("✅ DIJELJENJE: Uspješno podijeljeno");
            });
        } else {
            // Fallback na kopiranje u clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                console.log("✅ CLIPBOARD: Kopirano u clipboard");
                alert('Rezultati kopirani u clipboard!');
            });
        }
    }
    
    // Poziv AI modela preko Netlify funkcije
    async callAI(systemPrompt, userPrompt) {
        console.log("📡 AI POZIV: Početak poziva", {
            model: this.aiModel,
            systemPromptLength: systemPrompt.length,
            userPromptLength: userPrompt.length
        });
        
        try {
            const requestData = {
                model: this.aiModel,
                systemPrompt: systemPrompt,
                userPrompt: userPrompt,
                temperature: 0.7,
                max_tokens: 2000
            };
            
            console.log("📤 HTTP ZAHTJEV: Šalje se na Netlify funkciju", requestData);
            
            const response = await fetch('/.netlify/functions/get-ai-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            console.log("📥 HTTP ODGOVOR: Status", response.status, response.statusText);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ HTTP GREŠKA:", response.status, errorText);
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const data = await response.json();
            console.log("✅ AI ODGOVOR: Uspješno primljen", {
                dataKeys: Object.keys(data),
                responseLength: (data.comment || data.response || data.content || '').length
            });
            
            const aiResponse = data.comment || data.response || data.content;
            
            // Spremi u conversation history za debug
            this.conversationHistory.push({
                timestamp: new Date().toISOString(),
                systemPrompt: systemPrompt.substring(0, 100) + "...",
                response: aiResponse.substring(0, 100) + "..."
            });
            
            return aiResponse;
            
        } catch (error) {
            console.error('❌ AI POZIV GREŠKA:', error);
            console.error('🔍 Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
    
    // Testiranje AI konekcije
    async testAIConnection() {
        console.log("🧪 TEST AI KONEKCIJE: Pokretanje");
        
        try {
            const testPrompt = "Odgovori samo: 'AI veza funkcionira!' i ništa više.";
            console.log("📤 TEST ZAHTJEV:", testPrompt);
            
            const response = await this.callAI(testPrompt, "");
            console.log('✅ AI TEST ODGOVOR:', response);
            
            alert('AI veza uspješno testirana!\n\nOdgovor: ' + response);
        } catch (error) {
            console.error('❌ AI TEST NEUSPJEŠAN:', error);
            alert('Problem s AI vezom:\n\n' + error.message + '\n\nProvjerite F12 konzolu za više detalja.');
        }
    }
    
    // Prikaz poruke AI host-a
    displayHostMessage(message, callback) {
        console.log("🎭 HOST PORUKA:", message);
        
        this.gameContainer.innerHTML = `
            <div class="host-message-screen">
                <div class="ai-host">
                    <div class="host-avatar">🎭</div>
                    <div class="host-name">Dr. Veritas</div>
                </div>
                
                <div class="host-message-content">
                    <p>${message}</p>
                </div>
                
                <div class="message-continue">
                    <button class="continue-message-btn">Nastavi →</button>
                </div>
                
                <div class="debug-host" style="margin-top: 15px; padding: 10px; background: #333; border-radius: 5px; font-size: 12px;">
                    <strong>Debug - Host poruka:</strong><br>
                    Trenutna dubina: ${this.totalQuestions}<br>
                    Game started: ${this.gameStarted}
                </div>
            </div>
        `;
        
        // Manual advance na klik
        window.continueGame = () => {
            console.log("🖱️ HOST CONTINUE: Korisnik kliknuo nastavi");
            callback();
        };
        
        // Auto-nastavi nakon 4 sekundi
        setTimeout(() => {
            console.log("⏰ HOST AUTO-ADVANCE: Nakon 4 sekunde");
            callback();
        }, 4000);
    }
}

// =============================================================================
// INICIJALIZACIJA IGRE KADA SE STRANICA UČITA
// =============================================================================

let profiler;

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 DOM LOADED: Stranica učitana, pokretanje aplikacije");
    console.log("📅 Vrijeme pokretanja:", new Date().toLocaleString());
    console.log("🌐 URL:", window.location.href);
    console.log("👤 User Agent:", navigator.userAgent.substring(0, 50) + "...");
    
    try {
        // Kreiraj novu instancu psihološkog profajlera
        console.log("🔧 KREIRANJE: Nova instanca PsychologicalProfiler");
        profiler = new PsychologicalProfiler();
        
        // Dodaj dodatne event listenere ako su potrebni
        setupAdditionalEventListeners();
        
        console.log("✅ APLIKACIJA POKRENUTA: Sve je spremno za rad!");
        
    } catch (error) {
        console.error("❌ KRITIČNA GREŠKA pri pokretanju:", error);
        alert("Kritična greška pri pokretanju aplikacije. Molimo osvježite stranicu.");
    }
});

// Dodatni event listeneri
function setupAdditionalEventListeners() {
    console.log("🔗 SETUP: Postavljanje dodatnih event listenera");
    
    // Escape key za izlaz
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            console.log("⌨️ ESCAPE KEY: Pritisnuto");
            if (confirm('Želite li prekinuti analizu?')) {
                console.log("🔄 RESTART: Korisnik potvrdio restart");
                location.reload();
            }
        }
    });
    
    // Sprečavanje slučajnog izlaska tijekom igre
    window.addEventListener('beforeunload', function(e) {
        if (profiler && profiler.gameStarted && !profiler.gameCompleted) {
            console.log("⚠️ BEFORE UNLOAD: Igra u tijeku, upozorava korisnika");
            e.preventDefault();
            e.returnValue = 'Analiza je u tijeku. Sigurno želite izaći?';
        }
    });
    
    console.log("✅ DODATNI LISTENERS: Postavljeni uspješno");
}

// Debug funkcije
function testAIConnection() {
    console.log("🧪 EXTERNAL TEST: Poziv test funkcije");
    if (profiler) {
        profiler.testAIConnection();
    } else {
        console.error("❌ PROFILER NOT READY: Profiler još nije kreiran");
        alert("Profiler nije spreman. Molimo pričekajte.");
    }
}

// Global error handler
window.addEventListener('error', function(e) {
    console.error("🚨 GLOBAL ERROR:", {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno,
        error: e.error
    });
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error("🚨 UNHANDLED PROMISE REJECTION:", e.reason);
});

// Eksportiraj za globalni pristup
window.profiler = profiler;
window.testAIConnection = testAIConnection;

console.log("📋 SCRIPT LOADED: script.js potpuno učitan");
// =============================================================================
// END OF SCRIPT