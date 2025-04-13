import express from "express";
import "dotenv/config";
import prisma from "./config/db.js";
import cors from "cors";
import { format } from "date-fns";
const app = express();
// Simple CORS setup with explicit origin
app.use(cors({
    origin: "https://assignment-renit.onrender.com",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
const PORT = process.env.PORT || 7000;
app.post("/availability", async (req, res) => {
    try {
        const { unavailableDates } = req.body;
        const formattedDates = unavailableDates.flatMap((range) => {
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
    }
    catch (error) {
        console.error("Error while updating availability", error);
        res.status(500).json({ message: "Server error" });
    }
});
app.get("/availability", async (req, res) => {
    try {
        const availabilities = await prisma.availability.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
        res.status(200).json({ availabilities });
    }
    catch (error) {
        console.error("Error fetching availabilities", error);
        res.status(500).json({ message: "Server error" });
    }
});
app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
