
// Glavna logika "Trenutak Istine" igre

class TrenutakIstineGame {

  constructor() {

    this.gameState = {

      currentLevel: 1,

      currentQuestion: 0,

      totalQuestions: 21,

      money: 0,

      isGameActive: false,

      questionStartTime: 0

    };

    this.adaptiveEngine = new AdaptiveQuestionEngine();

    this.currentQuestionObj = null;

    this.initializeEventListeners();

  }

  

  initializeEventListeners() {

    // Start game gumb

    document.getElementById('start-btn').addEventListener('click', () => {

      this.startGame();

    });

  

    // Answer gumbovi

    document.getElementById('yes-btn').addEventListener('click', (e) => {

      this.handleAnswer('yes');

    });

  

    document.getElementById('no-btn').addEventListener('click', (e) => {

      this.handleAnswer('no');

    });

  

    // Quit gumb

    document.getElementById('quit-btn').addEventListener('click', () => {

      this.quitGame();

    });

  

    // Restart gumb

    document.getElementById('restart-btn').addEventListener('click', () => {

      this.restartGame();

    });

  

    // Keyboard shortcuts

    document.addEventListener('keydown', (e) => {

      if (!this.gameState.isGameActive) return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {

        this.handleAnswer('no');

      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {

        this.handleAnswer('yes');

      } else if (e.key === 'Escape') {

        this.quitGame();

      }

    });

  }

  

  startGame() {

    // Reset game state

    this.gameState = {

      currentLevel: 1,

      currentQuestion: 0,

      totalQuestions: 21,

      money: 0,

      isGameActive: true,

      questionStartTime: 0

    };

    this.adaptiveEngine.reset();

    // Switch screens

    this.switchScreen('intro-screen', 'game-screen');

    // Show intro host comment

    this.showHostComment(this.adaptiveEngine.getRandomComment(HOST_COMMENTS.intro));

    // Start first question after delay

    setTimeout(() => {

      this.nextQuestion();

    }, 3000);

  }

  

  nextQuestion() {

    if (this.gameState.currentQuestion >= this.gameState.totalQuestions) {

      this.winGame();

      return;

    }

  

    // Check if we need to move to next level

    const questionsPerLevel = this.getQuestionsPerLevel();

    let questionsInCurrentLevel = 0;

    for (let i = 1; i <= this.gameState.currentLevel; i++) {

      questionsInCurrentLevel += questionsPerLevel[`level${i}`];

    }

    if (this.gameState.currentQuestion >= questionsInCurrentLevel) {

      this.gameState.currentLevel++;

      this.showLevelTransition();

      return;

    }

  

    // Get next question using adaptive algorithm

    this.currentQuestionObj = this.adaptiveEngine.selectNextQuestion(this.gameState.currentLevel);

    if (!this.currentQuestionObj) {

      // Fallback ako nema pitanja

      this.nextLevel();

      return;

    }

  

    this.gameState.currentQuestion++;

    this.displayQuestion(this.currentQuestionObj);

    this.updateUI();

    // Start timing

    this.gameState.questionStartTime = performance.now();

  }

  

  displayQuestion(questionObj) {

    const questionElement = document.getElementById('question-text');

    const contextElement = document.getElementById('question-context');

    // Animacija za novo pitanje

    questionElement.style.opacity = '0';

    contextElement.style.opacity = '0';

    setTimeout(() => {

      questionElement.textContent = questionObj.text;

      contextElement.textContent = QUESTION_CONTEXTS[questionObj.id] || '';

      questionElement.style.opacity = '1';

      contextElement.style.opacity = '1';

      // Add dramatic effect for high-intensity questions

      if (questionObj.intensity >= 5) {

        questionElement.classList.add('dramatic-pulse');

        setTimeout(() => {

          questionElement.classList.remove('dramatic-pulse');

        }, 2000);

      }

    }, 300);

    // Enable answer buttons

    this.enableAnswerButtons();

  }

  

  handleAnswer(answer) {

    if (!this.gameState.isGameActive || !this.currentQuestionObj) return;

    // Calculate response time

    const responseTime = performance.now() - this.gameState.questionStartTime;

    // Disable buttons to prevent double-clicking

    this.disableAnswerButtons();

    // Analyze response using adaptive engine

    const hostResponse = this.adaptiveEngine.analyzeResponse(

      this.currentQuestionObj.id,

      answer,

      responseTime,

      this.currentQuestionObj

    );

    // Update response time display

    document.getElementById('response-time').textContent = `${(responseTime / 1000).toFixed(1)}s`;

    // Show host comment

    this.showHostComment(hostResponse);

    // Add dramatic pause before next question

    const pauseDuration = this.calculateDramaticPause(responseTime, this.currentQuestionObj.intensity);

    setTimeout(() => {

      this.nextQuestion();

    }, pauseDuration);

  }

  

  calculateDramaticPause(responseTime, intensity) {

    let basePause = 2000; // 2 sekunde osnovne pauze

    // Duža pauza za sporije odgovore

    if (responseTime > 3000) {

      basePause += 1000;

    }

    // Duža pauza za intenzivnija pitanja

    if (intensity >= 5) {

      basePause += 1500;

    }

    // Predloži odustajanje ako algoritam preporučuje

    if (this.adaptiveEngine.shouldSuggestQuitting()) {

      basePause += 2000;

      setTimeout(() => {

        this.showHostComment("Možda je vrijeme da prestaneš dok možeš...");

      }, basePause - 1000);

    }

    return basePause;

  }

  

  showHostComment(comment) {

    const hostElement = document.getElementById('host-text');

    // Typing effect

    hostElement.textContent = '';

    hostElement.classList.add('typing');

    let i = 0;

    const typingInterval = setInterval(() => {

      if (i < comment.length) {

        hostElement.textContent += comment.charAt(i);

        i++;

      } else {

        clearInterval(typingInterval);

        hostElement.classList.remove('typing');

      }

    }, 50);

  }

  

  showLevelTransition() {

    const transitionComment = HOST_COMMENTS.level_transitions[`level${this.gameState.currentLevel}`];

    this.showHostComment(transitionComment);

    // Update money

    this.gameState.money = MONEY_LEVELS[`level${this.gameState.currentLevel - 1}`] || 0;

    this.updateUI();

    setTimeout(() => {

      this.nextQuestion();

    }, 4000);

  }

  

  updateUI() {

    // Update level and money

    document.getElementById('current-level').textContent = `Razina ${this.gameState.currentLevel}`;

    document.getElementById('current-money').textContent = `${this.gameState.money.toLocaleString()} kn`;

    // Update question counter

    document.getElementById('question-number').textContent =

      `${this.gameState.currentQuestion}/${this.gameState.totalQuestions}`;

    // Update progress bar

    const progress = (this.gameState.currentQuestion / this.gameState.totalQuestions) * 100;

    document.getElementById('progress-fill').style.width = `${progress}%`;

    // Show/hide quit button based on money

    const quitBtn = document.getElementById('quit-btn');

    if (this.gameState.money > 0) {

      quitBtn.style.display = 'block';

      quitBtn.textContent = `ODUSTANI I UZMI ${this.gameState.money.toLocaleString()} KN`;

    } else {

      quitBtn.style.display = 'none';

    }

  }

  

  enableAnswerButtons() {

    document.getElementById('yes-btn').disabled = false;

    document.getElementById('no-btn').disabled = false;

    document.getElementById('yes-btn').style.opacity = '1';

    document.getElementById('no-btn').style.opacity = '1';

  }

  

  disableAnswerButtons() {

    document.getElementById('yes-btn').disabled = true;

    document.getElementById('no-btn').disabled = true;

    document.getElementById('yes-btn').style.opacity = '0.5';

    document.getElementById('no-btn').style.opacity = '0.5';

  }

  

  quitGame() {

    this.gameState.isGameActive = false;

    this.endGame(false, this.gameState.money);

  }

  

  winGame() {

    this.gameState.isGameActive = false;

    this.gameState.money = MONEY_LEVELS.level6;

    this.endGame(true, this.gameState.money);

  }

  

  endGame(won, finalAmount) {

    // Generate personalized final comment

    const finalComment = this.adaptiveEngine.generateFinalComment(won, finalAmount);

    // Switch to end screen

    this.switchScreen('game-screen', 'end-screen');

    // Update end screen content

    document.getElementById('end-title').textContent = won ? 'POBJEDNIK!' : 'IGRA ZAVRŠENA';

    document.getElementById('final-amount').textContent = `${finalAmount.toLocaleString()} kn`;

    document.getElementById('final-comment').textContent = finalComment;

    // Show game summary

    this.showGameSummary();

  }

  

  showGameSummary() {

    const debugInfo = this.adaptiveEngine.getDebugInfo();

    const yesAnswers = debugInfo.responseHistory.filter(r => r.answer === 'yes').length;

    const noAnswers = debugInfo.responseHistory.filter(r => r.answer === 'no').length;

    const avgResponseTime = debugInfo.responseHistory.reduce((sum, r) => sum + r.responseTime, 0) /

               debugInfo.responseHistory.length / 1000;

    const summaryHTML = `

      <h3>Statistike igre:</h3>

      <p><strong>DA odgovora:</strong> ${yesAnswers}</p>

      <p><strong>NE odgovora:</strong> ${noAnswers}</p>

      <p><strong>Prosječno vrijeme odgovora:</strong> ${avgResponseTime.toFixed(1)}s</p>

      <p><strong>Najproblematičnija kategorija:</strong> ${this.adaptiveEngine.getCategoryName(

        Object.entries(debugInfo.discomfortScores)

          .sort(([,a], [,b]) => b - a)[0][0]

      )}</p>

    `;

    document.getElementById('game-summary').innerHTML = summaryHTML;

  }

  

  restartGame() {

    this.switchScreen('end-screen', 'intro-screen');

  }

  

  switchScreen(fromScreen, toScreen) {

    document.getElementById(fromScreen).classList.remove('active');

    document.getElementById(toScreen).classList.add('active');

  }

  

  getQuestionsPerLevel() {

    return {

      level1: 6,

      level2: 5,

      level3: 4,

      level4: 3,

      level5: 2,

      level6: 1

    };

  }

}

  

// Initialize game when DOM is loaded

document.addEventListener('DOMContentLoaded', () => {

  const game = new TrenutakIstineGame();

  // Add some Easter eggs and debug features

  window.gameDebug = game; // For debugging in console

  console.log('%c🎭 Trenutak Istine - Debug Mode Enabled', 'color: #cc0000; font-size: 16px; font-weight: bold;');

  console.log('Type "gameDebug.adaptiveEngine.getDebugInfo()" to see current game statistics');

});
