import { Request, Response, Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import User from '../models/user';
import { ErrorHandler, handleError } from '../error';
import auth_token from '../middlewares/auth/auth.midd'
const router = Router();


import bodyValidatior from '../middlewares/validators/auth/auth.validator';
import validationsHandler from '../middlewares/validator';

router.post('/',  bodyValidatior, validationsHandler,
  async (req: Request, res: Response) => {
  //console.log(req.body)
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      const custom = new ErrorHandler(400, 'User already exists');
      handleError(custom, req, res);
    }
    user = new User({
        name,
        email,
        password
    });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.get('jwt_secret'), { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.status(200).json({
        data: { token, user },
        msj: 'User Created',
      });
    });


  } catch (err) {
    //console.log(err);
    const custom = new ErrorHandler(500, 'Server Error');
    handleError(custom, req, res);
  }
});

export default router;