export function vroomCodesToHttpCodes(code: 0 | 1 | 2 | 3) {
	switch (code) {
		// no error raised
		case 0:
			return 200;
		// internal error
		case 1:
			return 500;
		// input error
		case 2:
			return 400;
		// routing error
		case 3:
			return 500;
		default:
			return 500;
	}
}
