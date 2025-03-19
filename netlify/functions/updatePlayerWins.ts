import { Handler } from "@netlify/functions";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  try {
    await client.connect();
    const scores = event.body ? JSON.parse(event.body) : null;

    if (!scores || !scores.grossWinner || !scores.netWinner) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request data" }),
      };
    }

    const db = client.db("fairway-fleas");
    const playersCollection = db.collection("players");

    await playersCollection.updateOne(
      { player: scores.grossWinner },
      { $inc: { grossWins: 1 } }
    );

    await playersCollection.updateOne(
      { player: scores.netWinner },
      { $inc: { netWins: 1 } }
    );

    const updatedScores = await playersCollection.find({}).toArray();
    return { statusCode: 200, body: JSON.stringify(updatedScores) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500, // Use 500 for server errors
      body: JSON.stringify({ message: "Error connecting to db" }),
    };
  }
};

export { handler };
