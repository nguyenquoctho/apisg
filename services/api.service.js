"use strict";

const ApiGateway = require("moleculer-web");
const E = require("moleculer-web").Errors;
const Authorization = require("../config/setting").Authorization;
const SecretToken = require("../config/setting").SecretToken;
const ApiKey = require("../config/setting").ApiKey;
const routes = require("../routes/routes").routes;
const fs = require("fs");
const path = require("path");
let jwt = require("jsonwebtoken");

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.13/moleculer-web.html
	settings: {
		port: process.env.PORT || 443,
		cors: {
			// Configures the Access-Control-Allow-Origin CORS header.
			origin: "*",
			// Configures the Access-Control-Allow-Methods CORS header.
			methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
			// Configures the Access-Control-Allow-Headers CORS header.

			// Configures the Access-Control-Expose-Headers CORS header.
			exposedHeaders: [],
			// Configures the Access-Control-Allow-Credentials CORS header.
			credentials: true,
			// Configures the Access-Control-Max-Age CORS header.
			maxAge: 3600,
		},

		// https: {
		// 	key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
		// 	cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem")),
		// },
		routes: routes,

		// Serve assets from "public" folder
		assets: {
			folder: "public",
		},
	},
	methods: {
		authorize(ctx, route, req, res) {
			// Read the token from header
			let auth = req.headers[Authorization];
			let apiKey = req.headers[ApiKey];
			if (auth) {
				console.log("auth");
				let token = req.headers[Authorization];
				let json = jwt.verify(token, SecretToken);
				let now = new Date().getTime() / 1000; // (s)
				if (!json) {
					return Promise.reject(new E.UnAuthorizedError());
				} else {
					if (json.exp < now) {
						return Promise.reject(new E.UnAuthorizedError());
					} else {
						if (json.data && typeof json.data === "string")
							json.data = JSON.parse(json.data);
						let parseJSON = json.data;
						ctx.meta.authToken = parseJSON;
						ctx.meta.token = token;
					}
				}
			} else if (apiKey) {
				ctx.meta.apiKey = apiKey;
			} else {
				// No token
				return Promise.reject(new E.UnAuthorizedError(E.ERR_NO_TOKEN));
			}
		},
	},
};
