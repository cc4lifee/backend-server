const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Verificar Email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no valido",
      });
    }

    // Verificar password
    const validPassword = bcryptjs.compareSync(password, usuarioDB.password);

    if (!validPassword) {
      return res.status(404).json({
        ok: false,
        msg: "Contraseña no valida",
      });
    }

    // Generar el Token - JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con administrator",
    });
  }
};

const googleSingIn = async (req, res) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    const usuarioDB = await Usuario.findOne({ email });

    let usuario;

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "@@@",
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Guardar usuario
    await usuario.save();

    console.log(usuario.id);

    // Generar el Token - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      email,
      name,
      picture,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Token de google no es correcto",
    });
  }
};

const renewToken = async (req, res = response) => {
  const uid = req.uid;

  // Generar el Token - JWT
  const token = await generarJWT(uid);

  //Obtener el usuario por UID 
  const usuario = await Usuario.findById(uid);

  res.json({
    ok: true,
    token,
    usuario
  });
};

module.exports = {
  login,
  googleSingIn,
  renewToken,
};
