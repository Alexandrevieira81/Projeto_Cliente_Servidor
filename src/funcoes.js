import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const SECRET = 'alexvieira';

export async function verificarADM(req, res, next) {
  const token = req.headers['authorization'];
  let db = new sqlite3.Database('./database.db');

  jwt.verify(token, SECRET, (err, decoded) => {

    if (err) {
      res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
      return;
    } else {
      db.get('SELECT * FROM blacklist WHERE token=?', [token], function (err, row) {
        console.log(row);
        if (row) {
          db.close;
          res.status(404).json({ "msg": 'Acesso Expirado, Favor Realizar o Login Novamente!' });
          return;
        } else {
          let registro = decoded.registro;
          console.log(registro);
          db.get('SELECT * FROM usuario WHERE registro=?', [registro], function (err, row) {
            if (row.tipo_usuario == 1) {
              db.close;
              res.status(404).json({ "msg": 'Usuário não é Administrador' });
              return;
            } else {
              db.close;
              next();
            }
          });
        }
      });
    }
  });
};

export async function verificarUSER(req, res, next) {
  const token = req.headers['authorization'];
  let db = new sqlite3.Database('./database.db');

  jwt.verify(token, SECRET, (err, decoded) => {

    if (err) {
      res.status(401).json({ auth: false, message: 'Failed to authenticate token.' });
      return;
    } else {
      db.get('SELECT * FROM blacklist WHERE token=?', [token], function (err, row) {
        console.log(row);
        if (row) {
          db.close;
          res.status(404).json({ "msg": 'Acesso Expirado, Favor Realizar o Login Novamente!' });
          return;
        } else {
          db.close;
          next();
        }
      });
    }
  });
};

export async function criarHash(senha) {
  const saltRounds = 6;
  const salt = bcrypt.genSaltSync(saltRounds);
  const result = await bcrypt.hash(senha, salt);
  console.log(result)
  return result;

}