import request from 'supertest';
import app from '../../src/app';
import { connect, closeDatabase } from '../../src/repositories/__mocks__/db_handler';
// import auth_token from '../../src/middlewares/auth/__mocks__/auth.middle';
// jest.mock('../../src/middlewares/auth/auth.middle.ts');
jest.setTimeout(30000);
let server: any = null;
let agent: any = null;

describe('CONTACT CONTROLLER, CRUD CORRRECT FLOW', ()=> {
	beforeAll(async (done)=>{
		await connect();
		server = app
      .listen(3008, () => {
        agent = request.agent(server);
        done();
      }).on('error', (err) => {
        done(err);
      });
	});

  let token = '';
	it('Create a new user correctly', async ()=>{
		const resp = await request(app).post('/v1/user').send({
			name: 'Corina Nimatuj',
			email: 'test@test.com',
			password: '12345678',
		});
		expect(resp.status).toEqual(200);
		token = resp.body.data.token;
	});

	let contact_id = '';
	it('Create a new contact correctly', async ()=>{
		const resp = await request(app).post('/v1/contact').send({
			name: 'Corina Nimatuj',
			email: 'test@test.com',
			phone: '1234567',
			password: '12345678',
		})
		.set({'x-auth-token': token});
		expect(resp.status).toEqual(201);
		expect(typeof resp.body.data).toEqual('object');
		expect(typeof resp.body.msj).toEqual('string');
		expect(resp.body.msj).toEqual('Contact created');
		contact_id = resp.body.data._id;

	});
	it('Create a new contact with error', async ()=>{
		const resp = await request(app).post('/v1/contact').send({
			email: 'test@test.com',
			password: '12345678',
		})
		.set({'x-auth-token': token});
		expect(resp.status).toEqual(500);

	});
	it('Update contact correctly', async ()=>{
		const resp = await request(app)
		.put('/v1/contact').send({
			name: 'Corina Nimatuj',
			email: 'testupdate@test.com',
			password: '12345678',
		})
		.set({'x-auth-token': token})
		.query({id: contact_id});
		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual('object');
		expect(typeof resp.body.msj).toEqual('string');
		expect(resp.body.msj).toEqual('Contact updated');
	});
	it('Get contact list correctly', async ()=>{
		const resp = await request(app)
		.get('/v1/contact')
		.set({'x-auth-token': token});
		expect(resp.status).toEqual(200);
		expect(typeof resp.body.data).toEqual('object');
		expect(resp.body.data.length).toBeGreaterThanOrEqual(1);

		expect(typeof resp.body.msj).toEqual('string');
		expect(resp.body.msj).toEqual('List of contacts');
	});
	it('Delete contact correctly', async ()=>{
	const resp = await request(app)
	.delete(`/v1/contact/${contact_id}`)
	.set({'x-auth-token': token});
	expect(resp.status).toEqual(200);
	expect(typeof resp.body.data).toEqual('object');
	expect(resp.body.data._id).toEqual(contact_id);

	expect(typeof resp.body.msj).toEqual('string');
	expect(resp.body.msj).toEqual('Contact Removed');
});

	afterAll(async () => await closeDatabase());
}); 