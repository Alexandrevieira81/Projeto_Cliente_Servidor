import { Router } from "express";
import { insertUsuarios, selectAllUser, selectUser, updateUsuarios, deleteUsuarios, usuarioLogin, usuarioLogout } from './controller/Usuarios.js';
import {insertSegmentos,insertPonto, usuariosRotas,selectAllSegmentos, insertRota,selectAllRotas, insertSegmento, insertRotaSegmento, selectRotas, selectRotasSemFiltro } from "./controller/Rotas.js";
import { verificarADM, verificarUSER,verificarUSERLogout } from "./funcoes.js";
const router = Router();



router.get('/', (req, res) => {

    res.send("Trabalhando com rotas.!")
})
router.post('/logout',verificarUSERLogout, usuarioLogout);
router.post('/login', usuarioLogin);
router.post('/usuarios', verificarADM, insertUsuarios);
router.get('/usuarios', verificarADM, selectAllUser);
router.get('/usuarios/:registro', verificarADM, selectUser);
router.put('/usuarios', verificarADM, updateUsuarios);
router.delete('/usuarios/:registro', verificarADM, deleteUsuarios);

//router.get('/rotas', verificarUSER, usuariosRotas);
router.post('/rota', insertRota);
router.post('/rotas',verificarUSER, selectRotas);
router.post('/segmento', insertSegmento);
//router.post('/segmento', insertSegmentos);
router.post('/ponto',insertPonto);
router.post('/rotasegmento', insertRotaSegmento);
//router.get('/selectRotasSemFiltro/:origem/:destino', selectRotasSemFiltro);
//router.get('/rotas',selectAllRotas);
router.get('/segmentos',selectAllSegmentos);

export default router;