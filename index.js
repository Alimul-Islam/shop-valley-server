const express = require('express')
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId
cors = require('cors');
const port = 4000

app.get('/', (req, res) => {
    res.send("Hello from database");
})

app.use(cors());
app.use(express.json())



const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2vw11.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("shopValley").collection("products");
    const orderCollection = client.db("shopValley").collection("productOrdered");

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    app.get('/product/:id', (req, res) => {
        const id = req.params.id
        productsCollection.find({ _id: ObjectId(id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addOrder', (req, res) => {
        const productOrdered = req.body;
        orderCollection.insertOne(productOrdered, (err, results) => {
            res.send({ count: results.insertedCount });

        })
    })

    app.get('/productOrdered', (req, res) => {
        orderCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.post('/addProducts', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products, (err, results) => {
            res.send({ count: results.insertedCount });
        })
    })

    app.delete('/delete/:id', (req, res) => {
        const order = req.params.id;
        orderCollection.deleteOne({ _id: ObjectId(order) }, (err) => {
            if (!err) {
                res.send({ count: 1 });
            }

        })
    })



    // app.post('/addProducts', (req, res) => {
    //     const products = req.body;
    //     productsCollection.insertMany(products, (err, results) => {
    //         res.send({ count: results });

    //     })
    // })

});

app.listen(process.env.PORT || port)