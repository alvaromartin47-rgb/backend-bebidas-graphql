const express = require('express');
const cors = require('cors');
const env = require('node-env-file');
const gql = require('graphql-tag');
const { sendQueryGraphQL } = require('./functions');

env('src/.env');

const app = express();
app.use(cors());

app.get("/success/:id", async (req, res) => {
    const result = req.query;
    const new_query = gql `
        mutation {
            validatePayment(input: {
                mercado_pago: {
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
                }
                order_id: "${req.params.id}"
            })
        }
    `

    const uri = `${process.env.GRAPHQL_URI}`;
    const response = await sendQueryGraphQL(uri, {query: new_query});

    if (response.data.validatePayment == req.params.id) {
        const redirect_uri = `${process.env.URI_CLIENT}shop`;
        res.redirect(redirect_uri + `?order_id=${response.data.validatePayment}`)
    }
});

app.listen({port: 8080}, () => {
    console.log("Servidor corriendo en el 8080");
});

