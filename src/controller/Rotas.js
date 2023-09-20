import { openDb } from "../configDB.js";
import sqlite3 from 'sqlite3';


const dbx = await openDb();

export async function createTableRota() {
    await dbx.exec('CREATE TABLE IF NOT EXISTS rota (idrota INTEGER Primary key AUTOINCREMENT, nome_rota VARCHAR(100),inicio VARCHAR(50),fim VARCHAR(50))');
};

export async function createTableSegmento() {
    await dbx.exec('CREATE TABLE IF NOT EXISTS segmento(idsegmento INTEGER Primary key AUTOINCREMENT, nome VARCHAR(100),distancia int, direcao VARCHAR(20),partida VARCHAR(50),chegada VARCHAR(50),ordem INTEGER,status BOOL)');
};

export async function createTableSegmentoRota() {

    await dbx.exec('PRAGMA foreign_keys = 1; CREATE TABLE IF NOT EXISTS rotasegmento (id_rota INTEGER , id_segmento INTEGER, FOREIGN KEY(id_rota) REFERENCES rota(idrota),FOREIGN KEY(id_segmento) REFERENCES segmento(idsegmento),PRIMARY KEY(id_rota,id_segmento))');

};

export async function insertSegmento(req, res) {
    let segmento = req.body;
    console.log(segmento);
    try {

        await dbx.get('INSERT INTO segmento(nome, distancia, direcao, partida, chegada, ordem, status) VALUES (?,?,?,?,?,?,?)', [segmento.nome, segmento.distancia, segmento.direcao, segmento.partida, segmento.chegada, segmento.ordem, segmento.status]);
        res.status(200).json({
            "success": true,
            "message": "Segmento cadastrado com Sucesso."
        });

    } catch (error) {

        res.status(400).json({
            "success": false,
            "message": "Não foi possível cadastrar o Segmento."
        });
    }

}

export async function insertRota(req, res) {
    let rota = req.body;
    console.log(rota);

    try {
        await dbx.get('INSERT INTO rota (nome_rota, inicio, fim) VALUES (?,?,?)', [rota.nome_rota, rota.inicio, rota.fim]);
        res.status(200).json({
            "success": true,
            "message": "Rota cadastrada com Sucesso."
        });

    } catch (error) {

        res.status(400).json({
            "success": false,
            "message": "Não foi possível cadastrar a Rota."
        });
    }
}

export async function insertRotaSegmento(req, res) {
    let rotaseg = req.body;
    console.log(rotaseg);

    try {

        await dbx.get('INSERT INTO rotasegmento (id_rota , id_segmento) VALUES (?,?)', [rotaseg.id_rota, rotaseg.id_segmento]);
        res.status(200).json({
            "success": true,
            "message": "Segmento Vinculado com Sucesso."
        });


    } catch (error) {

        res.status(400).json({
            "success": false,
            "message": "Não foi possível Vincular o Segmento."
        });
    }
}

export async function selectRotas(req, res) {
    let rotas = req.body;
    let db = new sqlite3.Database('./database.db');
    let rota_filtrada = [];
    let flag_rota_nome;
    let flag_status = 0;

    try {

        db.all('SELECT rota.nome_rota,segmento.nome,segmento.distancia,segmento.direcao,segmento.partida,segmento.chegada,segmento.ordem,segmento.status FROM rota,segmento,rotasegmento where rota.inicio=? and rota.fim=? and rotasegmento.id_rota = rota.idrota and segmento.idsegmento = rotasegmento.id_segmento', [rotas.inicio, rotas.fim], function (err, row) {
            flag_rota_nome = row[0].nome_rota;

            row.forEach(function (obj) {

                if (obj.status != 1) {
                    flag_status = 1;

                } else if ((flag_status == 0) && (flag_rota_nome === obj.nome_rota)) {

                    rota_filtrada.push(obj);



                } else if ((flag_rota_nome !== obj.nome_rota) && (flag_status == 1)) {

                    flag_rota_nome = obj.nome_rota;
                    flag_status = 0;

                    var tam = rota_filtrada.length;
                    while (tam >= 0) {
                        rota_filtrada.pop();
                        tam--;
                    }
                    rota_filtrada.push(obj);


                } else {
                    console.log("Passando entre as condições até o reset");

                }


            });

            res.status(200).json(rota_filtrada);


        });

    } catch (error) {
        res.status(400).json({
            "success": false,
            "message": "Não foi Possível Caregar as Rotas."
        });
    }
}

export async function selectRotasSemFiltro(req, res) {
    let rotas = req.body;
    let db = new sqlite3.Database('./database.db');
    try {

        db.all('SELECT rota.nome_rota,segmento.nome,segmento.distancia,segmento.direcao,segmento.partida,segmento.chegada,segmento.ordem,segmento.status FROM rota,segmento,rotasegmento where rota.inicio=? and rota.fim=? and rotasegmento.id_rota = rota.idrota and segmento.idsegmento = rotasegmento.id_segmento', [rotas.inicio, rotas.fim], function (err, row) {

            res.status(200).json(row);

        });

    } catch (error) {
        res.status(400).json({
            "success": false,
            "message": "Não foi Possível Caregar as Rotas."
        });
    }
}

export async function usuariosRotas(req, res) {

    res.status(200).json({
        "success": true,
        "message": "Usuário Comum acesando as rotas..."
    })
}