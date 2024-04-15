/* 
    Hospitales
    Ruta: "/api/hospitales"
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const {
  getHospitales,
  crearHospital,
  actualizarHospital,
  borrarHospital,
} = require("../controllers/hospitales");

const router = Router();

// Get
router.get("/", getHospitales);

// Post
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "el nombre del hospital es necesario").notEmpty(),
    validarCampos,
  ],
  crearHospital
);

// Put
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "el nombre del hospital es necesario").notEmpty(),
  ],
  actualizarHospital
);

// Delete
router.delete("/:id", validarJWT, borrarHospital);

module.exports = router;
