import express from 'express';

const app = express();
const port = 3006;
const JsonBodyMiddleware = express.json();
app.use(JsonBodyMiddleware);

const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    VALIDATION_ERROR_422: 422,
    NOT_FOUND_404: 404,
};

const DB = {
    countries: [
    {id: 1, name: 'Estonia'},
    {id: 2, name: 'France'},
    {id: 3, name: 'Azerbaijan'},
    {id: 4, name: 'Turkey'},
]};


app.get('/countries', (req, res) => {
    let foundCountries = DB.countries;

    if (req.query.name) {
        foundCountries = foundCountries.filter(c => c.name.indexOf(req.query.name as string) > -1)
    }

    res.status(HTTP_STATUSES.OK_200).json(foundCountries);
});

app.get('/countries/:id', (req, res) => {

    const selectedCountry = DB.countries.find(c => c.id === +req.params.id);

    if (!selectedCountry) {
         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
         return;
    }

    res.status(HTTP_STATUSES.OK_200).json(selectedCountry);
});


app.post('/countries', (req, res) => {

    if (!req.body || !req.body.name) {
         res.sendStatus(HTTP_STATUSES.VALIDATION_ERROR_422);
         return;
    }

    const newCountry = {
        id: +(new Date()), 
        name: req.body.name,
    }

    DB.countries.push(newCountry);

    res
    .status(HTTP_STATUSES.CREATED_201)
    .json(newCountry);

});

app.delete('/countries/:id', (req, res) => {
    DB.countries = DB.countries.filter(c => c.id !== +req.params.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

app.put('/countries/:id', (req, res) => {
    if (!req.body || !req.body.name) {
         res.sendStatus(HTTP_STATUSES.VALIDATION_ERROR_422);
         return;
    }

        const selectedCountry = DB.countries.find(c => c.id === +req.params.id);

    if (!selectedCountry) {
         res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
         return;
    }

    selectedCountry.name = req.body.name;


    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});




app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});