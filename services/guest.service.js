"use strict";
const { emailAddress } = require("../config/setting.js");
module.exports = {
	name: "guest",
	settings: {},
	dependencies: [],
	actions: {
		request: {
			rest: "POST /request",
			params: {
				subject: "string",
				name: "string",
				email: "email",
				phone: "string",
				message: "string",
			},
			handler(ctx) {
				const { subject, name, email, phone, message } = ctx.params;
				return ctx
					.call("mail.send", {
						from: email,
						to: emailAddress,
						cc: email,
						subject: subject,
						html: `${subject} from ${name}.<br/>
                            <strong>Phone:</strong> ${phone}.<br/>
                            <strong>Message:</strong> ${message}`,
					})
					.then((res) => {
						return { code: 1 };
					})
					.catch((error) => {
						console.log(error);
						return {
							code: 0,
							mess: "Email can't sent",
						};
					});
			},
		},
	},

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
