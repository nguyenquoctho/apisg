"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
let jwt = require("jsonwebtoken");
const mongoServer = require("../config/setting").mongoServer;
const secretKey = "secret";
module.exports = {
	name: "admin",

	/**
   * Service settings
   */
	settings: {},
	mixins: [DbService],
	adapter: new MongoDBAdapter(mongoServer),
	collection: "admin",
	/**
   * Service dependencies
   */
	dependencies: [],

	/**
   * Actions
   */
	actions: {
		login(ctx) {
			return this.adapter
				.find({ query: { username: ctx.params.username } })
				.then(res => {
					if (ctx.params.password == res[0].password) {
						res[0].password = "";
						let token = jwt.sign(
							{
								exp: Math.floor(Date.now() / 1000) + 60 * 60,
								admin: res[0],
								role: "admin"
							},
							secretKey
						);
						return {
							code: 1,
							mess: "Login success",
							data: { token: token, admin: res[0] }
						};
					} else {
						return {
							code: 0,
							mess: "Password is wrong",
							errorCode: "PASSWORD_WRONG"
						};
					}
				})
				.catch(error => {
					console.log(error);
					return { code: 0, mess: "Username is wrong" };
				});
		}
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
	stopped() {}
};
