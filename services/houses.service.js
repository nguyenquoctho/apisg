"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const ObjectID = require("mongodb").ObjectID;
const mongoServer = require("../config/setting").mongoServer;
const SecretToken = require("../config/setting").SecretToken;
var jwt = require("jsonwebtoken");
module.exports = {
	name: "houses",
	/**
	 * Service settings
	 */
	settings: {},
	mixins: [DbService],
	adapter: new MongoDBAdapter(mongoServer),
	collection: "houses",
	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		fetchHouses(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			return this.adapter
				.find({
					query: { companyCode: companyCode},
					sort: "-date_post",
				})
				.then(async (res) => {
					const data = await this.transformArrayResponse(res);
					return data;
				})
				.catch((err) => console.log(err));
		},
		fetchClientHouses(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			return this.adapter
				.find({
					query: { companyCode: companyCode,available:"Available" },
					sort: "-date_post",
				})
				.then(async (res) => {
					const data = await this.transformArrayResponse(res);
					return data;
				})
				.catch((err) => console.log(err));
		},
		fetchHouse(ctx) {
			return ctx
				.call("houses.get", { id: ctx.params.id })
				.then((res) => {
					return res;
				})
				.catch((err) => console.log(err));
		},
		getHouseBySlug(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			return this.adapter
				.findOne({ slug: ctx.params.slug, companyCode: companyCode })
				.then(async (res) => {
					const data = await this.transformHouseResponse(res);
					return data;
				})
				.catch((error) => {
					return {
						code: 0,
						mess: "GET_HOUSE_FAIL",
						error: error,
					};
				});
		},
		updateHouse(ctx) {
			return this.adapter
				.updateById(ObjectID(ctx.params.id), { $set: ctx.params })
				.then((res) => {
					return { code: 1, mess: "ADD SUCCESS" };
				})
				.catch((error) => {
					return { code: 0, mess: "ADD FAILED", error: error };
				});
		},
		insertHouse(ctx) {
			return this.adapter
				.insert(ctx.params)
				.then((res) => {
					return { code: 1, mess: "ADD SUCCESS", house: res };
				})
				.catch((error) => {
					return { error: 0, mess: "ADD FAILED", error: error };
				});
		},
		deleteHouse(ctx) {
			console.log("delete", ctx.params.id);

			return this.adapter.removeById(ObjectID(ctx.params.id), (doc) => {
				console.log("Removed:", doc);
				return doc && doc._id.toHexString() == ids[1];
			});
		},
		listCompanyHouses(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			let { query, page, pageSize, sort, search, limit } = ctx.params;
			query = { ...query, companyCode: companyCode };

			return ctx
				.call("houses.list", {
					query: query,
					page: page,
					pageSize,
					sort: sort,
					search: search,
					limit: limit,
				})
				.then(async (res) => {
					const data = {
						...res,
						rows: await this.transformArrayResponse(res.rows),
					};
					return data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		listCompanyClientHouses(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			let { query, page, pageSize, sort, search, limit } = ctx.params;
			query = { ...query, companyCode: companyCode };

			return ctx
				.call("houses.list", {
					query: {...query,available:"Available"},
					page: page,
					pageSize:15,
					sort: sort,
					search: search,
					limit: limit,
				})
				.then(async (res) => {
					const data = {
						...res,
						rows: await this.transformArrayResponse(res.rows),
					};
					return data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		listCompanyRentHouses(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			let { query, page, pageSize, sort, search, limit } = ctx.params;
			query = { ...query, companyCode: companyCode };

			return ctx
				.call("houses.list", {
					query: {...query,available:"Available", typeSale:"Rent"},
					page: page,
					pageSize,
					sort: sort,
					search: search,
					limit: limit,
					
				})
				.then(async (res) => {
					const data = {
						...res,
						rows: await this.transformArrayResponse(res.rows),
					};
					return data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		listCompanySaleHouses(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}
			let { query, page, pageSize, sort, search, limit } = ctx.params;
			query = { ...query, companyCode: companyCode };

			return ctx
				.call("houses.list", {
					query: {...query,available:"Available", typeSale:"Sale"},
					page: page,
					pageSize,
					sort: sort,
					search: search,
					limit: limit,
					
				})
				.then(async (res) => {
					const data = {
						...res,
						rows: await this.transformArrayResponse(res.rows),
					};
					return data;
				})
				.catch((error) => {
					console.log(error);
				});
		},
		loadHousesByQuery(ctx) {
			let companyCode;
			if (ctx.meta.token) {
				companyCode = jwt.verify(ctx.meta.token, SecretToken).user
					.companyCode;
			} else if (ctx.meta.apiKey) {
				companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
			}

			let {
				limit,
				page,
				filter = [],
				sort = "-date_post",
				search,
				price = {},
				devices = [],
			} = ctx.params; // filter is an array of objects
			let queryJson = {};
			let queryFilter = {};
			if (filter != null || filter != undefined)
				filter
					.filter((item) => {
						return item != null;
					})
					.map((ele) => {
						if (
							Object.keys(ele)[0] == "bedroom" ||
							Object.keys(ele)[0] == "bathroom" ||
							Object.keys(ele)[0] == "accommodate"
						) {
							queryFilter[Object.keys(ele)] = parseInt(
								Object.values(ele)[0]
							);
						} else {
							queryFilter[Object.keys(ele)] = new RegExp(
								Object.values(ele),
								"i"
							);
						}
					});
			queryJson = { companyCode: companyCode, ...queryFilter };
			if (Object.keys(price).length == 2) {
				queryJson = {
					...queryJson,
					price: {
						$gt: parseInt(price.min),
						$lt: parseInt(price.max),
					},
				};
			}

			if (devices.length != 0) {
				queryJson = { ...queryJson, devices: { $all: devices } };
			}

			if (search) {
				queryJson["$or"] = [
					{ name: new RegExp(search, "i") },
					{ houseCode: new RegExp(search, "i") },
					{ houseNumber: new RegExp(search, "i") },
					{ available: new RegExp(search, "i") },
					{ district: new RegExp(search, "i") },
					{ city: new RegExp(search, "i") },
					{ searchWord: new RegExp(search, "i") },
					{ keywords: new RegExp(search, "i") },
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
					return res;
				})
				.catch((err) => {
					return { error: err };
				});
		},
		updateManyHouse(ctx) {
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
		async transformResponseData(data) {
			const project = await this.broker.call("projects.get", {
				id: data.projectId,
			});
			let resProject;

			if (project)
				resProject = {
					_id: project._id,
					name: project.name,
					street: project.street,
					ward: project.ward,
					district: project.district,
					city: project.city,
				};
			return {
				...data,
				project: resProject,
			};
		},
		transformArrayResponse(houses) {
			const getHousePromise = houses.map((house) => {
				return this.transformResponseData(house);
			});
			return Promise.all(getHousePromise).then((res) => {
				return res;
			});
		},
		async transformHouseResponseData(houseSlug) {
			let servicesData = await this.broker.call("services.get", {
				id: houseSlug.services,
			});
			let devicesData = await this.broker.call("devices.get", {
				id: houseSlug.devices,
			});
			let projectData = await this.broker.call("projects.get", {
				id: houseSlug.projectId,
			});
			let facilitiesData;
			if (projectData) {
				facilitiesData = await this.broker.call("amenities.get", {
					id: projectData.amenities,
				});
			}

			let facilities;
			let project;
			if (servicesData && devicesData && facilitiesData && projectData) {
				(houseSlug.services = servicesData.filter(
					(item) => item.isShow == "true"
				)),
					(houseSlug.devices = devicesData.filter(
						(item) => item.isShow == "true"
					)),
					(facilities = facilitiesData),
					(project = projectData);
			}
			return { ...houseSlug, facilities, project };
		},

		transformHouseResponse(houseSlug) {
			return this.transformHouseResponseData(houseSlug);
		},

		getValidDocumentForInsert(data) {
			let house = {
				name: data.name,
				houseCode: data.houseCode,
				companyCode: data.companyCode,
				houseNumber: data.houseNumber,
				street: data.street,
				ward: data.ward,
				district: data.district,
				block: data.block,
				type: data.type,
				typeSale: data.typeSale,
				amenities: [],
				facilities: [],
				images: data.images,
				carouselImages: data.carouselImages,
				description: data.description,
				sumary: data.sumary,
				keywords: data.keywords,
				location: data.location,
				price: data.price,
				projectId: ObjectID(data.projectId),
				similarListing: {
					list1: [],
					list2: [],
				},
			};

			data.amenities.map((item, index) => {
				house.amenities.push(ObjectID(item));
			});
			data.facilities.map((item, index) => {
				house.facilities.push(ObjectID(item));
			});
			data.similarListing.list1.map((item, index) => {
				house.similarListing.list1.push(ObjectID(item));
			});
			data.similarListing.list2.map((item, index) => {
				house.similarListing.list2.push(ObjectID(item));
			});
			return house;
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
