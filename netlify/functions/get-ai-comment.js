// SIMPLIFIED NETLIFY FUNKCIJA - SAMO ZA ANALIZE, NE ZA PITANJA
exports.handler = async (event, context) => {
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
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY nije postavljen');
        }

        const requestData = JSON.parse(event.body);
        const { systemPrompt, userPrompt, model, temperature, max_tokens } = requestData;

        // Samo jedan pokušaj sa kratkim timeout-om za analize
        const response = await Promise.race([
            fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://trenutak-istine.netlify.app',
                    'X-Title': 'Trenutak Istine AI'
                },
                body: JSON.stringify({
                    model: model || 'deepseek/deepseek-r1:free',
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
                    max_tokens: Math.min(max_tokens || 800, 1000),
                    temperature: temperature || 0.7,
                    stream: false
                })
            }),
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout nakon 5 sekundi')), 5000)
            )
        ]);

        if (!response.ok) {
            throw new Error(`API greška: ${response.status}`);
        }

        const aiData = await response.json();
        const aiContent = aiData.choices?.[0]?.message?.content;

        if (!aiContent) {
            throw new Error('Nema AI sadržaja');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                comment: aiContent,
                response: aiContent,
                content: aiContent,
                success: true,
                model: model || 'deepseek/deepseek-r1:free',
                timestamp: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('AI GREŠKA:', error.message);
        
        // Za analize, vraćaj grešku da se koristi fallback
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};
