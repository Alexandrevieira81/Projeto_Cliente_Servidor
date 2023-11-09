import { openDb } from "../configDB.js";
import sqlite3 from 'sqlite3';
import jwt from 'jsonwebtoken';
import { criarHash, verificarCadastro } from "../funcoes.js";
import bcrypt from 'bcrypt';
const SECRET = 'alexvieira';
const dbx = await openDb();

export async function createTableUsuarios() {

    await dbx.exec('CREATE TABLE IF NOT EXISTS pontos (id INTEGER Primary key AUTOINCREMENT, nome VARCHAR(100) NOT NULL UNIQUE)');

}

export async function createTableBlacklist() {

    await dbx.exec('CREATE TABLE IF NOT EXISTS blacklist (id INTEGER Primary key AUTOINCREMENT, token TTL)')

}

export async function usuarioLogout(req, res) {

    try {

        await dbx.run('INSERT INTO blacklist (token) VALUES (?)', [req.headers['authorization'].split(' ')[1]]);

        res.status(200).json({
            "success": true,
            "message": "Deslogado com sucesso.",

        });

    } catch (error) {

        res.status(403).json({
            "success": true,
            "message": "Problemas ao Deslogar",

        });

    }


    return;
}


export async function usuarioLogin(req, res) {

    let db = new sqlite3.Database('./database.db');

    console.log(req.body.senha);
    console.log(req.body.registro);

    try {
        db.get('SELECT * FROM usuario WHERE registro=?', [req.body.registro], function (err, row) {

            if ((row) && (bcrypt.compareSync(req.body.senha, row.senha))) {
                console.log(row.registro);
                const token = jwt.sign({ registro: row.registro }, SECRET, { expiresIn: 3000 });
                res.status(200).json({
                    "success": true,
                    "message": "Login realizado com sucesso.",
                    token
                });
            } else {
                res.status(403).json({
                    "success": false,
                    "message": "Não foi possível realizar o Login Verifique suas credenciais."
                });

            }

        });
    } catch (error) {

        res.status(403).json({
            "success": false,
            "message": "Não foi possível realizar o Login Verifique suas credenciais."
        });

    } finally {
        db.close;

    }

}

export async function insertUsuarios(req, res) {
    let pessoa = req.body;

    let erros = await verificarCadastro(pessoa);
    console.log(erros);

    try {


        if (erros.length == 0) {
            pessoa.senha = await criarHash(pessoa.senha);
            await dbx.get('INSERT INTO usuario (registro, nome, email, senha, tipo_usuario) VALUES (?,?,?,?,?)', [pessoa.registro, pessoa.nome, pessoa.email, pessoa.senha, pessoa.tipo_usuario]);
            res.status(200).json({
                "success": true,
                "message": "Usuário cadastrado com Sucesso."
            });

        } else {

            res.status(403).json({
                "success": false,
                "message": erros
            });
        }


    } catch (error) {

        res.status(403).json({
            "success": false,
            "message": "Não foi possível cadastrar o usuário."
        });
    }
}

export async function updateUsuarios(req, res) {
    let pessoa = req.body;
    let erros = await verificarCadastro(pessoa);
    console.log(req.params.registro);
    let db = new sqlite3.Database('./database.db');

    try {
        const token = req.headers['authorization'].split(' ')[1];

        if (erros.length == 0) {
            
            pessoa.senha = await criarHash(pessoa.senha);

            db.get('SELECT * FROM usuario WHERE registro=?', req.params.registro, function (err, row) {

                if (row) {


                    console.log("chegou na sql");

                    jwt.verify(token, SECRET, (err, decoded) => {
                        db.get('SELECT * FROM usuario WHERE registro=?', decoded.registro, function (err, row) {

                            if (row.tipo_usuario === 1) {
                                db.get('UPDATE usuario SET nome=?, registro=?, email=?, senha=?, tipo_usuario=? WHERE registro=?', [pessoa.nome, req.params.registro, pessoa.email, pessoa.senha, pessoa.tipo_usuario, req.params.registro], function (err, row) {
                                    res.status(200).json({
                                        "success": true,
                                        "message": "Cadastro Alterado com Sucesso"
                                    })
                                });
                            } else if ((pessoa.tipo_usuario === 1) && (row.tipo_usuario === 0)) {
                                res.status(403).json({
                                    "success": false,
                                    "message": "Você Não Tem Autorização para Mudar Seu Status"
                                })
                            } else {
                                db.get('UPDATE usuario SET nome=?, registro=?, email=?, senha=? WHERE registro=?', [pessoa.nome, req.params.registro, pessoa.email, pessoa.senha, req.params.registro], function (err, row) {
                                    res.status(200).json({
                                        "success": true,
                                        "message": "Cadastro Alterado com Sucesso"
                                    })
                                });

                            }
                        });
                    });



                } else {
                    res.status(403).json({
                        "success": false,
                        "message": "Informe um Registro Válido!"

                    });

                }


            });

        } else {
            res.status(403).json({
                "success": false,
                "message": erros
            });

        }

    } catch (error) {
        res.status(403).json({
            "success": false,
            "message": "Erro no formato do cabeçalho!"

        });
    } finally {
        db.close;

    }
}

export async function selectAllUser(req, res,) {

    let db = new sqlite3.Database('./database.db');


    try {

        db.all('SELECT nome,registro,email,tipo_usuario  FROM usuario', function (err, row) {

            let usuarios = JSON.stringify({ usuarios: row, "success": true, "message": "Lista de Usuários!." });

            res.status(200).json(JSON.parse(usuarios));

        });

    } catch (error) {
        res.status(403).json({
            "success": false,
            "message": "Não existem usuários cadastrados."
        });
    } finally {
        db.close;
    }
}

export async function selectUser(req, res) {

    let db = new sqlite3.Database('./database.db');

    try {

        db.get('SELECT nome,registro,email,tipo_usuario  FROM usuario where registro=?', [req.params.registro], function (err, row) {

            if (row) {

                let usuario = JSON.stringify({ usuario: row, "success": true, "message": "Usuário Encontrado!." });

                //console.log(usuario);

                res.status(200).json(JSON.parse(usuario));

            } else {

                let usuario = JSON.stringify({ "success": false, "message": "Usuário Não Localizado!." });

                res.status(403).json(JSON.parse(usuario));
            }

        });

    } catch (error) {
        res.status(403).json({
            "success": false,
            "message": "Não existem usuários cadastrados."
        });
    } finally {
        db.close;
    }
}


export async function deleteUsuarios(req, res) {

    let db = new sqlite3.Database('./database.db');
    console.log("DELETAR USUÁRIO ", req.params.registro)
    try {

        if (!req.params.registro) {

            res.status(403).json({
                "success": false,
                "message": "Informe o REGISTRO do Usuário..."
            })

        } else {

            db.get('DELETE FROM usuario WHERE registro=?', [req.params.registro], function (err, row) {
                res.status(200).json({
                    "success": true,
                    "message": "O Usuário foi apagado com sucesso."
                })

            });
        }

    } catch (error) {

        res.status(403).json({
            "success": false,
            "message": "Usuário Inexistente..."
        })

    } finally {

        db.close;
    }

}
