import { useState } from 'react'
import './App.css'

const ESPECIALIDADES = [
  { id: 1, nombre: 'Medicina General', color: '#3B82F6' },
  { id: 2, nombre: 'Pediatría', color: '#10B981' },
  { id: 3, nombre: 'Cardiología', color: '#EF4444' },
  { id: 4, nombre: 'Dermatología', color: '#F59E0B' },
  { id: 5, nombre: 'Neurología', color: '#8B5CF6' },
  { id: 6, nombre: 'Ortopedia', color: '#EC4899' },
]

const MEDICOS = [
  { id: 1, nombre: 'Dr. Carlos Mendoza', especialidad: 1, consultorio: '101', horario: '08:00 - 16:00' },
  { id: 2, nombre: 'Dra. María González', especialidad: 2, consultorio: '102', horario: '07:00 - 15:00' },
  { id: 3, nombre: 'Dr. Roberto Sánchez', especialidad: 3, consultorio: '201', horario: '09:00 - 17:00' },
  { id: 4, nombre: 'Dra. Ana López', especialidad: 4, consultorio: '202', horario: '08:00 - 14:00' },
  { id: 5, nombre: 'Dr. Pedro Ramírez', especialidad: 5, consultorio: '203', horario: '10:00 - 18:00' },
  { id: 6, nombre: 'Dra. Laura Fernández', especialidad: 6, consultorio: '301', horario: '07:00 - 15:00' },
  { id: 7, nombre: 'Dr. Juan Torres', especialidad: 1, consultorio: '104', horario: '12:00 - 20:00' },
  { id: 8, nombre: 'Dra. Carmen Ruiz', especialidad: 2, consultorio: '105', horario: '08:00 - 16:00' },
]

const HORAS_DISPONIBLES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
]

