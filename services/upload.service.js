"use strict";
let multiparty = require("multiparty");
const fs = require("fs-extra");
const path = require("path");

require("firebase/storage");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage({
	projectId: "sgrealty-579ce",
	keyFilename: path.join(__dirname, "../config/sgrealty-579ce.json")
});

const bucket = storage.bucket("sgrealty-579ce.appspot.com");

module.exports = {
	name: "upload",
	settings: {
		timeout: 0
	},
	dependencies: [],
	actions: {
		saveStorage(ctx) {
			const form = new multiparty.Form();
			return new this.Promise((resolve, reject) => {
				form.parse(ctx.meta.req, function(error, fields, files) {
					let type = fields.type ? fields.type[0].toLowerCase() : null;
					let file = files.file ? files.file[0] : null;
					let fileUpload = null;
					let response = { code: null, data: null, error: null, message: null };
					let time= new Date();
					// Select folder to store the image
					if (type == "project") {
						fileUpload = bucket.file("projects/" + time.getTime());
					} else if (type == "house") {
						fileUpload = bucket.file("houses/" + time.getTime());
					} else if (type == "setting") {
						fileUpload = bucket.file("setting/" + time.getTime());
					} else if (type == "blog") {
						fileUpload = bucket.file("blog/" + time.getTime());
					} else {
						reject("Something is wrong! TYPE NULL OR INCORRECT");
					}
					// =======
					if (fileUpload) {
						const buffer = fs.readFileSync(file.path);
						const blobStream = fileUpload.createWriteStream({
							metadata: {
								contentType: file.headers["content-type"]
							}
						});
						blobStream.on("finish", () => {
							// The public URL can be used to directly access the file via HTTP.
							const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;

							// Public url hình ảnh để có thể lấy
							fileUpload.makePublic().then(() => {
								response = { code: 1, data: url, error: null, message: null };
								resolve(url);
							});
						});
						blobStream.on("error", error => {
							response = {
								code: 0,
								data: null,
								error: error,
								message: error.toString()
							};
							console.log(response);
							reject("Something is wrong! Unable to upload at the moment.");
						});
						blobStream.end(buffer);
					}
				});
			});
		},
		deleteImageStorage(ctx) {
			let { imageUrl, type } = ctx.params;
			let index = imageUrl.lastIndexOf("/");
			let imgDelete = imageUrl.slice(index + 1, imageUrl.length);
			let fileDelete = null;
			console.log(imgDelete);
			if (type == "project") {
				fileDelete = bucket.file("projects/" + imgDelete);
			} else if (type == "house") {
				fileDelete = bucket.file("houses/" + imgDelete);
			} else if (type == "setting") {
				fileDelete = bucket.file("setting/" + imgDelete);
			} else if (type == "blog") {
				fileDelete = bucket.file("blog/" + imgDelete);
			} else {
				reject("Something is wrong! TYPE NULL OR INCORRECT");
			}
			if (fileDelete) {
				return fileDelete
					.delete()
					.then(res => {
						console.log("DELETE IMAGE SUCCESS");
						return {
							code: 0,
							message: "DELETE IMAGE SUCCESSS",
							deleteUrl: imageUrl
						};
					})
					.catch(err => {
						console.log({
							code: 0,
							message: "DELETE IMAGE UNSUCCESS",
							error: err
						});
						return { code: 0, message: "DELETE IMAGE UNSUCCESS", error: err };
					});
			} else return { code: 0, message: "File doesn't exist" };
		}
	},

	events: {},

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
