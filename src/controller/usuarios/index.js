const {object, string, mixed} = require("yup");
const {apiEndpoints} = require("../../api/index")
const MailService = require("../../services/mail")
const { sign, verify } = require("jsonwebtoken");
const authConfig = require("../../config/auth");

const criarChave = (n, r = "") =>{
    while (n--) {
        r+=String.fromCharCode(
            ((r= (Math.random()*62) | 0),
                (r+=r>9? (r<36?55:61):48))
        );    
    }
    return r;
};
class Usuarios {
    async signin(req, res, next) {
        // return res.status(200).send("A vila é bela 2").end();
        console.log(`   ${Date.now()}`);
        next();
      }
    async store(req, res, next) {
        let usuarioSchema = object({
            rm_nome: string(). required("Entre com o nome do usuário"),
            rm_emailinstitucional: string()
            .email("Entre com um e-mail válido")
            .required("Entre com o e-mail"),
            usu_senha: string()
            .required('Entre com a senha')
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,})/,
              "A senha precisa ter no mínimo 6 caracteres, sendo, uma maiúscula, uma minúscula, um número e um caracter especial"
            ),
            sol_nivel: mixed.oneOf(["administrador", "usuario"], "Tipo de usuário inválido")
        });

        !req.body?.sol_nivel && (req.body = { ...req.body, sol_nivel: "usuário"});
        !req.body?.usu_numero && (req.body = { ...req.body, usu_numero: ""});
        !req.body?.rm_codigo && (req.body = { ...req.body, rm_codigo: ""});
        req.body = { ...req.body, usu_senha:"", usu_cadastroativo:false, usu_sessaoativa: false, created_at: new Date(), updated_at: "" };
        next();

        const usu_codverificacao = criarChave(10);
        const {rm_nome, usu_senha} = req.body;
        await MailService.sendActivation({
            rm_nome, rm_emailinstitucional,usu_codverificacao
        });
    }
    async update(req, res, next) {
        req.body = { ...req.body, updated_at: new Date() };


        try {
            await usuarioSchema.validate(req.body);
        } catch (error) {
            return res.status(400).end({error: error.message});
            
        }

        let usuarioFinded = apiEndpoints.db
        .get("usuarios")
        .find({ rm_emailinstitucional: req.body.rm_emailinstitucional})
        .cloneDeep()
        .value();

        if (usuarioFinded){
            return res.status(400).send({error: "Usuário já cadastrado"}).end()
        }

        next();
    }

    async activate (req, res, next) {
        const {chave} = req.params;

        let usuario = apiEndpoints.db
      .get("usuarios")
      .find({ usu_codverificacao: chave })
      .value();

        if (!usuario){
            return res.status(400).send({error: "key not finded"}).end();
        }

        usuarios.usu_codverificacao= ""
        usuarios.usu_sessaoativa = true;
        usuarios.usu_cadastroativo = true;
        apiEndpoints.db.write();


        return res.status(200).send({ Response: "User activated"}).end();
    }
    async auth(req, res, next) {
        const { rm_codigo, usu_senha } = req.body;
    
        // console.log(req.body);
        let usuario = apiEndpoints.db
          .get("usuarios")
          .find({ rm_codigo })
          .cloneDeep()
          .value();
    
        if (!usuario)
          return res
            .status(400)
            .json({ error: "Incorrect user/password combination" });
    
        if (usuario.usu_senha !== usu_senha)
          return res
            .status(400)
            .json({ error: "Incorrect user/password combination" });
    
        delete usuario.usu_senha;
    
        const token = sign({}, authConfig.jwt.secret, {
          subject: usuario.id.toString(),
          expiresIn: authConfig.jwt.expiresIn
        });
    
        return res.status(200).send({ usuario, token }).end();
      }
    
      async ensureAuthenticated(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader)
          return res.status(400).json({ error: "JWT token is missing" });
    
        const [, token] = authHeader.split(" ");
        console.log("Token Ensure: " + token);
        try {
          console.log("token : " + token);
          const decoded = await verify(token, authConfig.jwt.secret);
          const { sub } = decoded;
          req.user = { id: sub };
          next();
        } catch (error) {
          return res
            .status(400)
            .json({ error: "jwt malformed or invalid signature" });
        }
      }
}

module.exports = new Usuarios();