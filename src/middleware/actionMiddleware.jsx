export const actionMiddleware = state => next => action => {
    next(action);
}