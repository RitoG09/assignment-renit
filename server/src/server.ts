import express, { Application, Request, Response } from "express";
import "dotenv/config";
import prisma from "./config/db.js";
import cors from "cors";
import { format } from "date-fns";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000", // For local dev
  "https://assignment-renit.onrender.com", // For deployed frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        return callback(null, false);
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 7000;

app.post("/availability", async (req: Request, res: Response) => {
  try {
    const { unavailableDates } = req.body;

    const formattedDates = unavailableDates.flatMap((range: any) => {
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);
      const dates = [];

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const formattedDate = format(currentDate, "dd MMMM yyyy");
        dates.push(formattedDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    });

    const availability = await prisma.availability.create({
      data: {
        dates: formattedDates,
      },
    });

    res
      .status(201)
      .json({ message: "Availability updated successfully.", availability });
  } catch (error) {
    console.error("Error while updating availability", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/availability", async (req: Request, res: Response) => {
  try {
    const availabilities = await prisma.availability.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ availabilities });
  } catch (error) {
    console.error("Error fetching availabilities", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
