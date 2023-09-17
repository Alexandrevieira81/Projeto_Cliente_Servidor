import { Router } from "express";
import { createTableUsuarios,createTableBlacklist, insertUsuarios, selectUsuarios, updateUsuarios, deleteUsuarios, usuarioLogin, usuarioLogout } from './controller/Usuarios.js';
import { usuariosRotas } from "./controller/Rotas.js";
import {verificarADM,verificarUSER} from "./funcoes.js";
const router = Router();


createTableUsuarios();
createTableBlacklist();
router.get('/', (req, res) => {

    res.send("Trabalhando com rotas.!")
})
router.post('/logout', usuarioLogout);
router.post('/login', usuarioLogin);
router.post('/usuarios', insertUsuarios);
router.get('/usuarios', verificarADM, selectUsuarios);
router.put('/usuarios', updateUsuarios);
router.delete('/usuarios', deleteUsuarios);

router.get('/rotas',verificarUSER,usuariosRotas);

export default router;