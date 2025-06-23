// Test file za provjeru AI funkcionalnosti
const fetch = require('node-fetch');

async function testAI() {
  console.log('🧪 Testiranje AI veze...');
  
  try {
    const response = await fetch('http://localhost:8888/.netlify/functions/get-ai-comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pitanje: "Jeste li ikada poželili smrt članu obitelji?",
        odgovor: "DA",
        kontekst: {
          currentQuestion: 1,
          totalQuestions: 21,
          responseTimeMs: 2350,
          test: true
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI test uspješan!');
      console.log('📝 Komentar:', data.komentar);
      console.log('🤖 Model:', data.model);
    } else {
      console.error('❌ AI test neuspješan:', response.status);
      const errorText = await response.text();
      console.error('Error:', errorText);
    }
  } catch (error) {
    console.error('❌ Network greška:', error.message);
  }
}

// Pokreni test
testAI();