const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// Middleware
// app.use(
//   cors({
//     origin: [
//       'https://hilarious-gnome-f40639.netlify.app',
//     ],
//   })
// );
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qenm5ah.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server (optional starting in v4.7)
    // await client.connect();
    const userCollection = client.db("Art-Craft").collection("craft");
    const userEmailPass = client.db("Art-Craft").collection("user");

    app.get('/user', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.findOne(query);
      res.send(result);
    });

    app.post('/user', async (req, res) => {
      const newUser = req.body;
      console.log('new user', newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const user = req.body;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updateUser = {
        $set: {
          item_name: user.item_name,
          subcategory: user.subcategory,
          description: user.description,
          price: user.price,
          rating: user.rating,
          processing: user.processing,
          name: user.name,
          email: user.email,
          photo: user.photo
        }
      };
      const result = await userCollection.updateOne(filter, updateUser, option);
      res.send(result);
    });

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // For users email and name
    app.get('/user', async (req, res) => {
      const query = userEmailPass.find();
      const result = await query.toArray();
      res.send(result);
    });

    app.post('/user', async (req, res) => {
      const newUser = req.body;
      console.log('new user', newUser);
      const result = await userEmailPass.insertOne(newUser);
      res.send(result);
    });

    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userEmailPass.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Art and Craft Store!');
});

app.listen(port, () => {
  console.log(`Art project is running on port ${port}`);
});