const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const app = express();
const port = 3000;

// middle ware
app.use(cors());
// middleware end

// mongodb

const uri =
  "mongodb+srv://elaAdmin:tuWqMoFZ7OHaPrav@cluster0.sp25joa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const allProducts = client.db("elaAdmin").collection("products");

    app.get("/products", async (req, res) => {
      const sort = req.query.sort;
      const category = req.query.category;
      const search = req.query.search;

      const query = {
        category: {
          $regex: category,
        },
        product_name: {
          $regex: search,
          $options: "i",
        },
      };

      const option = {
        sort: {
          price: sort == "asc" ? 1 : -1,
        },
      };

      const products = await allProducts.find(query, option).toArray();
      res.send(products);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// mongoDB end

app.get("/", (req, res) => {
  res.send("Hell do World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
