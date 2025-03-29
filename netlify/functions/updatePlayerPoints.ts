import { Handler } from "@netlify/functions";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  throw new Error("MONGO_URI is not defined in environment variables");
}

export const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  try {
    await client.connect();
    const scores = event.body ? JSON.parse(event.body) : null;

    if (!scores || !scores.grossPoints || !scores.netPoints) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request data" }),
      };
    }

    const db = client.db("fairway-fleas");
    const playersCollection = db.collection("players");

    for (const [player, points] of Object.entries(scores.grossPoints)) {
      const incrementValue = typeof points === "number" ? points : 0;
      await playersCollection.updateOne(
        { player },
        { $inc: { grossPoints: incrementValue } }
      );
    }

    for (const [player, points] of Object.entries(scores.netPoints)) {
      const incrementValue = typeof points === "number" ? points : 0;
      await playersCollection.updateOne(
        { player },
        { $inc: { netPoints: incrementValue } }
      );
    }

    const updatedScores = await playersCollection.find({}).toArray();
    console.log(updatedScores);

    return { statusCode: 200, body: JSON.stringify(updatedScores) };
  } catch (error) {
    console.error("Database connection error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error connecting to db" }),
    };
  } finally {
    await client.close();
  }
};

export { handler };
