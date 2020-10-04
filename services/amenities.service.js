"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
module.exports = {
	name: "amenities",

	/**
	 * Service settings
	 */
	settings: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],
	mixins: [DbService],
	adapter: new MongoDBAdapter(mongoServer),
	collection: "amenities",
	/**
	 * Actions
	 */
	actions: {
		fetch() {
			return this.adapter
				.find()
				.then((res) => {
					return res;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		getById(ctx) {
			return ctx
				.call("amenities.get", { id: ctx.params.id })
				.then((res) => {
					return res;
				})
				.catch((err) => {
					console.log(err);
				});
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
