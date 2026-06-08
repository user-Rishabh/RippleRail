import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { predictDelay } from "../services/predictionEngine";

const router = Router();
const prisma = new PrismaClient();

// Add a journey with connections
router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, trainNumber, source, destination, connections } = req.body;

    // Check if user exists, if not create dummy for MVP
    let user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      user = await prisma.user.create({
        data: { id: userId || "dummy-user", name: "Guest User", email: "guest@example.com" }
      });
    }

    const journey = await prisma.journey.create({
      data: {
        userId: user.id,
        trainNumber,
        source,
        destination,
        connections: {
          create: connections.map((conn: any) => {
            const prediction = predictDelay(trainNumber, conn.connectingTrain, conn.station);
            return {
              connectingTrain: conn.connectingTrain,
              station: conn.station,
              probabilityScore: prediction.probabilityScore
            };
          })
        }
      },
      include: { connections: true }
    });

    res.status(201).json(journey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get user journeys
router.get("/:userId", async (req: Request, res: Response) => {
  try {
    const journeys = await prisma.journey.findMany({
      where: { userId: req.params.userId },
      include: { connections: true }
    });
    res.json(journeys);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Predict specific connection (ad-hoc)
router.post("/predict", async (req: Request, res: Response) => {
  const { currentTrain, connectingTrain, station } = req.body;
  const prediction = predictDelay(currentTrain, connectingTrain, station);
  res.json(prediction);
});

export default router;
