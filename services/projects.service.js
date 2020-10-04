"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const ObjectID = require("mongodb").ObjectID;
const mongoServer = require("../config/setting").mongoServer;
const SecretToken = require("../config/setting").SecretToken;
let jwt = require("jsonwebtoken");
require("firebase/storage");
module.exports = {
	name: "projects",

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
	collection: "projects",
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
				.catch((error) => {
					console.log(error);
				});
		},
		get(ctx) {
			return this.adapter
				.findById(ObjectID(ctx.params.id))
				.then((res) => {
					return res;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		getByQuery(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			let { limit, page, search, sort } = ctx.params; // filter is an array of objects
			let queryJson = {};
			queryJson = { companyCode: companyCode };
			if (search) {
				queryJson["$or"] = [
					{ projectCode: new RegExp(search, "i") },
					{ name: new RegExp(search, "i") },
					{ district: new RegExp(search, "i") },
				];
			}
			let queryFind = this.adapter.collection.find(queryJson);
			if (limit !== undefined && page !== undefined) {
				let skip = limit * page;
				queryFind = queryFind
					.skip(parseInt(skip))
					.limit(parseInt(limit));
			}
			if (sort) queryFind.sort(sort);
			return queryFind
				.toArray()
				.then((res) => {
					console.log(queryJson);
					return res;
				})
				.catch((err) => {
					return { error: err };
				});
		},
		add(ctx) {
			return this.adapter
				.insert(ctx.params)
				.then((res) => {
					return { code: 1, mess: "Success", project: res };
				})
				.catch((error) => {
					return { code: 0, mess: "Error", error: error };
				});
		},
		update(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), {
					$set: ctx.params,
				})
				.then((res) => {
					return { code: 1, mess: "Success" };
				})
				.catch((error) => {
					return { code: 0, mess: "Error", error: error };
				});
		},
		delete(ctx) {
			return this.adapter.removeById(ObjectID(ctx.params.id), (doc) => {
				console.log("Removed:", doc);
				return doc && doc._id.toHexString() == ids[1];
			});
		},
		updateManyProject(ctx) {
			return this.adapter
				.updateMany(
					{ companyCode: ctx.params.companyCode },
					{ $set: { slug: "-" } }
				)
				.then((res) => {
					return res;
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
	methods: {
		getCorrectFileName(filename) {
			if (filename) {
				// replace unsafe characters
				return filename.replace(
					/[\s*/:;&?@$()<>#%\{\}|\\\^\~\[\]]/g,
					"-"
				);
			} else {
				return filename;
			}
		},
	},

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
