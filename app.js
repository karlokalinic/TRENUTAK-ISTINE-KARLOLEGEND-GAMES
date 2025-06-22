// ===================
// TRENUTAK ISTINE - GAME LOGIC
// Enhanced Horror Psychological Game
// ===================

class TrenutakIstineGame {
    constructor() {
        // Game Data
        this.questions = [
            {"id": 1, "text": "Jesi li ikada ukrao nešto iz trgovine, bez obzira na vrijednost?", "category": "moral", "intensity": 1},
            {"id": 2, "text": "Jesi li ikada lagao na životopisu ili razgovoru za posao?", "category": "work", "intensity": 1},
            {"id": 3, "text": "Jesi li ikada bio fizički agresivan prema nekome tko ti nije prijetio?", "category": "violence", "intensity": 2},
            {"id": 4, "text": "Jesi li ikada poželio da ti roditelj umre?", "category": "family", "intensity": 3},
            {"id": 5, "text": "Jesi li ikada namjerno oštetio tuđu imovinu iz osvete?", "category": "moral", "intensity": 2},
            {"id": 6, "text": "Jesi li ikada uzeo novac koji nije bio tvoj, a nitko to nije primijetio?", "category": "moral", "intensity": 2},
            {"id": 7, "text": "Jesi li ikada prevario na ispitu ili važnom testu?", "category": "education", "intensity": 2},
            {"id": 8, "text": "Jesi li ikada rekao nekome da ga voliš, a nije bilo istina?", "category": "relationships", "intensity": 3},
            {"id": 9, "text": "Jesi li ikada namjerno povrijedio životinje radi zabave?", "category": "cruelty", "intensity": 4},
            {"id": 10, "text": "Jesi li ikada masturbirao misleći na nekoga iz svoje obitelji?", "category": "sexuality", "intensity": 5},
            {"id": 11, "text": "Jesi li ikada poželio da se tvoj najbolji prijatelj razboli?", "category": "friendship", "intensity": 3},
            {"id": 12, "text": "Jesi li ikada imao seksualnu fantaziju o maloljetnoj osobi?", "category": "sexuality", "intensity": 6},
            {"id": 13, "text": "Jesi li ikada pustio da netko drugi preuzme krivnju za nešto što si ti napravio?", "category": "moral", "intensity": 4},
            {"id": 14, "text": "Jesi li ikada htio fizički povrijediti nekoga koga voliš?", "category": "violence", "intensity": 5},
            {"id": 15, "text": "Jesi li ikada razmotrijo mogućnost samoubojstva?", "category": "mental_health", "intensity": 5},
            {"id": 16, "text": "Jesi li ikada bio nevjeran svom partneru/partnerici?", "category": "relationships", "intensity": 4},
            {"id": 17, "text": "Jesi li ikada uzeo drogu teže od marihuane?", "category": "drugs", "intensity": 4},
            {"id": 18, "text": "Jesi li ikada počinio kriminalno djelo za koje nisi uhvaćen?", "category": "crime", "intensity": 5},
            {"id": 19, "text": "Postoji li netko u tvom životu za kojeg bi svijet bio bolje mjesto kad bi umro?", "category": "dark_thoughts", "intensity": 6},
            {"id": 20, "text": "Jesi li ikada razmišljao o tome da povrijediš dijete?", "category": "dark_thoughts", "intensity": 7},
            {"id": 21, "text": "Koja je najgora stvar koju si ikada napravio u svom životu, a nikome je nisi rekao?", "category": "confession", "intensity": 8}
        ];

        this.hostComments = {
            intro: [
                "Dobrodošao u psihološki labirint tvoje duše. Ovdje nema mjesta lažima.",
                "Vidim ti strah u očima. To je dobro. Strah je prvi korak prema istini.",
                "Algoritam je spreman. Tvoja duša će biti razmotrena kroz 21 pitanje.",
                "Nije kasno za povlačenje... ali možda je već prekasno za tebe."
            ],
            yes_moral: [
                "Ah, moral... Ta krhka granica između civilizacije i divljaštva. Prekršio si je.",
                "Svaki čin ima svoju cijenu. Pitanje je jesi li spreman platiti svoju.",
                "Zanimljivo... Tvoja savjest očito nije tvoj vodič.",
                "Moral je luksuz koji si si nemogao priuštiti, zar ne?"
            ],
            yes_family: [
                "Obitelj... Oni koji nas trebaju najviše voljeti i koje mi trebamo najviše voljeti. A ipak...",
                "Krv od krvi, meso od mesa. A ti si protiv njih okrenuo svoje najmračnije misli.",
                "Obiteljski uzovi mogu biti teži od lanaca, ali ti si našao način da ih prekineš.",
                "Tvoje najdublje rane dolaze od onih koji su trebali biti tvoja sigurnost."
            ],
            yes_violence: [
                "Nasilje... Prvi jezik koji čovječanstvo uči, zadnji koji zaboravlja.",
                "U tebi postoji zvjer. Pitanje je koliko često ju pustiš van.",
                "Fizička bol je prolazna. Ono što ostaje je spoznaja da si sposoban za to.",
                "Moć nad drugima... Opijna je, zar ne?"
            ],
            yes_sexuality: [
                "Seksualnost... Najdublji i najmračniji dio naše prirode.",
                "Tabui postoje iz razloga. Ti si ih prekršio.",
                "Tvoje želje govore više o tebi nego što bi htio priznati.",
                "U mraku svoje intime skrivaju se najcrnje tajne."
            ],
            no_responses: [
                "Hmm... Ili si iznimno čist, ili iznimno dobar lažljivac.",
                "Možda si pametan i kontroliraš što otkrivvaš. Možda si samo dosadan.",
                "Svaki 'ne' može biti maska za dublju istinu.",
                "Algoritam detektira... nedosljednost u tvojim odgovorima.",
                "Možda još nisi spreman suočiti se s pravom istinom.",
                "Čak i lažljivci imaju svoju istinu. Koja je tvoja?"
            ],
            level_transitions: {
                level2: "Prva razina je završena. 25.000 kuna je u tvom džepu. Ali stvarna igra tek počinje...",
                level3: "100.000 kuna... Osjećam kako ti se dlan znoji. Možda je vrijeme da prestaneš?",
                level4: "200.000 kuna. Stigli smo do srži tvoje duše. Nadam se da je spremna.",
                level5: "350.000 kuna. Ovdje se odvojčaju junaci od kukavica. U koju kategoriju spadaš?",
                level6: "Poslednje pitanje. Pola milijuna kuna. Jedna istina između tebe i bogatstva."
            },
            dramatic_moments: [
                "Algoritam detektira povišenu aktivnost... Nešto se krije u tvojoj prošlosti.",
                "Tvoj obrazac odgovora otkriva duboko skrivene traume.",
                "Zanimljivo... Tvoja psihološka struktura pokazuje tendencije prema...",
                "Čekaj... Ovo je neočekivano. Algoritam je pronašao nešto što si mislio da si zakопао.",
                "Tvoja energija se promijenila. Što te muči u ovom trenutku?",
                "Detektiram strah. Ne od pitanja, već od odgovora."
            ]
        };

        this.moneyLevels = [0, 25000, 100000, 200000, 350000, 500000];

        // Game State
        this.currentLevel = 1;
        this.currentQuestionIndex = 0;
        this.currentMoney = 0;
        this.answeredQuestions = [];
        this.yesAnswers = 0;
        this.noAnswers = 0;
        this.gameEnded = false;
        this.userBehaviorProfile = {
            honesty: 50,
            darkness: 0,
            risk_taking: 0,
            categories: {}
        };

        // UI Elements
        this.screens = {
            intro: document.getElementById('introScreen'),
            game: document.getElementById('gameScreen'),
            end: document.getElementById('endScreen')
        };

        // TTS & Audio
        this.ttsEnabled = true;
        this.audioEnabled = true;
        this.speechSynth = window.speechSynthesis;
        this.currentUtterance = null;
        this.backgroundMusic = document.getElementById('backgroundMusic');

        // Chat system
        this.chatMessages = [];
        this.chatBox = document.getElementById('chatBox');
        this.isTyping = false;

        this.init();
    }

