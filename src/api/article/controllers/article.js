'use strict';

/**
 *  article controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::article.article', {
  async search(ctx) {
    const { queryWord } = ctx.params;
    const { query: params } = ctx;

    const { results, pagination, fetchParams } = await strapi.service('api::article.article').search(queryWord, params);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination, fetchParams });
  }
});
