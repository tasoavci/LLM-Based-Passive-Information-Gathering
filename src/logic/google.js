require('dotenv').config();
const axios = require('axios');

const BASE = 'https://www.googleapis.com/customsearch/v1';

exports.search = async (q, count = 10) => {
    const maxCount = Math.min(Math.max(count, 1), 100);
    let results = [];
    let start = 1;

    while (results.length < maxCount) {
        const remaining = maxCount - results.length;
        const params = {
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CX,
            q,
            num: remaining > 10 ? 10 : remaining,
            start,
        };

        const { data } = await axios.get(BASE, { params });
        const items = data.items ?? [];
        results = results.concat(items);

        if (!data.queries?.nextPage || items.length === 0) break;

        start = data.queries.nextPage[0].startIndex;
    }

    return results;
};