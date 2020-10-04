"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const ObjectID = require("mongodb").ObjectID;
const mongoServer = require("../config/setting").mongoServer;
const bcrypt = require("bcrypt");
module.exports = {
	name: "companies",

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
		login(ctx) {
			return this.adapter
				.find({ query: { username: ctx.params.username } })
				.then(res => {
					bcrypt.compare(ctx.params.password, res[0].password, function(
						err,
						res
					) {
						if (res) {
							console.log("True");
						} else {
							console.log("False");
						}
					});
				})
				.catch(error => console.log(error));
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
