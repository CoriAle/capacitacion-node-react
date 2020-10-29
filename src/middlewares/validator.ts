import {Request, Response, NextFunction} from 'express';
import {validationResult} from 'express-validator';
import {handleError, ErrorHandler} from '../error';

const validationHandler = (req: Request, res: Response, next: NextFunction): void =>{
	//Validar errores en el request
	const errors =validationResult(req);
	if(errors.isEmpty()){
		return next(); //No hay errores entonces continuar al controller
	}

	const err = new ErrorHandler(400, 'Invalid field',);
	handleError(err, req, res);

}

export default validationHandler;