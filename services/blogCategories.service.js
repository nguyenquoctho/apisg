"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
const SecretToken = require("../config/setting").SecretToken;
let jwt = require("jsonwebtoken");
module.exports = {
	name: "blogCategories",

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
	collection: "blogCategories",
	/**
   * Actions
   */
	actions: {
		fetch(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}

			return this.adapter
				.find({ query: { companyCode: companyCode } })
				.then(res => {
					return res;
				})
				.catch(err => {
					return { error: err };
				});
		},
		getById(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			return this.adapter
				.find({
					query: { _id: ObjectID(ctx.params.id), companyCode: companyCode }
				})
				.then(res => {
					return res[0];
				})
				.catch(err => {
					return { error: err };
				});
		},
  
		add(ctx) {
			return this.adapter
				.insert(ctx.params)
				.then(res => {
					return { code: 1, mess: "ADD SUCCESS" };
				})
				.catch(error => {
					return { error: 0, mess: "ADD FAILED", error: error };
				});
		},
		update(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), { $set: ctx.params })
				.then(res => {
					return "Update Success";
				})
				.catch(error => {
					console.log(error);
				});
		},
		delete(ctx) {
			return this.adapter.removeById(ObjectID(ctx.params.id), doc => {
				console.log("Removed:", doc);
				return doc && doc._id.toHexString() == ids[1];
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
