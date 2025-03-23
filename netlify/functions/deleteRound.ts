import { Handler } from "@netlify/functions";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  try {
    const score = event.body ? JSON.parse(event.body) : null;
    if (!score || !score._id || !ObjectId.isValid(score._id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid or missing ObjectId" }),
      };
    }

    const db = client.db("fairway-fleas");

    const round = await db
      .collection("scores")
      .findOne({ _id: new ObjectId(score._id) });

    if (!round || !round.scores || round.scores.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Round not found or has no scores" }),
      };
    }

    const netWinner = round.scores.reduce((prev, current) =>
      current.net <= prev.net ? current : prev
    ).player;

    const grossWinner = round.scores.reduce((prev, current) =>
      current.gross <= prev.gross ? current : prev
    ).player;

    const playersCollection = db.collection("players");

    const grossPlayer = await playersCollection.findOne({
      player: grossWinner,
    });

    if (grossPlayer) {
      const result = await playersCollection.updateOne(
        { player: grossWinner },
        { $inc: { grossWins: -1 } }
      );
    }

    const netPlayer = await playersCollection.findOne({ player: netWinner });
    console.log("Net Player Found:", netPlayer);

    if (netPlayer) {
      const result = await playersCollection.updateOne(
        { player: netWinner },
        { $inc: { netWins: -1 } }
      );
    }

    await db.collection("scores").deleteOne({ _id: new ObjectId(score._id) });

    const updatedScores = await db.collection("scores").find({}).toArray();

    return { statusCode: 200, body: JSON.stringify(updatedScores) };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Error processing request",
        error: error.message,
      }),
    };
  }
};

export { handler };
