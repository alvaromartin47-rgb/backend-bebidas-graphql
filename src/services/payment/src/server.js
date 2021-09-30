const express = require('express');
const cors = require('cors');
const env = require('node-env-file');
const gql = require('graphql-tag');
const Token = require('./entities/Token');
const { sendQueryGraphQL } = require('./functions');

env('src/.env');

const app = express();
app.use(cors());

app.get("/success/:access_token", async (req, res) => {
    try {
        Token.verify(req.params.access_token, process.env.PRIVATE_PWD);
        const { order_id } = Token.decode(req.params.access_token);
    
        const result = req.query;
        const new_query = gql `
            mutation {
                validatePayment(input: {
                    collection_id: "${result.collection_id}",
                    collection_status: "${result.collection_status}",
                    payment_id: "${result.payment_id}",
                    status: "${result.status}",
                    external_reference: "${result.external_reference}",
                    payment_type: "${result.payment_type}",
                    merchant_order_id: "${result.merchant_order_id}",
                    preference_id: "${result.preference_id}",
                    site_id: "${result.site_id}",
                    processing_mode: "${result.processing_mode}",
                    merchant_account_id: "${result.merchant_account_id}"
                })
            }
        `
        const redirect_uri = `${process.env.URI_CLIENT}shop`;
    
        if (result.status != "approved") res.redirect(redirect_uri + `?order_id=null`)
        else {
            const graphql_uri = `${process.env.GRAPHQL_URI}`;
            sendQueryGraphQL(
                graphql_uri,
                req.params.access_token,
                {query: new_query}
            );
            
            res.redirect(redirect_uri + `?order_id=${order_id}`)
        }
    } catch (err) {
        res.json({"message": err});
    }
});

app.listen({port: 8080}, () => {
    console.log("Servidor corriendo en el 8080");
});

