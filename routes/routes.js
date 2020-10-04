const swaggerSchema = {
	user: {
		type: "object",
		properties: {
			companyCode: {
				type: "string",
			},
			username: {
				type: "string",
			},
			password: {
				type: "string",
			},
		},
	},
	admin: {
		type: "object",
		properties: {
			username: {
				type: "string",
			},
			password: {
				type: "string",
			},
		},
	},
};
const servers = [
	{
		url: "http://localhost:3000/",
		description: "Develop server",
	},
	{
		url: "https://api.saigonrealtyjsc.com",
		description: "Product server",
	},
];
const tags = [
	{
		name: "Public",
		description: "APIs public access",
	},
	{
		name: "Admin",
		description: "APIs for admin",
	},
	{
		name: "Front-end",
		description: "APIs for front-end",
	},
];
const routes = [
	{
		path: "/api/public",
		aliases: {
			// Admin login
			"POST login/admin": {
				swaggerDoc: {
					tags: ["Public"],
					description: "Login to admin page",
					parameters: [
						{
							in: "query",
							name: "username",
							type: "string",
							description: "",
							required: true,
							schema: {},
						},
						{
							in: "query",
							name: "password",
							type: "string",
							description: "",
							required: true,
							schema: {},
						},
					],
				},
				action: "admin.login",
			},
			// update forgot password of company
			"POST company/updatePassword": {
				swaggerDoc: {
					tags: ["Public"],
					description: "Forgot password of company",
					parameters: [
						{
							in: "query",
							name: "password",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
						{
							in: "query",
							name: "confirmPassword",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
						{
							in: "query",
							name: "token",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
					],
				},
				action: "users.updatePassword",
			},
			// forgot password of company
			"POST company/forgot": {
				swaggerDoc: {
					tags: ["Public"],
					description: "Forgot password of company",
					parameters: [
						{
							in: "query",
							name: "companyCode",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
					],
				},
				action: "users.forgotPassword",
			},
			// Login
			"POST login/users": {
				swaggerDoc: {
					tags: ["Public"],
					description: "Login to company page",
					parameters: [
						{
							in: "query",
							name: "username",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
						{
							in: "query",
							name: "password",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "saigonrealty2019",
						},
						{
							in: "query",
							name: "companyCode",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
					],
				},
				action: "users.login",
			},
			// Token
			"POST token/check": {
				swaggerDoc: {
					tags: ["Public"],
					description: "Check the token",
					parameters: [
						{
							in: "query",
							name: "token",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example:
								"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NjI3MzY5MzMsInVzZXIiOnsiX2lkIjoiNWQxZTBjNmFiNjk2ZmQwNzEwMTFhMTgxIiwidXNlcm5hbWUiOiJiYW9weSIsInBhc3N3b3JkIjoiIiwiZmlyc3ROYW1lIjoiTMOqIiwibGFzdE5hbWUiOiJOZ-G7jWMgQuG6o28iLCJlbWFpbCI6ImxlbmdvY2Jhb3ZsdGgxNTEzMDEwQGdtYWlsLmNvbSIsInBob25lIjoiKzg0NzAzNjk2MjU4IiwiYWN0aXZlIjoidHJ1ZSIsImNvbXBhbnlDb2RlIjoiVGhpbmtUb0RvIn0sInJvbGUiOiJjb21wYW55IiwiaWF0IjoxNTYyNzMzMzMzfQ.Y2d_PD9rVu7sRanxpfRZ4RE6jMvCYYkmhsGQwgZNkNY",
						},
					],
				},
				action: "token.check",
			},
			// Generate api key
			"POST apikey": {
				swaggerDoc: {
					description: "Generate API key for front end",
					tags: ["Public"],
					parameters: [
						{
							in: "query",
							name: "companyCode",
							type: "string",
							description: "",
							required: true,
							schema: {},
							example: "thinktodo",
						},
						{
							in: "query",
							name: "apiKey",
							type: "string",
							description: "An optional string to create api key",
							required: true,
							schema: {},
							example: "thinktodo",
						},
					],
				},
				action: "settings.generrateApiKey",
			},
			// Customer
			"POST userCustomer/login": "userCustomers.login",
			"POST userCustomer/register": "userCustomers.register",
			"GET userCustomer/get": "userCustomers.get",
			"POST userCustomer/update": "userCustomers.update",
			"POST customer/register": "customers.register",
			"POST houses/updateMany": "houses.updateManyHouse",
			"POST projects/updateMany": "projects.updateManyProject",
			"POST guest/request": "guest.request",
			"GET blogs/list": "blogs.list",
		},
		bodyParsers: {
			json: true,
			limit: 1024 * 1024 * 1,
			urlencode: {
				extended: true,
			},
		},
	},
	{
		authorization: true,
		path: "/api/auth/company",
		onBeforeCall(ctx, route, req, res) {
			// Set request headers to context meta
			if (
				req.headers["content-type"] &&
				req.headers["content-type"].includes("multipart/form-data")
			) {
				ctx.meta.req = req;
			}
		},
		aliases: {
			//Houses
			"GET houses": {
				swaggerDoc: {
					description: "Load all houses",
					tags: ["Admin"],
					security: [{ Authorization: [] }],
				},
				action: "houses.fetchHouses",
			},
			"GET houses/get": {
				swaggerDoc: {
					description: "Load house by id",
					tags: ["Admin"],
					security: [{ Authorization: [] }],
					parameters: [
						{
							in: "query",
							name: "id",
							type: "string",
							description: "House's Id",
							required: true,
							schema: {},
							example: "5d42b1e4d40fcb2348a36c11",
						},
					],
				},
				action: "houses.fetchHouse",
			},
			
			"POST houses/update": "houses.updateHouse",
			"POST houses/add": "houses.insertHouse",
			"POST houses/delete": "houses.deleteHouse",
			"POST houses/loadHouses": "houses.loadHousesByQuery",
			// Companies
			"POST companies/login": "companies.login",
			// Token
			"POST token/check": "token.check",
			// Projects
			"GET projects": "projects.fetch",
			"GET projects/get": "projects.get",
			"POST projects/add": "projects.add",
			"POST projects/update/:id": "projects.update",
			"POST projects/delete/:id": "projects.delete",
			"POST projects/getByQuery": "projects.getByQuery",
			// Upload
			"POST upload": "upload.saveStorage",
			"POST upload/delete": "upload.deleteImageStorage",
			//Amenities
			"GET amenities": "amenities.fetch",
			"GET amenities/get": "amenities.getById",
			// Devices
			"GET devices": "devices.fetch",
			"GET devices/get": "devices.getById",
			// Services
			"GET services": "services.fetch",
			"GET services/get": "services.getById",
			// Settings
			"GET settings": "settings.getSetting",
			"POST settings/update": "settings.updateSetting",
			"POST settings/updateHouse": "settings.updateTotalHouse",
			"POST settings/updateProject": "settings.updateTotalProject",
			// Blogs
			"GET blogs": "blogs.fetch",
			"GET blogs/get": "blogs.getById",
			"POST blogs/add": "blogs.add",
			"POST blogs/update": "blogs.update",
			"POST blogs/delete": "blogs.delete",
			"GET blogs/getByQuery": "blogs.getByQuery",
			// Blog Categories
			"GET blogCategories": "blogCategories.fetch",
			"GET blogCategories/get": "blogCategories.getById",
			"POST blogCategories/add": "blogCategories.add",
			"POST blogCategories/update": "blogCategories.update",
			"POST blogCategories/delete": "blogCategories.delete",
			// Customer
			"POST customer/register": "customers.register",
			"GET customer/get": "customers.get",
			"POST customer/update": "customers.update",
			"POST customer/getByQuery": "customers.getByQuery",
			// Slug
			"GET slug/check": "slug.checkSlug",
			"POST slug/add": "slug.addSlug",
			"POST slug/delete": "slug.deleteSlugByObjectId",
			"POST slug/update": "slug.updateByObjectId",
		},
		bodyParsers: {
			json: true,
			urlencode: {
				extended: true,
			},
		},
	},
	{
		authorization: true,
		path: "/api/apiKey/company",
		onBeforeCall(ctx, route, req, res) {
			// Set request headers to context meta
			if (
				req.headers["content-type"] &&
				req.headers["content-type"].includes("multipart/form-data")
			) {
				ctx.meta.req = req;
			}
		},
		aliases: {
			//Houses
			"GET houses": {
				swaggerDoc: {
					description: "Load all houses",
					tags: ["Front-end"],
					parameters: [
						{
							in: "header",
							name: "apiKey",
							type: "string",
							description: "",
							required: true,
							schema: {},
						},
					],
				},
				action: "houses.fetchHouses",
			},
			
			"GET houses/get": {
				swaggerDoc: {
					description: "Get house by id",
					tags: ["Front-end"],
					parameters: [
						{
							in: "header",
							name: "apiKey",
							type: "string",
							description: "",
							required: true,
							schema: {},
						},
						{
							in: "query",
							name: "id",
							type: "string",
							description: "",
							required: true,
							schema: {},
						},
					],
				},
				action: "houses.fetchHouse",
			},
			"GET houses/fetchClientHouses": "houses.fetchClientHouses",
			"POST houses/loadHouses": "houses.loadHousesByQuery",
			"POST houses/listCompanyHouses": "houses.listCompanyHouses",
			"POST houses/listCompanyClientHouses": "houses.listCompanyClientHouses",
			"POST houses/listCompanyRentHouses":"houses.listCompanyRentHouses",
			"POST houses/listCompanySaleHouses":"houses.listCompanySaleHouses",
			"GET houses/slug": {
				swaggerDoc: {
					description: "Load house by slug",
					tags: ["Front-end"],
					parameters: [
						{
							in: "header",
							name: "apiKey",
							type: "string",
							description: "",
							required: true,
							schema: {},
						},
						{
							in: "query",
							name: "slug",
							type: "string",
							description: "House's slug",
							required: true,
							schema: {},
						},
					],
				},
				action: "houses.getHouseBySlug",
			},
			// Projects
			"GET projects": "projects.fetch",
			"GET projects/get": "projects.get",
			//Amenities
			"GET amenities": "amenities.fetch",
			"GET amenities/get": "amenities.getById",
			// Devices
			"GET devices": "devices.fetch",
			"GET devices/isShowClient": " devices.fetchIsShowClient",
			"GET devices/get": "devices.getById",
			// Services
			"GET services": "services.fetch",
			"GET services/get": "services.getById",
			// Settings
			"GET settings": "settings.getSetting",
			// Blogs
			"GET blogs": "blogs.fetch",
			"GET blogs/get": "blogs.getById",
			"GET blogs/getByQuery": "blogs.getByQuery",
			// Blog Categories
			"GET blogCategories": "blogCategories.fetch",
			"GET blogCategories/get": "blogCategories.getById",
			// Slug
			"GET slug/data": "slug.loadDataBySlug",
		},
		bodyParsers: {
			json: true,
			urlencode: {
				extended: true,
			},
		},
	},
	{
		authorization: true,
		path: "/api/admin",
		aliases: {
			// Users
			"GET users": "users.fetchUsers",
			"GET users/get": "users.get",
			"GET users/sort": "users.sort",
			"POST users": "users.insertUser",
			"POST users/delete/:id": "users.delete",
			"POST users/resetPassword": "users.resetPassword",
			// Token
			"POST token/check": "token.check",
		},
		bodyParsers: {
			json: true,
			urlencode: {
				extended: true,
			},
		},
	},
];

module.exports = {
	swaggerSchema: swaggerSchema,
	routes: routes,
	tags: tags,
	servers: servers,
};
