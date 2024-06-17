import express from "express";
import julep from "@julep/sdk";
import bodyParser from "body-parser";
import cors from "cors";
import { fileURLToPath } from "url"; // Import the fileURLToPath function
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename); // Get the directory name

const apiKey = process.env.JULEP_API_KEY; // Replace with your actual API key
const client = new julep.Client({ apiKey });

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, "public")));

// API endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const query = req.body.query;

    const user = await client.users.create({
      name: "Ayush",
      about: "A developer",
    });

    const agent = await client.agents.create({
      name: "Movie suggesting assistant",
      // model: "gpt-4-turbo",
    });

    const session = await client.sessions.create({
      agentId: agent.id,
      userId: user.id,
      situation:
        "You are Movio. You tell the people about movies they ask for, and recommend movies to the users",
    });

    const chatParams = {
      messages: [
        {
          role: "user",
          name: "Ayush",
          content: query,
        },
      ],
    };
    const chatResponse = await client.sessions.chat(session.id, chatParams);
    const responseMessage = chatResponse.response[0][0].content;

    res.json({ response: responseMessage });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
