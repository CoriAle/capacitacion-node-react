
import {Request, Response, Router} from 'express';
import {ErrorHandler, handleError} from '../error';
import auth_token from '../middlewares/auth/auth.midd';
import Contact from '../models/contact';

const router =  Router();

router.get('/', auth_token, async(req: Request, res: Response)=>{
	try {
		const contacts = await Contact.find({user: req.user?.id}).sort({date: -1});
		return res.status(200).json({
			data: contacts,
			msj: 'List of contacts'
		});
	} catch (err) {
    console.log(err);
    const custom = new ErrorHandler(500, 'Server Error');
    handleError(custom, req, res);
  }
});

router.post('/', auth_token, async(req: Request, res: Response)=>{
	try {
		const {
			name,
			email,
			phone,
			type,
		} = req.body;
		//console.log(name);
		const newContact = new Contact({
			name,
			email,
			phone,
			type,
			user: req.user?.id,
		});
		const contact = await newContact.save();
		return res.status(201).json({
			data: contact,
			msj: "Contact created"

		})

	} catch (err) {
    console.log(err);
    const custom = new ErrorHandler(500, 'Server Error');
    handleError(custom, req, res);
  }
});

router.put('/', auth_token, async(req: Request, res: Response)=>{
	try {
		const {
		name,
		email,
		phone,
		type
	} = req.body;
	const contactFields:any = {};
		if(name) contactFields.name = name;
		if(email) contactFields.email = email;
		if(phone) contactFields.phone = phone;
		if(type) contactFields.type = type;

		let contact = await Contact.findById(req.query.id);
		if(!contact) {
			const custom = new ErrorHandler(500, 'Server Error');
    		handleError(custom, req, res);
		}

		// One user only can update his constacts
    if (contact?.user.toString() !== req.user?.id) {
      const custom = new ErrorHandler(401, 'Not Authorized');
      handleError(custom, req, res);
    }
    contact = await Contact.findByIdAndUpdate(
      req.query.id,
      { $set: contactFields },
      { new: true }
    );
    return res.status(200).json({
      data: contact,
      msj: 'Contact updated',
    });
  } catch (error) {
      console.log(error);
    const custom = new ErrorHandler(500, 'Server Error');
    handleError(custom, req, res);
  }
});

router.delete('/:id', auth_token, async (req: Request, res: Response) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      const custom = new ErrorHandler(404, 'Contact not found');
      handleError(custom, req, res);
    }
    // One user only can delete his owns constacts
    if (contact?.user.toString() !== req.user?.id) {
      const custom = new ErrorHandler(401, 'Not Authorized');
      handleError(custom, req, res);
    }
    await Contact.findByIdAndRemove(req.params.id);
    return res.status(200).json({
      data: contact,
      msj: 'Contact Removed',
    });
  } catch (error) {
    const custom = new ErrorHandler(500, 'Server Error');
    handleError(custom, req, res);
  }
});

export default router;