const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");

const getUsuarios = async (req, res) => {
  const desde = Number(req.query.desde) || 0;

  // const usuarios = await Usuario.find({}, "nombre email role google").skip(desde).limit(5);
  // const total = await Usuario.countDocuments();

  const [usuarios, total] = await Promise.all([
    Usuario.find({}, "nombre email role google img").skip(desde).limit(5),
    Usuario.countDocuments(),
  ]);

  res.json({
    ok: true,
    usuarios,
    total,
  });
};

const crearUsuarios = async (req, res = response) => {
  const { email, password, nombre } = req.body;

  try {
    const existeEmail = await Usuario.findOne({ email });

    if (existeEmail) {
      return res.status(400).json({
        ok: false,
        msg: "Email already exists",
      });
    }

    const usuario = new Usuario(req.body);

    //Encriptar contraseña

    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Generar el Token - JWT
    const token = await generarJWT(usuario.id);

    // Guardar usuario
    await usuario.save();

    res.json({
      ok: true,
      usuario,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Error Inesperado",
    });
  }
};

const actualizarUsuario = async (req, res = response) => {
  //Todo:  Validar token y comprobar si es el usuario correcto

  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese Id",
      });
    }

    // Actualizaciones
    const { password, google, email, ...campos } = req.body;

    if (usuarioDB.email !== email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          ok: false,
          msg: "Email already exists",
        });
      }
    }

    if(!usuarioDB.google){
      campos.email = email;
    } else if(usuarioDB.email !== email){
      return res.status(400).json({
        ok:false,
        msg: 'Usuario de google no puede cambiar su correo.'
      })
    }

    const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos);

    res.json({
      ok: true,
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

const deleteUsuario = async (req, res = response) => {
  const uid = req.params.id;

  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "No existe un usuario con ese Id",
      });
    }

    await Usuario.findByIdAndDelete(uid);

    res.status(200).json({
      ok: true,
      msg: "Usuario deleted successfully",
      uid,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error inesperado",
    });
  }
};

module.exports = {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  deleteUsuario,
};
