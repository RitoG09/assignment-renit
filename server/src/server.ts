import express, { Application, Request, Response } from "express";
import "dotenv/config";
import prisma from "./config/db.js";
import cors from "cors";
import { format } from "date-fns";

const app: Application = express();

//CORS setup
app.use(
  cors({
    origin: "https://assignment-renit.onrender.com",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT;

app.post("/availability", async (req: Request, res: Response) => {
  try {
    const { unavailableDates } = req.body;

    const formattedDates = unavailableDates.flatMap((range: any) => {
      // Create date objects and ensure they're treated as UTC dates
      const startDate = new Date(range.startDate);
      const endDate = new Date(range.endDate);

      console.log("Processing date range:", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      const dates = [];

      // Clone start date to avoid modifying the original
      let currentDate = new Date(startDate);

      // Loop through each day in the range
      while (currentDate <= endDate) {
        // Format the date in a locale-independent way
        const formattedDate = format(currentDate, "dd MMMM yyyy");
        dates.push(formattedDate);

        // Move to next day
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        currentDate = nextDay;
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
