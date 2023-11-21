class Chamados {

    async store(req, res, next) {
        !req.body?.sol_nivel && (req.body = { ...req.body, sol_nivel: "usuário" });
        !req.body?.rm_codigoetec && (req.body = { ...req.body, rm_codigoetec: "099" });

        req.body = {...req.body, rm_foto: "", usu_cadastroativo: false, usu_codverificacao: false , created_at: new Date(), updated_at: ""};
        next();
    }
    async update(req, res, next) {
        req.body = {...req.body, updated_at: new Date()};
        next();
    }
}

module.exports = new Chamados();

