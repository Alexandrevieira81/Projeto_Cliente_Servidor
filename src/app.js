import express from 'express';
import router from './router.js';
const app = express();
app.use(express.json());
app.use(router);
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(400).json({"msg":"Formato de requisição com problemas!"});
  });

app.listen(3000, () => console.log("Funcionando"))