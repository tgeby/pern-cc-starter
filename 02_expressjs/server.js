import express from 'express';

const app = express();
const port = 3000;

const router = express.Router();

app.use(express.json());

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

    if (!car) return res.status(404).send('Car not found');
    res.json(cars.find(car => car.id === Number(req.params.id)));
});

router.post('/', (req, res) => {
    const nextId = cars.length === 0 ? 1 : Math.max(...cars.map(car => car.id)) + 1;

    const { make, model, year, price } = req.body;


    const car = {
        nextId,
        make,
        model,
        "year": Number(year),
        "price": Number(price)
    };

    if (!car.make || !car.model || !car.year || !car.price) {
        return res.status(400).send('Please provide make, model, year, and price');
    }

    cars.push(car);
    res.status(201).json(car);
});

router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    if (!body.make || !body.model || !body.year || !body.price) {
        return res.status(400).send('Please provide make, model, year, and price');
    }

    const { make, model, year, price } = body;

    const newCar = {
        id,
        make,
        model,
        "year": Number(year),
        "price": Number(price)
    }

    const carIndex = cars.findIndex(car => car.id === Number(req.params.id));
    if (carIndex === -1) {
        cars.push(newCar);
        return res.status(201).json(newCar);
    }
    cars[carIndex] = newCar;
    res.status(200).json(newCar);
});

router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    cars = cars.filter(car => car.id !== id);
    res.status(204).send('Car deleted successfully');
});

app.use('/api/v1/cars', router);

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));