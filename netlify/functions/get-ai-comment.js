// OPTIMIZOVANA NETLIFY FUNKCIJA SA RETRY MEHANIZMOM I TIMEOUT HANDLING
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

    // Eksponencijalni backoff retry funkcija
    async function retryWithBackoff(fn, maxRetries = 3, initialDelay = 1000, maxDelay = 8000) {
        let lastError;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                console.log(`🔄 RETRY ATTEMPT: ${attempt + 1}/${maxRetries}`);
                return await fn();
            } catch (error) {
                lastError = error;
                console.log(`❌ ATTEMPT ${attempt + 1} FAILED:`, error.message);
                
                if (attempt === maxRetries - 1) break;
                
                // Eksponencijalni backoff sa jitter
                const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
                const jitter = Math.random() * 0.3 * delay; // 30% jitter
                const finalDelay = delay + jitter;
                
                console.log(`⏳ WAITING: ${Math.round(finalDelay)}ms prije sljedećeg pokušaja`);
                await new Promise(resolve => setTimeout(resolve, finalDelay));
            }
        }
        
        throw lastError;
    }

    // Timeout wrapper funkcija
    function withTimeout(promise, timeoutMs = 8000) {
        return Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error(`Timeout nakon ${timeoutMs}ms`)), timeoutMs)
            )
        ]);
    }

    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            throw new Error('OPENROUTER_API_KEY nije postavljen u environment');
        }

        const requestData = JSON.parse(event.body);
        const { systemPrompt, userPrompt, model, temperature, max_tokens } = requestData;

        // Lista alternativnih modela po brzini/kvalitetu
        const modelFallback = [
            model || 'deepseek/deepseek-r1:free',
            'meta-llama/llama-3.2-3b-instruct:free',
            'google/gemini-flash-1.5:free',
            'microsoft/phi-3-mini-128k-instruct:free'
        ];

        let successfulResponse = null;
        let modelUsed = null;

        // Pokušaj sa svakim modelom
        for (const tryModel of modelFallback) {
            try {
                console.log(`🤖 POKUŠAVAM MODEL: ${tryModel}`);
                
                const response = await retryWithBackoff(async () => {
                    return await withTimeout(
                        fetch('https://openrouter.ai/api/v1/chat/completions', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${apiKey}`,
                                'Content-Type': 'application/json',
                                'HTTP-Referer': 'https://trenutak-istine.netlify.app',
                                'X-Title': 'Trenutak Istine AI'
                            },
                            body: JSON.stringify({
                                model: tryModel,
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
                                max_tokens: Math.min(max_tokens || 1500, tryModel.includes('deepseek') ? 2000 : 1500),
                                temperature: temperature || 0.7,
                                stream: false
                            })
                        }),
                        7500 // 7.5 sekundi timeout
                    );
                }, 2, 500, 3000); // 2 retry, 500ms početni delay, 3s max delay

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`API greška: ${response.status} - ${errorText}`);
                }

                const aiData = await response.json();
                const aiContent = aiData.choices?.[0]?.message?.content;

                if (aiContent) {
                    successfulResponse = aiContent;
                    modelUsed = tryModel;
                    console.log(`✅ USPJEH SA MODELOM: ${tryModel}`);
                    break;
                }

            } catch (error) {
                console.log(`❌ MODEL ${tryModel} FAILED:`, error.message);
                continue;
            }
        }

        if (!successfulResponse) {
            throw new Error('Svi modeli su neuspješni');
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                comment: successfulResponse,
                response: successfulResponse,
                content: successfulResponse,
                success: true,
                model: modelUsed,
                timestamp: new Date().toISOString(),
                fallback_used: modelUsed !== (model || 'deepseek/deepseek-r1:free')
            })
        };

    } catch (error) {
        console.error('🚨 KRITIČNA GREŠKA:', error);
        
        return {
            statusCode: 200, // Uvijek vraćaj 200 da ne prekidaš aplikaciju
            headers,
            body: JSON.stringify({
                comment: generateFallbackResponse(event.body),
                response: generateFallbackResponse(event.body),
                content: generateFallbackResponse(event.body),
                success: false,
                error: error.message,
                fallback_response: true,
                timestamp: new Date().toISOString()
            })
        };
    }
};

// Fallback odgovor kada AI ne radi
function generateFallbackResponse(eventBody) {
    try {
        const requestData = JSON.parse(eventBody);
        const systemPrompt = requestData.systemPrompt || '';
        
        if (systemPrompt.includes('finalna analiza') || systemPrompt.includes('kompletnu analizu')) {
            return JSON.stringify({
                title: "Kompleksna ličnost sa skrivenim dubinama",
                corePersonality: "Ispitanik pokazuje složene psihološke obrasce koji zahtijevaju dublju analizu.",
                dominantTraits: ["introspektivnost", "složenost", "autentičnost"],
                hiddenAspects: "Postoje duboki slojevi ličnosti koji nisu u potpunosti integrirani.",
                psychologicalPatterns: "Pokazuje obrasce koji ukazuju na visoku samosvijest i kapacitet za rast.",
                defenseMechanisms: "Koristi sofisticirane obrambene mehanizme prilagođene situaciji.",
                darkSide: "Kao i svi ljudi, ima aspekte koje još nije u potpunosti istražio.",
                fears: "Glavni strahovi vezani su uz autentičnost i prihvaćanje.",
                desires: "Teži dubokoj povezanosti i razumijevanju sebe i drugih.",
                prediction: "Visok potencijal za osobni rast i samoaktualizaciju.",
                recommendations: "Nastaviti s introspekcijom i možda razmotriti dubinski rad na sebi.",
                finalVerdict: "Ispitanik pokazuje zrelu ličnost s velikim potencijalom za rast. Kombinacija samosvijesti i otvorenosti prema promjeni čini odličnu osnovu za daljnji razvoj. Psihološka analiza otkriva osobu koja nije afraid suočiti se s vlastitim kompleksnostima, što je rijedak i vrijedan kvalitet."
            });
        } else if (systemPrompt.includes('psihološku analizu') || systemPrompt.includes('odgovor ispitanika')) {
            return JSON.stringify({
                immediateInsight: "Ovaj odgovor otkriva dublje psihološke obrasce koji zaslužuju analizu.",
                deepAnalysis: "Ispitanik pokazuje kapacitet za iskrenost i samoanalizu. Odgovor ukazuje na psihološku zrelost i spremnost za suočavanje s vlastitim aspektima ličnosti. Ovaj pristup govori o osobi koja ima razvijen osjećaj samosvijesti.",
                personalityTraits: ["samosvijest", "iskrenost", "zrelost"],
                psychologicalMechanisms: ["introspektivnost", "samoanaliza", "otvorenost"],
                expandedProfile: "Ispitanik pokazuje znakove zdrave psihološke funkcije s kapacitetom za rast i razvoj.",
                contradictions: "",
                futureProbing: "Istražiti dublje motivacije u drugim područjima života."
            });
        } else {
            return JSON.stringify({
                category: "identity",
                question: "Smatrate li se osobom koja je u potpunosti iskrena prema sebi o svojim motivacijama?",
                reasoning: "Fallback pitanje fokusirano na samosvijest i iskrenost."
            });
        }
    } catch (e) {
        return "Došlo je do privremene greške s AI analizom. Molimo pokušajte ponovno.";
    }
}
