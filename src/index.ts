import express, { Request, Response } from "express";

import prisma from "./prisma";
// Import the path module to handle file paths
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running successfully!");
});

app.post("/createLocation", async (req: Request, res: Response) => {
  try {
    const { longititude, latitude } = req.body;
    console.log(longititude, latitude);
    const locationCreated = await prisma.location.create({
      data: {
        longitiude: longititude,
        latitude: latitude,
      },
    });
    return res.status(200).json({ success: true, location: locationCreated });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/getLocations", async (req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(locations);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

const PORT = 5500;
prisma
  .$connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  })
  .catch(async (e: Error) => {
    console.log(e.message);
  });
