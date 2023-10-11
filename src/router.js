import { Router } from "express";
import { insertUsuarios, selectAllUser, selectUser, updateUsuarios, deleteUsuarios, usuarioLogin, usuarioLogout } from './controller/Usuarios.js';
import { usuariosRotas, insertRota, insertSegmento, insertRotaSegmento, selectRotas, selectRotasSemFiltro } from "./controller/Rotas.js";
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
router.delete('/usuarios', verificarADM, deleteUsuarios);

//router.get('/rotas', verificarUSER, usuariosRotas);
router.post('/rotas', insertRota);
router.get('/rotas/:inicio/:fim',verificarUSER, selectRotas);
router.post('/segmento', insertSegmento);
router.post('/rotasegmento', insertRotaSegmento);
router.get('/selectRotasSemFiltro/:inicio/:fim', selectRotasSemFiltro);

export default router;