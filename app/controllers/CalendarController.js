const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

const Validator = rootRequire('app/modules/validator/Validator');

class CalendarController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static show(req, res) {
		const self = CalendarController;

		let data = req.params, authToken;

		Validator.make(data, {
			'calendarId': 'string'
		});

		if (Validator.errors) {
			return res.status(400).send(Validator.errors);
		}

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.getCalendar(authToken, data);
			})
			.then((calendar) => {
				let htmlLink = 'https://calendar.google.com/calendar/embed';

				htmlLink += '?src=' + calendar.id;
				htmlLink += '&ctz=' + calendar.timeZone;

				calendar.htmlLink = htmlLink;

				res.status(200).send(calendar);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static store(req, res) {
		const self = CalendarController;

		let data = req.body, authToken;

		Validator.make(data, {
			'summary': 'string|required'
		});

		if (Validator.errors) {
			return res.status(400).send(Validator.errors);
		}

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.addCalendar(authToken, data);
			})
			.then((calendar) => {
				res.status(201).send(calendar);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static update(req, res) {
		const self = CalendarController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'summary': 'string|required',
			'description': 'string',
			'timeZone': 'string',

		});

		if (Validator.errors) {
			return res.status(400).send(Validator.errors);
		}

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.updateCalendar(authToken, data);
			})
			.then((calendar) => {
				res.status(200).send(calendar);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static destroy(req, res) {
		const self = CalendarController;

		let data = req.params, authToken;

		Validator.make(data, {
			'calendarId': 'string'
		});

		if (Validator.errors) {
			return res.status(400).send(Validator.errors);
		}

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.destroyCalendar(authToken, data);
			})
			.then(() => {
				res.status(204).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static clear(req, res) {
		const self = CalendarController;

		let data = req.params, authToken;

		Validator.make(data, {
			'calendarId': 'string'
		});

		if (Validator.errors) {
			return res.status(400).send(Validator.errors);
		}

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.clearCalendar(authToken, data);
			})
			.then(() => {
				res.status(204).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = CalendarController;