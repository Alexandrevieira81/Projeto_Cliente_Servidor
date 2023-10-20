import jwt from 'jsonwebtoken';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcrypt';
const SECRET = 'alexvieira';

export async function verificarADM(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  let db = new sqlite3.Database('./database.db');
  let registroaux = "";

  jwt.verify(token, SECRET, (err, decoded) => {

    console.log(req.params.registro);
    console.log(req.body.registro);
    if (req.params.registro != null) {

      registroaux = req.params.registro;

    } else {

      registroaux = req.body.registro;
    }

    if (err) {
      res.status(401).json({
        "success": false,
        "message": 'Usuário não autenticado!'
      });

      return;
    } else {
      db.get('SELECT * FROM blacklist WHERE token=?', [token], function (err, row) {

        if (row) {
          db.close;
          res.status(401).json({
            "success": false,
            "message": 'Acesso Expirado, Favor Realizar o Login Novamente!'

          });
          return;
        } else {
          let registro = decoded.registro;

          db.get('SELECT * FROM usuario WHERE registro=?', [registro], function (err, row) {

            try {

              if (registroaux != row.registro) {
                if (row.tipo_usuario === 1) {

                  db.close;
                  res.status(403).json({
                    "success": false,
                    "message": 'Usuário Não Autorizado!'
                  });
                  return;

                } else {

                  next();
                }

              } else {

                next();


              }


            } catch (error) {

              res.status(400).json({
                "success": false,
                "message": "Usuário não Cadastrado, Favor Verificar o Número de Registro!"

              });

            } finally {
              db.close;
            }

          });
        }
      });
    }
  });
};

export async function verificarUSER(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  let db = new sqlite3.Database('./database.db');
  console.log("Passou pelo verifica user");
 console.log(token);




  try {
    jwt.verify(token, SECRET, (err, decoded) => {

      if (err) {
        res.status(401).json({
          "success": false,
          "message": 'Usuário não autenticado!'
        });
        return;
      } else {
        db.get('SELECT * FROM blacklist WHERE token=?', [token], function (err, row) {
          console.log(row);
          if (row) {

            res.status(401).json({
              "success": false,
              "message": 'Usuário não autenticado ou Acesso Expirado, Favor Realizar o Login Novamente!'
            });
            return;
          } else {

            next();
          }
        });
      }
    });

  } catch (error) {

  } finally {
    db.close;
  }
};

export async function verificarUSERLogout(req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  let db = new sqlite3.Database('./database.db');
  console.log(token);

  try {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({
          "success": false,
          "message": 'Usuário não autenticado'
        });

      } else {
        db.get('SELECT * FROM blacklist WHERE token=?', [token], function (err, row) {
          console.log(row);
          if (row) {

            res.status(401).json({
              "success": false,
              "message": 'Usuário não autenticado ou Acesso Expirado, Favor Realizar o Login Novamente!'
            });
            return;
          } else {

            next();
          }
        });
      }
    });

  } catch (error) {

  } finally {
    db.close;
  }


};

export async function criarHash(senha) {
  const saltRounds = 6;
  const salt = bcrypt.genSaltSync(saltRounds);
  const result = await bcrypt.hash(senha, salt);
  console.log(result)
  return result;

}



