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
        "statusCode": 200,
        "msg": "Logout Efetuado com Sucesso"
    })

}


export async function usuarioLogin(req, res) {

    let db = new sqlite3.Database('./database.db');


    db.get('SELECT * FROM usuario WHERE registro=?', [req.body.registro], function (err, row) {
        console.log(req.body.registro);
        console.log(row);

        if ((row) && (bcrypt.compareSync(req.body.senha, row.senha))){

            console.log(row.registro);
            const token = jwt.sign({ registro: row.registro }, SECRET, { expiresIn: 10000 });
            res.json({ auth: true, token });

            return;

        }

        res.status(401).json({ "msg": "Usuário não Autorizado" });


    });
    db.close;
}

export async function insertUsuarios(req, res) {
    let pessoa = req.body;
    pessoa.senha = await criarHash(pessoa.senha);
    
    openDb().then(db => {
        db.run('INSERT INTO usuario (nome, registro, email, senha, tipo_usuario) VALUES (?,?,?,?,?)', [pessoa.nome, pessoa.registro, pessoa.email, pessoa.senha, pessoa.tipo_usuario]);
    });
    res.json({
        "statusCode": 200,
        "msg": "Cadastro Efetuado com Sucesso"
    })

}

export async function updateUsuarios(req, res) {
    let pessoa = req.body;
    if (!pessoa.id) {
        res.json({
            "statusCode": 400,
            "msg": "Informe o Código do Usuário"
        })

    } else if ((pessoa.nome == null) || (pessoa.email == null) || (pessoa.senha == null) || (pessoa.registro == null) || (!pessoa.tipo_usuario == null)) {
        res.json({
            "statusCode": 400,
            "msg": "Informe o Todos os Campos"
        })
    } else if ((pessoa.nome == "") || (pessoa.email == "") || (pessoa.senha == "") || (pessoa.registro == "") || (!pessoa.tipo_usuario == "")) {
        res.json({
            "statusCode": 400,
            "msg": "Informe o Todos os Campos"
        })


    }

    else {
        openDb().then(db => {
            db.run('UPDATE usuario SET nome=?, registro=?, email=?, senha=?, tipo_usuario=? WHERE id=?', [pessoa.nome, pessoa.registro, pessoa.email, pessoa.senha, pessoa.tipo_usuario, pessoa.id]);
        });
        res.json({
            "statusCode": 200,
            "msg": "Cadastro Alterado com Sucesso"
        })

    }

}

export async function selectUsuarios(req, res,) {
    let pessoa = req.body;

    if (!pessoa.id) {

        openDb().then(db => {
            db.all('SELECT * FROM usuario').then(pessoas => res.json(pessoas));
        })

    } else {

        let db = new sqlite3.Database('./database.db');
        db.get('SELECT * FROM usuario WHERE id=?', [pessoa.id], function (err, row) {
            if (!row) {

                res.status(404).json({ "msg": "Usuário não Encontrado" });

            }
            console.log(row);
            res.json(row);
        });

        db.close;

    }


}


export async function deleteUsuarios(req, res) {
    let pessoa = req.body;
    if (!pessoa.id) {

        res.json({
            "statusCode": 400,
            "msg": "Informe o Código do Usuário"
        })

    } else {
        let id = req.body.id;
        openDb().then(db => {
            db.get('DELETE FROM usuario WHERE id=?', [id]);
        });
        res.json({
            "statusCode": 200,
            "msg": "Usuário Excluído com Sucesso"
        })

    }
}
