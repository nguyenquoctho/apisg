/* eslint-disable no-unused-vars */
"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
const SecretToken = require("../config/setting").SecretToken;
let jwt = require("jsonwebtoken");
module.exports = {
	name: "settings",
	settings: {},
	dependencies: [],
	mixins: [DbService],
	adapter: new MongoDBAdapter(mongoServer),
	collection: "settings",
	actions: {
		insertSetting(ctx) {
			let newSetting = {
				companyName: "",
				companyCode: ctx.params.companyCode,
				companyLogo: "",
				slideImages: [],
				hotProject: [],
				companyAddress: "",
				companyEmail: "",
				companyPhone: "",
				companyWebsite: "",
				companyCopyright: "",
				companyWorkTime: "",
				totalProperties: 100,
				totalUser: 100,
				apiKey: "",
				totalHouse: 0,
				preFixHouse: "",
				totalProject: 0,
				preFixProject: "",
				facebook:"",
				instagram:"",
				twitter:"",
				facebookPageId:""
			};
			return this.adapter
				.insert(newSetting)
				// eslint-disable-next-line no-unused-vars
				.then(res => {
					return { code: 1, mess: "Success" };
				})
				.catch(error => {
					return { code: 0, mess: "Error", error: error };
				});
		},
		getSetting(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}

			return this.adapter
				.find({ query: { companyCode: companyCode } })
				.then(res => {
					return res[0];
				})
				.catch(err => {
					return { error: err };
				});
		},
		updateSetting(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), {
					$set: ctx.params
				})
				.then(res => {
					return { code: 1, mess: "Update success" };
				})
				.catch(err => {
					return { code: 0, mess: "Update fail" };
				});
		},
		updateTotalHouse(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), {
					$set: { totalHouse: ctx.params.totalHouse }
				})
				.then(res => {
					return { code: 1, mess: "Update success" };
				})
				.catch(err => {
					return { code: 0, mess: "Update fail" };
				});
		},
		updateTotalProject(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), {
					$set: { totalProject: ctx.params.totalProject }
				})
				.then(res => {
					return { code: 1, mess: "Update success" };
				})
				.catch(err => {
					return { code: 0, mess: "Update fail" };
				});
		},
		generrateApiKey(ctx) {
			let apiKey = jwt.sign(
				{
					companyCode: ctx.params.companyCode
				},
				ctx.params.apiKey
			);
			return apiKey;
		}
	},
	events: {},
	methods: {},
	created() { },
	started() { },
	stopped() { }
};
