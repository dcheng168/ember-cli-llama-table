import Em from 'ember';
var computed = Em.computed;
var get = Em.get;
var set = Em.set;
var isBlank = Em.isBlank;

export function defaultValue (watchKey, defValue) {
	return computed(watchKey, {
		set: function (setKey, value) {
			try {
				set(this, watchKey, value);
			} catch (e) {
				// swallow
			}
			return value;
		},
		get: function (value) {
			// getter
			value = get(this, watchKey);
			return isBlank(value) ? defValue : value;
		},
	});
}

export function eq (left, right) {
	return computed(left, right, {
		get: function () {
			return this.get(left) === this.get(right);
		},
	});
}

export function join (watchKey, separator = ',') {
	return computed(watchKey, {
		get: function () {
			var value = Em.makeArray(this.get(watchKey));
			var strings = value.map(String);
			var result = strings.join(separator);
			return result;
		},
	});
}

export function makeArray (watchKey) {
	return computed(watchKey, {
		get: function () {
			return Em.A(this.get(watchKey));
		},
	});
}

export default {
	defaultValue,
	eq,
	join,
	makeArray,
};
