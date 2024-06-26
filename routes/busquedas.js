/* 
    Busquedas
    Ruta: "/api/todo"
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { getTodo, getDocumentosColeccion } = require("../controllers/busquedas");


const router = Router();

// Get
router.get("/:busqueda", validarJWT, getTodo);

router.get("/coleccion/:tabla/:busqueda", validarJWT, getDocumentosColeccion);

module.exports = router;
