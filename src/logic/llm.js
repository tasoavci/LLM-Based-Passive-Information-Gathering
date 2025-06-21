require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


exports.guessPatternLLM = async (samples) => {
    const promptMessages = [
        {
            role: 'system',
            content: `You are an OSINT assistant. When I give you real e-mail samples, your ONLY task
is to deduce the company’s general address pattern. Output STRICTLY one of the
following tokens and NOTHING else:

first.last   → john.doe@example.com
f.last       → j.doe@example.com
first        → john@example.com
lastf        → doej@example.com

If pattern is ambiguous, choose the most frequent among samples. No prose.`
        },
        {
            role: 'user',
            content: `Below are sample e-mails for one company. What is the pattern token?\n\n${samples.slice(0, 10).join('\n')}\n\nAnswer:`
        }
    ];

    const resp = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: promptMessages,
        temperature: 0,
        max_tokens: 5
    });
    const answer = resp.choices[0].message.content.trim().toLowerCase();
    console.log("ANSWER", answer)
    const match = answer.match(/\b(first\.last|f\.last|lastf|first)\b/);
    if (match) return match[1];
    console.warn('[LLM] Unrecognized pattern answer:', answer);
    return 'first.last';
};