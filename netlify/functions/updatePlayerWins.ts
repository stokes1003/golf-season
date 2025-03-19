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

    await client
      .db("fairway-fleas")
      .collection("players")
      .updateMany({ player: scores.player }, { grossWins: { wins: 1 } });
    const updatedScores = await client
      .db("fairway-fleas")
      .collection("players")
      .find({})
      .toArray();
    return { statusCode: 200, body: JSON.stringify(updatedScores) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Error connecting to db" }),
    };
  }
};

export { handler };
