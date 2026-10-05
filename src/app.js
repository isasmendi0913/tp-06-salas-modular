// construye la aplicación Express
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");
const {
  crearIdentificadorSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearRouterReservas } = require("./rutas/reservas");

function crearApp({ servicioReservas, formatoRegistro }) {
  const app = express();

  // construye controlador y router del área
  const controladorReservas = crearControladorReservas(servicioReservas);
  const reservasRouter = crearRouterReservas(controladorReservas);

  // configuración de vistas
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.set("layout", "layouts/main");

  // pipeline de middleware
  app.use(morgan(formatoRegistro));
  app.use(crearIdentificadorSolicitud());
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // rutas de aplicación
  app.get("/", (req, res) => {
    res.render("inicio", { titulo: "Sistema de reservas" });
  });

  app.get("/estado", controladorReservas.mostrarEstado);

  // montaje del router
  app.use("/reservas", reservasRouter);

  // página 404 final
  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = { crearApp };
