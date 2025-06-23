// script.js - Finalna i Ispravljena Verzija

// Čeka da se cijela stranica učita prije pokretanja skripte
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Pokretanje Trenutak Istine aplikacije...');
    // Kreira novu instancu igre, što automatski pokreće sve
    new TrenutakIstineGame();
});

/**
 * Glavna klasa koja upravlja cjelokupnom logikom igre "Trenutak Istine"
 */
class TrenutakIstineGame {
    /**
     * Constructor se poziva čim se klasa kreira.
     * Služi za inicijalno postavljanje varijabli i pokretanje igre.
     */
    constructor() {
        // --- Dohvaćanje HTML elemenata ---
        this.elements = {
            startScreen: document.getElementById('start-screen'),
            gameScreen: document.getElementById('game-screen'),
            endScreen: document.getElementById('end-screen'),
            questionContainer: document.getElementById('question-container'),
            hostCommentContainer: document.getElementById('host-comment-container'),
            yesButton: document.getElementById('yes-btn'),
            noButton: document.getElementById('no-btn'),
            levelButtons: document.querySelectorAll('.level-btn'),
            finalAnalysis: document.getElementById('final-analysis'),
            loadingIndicator: document.getElementById('loading-indicator')
        };

        // --- Stanje igre (game state) ---
        this.gameState = {
            isGameActive: false,
            currentQuestionIndex: 0,
            totalQuestions: 0,
            answers: []
        };

        // Inicijalizacija igre
        this.initializeGame();
    }

    //
    // --- ISPRAVAK: Sve metode su sada izvan constructora i direktno unutar klase ---
    //

    /**
     * Inicijalizira igru, postavlja event listenere i prikazuje početni ekran.
     */
    initializeGame() {
        console.log('🎬 Inicijaliziranje Trenutak Istine...');
        this.setupEventListeners();
        this.showStartScreen(); // Ova linija je prije uzrokovala grešku
    }

    /**
     * Postavlja sve potrebne event listenere (klikanje na gumbe).
     */
    setupEventListeners() {
        // Listeneri za odabir razine (dubine analize)
        this.elements.levelButtons.forEach(button => {
            button.addEventListener('click', () => {
                const questions = parseInt(button.getAttribute('data-questions'), 10);
                this.startGame(questions);
            });
        });

        // Listener za 'DA' gumb
        this.elements.yesButton.addEventListener('click', () => this.handleAnswer('DA'));

        // Listener za 'NE' gumb
        this.elements.noButton.addEventListener('click', () => this.handleAnswer('NE'));
    }

    /**
     * Prikazuje početni ekran gdje korisnik bira dubinu igre.
     */
    showStartScreen() {
        this.elements.startScreen.style.display = 'block';
        this.elements.gameScreen.style.display = 'none';
        this.elements.endScreen.style.display = 'none';
        this.hideLoading();
    }

    /**
     * Započinje igru s odabranim brojem pitanja.
     * @param {number} totalQuestions - Broj pitanja za igru (15, 21 ili 30).
     */
    startGame(totalQuestions) {
        this.gameState.totalQuestions = totalQuestions;
        this.gameState.isGameActive = true;
        this.gameState.currentQuestionIndex = 0;
        this.gameState.answers = [];

        this.elements.startScreen.style.display = 'none';
        this.elements.gameScreen.style.display = 'block';

        this.adaptiveEngine = new AdaptiveQuestionEngine(totalQuestions);
        this.displayNextQuestion();
    }

    /**
     * Prikazuje sljedeće pitanje ili završava igru ako su sva pitanja odgovorena.
     */
    async displayNextQuestion() {
        this.elements.hostCommentContainer.innerText = '...';
        this.enableAnswerButtons();

        if (this.gameState.currentQuestionIndex < this.gameState.totalQuestions) {
            const question = this.adaptiveEngine.getNextQuestion();
            this.elements.questionContainer.innerText = `Pitanje ${this.gameState.currentQuestionIndex + 1}/${this.gameState.totalQuestions}: ${question.text}`;
            this.gameState.currentQuestionIndex++;
        } else {
            await this.endGame();
        }
    }

