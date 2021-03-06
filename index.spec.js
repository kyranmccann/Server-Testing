const request = require('supertest');

const server = require('./api/server.js');

const db = require('./data/dbConfig.js');

beforeEach(async () => {
  await db('xfiles').truncate();
})


describe('server.js', () => {
  describe('/ route', () => {
    it('should return status code 200', async () => {
      let response = await request(server).get('/');

      expect(response.status).toBe(200);
    });

    it('should return a response in JSON', async () => {
      let response = await request(server).get('/');

      expect(response.type).toBe('application/json');
    });

    it('should return that it is alive', async () => {
      let response = await request(server).get('/');

      expect(response.body).toEqual({ message: 'it\'s ALIVE!' });
    });
  }) //end '/ route' describe
  describe('xfiles routes', () => {
    describe('POST /chars route', () => {
      it('should return a status code of 201', async () => {
        let response = await request(server).post('/chars').send({ name: 'Dana Scully' });

        expect(response.status).toBe(201);
      });

      it('should return the character id and name', async () => {
        let response = await request(server).post('/chars').send({ name: 'Dana Scully' });

        expect(response.body).toEqual({ id: 1, name: 'Dana Scully'});
      });
    }) //end x files post describe

    describe('DELETE chars/:id route', () => {
      it('should return a status code of 200', async () => {
        //add a record to delete
        let add = await request(server).post('/chars').send({ name: 'Dana Scully' });
        //make sure the record was added
        expect(add.body.id).toEqual(1);
        //request to delete the record
        let response = await request(server).delete('/chars/1').send();
        //check status code
        expect(response.status).toBe(200);
      });

      it('should return the number of records deleted', async () => {
        //add a record to delete
        let add = await request(server).post('/chars').send({ name: 'Fox Mulder' });
        //make sure the record was added
        expect(add.body.id).toEqual(1);
        //request to delete the record
        let response = await request(server).delete('/chars/1').send();
        //check content of response
        expect(response.body).toBe(1);
      })
    }) //end delete route describe

    describe('GET /chars route', () => {
      it('should return all characters', async () => {
        await request(server).post('/chars').send({ name: 'Dana Scully' });
        await request(server).post('/chars').send({ name: 'Alex Krychek' });

        let response = await request(server).get('/chars').send();
        expect(response.body).toHaveLength(2); 
      })
    })
  }) //end x files routes describe
}) //end server.js describe
