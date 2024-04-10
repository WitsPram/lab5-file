// const { app } = require('@azure/functions');

// // app.http('GetCars', {
// //     methods: ['GET', 'POST'],
// //     authLevel: 'anonymous',
// //     handler: async (request, context) => {
// //         context.log(`Http function processed request for url "${request.url}"`);

// //         const name = request.query.get('name') || await request.text() || 'world';

// //         return { body: `Hello, ${name}!` };
// //     }
// // });

// //create cars api using express
// const express = require('express');
// const app = express();

// app.use(express.json());

// const cars = require('./cars.json');

// //get all cars
// app.get('/cars', (req, res) => {
//     res.json(cars);
// });

// //get car by id
// app.get('/cars/:id', (req, res) => {
//     const id = req.params.id;
//     const car = cars.find(car => car.id === id);
//     res.json(car);
// });

// //update car
// app.put('/cars/:id', (req, res) => {
//     const id = req.params.id;
//     const updatedCar = req.body;
//     const index = cars.findIndex(car => car.id === id);
//     cars[index] = updatedCar;
//     res.json(updatedCar);
// });

// //delete car
// app.delete('/cars/:id', (req, res) => {
//     const id = req.params.id;
//     const index = cars.findIndex(car => car.id === id);
//     cars.splice(index, 1);
//     res.json({ message: `Car with id ${id} deleted` });
// });

// //add car
// app.post('/cars', (req, res) => {
//     console.log(req);
//     const newCar = req.body;
//     console.log(newCar);
//     cars.push(newCar);
//     res.json(newCar);
// });

// //start app at localhost:3001
// app.listen(3001, () => {
//     console.log('Server started at http://localhost:3001');
// });

document.addEventListener('DOMContentLoaded', () => {
    const loadCarsBtn = document.getElementById('loadCarsBtn');
    const carList = document.getElementById('carList');
    cars = [];
    loadCarsBtn.addEventListener('click', () => {
        fetch('http://localhost:3001/cars')
            .then(response => response.json())
            .then(data => {
                cars = data;
                carList.innerHTML = '';
                data.forEach((car, index) => {
                    const carCard = document.createElement('div');
                    carCard.classList.add('car-card');
                    carCard.innerHTML = `
                        <h2>${car.make} ${car.model}</h2>
                        <p><strong>Year:</strong> ${car.year}</p>
                        <p><strong>Make:</strong> ${car.make}</p>
                        <p><strong>Model:</strong> ${car.model}</p>
                        <p><strong>Price:</strong> R${car.price}</p>
                        <button class="btn btn-remove" data-index="${index}">Remove</button>
                    `;
                    carList.appendChild(carCard);
                });
            })
            .catch(error => {
                console.error('Error fetching car data:', error);
            });
    });
});
function addCar(newCar) {
    fetch('http://localhost:3001/cars', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCar)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            //reload cars
            // const loadCarsBtn = document.getElementById('loadCarsBtn');
            loadCarsBtn.click();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

carForm.addEventListener('submit', event => {
    event.preventDefault();
    const make = document.getElementById('make').value;
    const model = document.getElementById('model').value;
    const year = document.getElementById('year').value;
    const price = document.getElementById('price').value;
    addCar({ make, model, year, price });
    carForm.reset();
});

// Function to remove a car
function removeCar(index) {
    const carId = cars[index].id;
    fetch(`http://localhost:3001/cars/${carId}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            //reload cars
            // const loadCarsBtn = document.getElementById('loadCarsBtn');
            loadCarsBtn.click();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
// Event delegation for remove buttons
carList.addEventListener('click', event => {
    if (event.target.classList.contains('btn-remove')) {
        const index = event.target.dataset.index;
        removeCar(index);
    }
});
