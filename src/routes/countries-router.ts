import { app, HTTP_STATUSES } from '../index';
import { Router, Response } from 'express';
import {
    CountryType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery,
} from '../types/types';
import { CreateCountryModel } from '../models/CreateCountryModel';
import { QueryCountriesModel } from '../models/QueryCountriesModel';
import { URIParamsCountryIdModel } from '../models/URIParamsCountryIdModel';
import { CountryViewModel } from '../models/CountryViewModel';
import { UpdateCountryModel } from '../models/UpdateCountryModel';
import { countriesRepository } from '../repositories/countries-repository';
import { body } from 'express-validator';
import { inputValidationMiddleware } from '../middlewares/input-validation-middleware';

export const countriesRouter: Router = Router({});

const countryNameValidation = body('name')
    .trim()
    .isLength({ min: 2, max: 20 })
    .withMessage('Country name should be min 2 and max 20 characters');

countriesRouter.get(
    '/',
    (req: RequestWithQuery<QueryCountriesModel>, res: Response<CountryViewModel[]>) => {
        let foundCountries: CountryViewModel[] = countriesRepository.findCountries(req.query.name);

        res.status(HTTP_STATUSES.OK_200).json(foundCountries);
    },
);

countriesRouter.get(
    '/:id',
    (req: RequestWithParams<URIParamsCountryIdModel>, res: Response<CountryViewModel>) => {
        const selectedCountry = countriesRepository.getCountry(+req.params.id);

        if (!selectedCountry) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.status(HTTP_STATUSES.OK_200).json(selectedCountry);
    },
);

countriesRouter.post(
    '/',
    countryNameValidation,
    inputValidationMiddleware,
    (req: RequestWithBody<CreateCountryModel>, res: Response) => {
        const createdCountry = countriesRepository.createCountry(req.body.name);

        res.status(HTTP_STATUSES.CREATED_201).json(createdCountry);
    },
);

countriesRouter.put(
    '/:id',
    countryNameValidation,
    inputValidationMiddleware,
    (req: RequestWithParamsAndBody<URIParamsCountryIdModel, UpdateCountryModel>, res) => {
        const isUpdated = countriesRepository.updateCountry(+req.params.id, req.body.name);

        if (!isUpdated) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
            return;
        }

        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    },
);

countriesRouter.delete('/:id', (req: RequestWithParams<URIParamsCountryIdModel>, res) => {
    const isDeleted = countriesRepository.deleteCountry(+req.params.id);

    if (!isDeleted) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

countriesRouter.delete('/__test__/cleanup', (req, res) => {
    countriesRepository.deleteCountries();

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});
