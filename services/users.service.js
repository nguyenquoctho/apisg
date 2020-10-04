"use strict";
const DbService = require("moleculer-db");

const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const ObjectID = require("mongodb").ObjectID;
const bcrypt = require("bcrypt");
const MailerService = require("moleculer-mail");
const mongoServer = require("../config/setting").mongoServer;
const systemName = require("../config/setting").systemName;
const SecretToken = require("../config/setting").SecretToken;
const tokenForgot = require("../config/setting").tokenForgot;
const adminSite = require("../config/setting").adminSite;
const jwt = require("jsonwebtoken");

const saltRounds = 10;
/**
 * @swagger
 * schema definition info goes here...
 */
module.exports = {
	name: "users",

	settings: {
		from: "lengocbaovlth1513010@gmail.com",
		transport: {
			service: "SendGrid",
			auth: {
				user: "apikey",
				pass:
					"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",
			},
		},
	},
	mixins: [DbService, MailerService],
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
		updatePassword: {
			params: {
				password: "string",
				confirmPassword: "string",
				token: "string",
			},
			handler(ctx) {
				const { password, confirmPassword, token } = ctx.params;
				if (!token) {
					return {
						code: 0,
						mess: "Token not found",
					};
				}
				if (password !== confirmPassword) {
					return {
						code: 0,
						mess: "Password not match",
					};
				}
				try {
					let decoded = jwt.verify(token, tokenForgot);
					if (!decoded.companyCode) {
						return {
							code: 0,
							mess: "Token not correct",
						};
					}
					return this.adapter
						.find({
							query: { companyCode: decoded.companyCode },
						})
						.then((res) => {
							if (res && res.length) {
								const company = res[0];
								return this.adapter
									.updateById(ObjectID(company._id), {
										$set: {
											password: bcrypt.hashSync(
												password,
												saltRounds
											),
										},
									})
									.then((res) => {
										delete res.password;
										return {
											code: 1,
											data: res,
										};
									})
									.catch((err) => {
										return {
											code: 0,
											err: err,
											mess: err.message,
										};
									});
							} else {
								return {
									code: 0,
									mess: "Company not found",
								};
							}
						})
						.catch((err) => {
							return {
								code: 0,
								err: err,
								mess: err.message,
							};
						});
				} catch (err) {
					return {
						code: 0,
						err: err,
						mess: err.message,
					};
				}
			},
		},
		forgotPassword: {
			params: {
				companyCode: "string",
			},
			handler(ctx) {
				const { companyCode } = ctx.params;
				return this.adapter
					.find({
						query: { companyCode: companyCode },
					})
					.then((res) => {
						if (res && res.length) {
							let company = res[0];
							let token = jwt.sign(
								{ companyCode: companyCode },
								tokenForgot,
								{ expiresIn: 60 * 60 * 60 }
							);
							return ctx
								.call("mail.send", {
									to: company.email,
									// cc: "vocatthu.hcmus@gmail.com",
									bcc: "boss@example.org",
									subject: "Forgot Password",
									html: `Welcome you to ${systemName} !<br/>
                        Please, click this link to update your password<br/>
                        <b>${adminSite}company/updatePassword?token=${token}<br/>
                  `,
								})
								.then((res) => {
									return { code: 1 };
								})
								.catch((error) => {
									console.log(error);
									return {
										code: 0,
										mess: "Email can't sent",
									};
								});
						} else {
							return {
								code: 0,
								mess: "Company not found",
							};
						}
					})
					.catch((err) => {
						console.log(err);
						return {
							code: 0,
							err: err,
							mess: err.message,
						};
					});
			},
		},
		fetchUsers() {
			return this.adapter
				.find()
				.then((res) => {
					return res;
				})
				.catch((err) => console.log(err));
		},
		get(ctx) {
			return this.adapter
				.findById(ObjectID(ctx.params.id))
				.then((res) => {
					return res;
				})
				.catch((err) => console.log(err));
		},
		insertUser(ctx) {
			console.log(ctx.params.password);
			return this.adapter
				.findById(ObjectID(ctx.params.id))
				.then((res) => {
					if (res) {
						// Update user
						return this.adapter
							.updateById(ObjectID(ctx.params.id), {
								$set: {
									username: ctx.params.username,
									firstName: ctx.params.firstName,
									lastName: ctx.params.lastName,
									email: ctx.params.email,
									phone: ctx.params.phone,
									active: ctx.params.active,
									companyCode: ctx.params.companyCode,
								},
							})
							.then((res) => {
								return res;
							})
							.catch((err) => console.log(err));
					} else {
						// New user
						return this.adapter
							.insert({
								username: ctx.params.username,
								password: bcrypt.hashSync(
									ctx.params.password,
									saltRounds
								),
								firstName: ctx.params.firstName,
								lastName: ctx.params.lastName,
								email: ctx.params.email,
								phone: ctx.params.phone,
								active: ctx.params.active,
								companyCode: ctx.params.companyCode,
							})
							.then((res) => {
								return ctx
									.call("mail.send", {
										to: res.email,
										cc: "tvkhanh1994vn@gmail.com",
										bcc: "boss@example.org",
										subject: "Login infomation",
										html: `Welcome you to ${systemName} !<br/>
                        Now, you can login into our system<br/>
                        <b>Company code:</b>${ctx.params.companyCode}<br/>
                        <b>User name:</b>${ctx.params.username}<br/>
                        <b>Password:</b>${ctx.params.password}<br/>
                  `,
									})
									.then((res) => {
										return ctx
											.call("settings.insertSetting", {
												companyCode:
													ctx.params.companyCode,
											})
											.then((res) => {
												return {
													code: 1,
													mess: "email sent",
												};
											});
									})
									.catch((error) => {
										console.log(error);
										return {
											code: 0,
											mess: "Email can't sent",
										};
									});
							})
							.catch((err) => console.log(err));
					}
				})
				.catch((err) => console.log(err));
		},
		delete(ctx) {
			return this.adapter.removeById(ObjectID(ctx.params.id), (doc) => {
				console.log("Removed:", doc);
				// return doc && doc._id.toHexString() == ids[1];
			});
		},
		resetPassword(ctx) {
			// return "Hello Moleculer";
			let newPassword = "saigonrealty2019";
			const saltRounds = 10;
			return this.adapter
				.updateById(ObjectID(ctx.params.id), {
					$set: {
						password: bcrypt.hashSync(newPassword, saltRounds),
					},
				})
				.then((res) => {
					console.log(res);
					return ctx
						.call("mail.send", {
							to: res.email,
							cc: "tvkhanh1994vn@gmail.com",
							subject: "Reset Password",
							text: "Your new password is " + newPassword,
						})
						.then((res) => {
							return { code: 1, mess: "email sent" };
						})
						.catch((error) => {
							console.log(error);
							return { code: 0, mess: "Email can't sent" };
						});
				})
				.catch((error) => console.log(error));
		},
		login(ctx) {
			return this.adapter
				.find({ query: { username: ctx.params.username } })
				.then((res) => {
					if (
						bcrypt.compareSync(ctx.params.password, res[0].password)
					) {
						if (ctx.params.companyCode == res[0].companyCode) {
							res[0].password = "";
							let token = jwt.sign(
								{
									exp:
										Math.floor(Date.now() / 1000) +
										60 * 60 * 24,
									user: res[0],
									role: "company",
								},
								SecretToken
							);
							return {
								code: 1,
								mess: "Login success",
								data: { token: token, user: res[0] },
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
					return { code: 0, mess: "Username is wrong" };
				});
		},
		sort(ctx) {
			if (ctx.params.field == "firstName") {
				if (ctx.params.sort == 1) {
					return this.adapter
						.find({ sort: ["firstName"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ctx.params.sort == -1) {
					return this.adapter
						.find({ sort: ["-firstName"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				}
			} else if (ctx.params.field == "lastName") {
				if (ctx.params.sort == 1) {
					return this.adapter
						.find({ sort: ["lastName"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ctx.params.sort == -1) {
					return this.adapter
						.find({ sort: ["-lastName"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				}
			} else if (ctx.params.field == "companyCode") {
				if (ctx.params.sort == 1) {
					return this.adapter
						.find({ sort: ["companyCode"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ctx.params.sort == -1) {
					return this.adapter
						.find({ sort: ["-companyCode"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				}
			} else if (ctx.params.field == "phone") {
				if (ctx.params.sort == 1) {
					return this.adapter
						.find({ sort: ["phone"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				} else if (ctx.params.sort == -1) {
					return this.adapter
						.find({ sort: ["-phone"] })
						.then((res) => {
							return res;
						})
						.catch((err) => {
							console.log(err);
						});
				}
			}
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
