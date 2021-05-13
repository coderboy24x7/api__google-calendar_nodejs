const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

const Validator = rootRequire('app/modules/validator/Validator');

class CalendarAccessControlRuleController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static index(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.query);

		Validator.make(data, {
			'maxResults': 'integer',
			'pageToken': 'string',
			'showDeleted': 'boolean',
			'syncToken': 'string',
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
				return GoogleCalendarService.getCalendarAccessControlList(authToken, data);
			})
			.then((rules) => {
				res.status(200).send(rules);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static show(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.query);

		Validator.make(data, {
			'ruleId': 'string|required'
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
				return GoogleCalendarService.getCalendarAccessControl(authToken, data);
			})
			.then((rule) => {
				res.status(200).send(rule);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static store(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'role': 'string|required:in:none,freeBusyReader,reader,writer,owner',
			'scope': 'object',
			'scope.type': 'string|required|in:default,user,group,domain',
			'scope.value': 'string'
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
				return GoogleCalendarService.addCalendarAccessControl(authToken, data);
			})
			.then((rule) => {
				res.status(201).send(rule);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static update(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'ruleId': 'string|required',
			'role': 'string|required|in:none,freeBusyReader,reader,writer,owner',
			'scope': 'object',
			'scope.type': 'string|required|in:default,user,group,domain',
			'scope.value': 'string'
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
				return GoogleCalendarService.updateCalendarAccessControl(authToken, data);
			})
			.then((rule) => {
				res.status(200).send(rule);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static patch(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'ruleId': 'string|required',
			'role': 'string|required|in:none,freeBusyReader,reader,writer,owner',
			'scope': 'object',
			'scope.type': 'string|in:default,user,group,domain',
			'scope.value': 'string'
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
				return GoogleCalendarService.patchCalendarAccessControl(authToken, data);
			})
			.then((rule) => {
				res.status(200).send(rule);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static destroy(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'ruleId': 'string|required'
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
				return GoogleCalendarService.destroyCalendarAccessControl(authToken, data);
			})
			.then(() => {
				res.status(204).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static watch(req, res) {
		const self = CalendarAccessControlRuleController;

		let data = req.params, authToken;

		Object.assign(data, req.query);

		Validator.make(data, {
			'calendarId': 'string',
			'type': 'string|required',
			'address': 'string|required',
			'params': 'object',
			'params.ttl': 'string'
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
				return GoogleCalendarService.watchCalendarAccessControl(authToken, data);
			})
			.then(() => {
				res.status(200).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = CalendarAccessControlRuleController;