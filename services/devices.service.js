"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
module.exports = {
	name: "devices",

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
	collection: "devices",
	actions: {
		fetch() {
			return this.adapter
				.find({ query: { isShow: "true" } })
				.then((res) => {
					return res;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		fetchIsShowClient() {
			return this.adapter
				.find({ query: { isShowClient: "true" } })
				.then((res) => {
					return res;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		getById(ctx) {
			return ctx
				.call("devices.get", { id: ctx.params.id })
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
