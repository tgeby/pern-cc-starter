import express from 'express';

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json());

app.use((req, res, next) => {
   const timestamp = new Date().toISOString();
   console.log(`[${timestamp} ${req.method} ${req.url}]`);
   next();
});

let cars = [
    { id: 1, make: 'Toyota', model: 'Corolla', year: 2015, price: 15000 },
    { id: 2, make: 'Tesla', model: 'Model S', year: 2023, price: 25000 },
    { id: 3, make: 'Ford', model: 'F-150', year: 2025, price: 30000 },
];

app.get('/', (req, res) => {
    res.send('Hello from the CARS API!');
});

router.get('/', (req, res) => {
    res.json(cars);
});

router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find(car => car.id === id);

    if (!car) return res.status(404).json({ error: 'Car not found' });
    res.json(car);
});

router.post('/', (req, res) => {
    const nextId = cars.length === 0 ? 1 : Math.max(...cars.map(car => car.id)) + 1;

    const { make, model, year, price } = req.body;

    const parsedYear = Number(year);
    const parsedPrice = Number(price);

    if (!make || !model || year === undefined || price === undefined) {
        return res.status(400).json({ error: 'Please provide make, model, year, and price' });
    }

    if (Number.isNaN(parsedYear) || Number.isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'Year and price must be numbers' })
    }

    const car = {
        id: nextId,
        make,
        model,
        "year": parsedYear,
        "price": parsedPrice
    };

    cars.push(car);
    res.status(201).json(car);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);

    const { make, model, year, price } = req.body;

    const parsedYear = Number(year);
    const parsedPrice = Number(price);

    if (!make  || !model || year === undefined || price === undefined) {
        return res.status(400).json({ error: 'Please provide make, model, year, and price' });
    }

    if (Number.isNaN(parsedYear) || Number.isNaN(parsedPrice)) {
        return res.status(400).json({ error: 'Year and price must be numbers' })
    }

    const newCar = {
        id,
        make,
        model,
        "year": parsedYear,
        "price": parsedPrice
    }

    const carIndex = cars.findIndex(car => car.id === id);

    if (carIndex === -1) {
        cars.push(newCar);
        return res.status(201).json(newCar);
    }
    cars[carIndex] = newCar;
    res.status(200).json(newCar);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = cars.findIndex(car => car.id === id);

    if (index === -1) return res.status(404).json({ error: 'Car not found'});
    const deleted = cars.splice(index, 1)[0];
    res.status(200).json({ message: 'Car deleted successfully', car: deleted });
});

router.patch('/:id', (req, res) => {
    const id = Number(req.params.id);
    const car = cars.find(car => car.id === id);

    if (!car) return res.status(404).json({ error: 'Car not found' });

    Object.assign(car, req.body);
    res.json(car);
});


app.use('/api/v1/cars', router);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));