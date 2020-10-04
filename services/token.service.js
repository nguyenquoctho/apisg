"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const ObjectID = require("mongodb").ObjectID;
let jwt = require("jsonwebtoken");
const secretKey = "secret";
const mongoServer = require("../config/setting").mongoServer;
module.exports = {
	name: "token",

	/**
   * Service settings
   */
	settings: {},
	mixins: [DbService],
	adapter: new MongoDBAdapter(mongoServer),
	collection: "users",
	/**
   * Service dependencies
   */
	dependencies: [],

	/**
   * Actions
   */
	actions: {
		check(ctx) {
			//   console.log(ctx.params.token);
			let current = this;
			return jwt.verify(ctx.params.token, secretKey, function(err, decoded) {
				if (err) {
					console.log(err);
					return { err };
				} else {
					if (decoded.role == "admin") {
						return current.adapter
							.findById(ObjectID(decoded.admin._id))
							.then(res => {
								return { code: 1, role: "admin", message: "TOKEN_VALID" };
							})
							.catch(err => {
								console.log(err);
								return { code: 0, message: "TOKEN_INVALID" };
							});
					} else if (decoded.role == "company") {
						return current.adapter
							.findById(ObjectID(decoded.user._id))
							.then(res => {
								return { code: 1, role: "company", message: "TOKEN_VALID" };
							})
							.catch(error => {
								console.log(error);
								return { code: 0, message: "TOKEN_INVALID" };
							});
					}
				}
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
