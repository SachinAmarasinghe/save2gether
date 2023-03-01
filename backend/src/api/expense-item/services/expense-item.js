'use strict';

/**
 * expense-item service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::expense-item.expense-item');
