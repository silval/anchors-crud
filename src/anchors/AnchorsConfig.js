function define(name, value) {
    Object.defineProperty(exports, name, {
        value:      value,
        enumerable: true
    });
}

define("DBUrl", process.env.MONGOHQ_URL || 'mongodb://127.0.0.1:27017/fiber');
define("ServicePort", process.env.ANCHORS_SERVICE_PORT || '8085');
define("PageSize", process.env.ANCHORS_PAGE_SIZE || 20);
