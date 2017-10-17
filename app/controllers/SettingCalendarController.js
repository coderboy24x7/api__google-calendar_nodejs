const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

const Validator = rootRequire('app/modules/validator/Validator');

class SettingCalendarController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static index(req, res) {
		const self = SettingCalendarController;

		let authToken;

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.getSettingList(authToken);
			})
			.then((settings) => {
				res.status(200).send(settings);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static show(req, res) {
		const self = SettingCalendarController;

		let data = req.params, authToken;

		Validator.make(data, {
			'settingId': 'string|required'
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
				return GoogleCalendarService.getSetting(authToken, data);
			})
			.then((setting) => {
				res.status(200).send(setting);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}

	static watch(req, res) {
		const self = SettingCalendarController;

		let data = req.params, authToken;

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.watchSettings(authToken, data);
			})
			.then((settings) => {
				res.status(200).send(settings);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = SettingCalendarController;