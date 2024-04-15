const express = require("express");
const { dbConnection } = require("./database/config");
require("dotenv").config();
const cors = require("cors");

//Crear el servidor Express
const app = express();

//Configurar CORS
app.use(cors());

//Carpeta publica 
app.use(express.static('public'))

// Lectura y parseo del body
app.use(express.json());

//Base de datos
dbConnection();

/* Rutas */
app.use("/api/usuarios", require("./routes/usuarios"));
//Login
app.use("/api/login", require("./routes/auth"));
// Hospitales
app.use("/api/hospitales", require("./routes/hospitales"));
// Medicos
app.use("/api/medicos", require("./routes/medicos"));
// Busqueda
app.use("/api/todo", require("./routes/busquedas"));
// Upload
app.use("/api/upload", require("./routes/uploads"));



app.listen(process.env.PORT, () => {
  console.log("Servidor Express listening on port " + process.env.PORT);
});
