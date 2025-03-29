import { Handler } from "@netlify/functions";
import { MongoClient, ObjectId } from "mongodb";
import { calculatePoints } from "../../src/hooks";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  try {
    await client.connect();
    const db = client.db("fairway-fleas");

    // Parse request body
    const score = event.body ? JSON.parse(event.body) : null;
    if (!score || !score._id || !ObjectId.isValid(score._id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid or missing ObjectId" }),
      };
    }

    // Retrieve the round
    const round = await db
      .collection("scores")
      .findOne({ _id: new ObjectId(score._id) });

    if (!round || !round.scores || round.scores.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Round not found or has no scores" }),
      };
    }

    // Extract net and gross scores
    const netScores = round.scores.map((s) => ({
      player: s.player,
      score: s.net,
    }));
    const grossScores = round.scores.map((s) => ({
      player: s.player,
      score: s.gross,
    }));

    // Calculate points
    const netPoints = calculatePoints(netScores);
    const grossPoints = calculatePoints(grossScores);

    const playersCollection = db.collection("players");

    // Decrement previous gross points
    for (const [player, points] of Object.entries(grossPoints)) {
      const decrementValue = typeof points === "number" ? points : 0;
      await playersCollection.updateOne(
        { player },
        { $inc: { grossPoints: -decrementValue } } // Ensure correct field name
      );
    }

    // Decrement previous net points
    for (const [player, points] of Object.entries(netPoints)) {
      const decrementValue = typeof points === "number" ? points : 0;
      await playersCollection.updateOne(
        { player },
        { $inc: { netPoints: -decrementValue } } // Ensure correct field name
      );
    }

    // Delete the round from scores collection
    await db.collection("scores").deleteOne({ _id: new ObjectId(score._id) });

    // Fetch updated scores
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
  } finally {
    await client.close();
  }
};

export { handler };
