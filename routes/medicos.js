/* 
    Medicos
    Ruta: "/api/medicos"
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
} = require("../controllers/medicos");

const router = Router();

// Get
router.get("/", getMedicos);

// Post
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre del medico es necesario").notEmpty(),
    check("hospital", "El hospital id debe ser valido").isMongoId(),
    validarCampos,
  ],
  crearMedico
);

// Put
router.put(
  "/:id",
  [validarJWT, check("nombre", "el nombre del medico es necesario").notEmpty()],
  actualizarMedico
);

// Delete

router.delete("/:id", validarJWT, borrarMedico);

module.exports = router;
