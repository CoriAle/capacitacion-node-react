import request from 'supertest';
import app from '../../src/app';
//import { connect, closeDatabase } from '../../src/repositories/__mocks__/db_handler';

//jest.setTimeout(30000);
let server: any = null;
let agent: any = null;

describe('GET HEALTH', ()=> {
	beforeEach( (done)=>{
		//await connect();
		server = app.listen(3000, () => {
			//if(err) return done(err);
			agent = request.agent(server);
			done();
		}).on('error', (err) => {
	        done(err);
	    });;
	});

	it('Should get health status', async ()=>{
		const resp = await request(app).get('/v1/health');
		expect(resp.status).toEqual(200);
	});
	
	afterEach(
		done => {return server && server.close(done)}
	);
	//afterAll(async () => await closeDatabase());
});