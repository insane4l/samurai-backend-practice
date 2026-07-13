import { CountryType } from '../types/types';
import { CountryViewModel } from '../models/CountryViewModel';
import { HTTP_STATUSES } from '../index';

const DB = {
    countries: [
        { id: 1, name: 'Estonia', code: 'EE' },
        { id: 2, name: 'France', code: 'FR' },
        { id: 3, name: 'Azerbaijan', code: 'AZ' },
        { id: 4, name: 'Turkey', code: 'TR' },
    ],
};

const getCountryViewModel = (dbCountry: CountryType): CountryViewModel => {
    return { id: dbCountry.id, name: dbCountry.name };
};

export const countriesRepository = {
    findCountries(name: string | undefined) {
        let foundCountries: CountryType[] = DB.countries;

        if (name) {
            foundCountries = foundCountries.filter((c) => c.name.indexOf(name) > -1);
        }

        return foundCountries.map(getCountryViewModel);
    },

    getCountry(id: number) {
        const country = DB.countries.find((c) => c.id === id);

        if (!country) {
            return undefined;
        }

        return getCountryViewModel(country);
    },

    createCountry(name: string) {
        const newCountry = {
            name,
            id: +new Date(),
            code: 'TST', // todo: need to generate code in accordance with name value
        };

        DB.countries.push(newCountry);

        return getCountryViewModel(newCountry);
    },

    updateCountry(id: number, name: string) {
        const selectedCountry = DB.countries.find((c) => c.id === id);

        if (!selectedCountry) {
            return false;
        } else {
            selectedCountry.name = name;
            return true;
        }
    },

    deleteCountry(id: number) {
        const selectedCountry = DB.countries.find((c) => c.id === id);

        if (!selectedCountry) {
            return false;
        } else {
            DB.countries = DB.countries.filter((c) => c.id !== id);
            return true;
        }
    },

    deleteCountries() {
        DB.countries = [];
    },
};
