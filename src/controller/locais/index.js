const { object, string } = require("yup");
const { server, apiEndpoints  } = require("../../api/index");
const MailService = require("../../services/mail");
const fs = require("fs");
const { uploadFolder } = require("../../config/upload");
const { sign, verify } = require("jsonwebtoken");
const authConfig = require("../../config/auth");


class Locais {

    async store(req, res, next) {
      
      const localSchema = object({
        loc_nome: string()
            .required("Digite o nome do local.")
          })
          
          req.body = {...req.body, created_at: new Date(), updated_at: ""};

          try {
            await localSchema.validate(req.body);
          } catch (error) {
            return res.status(400).end({ error: error.message });
          }
      
          const local = apiEndpoints.db
            .get("locais")
            .find({ loc_nome: req.body.loc_nome })
            .cloneDeep()
            .value();
      
          if (local) {
            return res.status(400).send({ error: "Local já cadastrado." }).end();
          }
          next();
        }
        
        async update(req, res, next) {
          req.body = { ...req.body, updated_at: new Date() };
          
        }}
        
        module.exports = new Locais();
        
        