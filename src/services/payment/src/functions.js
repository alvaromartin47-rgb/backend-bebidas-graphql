const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function sendQueryGraphQL(uri, body) {
    const response = await fetch(uri, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
    
    return await response.json();
}

module.exports = {
    sendQueryGraphQL
}