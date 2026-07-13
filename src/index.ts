import express, { Response, Express } from 'express';
import { countriesRouter } from './routes/countries-router';

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,
    VALIDATION_ERROR_422: 422,
    NOT_FOUND_404: 404,
};

export const app: Express = express();
const port = process.env.PORT || 3006;
const JsonBodyMiddleware = express.json();

app.use(JsonBodyMiddleware);
app.use('/countries', countriesRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
