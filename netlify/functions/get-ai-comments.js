// Glavna Netlify Function za AI komentare
exports.handler = async (event, context) => {
  // CORS headers - omogućava pozive iz preglednika
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS zahtjev
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: headers,
      body: ''
    };
  }

  // Dozvoljen samo POST zahtjev
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: headers,
      body: JSON.stringify({ error: 'Dozvoljene su samo POST zahtjevi' })
    };
  }

  try {
    // Dohvaćanje API ključa iz Netlify environment varijabli
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('API ključ nije postavljen u Netlify environment');
    }

    // Parsiranje podataka iz zahtjeva
    const { pitanje, odgovor, kontekst } = JSON.parse(event.body);

    // Kreiranje prompta za DeepSeek R1
    const prompt = `
Ti si DR. VERITAS, vrhunski forenzički psiholog i voditelj dramatičnog TV showa "Trenutak Istine" inspiriranog američkim showom iz 2008. godine.

KONTEKST IGRE:
${JSON.stringify(kontekst, null, 2)}

POSTAVLJENO PITANJE: "${pitanje}"
ODGOVOR ISPITANIKA: "${odgovor}"

Generiraj dramatičan, psihološki proničljiv komentar (maksimalno 200 znakova) koji:
1. Analizira psihološke aspekte odgovora
2. Otkriva skrivene motivacije i strahove
3. Koristi dramatični, TV show stil
4. Bude direktan i bez cenzure
5. Stvori napetost za sljedeće pitanje

Odgovori ISKLJUČIVO na hrvatskom jeziku.

Primjer stila: "Vaše 'DA' otkriva duboku prazninu u duši. Fascinantno kako materijal ne može zamijeniti ljubav..." ili "2.3 sekunde oklijevanja prije 'NE' - laž ima svoju težinu, zar ne?"

GENERIRAJ KOMENTAR:`;

    // API poziv na OpenRouter (DeepSeek R1)
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://trenutak-istine.netlify.app',
        'X-Title': 'Trenutak Istine - TV Show'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          {
            role: 'system',
            content: 'Ti si DR. VERITAS, forenzički psiholog i TV voditelj.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 250,
        temperature: 0.8,
        top_p: 0.9
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API greška:', response.status, errorText);
      throw new Error(`API greška: ${response.status}`);
    }

    const data = await response.json();
    const aiKomentar = data.choices[0].message.content.trim();

    // Uspješan odgovor
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        success: true,
        komentar: aiKomentar,
        model: 'deepseek-r1-0528-qwen3-8b',
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    console.error('Greška u AI funkciji:', error);
    
    // Fallback komentari ako AI ne radi
    const fallbackKomentari = [
      "Vaš odgovor otkriva zanimljive dubine osobnosti...",
      "Fascinantno. Vaša reakcija govori više nego riječi...",
      "Hmm... ova iskrenost skriva dublju istinu...",
      "Vrijeme odgovora otkriva vaš unutrašnji konflikt...",
      "Zanimljivo kako pristupate ovoj temi..."
    ];
    
    const randomKomentar = fallbackKomentari[Math.floor(Math.random() * fallbackKomentari.length)];
    
    return {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify({
        success: false,
        komentar: randomKomentar,
        model: 'fallback',
        error: 'AI trenutno nije dostupan'
      })
    };
  }
};