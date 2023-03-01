'use strict';

/**
 * expense-user controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::expense-user.expense-user', {
    async create(ctx) {
        const user = ctx.state.user;

        const expenseUser = await super.create(ctx);

        const updated = await strapi.entityService.update("api::expense-user.expense-user", expenseUser.data.id, {
            data: {
                owner: user.id
            }
        });

        return updated;
    },
    async find(ctx) {
        const user = ctx.state.user;

        ctx.query.filters = {
            ...(ctx.query.filters || {}),
            owner: user.id
        };

        return super.find(ctx);
    },
    async findOne(ctx) {
        const user = ctx.state.user;

        ctx.query.filters = {
            ...(ctx.query.filters || {}),
            owner: user.id
        };

        return super.findOne(ctx);
    },
    async update(ctx) {
        const user = ctx.state.user;

        ctx.query.filters = {
            ...(ctx.query.filters || {}),
            owner: user.id
        };

        return super.update(ctx);
    },
    async delete(ctx) {
        const user = ctx.state.user;

        ctx.query.filters = {
            ...(ctx.query.filters || {}),
            owner: user.id
        };

        return super.delete(ctx);
    }
});
