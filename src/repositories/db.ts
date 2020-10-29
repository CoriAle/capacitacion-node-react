import mongoose from 'mongoose';
import config from 'config';
import {data_base} from '../interfaces/data_base';

const data_base: data_base = config.get('data_base');


export default class DB_Connection {
	constructor(){}

	connect_db = async (): Promise<void> => {
		try{

			await mongoose.connect(data_base.mongo_uri, {
				useNewUrlParser: true, //Parse url
				useCreateIndex: true, //Crear indices
				useFindAndModify: true, // Encontrar y modificar
				useUnifiedTopology: true // Monitorieo
			});
			console.log('Mongo Connected');
		}
		catch(err){
			console.log(err);
			process.exit();
		}
	}
}