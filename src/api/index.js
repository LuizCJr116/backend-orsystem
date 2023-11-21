const {create,defaults,router,rewriter  } = require ("json-server");
const path = require("path");
const rewrites = require("../routes/rewrites.json");
const server = create();
const apiEndpoints = router(path.join(__dirname,"..","data", "db.json"), {
foreignKeySuffix: "_id"
});

const middlewares = defaults();

server.use(rewriter(rewrites));
server.use(middlewares);
server.use(apiEndpoints);

module.exports = { server, apiEndpoints };