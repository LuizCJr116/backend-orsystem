const nodemailer = require("nodemailer");
const configMail = require("../config/mail");
const transporter = nodemailer.createTransport(configMail);

class MailService {
     async sendMail (message) {
        let resultado;
        try{
            resultado = transporter.sendMail({
                ...configMail.default,
                ...message
            });
        } catch (error){
            
            console.log(error);
            return error;
        }
        return resultado;
    };
    
    async sendActivation ({usu_nome,  usu_email, usu_codverificacao}) {
        const output = `<div style="height: 100vh; display: flex; background: #bed8ff;">
        <div
          style="
            background: white;
            width: 70%;
            min-width: 500px;
            max-width: 950px;
            border-radius: 25px;
            align-items: center;
            justify-content: center;
            margin: auto;
          "
        >
          <h1
            style="
              width: 100%;
              color: #00588d;
              margin: auto;
              text-align: center;
              padding-top: 20px;
              font-family: Century Gothic;
              padding-bottom: 20px;
            "
          >
            O.R. System
          </h1>
          <div
            style="
              margin-left: auto;
              margin-right: auto;
              background: black;
              width: 95%;
              height: 2px;
              border-radius: 20px;
            "
          ></div>
          <div
            style="
              width: 80%;
              border-radius: 15px;
              margin-left: auto;
              margin-right: auto;
            "
          >
          <h1 style="font-family:Century Gothic;font-size:1.6rem;color:black;display: block;overflow: hidden;text-overflow: ellipsis;">
          Olá ${usu_nome}.
        </h1>
            <br />
            <p
              style="
                font-family: Century Gothic;
                font-size: 1.3rem;
                text-align: justify;
                color: black;
              "
            >
            Recebemos sua solicitação de ativação de cadastro, por favor clique no link abaixo para validar no nosso banco de dados:
            </p>
            <div>
              <br />
              <a
                style="
                  font-family: Century Gothic;
                  margin: auto;
                  font-size: 1.6rem;
                  background: #596ad3;
                  color: white;
                  text-decoration: none;
                  padding-left: 50px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  max-width: 250px;
                  text-align: center;
                  padding-right: 50px;
                  display: block;
                  border-radius: 20px;
                "
                href="https://jskqd6.csb.app/ContaAtivada/${usu_codverificacao}"
              >
              Clique Aqui</a>
            </div>
          </div>
          <h1
            style="
              font-family: Century Gothic;
              text-align: right;
              color: #00588d;
              padding-right: 3vw;
              font-size: 1.6rem;
              font-style: italic;
            "
          >
            -Equipe O.R. System
          </h1>
          <div
            style="
              margin-left: auto;
              margin-right: auto;
              background: black;
              width: 95%;
              height: 2px;
              border-radius: 15px;
            "
          ></div>
          <p
            style="
              font-family: Century Gothic;
              font-weight: bold;
              font-size: 1.2rem;
              text-align: center;
              font-style: italic;
              padding-bottom: 18px;
              margin-bottom: 5px;
              color: #00588d;
            "
          >
            PrimEtec - 2023
          </p>
        </div>
      </div>`;

        try {
            await this.sendMail({
                to:`${usu_nome} <${usu_email}>`,
                subject: "Confimação de cadastro - O.R. System",
                html: output

            });
        } catch (error){
            console.log(error);
            return error;
        }
        return true;

    }

