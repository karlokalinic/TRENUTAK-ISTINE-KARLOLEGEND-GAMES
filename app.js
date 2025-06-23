/**
 * TRENUTAK ISTINE - TV HOST AI SYSTEM
 * Eerie Digital Horror Experience with Personalized Questioning
 */

class TVHostAI {
    constructor() {
        // Game configuration
        this.config = {
            maxStrikes: 3,
            minResponseTime: 2000,
            maxResponseTime: 15000,
            baseIntensity: 1,
            maxIntensity: 10
        };

        // Host personas
        this.hosts = {
            dr_mrak: {
                name: "DR. MRAK",
                personality: "Hladni psihijatar koji vidi kroz laži",
                speaking_style: "analytical_clinical",
                glitch_level: "minimal",
                greeting: "Dobrodošli u moju ordinaciju... Ovdje ćemo otkriti što se krije u najdubljim uglovima vaše psihe.",
                lie_detection_style: "analytical"
            },
            digitalni_demon: {
                name: "DIGITALNI DEMON",
                personality: "Kreatura iz dark web-a koja hroni tajnama", 
                speaking_style: "corrupted_digital",
                glitch_level: "extreme",
                greeting: "01001000 01000001... Dobrodošli u moju domenu. Vaši podaci će biti... analizirani.",
                lie_detection_style: "digital_corruption"
            }
        };

        // Game state
        this.gameState = {
            phase: 'host_selection', // host_selection, profiling, questioning, game_over
            selectedHost: null,
            userProfile: {},
            currentStrikes: 0,
            questionCount: 0,
            personalityMap: {},
            responseHistory: [],
            intensityLevel: 1,
            lastResponseTime: 0,
            gameEnded: false
        };

        // Profiling questions
        this.profilingQuestions = [
            {
                id: 'q_intro',
                text: "Prije nego što počnemo, recite mi svoje ime i godine.",
                category: 'basic_info',
                required: true
            },
            {
                id: 'q_motivation',
                text: "Što vas je dovelo ovdje? Zašto želite igrati ovu igru?",
                category: 'motivation',
                required: true
            },
            {
                id: 'q_fears',
                text: "Koji je vaš najveći strah u životu?",
                category: 'psychological_profile',
                required: true
            },
            {
                id: 'q_secrets',
                text: "Postoji li nešto što nikome nikad niste rekli?",
                category: 'secret_detection',
                required: true
            },
            {
                id: 'q_guilt',
                text: "Za što se najviše osjećate krivim u svom životu?",
                category: 'guilt_mapping',
                required: true
            }
        ];

        // Personalized question categories
        this.questionCategories = {
            family_trauma: [],
            relationship_betrayal: [],
            moral_corruption: [],
            dark_fantasies: [],
            criminal_acts: [],
            emotional_manipulation: [],
            addiction_secrets: [],
            violence_tendencies: [],
            sexual_deviance: [],
            psychological_breaks: []
        };

        // Lie detection patterns
        this.lieDetectionPatterns = {
            response_time_analysis: true,
            text_consistency_check: true,
            emotional_pattern_recognition: true,
            deflection_detection: true
        };

        this.init();
    }

    init() {
        this.setupUI();
        this.bindEvents();
        this.loadHostSelection();
        console.log('🎭 TV Host AI System initialized');
    }