    init() {
        this.bindEvents();
        this.showIntroScreen();
        this.setupAudio();
        this.setupKeyboardShortcuts();
        this.addInitialChatMessage();
    }

    bindEvents() {
        // Start game
        document.getElementById('startGame').addEventListener('click', () => this.startGame());

        // Answer buttons
        document.getElementById('answerYes').addEventListener('click', () => this.answerQuestion(true));
        document.getElementById('answerNo').addEventListener('click', () => this.answerQuestion(false));

        // Quit game
        document.getElementById('quitGame').addEventListener('click', () => this.quitGame());

        // End screen
        document.getElementById('restartGame').addEventListener('click', () => this.restartGame());
        document.getElementById('backToMenu').addEventListener('click', () => this.showIntroScreen());

        // Audio controls
        document.getElementById('muteToggle').addEventListener('click', () => this.toggleAudio());
        document.getElementById('volumeSlider').addEventListener('input', (e) => this.setVolume(e.target.value));

        // TTS controls
        document.getElementById('ttsToggle').addEventListener('click', () => this.toggleTTS());
        document.getElementById('repeatTTS').addEventListener('click', () => this.repeatTTS());

        // Chat controls
        document.getElementById('chatToggle').addEventListener('click', () => this.toggleChat());
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (this.screens.game.classList.contains('hidden')) return;

            switch(e.key.toLowerCase()) {
                case 'enter':
                    e.preventDefault();
                    this.answerQuestion(true);
                    break;
                case ' ':
                    e.preventDefault();
                    this.answerQuestion(false);
                    break;
                case 'q':
                    e.preventDefault();
                    if (!document.getElementById('quitGame').disabled) {
                        this.quitGame();
                    }
                    break;
                case 't':
                    e.preventDefault();
                    this.toggleTTS();
                    break;
                case 'c':
                    e.preventDefault();
                    this.toggleChat();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleAudio();
                    break;
                case 'h':
                    e.preventDefault();
                    this.toggleKeyboardHelp();
                    break;
                case 'escape':
                    e.preventDefault();
                    if (this.currentLevel > 1) {
                        this.quitGame();
                    }
                    break;
            }
        });

        // Show keyboard help initially
        setTimeout(() => {
            this.showKeyboardHelp();
        }, 3000);
    }

    setupAudio() {
        // Background music setup (ready for API.BOX V4.5)
        this.backgroundMusic.volume = 0.7;
        
        // Load background music when API is ready
        this.loadBackgroundMusic();
    }

    async loadBackgroundMusic() {
        try {
            // This will be connected to API.BOX V4.5 for dynamic music generation
            // For now, we prepare the infrastructure
            console.log('Preparing background music infrastructure for API.BOX V4.5...');
            
            // Placeholder for API.BOX integration
            // const musicResponse = await fetch('API.BOX_V4.5_ENDPOINT', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({
            //         genre: 'horror_ambient',
            //         mood: 'eerie_psychological',
            //         duration: 300,
            //         elements: ['whispers', 'distant_piano', 'ambient_drones']
            //     })
            // });
            
        } catch (error) {
            console.log('Background music will be loaded when API.BOX V4.5 is integrated');
        }
    }

    showIntroScreen() {
        this.hideAllScreens();
        this.screens.intro.classList.remove('hidden');
        this.resetGame();
    }

    startGame() {
        this.hideAllScreens();
        this.screens.game.classList.remove('hidden');
        this.gameEnded = false;
        this.currentLevel = 1;
        this.currentQuestionIndex = 0;
        this.updateUI();
        this.loadNextQuestion();
        this.playBackgroundMusic();
        this.addChatMessage('Igra je počela! Analiziram tvoje odgovore...', 'ai');
    }

    hideAllScreens() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.add('hidden');
        });
    }

    resetGame() {
        this.currentLevel = 1;
        this.currentQuestionIndex = 0;
        this.currentMoney = 0;
        this.answeredQuestions = [];
        this.yesAnswers = 0;
        this.noAnswers = 0;
        this.gameEnded = false;
        this.chatMessages = [];
        this.userBehaviorProfile = {
            honesty: 50,
            darkness: 0,
            risk_taking: 0,
            categories: {}
        };
    }

    loadNextQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame(true);
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        document.getElementById('questionText').textContent = question.text;
        
        // Add dramatic effect for high-intensity questions
        if (question.intensity >= 5) {
            document.getElementById('questionText').classList.add('pulse');
            this.triggerGlitchEffect();
        } else {
            document.getElementById('questionText').classList.remove('pulse');
        }

        // Enable quit button after first level
        document.getElementById('quitGame').disabled = this.currentLevel <= 1;

        this.updateProgressBar();
        this.speakText(question.text);
    }

    answerQuestion(isYes) {
        if (this.gameEnded) return;

        const question = this.questions[this.currentQuestionIndex];
        this.answeredQuestions.push({
            question: question,
            answer: isYes,
            level: this.currentLevel
        });

        if (isYes) {
            this.yesAnswers++;
        } else {
            this.noAnswers++;
        }

        // Update behavior profile
        this.updateBehaviorProfile(question, isYes);

        // Generate AI response
        const aiResponse = this.generateAIResponse(question, isYes);
        this.addChatMessage(aiResponse, 'ai');
        this.speakText(aiResponse);

        // Add user response to chat
        this.addChatMessage(isYes ? 'DA' : 'NE', 'user');

        // Check level progression
        this.currentQuestionIndex++;
        
        if (this.shouldLevelUp()) {
            this.levelUp();
        } else {
            this.loadNextQuestion();
        }

        this.updateUI();
    }

    shouldLevelUp() {
        const questionsPerLevel = Math.ceil(this.questions.length / 6);
        return this.currentQuestionIndex > 0 && this.currentQuestionIndex % questionsPerLevel === 0 && this.currentLevel < 6;
    }

    levelUp() {
        this.currentLevel++;
        this.currentMoney = this.moneyLevels[this.currentLevel - 1];
        
        const levelComment = this.hostComments.level_transitions[`level${this.currentLevel}`];
        if (levelComment) {
            this.addChatMessage(levelComment, 'ai');
            this.speakText(levelComment);
        }

        // Add dramatic pause
        setTimeout(() => {
            this.loadNextQuestion();
        }, 2000);

        this.triggerLevelUpEffect();
    }

    updateBehaviorProfile(question, isYes) {
        // Update category tracking
        if (!this.userBehaviorProfile.categories[question.category]) {
            this.userBehaviorProfile.categories[question.category] = { yes: 0, no: 0 };
        }
        
        if (isYes) {
            this.userBehaviorProfile.categories[question.category].yes++;
            this.userBehaviorProfile.darkness += question.intensity;
        } else {
            this.userBehaviorProfile.categories[question.category].no++;
        }

        // Calculate risk-taking behavior
        if (this.currentLevel > 1 && isYes && question.intensity >= 4) {
            this.userBehaviorProfile.risk_taking += 10;
        }

        // Adjust honesty based on response patterns
        if (question.intensity <= 2 && !isYes) {
            this.userBehaviorProfile.honesty -= 5; // Likely lying on easy questions
        }
    }

    generateAIResponse(question, isYes) {
        const responses = [];
        
        if (isYes) {
            if (question.category === 'moral') {
                responses.push(...this.hostComments.yes_moral);
            } else if (question.category === 'family') {
                responses.push(...this.hostComments.yes_family);
            } else if (question.category === 'violence') {
                responses.push(...this.hostComments.yes_violence);
            } else if (question.category === 'sexuality') {
                responses.push(...this.hostComments.yes_sexuality);
            }
        } else {
            responses.push(...this.hostComments.no_responses);
        }

        // Add dramatic moments based on behavior analysis
        if (this.shouldTriggerDramaticMoment(question, isYes)) {
            responses.push(...this.hostComments.dramatic_moments);
        }

        return responses[Math.floor(Math.random() * responses.length)];
    }

    shouldTriggerDramaticMoment(question, isYes) {
        // Trigger dramatic moments based on psychological patterns
        const yesRatio = this.yesAnswers / (this.yesAnswers + this.noAnswers);
        
        return (
            question.intensity >= 6 ||
            (isYes && question.intensity >= 4 && yesRatio > 0.7) ||
            (this.userBehaviorProfile.darkness > 20) ||
            (this.currentQuestionIndex > 0 && this.currentQuestionIndex % 7 === 0)
        );
    }

    quitGame() {
        this.endGame(false);
    }

    endGame(completed) {
        this.gameEnded = true;
        this.hideAllScreens();
        this.screens.end.classList.remove('hidden');
        this.stopBackgroundMusic();

        // Update final stats
        document.getElementById('finalMoney').textContent = `${this.currentMoney.toLocaleString()} kn`;
        document.getElementById('questionsAnswered').textContent = `${this.answeredQuestions.length}/21`;
        document.getElementById('yesAnswers').textContent = this.yesAnswers;
        document.getElementById('noAnswers').textContent = this.noAnswers;

        // Generate end message
        const endMessage = this.generateEndMessage(completed);
        document.getElementById('endMessage').textContent = endMessage;
        this.speakText(endMessage);
    }

    generateEndMessage(completed) {
        if (completed) {
            return "Čestitamo! Prošao si kroz svih 21 pitanje. Tvoja istina je otkrivena, ali cijena je bila visoka...";
        } else if (this.currentMoney > 0) {
            return `Odlučio si stati na ${this.currentMoney.toLocaleString()} kuna. Možda je mudrost znati kada stati.`;
        } else {
            return "Istina je bila previše teška za podnošenje. Možda je to također vrsta odgovora.";
        }
    }

    restartGame() {
        this.resetGame();
        this.startGame();
    }

    updateUI() {
        document.getElementById('currentLevel').textContent = this.currentLevel;
        document.getElementById('currentMoney').textContent = `${this.currentMoney.toLocaleString()} kn`;
        document.getElementById('questionNumber').textContent = `${this.currentQuestionIndex + 1}/21`;
    }

    updateProgressBar() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    // ===================
    // CHAT SYSTEM
    // ===================
    addInitialChatMessage() {
        const initialMessage = this.hostComments.intro[Math.floor(Math.random() * this.hostComments.intro.length)];
        this.addChatMessage(initialMessage, 'ai');
    }

    addChatMessage(text, sender) {
        this.chatMessages.push({ text, sender, time: new Date() });
        this.renderChatMessage(text, sender);
    }

    renderChatMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message fade-in`;
        
        const timeStr = new Date().toLocaleTimeString('hr-HR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageDiv.innerHTML = `
            <div class="message-content">${text}</div>
            <div class="message-time">${timeStr}</div>
        `;
        
        if (sender === 'ai') {
            this.showTypingIndicator();
            setTimeout(() => {
                this.hideTypingIndicator();
                messagesContainer.appendChild(messageDiv);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000 + Math.random() * 2000);
        } else {
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    showTypingIndicator() {
        document.getElementById('chatTyping').classList.add('active');
    }

    hideTypingIndicator() {
        document.getElementById('chatTyping').classList.remove('active');
    }

    toggleChat() {
        this.chatBox.classList.toggle('collapsed');
    }

    // ===================
    // TEXT-TO-SPEECH
    // ===================
    speakText(text) {
        if (!this.ttsEnabled || !this.speechSynth) return;

        // Stop current speech
        this.speechSynth.cancel();

        // Create utterance with eerie settings
        this.currentUtterance = new SpeechSynthesisUtterance(text);
        
        // Configure for eerie effect
        this.currentUtterance.pitch = 0.1;  // Very low pitch
        this.currentUtterance.rate = 0.7;   // Slow rate
        this.currentUtterance.volume = 0.8;
        
        // Try to find a suitable voice
        const voices = this.speechSynth.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.lang.startsWith('hr') || 
            voice.lang.startsWith('en') ||
            voice.name.toLowerCase().includes('male')
        );
        
        if (preferredVoice) {
            this.currentUtterance.voice = preferredVoice;
        }

        // Visual feedback
        this.currentUtterance.onstart = () => {
            document.getElementById('speakingIndicator').classList.add('active');
        };

        this.currentUtterance.onend = () => {
            document.getElementById('speakingIndicator').classList.remove('active');
        };

        this.speechSynth.speak(this.currentUtterance);
    }

    toggleTTS() {
        this.ttsEnabled = !this.ttsEnabled;
        const ttsIcon = document.querySelector('#ttsToggle .tts-icon');
        ttsIcon.textContent = this.ttsEnabled ? '🎙️' : '🔇';
        
        if (!this.ttsEnabled) {
            this.speechSynth.cancel();
            document.getElementById('speakingIndicator').classList.remove('active');
        }
    }

    repeatTTS() {
        const currentText = document.getElementById('aiComment').textContent;
        this.speakText(currentText);
    }

    // ===================
    // AUDIO SYSTEM
    // ===================
    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const audioIcon = document.querySelector('#muteToggle .audio-icon');
        audioIcon.textContent = this.audioEnabled ? '🔊' : '🔇';
        
        if (this.audioEnabled) {
            this.playBackgroundMusic();
        } else {
            this.stopBackgroundMusic();
        }
    }

    setVolume(value) {
        const volume = value / 100;
        this.backgroundMusic.volume = volume;
    }

    playBackgroundMusic() {
        if (this.audioEnabled && this.backgroundMusic.src) {
            this.backgroundMusic.play().catch(e => {
                console.log('Background music will play when source is loaded');
            });
        }
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
    }

    // ===================
    // VISUAL EFFECTS
    // ===================
    triggerGlitchEffect() {
        const glitchElement = document.querySelector('.glitch-effect');
        glitchElement.style.animation = 'none';
        setTimeout(() => {
            glitchElement.style.animation = 'glitchFlash 0.5s ease-in-out';
        }, 10);
    }

    triggerLevelUpEffect() {
        const gameContainer = document.querySelector('.game-container');
        gameContainer.style.animation = 'none';
        setTimeout(() => {
            gameContainer.style.animation = 'commentFadeIn 1s ease-out';
        }, 10);
    }

    // ===================
    // KEYBOARD HELP
    // ===================
    showKeyboardHelp() {
        const helpElement = document.getElementById('keyboardHelp');
        helpElement.classList.add('visible');
        
        setTimeout(() => {
            helpElement.classList.remove('visible');
        }, 5000);
    }

    toggleKeyboardHelp() {
        const helpElement = document.getElementById('keyboardHelp');
        helpElement.classList.toggle('visible');
    }

    // ===================
    // ADAPTIVE AI FEATURES
    // ===================
    analyzeUserBehavior() {
        const analysis = {
            totalQuestions: this.answeredQuestions.length,
            yesRatio: this.yesAnswers / (this.yesAnswers + this.noAnswers || 1),
            avgIntensity: this.answeredQuestions.reduce((sum, q) => sum + q.question.intensity, 0) / this.answeredQuestions.length,
            riskLevel: this.userBehaviorProfile.risk_taking,
            darknessLevel: this.userBehaviorProfile.darkness,
            honestyLevel: this.userBehaviorProfile.honesty
        };

        return analysis;
    }

    generateAdaptiveComment() {
        const analysis = this.analyzeUserBehavior();
        
        if (analysis.yesRatio > 0.8) {
            return "Tvoja spremnost na priznanje je... zabrinjavajuća. Ili si hrabar, ili bezobziran.";
        } else if (analysis.yesRatio < 0.2) {
            return "Možda bi trebao biti iskreniji. Algoritam vidi kroz tvoje maske.";
        } else if (analysis.darknessLevel > 25) {
            return "Tvoje najdublje tajne izlaze na površinu. Nema povratka sada.";
        }
        
        return "Zanimljiv profil... Algoritam još uvijek analizira tvoju psihološku strukturu.";
    }
}

// ===================
// INITIALIZATION
// ===================
document.addEventListener('DOMContentLoaded', () => {
    // Wait for voices to load
    let voicesLoaded = false;
    
    const initGame = () => {
        if (!voicesLoaded) {
            if (window.speechSynthesis.getVoices().length > 0) {
                voicesLoaded = true;
            } else {
                window.speechSynthesis.addEventListener('voiceschanged', () => {
                    voicesLoaded = true;
                });
            }
        }
        
        // Initialize game
        window.game = new TrenutakIstineGame();
        
        // Add some theatrical flair
        setTimeout(() => {
            console.log('%c🎭 TRENUTAK ISTINE - KARLOLEGEND GAMES 🎭', 'color: #cc0000; font-size: 20px; font-weight: bold;');
            console.log('%cPsihološki labirint vaše duše je spreman...', 'color: #ffd700; font-size: 14px;');
        }, 1000);
    };
    
    initGame();
});

// ===================
// UTILITY FUNCTIONS
// ===================

// Prevent right-click context menu for immersion
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Prevent text selection for better UX
document.addEventListener('selectstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
});

// Add dramatic page visibility handling
document.addEventListener('visibilitychange', () => {
    if (window.game) {
        if (document.hidden) {
            window.game.stopBackgroundMusic();
        } else {
            window.game.playBackgroundMusic();
        }
    }
});

// Error handling for TTS
window.addEventListener('error', (e) => {
    if (e.message.includes('speechSynthesis')) {
        console.log('TTS not available, continuing without voice');
    }
});

// ===================
// EXPORT FOR TESTING
// ===================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TrenutakIstineGame;
}