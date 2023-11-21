const { object, string, mixed } = require("yup");
const { server, apiEndpoints } = require("../../api/index");
const MailService = require("../../services/mail");
const fs = require("fs");
const { uploadFolder } = require("../../config/upload");
const { sign, verify } = require("jsonwebtoken");
const authConfig = require("../../config/auth");

const criarChave = (n, r = "") => {
  while (n--) {
    r += String.fromCharCode(
      ((r = (Math.random() * 62) | 0),
        (r += r > 9 ? (r < 36 ? 55 : 61) : 48))
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
    const usuarioSchema = object({
      usu_nome: string()
        .required("Entre com seu nome completo")
        .min(7, "Mínimo de 7 caracteres")
        .matches(/\s/, "O nome deve conter um espaço"),
      usu_email: string()
        .email("Entre com um e-mail válido")
        .required("Entre com o e-mail")
        .matches(/\./, "Entre com um e-mail válido"),
      usu_rmcodigo: string()
        .required("Entre com o código")
        .min(5, "Mínimo de 5 caracteres"),
      usu_codigoetec: string()
        .required("Entre com o código"),
      usu_cargo: string()
        .required("Insira o cargo"),
      usu_senha: string().required("Uma senha é necessária"),
      usu_nivel: mixed().oneOf(["administrador", "usuário"], "Tipo de usuário inválido")
    });

    if (!req.body?.usu_nivel) {
      req.body = { ...req.body, usu_nivel: "usuário" };
    }

    const { usu_nome, usu_email, usu_rmcodigo, usu_codigoetec, usu_cargo, usu_senha, usu_nivel } = req.body;

    req.body = {
      ...req.body,
      usu_codverificacao: "",
      usu_cadastroativo: false,
      usu_foto: "FotoPadrao.png",
      usu_solativa: false,
      usu_solenviada: "",
      created_at: new Date(),
      updated_at: "",
    };

    try {
      await usuarioSchema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message }).end();
    }

    const usuario = apiEndpoints.db
      .get("usuarios")
      .find({ usu_rmcodigo: req.body.usu_rmcodigo })
      .cloneDeep()
      .value();

    if (usuario) {
      return res.status(400).json({ error: "Usuário já cadastrado." }).end();
    }
    next();
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { usu_nivel, usu_solativa, usu_senha } = req.body;

    try {
      const usuario = apiEndpoints.db.get("usuarios").find({ id: parseInt(id, 10) }).value();

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

    
      if (usu_nivel === "administrador" && usuario.usu_nivel !== "administrador") {
        // Envie o e-mail de confirmação aqui
        await MailService.sendAdmConfirmation({
          usu_nome: usuario.usu_nome,
          usu_email: usuario.usu_email,
        });
      }
      // Verifique se o usuário está sendo atualizado para "usuário"
      if (usu_nivel === "usuário" && usuario.usu_nivel === "usuário") {
        // Envie o e-mail de recusa aqui
        await MailService.sendAdmRefusal({
          usu_nome: usuario.usu_nome,
          usu_email: usuario.usu_email,
        });
      }
  

      usuario.usu_senha = usu_senha;
      usuario.usu_nivel = usu_nivel;
      usuario.usu_solativa = usu_solativa;
      usuario.usu_solenviada = new Date();
      usuario.updated_at = new Date();

      apiEndpoints.db.write();

      return res.status(200).json({ message: "Atributos atualizados com sucesso", });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar os atributos", message: error.message });
    }
  }
  
  async activationrequest(req, res, next) { // 1º parte ATIVAÇÃO
    const { rm } = req.params;
    const usu_codverificacao = criarChave(5);
    
    const usuario = apiEndpoints.db
    .get("usuarios")
    .find({ usu_rmcodigo: rm })
    .value();
    
    usuario.usu_codverificacao = usu_codverificacao;
      apiEndpoints.db.write();

    if (!usuario) {
      return res.status(400).send({ error: "User not found" }).end();
    }
    
    if (
      usuario.usu_cadastroativo
      ) {
        return res.status(400).json({ error: "Usuário já ativado." });
      }
      
      await MailService.sendActivation ({
        usu_nome: usuario.usu_nome,
        usu_email: usuario.usu_email,
        usu_codverificacao: usuario.usu_codverificacao,
      });
      
      return res.status(200).json({ message: "Verifique seu e-mail" });
      
    }
    
  async activate(req, res, next) { // 2º parte ATIVAÇÃO
    const { chave } = req.params;

    try {
      const usuario = apiEndpoints.db
      .get("usuarios")
      .find({ usu_codverificacao: chave })
      .value();

      if (!usuario) {
        return res.status(404).json({ error: "Chave não encontrada." });
      }

    usuario.usu_codverificacao = "";
    usuario.usu_cadastroativo = true;
    usuario.updated_at = new Date();
    apiEndpoints.db.write();

      return res.status(200).json({ message: "Usuário ativado", });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar os atributos", message: error.message });
    }
  }

  async defineNewPassword(req, res, next) { // 2º parte
    const { chave } = req.params;
    const { usu_senha } = req.body
    
    const usuario = apiEndpoints.db
      .get("usuarios")
      .find({ usu_codverificacao: chave })
      .value();

    if (!usuario) {
      return res.status(400).json({ error: "Chave não encontrada" });
    }

    usuario.usu_codverificacao = "";
    usuario.usu_senha = usu_senha;
    usuario.updated_at = new Date();
    apiEndpoints.db.write();

    return res.status(200).send({ Response: "Senha alterada com sucesso" }).end();
  }

  async auth(req, res, next) {
    try {
      const { usu_rmcodigo, usu_senha, usu_codigoetec } = req.body;
  
      let usuario = apiEndpoints.db
        .get("usuarios")
        .find({ usu_rmcodigo })
        .cloneDeep()
        .value();
  
      if (!usuario) {
        return res.status(400).json({ error: "Usuário não encontrado" });
      }
  
      if (usuario.usu_senha !== usu_senha || usuario.usu_codigoetec !== usu_codigoetec) {
        return res.status(400).json({ error: "Combinação de usuário/senha incorreta" });
      }
  
      delete usuario.usu_senha;
  
      const token = sign({}, authConfig.jwt.secret, {
        subject: usuario.id.toString(),
        expiresIn: authConfig.jwt.expiresIn,
      });
  
      console.log("Usuário autenticado:", usuario.usu_rmcodigo);
      return res.status(200).json({ usuario, token });
    } catch (error) {
      console.error("Erro durante a autenticação:", error);
      return res.status(500).json({ error: "Erro interno do servidor durante a autenticação" });
    }
  }
  
  
  async newpassword(req, res, next) {
    const { usu_rmcodigo } = req.body;
    const usu_codverificacao = criarChave(5);
    
    const conta = apiEndpoints.db
      .get("usuarios")
      .find({ usu_rmcodigo })
      .value();

      if (!conta) {
        return res.status(400).json({ error: "Conta não encontrada" });
      }
      
      if (!conta.usu_cadastroativo) {
        return res.status(400).json({ error: "Ative sua conta antes de redefinir sua senha." });
      }
      
      const token = sign({}, authConfig.jwt.secret, {
       subject: conta.id.toString(),
       expiresIn: authConfig.jwt.expiresIn,
     });

     conta.usu_codverificacao = usu_codverificacao;
     conta.updated_at = new Date();
      apiEndpoints.db.write();
      

  await MailService.sendNewPassword({
    usu_nome: conta.usu_nome,
    usu_email: conta.usu_email,
    usu_codverificacao: conta.usu_codverificacao,
  });

  console.log("Código:", conta.usu_codverificacao);
  return res.status(200).json({
    message: "E-mail enviado", conta, token });
}
  
  async ensureAuthenticated(req, res, next) {
    const authHeader = req.headers.authorization;
if (!authHeader) {
  return res.status(400).json({ error: "Token JWT está ausente" });
}

const [, token] = authHeader.split(" ");
    console.log("Token Ensure: " + token);
    try {
      console.log("token : " + token);
      const decoded = await verify(token, authConfig.jwt.secret);
      const { sub } = decoded;
      req.user = { id: sub };
      next();
    } catch (error) {
      return res.status(400).json({ error: "JWT mal formado ou assinatura inválida" });
    }
  }

  async uploadPhoto(req, res, next) {
    const { id } = req.params;
    const avatar = req.file;
  
    if (!avatar) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
    }
  
    const usuario = await apiEndpoints.db
      .get("usuarios")
      .find({ id: parseInt(id, 10) })
      .value();
  
    if (!usuario) {
      return res.status(400).json({ error: "ID não encontrado" });
    }
  
    if (usuario.usu_foto !== "FotoPadrao.png") {
      try {
        fs.unlinkSync(`${uploadFolder}/${usuario.usu_foto}`);
      } catch (error) {
        console.log(`Erro ao excluir o arquivo ${uploadFolder}/${usuario.usu_foto}`);
      }
    }
  
    usuario.usu_foto = avatar.filename;
    usuario.updated_at = new Date();
    apiEndpoints.db.write();
  
    let output = Object.assign({}, usuario);
    delete output.usu_senha;
  
    return res.status(200).json({ ...output });
  }
}

module.exports = new Usuarios();
