/*
 |--------------------------------------------------------------------------|
 |	Quickstart                                                              |
 |--------------------------------------------------------------------------|
 | Complete the steps described in the rest of this page, and in about five |
 | minutes you'll have a simple Node.js command-line application that makes |
 | requests to the Google Calendar API.                                     |
 |--------------------------------------------------------------------------|
 | Node.js Quickstart:                                                      |
 |    https://developers.google.com/google-apps/calendar/quickstart/nodejs  |
 |--------------------------------------------------------------------------|
 */

const fs = require('fs'),
    google = require('googleapis'),
	calendar = google.calendar('v3'),
    googleAuth = require('google-auth-library'),
    SCOPES = ['https://www.googleapis.com/auth/calendar'];

class GoogleCalendar {
	static get googleAuth() {
		return googleAuth;
	}

	static get calendar() {
		return calendar;
	}

	static get google() {
		return google;
	}

	static dataBuilder(data, assignParams) {
		const self = this.constructor,
			_this  = this;

		let result = {};

		for (let key in data) {
			if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
				result[key] = self.dataBuilder(data[key]);
			}

			if (data[key]) {
				result[key] = data[key];
			}
		}

		if (assignParams && Object.keys(assignParams).length) {
			Object.assign(result, assignParams);
		}

		return result;
	}

	constructor(clientSecret) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client = new (new self.googleAuth()).OAuth2(clientSecret.installed.client_id, clientSecret.installed.client_secret, clientSecret.installed.redirect_uris[0]);
	}

	/*
	 |------------------------------------------------------------|
	 | Methods for Authorization google api console               |
	 |------------------------------------------------------------|
	 | The following describes methods for passage                |
	 | authorization in the Google api                            |
	 |------------------------------------------------------------|
	 | Authorizing Requests to the Google Calendar API:           |
	 |    https://developers.google.com/google-apps/calendar/auth |
	 |------------------------------------------------------------|
	 */

	/**
	 *
	 * @returns {string|*}
	 * Description: This method enable get authorization url
	 */
	getAuthUrl() {
		const self = this.constructor,
			_this  = this;

		return _this.oauth2Client.generateAuthUrl({
			access_type: 'offline',
			scope: SCOPES
		});
	}

	/**
	 *
	 * @param authToken
	 * @returns {Promise}
	 * Description: This method enable get oAuth 2.0 data
	 * Parameters: {authToken: string|required}
	 */
	getToken(authToken) {
		const self = this.constructor,
			_this  = this;

		return new Promise((resolve, reject) => {
			_this.oauth2Client.getToken(authToken, function(err, token) {
				if (err) {
					return reject(err);
				}

				resolve(token);
			});
		});
	}

	// authorize(auth) {
	// 	const self = this.constructor,
	// 		_this  = this;
	//
	// 	_this.oauth2Client.credentials = auth;
	//
	// 	return true;
	//
	// }

	// refreshToken() {
	// 	const self = this.constructor,
	// 		_this  = this;
	//
	// 	return new Promise((resolve, reject) => {
	// 		_this.oauth2Client.getRequestMetadata(_this.getAuthUrl(),function(err, tokens) {
	// 			if (err) {
	// 				return reject(err)
	// 			}
	//
	// 			if (tokens.Authorization) {
	// 				return resolve();
	// 			}
	//
	// 			_this.saveToken(tokens)
	// 				.then(resolve)
	// 				.catch(reject);
	//
	// 		});
	// 	});
	// }

	/*
	 |-------------------------------------------------------------------------------------|
	 | Methods for access control calendar                                                 |
	 |-------------------------------------------------------------------------------------|
	 | The following describes the methods for working with access control rule calendar.  |
	 |-------------------------------------------------------------------------------------|
	 | https://developers.google.com/google-apps/calendar/v3/reference/acl                 |
	 |-------------------------------------------------------------------------------------|
	 */

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable delete access control rule in calendar
	 * Parameters: {
	 *     data.calendarId: string,
	 *     data.ruleId: string|required
	 * }
	 */
	destroyCalendarAccessControl(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.acl.delete({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				ruleId: data.ruleId
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get calendar access control rule
	 * Parameters: {
	 *     data.calendarId: string,
	 *     data.ruleId: string|required
	 * }
	 */
	getCalendarAccessControl(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.acl.get({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				ruleId: data.ruleId
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable add calendar access control rule
	 * Parameters: {
	 *     data.calendarId: string,
	 *     data.role: string|required,
	 *     data.scope: object,
	 *     data.scope.type: string|required (default, user, group, domain),
	 *     data.scope.value: string (default)
	 * }
	 */
	addCalendarAccessControl(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.acl.insert({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get calendar access control rule list
	 * Parameters: {
	 *     data.calendarId: string,
	 *     data.maxResults: integer,
	 *     data.pageToken: string,
	 *     data.showDeleted: boolean,
	 *     data.syncToken: string
	 * }
	 */
	getCalendarAccessControlList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		data = self.dataBuilder(data, {
			auth: _this.oauth2Client,
			calendarId: data.calendarId || 'primary',
		});

		return new Promise((resolve, reject) => {
			self.calendar.acl.list(data, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response.items);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable update calendar access control rule
	 * Parameters: {
	 *     data.calendarId: string,
	 *     data.ruleId: string|required,
	 *     data.rule.role: string,
	 *     data.rule.scope: object,
	 *     data.rule.scope.type: string (default, user, group, domain),
	 *     data.rule.scope.value: string (default)
	 * }
	 */
	patchCalendarAccessControl(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.acl.patch({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				ruleId: data.ruleId,
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable update calendar access control rule
	 * Parameters: {
	 *     data.calendarId: string,
	 *     data.ruleId: string|required,
	 *     data.role: string|required,
	 *     data.scope: object,
	 *     data.scope.type: string (default, user, group, domain),
	 *     data.scope.value: string (default)
	 * }
	 */
	updateCalendarAccessControl(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.acl.update({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				ruleId: data.ruleId,
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable watch calendar
	 * Parameters: {
	 *      data.calendarId: string,
	 *      data.type:string|required,
	 *      data:address: string|required,
	 *      data.params.ttl:string|default=3600
	 * }
	 * Warning: This method is web-hook
	 */
	watchCalendarAccessControl(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.acl.watch({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/*
	 |-------------------------------------------------------------------------------------|
	 | Methods for Calendar list                                                           |
	 |-------------------------------------------------------------------------------------|
	 | The following describes the methods for working with calendar list.                 |
	 |-------------------------------------------------------------------------------------|
	 | https://developers.google.com/google-apps/calendar/v3/reference/calendarList        |
	 |-------------------------------------------------------------------------------------|
	 */

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable delete calendar list
	 * Parameters: {data.calendarId: string}
	 */
	destroyCalendarList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.delete({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary'
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get single calendar list
	 * Parameters: {data.calendarId: string}
	 */
	getCalendarList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.get({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary'
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable add calendar list
	 * Parameters: {
	 *      data.id: string|required,
	 *      data.defaultReminders: array|required,
	 *      data.defaultReminders[].method: string|required|in:email,sms,popup,
	 *      data.defaultReminders[].minutes: integer|required,
	 *      data.notificationSettings: object,
	 *      data.notificationSettings.notifications: array,
	 *      data.notificationSettings.notifications[].method: string|required|in:email,sms,
	 *      data.notificationSettings.notifications[].type: string|required|in:eventCreation,eventChange,eventCancellation,eventResponse,agenda,
	 *      data.backgroundColor: string,
	 *      data.colorId: string,
	 *      data.foregroundColor: string,
	 *      data.hidden: boolean,
	 *      data.selected: boolean,
	 *      data.summaryOverride: string
	 * }
	 */
	addCalendarList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.insert({
				auth: _this.oauth2Client,
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get calendar access control rule list
	 * Parameters: {
	 *     data.maxResults: integer,
	 *     data.minAccessRole: string,
	 *     data.pageToken: string,
	 *     data.showDeleted: boolean,
	 *     data.showHidden: boolean,
	 *     data.syncToken: string
	 * }
	 */
	getCalendarLists(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		data = self.dataBuilder(data, {
			auth: _this.oauth2Client
		});

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.list(data, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response.items);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable delete calendar
	 * Parameters: {
	 *      data.calendarId: string,
	 *      data.calendarList: required|object
	 * }
	 */
	patchCalendarList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.patch({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data
			}, function(err, calendar) {
				if (err) {
					return reject(err);
				}

				resolve(calendar);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable update calendar list
	 * Parameters: {
	 *      data.calendarId: string,
	 *      data.defaultReminders: array|required,
	 *      data.defaultReminders[].method: string|required|in:email,sms,popup,
	 *      data.defaultReminders[].minutes: integer|required,
	 *      data.notificationSettings: object,
	 *      data.notificationSettings.notifications: array,
	 *      data.notificationSettings.notifications[].method: string|required|in:email,sms,
	 *      data.notificationSettings.notifications[].type: string|required|in:eventCreation,eventChange,eventCancellation,eventResponse,agenda,
	 *      data.backgroundColor: string,
	 *      data.colorId: string,
	 *      data.foregroundColor: string,
	 *      data.hidden: boolean,
	 *      data.selected: boolean,
	 *      data.summaryOverride: string
	 * }
	 */
	updateCalendarList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.update({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable watch calendar list
	 * Parameters: {
	 *      data.type:string|required,
	 *      data:address: string|required,
	 *      data.params.ttl:string|default=3600
	 * }
	 * Warning: This method is web-hook
	 */
	watchCalendarList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendarList.watch({
				auth: _this.oauth2Client,
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/*
	 |-------------------------------------------------------------------------------------|
	 | Methods for calendars                                                               |
	 |-------------------------------------------------------------------------------------|
	 | The following describes the methods for working with calendar.                      |
	 |-------------------------------------------------------------------------------------|
	 | https://developers.google.com/google-apps/calendar/v3/reference/calendars           |
	 |-------------------------------------------------------------------------------------|
	 */

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get single calendar
	 * Parameters: {data.calendarId: string}
	 */
	getCalendar(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendars.get({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary'
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable clear calendar
	 * Parameters: {data.calendarId: string}
	 */
	clearCalendar(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendars.clear({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary'
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable delete calendar
	 * Parameters: {data.calendarId: string}
	 */
	destroyCalendar(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendars.delete({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary'
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable add calendar
	 * Parameters: {data.summary: string|required}
	 */
	addCalendar(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendars.insert({
				auth: _this.oauth2Client,
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable update calendar
	 * Parameters: {
	 *      data.calendarId: string,
	 *      data.description: string,
	 *      data.location: string,
	 *      data.summary: string|required,
	 *      data.timeZone: date
	 * }
	 */
	patchCalendar(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendars.patch({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data
			}, function(err, calendar) {
				if (err) {
					return reject(err);
				}

				resolve(calendar);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable update calendar
	 * Parameters: {
	 *   data.calendarId: string,
	 *   data.description: string,
	 *   data.location: string,
	 *   data.summary: string|required,
	 *   data.timeZone: string
	 * }
	 */
	updateCalendar(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.calendars.update({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/*
	 |-------------------------------------------------------------------------------------|
	 | Methods for channels                                                                |
	 |-------------------------------------------------------------------------------------|
	 | The following describes the methods for working with channels.                      |
	 |-------------------------------------------------------------------------------------|
	 | https://developers.google.com/google-apps/calendar/v3/reference/channels            |
	 |-------------------------------------------------------------------------------------|
	 */

	stopChannels(auth) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.channels.stop({
				auth: _this.oauth2Client
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/*
	 |-------------------------------------------------------------------------------------|
	 | Methods for colors calendar                                                         |
	 |-------------------------------------------------------------------------------------|
	 | The following describes the methods for working with colors calendar.               |
	 |-------------------------------------------------------------------------------------|
	 | https://developers.google.com/google-apps/calendar/v3/reference/colors              |
	 |-------------------------------------------------------------------------------------|
	 */

	/**
	 * @param auth
	 * @returns {Promise}
	 * Description: This method enable get calendar colors
	 * Parameters: {}
	 */
	getColors(auth) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.colors.get({
				auth: _this.oauth2Client,
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/*|-------------------------------------------------------------------------------------|
	  | Methods for Events                                                                  |
	  |-------------------------------------------------------------------------------------|
	  | The following describes the methods for working with events on the calendar.        |
	  |-------------------------------------------------------------------------------------|
	  | Events resource:                                                                    |
	  |     https://developers.google.com/google-apps/calendar/v3/reference/events#resource |
	  |-------------------------------------------------------------------------------------|
	 */

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get single event
	 * Parameters: {
	 *      data.eventId: string|required,
	 *      data.calendarId: string
	 * }
	 */
	getEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.get({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				eventId: data.eventId
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	importEvent(auth, data) {

	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get event list
	 * Parameters: {
	 *      data.maxResults: integer,
	 *      data.calendarId: string,
	 *      data.orderBy: string
	 * }
	 */
	getEventList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		data = self.dataBuilder(data, {
			auth: _this.oauth2Client,
			calendarId: data.calendarId || 'primary',
		});

		return new Promise((resolve, reject) => {
			self.calendar.events.list(data, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response.items);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable add event
	 * Parameters: {
	 *      data.event: object|required,
	 *      data.calendarId: string
	 * }
	 */
	addEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.insert({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				resource: data.event,
			}, function(err, event) {
				if (err) {
					return reject(err);
				}

				resolve(event);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable quick add event
	 * Parameters: {
	 *      data.text: string|required,
	 *      data.calendarId: string
	 * }
	 */
	quickAddEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.quickAdd({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				text: data.text,
			}, function(err, event) {
				if (err) {
					return reject(err);
				}

				resolve(event);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable destroy event
	 * Parameters: {
	 *      data.eventId: string|required,
	  *     data.calendarId: string
	 * }
	 */
	destroyEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.delete({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				eventId: data.eventId,
			}, function(err) {
				if (err) {
					return reject(err);
				}

				resolve();
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable quick update event. It does not need all the fields that require google api calendar
	 * Parameters: {
	 *      data.eventId: string|required,
	 *      data.calendarId: string,
	 *      data.event: object|required
	 * }
	 */
	patchEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.patch({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				eventId: data.eventId,
				resource: data.event
			}, function(err, event) {
				if (err) {
					return reject(err);
				}

				resolve(event);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable quick update event
	 * Parameters: {
	 *      data.eventId: string|required,
	 *      data.calendarId: string,
	 *      data.event: object|required,
	 *      data.event.attachments[].fileUrl: string|required,
	 *      data.event.attendees[].email: string|required,
	 *      data.event.end: object|required,
	 *      data.event.start: object|required,
	 *      data.event.reminders.overrides[].method: string|required,
	 *      data.event.reminders.overrides[].minutes: string|required
	 * }
	 */
	updateEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.update({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				eventId: data.eventId,
				resource: data.event
			}, function(err, event) {
				if (err) {
					return reject(err);
				}

				resolve(event);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable move event at other calendar
	 * Parameters: {
	 *      data.eventId: string|required,
	 *      data.calendarId: string,
	 *      data.destinationCalendarId: string|required
	 * }
	 */
	moveEvent(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.move({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				eventId: data.eventId,
				destination: data.destinationCalendarId
			}, function(err, event) {
				if (err) {
					return reject(err);
				}

				resolve(event);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable watch event list
	 * Parameters: {
	 *      data.type:string|required,
	 *      data:address: string|required,
	 *      data.params.ttl:string|default=3600
	 * }
	 * Warning: This method is web-hook
	 */
	watchEventList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.watch({
				auth: _this.oauth2Client,
				resource: data
			}, function(err, event) {
				if (err) {
					return reject(err);
				}

				resolve(event);
			});
		});
	}

	/**
	 *
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get instance events
	 * Parameters: {data.eventId: string|required}
	 * Info: not content
	 */
	getInstances(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.events.instances({
				auth: _this.oauth2Client,
				calendarId: data.calendarId || 'primary',
				eventId: data.eventId
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response.items);
			});
		});
	}

	/*
	 |-------------------------------------------------------------------------------------|
	 | Methods for settings calendar                                                       |
	 |-------------------------------------------------------------------------------------|
	 | The following describes the methods for working with settings calendar.             |
	 |-------------------------------------------------------------------------------------|
	 | https://developers.google.com/google-apps/calendar/v3/reference/settings            |
	 |-------------------------------------------------------------------------------------|
	 */

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable get calendar setting
	 * Parameters: {data.settingId: string|required}
	 */
	getSetting(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.settings.get({
				auth: _this.oauth2Client,
				setting: data.settingId
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response);
			});
		});
	}

	/**
	 * @param auth
	 * @returns {Promise}
	 * Description: This method enable get calendar setting list
	 * Parameters: {
	 *     data.maxResults: integer,
	 *     data.pageToken: string,
	 *     data.syncToken: string
	 * }
	 */
	getSettingList(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		data = self.dataBuilder(data, {auth: _this.oauth2Client});

		return new Promise((resolve, reject) => {
			self.calendar.settings.list(data, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response.items);
			});
		});
	}

	/**
	 * @param auth
	 * @param data
	 * @returns {Promise}
	 * Description: This method enable watch calendar settings
	 * Parameters: {
	 *      data.type:string|required,
	 *      data:address: string|required,
	 *      data.params.ttl:string|default=3600
	 * }
	 * Warning: This method is web-hook
	 */
	watchSettings(auth, data) {
		const self = this.constructor,
			_this  = this;

		_this.oauth2Client.credentials = auth;

		return new Promise((resolve, reject) => {
			self.calendar.settings.watch({
				auth: _this.oauth2Client,
				resource: data
			}, function(err, response) {
				if (err) {
					return reject(err);
				}

				resolve(response.items);
			});
		});
	}
}

module.exports = GoogleCalendar;