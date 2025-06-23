// Trenutak Istine - Glavna JavaScript datoteka s AI integracijom
class TrenutakIstineGame {
  constructor() {
    this.gameState = {
      isGameActive: false,
      currentQuestion: 1,
      totalQuestions: 21, // Varijabilan broj
      currentLevel: 1,
      questionStartTime: 0,
      playerAnswers: [],
      aiComments: []
    };
    
    this.currentQuestionObj = null;
    this.aiEndpoint = '/.netlify/functions/get-ai-comment';
    this.initializeGame();
  }

  // Inicijalizacija igre
  initializeGame() {
    console.log('🎬 Inicijaliziranje Trenutak Istine...');
    this.setupEventListeners();
    this.showStartScreen();
  }

  // Event listeners
  setupEventListeners() {
    const daBtn = document.getElementById('da-btn');
    const neBtn = document.getElementById('ne-btn');
    const startBtn = document.getElementById('start-game');

    if (daBtn) daBtn.addEventListener('click', () => this.handleAnswer('DA'));
    if (neBtn) neBtn.addEventListener('click', () => this.handleAnswer('NE'));
    if (startBtn) startBtn.addEventListener('click', () => this.startGame());
  }

  // Pokretanje igre
  startGame() {
    this.gameState.isGameActive = true;
    this.gameState.questionStartTime = performance.now();
    
    // Sakrij start screen
    const startScreen = document.getElementById('start-screen');
    if (startScreen) startScreen.style.display = 'none';
    
    // Prikaži prvi upit
    this.showNextQuestion();
  }

  // Prikaz sljedećeg pitanja
  showNextQuestion() {
    if (this.gameState.currentQuestion > this.gameState.totalQuestions) {
      this.endGame();
      return;
    }

    // Odaberi sljedeće pitanje (možete integrirati s vašom postojećom logikom)
    const pitanje = this.getNextQuestion();
    this.currentQuestionObj = pitanje;
    
    // Ažuriraj UI
    this.updateQuestionUI(pitanje);
    this.gameState.questionStartTime = performance.now();
  }

  // Dohvaćanje sljedećeg pitanja (integrirajte s vašom logikom)
  getNextQuestion() {
    // OVDJE INTEGRIRAJTE VAŠU POSTOJEĆU LOGIKU ZA PITANJA
    const demoPitanja = [
      {
        id: 1,
        text: "Jeste li ikada poželili smrt članu svoje obitelji?",
        category: "family",
        intensity: 3
      },
      {
        id: 2,
        text: "Jeste li ikada varali u vezi?",
        category: "relationships",
        intensity: 4
      },
      {
        id: 3,
        text: "Jeste li ikada ukrali nešto vrijedno više od 100 kuna?",
        category: "morality",
        intensity: 2
      }
      // Dodajte više pitanja...
    ];
    
    return demoPitanja[(this.gameState.currentQuestion - 1) % demoPitanja.length];
  }

  // Ažuriranje UI-ja s pitanjem
  updateQuestionUI(pitanje) {
    const questionElement = document.getElementById('current-question');
    const questionNumber = document.getElementById('question-number');
    
    if (questionElement) {
      questionElement.textContent = pitanje.text;
    }
    
    if (questionNumber) {
      questionNumber.textContent = `Pitanje ${this.gameState.currentQuestion}/${this.gameState.totalQuestions}`;
    }
    
    // Omogući gumbove
    this.enableAnswerButtons();
  }

