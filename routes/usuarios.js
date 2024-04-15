/*
 Ruta: /api/usuarios
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  deleteUsuario,
} = require("../controllers/usuarios");

const router = Router();

// Get
router.get("/", validarJWT, getUsuarios);

// Post
router.post(
  "/",
  [
    // validarJWT,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  crearUsuarios
);

// Put
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El Nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El rol es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

// Delete

router.delete("/:id", validarJWT, deleteUsuario);

module.exports = router;
