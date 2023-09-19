import express from 'express';
import router from './router.js';
import { createTableUsuarios, createTableBlacklist } from './controller/Usuarios.js';
const app = express();
app.use(express.json());
app.use(router);
createTableUsuarios();
createTableBlacklist();
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).json({
    "success": false,
    "message": "Formato de requisição com problemas!"
  });
});

app.listen(3000, () => console.log("Funcionando"))