import express from "express";
import { db } from "./db.js";
import { cars } from "./schema.js";
import { eq } from "drizzle-orm";

const app = express();
const PORT = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello from Car API!");
});

router.get("/cars", async (req, res, next) => {
  try {
    const allCars = await db
      .select()
      .from(cars);
    
    res.json(allCars);
  } catch (err) {
    next(err);
  }
});

router.post("/cars", async (req, res, next) => {
  try {
    const { make, model, year, price } = req.body;

    if (!make || !model || !year || !price) {
      return res.status(400).json({
        error: "Please provide make, model, year, and price",
      });
    }

    const [newCar] = await db
      .insert(cars)
      .values({ make, model, year, price })
      .returning();

    res.status(201).json(newCar);
  } catch (err) {
    next(err);
  }
});

router.put("/cars/:id", async (req, res, next) => {
  try {
    const carId = Number(req.params.id);
    const { make, model, year, price } = req.body;

    if (!carId || !make || !model || !year || !price) {
      return res.status(400).json({ error: "Invalid input" });
    }

    const [updatedCar] = await db
      .update(cars)
      .set({ make, model, year, price })
      .where(eq(cars.id, carId))
      .returning();
    
    if (!updatedCar) {
      return res.status(404).json({ error: `Car with id ${carId} not found` });
    }
    return res.json(updatedCar);
  } catch (err) {
    next(err);
  }
});

router.delete("/cars/:id", async (req, res, next) => { 
  try {
    const carId = Number(req.params.id);
    const [deletedCar] = await db
      .delete(cars)
      .where(eq(cars.id, carId))
      .returning();

    if (!deletedCar) {
      return res.status(404).json({ error: `Car with id ${carId} not found` });
    }

    res.json({
      message: "Car deleted successfully",
      car: deletedCar
    });
  } catch (err) {
    next(err);
  }
});

router.get("/cars/:id", async (req, res, next) => {
  try {
    const carId = Number(req.params.id);

    const [car] = await db
      .select()
      .from(cars)
      .where(eq(cars.id, carId));

    if (!car) {
      return res.status(404).json({ error: `Car with id ${carId} not found` });
    }

    res.json(car);
  } catch(err) {
    next(err);
  }
});

app.use("/api/v1", router);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
