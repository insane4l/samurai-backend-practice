import {app, HTTP_STATUSES} from "../index";
import {Router, Response} from "express";
import {
    CountryType,
    RequestWithBody,
    RequestWithParams,
    RequestWithParamsAndBody,
    RequestWithQuery
} from "../types/types";
import {CreateCountryModel} from "../models/CreateCountryModel";
import {QueryCountriesModel} from "../models/QueryCountriesModel";
import {URIParamsCountryIdModel} from "../models/URIParamsCountryIdModel";
import {CountryViewModel} from "../models/CountryViewModel";
import { UpdateCountryModel } from "../models/UpdateCountryModel";


const DB = {
    countries: [
        { id: 1, name: 'Estonia', code: 'EE' },
        { id: 2, name: 'France', code: 'FR' },
        { id: 3, name: 'Azerbaijan', code: 'AZ' },
        { id: 4, name: 'Turkey', code: 'TR' },
    ]
};

const getCountryViewModel = (dbCountry: CountryType): CountryViewModel => {
    return { id: dbCountry.id, name: dbCountry.name }
}

export const countriesRouter: Router = Router({})

countriesRouter.get('/', (req: RequestWithQuery<QueryCountriesModel>, res: Response<CountryViewModel[]>) => {
    let foundCountries: CountryType[] = DB.countries;

    if (req.query.name) {
        foundCountries = foundCountries.filter(c => c.name.indexOf(req.query.name as string) > -1)
    }

    res.status(HTTP_STATUSES.OK_200).json(foundCountries.map(getCountryViewModel));
});

countriesRouter.get('/:id', (req: RequestWithParams<URIParamsCountryIdModel>, res: Response) => {

    const selectedCountry = DB.countries.find(c => c.id === +req.params.id);

    if (!selectedCountry) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    res.status(HTTP_STATUSES.OK_200).json(getCountryViewModel(selectedCountry));
});

countriesRouter.post('/', (req: RequestWithBody<CreateCountryModel>, res: Response) => {

    if (!req.body || !req.body.name) {
        res.sendStatus(HTTP_STATUSES.VALIDATION_ERROR_422);
        return;
    }

    const newCountry = {
        id: +(new Date()),
        name: req.body.name,
        code: 'TST' // todo; need to generate code in accordance with name value
    }

    DB.countries.push(newCountry);

    res
        .status(HTTP_STATUSES.CREATED_201)
        .json(getCountryViewModel(newCountry));

});

countriesRouter.delete('/:id', (req: RequestWithParams<URIParamsCountryIdModel>, res) => {
    const selectedCountry = DB.countries.find(c => c.id === +req.params.id);

    if (!selectedCountry) {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
        return;
    }

    DB.countries = DB.countries.filter(c => c.id !== +req.params.id);

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});

countriesRouter.put('/:id', (req: RequestWithParamsAndBody<URIParamsCountryIdModel, UpdateCountryModel>, res) => {
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

countriesRouter.delete('/__test__/cleanup', (req, res) => {
    DB.countries = [];

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
});