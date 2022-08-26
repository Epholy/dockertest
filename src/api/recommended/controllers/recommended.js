'use strict';

/**
 *  recommended controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::recommended.recommended', {
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.service('api::recommended.recommended').find(query);

    return this.transformResponse(entity);
  }
});
