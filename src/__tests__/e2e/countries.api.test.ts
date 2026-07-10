import request from 'supertest';
import { app, HTTP_STATUSES } from '../..';



describe('/countries', () => {

    beforeEach(async () => {
        await request(app).delete('/countries/__test__/cleanup');
    });

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, []);
    });


    it('should return 404 for not existing country', async () => {
        await request(app)
            .get('/countries/1')
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });


    it('should create country with correct input data', async () => {
        const validCountryName = 'Estonia'

        const response = await request(app)
            .post('/countries')
            .send({ name: validCountryName })
            .expect(HTTP_STATUSES.CREATED_201);

        const createdCountry = response.body;

        console.log(createdCountry)

        expect(createdCountry).toEqual({
            id: expect.any(Number),
            name: validCountryName
        });

        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, [createdCountry]);
    });

    it('should create multiple countries with correct input data', async () => {
        const validCountryName1 = 'Estonia'
        const validCountryName2 = 'Estonia'

        const response1 = await request(app)
            .post('/countries')
            .send({ name: validCountryName1 })
            .expect(HTTP_STATUSES.CREATED_201);

        const response2 = await request(app)
            .post('/countries')
            .send({ name: validCountryName2 })
            .expect(HTTP_STATUSES.CREATED_201);

        const createdCountry1 = response1.body;
        const createdCountry2 = response2.body;

        expect(createdCountry1).toEqual({
            id: expect.any(Number),
            name: validCountryName1
        });

        expect(createdCountry2).toEqual({
            id: expect.any(Number),
            name: validCountryName2
        });

        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, [createdCountry1, createdCountry2]);
    });


    it('should not create country with incorrect input data', async () => {
        await request(app)
            .post('/countries')
            .send({ title: '' })
            .expect(HTTP_STATUSES.VALIDATION_ERROR_422);

        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it('should update country with correct input data', async () => {
        const validCountryName1 = 'Estonia'
        const validCountryName2 = 'Spain'

        const response = await request(app)
            .post('/countries')
            .send({ name: validCountryName1 });

        const createdCountry = response.body;

        await request(app)
            .put(`/countries/${createdCountry.id}`)
            .send({ name: validCountryName2 })
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, [{ id: createdCountry.id, name: 'Spain' }]);

        await request(app)
            .get(`/countries/${createdCountry.id}`)
            .expect(HTTP_STATUSES.OK_200, { id: createdCountry.id, name: 'Spain' });
    });

    it('should not update country with incorrect input data', async () => {
        const validCountryName = 'Estonia'

        const response = await request(app)
            .post('/countries')
            .send({ name: validCountryName });

        const createdCountry = response.body;

        await request(app)
            .put(`/countries/${createdCountry.id}`)
            .send({ name: '' })
            .expect(HTTP_STATUSES.VALIDATION_ERROR_422);

        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, [createdCountry]);
    });


    it('should not update country with not existed id', async () => {
        const nonExistentId = 1;
        const validCountryName = 'Estonia'

        await request(app)
            .put(`/countries/${nonExistentId}`)
            .send({ name: validCountryName })
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });

    it('should delete selected country', async () => {
        const validCountryName = 'Estonia'

        const response = await request(app)
            .post('/countries')
            .send({ name: validCountryName });

        const createdCountry = response.body;

        await request(app)
            .delete(`/countries/${createdCountry.id}`)
            .expect(HTTP_STATUSES.NO_CONTENT_204);

        await request(app)
            .get('/countries')
            .expect(HTTP_STATUSES.OK_200, []);
    });

    it('should return 404 when deleting a non-existent country', async () => {
        const nonExistentId = 1;

        await request(app)
            .delete(`/countries/${nonExistentId}`)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    });
})