    async sendNewPassword ({usu_nome,  usu_email, usu_codverificacao}) {
        const output = `<div style="height: 100vh; display: flex; background: #bed8ff;">
        <div
          style="
            background: white;
            width: 70%;
            min-width: 500px;
            max-width: 950px;
            border-radius: 25px;
            align-items: center;
            justify-content: center;
            margin: auto;
          "
        >
          <h1
            style="
              width: 100%;
              margin: auto;
              text-align: center;
              padding-top: 20px;
              font-family: Century Gothic;
              padding-bottom: 20px;
              color: #00588d;
            "
          >
            O.R. System
          </h1>
          <div
            style="
              margin-left: auto;
              margin-right: auto;
              background: black;
              width: 95%;
              height: 2px;
              border-radius: 20px;
            "
          ></div>
          <div
            style="
              width: 80%;
              border-radius: 15px;
              margin-left: auto;
              margin-right: auto;
            "
          >
          <h1 style="font-family:Century Gothic;font-size:1.6rem;color:black;display: block;overflow: hidden;text-overflow: ellipsis;">
          Olá ${usu_nome}.
        </h1>
            <br />
            <p
              style="
                font-family: Century Gothic;
                font-size: 1.3rem;
                text-align: justify;
                color: black;
              "
            >
            Recebemos sua solicitação de alteração de senha, por favor entre na página abaixo para alterar sua senha:
            </p>
            <div>
              <br />
              <a
                style="
                  font-family: Century Gothic;
                  margin: auto;
                  font-size: 1.6rem;
                  background: #596ad3;
                  color: white;
                  text-decoration: none;
                  padding-left: 50px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  max-width: 250px;
                  text-align: center;
                  padding-right: 50px;
                  display: block;
                  border-radius: 20px;
                "
                href="https://jskqd6.csb.app/RedefinicaoDeSenha/${usu_codverificacao}"
              >
              Redefinir Senha</a
              >
            </div>
          </div>
          <h1
            style="
              font-family: Century Gothic;
              text-align: right;
              color: #00588d;
              padding-right: 3vw;
              font-size: 1.6rem;
              font-style: italic;
            "
          >
            -Equipe O.R. System
          </h1>
          <div
            style="
              margin-left: auto;
              margin-right: auto;
              background: black;
              width: 95%;
              height: 2px;
              border-radius: 15px;
            "
          ></div>
          <p
            style="
              font-family: Century Gothic;
              font-weight: bold;
              font-size: 1.2rem;
              text-align: center;
              font-style: italic;
              padding-bottom: 18px;
              margin-bottom: 5px;
              color: #00588d;
            "
          >
            PrimEtec - 2023
          </p>
        </div>
      </div>`;

        try {
            await this.sendMail({
                to:`${usu_nome} <${usu_email}>`,
                subject: "Nova Senha - O.R. System",
                html: output

            });
        } catch (error){
            console.log(error);
            return error;
        }
        return true;
    }

