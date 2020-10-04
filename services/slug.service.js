"use strict";
const DbService = require("moleculer-db");
const MongoDBAdapter = require("moleculer-db-adapter-mongo");
const mongoServer = require("../config/setting").mongoServer;
const ObjectID = require("mongodb").ObjectID;
const SecretToken = require("../config/setting").SecretToken;
var jwt = require("jsonwebtoken");
module.exports = {
  name: "slug",
  settings: {},
  dependencies: [],
  mixins: [DbService],
  adapter: new MongoDBAdapter(mongoServer),
  collection: "slug",
  actions: {
    fetch() {
      return this.adapter
        .find()
        .then(res => {
          return res;
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkSlug(ctx) {
      let companyCode;
      if (ctx.meta.token) {
        companyCode = jwt.verify(ctx.meta.token, SecretToken).user.companyCode;
      } else if (ctx.meta.apiKey) {
        companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
      }
      return this.adapter
        .find({ query: { key: ctx.params.slug, companyCode: companyCode } })
        .then(res => {
          if (res.length > 0) {
            return {
              code: 1,
              mess: "slug exist"
            };
          } else {
            return {
              code: 0,
              mess: "slug no found"
            };
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addSlug(ctx) {
      let companyCode;
      if (ctx.meta.token) {
        companyCode = jwt.verify(ctx.meta.token, SecretToken).user.companyCode;
      } else if (ctx.meta.apiKey) {
        companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
      }
      return this.adapter
        .insert({ ...ctx.params, companyCode: companyCode })
        .then(res => {
          return { code: 1, mess: "ADD_SUCCESS" };
        })
        .catch(error => {
          return { code: 0, mess: "ADD_FAIL", error: error };
        });
    },
    deleteSlugByObjectId(ctx) {
      return this.adapter.collection.deleteOne({ objectId: ctx.params.id }).then(res => {
        return {
          code: 1,
          mess: "DELETE_SUCCESS"
        }
      }).catch(error => {
        return {
          code: 0,
          mess: "DELETE_FAIL",
          error: error
        }
      })
    },
    loadDataBySlug(ctx) {
      let companyCode;
      if (ctx.meta.token) {
        companyCode = jwt.verify(ctx.meta.token, SecretToken).user.companyCode;
      } else if (ctx.meta.apiKey) {
        companyCode = jwt.decode(ctx.meta.apiKey).companyCode;
      }
      return this.adapter
        .find({ query: { key: ctx.params.slug, companyCode: companyCode } })
        .then(res => {
          if (res.object.type == "house") {
            return ctx
              .call("houses.fetchHouse", { id: res._id })
              .then(res => {
                return res;
              })
              .catch(error => {
                return {
                  code: 0,
                  mess: "ERROR_LOADING",
                  error: error
                };
              });
          } else if (res.object.type == "project") {
            return ctx
              .call("projects.get", { id: res._id })
              .then(res => {
                return res;
              })
              .catch(error => {
                return {
                  code: 0,
                  mess: "ERROR_LOADING",
                  error: error
                };
              });
          }
        });
    },
    updateByObjectId(ctx) {
      return this.adapter.collection
        .updateOne({ objectId: ctx.params.id }, { $set: { key: ctx.params.key } })
        .then(res => {
          return { code: 1, mess: "UPDATE_SUCCESS" };
        })
        .catch(error => {
          return { code: 0, mess: "UPDATE_FAILED", error: error };
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
  created() { },

  /**
   * Service started lifecycle event handler
   */
  started() { },

  /**
   * Service stopped lifecycle event handler
   */
  stopped() { }
};
