
import {Request, Response, NextFunction} from 'express';
import {ErrorHandler, handleError} from '../../error';
import jwt from 'jsonwebtoken';
import config from 'config';

const auth_token = (req: Request ,res: Response, next: NextFunction) => {
	const token = String(req.get('x-auth-token'));
	console.log(token);
	if(!token){
		const custom = new ErrorHandler(401, 'No token authorization denied');
		handleError(custom, req, res);
		return;
	}

	try{

		const decoded: any = jwt.decode(token, config.get('jwt_secret'));
		req.user = decoded.user;
		next();
	} catch(err){
		const custom = new ErrorHandler(401, 'Token is not valid');
		handleError(custom, req, res);
		return;
	}
};

export default auth_token;