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

export const countriesRouter: Router = Router({});

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

countriesRouter.post('/', (req: RequestWithBody<CreateCountryModel>, res: Response) => {
    if (!req.body || !req.body.name) {
        res.sendStatus(HTTP_STATUSES.VALIDATION_ERROR_422);
        return;
    }

    const createdCountry = countriesRepository.createCountry(req.body.name);

    res.status(HTTP_STATUSES.CREATED_201).json(createdCountry);
});

countriesRouter.put(
    '/:id',
    (req: RequestWithParamsAndBody<URIParamsCountryIdModel, UpdateCountryModel>, res) => {
        if (!req.body || !req.body.name) {
            res.sendStatus(HTTP_STATUSES.VALIDATION_ERROR_422);
            return;
        }

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
