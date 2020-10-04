"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
var jwt = require("jsonwebtoken");
const SecretToken = require("../config/setting").SecretToken;
const bcrypt = require("bcrypt");
module.exports = {
	name: "customers",

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
	collection: "customers",
	/**
	 * Actions
	 */
	actions: {
		fetch(ctx) {
			return this.adapter
				.find({})
				.then((res) => {
					return res;
				})
				.catch((error) => {
					return error;
				});
		},
		getById(ctx) {
			return this.adapter
				.find({ query: { _id: ctx.params.id } })
				.then((res) => {
					return res;
				})
				.catch((error) => console.log(error));
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
					{ username: new RegExp(search, "i") },
					{ email: new RegExp(search, "i") },
					{ phone: new RegExp(search, "i") },
					{ firstName: new RegExp(search, "i") },
					{ lastName: new RegExp(search, "i") },
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
		login(ctx) {
			console.log(ctx.params);
			return this.adapter
				.find({
					query: {
						phone: ctx.params.phone,
						companyCode: ctx.params.companyCode,
					},
				})
				.then((res) => {
					if (
						bcrypt.compareSync(ctx.params.password, res[0].password)
					) {
						if (ctx.params.companyCode == res[0].companyCode) {
							res[0].password = "";
							var token = jwt.sign(
								{
									exp:
										Math.floor(Date.now() / 1000) +
										60 * 60 * 24,
									customer: res[0],
								},
								SecretToken
							);
							return {
								code: 1,
								mess: "Login success",
								data: { token: token, customer: res[0] },
							};
						}
					} else {
						return {
							code: 0,
							mess: "Password is wrong",
							errorCode: "PASSWORD_WRONG",
						};
					}
				})
				.catch((error) => {
					console.log(error);
					return {
						code: 0,
						mess: "Phone number is invalid",
						errorCode: "PHONE_NUMBER_WRONG",
					};
				});
		},
		register(ctx) {
			const saltRounds = 10;
			this.adapter
				.insert({
					...ctx.params,
					password: bcrypt.hashSync(ctx.params.password, saltRounds),
				})
				.then((res) => {
					return {
						code: 1,
						mess: "ADD_SUCCESS",
					};
				})
				.catch((error) => {
					return {
						code: 0,
						mess: "ADD_FAIL",
					};
				});
		},
		update(ctx) {
			console.log(ctx.params);
			return this.adapter
				.updateById(ctx.params.id, {
					$set: ctx.params,
				})
				.then((res) => {
					return {
						code: 1,
						mess: "ADD_SUCCESS",
					};
				})
				.catch((error) => {
					return {
						code: 0,
						mess: "ADD_FAIL",
						error: error,
					};
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
