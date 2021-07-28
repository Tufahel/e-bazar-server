const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fcvio.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('connection err', err)
    console.log('connected success')
    const productCollection = client.db("eBazar").collection("products");
    const ordersCollection = client.db("eBazar").collection("orderInfo");

    app.get('/products', (req, res) => {
        productCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/addProducts', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product: ', newProduct)
        productCollection.insertOne(newProduct)
            .then(result => {
                console.log('inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    // app.get("/chekcout/:id", (req,res)=>{
    //     const id=ObjectID(req.params.id);
    //      console.log("checkout ",id);
    //      productCollection.findOne((err,product)=>{
    //         console.log("error extract ",err)
    //        res.send(product)
    //       //  console.log("extrected", product);
    //     })
    //   })
      
      
      
    //     app.post('/addUserInfo', (req, res)=>{
    //       const newProduct = req.body;
    //       console.log("New Event User: ",newProduct);
    //       ordersCollection.insertOne(newProduct)
    //       .then(result=>{
    //         console.log("Inserted succesfully order ", result.insertedCount);
    //         res.send(result.insertedCount>0);
    //       })
    //    })
      
    //    app.get("/UserOrders/:email", (req,res)=>{
    //     const email=ObjectID(req.params.email);
    //     console.log("order email: ",email)
    //     ordersCollection.find({email: email}).toArray((err,items)=>{
    //       console.log("user ",err)
    //       res.send(items)
    //       console.log("database got for order ",items)
    //     })

    //   app.delete('deleteEvent/:id', (req, res) => {
    //       const id = ObjectID(req.params.id);
    //       console.log('delete this', id);
    //       eventCollection.findOneAndDelete({_id: id})
    //       .then(documents => res.send(!!documents.value))
    //   })

    //   client.close();
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})