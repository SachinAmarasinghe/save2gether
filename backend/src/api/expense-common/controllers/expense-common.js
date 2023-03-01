'use strict';

/**
 * expense-common controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::expense-common.expense-common');
