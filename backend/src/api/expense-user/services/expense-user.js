'use strict';

/**
 * expense-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::expense-user.expense-user');
