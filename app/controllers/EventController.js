const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

const Validator = rootRequire('app/modules/validator/Validator');

class EventController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static index(req, res) {
		const self = EventController;

		let data = req.query, authToken;

		Validator.make(data, {
			'calendarId': 'string',
			'alwaysIncludeEmail': 'boolean',
			'maxAttendees': 'integer',
			'maxResults': 'integer',
			'orderBy': 'string|in:startTime,updated',
			'pageToken': 'string',
			'privateExtendedProperty': 'string',
			'q': 'string',
			'sharedExtendedProperty': 'string',
			'showDeleted': 'boolean',
			'showHiddenInvitations': 'boolean',
			'syncToken': 'string',
			'timeMax': 'date',
			'timeMin': 'date',
			'timeZone': 'string',
			'updatedMin': 'date',
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

				return GoogleCalendarService.getEventList(authToken, data);
			})
			.then((eventList) => {
				res.status(200).send(eventList);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static show(req, res) {
		const self = EventController;

		let data = req.params, authToken;

		Object.assign(data, req.query);

		Validator.make(data, {
			'eventId': 'string|required',
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
				return GoogleCalendarService.getEvent(authToken, data);
			})
			.then((event) => {
				res.status(200).send(event);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static store(req, res) {
		const self = EventController;

		let data = req.body, authToken;

		Validator.make(data, {
			'calendarId': 'string',
			'event'     : 'object|required',
			'event.end' : 'required'
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
				return GoogleCalendarService.addEvent(authToken, data);
			})
			.then((event) => {
				res.status(201).send(event);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static update(req, res) {
		const self = EventController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'event'     : 'object|required',
			'eventId'   : 'string|required'
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
				return GoogleCalendarService.patchEvent(authToken, data);
			})
			.then((event) => {
				res.status(200).send(event);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static destroy(req, res) {
		const self = EventController;

		let data = req.params, authToken;

		Validator.make(data, {
			'calendarId': 'string',
			'eventId'   : 'string|required'
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
				return GoogleCalendarService.destroyEvent(authToken, data);
			})
			.then(() => {
				res.status(204).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static quick(req, res) {
		const self = EventController;

		let data = req.body, authToken;

		Validator.make(data, {
			'calendarId': 'string',
			'text'      : 'string|required'
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
				return GoogleCalendarService.quickAddEvent(authToken, data);
			})
			.then((event) => {
				res.status(201).send(event);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static move(req, res) {
		const self = EventController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'eventId'   : 'string|required',

			'destinationCalendarId': 'string|required'
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
				return GoogleCalendarService.moveEvent(authToken, data);
			})
			.then((event) => {
				res.status(201).send(event);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static watch(req, res) {
		const self = EventController;

		let data = req.query, authToken;

		Validator.make(data, {
			'calendarId': 'string',
			'type': 'string|required',
			'address': 'string|required',
			'params': 'object',
			'params.ttl': 'string|required'
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
				return GoogleCalendarService.watchEventList(authToken, data);
			})
			.then((event) => {
				res.status(201).send(event);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static instance(req, res) {
		const self = EventController;

		let data = req.params, authToken;

		Object.assign(data, req.query);

		Validator.make(data, {
			'calendarId': 'string',
			'eventId'   : 'string|required'
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
				return GoogleCalendarService.getInstances(authToken, data);
			})
			.then((instances) => {
				res.status(200).send(instances);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = EventController;