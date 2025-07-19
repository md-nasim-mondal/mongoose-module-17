import { Server } from "http";
import app from "./app";
import mongoose from "mongoose";
import "dotenv/config"

let server: Server;

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`,{
        dbName: 'advancedNoteDB'
    })
    console.log("Connected ti MongoDB using Mongoose!!");
    server = app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    })
  } catch (error) {
    console.log(error);
  }
}

main()
