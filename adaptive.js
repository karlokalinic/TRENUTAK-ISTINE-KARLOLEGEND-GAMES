
// Adaptivni algoritam za "Trenutak istine"

class AdaptiveQuestionEngine {

  constructor() {

    this.discomfortScores = {

      moral: 0,

      family: 0,

      relationships: 0,

      sexuality: 0,

      violence: 0,

      work: 0,

      friendship: 0,

      cruelty: 0,

      education: 0,

      drugs: 0,

      crime: 0,

      dark_thoughts: 0,

      mental_health: 0,

      confession: 0

    };

    this.responseHistory = [];

    this.currentLevel = 1;

    this.usedQuestions = new Set();

    this.totalQuestions = 0;

    this.dramaticMoments = [];

  }

  

  // Analiza odgovora i ažuriranje score-a

  analyzeResponse(questionId, answer, responseTime, question) {

    const response = {

      questionId,

      answer,

      responseTime,

      category: question.category,

      intensity: question.intensity,

      timestamp: Date.now()

    };

    this.responseHistory.push(response);

    this.totalQuestions++;

  

    // Ažuriranje nelagodnosnog score-a

    this.updateDiscomfortScore(question, answer, responseTime);

    // Identifikacija dramatičnih momenata

    this.identifyDramaticMoments(response);

    return this.generateHostResponse(response);

  }

  

  updateDiscomfortScore(question, answer, responseTime) {

    const category = question.category;

    let scoreIncrease = 0;

  

    // Bodovanje na temelju odgovora

    if (answer === 'yes') {

      scoreIncrease += question.intensity * 2; // DA odgovori nose više bodova

    } else {

      scoreIncrease += 1; // NE odgovor i dalje dodaje bodove (sumnja)

    }

  

    // Bodovanje na temelju vremena odgovora

    if (responseTime > 3000) { // Sporiji od 3 sekunde

      scoreIncrease += 3; // Oklijevanje = nelagoda

    } else if (responseTime < 1000) { // Brži od 1 sekunde

      scoreIncrease += 2; // Pre-brzo = moguća laž ili vježban odgovor

    }

  

    // Posebno bodovanje za visoko-intenzivne kategorije

    if (question.intensity >= 5) {

      scoreIncrease *= 1.5;

    }

  

    this.discomfortScores[category] += scoreIncrease;

  }

  

  identifyDramaticMoments(response) {

    // Identifikacija dramatičnih situacija

    if (response.answer === 'yes' && response.intensity >= 4) {

      this.dramaticMoments.push({

        type: 'shocking_admission',

        category: response.category,

        intensity: response.intensity

      });

    }

  

    if (response.responseTime > 5000) {

      this.dramaticMoments.push({

        type: 'long_pause',

        responseTime: response.responseTime

      });

    }

  

    if (response.responseTime < 500 && response.intensity >= 3) {

      this.dramaticMoments.push({

        type: 'suspiciously_fast',

        responseTime: response.responseTime,

        intensity: response.intensity

      });

    }

  }

  

  generateHostResponse(response) {

    let selectedComment = "";

    const { answer, responseTime, category, intensity } = response;

  

    // Prioritete komentiranje na temelju dramatičnih momenata

    if (this.dramaticMoments.length > 0) {

      const lastDrama = this.dramaticMoments[this.dramaticMoments.length - 1];

      switch (lastDrama.type) {

        case 'shocking_admission':

          selectedComment = this.getRandomComment(HOST_COMMENTS.yes_responses[category]);

          break;

        case 'long_pause':

          selectedComment = this.getRandomComment(HOST_COMMENTS.slow_response);

          break;

        case 'suspiciously_fast':

          selectedComment = this.getRandomComment(HOST_COMMENTS.fast_response);

          break;

      }

    }

  

    // Fallback na standardne komentare

    if (!selectedComment) {

      if (answer === 'yes') {

        selectedComment = HOST_COMMENTS.yes_responses[category]

          ? this.getRandomComment(HOST_COMMENTS.yes_responses[category])

          : this.getRandomComment(HOST_COMMENTS.yes_responses.moral);

      } else {

        selectedComment = this.getRandomComment(HOST_COMMENTS.no_responses);

      }

    }

  

    return selectedComment;

  }

  

