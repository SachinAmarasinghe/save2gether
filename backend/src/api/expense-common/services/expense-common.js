'use strict';

/**
 * expense-common service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::expense-common.expense-common');
