const GoogleCalendarModel = rootRequire('app/models/GoogleCalendar'),
	GoogleCalendarService = rootRequire('app/services/GoogleCalendar');

class ChannelsController {
	static GoogleCalendarService() {
		return GoogleCalendarModel.getClientSecret()
			.then(clientSecret => {
				return new GoogleCalendarService(JSON.parse(clientSecret));
			});
	}

	static stop(req, res) {
		const self = ChannelsController;

		let authToken;

		return GoogleCalendarModel.getToken()
			.then(token => {
				authToken = token;

				return self.GoogleCalendarService();
			})
			.then(GoogleCalendarService => {
				return GoogleCalendarService.stopChannels(authToken);
			})
			.then(() => {
				res.status(204).send();
			})
			.catch(err => {
				res.status(err.code? err.code: 500).send(err.message);
			});
	}
}

module.exports = ChannelsController;