    /**
     * Obrađuje odgovor korisnika, šalje ga AI-ju i priprema za sljedeće pitanje.
     * @param {string} answer - Odgovor korisnika ('DA' ili 'NE').
     */
    async handleAnswer(answer) {
        if (!this.gameState.isGameActive) return;

        this.disableAnswerButtons();
        this.showLoading();

        const currentQuestion = this.adaptiveEngine.getCurrentQuestion();
        const questionText = currentQuestion.text;
        
        // Spremi odgovor
        this.gameState.answers.push({ question: questionText, answer });
        this.adaptiveEngine.recordAnswer(answer);

        try {
            const gameContext = {
                currentLevel: this.adaptiveEngine.getCurrentIntensity(),
                answeredQuestions: this.gameState.answers
            };

            // Poziv Netlify funkcije za dohvaćanje AI komentara
            const response = await fetch('/.netlify/functions/get-ai-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pitanje: questionText,
                    odgovor: answer,
                    kontekstIgre: gameContext
                })
            });

            if (!response.ok) {
                throw new Error('Greška u komunikaciji s AI serverom.');
            }

            const data = await response.json();
            this.elements.hostCommentContainer.innerText = data.komentar;

        } catch (error) {
            console.error('Greška pri dohvaćanju AI komentara:', error);
            this.elements.hostCommentContainer.innerText = "Izgleda da je vaš odgovor izazvao tehničke smetnje... Nastavljamo dalje.";
        }

        this.hideLoading();

        // Dramatična pauza prije sljedećeg pitanja
        setTimeout(() => {
            this.displayNextQuestion();
        }, 3000); // 3 sekunde pauze
    }

    /**
     * Završava igru i prikazuje konačnu psihološku analizu.
     */
    async endGame() {
        this.gameState.isGameActive = false;
        this.showLoading();
        this.elements.gameScreen.style.display = 'none';
        
        try {
             // Poziv AI-ju za finalnu analizu
            const finalResponse = await fetch('/.netlify/functions/get-ai-comment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    pitanje: "GENERIRAJ FINALNU ANALIZU",
                    odgovor: "KRAJ IGRE",
                    kontekstIgre: { answeredQuestions: this.gameState.answers }
                })
            });
            const data = await finalResponse.json();
            this.elements.finalAnalysis.innerText = data.komentar;
        } catch(e) {
            this.elements.finalAnalysis.innerText = "Došlo je do greške prilikom generiranja finalne analize. Molimo osvježite stranicu.";
        }

        this.hideLoading();
        this.elements.endScreen.style.display = 'block';
    }
    
    // --- Pomoćne funkcije (helpers) ---
    showLoading() { this.elements.loadingIndicator.style.display = 'block'; }
    hideLoading() { this.elements.loadingIndicator.style.display = 'none'; }
    disableAnswerButtons() {
        this.elements.yesButton.disabled = true;
        this.elements.noButton.disabled = true;
    }
    enableAnswerButtons() {
        this.elements.yesButton.disabled = false;
        this.elements.noButton.disabled = false;
    }
}


/**
 * Klasa koja inteligentno bira sljedeće pitanje na temelju odgovora.
 */
class AdaptiveQuestionEngine {
    constructor(totalQuestions) {
        this.totalQuestions = totalQuestions;
        this.currentIntensity = 1;
        this.responseHistory = [];
        this.usedQuestionIds = new Set();
        this.currentQuestion = null;

        // Pojednostavljena baza pitanja (u pravoj aplikaciji bila bi veća)
        this.questionBank = [
            { id: 1, text: "Jeste li ikada slagali na životopisu kako biste dobili posao?", category: 'Iskrenost', intensity: 1 },
            { id: 2, text: "Jeste li ikada uzeli nešto iz trgovine, a da niste platili?", category: 'Moral', intensity: 2 },
            { id: 3, text: "Jeste li ikada prevarili partnera?", category: 'Odnosi', intensity: 3 },
            { id: 4, text: "Biste li prihvatili milijun eura da više nikada ne razgovarate s najboljim prijateljem?", category: 'Vrijednosti', intensity: 2 },
            { id: 5, text: "Jeste li ikada namjerno povrijedili nečije osjećaje iz čiste zabave?", category: 'Empatija', intensity: 4 },
            // Dodajte još pitanja ovdje...
            { id: 6, text: "Mislite li da ste bolji od većine ljudi koje poznajete?", category: 'Ego', intensity: 2 },
            { id: 7, text: "Jeste li ikada potajno čitali poruke na partnerovom mobitelu?", category: 'Povjerenje', intensity: 3 },
            { id: 8, text: "Jeste li ikada poželjeli da se nešto loše dogodi nekome tko vas je povrijedio?", category: 'Osveta', intensity: 4 },
            { id: 9, text: "Da li ste ikada iskoristili nečiju tajnu protiv te osobe?", category: 'Manipulacija', intensity: 5 },
            { id: 10, text: "Smatrate li da cilj opravdava svako sredstvo?", category: 'Moral', intensity: 3 }
        ];
    }

    recordAnswer(answer) {
        this.responseHistory.push(answer);
        // 'DA' na teška pitanja povećava intenzitet sljedećih
        if (answer === 'DA' && this.currentIntensity < 5) {
            this.currentIntensity++;
        }
    }

    getNextQuestion() {
        // Filtriraj pitanja koja odgovaraju trenutnom intenzitetu i koja nisu korištena
        let availableQuestions = this.questionBank.filter(
            q => q.intensity <= this.currentIntensity && !this.usedQuestionIds.has(q.id)
        );

        if (availableQuestions.length === 0) {
            // Ako nema više pitanja na toj razini, uzmi bilo koje preostalo
            availableQuestions = this.questionBank.filter(q => !this.usedQuestionIds.has(q.id));
        }

        // Ako nema više nikakvih pitanja, vrati zadnje
        if(availableQuestions.length === 0) return this.currentQuestion;

        const randomIndex = Math.floor(Math.random() * availableQuestions.length);
        const nextQuestion = availableQuestions[randomIndex];

        this.usedQuestionIds.add(nextQuestion.id);
        this.currentQuestion = nextQuestion;
        return nextQuestion;
    }
    
    getCurrentQuestion() {
        return this.currentQuestion;
    }

    getCurrentIntensity() {
        return this.currentIntensity;
    }
}
