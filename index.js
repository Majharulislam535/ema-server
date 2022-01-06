const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 4000;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l2gsi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello world");
})


async function run() {

    try {
        await client.connect();
        const database = client.db("ema_simple");
        const userColleaction = database.collection("collection");

        app.get('/products', async (req, res) => {
            const size = parseInt(req.query.size);
            const page = (req.query.page);
            const cursor = userColleaction.find({});
            const count = await cursor.count();
            let products;
            if (page) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }
            res.send({
                count,
                products
            });
        })

        //Post api

        app.post('/products/keys', async (req, res) => {
            const keys = req.body;
            const query = { key: { $in: keys } }
            const products = await userColleaction.find(query).toArray();
            res.json(products);
        })

    }
    finally {
        //   await client.close();
    }

}
run().catch(console.dir);

app.listen(port, () => {
    console.log('listen to port', port);
})