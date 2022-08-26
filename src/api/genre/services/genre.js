"use strict";

/**
 * genre service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const {
  getPaginationInfo,
  convertPagedToStartLimit,
  shouldCount,
  transformPaginationResponse,
} = require("@strapi/strapi/lib/core-api/service/pagination");

module.exports = createCoreService("api::genre.genre", {
  async find(params = {}) {
    const fetchParams = this.getFetchParams(params);
    const userParams = Object.assign(
      {
        fields: ["name"],
        populate: {
          books: {
            fields: ["title", "price", "bg_color"],
            populate: {
              cover: {
                fields: ["name", "hash", "url", "provider"],
              },
            },
            oderBy: { createdAt: "desc" },
          },
        },
      },
      fetchParams
    );

    const paginationInfo = getPaginationInfo(userParams);

    const results = await strapi.entityService.findMany("api::genre.genre", {
      ...userParams,
      ...convertPagedToStartLimit(paginationInfo),
    });

    if (shouldCount(userParams)) {
      const count = await strapi.entityService.count("api::genre.genre", {
        ...userParams,
        ...paginationInfo,
      });

      return {
        results,
        pagination: transformPaginationResponse(paginationInfo, count),
      };
    }

    return {
      results,
      pagination: paginationInfo,
    };
  },

  findOne(entityId, params = {}) {
    const userParams = Object.assign(
      {
        fields: ["name"],
        populate: {
          books: {
            fields: ["title", "price", "bg_color"],
            populate: {
              cover: {
                fields: ["name", "hash", "url", "provider"],
              },
            },
            oderBy: { createdAt: "desc" },
          },
        },
      },
      this.getFetchParams(params)
    );
    return strapi.entityService.findOne("api::genre.genre", entityId, {
      ...userParams,
    });
  },
});
