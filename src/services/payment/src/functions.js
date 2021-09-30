const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function sendQueryGraphQL(uri, accessToken, body) {
    const response = await fetch(uri, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${accessToken}`
        }
    });
    
    return await response.json();
}

module.exports = {
    sendQueryGraphQL
}