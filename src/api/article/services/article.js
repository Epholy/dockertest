'use strict';

/**
 * article service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const {
  getPaginationInfo,
  convertPagedToStartLimit,
  shouldCount,
  transformPaginationResponse,
} = require('@strapi/strapi/lib/core-api/service/pagination');

module.exports = createCoreService('api::article.article', {
  async find(params = {}) {
    const fetchParams = this.getFetchParams(params);
    const userParams = Object.assign(
      {
        populate: {
          cover: {
            fields: ['name', 'hash', 'url', 'provider'],
          },
        },
        oderBy: { createdAt: 'desc' },
      },
      fetchParams
    );

    const paginationInfo = getPaginationInfo(userParams);

    const results = await strapi.entityService.findMany('api::article.article', {
      ...userParams,
      ...convertPagedToStartLimit(paginationInfo),
    });

    if (shouldCount(userParams)) {
      const count = await strapi.entityService.count('api::article.article', {
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

  async search(query, params = {}) {
    const fetchParams = this.getFetchParams(params);
    // 混入query参数
    // 浏览器附加的参数将会覆盖掉这些值
    const userParams = Object.assign(
      {
        fields: ['title', 'summary', 'createdAt'],
        filters: {
          $or: [
            {
              title: { $contains: query },
            },
            {
              summary: { $contains: query },
            }
          ],
        },
        populate: {
          cover: {
            fields: ['name', 'hash', 'url', 'provider'],
          },
        },
      },
      fetchParams
    );

    const paginationInfo = getPaginationInfo(userParams);

    const results = await strapi.entityService.findMany('api::article.article', {
      ...userParams,
      ...convertPagedToStartLimit(paginationInfo),
    });

    if (shouldCount(userParams)) {
      const count = await strapi.entityService.count('api::article.article', {
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
});
