const { Router, static: expressStatic } = require("express");
const http = require("http");
const {storage, uploadFolder} = require("../config/upload");
const multer = require ("multer");

const Chamados = require("../controller/chamados/index");
const Usuarios = require("../controller/usuarios/index")

const routes = new Router();
const upload = multer ({storage});

routes.get("/", (req, res) => {
    res.send("Trabalho de TCC");
    });

routes.put("/api/*", (req, res) => {
    return res.status(400).end();
});

routes.get("/api/db", (res,req) => {
    return res.status(404).end(http.STATUS_CODES[404]);
});

routes.use("/files", expressStatic(uploadFolder));
routes.post("/api/usuarios", Usuarios.store);
routes.patch("api/usuarios/:id", Usuarios.update);

routes.post("/api/chamados", Chamados.store);
routes.patch("/api/chamados/:id", Chamados.update);

module.exports= { routes };