    setupUI() {
        document.body.innerHTML = `
            <div class="app-container">
                <header class="tv-header">
                    <h1 class="show-title glitch-text" data-text="TRENUTAK ISTINE">TRENUTAK ISTINE</h1>
                    <p class="show-subtitle">Digital Psychological Reality Show</p>
                </header>

                <div class="host-profile" id="hostProfile">
                    <h2>ODABERITE VAŠEG TV VODIĆA</h2>
                    <div class="host-selection" id="hostSelection">
                        ${Object.entries(this.hosts).map(([key, host]) => `
                            <div class="host-card" data-host="${key}">
                                <h3 class="host-name">${host.name}</h3>
                                <p class="host-description">${host.personality}</p>
                            </div>
                        `).join('')}
                    </div>
                    <button id="confirmHost" class="send-button" disabled>POTVRDI ODABIR</button>
                </div>

                <div class="chat-container" id="chatContainer" style="display: none;">
                    <div class="chat-messages" id="chatMessages"></div>
                    <div class="chat-input-area">
                        <input type="text" class="chat-input" id="chatInput" placeholder="Unesite vaš odgovor..." disabled>
                        <button class="send-button" id="sendMessage" disabled>POŠALJITE</button>
                    </div>
                </div>

                <div class="game-status" id="gameStatus" style="display: none;">
                    <div class="status-item">
                        <span class="status-label">Faza</span>
                        <span class="status-value" id="gamePhase">Inicijalizacija</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Pitanje</span>
                        <span class="status-value" id="questionNumber">0/∞</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Upozorenja</span>
                        <span class="status-value strikes" id="strikeCount">0/3</span>
                    </div>
                    <div class="status-item">
                        <span class="status-label">Intenzitet</span>
                        <span class="status-value" id="intensityLevel">Minimalni</span>
                    </div>
                </div>

                <div class="system-error" id="systemError">
                    <div>SISTEM ERROR</div>
                    <div id="errorMessage">UNKNOWN ERROR</div>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Host selection
        document.getElementById('hostSelection').addEventListener('click', (e) => {
            if (e.target.closest('.host-card')) {
                this.selectHost(e.target.closest('.host-card').dataset.host);
            }
        });

        document.getElementById('confirmHost').addEventListener('click', () => {
            this.startProfiling();
        });

        // Chat input
        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.target.disabled) {
                this.sendUserMessage();
            }
        });

        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendUserMessage();
        });
    }

    selectHost(hostKey) {
        // Remove previous selection
        document.querySelectorAll('.host-card').forEach(card => {
            card.classList.remove('selected');
        });

        // Select new host
        document.querySelector(`[data-host="${hostKey}"]`).classList.add('selected');
        this.gameState.selectedHost = hostKey;
        document.getElementById('confirmHost').disabled = false;

        // Apply host-specific UI effects
        this.applyHostTheme(hostKey);
    }

    applyHostTheme(hostKey) {
        const host = this.hosts[hostKey];
        const appContainer = document.querySelector('.app-container');

        if (host.glitch_level === 'extreme') {
            appContainer.classList.add('ui-degraded-1');
        }
    }

    startProfiling() {
        this.gameState.phase = 'profiling';
        this.gameState.currentQuestionIndex = 0;

        // Hide host selection, show chat
        document.getElementById('hostProfile').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        document.getElementById('gameStatus').style.display = 'flex';

        // Enable input
        document.getElementById('chatInput').disabled = false;
        document.getElementById('sendMessage').disabled = false;

        // Update status
        this.updateGameStatus();

        // Send host greeting
        const host = this.hosts[this.gameState.selectedHost];
        this.addMessage('host', host.greeting);

        // Start profiling sequence
        setTimeout(() => {
            this.askProfilingQuestion();
        }, 2000);
    }

    askProfilingQuestion() {
        if (this.gameState.currentQuestionIndex >= this.profilingQuestions.length) {
            this.startMainGame();
            return;
        }

        const question = this.profilingQuestions[this.gameState.currentQuestionIndex];
        this.addMessage('host', question.text);
        this.gameState.currentQuestion = question;
        this.gameState.lastResponseTime = Date.now();
    }

    async sendUserMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        // Record response time
        const responseTime = Date.now() - this.gameState.lastResponseTime;

        // Add user message
        this.addMessage('user', message);
        input.value = '';

        // Disable input temporarily
        input.disabled = true;
        document.getElementById('sendMessage').disabled = true;

        // Analyze response
        await this.analyzeResponse(message, responseTime);

        // Re-enable input
        setTimeout(() => {
            input.disabled = false;
            document.getElementById('sendMessage').disabled = false;
            input.focus();
        }, 1000);
    }

    async analyzeResponse(response, responseTime) {
        // Store response
        this.gameState.responseHistory.push({
            question: this.gameState.currentQuestion,
            response: response,
            responseTime: responseTime,
            timestamp: Date.now()
        });

        // Lie detection analysis
        const lieDetectionResult = this.performLieDetection(response, responseTime);

        if (lieDetectionResult.isLie) {
            this.handleLieDetection(lieDetectionResult);
        }

        // Update user profile based on response
        this.updateUserProfile(response);

        // Generate AI response
        const aiResponse = await this.generateHostResponse(response, responseTime);
        
        setTimeout(() => {
            this.addMessage('host', aiResponse);
            
            setTimeout(() => {
                if (this.gameState.phase === 'profiling') {
                    this.gameState.currentQuestionIndex++;
                    this.askProfilingQuestion();
                } else if (this.gameState.phase === 'questioning') {
                    this.askPersonalizedQuestion();
                }
            }, 2000);
        }, 1500);
    }

    performLieDetection(response, responseTime) {
        let suspicionLevel = 0;
        let reasons = [];

        // Response time analysis
        if (responseTime < 2000) {
            suspicionLevel += 2;
            reasons.push('Prebrz odgovor - mogući pripremljen odgovor');
        } else if (responseTime > 15000) {
            suspicionLevel += 3;
            reasons.push('Ekstremno spor odgovor - moguće izmišljanje');
        }

        // Text analysis
        const suspiciousPatterns = [
            /honestly|istinski|zaista|stvarno/i,
            /možda|možda|possibly|perhaps/i,
            /ne sjećam se|can't remember|zaboravio/i,
            /to je složeno|it's complicated/i
        ];

        suspiciousPatterns.forEach(pattern => {
            if (pattern.test(response)) {
                suspicionLevel += 1;
                reasons.push('Detektirani obrasci oklijevanja u tekstu');
            }
        });

        // Length analysis
        if (response.length < 10) {
            suspicionLevel += 1;
            reasons.push('Prekratak odgovor - moguće izbjegavanje');
        }

        // Consistency check with previous responses
        if (this.checkInconsistency(response)) {
            suspicionLevel += 2;
            reasons.push('Nedosljednost s prethodnim odgovorima');
        }

        return {
            isLie: suspicionLevel >= 3,
            suspicionLevel: suspicionLevel,
            reasons: reasons
        };
    }

    checkInconsistency(response) {
        // Simplified consistency check
        const previousResponses = this.gameState.responseHistory.slice(-3);
        
        // Look for contradictory statements
        return false; // Placeholder - implement more sophisticated logic
    }

    handleLieDetection(lieResult) {
        this.gameState.currentStrikes++;
        
        const host = this.hosts[this.gameState.selectedHost];
        let strikeMessage = '';

        switch (this.gameState.currentStrikes) {
            case 1:
                strikeMessage = this.generateStrike1Message(lieResult, host);
                break;
            case 2:
                strikeMessage = this.generateStrike2Message(lieResult, host);
                this.degradeUI();
                break;
            case 3:
                strikeMessage = this.generateStrike3Message(lieResult, host);
                this.endGame('lie_detection');
                return;
        }

        setTimeout(() => {
            this.addMessage('host', strikeMessage);
            this.showSystemError(`STRIKE ${this.gameState.currentStrikes}/3`);
        }, 500);

        this.updateGameStatus();
    }

    generateStrike1Message(lieResult, host) {
        if (host.speaking_style === 'analytical_clinical') {
            return `Zanimljivo... Detektiram nedosljednost u vašim vitalnim znakovima. ${lieResult.reasons[0]}. Ovo je vaše prvo upozorenje.`;
        } else {
            return `01000101 01010010 01010010... Vaši podaci se ne poklapaju. Sistem je detektirao anomaliju. Strike jedan učitan.`;
        }
    }

    generateStrike2Message(lieResult, host) {
        if (host.speaking_style === 'analytical_clinical') {
            return `Hmm... Vaš obrazac ponašanja postaje sve jasniji. ${lieResult.reasons.join(', ')}. Preporučujem da budete iskreniji - ostao vam je samo jedan pokušaj.`;
        } else {
            return `UPOZORENJE: Sistem detektirao višestruke anomalije. Vaši pokušaji obmane su... primitivni. Jedan strike do terminacije.`;
        }
    }

    generateStrike3Message(lieResult, host) {
        if (host.speaking_style === 'analytical_clinical') {
            return `Nažalost, vaša nemogućnost da budete iskreni je postala jasna. ${lieResult.reasons.join(', ')}. Sesija je završena. Dijagnoza: Kronični lažljivac.`;
        } else {
            return `TERMINACIJA AKTIVIRANA. Vaša neispravnost je potvrđena. Sistem vas označava kao... LAŽLJIVAC. Game over.`;
        }
    }

    updateUserProfile(response) {
        const currentQuestion = this.gameState.currentQuestion;
        
        if (!this.gameState.userProfile[currentQuestion.category]) {
            this.gameState.userProfile[currentQuestion.category] = [];
        }
        
        this.gameState.userProfile[currentQuestion.category].push({
            response: response,
            intensity: this.analyzeResponseIntensity(response),
            vulnerability: this.detectVulnerability(response)
        });
    }

    analyzeResponseIntensity(response) {
        // Analyze emotional intensity in response
        const intensityMarkers = [
            /nikad|nikada|never/i, // 1 point
            /uvijek|always/i, // 1 point
            /mrzim|hate/i, // 2 points
            /volim|love/i, // 1 point
            /bojim se|afraid|fear/i, // 2 points
            /sram|styd|shame/i, // 3 points
            /krivnja|guilt/i, // 3 points
            /tajno|secretly/i, // 2 points
            /skrivam|hiding/i // 2 points
        ];

        let intensity = 0;
        intensityMarkers.forEach(marker => {
            if (marker.test(response)) {
                intensity += 1;
            }
        });

        return Math.min(intensity, 5);
    }

    detectVulnerability(response) {
        const vulnerabilityKeywords = {
            family: /obitelj|family|otac|majka|father|mother|brat|sestra|brother|sister/i,
            relationships: /partneri|partner|veza|relationship|ljubav|love|prekid|breakup/i,
            work: /posao|work|job|šef|boss|kolega|colleague/i,
            health: /zdravlje|health|bolest|disease|depresija|depression/i,
            money: /novac|money|dugovi|debt|siromašan|poor/i,
            addiction: /alkohol|alcohol|drog|drug|ovisan|addicted/i
        };

        for (const [category, pattern] of Object.entries(vulnerabilityKeywords)) {
            if (pattern.test(response)) {
                return category;
            }
        }

        return 'general';
    }

    async generateHostResponse(userResponse, responseTime) {
        // This would ideally call the Hugging Face AI
        // For now, we'll use rule-based responses with personality

        const host = this.hosts[this.gameState.selectedHost];
        const intensity = this.analyzeResponseIntensity(userResponse);
        
        let response = '';

        if (host.speaking_style === 'analytical_clinical') {
            response = this.generateClinicalResponse(userResponse, intensity, responseTime);
        } else {
            response = this.generateDigitalResponse(userResponse, intensity, responseTime);
        }

        return response;
    }

    generateClinicalResponse(userResponse, intensity, responseTime) {
        const responses = [
            "Fascinantno... Ova informacija otkriva puno o vašoj psihološkoj strukturi.",
            "Hmm... Vaš način izražavanja sugerira dublje emocionalne obrasće.",
            "Zanimljivo. Ovo potvrđuje moju početnu hipotezu o vašoj ličnosti.",
            "Vidim... Ova reakcija je tipična za osobe s vašim profilom.",
            "Vaša iskrenost je... ohrabrujuća. Možemo ići dublje."
        ];

        if (intensity > 3) {
            return "Osjećam visoku emocionalnu nabojnost u vašem odgovoru. To je... značajno za moju analizu.";
        }

        if (responseTime > 10000) {
            return "Dugo oklijevanje... To mi govori puno više nego što mislite.";
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }

    generateDigitalResponse(userResponse, intensity, responseTime) {
        const responses = [
            "Podaci primljeni... Analiza u tijeku... Vaš profil se ažurira.",
            "01001001 01001110... Informacija arhivirana u tamnim sektorima sistema.",
            "SKENIRANJE... Detektirane emotivne anomalije... Dublje kopanje potrebno.",
            "Vaši podaci postaju... ukusni. Sistem želi više.",
            "ANALIZA ZAVRŠENA... Pronađene su... zanimljivosti."
        ];

        if (intensity > 3) {
            return "VISOKA ENERGIJA DETEKTIRANA... Sistem registrira emotivnu nestabilnost... Eksploatiraj to.";
        }

        if (responseTime > 10000) {
            return "SPORO PROCESIRANJE... Vaš umni hard disk fragmentiran... Skrivate podatke.";
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }

    startMainGame() {
        this.gameState.phase = 'questioning';
        this.gameState.questionCount = 0;
        
        const host = this.hosts[this.gameState.selectedHost];
        
        let transitionMessage = '';
        if (host.speaking_style === 'analytical_clinical') {
            transitionMessage = "Odličo. Profil je kompletiran. Sada možemo krenuti s pravim ispitivanjem. Pripremi se za neugodna pitanja.";
        } else {
            transitionMessage = "INICIJALNI SKEN ZAVRŠEN... Sada aktiviram protokol duboke penetracije... Pripremi se za invaziju.";
        }

        this.addMessage('host', transitionMessage);
        this.updateGameStatus();

        setTimeout(() => {
            this.askPersonalizedQuestion();
        }, 3000);
    }

    askPersonalizedQuestion() {
        if (this.gameState.currentStrikes >= 3 || this.gameState.gameEnded) {
            return;
        }

        this.gameState.questionCount++;
        
        // Generate personalized question based on user profile
        const personalizedQuestion = this.generatePersonalizedQuestion();
        
        this.gameState.currentQuestion = {
            text: personalizedQuestion,
            category: 'personalized',
            intensity: this.gameState.intensityLevel
        };

        this.addMessage('host', personalizedQuestion);
        this.gameState.lastResponseTime = Date.now();
        
        // Increase intensity over time
        if (this.gameState.questionCount % 3 === 0) {
            this.gameState.intensityLevel = Math.min(this.gameState.intensityLevel + 1, 10);
            this.degradeUI();
        }

        this.updateGameStatus();
    }

    generatePersonalizedQuestion() {
        const profile = this.gameState.userProfile;
        const host = this.hosts[this.gameState.selectedHost];
        
        // Analyze user's vulnerabilities from profile
        let targetCategory = 'general';
        let maxVulnerability = 0;

        Object.entries(profile).forEach(([category, responses]) => {
            const avgIntensity = responses.reduce((sum, r) => sum + r.intensity, 0) / responses.length;
            if (avgIntensity > maxVulnerability) {
                maxVulnerability = avgIntensity;
                targetCategory = category;
            }
        });

        // Generate question based on target category and intensity level
        const baseQuestions = {
            family: [
                "Postoji li član vaše obitelji za kojeg potajno želite da ne postoji?",
                "Koju najgoru stvar ste učinili nekome iz vaše obitelji?",
                "O kome iz vaše obitelji imate seksualne fantazije?",
                "Koga iz obitelji ste ikada želili fizički povrijediti?",
                "Koju obiteljsku tajnu nikome nikad niste rekli?"
            ],
            relationships: [
                "Koliko ljudi ste emotivno manipulirali da bi dobili što želite?",
                "Jeste li ikada varali partnera i uživali u tome?",
                "Koju najokrutniju stvar ste rekli nekome koga ste voljeli?",
                "Jeste li ikada iskoristili nečiju ljubav prema vama da im naškodite?",
                "O kome još uvijek maštate dok ste s trenutnim partnerom?"
            ],
            guilt: [
                "Za što se osjećate najkrivljim - a nikome ne smijete reći?",
                "Koju strašnu stvar ste učinili kao dijete?",
                "Jeste li ikada pustili da netko nedužan pati zbog vaših djela?",
                "Koja vaša pogreška je uništila nečiji život?",
                "Što vas čini najgorim od svih ljudi koje poznajete?"
            ]
        };

        const categoryQuestions = baseQuestions[targetCategory] || [
            "Koja je najcrnja misao koju ste ikada imali?",
            "Što biste učinili ako znate da nećete biti uhvaćeni?",
            "Koju strašnu stvar želite učiniti, ali se ne usuđujete?",
            "Koja vaša tajna bi uništila vaš život ako bi izašla na vidjelo?",
            "Što vas čini čudovištem?"
        ];

        let question = categoryQuestions[Math.floor(Math.random() * categoryQuestions.length)];

        // Personalize based on previous responses
        if (profile.basic_info && profile.basic_info[0]) {
            const name = profile.basic_info[0].response.split(' ')[0];
            question = question.replace(/jeste li/i, `jeste li, ${name},`);
        }

        // Add host personality
        if (host.speaking_style === 'analytical_clinical') {
            question = `Analiza pokazuje vulnerabilnost u ovom području. ${question}`;
        } else {
            question = `DUBOKO SKENIRANJE... ${question} Sistem čeka podatke.`;
        }

        return question;
    }

    addMessage(sender, content) {
        const messagesContainer = document.getElementById('chatMessages');
        
        if (sender === 'host') {
            this.showTypingIndicator();
            
            setTimeout(() => {
                this.hideTypingIndicator();
                const messageDiv = document.createElement('div');
                messageDiv.className = 'message host';
                messageDiv.innerHTML = `
                    <div class="message-header">► ${this.hosts[this.gameState.selectedHost].name}</div>
                    <div class="message-content">${content}</div>
                `;
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000 + Math.random() * 2000);
        } else {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message user';
            messageDiv.innerHTML = `
                <div class="message-header">► KORISNIK</div>
                <div class="message-content">${content}</div>
            `;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            ► ${this.hosts[this.gameState.selectedHost].name} tipka
            <div class="typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    degradeUI() {
        const appContainer = document.querySelector('.app-container');
        
        if (this.gameState.intensityLevel >= 3) {
            appContainer.classList.add('ui-degraded-1');
        }
        if (this.gameState.intensityLevel >= 6) {
            appContainer.classList.add('ui-degraded-2');
        }
        if (this.gameState.intensityLevel >= 9) {
            appContainer.classList.add('ui-degraded-3');
        }
    }

    showSystemError(message) {
        const errorDiv = document.getElementById('systemError');
        document.getElementById('errorMessage').textContent = message;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 3000);
    }

    updateGameStatus() {
        const phaseNames = {
            'host_selection': 'Odabir vodića',
            'profiling': 'Profiliranje',
            'questioning': 'Ispitivanje',
            'game_over': 'Kraj igre'
        };

        const intensityNames = ['Minimalni', 'Nizak', 'Umjeren', 'Povišen', 'Visok', 'Ekstremni', 'Kritični', 'Opasan', 'Maksimalni', 'LETALNI'];

        document.getElementById('gamePhase').textContent = phaseNames[this.gameState.phase];
        document.getElementById('questionNumber').textContent = `${this.gameState.questionCount}/∞`;
        document.getElementById('strikeCount').textContent = `${this.gameState.currentStrikes}/3`;
        document.getElementById('intensityLevel').textContent = intensityNames[this.gameState.intensityLevel - 1];
    }

    endGame(reason) {
        this.gameState.gameEnded = true;
        this.gameState.phase = 'game_over';
        
        document.getElementById('chatInput').disabled = true;
        document.getElementById('sendMessage').disabled = true;

        let endMessage = '';
        const host = this.hosts[this.gameState.selectedHost];

        switch (reason) {
            case 'lie_detection':
                if (host.speaking_style === 'analytical_clinical') {
                    endMessage = "Sesija je završena. Vaša nemogućnost da budete iskreni čini vas neprikladnim za daljnje testiranje. Dijagnoza: Kronična dishonestnost.";
                } else {
                    endMessage = "SISTEM TERMINIRAN. Vaša klasifikacija: LAŽLJIVAC. Podaci arhivirani u crni registar. Pristup zabranjen.";
                }
                break;
        }

        this.addMessage('host', endMessage);
        this.updateGameStatus();

        // Final system corruption effect
        setTimeout(() => {
            document.querySelector('.app-container').classList.add('ui-degraded-3');
            this.showSystemError('GAME OVER - SISTEM CORRUPTED');
        }, 3000);
    }
}

// Initialize the TV Host AI system
document.addEventListener('DOMContentLoaded', () => {
    window.tvHostAI = new TVHostAI();
    
    console.log('%c🎭 TRENUTAK ISTINE - TV HOST AI ACTIVATED', 'color: #ff0040; font-size: 20px; font-weight: bold;');
    console.log('%cPsihološki digitalni labirint inicijaliziran...', 'color: #00ff41; font-size: 14px;');
});
