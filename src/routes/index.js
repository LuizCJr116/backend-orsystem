const { Router, static: expressStatic } = require("express");
const http = require("http");
const {storage, uploadFolder} = require("../config/upload");
const multer = require ("multer");


const Usuarios = require("../controller/usuarios/index")
const Locais = require("../controller/locais/index")
const Chamados = require("../controller/chamados/index")

const routes = new Router();
const upload = multer ({storage});

routes.get("/", (req, res) => {
    return res.status(200).send("Trabalho de TCC - ORSYSTEM 2023").end();
  });  

  routes.put("/api/*", (req, res) => {
    return res.status(400).end();
  });
  

  routes.get("/api/db", (req, res) => {
    return res.status(404).end(http.STATUS_CODES[404]);
  });
  

routes.use("/files", expressStatic(uploadFolder));

routes.post("/api/auth", Usuarios.auth, Usuarios.ensureAuthenticated);
routes.post("/api/newpassword", Usuarios.newpassword, Usuarios.ensureAuthenticated);

routes.use("/api/*", Usuarios.ensureAuthenticated);
//routes.post("/signin", Usuarios.signin);

//routes.get("/activate/:chave", Usuarios.ensureAuthenticated, Usuarios.activate);

//Injeta no arquivo o token

//routes.post("/api/usuarios", Usuarios.store);

routes.post("/api/usuarios", Usuarios.ensureAuthenticated, Usuarios.store);
routes.patch("/api/usuarios/:id", Usuarios.ensureAuthenticated, Usuarios.update);
routes.get("/api/activate/:chave", Usuarios.activate); // funcionando
routes.get("/api/activationrequest/:rm", Usuarios.activationrequest); // funcionando
routes.post("/api/defineNewPassword/:chave", Usuarios.defineNewPassword);


routes.patch("/api/avatar/:id", upload.single("avatar"), Usuarios.uploadPhoto);
routes.post("/api/avatar/:id", upload.single("avatar"), Usuarios.uploadPhoto);

routes.post("/api/locais", Locais.store);

routes.post("/api/chamados", upload.array('cha_foto',3), Chamados.store);
routes.patch("/api/chamados/:id", Chamados.update);

//routes.patch("/api/chamadofoto/:id", upload.single("chamadofoto"), Chamados.uploadPhoto);
//routes.post("/api/chamadofoto/:id", upload.single("chamadofoto"), Chamados.uploadPhoto);

module.exports = { routes };