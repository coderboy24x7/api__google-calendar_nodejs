const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

const Validator = rootRequire('app/modules/validator/Validator');

class CalendarListController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static index(req, res) {
		const self = CalendarListController;

		let data = req.params, authToken;

		Object.assign(data, req.query);

		Validator.make(data, {
			'maxResults': 'integer',
			'minAccessRole': 'string|in:freeBusyReader, owner, reader, writer',
			'pageToken': 'string',
			'showDeleted': 'boolean',
			'showHidden': 'boolean',
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
				return GoogleCalendarService.getCalendarLists(authToken, data);
			})
			.then((calendarLists) => {
				res.status(200).send(calendarLists);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static show(req, res) {
		const self = CalendarListController;

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
				return GoogleCalendarService.getCalendarList(authToken, data);
			})
			.then((calendarList) => {
				let htmlLink = 'https://calendar.google.com/calendar/embed';

				htmlLink += '?src=' + calendarList.id;
				htmlLink += '&ctz=' + calendarList.timeZone;

				calendarList.htmlLink = htmlLink;

				res.status(200).send(calendarList);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static store(req, res) {
		const self = CalendarListController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'id': 'string',
			'colorRgbFormat': 'boolean',
			'defaultReminders': 'array|required',
			'defaultReminders.[].method': 'string|required|in:email,sms,popup',
			'defaultReminders.[].minutes': 'integer|required',
			'notificationSettings': 'object',
			'notificationSettings.notifications': 'array',
			'notificationSettings.notifications.[].method': 'string|required|in:email,sms',
			'notificationSettings.notifications.[].type': 'string|required|in:eventCreation,eventChange,eventCancellation,eventResponse,agenda',
			'backgroundColor': 'string',
			'colorId': 'string',
			'foregroundColor': 'string',
			'summaryOverride': 'string',
			'hidden': 'boolean',
			'selected': 'boolean'
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
				return GoogleCalendarService.addCalendarList(authToken, data);
			})
			.then((calendarList) => {
				res.status(200).send(calendarList);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static update(req, res) {
		const self = CalendarListController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'colorRgbFormat': 'boolean',
			'defaultReminders': 'array|required',
			'defaultReminders.[].method': 'string|required|in:email,sms,popup',
			'defaultReminders.[].minutes': 'integer|required',
			'notificationSettings': 'object',
			'notificationSettings.notifications': 'array',
			'notificationSettings.notifications.[].method': 'string|required|in:email,sms',
			'notificationSettings.notifications.[].type': 'string|required|in:eventCreation,eventChange,eventCancellation,eventResponse,agenda',
			'backgroundColor': 'string',
			'colorId': 'string',
			'foregroundColor': 'string',
			'summaryOverride': 'string',
			'hidden': 'boolean',
			'selected': 'boolean'
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
				return GoogleCalendarService.updateCalendarList(authToken, data);
			})
			.then((calendarList) => {
				res.status(200).send(calendarList);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static patch(req, res) {
		const self = CalendarListController;

		let data = req.params, authToken;

		Object.assign(data, req.body);

		Validator.make(data, {
			'calendarId': 'string',
			'colorRgbFormat': 'boolean',
			'defaultReminders': 'array',
			'defaultReminders.[].method': 'string|required|in:email,sms,popup',
			'defaultReminders.[].minutes': 'integer|required',
			'notificationSettings': 'object',
			'notificationSettings.notifications': 'array',
			'notificationSettings.notifications.[].method': 'string|required|in:email,sms',
			'notificationSettings.notifications.[].type': 'string|required|in:eventCreation,eventChange,eventCancellation,eventResponse,agenda',
			'backgroundColor': 'string',
			'colorId': 'string',
			'foregroundColor': 'string',
			'summaryOverride': 'string',
			'hidden': 'boolean',
			'selected': 'boolean'
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
				return GoogleCalendarService.patchCalendarList(authToken, data);
			})
			.then((calendarList) => {
				res.status(200).send(calendarList);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static destroy(req, res) {
		const self = CalendarListController;

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
				return GoogleCalendarService.destroyCalendarList(authToken, data);
			})
			.then(() => {
				res.status(204).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static watch(req, res) {
		const self = CalendarListController;

		let data = req.params, authToken;

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
				return GoogleCalendarService.watchCalendarList(authToken, data);
			})
			.then((calendarList) => {
				res.status(200).send(calendarList);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = CalendarListController;
