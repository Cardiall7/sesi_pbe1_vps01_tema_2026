const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("client"));

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

app.get("/usos", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    res.json(dados);
});

app.get("/usos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const uso = dados.find(item => item.id == req.params.id);

    if (!uso) {
        return res.status(404).json({
            mensagem: "Registro não encontrado"
        });
    }

    res.json(uso);
});

app.get("/tipo/:tipo", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const resultado = dados.filter(
        item => item.tipo == req.params.tipo
    );

    res.json(resultado);
});

app.get("/risco/:risco", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const resultado = dados.filter(
        item => item.nivel_risco == req.params.risco
    );

    res.json(resultado);
});

app.post("/usos", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const novoUso = req.body;

    if (dados.length == 0) {
        novoUso.id = 1;
    } else {
        novoUso.id = dados[dados.length - 1].id + 1;
    }

    dados.push(novoUso);

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 2)
    );

    res.status(201).json(novoUso);
});

app.put("/usos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const indice = dados.findIndex(
        item => item.id == req.params.id
    );

    if (indice == -1) {
        return res.status(404).json({
            mensagem: "Registro não encontrado"
        });
    }

    dados[indice] = {
        id: dados[indice].id,
        sistema: req.body.sistema,
        tipo: req.body.tipo,
        finalidade: req.body.finalidade,
        tecnologia: req.body.tecnologia,
        nivel_risco: req.body.nivel_risco,
        possui_revisao_humana: req.body.possui_revisao_humana
    };

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 2)
    );

    res.json(dados[indice]);
});

app.patch("/usos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const indice = dados.findIndex(
        item => item.id == req.params.id
    );

    if (indice == -1) {
        return res.status(404).json({
            mensagem: "Registro não encontrado"
        });
    }

    dados[indice] = {
        ...dados[indice],
        ...req.body
    };

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 2)
    );

    res.json(dados[indice]);
});

app.delete("/usos/:id", (req, res) => {
    const dados = JSON.parse(fs.readFileSync("dados.json"));

    const indice = dados.findIndex(
        item => item.id == req.params.id
    );

    if (indice == -1) {
        return res.status(404).json({
            mensagem: "Registro não encontrado"
        });
    }

    dados.splice(indice, 1);

    fs.writeFileSync(
        "dados.json",
        JSON.stringify(dados, null, 2)
    );

    res.json({
        mensagem: "Registro excluído"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);

    app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}/usos`);
});
});