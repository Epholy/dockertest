'use strict';

/**
 * recommended service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::recommended.recommended', {
  async find(params = {}) {
    const fetchParams = this.getFetchParams(params);
    const userParams = Object.assign(
      {
        populate: {
          relatedBook: {
            populate: {
              book: {
                fields: ['title', 'price', 'bg_color'],
                populate: {
                  cover: {
                    fields: ['name', 'hash', 'url', 'provider']
                  }
                }
              }
            }
          }
        }
      },
      fetchParams
    );

    return strapi.entityService.findMany('api::recommended.recommended', {
      ...userParams,
    });
  },
});
