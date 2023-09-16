import { Router } from "express";
import { createTableUsuarios, insertUsuarios, selectUsuarios, updateUsuarios, deleteUsuarios, usuarioLogin, usuarioLogout } from './controller/Usuarios.js';
import {verifyJWT} from "./funcoes.js";
const router = Router();


createTableUsuarios();
router.get('/', (req, res) => {

    res.send("Trabalhando com rotas.!")
})
router.post('/logout', usuarioLogout);
router.post('/login', usuarioLogin);
router.post('/usuarios', insertUsuarios);
router.get('/usuarios', verifyJWT, selectUsuarios);
router.put('/usuarios', updateUsuarios);
router.delete('/usuarios', deleteUsuarios);

export default router;