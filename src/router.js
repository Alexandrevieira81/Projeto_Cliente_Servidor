import { Router } from "express";
import { insertUsuarios, selectUsuarios, updateUsuarios, deleteUsuarios, usuarioLogin, usuarioLogout } from './controller/Usuarios.js';
import { usuariosRotas, insertRota, insertSegmento, insertRotaSegmento, selectRotas, selectRotasSemFiltro } from "./controller/Rotas.js";
import { verificarADM, verificarUSER } from "./funcoes.js";
const router = Router();



router.get('/', (req, res) => {

    res.send("Trabalhando com rotas.!")
})
router.post('/logout', usuarioLogout);
router.post('/login', usuarioLogin);
router.post('/usuarios', verificarADM, insertUsuarios);
router.get('/usuarios', verificarADM, selectUsuarios);
router.put('/usuarios', verificarADM, updateUsuarios);
router.delete('/usuarios', verificarADM, deleteUsuarios);

//router.get('/rotas', verificarUSER, usuariosRotas);
router.post('/rotas', insertRota);
router.get('/rotas/:inicio/:fim', selectRotas);
router.post('/segmento', insertSegmento);
router.post('/rotasegmento', insertRotaSegmento);
router.get('/selectRotasSemFiltro/:inicio/:fim', selectRotasSemFiltro);

export default router;