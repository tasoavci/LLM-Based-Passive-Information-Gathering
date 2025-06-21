const { search } = require('./google');
const { detectPattern } = require('./pattern');
const { makeEmail } = require('./generator');
const { guessPatternLLM } = require('./llm');

exports.runPipeline = async (company, domain) => {
    console.log('[pipeline] running for:', company, domain);
    if (!company || !domain) {
        throw new Error('Company and domain are required');
    }

    const hitsAt = await search(`"@${domain}"`, 40);
    const hitsSite = await search(`site:${domain} "@${domain}"`, 40);
    const hitsContact = await search(`"${domain}" contact email`, 20);
    const mailHits = [...hitsAt, ...hitsSite, ...hitsContact];

    const mailRegex = new RegExp(`[A-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'gi');
    const mails = [...new Set(
        mailHits.flatMap(h => (h.snippet?.match(mailRegex) || []))
    )];
    const mailCount = mails.length;
    console.log(mails.length, 'emails found', mails[0]);

    let format;
    if (mailCount === 0) {
        console.warn('[pipeline] No sample emails found, defaulting to first.last');
        format = 'first.last';
    } else {
        try {
            format = await guessPatternLLM(mails);
        } catch (err) {
            console.warn('[LLM] pattern tahmini başarısız, regex’e dönüyorum', err);
            format = detectPattern(mails);
        }
    }

    const liHits = await search(`site:linkedin.com/in "${company}"`, 30);
    const people = liHits.map(i => {
        const m = i.title.match(/^([A-Za-z.'-]+)\s+([A-Za-z.'-]+)\s+[–\-\|]\s+(.+?)\s+[–\-\|]/);
        return m ? { first: m[1], last: m[2], title: m[3] } : null;
    }).filter(Boolean);
    console.log('[pipeline] sample mails:', mails);
    console.log('[pipeline] detected pattern:', format);
    console.log('[pipeline] first LinkedIn title:', liHits[0]?.title);
    const results = people.map(p => ({
        ...p,
        email: makeEmail(p, format, domain)
    }));
    return { results, format, mailCount };
};