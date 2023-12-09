const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());

//database user
//uzzalpahan1
//nFQbB9L5xVx1WQo8

// const uri = "mongodb://localhost:27017/";
// const uri = "mongodb://0.0.0.0:27017/";
const uri = "mongodb+srv://uzzalpahan1:pxvCffMTq1RVjDli@cluster0.1llhv9e.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    

    //Database And Database Table Start 
    const userColletion = client.db('categorysDB');
    const category = userColletion.collection('category')
    const products = userColletion.collection('products')
    const carts = userColletion.collection('carts')
    //Database And Database Table End 



    //Insert Category to Database Start
    app.post('/category', async(req, res)=>{
      const categorys = req.body;
      console.log(categorys, 'category added');
      const result = await category.insertOne(categorys)
      res.send(result)
    })
    //Insert Category to Database End



    //Insert Products to Database Start
    app.post('/products', async(req, res)=>{
      const product = req.body;
      console.log(product, 'product added');
      const result = await products.insertOne(product)
      res.send(result)
    })
    //Insert Products to Database End



    //cart detail insert start
    app.post('/carts', async(req, res)=>{
      const cart = req.body;
      console.log(cart, 'cart detail added');
      const result = await carts.insertOne(cart)
      res.send(result)
    })
    //cart detail insert end


    //Show cart product start 
    app.get('/carts', async(req, res)=>{
      const cart = carts.find();
      const result = await cart.toArray();
      res.send(result);
    })
    //Show cart product start 
    

    //cart items removed start
    app.delete('/carts/:id', async(req,res)=>{
      const id = req.params.id;
      console.log('this is the current : ', id);

      const query = {_id: new ObjectId(id)}
      const result = await carts.deleteOne(query);
      res.send(result);

  })
    //cart items removed end




    //Show single category product start 
    app.get('/apple', async(req, res)=>{
      const apple = products.find();
      const result = await apple.toArray();
      res.send(result);
    })
    //Show single category product end 



    //show data with category start
    app.get('/apple/:category', async(req, res)=>{
      const categoryes = req.params.category;
      const result = await products.aggregate([
        {
        $match: { "categoryValue": categoryes }
        }
        ]).toArray();
      res.send(result)
    })

    //show data with category end



    //Show Products from Database to Server Start
    app.get('/products', async(req, res)=>{
      const product = products.find();
      const result = await product.toArray();
      res.send(result);
    })
    //Show Products from Database to Server End
    

    //Show Single product data start
    app.get('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const user = await products.findOne(query)
      res.send(user)
  })
    //Show Single product data end\


    //Update Prducts data Start
    app.put('/update/:id', async(req, res)=>{
      const id = req.params.id;
      const user = req.body;
      console.log(id, user);

      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true}
      const updateUser = {
          $set: {
              image: user.image,
              name: user.name,
              brand: user.brand,
              categoryValue: user.categoryValue,
              price: user.price,
              description: user.description,
              rating: user.rating
          }
      }
      const result = await products.updateOne(filter, updateUser, options);
      res.send(result)
  })
    //Update Prducts data End



    //Show Category from Database Start
    app.get('/category', async(req, res)=>{
      const categori = category.find()
      const result = await categori.toArray()
      res.send(result)
    })
    //Show Category from Database End


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res) =>{
    res.send('gadgethub server is running');
})

app.listen(port, ()=>{
    console.log(`server running on PORT: ${port}`);
})