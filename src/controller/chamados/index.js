const { object, string } = require("yup");
const { server, apiEndpoints } = require("../../api/index");
const MailService = require("../../services/mail");
const fs = require("fs");
const { uploadFolder } = require("../../config/upload");
const { sign, verify } = require("jsonwebtoken");
const authConfig = require("../../config/auth");


class Chamados {

  async store(req, res, next) {
    const chamadoSchema = object({
      usuarios_id: string().required(
        "Usuário deve estar conectado para enviar um chamado."
      ),
      cha_pedido: string().required("Insira os dados do chamado."),
      cha_setor: string().required("Selecione o setor do chamado."),
      locais_id: string().required("Selecione um local para o chamado."),
      cha_foto1: string().required("Selecione pelo menos uma foto.")
    })

    // console.log(req.files);
    // return res.status(400).send({ error: "Chamado já enviado." }).end();

    req.body = { ...req.body, cha_status: "Pendente", cha_administrador: "", created_at: new Date(), updated_at: "", cha_foto1: "", cha_foto2: "", cha_foto3: "" };
    
    req.body = {...req.body, locais_id: parseInt(req.body.locais_id, 10), usuarios_id: parseInt(req.body.usuarios_id, 10)}
    
    req.files.forEach((element, index) => {
      // console.log(`cha_foto${index+1}: ${element.filename}`)
      req.body = {...req.body, [`cha_foto${index+1}`]: element.filename}
    });
    
    delete req.body.cha_foto;

    try {
      await chamadoSchema.validate(req.body);
    } catch (error) {
      return res.status(400).json({ error: error.message }).end();
    }

    const chamado = apiEndpoints.db
      .get("chamados")
      .find({ cha_pedido: req.body.cha_pedido })
      .cloneDeep()
      .value();

    if (chamado) {
      return res.status(400).send({ error: "Chamado já enviado." }).end();
    }
    next();
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { cha_status, cha_administrador } = req.body;
  
    try {
      const chamado = apiEndpoints.db.get("chamados").find({ id: parseInt(id, 10) }).value();
  
      if (!chamado) {
        return res.status(404).json({ error: "Chamado não encontrado." });
      }
  
      // Atualize os atributos "cha_status" e "cha_administrador"
      chamado.cha_status = cha_status;
      chamado.cha_administrador = cha_administrador;
      chamado.updated_at = new Date();
  
      apiEndpoints.db.write();
  
      return res.status(200).json({ message: "Atributos atualizados com sucesso", chamado });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar os atributos", message: error.message });
    }
  }
}

module.exports = new Chamados();

