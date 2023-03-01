'use strict';

/**
 * expense-common router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::expense-common.expense-common');
