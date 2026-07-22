"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewarePipeline = void 0;
class MiddlewarePipeline {
    middlewares = [];
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }
    async execute(req, targetHandler) {
        let index = -1;
        const dispatch = async (i) => {
            if (i <= index) {
                throw new Error('next() called multiple times');
            }
            index = i;
            if (i === this.middlewares.length) {
                return await targetHandler(req);
            }
            const middleware = this.middlewares[i];
            return await middleware.handle(req, () => dispatch(i + 1));
        };
        return await dispatch(0);
    }
}
exports.MiddlewarePipeline = MiddlewarePipeline;
