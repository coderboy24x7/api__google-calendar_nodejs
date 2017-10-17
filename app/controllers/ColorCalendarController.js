const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

class ColorCalendarController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static index (req, res) {
		const self = ColorCalendarController;

		let authToken;

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {

				return GoogleCalendarService.getColors(authToken);
			})
			.then((colors) => {
				res.status(200).send(colors);
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = ColorCalendarController;