  // Rukovanje odgovorom
  async handleAnswer(answer) {
    if (!this.gameState.isGameActive || !this.currentQuestionObj) return;

    const responseTime = performance.now() - this.gameState.questionStartTime;
    this.disableAnswerButtons();

    // Spremi odgovor
    const answerData = {
      questionId: this.currentQuestionObj.id,
      question: this.currentQuestionObj.text,
      answer: answer,
      responseTime: responseTime,
      timestamp: new Date().toISOString()
    };
    
    this.gameState.playerAnswers.push(answerData);

    // Prikaži loading indikator
    this.showLoadingIndicator(true);

    try {
      // Pozovi AI za komentar
      const aiComment = await this.getAIComment(
        this.currentQuestionObj.text,
        answer,
        this.createGameContext(responseTime)
      );

      // Sakrij loading indikator
      this.showLoadingIndicator(false);

      // Prikaži AI komentar
      this.showAIComment(aiComment);

      // Spremi AI komentar
      this.gameState.aiComments.push({
        questionId: this.currentQuestionObj.id,
        comment: aiComment,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Greška pri dohvaćanju AI komentara:', error);
      this.showLoadingIndicator(false);
      this.showAIComment("Trenutno imamo tehničkih poteškoća s analizom...");
    }

    // Pauza za dramatičnost, zatim sljedeće pitanje
    setTimeout(() => {
      this.gameState.currentQuestion++;
      this.showNextQuestion();
    }, 3000);
  }

  // AI komentar poziv
  async getAIComment(pitanje, odgovor, kontekst) {
    try {
      const response = await fetch(this.aiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pitanje: pitanje,
          odgovor: odgovor,
          kontekst: kontekst
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        console.log('✅ AI komentar uspješno dohvaćen:', data.model);
        return data.komentar;
      } else {
        console.warn('⚠️ Korišten fallback komentar');
        return data.komentar;
      }

    } catch (error) {
      console.error('❌ Greška pri AI pozivu:', error);
      // Fallback komentari
      const fallbacks = [
        "Zanimljiv odgovor... otkriva puno o vašoj osobnosti.",
        "Hmm... vaša iskrenost je... enlightening.",
        "Fascinantno kako pristupate ovoj temi..."
      ];
      return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
  }

  // Kreiranje konteksta za AI
  createGameContext(responseTime) {
    return {
      currentQuestion: this.gameState.currentQuestion,
      totalQuestions: this.gameState.totalQuestions,
      responseTimeMs: responseTime,
      previousAnswers: this.gameState.playerAnswers.slice(-3), // Zadnja 3 odgovora
      gameProgress: (this.gameState.currentQuestion / this.gameState.totalQuestions) * 100
    };
  }

  // UI helper funkcije
  showLoadingIndicator(show) {
    let indicator = document.getElementById('ai-loading');
    
    if (!indicator && show) {
      indicator = document.createElement('div');
      indicator.id = 'ai-loading';
      indicator.className = 'ai-loading-indicator';
      indicator.innerHTML = '🧠 DR. VERITAS analizira vaš odgovor...';
      document.body.appendChild(indicator);
    }
    
    if (indicator) {
      indicator.style.display = show ? 'block' : 'none';
    }
  }

  showAIComment(comment) {
    const commentElement = document.getElementById('ai-comment');
    if (commentElement) {
      commentElement.textContent = comment;
      commentElement.style.display = 'block';
      
      // Animacija
      commentElement.classList.add('fade-in');
      setTimeout(() => {
        commentElement.classList.remove('fade-in');
      }, 500);
    }
  }

  enableAnswerButtons() {
    const daBtn = document.getElementById('da-btn');
    const neBtn = document.getElementById('ne-btn');
    
    if (daBtn) daBtn.disabled = false;
    if (neBtn) neBtn.disabled = false;
  }

  disableAnswerButtons() {
    const daBtn = document.getElementById('da-btn');
    const neBtn = document.getElementById('ne-btn');
    
    if (daBtn) daBtn.disabled = true;
    if (neBtn) neBtn.disabled = true;
  }

  // Završetak igre
  endGame() {
    this.gameState.isGameActive = false;
    console.log('🎯 Igra završena!');
    console.log('📊 Odgovori:', this.gameState.playerAnswers);
    console.log('🤖 AI komentari:', this.gameState.aiComments);
    
    // Prikaži završni ekran
    this.showEndScreen();
  }

  showEndScreen() {
    // Implementirajte prikaz završnog ekrana
    alert(`Igra završena! Odgovorili ste na ${this.gameState.playerAnswers.length} pitanja.`);
  }
}

// Inicijalizacija kada se stranica učita
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Pokretanje Trenutak Istine aplikacije...');
  window.trenutakIstineGame = new TrenutakIstineGame();
});

// Test funkcija za provjeru AI veze
async function testAIConnection() {
  const game = window.trenutakIstineGame;
  if (game) {
    try {
      const testComment = await game.getAIComment(
        "Test pitanje",
        "Test odgovor",
        { test: true }
      );
      console.log('🧪 AI test uspješan:', testComment);
      alert('AI veza radi! Komentar: ' + testComment);
    } catch (error) {
      console.error('🧪 AI test neuspješan:', error);
      alert('AI veza ne radi: ' + error.message);
    }
  }
}
