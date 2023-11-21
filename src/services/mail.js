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
    
    async sendActivation ({rm_nome,  rm_emailinstitucional,usu_codverificacao}){
        const output = `Olá ${rm_nome}... <br/><br/>
        Você precisa validar seu cadastro em:
        <a href="https://luizcjr116-solid-cod-jv756wgwwgq35v9r-8080.preview.app.github.dev/ativacao${usu_codverificacao}"> código de verificação </a>`;

        try {
            await this.sendMail({
                to:`${rm_nome} <${rm_emailinstitucional}>`,
                subject: "Confimação de cadastro",
                HTML: output

            });
        } catch (error){
            console.log(error);
            return error;
        }
        return true;

    }
}


module.exports =new MailService ();