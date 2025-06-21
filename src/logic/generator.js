exports.makeEmail = ({ first, last }, fmt, domain) => {
    switch (fmt) {
        case 'first.last': return `${first}.${last}@${domain}`.toLowerCase();
        case 'f.last': return `${first[0]}.${last}@${domain}`.toLowerCase();
        case 'first': return `${first}@${domain}`.toLowerCase();
    }
};