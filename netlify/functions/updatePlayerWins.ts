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

    if (!scores || !scores.grossWinners || !scores.netWinners) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request data" }),
      };
    }

    const db = client.db("fairway-fleas");
    const playersCollection = db.collection("players");

    const grossIncrement = scores.grossWinners.length === 1 ? 3 : 1;
    const netIncrement = scores.netWinners.length === 1 ? 3 : 1;

    for (const winner of scores.grossWinners) {
      await playersCollection.updateOne(
        { player: winner },
        { $inc: { grossWins: grossIncrement } }
      );
    }

    for (const winner of scores.netWinners) {
      await playersCollection.updateOne(
        { player: winner },
        { $inc: { netWins: netIncrement } }
      );
    }

    const updatedScores = await playersCollection.find({}).toArray();
    console.log(updatedScores);

    return { statusCode: 200, body: JSON.stringify(updatedScores) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error connecting to db" }),
    };
  }
};

export { handler };
