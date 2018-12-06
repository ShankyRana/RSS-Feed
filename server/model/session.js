let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let ObjectId = Schema.ObjectId;
let uuid = require('node-uuid')

let SessionSchema = new Schema({
	user: {
		type: ObjectId,
		ref: 'user',
		index: {
			unique: true
		}
	},
	created: {
		type: Date,
		default: Date.now
	},
	updated: {
		type: Date,
		default: Date.now
	},
	token: {
		type: String,
		default: uuid.v1(),
		index: {
			unique: true
		}
	}
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

SessionSchema.method({

});

/**
 * Statics
 */
SessionSchema.static({

});

/**
 * Register
 */

module.exports = mongoose.model('Session', SessionSchema);