    async sendAdmConfirmation ({usu_nome, usu_email }) {
        const output = ` <div style="height: 100vh; display: flex; background: #bed8ff;">
        <div
          style="
            background: white;
            width: 70%;
            min-width: 500px;
            max-width: 950px;
            border-radius: 25px;
            align-items: center;
            justify-content: center;
            margin: auto;
          "
        >
          <h1
            style="
              width: 100%;
              margin: auto;
              text-align: center;
              padding-top: 20px;
              font-family: Century Gothic;
              padding-bottom: 20px;
              color: #00588d;
            "
          >
            O.R. System
          </h1>
          <div
            style="
              margin-left: auto;
              margin-right: auto;
              background: black;
              width: 95%;
              height: 2px;
              border-radius: 20px;
            "
          ></div>
          <div
            style="
              width: 80%;
              border-radius: 15px;
              margin-left: auto;
              margin-right: auto;
            "
          >
          <h1 style="font-family:Century Gothic;font-size:1.6rem;color:black;display: block;overflow: hidden;text-overflow: ellipsis;">
          Olá ${usu_nome}.
        </h1>
            <br />
            <p
              style="
                font-family: Century Gothic;
                font-size: 1.3rem;
                text-align: justify;
                color: black;
              "
            >
    
            Recebemos sua solicitação para alteração de nível do sistema, e por meio deste e-mail, viemos confirmar que você foi promovido para administrador. <br /> Para ver as funções adicionais, por favor reinicie sua sessão no sítio:
            </p>
            <div>
              <br />
              <a
                style="
                  font-family: Century Gothic;
                  margin: auto;
                  font-size: 1.6rem;
                  background: #52575e;
                  color: white;
                  text-decoration: none;
                  padding-left: 50px;
                  padding-top: 10px;
                  padding-bottom: 10px;
                  max-width: 250px;
                  text-align: center;
                  padding-right: 50px;
                  display: block;
                  border-radius: 20px;
                "
                href="https://jskqd6.csb.app/"
              >
                Retornar ao sítio</a
              >
            </div>
          </div>
          <h1
            style="
              font-family: Century Gothic;
              text-align: right;
              color: #00588d;
              padding-right: 3vw;
              font-size: 1.6rem;
              font-style: italic;
            "
          >
            -Equipe O.R. System
          </h1>
          <div
            style="
              margin-left: auto;
              margin-right: auto;
              background: black;
              width: 95%;
              height: 2px;
              border-radius: 15px;
            "
          ></div>
          <p
            style="
              font-family: Century Gothic;
              font-weight: bold;
              font-size: 1.2rem;
              text-align: center;
              font-style: italic;
              padding-bottom: 18px;
              margin-bottom: 5px;
              color: #00588d;
            "
          >
            PrimEtec - 2023
          </p>
        </div>
      </div>`;

        try {
            await this.sendMail({
                to:`${usu_nome} <${usu_email}>`,
                subject: "Solicitação para ADM aceita - O.R. System",
                html: output

            });
        } catch (error){
            console.log(error);
            return error;
        }
        return true;
    }
    async sendAdmRefusal ({usu_nome, usu_email }) {
      const output = `<div style="height: 100vh; display: flex; background: #bed8ff;">
      <div
        style="
          background: white;
          width: 70%;
          min-width: 500px;
          max-width: 950px;
          border-radius: 25px;
          align-items: center;
          justify-content: center;
          margin: auto;
        "
      >
        <h1
          style="
            width: 100%;
            margin: auto;
            text-align: center;
            padding-top: 20px;
            font-family: Century Gothic;
            padding-bottom: 20px;
            color: #00588d;
          "
        >
          O.R. System
        </h1>
        <div
          style="
            margin-left: auto;
            margin-right: auto;
            background: black;
            width: 95%;
            height: 2px;
            border-radius: 20px;
          "
        ></div>
        <div
          style="
            width: 80%;
            border-radius: 15px;
            margin-left: auto;
            margin-right: auto;
          "
        >
          <h1 style="font-family:Century Gothic;font-size:1.6rem;color:black;display: block;overflow: hidden;text-overflow: ellipsis;">
            Olá ${usu_nome}.
          </h1>
          <br />
          <p
            style="
              font-family: Century Gothic;
              font-size: 1.3rem;
              text-align: justify;
              color: black;
            "
          >
            Recebemos sua solicitação para alteração de nível do sistema, e por
            meio deste e-mail, viemos o notificar que sua solicitação foi negada.
            <br />
            <br />
            Para saber de mais informações, ou motivos por trás dessa decisão, por
            favor contate a equipe de administradores.
          </p>
          <div>
            <br />
            <a
              style="
                font-family: Century Gothic;
                margin: auto;
                font-size: 1.6rem;
                background: #52575e;
                color: white;
                text-decoration: none;
                padding-left: 50px;
                padding-top: 10px;
                padding-bottom: 10px;
                max-width: 250px;
                text-align: center;
                padding-right: 50px;
                display: block;
                border-radius: 20px;
              "
              href="https://jskqd6.csb.app/"
            >
              Retornar ao sítio</a
            >
          </div>
        </div>
        <h1
          style="
            font-family: Century Gothic;
            text-align: right;
            color: #00588d;
            padding-right: 3vw;
            font-size: 1.6rem;
            font-style: italic;
          "
        >
          -Equipe O.R. System
        </h1>
        <div
          style="
            margin-left: auto;
            margin-right: auto;
            background: black;
            width: 95%;
            height: 2px;
            border-radius: 15px;
          "
        ></div>
        <p
          style="
            font-family: Century Gothic;
            font-weight: bold;
            font-size: 1.2rem;
            text-align: center;
            font-style: italic;
            padding-bottom: 18px;
            margin-bottom: 5px;
            color: #00588d;
          "
        >
          PrimEtec - 2023
        </p>
      </div>
    </div>`;

      try {
          await this.sendMail({
              to:`${usu_nome} <${usu_email}>`,
              subject: "Solicitação para ADM negada - O.R. System",
              html: output

          });
      } catch (error){
          console.log(error);
          return error;
      }
      return true;
  }
}


module.exports = new MailService ();