import { openDb } from "../configDB.js";
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import { criarHash } from "../funcoes.js";
import bcrypt from 'bcrypt';
const SECRET = 'alexvieira';

export async function createTableUsuarios() {

    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS usuario (id INTEGER Primary key AUTOINCREMENT, nome VARCHAR(100), registro VARCHAR(7), email VARCHAR(100), senha VARCHAR(150), tipo_usuario INTEGER)')
    })
}

export async function createTableBlacklist() {

    openDb().then(db => {
        db.exec('CREATE TABLE IF NOT EXISTS blacklist (id INTEGER Primary key AUTOINCREMENT, token TTL)')
    })
}

export async function usuarioLogout(req, res) {

    openDb().then(db => {
        db.run('INSERT INTO blacklist (token) VALUES (?)', [req.headers['authorization']]);
    });
    res.json({

        "success": true,
        "message": "Logout realizado com sucesso."

    })

}


export async function usuarioLogin(req, res) {

    let db = new sqlite3.Database('./database.db');


    db.get('SELECT * FROM usuario WHERE registro=?', [req.body.registro], function (err, row) {
        console.log(req.body.registro);
        console.log(row);

        if ((row) && (bcrypt.compareSync(req.body.senha, row.senha))) {

            console.log(row.registro);
            const token = jwt.sign({ registro: row.registro }, SECRET, { expiresIn: 10000 });
            res.status(200).json({
                "success": true,
                "message": "Login realizado com sucesso.",
                token
            });

            return;

        }

        res.status(400).json(
            {
                "success": False,
                "message": "Não foi possível realizar o Login."
            }
        );


    });
    db.close;
}

export async function insertUsuarios(req, res) {
    let pessoa = req.body;
    pessoa.senha = await criarHash(pessoa.senha);

    openDb().then(db => {
        db.run('INSERT INTO usuario (nome, registro, email, senha, tipo_usuario) VALUES (?,?,?,?,?)', [pessoa.nome, pessoa.registro, pessoa.email, pessoa.senha, pessoa.tipo_usuario]);
    });
    res.status(200).json({
        "success": true,
        "message": "Usuário cadastrado com Sucesso."
    })

}

export async function updateUsuarios(req, res) {
    let pessoa = req.body;
    if (!pessoa.registro) {
        res.status(400).json({
            "success": false,
            "message": "Informe o Código do Usuário"
        })

    } else if ((pessoa.nome == null) || (pessoa.email == null) || (pessoa.senha == null) || (pessoa.registro == null) || (!pessoa.tipo_usuario == null)) {
        res.status(400).json({
            "success": false,
            "message": "Informe o Todos os Campos"
        })
    } else if ((pessoa.nome == "") || (pessoa.email == "") || (pessoa.senha == "") || (pessoa.registro == "") || (!pessoa.tipo_usuario == "")) {
        res.status(400).json({
            "success": false,
            "message": "Informe o Todos os Campos"
        })


    }

    else {
        openDb().then(db => {
            db.run('UPDATE usuario SET nome=?, registro=?, email=?, senha=?, tipo_usuario=? WHERE registro=?', [pessoa.nome, pessoa.registro, pessoa.email, pessoa.senha, pessoa.tipo_usuario, pessoa.registro]);
        });
        res.status(200).json({
            "success": true,
            "message": "Cadastro Alterado com Sucesso"
        })

    }

}

export async function selectUsuarios(req, res,) {
    let pessoa = req.body;

    if (!pessoa.registro) {

        if (openDb().then(db => {
            db.all('SELECT nome,registro,email,tipo_usuario FROM usuario').then(pessoas => res.status(200).json(pessoas));
        })) {
            console.log('retornou usuários');
        } else {
            res.status(200).json({
                "success": false,
                "msg": "Ainda não existem usuários cadastrados"

            })

        }


    } else {

        let db = new sqlite3.Database('./database.db');
        db.get('SELECT nome,registro,email,tipo_usuario FROM usuario WHERE registro=?', [pessoa.registro], function (err, row) {
            if (!row) {

                res.status(400).json({
                    "success": false,
                    "msg": "Usuário não Encontrado"
                });
            }

            res.status(200).json(row);
        });

        db.close;

    }


}


export async function deleteUsuarios(req, res) {
    let pessoa = req.body;
    if (!pessoa.registro) {

        res.json.status(400)({
            "success": false,
            "message": "Informe o Código do Usuário..."
        })

    } else {
        let registro = req.body.registro;
        openDb().then(db => {
            db.get('DELETE FROM usuario WHERE registro=?', [registro]);
        });
        res.status(200).json({
            "success": true,
            "message": "O usuário foi apagado com sucesso."
        })

    }
}
