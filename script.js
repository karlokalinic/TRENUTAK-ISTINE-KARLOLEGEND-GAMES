// =============================================================================
// TRENUTAK ISTINE - AI POWERED PSYCHOLOGICAL PROFILING GAME
// Napredna psihološka analiza s adaptivnim postavljanjem pitanja
// =============================================================================

class PsychologicalProfiler {
    constructor() {
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
        
        // AI model konfiguracija
        this.aiModel = "deepseek/deepseek-r1";
        this.conversationHistory = [];
        
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
        
        this.initializeGame();
    }
    
    // Inicijalizacija igre i UI elemenata
    initializeGame() {
        this.setupEventListeners();
        this.displayWelcomeScreen();
    }
    
    // Postavljanje event listenera
    setupEventListeners() {
        // Dugmad za dubinu analize
        const depthButtons = document.querySelectorAll('.depth-option');
        depthButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectGameDepth(parseInt(e.target.dataset.depth));
            });
        });
        
        // Dugmad za odgovore DA/NE
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-btn')) {
                this.handleAnswer(e.target.dataset.answer);
            }
        });
        
        // Debug dugme za testiranje AI veze
        if (document.getElementById('test-ai')) {
            document.getElementById('test-ai').addEventListener('click', () => {
                this.testAIConnection();
            });
        }
    }
    
    // Prikaz početnog ekrana
    displayWelcomeScreen() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
            <div class="welcome-screen">
                <h1 class="game-title">TRENUTAK ISTINE</h1>
                <p class="game-subtitle">AI izdanje - Psihološka analiza bez granica</p>
                
                <div class="ai-host-intro">
                    <div class="host-avatar">🎭</div>
                    <div class="host-message">
                        <p><strong>Dr. Veritas:</strong> "Dobrodošli u psihološku laboratoriju uma. Ja sam Dr. Veritas, vaš vodič kroz najdublje zakutke vaše psihe. 
                        Postavljat ću vam pitanja koja će postepeno skidati sve maske koje nosite. Svaki vaš odgovor će mi otkriti nove slojeve vaše ličnosti."</p>
                        
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
            </div>
        `;
    }
    
    // Odabir dubine igre
    selectGameDepth(depth) {
        this.totalQuestions = depth;
        this.gameStarted = true;
        this.currentQuestionIndex = 0;
        
        // Početna poruka AI host-a
        const hostMessage = `Odlično. Odabrali ste ${depth}-pitanjsku analizu. Pripremite se za putovanje u dubine vaše psihe. 
        Svako pitanje će biti pametno odabrano na temelju vaših prethodnih odgovora. Počinjemo...`;
        
        this.displayHostMessage(hostMessage, () => {
            this.startGame();
        });
    }
    
    // Početak igre
    async startGame() {
        // Generiraj prvo pitanje pomoću AI-ja
        const firstQuestion = await this.generateSmartQuestion();
        this.displayQuestion(firstQuestion);
    }
    
    // Pametan generator pitanja koji koristi AI
    async generateSmartQuestion() {
        const context = this.buildContextForAI();
        
        const systemPrompt = `Ti si Dr. Veritas, psiholog specijalist za dubinsku analizu ličnosti. 
        Vodiš psihološku igru "Trenutak Istine" gdje postavljaš sve dublja i intimnija pitanja kako bi otkrio sve tajne ispitanika.
        
        TVOJ ZADATAK:
        1. Na temelju konteksta odaberi koje psihološko područje treba istražiti
        2. Postavi pitanje koje je DA/NE tip
        3. Pitanje mora biti intimno, neugodno i direktno
        4. Cilj je doći do najdubljih tajni i srama
        5. Koristi psihološke tehnike za probijanje psihičkih obrana
        
        DOSTUPNE KATEGORIJE: identitet, odnosi, etika, emocije, tamne_želje, obitelj
        
        KONTEKST DOSADAŠNJIH ODGOVORA: ${context}
        
        Odgovori SAMO sa pitanjem u obliku JSON:
        {"category": "kategorija", "question": "Tvoje pitanje?", "reasoning": "Zašto ovo pitanje"}`;
        
        try {
            const aiResponse = await this.callAI(systemPrompt, "");
            const questionData = JSON.parse(aiResponse);
            
            return {
                category: questionData.category,
                question: questionData.question,
                reasoning: questionData.reasoning
            };
        } catch (error) {
            console.error('Greška pri generiranju pitanja:', error);
            // Fallback na pretpostavljeno pitanje
            return this.getFallbackQuestion();
        }
    }
    
    // Izgradnja konteksta za AI na temelju dosadašnjih odgovora
    buildContextForAI() {
        if (this.answers.length === 0) {
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
        
        return context;
    }
    
    // Fallback pitanje ako AI ne radi
    getFallbackQuestion() {
        const allCategories = Object.keys(this.psychologicalCategories);
        const randomCategory = allCategories[Math.floor(Math.random() * allCategories.length)];
        const categoryData = this.psychologicalCategories[randomCategory];
        const randomQuestion = categoryData.questions[Math.floor(Math.random() * categoryData.questions.length)];
        
        return {
            category: randomCategory,
            question: randomQuestion,
            reasoning: "Fallback pitanje zbog problema s AI-jem"
        };
    }
    
    // Prikaz pitanja
    displayQuestion(questionData) {
        const gameContainer = document.getElementById('game-container');
        const progressPercent = ((this.currentQuestionIndex) / this.totalQuestions) * 100;
        
        gameContainer.innerHTML = `
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
            </div>
        `;
        
        // Spremi trenutno pitanje
        this.currentQuestion = questionData;
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
        
        // Prikaži loading dok AI analizira
        this.showAnalysisLoading();
        
        // Generiraj AI analizu odgovora
        const analysis = await this.generatePsychologicalAnalysis(answerData);
        
        // Ažuriraj psihološki profil
        this.updatePsychologicalProfile(analysis);
        
        // Prikaži analizu
        await this.displayAnalysis(analysis);
        
        // Provjeri je li igra završena
        if (this.currentQuestionIndex >= this.totalQuestions) {
            await this.endGame();
        } else {
            // Generiraj sljedeće pitanje
            const nextQuestion = await this.generateSmartQuestion();
            this.displayQuestion(nextQuestion);
        }
    }
    
    // Prikaz loading animacije tijekom analize
    showAnalysisLoading() {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
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
            </div>
        `;
    }
    
    // Generiranje psihološke analize pomoću AI-ja
    async generatePsychologicalAnalysis(answerData) {
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
            const aiResponse = await this.callAI(systemPrompt, "");
            return JSON.parse(aiResponse);
        } catch (error) {
            console.error('Greška pri generiranju analize:', error);
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
        
        return context;
    }
    
    // Fallback analiza ako AI ne radi
    getFallbackAnalysis(answerData) {
        return {
            immediateInsight: `Odgovor "${answerData.response}" na pitanje o ${answerData.category} ukazuje na dublje psihološke obrasce.`,
            deepAnalysis: `Ovaj odgovor otkriva kompleksnu dinamiku u ispitaniku. Potrebna je dalja analiza.`,
            personalityTraits: ["kompleksnost", "ambivalentnost"],
            psychologicalMechanisms: ["potiskivanje", "racionalizacija"],
            expandedProfile: "Ispitanik pokazuje složene psihološke obrasce koji zahtijevaju dubljу analizu.",
            contradictions: "",
            futureProbing: "Istražiti dublje motivacije i strahove."
        };
    }
    
    // Ažuriranje psihološkog profila
    updatePsychologicalProfile(analysis) {
        // Dodaj nove osobine
        analysis.personalityTraits.forEach(trait => {
            if (!this.psychologicalProfile.traits.includes(trait)) {
                this.psychologicalProfile.traits.push(trait);
            }
        });
        
        // Dodaj psihološke mehanizme
        analysis.psychologicalMechanisms.forEach(mechanism => {
            if (!this.psychologicalProfile.behavioralPatterns.includes(mechanism)) {
                this.psychologicalProfile.behavioralPatterns.push(mechanism);
            }
        });
        
        // Ažuriraj glavnu analizu
        this.psychologicalProfile.currentAnalysis = analysis.expandedProfile;
        
        // Dodaj duboke uvide
        this.psychologicalProfile.deepInsights.push(analysis.deepAnalysis);
        
        // Ako postoje kontradikce
        if (analysis.contradictions) {
            this.psychologicalProfile.contradictions.push(analysis.contradictions);
        }
    }
    
    // Prikaz analize
    async displayAnalysis(analysis) {
        return new Promise((resolve) => {
            const gameContainer = document.getElementById('game-container');
            gameContainer.innerHTML = `
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
                    
                    <button class="continue-btn" onclick="continueGame()">
                        Nastavi analizu →
                    </button>
                </div>
            `;
            
            // Auto-nastavi nakon 8 sekundi ili na klik
            setTimeout(() => {
                resolve();
            }, 8000);
            
            window.continueGame = () => {
                resolve();
            };
        });
    }
    
    // Završetak igre i finalna analiza
    async endGame() {
        this.gameCompleted = true;
        
        // Generiraj finalnu analizu
        const finalAnalysis = await this.generateFinalAnalysis();
        
        this.displayFinalResults(finalAnalysis);
    }
    
    // Generiranje finalne analize
    async generateFinalAnalysis() {
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
            "defenseM mechanisms": "Mehanizmi obrane",
            "darkSide": "Tamna strana ličnosti",
            "fears": "Najdublji strahovi",
            "desires": "Potisnjute želje",
            "prediction": "Prognoza ponašanja",
            "recommendations": "Preporuke",
            "finalVerdict": "Finalni zaključak - minimum 300 riječi"
        }`;
        
        try {
            const aiResponse = await this.callAI(systemPrompt, "");
            return JSON.parse(aiResponse);
        } catch (error) {
            console.error('Greška pri generiranju finalne analize:', error);
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
        
        return context;
    }
    
    // Fallback finalna analiza
    getFallbackFinalAnalysis() {
        return {
            title: "Kompleksna ličnost s dubinskim protivrječnostima",
            corePersonality: "Ispitanik pokazuje složenu ličnost s višeslojnim osobnostnim struktururama.",
            dominantTraits: this.psychologicalProfile.traits,
            hiddenAspects: "Skrivene dubinske strukture koje zahtijevaju daljnji rad.",
            psychologicalPatterns: "Kompleksni obrasci ponašanja i reagiranja.",
            defenseMechanisms: this.psychologicalProfile.behavioralPatterns,
            darkSide: "Tamni aspekti ličnosti koji zahtijevaju integraciju.",
            fears: "Duboki strahovi vezani uz identitet i odnose.",
            desires: "Potisknute potrebe za autentičnošću i povezanošću.",
            prediction: "Vjerojatno će nastaviti s kompleksnim obrascima.",
            recommendations: "Dubinski psihološki rad i terapija.",
            finalVerdict: "Ova analiza otkriva duboko složenu osobu koja nosi mnoge maske. Ispitanik pokazuje sposobnost adaptacije, ali i duboke unutarnje borbe. Potreban je stalni rad na sebi."
        };
    }
    
    // Prikaz finalnih rezultata
    displayFinalResults(finalAnalysis) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
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
            </div>
        `;
    }
    
    // Dijeljenje rezultata
    shareResults() {
        const shareText = `Upravo sam završio/la psihološku analizu u igri "Trenutak Istine"! 
        ${this.psychologicalProfile.traits.length} otkrivenih osobina, ${this.answers.length} pitanja. 
        Možeš li ti biti jednako iskren/a? https://trenutak-istine.netlify.app/`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Trenutak Istine - Moji rezultati',
                text: shareText,
                url: 'https://trenutak-istine.netlify.app/'
            });
        } else {
            // Fallback na kopiranje u clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Rezultati kopirani u clipboard!');
            });
        }
    }
    
    // Poziv AI modela preko Netlify funkcije
    async callAI(systemPrompt, userPrompt) {
        try {
            const response = await fetch('/.netlify/functions/get-ai-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.aiModel,
                    systemPrompt: systemPrompt,
                    userPrompt: userPrompt,
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data.comment || data.response || data.content;
            
        } catch (error) {
            console.error('Greška pri pozivu AI-ja:', error);
            throw error;
        }
    }
    
    // Testiranje AI konekcije
    async testAIConnection() {
        try {
            const testPrompt = "Odgovori samo: 'AI veza funkcionira!'";
            const response = await this.callAI(testPrompt, "");
            console.log('AI test odgovor:', response);
            alert('AI veza uspješno testirana!');
        } catch (error) {
            console.error('AI test neuspješan:', error);
            alert('Problem s AI vezom: ' + error.message);
        }
    }
    
    // Prikaz poruke AI host-a
    displayHostMessage(message, callback) {
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = `
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
            </div>
        `;
        
        document.querySelector('.continue-message-btn').addEventListener('click', callback);
        
        // Auto-nastavi nakon 5 sekundi
        setTimeout(callback, 5000);
    }
}

// =============================================================================
// INICIJALIZACIJA IGRE KADA SE STRANICA UČITA
// =============================================================================

let profiler;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Trenutak Istine - AI izdanje se pokraće...');
    
    // Kreiraj novu instancu psihološkog profajlera
    profiler = new PsychologicalProfiler();
    
    // Dodaj dodatne event listenere ako su potrebni
    setupAdditionalEventListeners();
});

// Dodatni event listeneri
function setupAdditionalEventListeners() {
    // Escape key za izlaz
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && confirm('Želite li prekinuti analizu?')) {
            location.reload();
        }
    });
    
    // Sprečavanje slučajnog izlaska tijekom igre
    window.addEventListener('beforeunload', function(e) {
        if (profiler && profiler.gameStarted && !profiler.gameCompleted) {
            e.preventDefault();
            e.returnValue = 'Analiza je u tijeku. Sigurno želite izaći?';
        }
    });
}

// Debug funkcije
function testAIConnection() {
    if (profiler) {
        profiler.testAIConnection();
    }
}

// Eksportiraj za globalni pristup
window.profiler = profiler;
window.testAIConnection = testAIConnection;
