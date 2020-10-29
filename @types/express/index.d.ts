//d.ts es para definiciones

declare namespace Express {
	interface Request{
		user?:{
			id: any;
		};
	}
}