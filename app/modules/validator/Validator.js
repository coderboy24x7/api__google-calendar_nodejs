//TODO: This class need refactored
class Validator {
	constructor() {
		const self = this.constructor,
			_this  = this;
	}

	errors() {

	}

	rules() {
		throw new Error('Abstract method');
	}

	messages() {
		throw new Error('Abstract method');
	}

	static make(validationData, rules, messages) {
		const self = this;

		let res;

		self._errors = [];

		rules    = rules || {};
		messages = messages || {};

		for (let ruleKey in rules) {
			if (ruleKey.includes('.')) {
				let attachmentRule = ruleKey.split('.'),
					field = attachmentRule.pop();

				let data;

				for (let i = 0, length = attachmentRule.length; i < length; i++) {
					data = validationData[attachmentRule[i]];
				}

				if (Array.isArray(rules[ruleKey])) {
					for (let key in rules[ruleKey]) {
						if (res = self.validating(data, field, rules[ruleKey][key], messages[ruleKey])) {
							res.field = ruleKey;
							self.errorBuilder(res);
						}
					}
				} else if (typeof rules[ruleKey] === 'string') {
					if (rules[ruleKey].includes('|')) {
						let rulesArray = rules[ruleKey].split('|');

						for (let key in rulesArray) {
							if (res = self.validating(data, field, rulesArray[key], messages[ruleKey])) {
								res.field = ruleKey;
								self.errorBuilder(res);
							}
						}
					} else {
						if (res = self.validating(data, field, rules[ruleKey], messages[ruleKey])) {
							res.field = ruleKey;
							self.errorBuilder(res);
						}
					}
				}
			} else {
				if (Array.isArray(rules[ruleKey])) {
					for (let key in rules[ruleKey]) {
						if (res = self.validating(validationData, ruleKey, rules[ruleKey][key], messages[ruleKey])) {
							self.errorBuilder(res);
						}
					}
				} else if (typeof rules[ruleKey] === 'string') {
					if (rules[ruleKey].includes('|')) {
						let rulesArray = rules[ruleKey].split('|');

						for (let key in rulesArray) {
							if (res = self.validating(validationData, ruleKey, rulesArray[key], messages[ruleKey])) {
								self.errorBuilder(res);
							}
						}
					} else {
						if (res = self.validating(validationData, ruleKey, rules[ruleKey], messages[ruleKey])) {
							self.errorBuilder(res);
						}
					}
				}
			}
		}
	}

	static validating(data, prop, rule, message) {
		let error = false;

		if (rule !== 'required') {
			if (!data || !data[prop]) {
				return error;
			}
		}

		switch (rule) {
			case 'required':
				console.log(data)
				if (!data || !data[prop]) {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'required'
					};
				}

				break;

			case 'string':
				if (typeof data[prop] !== 'string') {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'must be string'
					};
				}
				break;

			case 'function':
				if (typeof data[prop] !== 'function') {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'must be function'
					};
				}
				break;

			case 'array':
				if (!Array.isArray(data[prop])) {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'must be array'
					};
				}
				break;

			case 'object':
				if (typeof data[prop] !== 'object' || Array.isArray(data[prop])) {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'must be object'
					};
				}
				break;

			case 'boolean':
				if (data && typeof data[prop] !== 'boolean') {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'must be boolean'
					};
				}
				break;

			case 'integer':
				if (data && isNaN(data[prop])) {
					error = {
						field: prop,
						message: message ? message: prop + ' ' + 'must be integer'
					};
				}
				break;

		}

		return error;
	}

	static errorBuilder(err) {
		const self = this;

		if (err && (typeof err === 'object' && Object.keys(err).length)) {
			if (self._errors.length) {
				for (let key in self._errors) {
					if (self._errors[key].field === err.field) {
						self._errors[key].messages = [
							self._errors[key].message,
							err.message
						];

						delete self._errors[key].message;

						return;
					}
				}
			}

			return self._errors.push(err);
		}
	}

	static get errors() {
		const self = this;

		if (self._errors.length) {
			return self._errors;
		}
	}
}

module.exports = Validator;