import request from 'supertest';
import app from '../../src/app';
import { connect, closeDatabase } from '../../src/repositories/__mocks__/db_handler';

jest.setTimeout(30000);
let server: any = null;
let agent: any = null;

describe('AUTH USER, NEW SESSION', ()=> {
	beforeAll(async (done)=>{
		await connect();
		server = app
      .listen(3001, () => {
        agent = request.agent(server);
        done();
      }).on('error', (err) => {
        done(err);
      });
	});

	it('Create a new user correctly', async ()=>{
		const resp = await request(app).post('/v1/user').send({
			name: 'Corina Nimatuj',
			email: 'test@test.com',
			password: '12345678',
		});
		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual('object');
		expect(typeof resp.body.data.token).toEqual('string');
		expect(resp.body.data.token.length).toBeGreaterThanOrEqual(1);
		expect(typeof resp.body.msj).toEqual('string');
		expect(resp.body.msj).toEqual('User Created');
	});
	it('Create a new user same email', async ()=>{
		const resp = await request(app).post('/v1/user').send({
			name: 'Corina Nimatuj',
			email: 'test@test.com',
			password: '12345678',
		});
		expect(resp.status).toEqual(400);
		expect(resp.body.status).toEqual('Error');
		expect(typeof resp.body.message).toEqual('string');
		expect(resp.body.message).toEqual('User already exists');
		expect(resp.body.errors).toBeNull();
	});
	afterAll(async () => await closeDatabase());
});

describe('POST USER, ERROR ON JSON BODY', ()=> {
	beforeAll(async (done)=>{
		await connect();
		server = app
      .listen(3002, () => {
        agent = request.agent(server);
        done();
      }).on('error', (err) => {
        done(err);
      });
	});

	it('Create a new user missing json key ', async ()=>{
		const resp = await request(app).post('/v1/user').send({
			name: 'Corina Nimatuj',
			email: 'test@test.com',
		});
		expect(resp.status).toEqual(400);
		expect(resp.body.status).toEqual('Error');
		expect(typeof resp.body.message).toEqual('string');
		expect(resp.body.message).toEqual('Invalid field');
		expect(resp.body.errors.length).toBeGreaterThan(0);
		expect(resp.body.errors[0].location).toEqual('body');
		expect(resp.body.errors[0].msg).toEqual('Password is required');
	});
	
	afterAll(async () => await closeDatabase());
});