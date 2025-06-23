// ISPRAVLJENA NETLIFY FUNKCIJA ZA TRENUTAK ISTINE AI
exports.handler = async (event, context) => {
  // Debug logging za environment varijable
  console.log('🔧 ENVIRONMENT CHECK:');
  console.log('API key exists:', process.env.api ? 'YES' : 'NO');
  console.log('API key length:', process.env.api?.length || 0);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Samo POST metoda dozvoljena' })
    };
  }

  try {
    const apiKey = process.env.api;
    if (!apiKey) {
      throw new Error('API ključ "api" nije postavljen u Netlify environment');
    }

    const requestData = JSON.parse(event.body);
    const { systemPrompt, userPrompt, model, temperature, max_tokens } = requestData;

    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://trenutak-istine.netlify.app',
        'X-Title': 'Trenutak Istine AI'
      },
      body: JSON.stringify({
        model: model || 'deepseek/deepseek-r1',
        messages: [
          {
            role: 'system',
            content: systemPrompt || 'Ti si AI asistent.'
          },
          {
            role: 'user', 
            content: userPrompt || ''
          }
        ],
        max_tokens: max_tokens || 2000,
        temperature: temperature || 0.7
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      throw new Error(`OpenRouter API greška: ${openRouterResponse.status}`);
    }

    const aiData = await openRouterResponse.json();
    const aiContent = aiData.choices?.[0]?.message?.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        comment: aiContent,
        response: aiContent,
        content: aiContent,
        success: true,
        model: model,
        timestamp: new Date().toISOString()
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error.message,
        success: false,
        timestamp: new Date().toISOString()
      })
    };
  }
};