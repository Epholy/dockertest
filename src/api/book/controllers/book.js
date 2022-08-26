'use strict';

/**
 *  book controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::book.book', {
  async search(ctx) {
    const { queryWord } = ctx.params;
    const { query: params } = ctx;

    const { results, pagination, fetchParams } = await strapi.service('api::book.book').search(queryWord, params);
    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination, fetchParams });
  }
});
