const fs = require('fs'),
	TOKEN_DIR = rootFileName('.credentials/'),
	TOKEN_PATH = TOKEN_DIR + 'calendar-nodejs-quickstart.json';
//TODO: This class need refactored
class GoogleCalendar {

	static get fs() {
		return fs;
	}

	static getClientSecret() {
		const self = this;

		return new Promise((resolve, reject) => {
			self.fs.readFile(rootFileName('config/client_secret.json'), function processClientSecrets(err, clientSecretData) {
				if (err) {
					return reject(err);
				}

				resolve(clientSecretData);
			});
		});
	}

	static getToken() {
		const self = this;

		return new Promise((resolve, reject) => {
			self.fs.readFile(TOKEN_PATH, function(err, token) {
				if (err) {
					return reject(self.error('UNAUTHORIZED', 'UNAUTHORIZED'), self);
				}

				resolve(JSON.parse(token));
			});
		});
	}

	static saveToken(token) {
		const self = this;

		return new Promise((resolve, reject) => {
			try {
				self.fs.mkdirSync(TOKEN_DIR);
			} catch (err) {
				// return reject(self.error(err, 'METHOD_FAILED', self));
			}

			self.fs.writeFile(TOKEN_PATH, JSON.stringify(token), function (err) {
				if (err) {
					return reject(self.error(err, 'METHOD_FAILED', self));
				}

				resolve();
			});
		});
	}
}

module.exports = GoogleCalendar;