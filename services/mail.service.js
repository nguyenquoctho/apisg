"use strict";
const MailerService = require("moleculer-mail");
const mailSender = require("../config/setting").emailAddress;
module.exports = {
	name: "mail",

	settings: {
		from: mailSender,
		transport: {
			service: "SendGrid",
			auth: {
				user: "apikey",
				pass:
					"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",
			},
		},
	},
	mixins: [MailerService],
	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {},
};
