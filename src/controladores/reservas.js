// controlador: convierte solicitud y datos en respuesta HTTP
function crearControladorReservas(servicioReservas) {
  const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
  const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

  // listado de reservas
  function listar(req, res) {
    res.render("reservas/lista", {
      titulo: "Reservas de salas",
      reservas: servicioReservas.listar(),
    });
  }

  // formulario de nueva reserva
  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: null,
      valores: {},
      salasPermitidas,
      turnosPermitidos,
    });
  }

  // detalle de una reserva
  function mostrarDetalle(req, res) {
    const id = Number(req.params.id);
    const reserva = servicioReservas.obtenerPorId(id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "No existe una reserva con ese identificador.",
      });
    }

    res.render("reservas/detalle", {
      titulo: `Reserva de ${reserva.estudiante}`,
      reserva,
    });
  }

  // crea una reserva desde el formulario
  function crear(req, res) {
    servicioReservas.crear(req.reservaValidada);
    res.redirect("/reservas");
  }

  // responde JSON con el estado del servicio
  function mostrarEstado(req, res) {
    res.json({
      servicio: "activo",
      reservas: servicioReservas.contar(),
      solicitudId: res.locals.solicitudId,
    });
  }

  return { listar, mostrarFormulario, mostrarDetalle, crear, mostrarEstado };
}

module.exports = { crearControladorReservas };
