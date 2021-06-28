const express = require('express');
const router = express.Router();
const multer = require('multer')
// const upload = multer({dest:'uploads/'});
//ENCURTANDO AS ROTAS COM O CONTROLLER
const mysql = require('../mysql').pool;


//CONST PARA ARMAZENAR OS UPLOADS

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/IMG');// DEFINE O LOCAL ONDE OS UPLOADS 
    },
    filename: function (req, file, cb) {
        let data = new Date().toISOString().replace(/:/g, '-') + '-';
        cb(null, data + file.originalname);// INSERE A DATA QUE FOI POSTADA E NOME DO UPLOAD
    }
});

//CONST PARA FILTRAR OS UPLOADS
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {//DEFINE OS TIPOS DE IMAGEM ACEITOS
        cb(null, true);
    } else {
        cb(null, false);
    }
}

//CONST UPLOAD FINAL
const upload = multer({
    storage: storage,
    limits: {//DEFINE OS LIMITES DA IMAGEM
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

// IMPORTANDO AS ROTAS DO CONTROLLER
router.get('/', (req, res, next) => {


    mysql.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos;',
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {//CONST PARA RECEBER OS VALORES DO PRODUTO
                    quantidade: result.length,
                    produtos: result.map(prod => {
                        return {
                            id_produto: prod.id,
                            nome: prod.nome,
                            preco: prod.preco,
                            imagem_produto: prod.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descriçao: 'RETORNA OS DETALHES DE UM PRODUTO ESPECÍFICO ',
                                url: 'http://localhost:3000/produtos/' + prod.id_produtos
                            }
                        }
                    })
                }
                return res.status(200).send(response);
            }
        )

    })

   
});
router.post('/',upload.single('img'),/*PROPIEDADE DO MULTER PARA ENVIAR IMAGENS NO FORM-DATA */(req, res, next) => {

    mysql.getConnection((error, conn) => {//CRIA A CONEXAO SQL
        if (error) { return res.status(500).send({ error: error }) }//PEGA ERRO
        conn.query(//SINTAXE SQL PARA INSERIR
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [
            req.body.nome, 
            req.body.preco,
            req.file.path
        ],
            (error, resultado, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                console.log(resultado)
                const response = {
                    
                    mensagem: 'PRODUTO CRIADO COM SUCESSO',
                    produtoCriado: {//CONST PARA RECEBER OS VALORES DO PRODUTO INSERIDO
                        id_produto: resultado.insertId,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'GET',
                            descriçao: 'RETORNA TODOS OS PRODUTOS',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(201).send(response)
            }
        )

    })

});
router.get('/:id_produto',(req, res, next) => {// EXPORTA A CONEXAO PARA A ROTA 

    mysql.getConnection((error, conn) => {//CRIA A CONEXAO SQL
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            'SELECT * FROM produtos WHERE id = ?;',
            [req.params.id_produto],
            (error, result, fields) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                if (result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'NÃO FOI ENCONTRADO PRODUTO COM ESSA ID'
                    })
                }

                const response = {//CONST PARA RECEBER OS VALORES DO PRODUTO ESPECIFICO
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descriçao: 'RETORNA TODOS OS PRODUTOS',
                            url: 'http://localhost:3000/produtos'
                        }
                    }
                }
                return res.status(200).send(response)
            }
        )

    });

});
router.patch('/',(req, res, next) => {// EXPORTA A CONEXAO PARA A ROTA 
    mysql.getConnection((error, conn) => {//CRIA A CONEXAO SQL
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(

            `UPDATE produtos
            SET nome      = ?,
                preco     = ?
        WHERE id = ?`,

            [req.body.nome,
            req.body.preco,
            req.body.id_produto],
            (error, result, field) => {

                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = {//CONST PARA RECEBER OS VALORES DO PRODUTO ATUALIZADO
                    mensagem: 'PRODUTO ATUALIZADO COM SUCESSO',
                    produtoAtualizado: {
                        id_produto: req.body.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descriçao: 'RETORNA OS DETALHES DE UM PRODUTO',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produto
                        }
                    }
                }
                return res.status(202).send(response)

            }
        )

    })

});
router.delete('/:id_produto' ,(req, res, next) => {// EXPORTA A CONEXAO PARA A ROTA 
    mysql.getConnection((error, conn) => {//CRIA A CONEXAO SQL
        if (error) { return res.status(500).send({ error: error }) }
        conn.query(
            `DELETE FROM produtos WHERE id = ?`,
            [req.params.id_produto],
            (error, result, field) => {
                conn.release();
                if (error) { return res.status(500).send({ error: error }) }
                const response = { //CONST PARA RECEBER OS VALORES DO PRODUTO DELETADO
                    mensagem: 'PRODUTO REMOVIDO COM SUCESSO',
                    request: {
                        tipo: 'POST',
                        descriçao: 'INSERE UM PRODUTO',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            nome: 'String',
                            preco: 'Number'
                        }
                    }
                }
                return res.status(202).send(response)
            }
        )

    })
});

module.exports = router;