import { MongoClient } from "mongodb";

const MONGODB_URI =
  "mongodb+srv://stokes1003:%KjBh4Az@Vq1YCf&@cluster0.h3a7bqm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(event, context) {
  try {
    await client.connect();
    const db = client.db("fairway-fleas");
    const collection = db.collection("scores");

    const data = await collection.find({}).toArray();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  } finally {
    await client.close();
  }
}
