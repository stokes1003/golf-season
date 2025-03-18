import { builder, Handler } from "@netlify/functions";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const myHandler: Handler = async (event, context) => {
  try {
    await client.connect();
    const scores = await client
      .db("fairway-fleas")
      .collection("scores")
      .find({})
      .toArray();
    return {
      statusCode: 200,
      body: JSON.stringify(scores),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Error connecting to db",
      }),
    };
  }
};

const handler = builder(myHandler);

export { handler };