  // Odabir sljedećeg pitanja na temelju algoritma

  selectNextQuestion(currentLevel) {

    const availableQuestions = GAME_QUESTIONS[`level${currentLevel}`]

      .filter(q => !this.usedQuestions.has(q.id));

  

    if (availableQuestions.length === 0) {

      return null; // Nema više pitanja za ovu razinu

    }

  

    // Sortiranje kategorija po nelagodnosti (najveća nelagoda = prioritet)

    const sortedCategories = Object.entries(this.discomfortScores)

      .sort(([,a], [,b]) => b - a)

      .map(([category]) => category);

  

    // Pokušaj pronaći pitanje iz najneugodnije kategorije

    for (const category of sortedCategories) {

      const categoryQuestion = availableQuestions.find(q => q.category === category);

      if (categoryQuestion) {

        this.usedQuestions.add(categoryQuestion.id);

        return categoryQuestion;

      }

    }

  

    // Fallback: slučajan odabir iz dostupnih

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    this.usedQuestions.add(randomQuestion.id);

    return randomQuestion;

  }

  

  // Provjera treba li intenzivirati igru

  shouldIntensify() {

    const maxScore = Math.max(...Object.values(this.discomfortScores));

    const avgScore = Object.values(this.discomfortScores).reduce((a, b) => a + b, 0) /

            Object.keys(this.discomfortScores).length;

    return maxScore > avgScore * 2; // Ako je max score duplo veći od prosjeka

  }

  

  // Preporučuje da korisnik odustane (psihološka taktika)

  shouldSuggestQuitting() {

    const totalDiscomfort = Object.values(this.discomfortScores).reduce((a, b) => a + b, 0);

    const yesAnswers = this.responseHistory.filter(r => r.answer === 'yes').length;

    return totalDiscomfort > 50 || yesAnswers > this.totalQuestions * 0.6;

  }

  

  // Generiranje personaliziranog završnog komentara

  generateFinalComment(won, finalAmount) {

    const totalYes = this.responseHistory.filter(r => r.answer === 'yes').length;

    const dominantCategory = Object.entries(this.discomfortScores)

      .sort(([,a], [,b]) => b - a)[0][0];

    let comment = "";

    if (won) {

      comment = `Osvojio si ${finalAmount} kuna, ali po kakvoj cijeni? ${totalYes} puta si rekao DA na pitanja koja bi većina ljudi htjela zaboraviti. `;

      comment += `Posebno te muči kategorija "${this.getCategoryName(dominantCategory)}" - vidim to po tvojim reakcijama.`;

    } else {

      comment = `Odustao si s ${finalAmount} kuna. Možda ti je savjest bila jača od pohlepe. `;

      comment += `Ili si se jednostavno uplašio što će sljedeća pitanja otkriti o "${this.getCategoryName(dominantCategory)}".`;

    }

    return comment;

  }

  

  getCategoryName(category) {

    const categoryNames = {

      moral: "moralnim prekršajima",

      family: "obiteljskim problemima",

      relationships: "ljubavnim odnosima",

      sexuality: "seksualnim fantazijama",

      violence: "nasilnim impulzivima",

      dark_thoughts: "mračnim mislima"

    };

    return categoryNames[category] || category;

  }

  

  getRandomComment(commentsArray) {

    if (!commentsArray || commentsArray.length === 0) {

      return "Zanimljivo...";

    }

    return commentsArray[Math.floor(Math.random() * commentsArray.length)];

  }

  

  // Reset za novu igru

  reset() {

    this.discomfortScores = Object.fromEntries(

      Object.keys(this.discomfortScores).map(key => [key, 0])

    );

    this.responseHistory = [];

    this.currentLevel = 1;

    this.usedQuestions.clear();

    this.totalQuestions = 0;

    this.dramaticMoments = [];

  }

  

  // Debug informacije

  getDebugInfo() {

    return {

      discomfortScores: this.discomfortScores,

      responseHistory: this.responseHistory,

      dramaticMoments: this.dramaticMoments,

      totalQuestions: this.totalQuestions

    };

  }

}