function App() {
  const [vista, setVista] = useState('medicos')
  const [citas, setCitas] = useState([])
  const [filtroEspecialidad, setFiltroEspecialidad] = useState('')
  const [medicoSeleccionado, setMedicoSeleccionado] = useState(null)
  const [formulario, setFormulario] = useState({
    fecha: '',
    hora: '',
    motivo: '',
    nombrePaciente: ''
  })
  const [mostrarReserva, setMostrarReserva] = useState(false)

  const medicosFiltrados = MEDICOS.filter(m => 
    !filtroEspecialidad || m.especialidad === filtroEspecialidad
  )

  const getEspecialidad = (id) => ESPECIALIDADES.find(e => e.id === id)

  const obtenerFechaFormateada = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleReserva = (e) => {
    e.preventDefault()
    if (!medicoSeleccionado || !formulario.fecha || !formulario.hora || !formulario.nombrePaciente) {
      alert('Por favor complete todos los campos')
      return
    }

    const nuevaCita = {
      id: Date.now(),
      ...formulario,
      medico: medicoSeleccionado,
      estado: 'confirmada'
    }

    setCitas([...citas, nuevaCita])
    setMostrarReserva(false)
    setMedicoSeleccionado(null)
    setFormulario({ fecha: '', hora: '', motivo: '', nombrePaciente: '' })
    setVista('citas')
  }

  const cancelarCita = (id) => {
    setCitas(citas.filter(c => c.id !== id))
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1>🏥 Clínica Vida Sana</h1>
          <nav className="nav">
            <button 
              className={`nav-btn ${vista === 'medicos' ? 'active' : ''}`}
              onClick={() => setVista('medicos')}
            >
              Médicos
            </button>
            <button 
              className={`nav-btn ${vista === 'citas' ? 'active' : ''}`}
              onClick={() => setVista('citas')}
            >
              Mis Citas ({citas.length})
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {vista === 'medicos' && (
          <div className="seccion-medicos">
            <div className="filtros">
              <select 
                value={filtroEspecialidad} 
                onChange={(e) => setFiltroEspecialidad(Number(e.target.value) || '')}
              >
                <option value="">Todas las especialidades</option>
                {ESPECIALIDADES.map(esp => (
                  <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                ))}
              </select>
            </div>

            <div className="grid-medicos">
              {medicosFiltrados.map(medico => {
                const esp = getEspecialidad(medico.especialidad)
                return (
                  <div key={medico.id} className="card-medico">
                    <div className="avatar" style={{ backgroundColor: esp.color }}>
                      {medico.nombre.split(' ')[2]?.[0] || medico.nombre.split(' ')[1][0]}
                    </div>
                    <div className="info-medico">
                      <h3>{medico.nombre}</h3>
                      <span className="especialidad" style={{ backgroundColor: esp.color + '20', color: esp.color }}>
                        {esp.nombre}
                      </span>
                      <p className="detalles">📍 Consultorio {medico.consultorio}</p>
                      <p className="detalles">🕐 {medico.horario}</p>
                    </div>
                    <button 
                      className="btn-reservar"
                      onClick={() => {
                        setMedicoSeleccionado(medico)
                        setMostrarReserva(true)
                      }}
                    >
                      Reservar Cita
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {vista === 'citas' && (
          <div className="seccion-citas">
            <h2>Mis Citas Médicas</h2>
            {citas.length === 0 ? (
              <div className="vacio">
                <p>No tienes citas programadas</p>
                <button onClick={() => setVista('medicos')}>Ver Médicos</button>
              </div>
            ) : (
              <div className="lista-citas">
                {citas.map(cita => {
                  const esp = getEspecialidad(cita.medico.especialidad)
                  return (
                    <div key={cita.id} className="card-cita">
                      <div className="cita-header" style={{ borderLeftColor: esp.color }}>
                        <div>
                          <h3>{cita.medico.nombre}</h3>
                          <span className="especialidad" style={{ backgroundColor: esp.color + '20', color: esp.color }}>
                            {esp.nombre}
                          </span>
                        </div>
                        <span className="estado">✓ Confirmada</span>
                      </div>
                      <div className="cita-body">
                        <p><strong>Paciente:</strong> {cita.nombrePaciente}</p>
                        <p><strong>Fecha:</strong> {obtenerFechaFormateada(cita.fecha)}</p>
                        <p><strong>Hora:</strong> {cita.hora}</p>
                        <p><strong>Consultorio:</strong> {cita.medico.consultorio}</p>
                        {cita.motivo && <p><strong>Motivo:</strong> {cita.motivo}</p>}
                      </div>
                      <div className="cita-actions">
                        <button className="btn-cancelar" onClick={() => cancelarCita(cita.id)}>
                          Cancelar Cita
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {mostrarReserva && (
        <div className="modal-overlay" onClick={() => setMostrarReserva(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservar Cita</h2>
              <button className="btn-cerrar" onClick={() => setMostrarReserva(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="medico-resumen">
                <h3>{medicoSeleccionado.nombre}</h3>
                <span>{getEspecialidad(medicoSeleccionado.especialidad).nombre}</span>
              </div>
              <form onSubmit={handleReserva}>
                <div className="form-group">
                  <label>Nombre del Paciente</label>
                  <input 
                    type="text" 
                    value={formulario.nombrePaciente}
                    onChange={(e) => setFormulario({...formulario, nombrePaciente: e.target.value})}
                    placeholder="Ingrese su nombre"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fecha</label>
                  <input 
                    type="date" 
                    value={formulario.fecha}
                    onChange={(e) => setFormulario({...formulario, fecha: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <select 
                    value={formulario.hora}
                    onChange={(e) => setFormulario({...formulario, hora: e.target.value})}
                    required
                  >
                    <option value="">Seleccione una hora</option>
                    {HORAS_DISPONIBLES.map(hora => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Motivo de consulta (opcional)</label>
                  <textarea 
                    value={formulario.motivo}
                    onChange={(e) => setFormulario({...formulario, motivo: e.target.value})}
                    placeholder="Describa el motivo de su consulta"
                    rows="3"
                  />
                </div>
                <button type="submit" className="btn-confirmar">Confirmar Reserva</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
