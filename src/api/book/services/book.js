'use strict';

/**
 * book service.
 */

const { createCoreService } = require('@strapi/strapi').factories;
const {
  getPaginationInfo,
  convertPagedToStartLimit,
  shouldCount,
  transformPaginationResponse,
} = require('@strapi/strapi/lib/core-api/service/pagination');

module.exports = createCoreService('api::book.book', {
  // find和findOne都populate了cover和genre
  async find(params = {}) {
    const fetchParams = this.getFetchParams(params);
    const userParams = Object.assign(
      {
        fields: ['title', 'price', 'bg_color'],
        filters: params.genreType ? {
          genre: {
            name: {
              $eq: params.genreType
            }
          }
        } : undefined,
        populate: {
          cover: {
            fields: ['name', 'hash', 'url', 'provider'],
          },
          genre: {
            fields: ['name'],
          },
        },
        oderBy: { createdAt: 'desc' },
      },
      fetchParams
    );

    const paginationInfo = getPaginationInfo(userParams);

    const results = await strapi.entityService.findMany('api::book.book', {
      ...userParams,
      ...convertPagedToStartLimit(paginationInfo),
    });

    if (shouldCount(userParams)) {
      const count = await strapi.entityService.count('api::book.book', {
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
        populate: {
          cover: {
            fields: ['name', 'hash', 'url', 'provider'],
          },
          genre: {
            fields: ['name'],
          },
        },
      },
      this.getFetchParams(params)
    );
    return strapi.entityService.findOne('api::book.book', entityId, {
      ...userParams,
    });
  },

  /**
   * 通过关键字搜索book
   * @param {String} query 待搜索的关键字
   */
  async search(query, params = {}) {
    const fetchParams = this.getFetchParams(params);
    // 混入query参数
    // 浏览器附加的参数将会覆盖掉这些值
    const userParams = Object.assign(
      {
        fields: ['title', 'price', 'bg_color'],
        filters: {
          $or: [
            {
              title: { $contains: query },
            },
            {
              author: { $contains: query },
            },
          ],
        },
        populate: {
          cover: {
            fields: ['name', 'hash', 'url', 'provider'],
          },
          genre: {
            fields: ['name'],
          },
        },
      },
      fetchParams
    );

    const paginationInfo = getPaginationInfo(userParams);

    const results = await strapi.entityService.findMany('api::book.book', {
      ...userParams,
      ...convertPagedToStartLimit(paginationInfo),
    });

    if (shouldCount(userParams)) {
      const count = await strapi.entityService.count('api::book.book', {
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
