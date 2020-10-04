"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
const SecretToken = require("../config/setting").SecretToken;
let jwt = require("jsonwebtoken");
module.exports = {
	name: "blogs",

	/**
	 * Service settings
	 */
	settings: {},
	dependencies: [],
	mixins: [DbService],
	adapter: new MongoDBAdapter(mongoServer),
	collection: "blogs",
	/**
	 * Actions
	 */
	actions: {
		fetch(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			return this.adapter
				.find({ query: { companyCode: companyCode } })
				.then((res) => {
					return res;
				})
				.catch((err) => {
					return { error: err };
				});
		},
		getById(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			return this.adapter
				.find({
					query: {
						_id: ObjectID(ctx.params.id),
						companyCode: companyCode,
					},
				})
				.then((res) => {
					return res[0];
				})
				.catch((err) => {
					return { error: err };
				});
		},
		getByQuery: {
			handler(ctx) {
				let {
					query = {},
					sort = "-date_post",
					page,
					pageSize,
					limit,
				} = ctx.params;
				let companyCode;
				if (ctx.meta.token) {
					companyCode = jwt.verify(ctx.meta.token, SecretToken).user
						.companyCode;
				} else if (ctx.meta.apiKey) {
					companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
				}
				query = JSON.parse(query);
				console.log({
					query: { ...query, companyCode: companyCode },
					page: page,
					pageSize: pageSize,
					limit: limit,
					sort: sort,
				});
				return ctx
					.call("blogs.list", {
						query: { ...query, companyCode: companyCode },
						page: page,
						pageSize: pageSize,
						limit: limit,
						sort: sort,
					})
					.then((res) => {
						return {
							code: 1,
							data: res,
						};
					})
					.catch((error) => {
						console.log(error);
						return { code: 0, error: error };
					});
			},
		},
		add(ctx) {
			return this.adapter
				.insert(ctx.params)
				.then((res) => {
					return { code: 1, mess: "ADD SUCCESS" };
				})
				.catch((error) => {
					return { error: 0, mess: "ADD FAILED", error: error };
				});
		},
		update(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), { $set: ctx.params })
				.then((res) => {
					return {
						code: 1,
						mess: "Update Success",
					};
				})
				.catch((error) => {
					console.log(error);
					return {
						code: 0,
						mess: "Update Failed",
						error: error,
					};
				});
		},
		delete(ctx) {
			return this.adapter.removeById(ObjectID(ctx.params.id), (doc) => {
				console.log("Removed:", doc);
				return doc && doc._id.toHexString() == ids[1];
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
