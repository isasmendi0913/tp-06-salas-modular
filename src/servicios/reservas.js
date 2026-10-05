// servicio dueño del arreglo en memoria
function crearServicioReservas(reservasIniciales) {
  const reservas = [...reservasIniciales];

  function listar() {
    return [...reservas];
  }

  function obtenerPorId(id) {
    return reservas.find((r) => r.id === id) ?? null;
  }

  function contar() {
    return reservas.length;
  }

  function crear(datosValidados) {
    const ultimoId = reservas.reduce((mayor, r) => Math.max(mayor, r.id), 0);
    const nueva = { id: ultimoId + 1, ...datosValidados };
    reservas.push(nueva);
    return nueva;
  }

  return { listar, obtenerPorId, contar, crear };
}

module.exports = { crearServicioReservas };