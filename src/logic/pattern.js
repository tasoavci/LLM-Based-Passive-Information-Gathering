const patterns = [
    { regex: /^([a-z]+)\.([a-z]+)@/, fmt: 'first.last' },
    { regex: /^([a-z])[a-z]*\.([a-z]+)@/, fmt: 'f.last' },
    { regex: /^([a-z]+)@/, fmt: 'first' },
];

exports.detectPattern = (samples) => {
    for (const p of patterns) {
        const hits = samples.filter(m => p.regex.test(m));
        if (hits.length >= 2) return p.fmt;
    }
    return 'first.last';
};