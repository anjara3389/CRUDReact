import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Card from 'react-bootstrap/Card';

import {
  Table,
  Button,
  Container,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonGroup,
} from "reactstrap";

class App extends React.Component {
  ESTADO_INACTIVO = 0; //Estado del usuario inactivo
  ESTADO_ACTIVO = 1; //Estado del usuario activo

  state = {
    rawUsuarios: [], //Array donde se almacenan todos los usuarios
    usuarios: [], //Array donde se almacenan los usuarios que se muestran en la lista teniendo en cuenta los filtros
    rawTiposDocumento: [],
    tiposDocumento: [],//Array donde se almacenan tipos de documento
    nacionalidades: [],//Array donde se almacenan las nacionalidades
    modalInsertar: false, //modal insertar se muestra
    modalEliminar: false, //modal confirmación de eliminación se muestra
    modalFiltrar: false, //modal filtrar se muestra
    modalAlerta: false, //modal para alerta se muestra
    form: { //ELementos del formulario
      id: '',
      nombre: '',
      apellido: '',
      tipoDocumento: null,
      numeroDocumento: '',
      email: '',
      telefono: '',
      fecha: '',
      nacionalidad: null,
      observaciones: '',
      estado: ''
    },
    filtro: { //Elementos de filtro
      filtDocumento: '',
      filtNombre: '',
      filtApellido: ''
    },
    alert: { //Elementos de la alerta de operación exitosa o error.
      tipo: '',
      titulo: '',
      contenido: ''
    },
    validacion: { //Parámetros de validación del formulario
      nombre: true,
      apellido: true,
      nacionalidad: true,
      tipoDocumento: true,
      email: true
    }
  }

  componentDidMount() {
    this.getUsuarios();
  }

  //Trae los usuarios, tipos de documento y nacionalidades para llenar lista de usuarios y respectivos combos.
  getUsuarios = () => {
    axios.get(`/usuarios/json`).then(response => {
      return axios.get(`/tipos-doc/json`).then(respTiposDoc => {
        return axios.get(`/nacionalidades/json`).then(resNacio => {
          this.setState({
            rawUsuarios: response.data != null ? (Array.isArray(response.data.usuario) ? response.data.usuario : [response.data.usuario]) : [],
            usuarios: response.data != null ? (Array.isArray(response.data.usuario) ? response.data.usuario : [response.data.usuario]) : [],
            rawTiposDocumento: Array.isArray(respTiposDoc.data.tipoDocumento) ? respTiposDoc.data.tipoDocumento : [respTiposDoc.data.tipoDocumento],
            tiposDocumento: Array.isArray(respTiposDoc.data.tipoDocumento) ? respTiposDoc.data.tipoDocumento : [respTiposDoc.data.tipoDocumento],
            nacionalidades: Array.isArray(resNacio.data.nacionalidad) ? resNacio.data.nacionalidad : [resNacio.data.nacionalidad]
          });
        });
      });
    }).catch(error => {
      console.log(error.message);
      this.crearAlert(this.ALERT_ERROR, 'Error', error.message.toString());
    })
  }

  //Valida los campos obligatorios del formulario de creación y edición de usuarios
  validarCamposFormulario = () => {
    if (this.state.form != null) {
      const usu = this.state.usuarios.find(u => (u.id !== this.state.form.id) && this.state.form.numeroDocumento === u.numeroDocumento);
      if (usu == null) {
        this.setState({
          validacion: {
            nombre: this.state.form.nombre != null && !(this.state.form.nombre.trim() === ""),
            apellido: this.state.form.apellido != null && !(this.state.form.apellido.trim() === ""),
            nacionalidad: this.state.form.nacionalidad != null && !(this.state.form.nacionalidad === "x"),
            tipoDocumento: this.state.form.tipoDocumento != null && !(this.state.form.tipoDocumento === "x"),
            email: this.state.form.email != null && !(this.state.form.email.trim() === "") && this.validarEmail()
          }
        }, function () {
          const validacion = this.state.validacion.nombre == true &&
            this.state.validacion.apellido == true &&
            this.state.validacion.nacionalidad == true &&
            this.state.validacion.tipoDocumento == true &&
            this.state.validacion.email == true;
          if (validacion) {
            this.state.tipoModal == 'insertar' ? this.createUsuario() : this.updateUsuario();
          }
        });
      } else {
        this.setState({
          modalAlerta: true,
          alert: {
            tipo: this.ALERT_ERROR,
            titulo: 'Usuario duplicado',
            contenido: 'El número de documento digitado ya exíste.'
          }
        });
      }
    } else {
      this.setState({
        validacion: {
          nombre: false,
          apellido: false,
          nacionalidad: false,
          tipoDocumento: false,
          email: false
        }
      }, function () {
        const validacion = this.state.validacion.nombre == true &&
          this.state.validacion.apellido == true &&
          this.state.validacion.nacionalidad == true &&
          this.state.validacion.tipoDocumento == true &&
          this.state.validacion.email == true;
        console.log("VALIDACION!!!", validacion);
        if (!!validacion) {
          this.state.tipoModal == 'insertar' ? this.createUsuario() : this.updateUsuario();
        }
      });
    }
  }

  //Valida que el campo email en el formulario de creación/edición tenga formato de email
  validarEmail = () => {
    return (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i).test(this.state.form.email);
  }

  //Crea un nuevo usuario
  createUsuario = async () => {
    this.state.form.fecha = new Date();
    this.state.form.estado = this.ESTADO_ACTIVO;
    this.state.form.nacionalidad = this.state.nacionalidades.find(n => (n.id == this.state.form.nacionalidad || n.id == this.state.form.nacionalidad.id));
    this.state.form.tipoDocumento = this.state.tiposDocumento.find(t => (t.id == this.state.form.tipoDocumento || t.id == this.state.form.tipoDocumento.id));
    await axios.post(`/usuarios/usuario`, this.state.form).then(response => {
      this.modalInsertar();
      this.getUsuarios();
      this.crearAlert(this.ALERT_SUCCESS, 'Creación exitosa', '¡El usuario ha sido creado con éxito!');
    }).catch(error => {
      console.log(error.message);
      this.crearAlert(this.ALERT_ERROR, 'Error', error.message.toString());
    });
  }

  //Actualiza un usuario
  updateUsuario = () => {
    this.state.form.nacionalidad = this.state.nacionalidades.find(n => (n.id == this.state.form.nacionalidad || n.id == this.state.form.nacionalidad.id));
    this.state.form.tipoDocumento = this.state.tiposDocumento.find(t => (t.id == this.state.form.tipoDocumento || t.id == this.state.form.tipoDocumento.id));
    axios.put(`/usuarios/usuario/`, this.state.form).then(response => {
      this.modalInsertar();
      this.getUsuarios();
      this.crearAlert(this.ALERT_SUCCESS, 'Edición exitosa', '¡El usuario ha sido editado con éxito!');
    }).catch(error => {
      console.log(error.message);
      this.crearAlert(this.ALERT_ERROR, 'Error', error.message.toString());
    });
  }

  //Elimina un usuario
  deleteUsuario = () => {
    this.state.form.estado = this.ESTADO_INACTIVO;
    axios.put(`/usuarios/usuario/`, this.state.form).then(response => {
      this.setState({ modalEliminar: false });
      this.getUsuarios();
      this.crearAlert(this.ALERT_SUCCESS, 'Eliminación exitosa', '¡El usuario se ha desactivado con éxito!');
    }).catch(error => {
      console.log(error.message);
      this.crearAlert(this.ALERT_ERROR, 'Error', error.message.toString());
    });
  }

  //Rellena la información del usuario elegido en el formulario de edición
  seleccionarUsuario = (usuario) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        tipoDocumento: usuario.tipoDocumento,
        numeroDocumento: usuario.numeroDocumento,
        email: usuario.email,
        telefono: usuario.telefono,
        fecha: usuario.fecha,
        nacionalidad: usuario.nacionalidad,
        observaciones: usuario.observaciones,
        estado: usuario.estado
      }
    })
  }

  //Filtra los usuarios por documento,nombre y apellido
  filtrar = () => {
    if (this.state.filtro != null) {
      const filtDoc = this.state.filtro.filtDocumento != null && this.state.filtro.filtDocumento.trim().length != 0;
      const filtNombre = this.state.filtro.filtNombre != null && this.state.filtro.filtNombre.trim().length != 0;
      const filtApellido = this.state.filtro.filtApellido != null && this.state.filtro.filtApellido.trim().length != 0;

      this.state.usuarios = this.state.rawUsuarios.filter((u) => {
        let incluir = true;
        if (filtDoc) {
          incluir = incluir && u.numeroDocumento.includes(this.state.filtro.filtDocumento);
        }
        if (filtNombre) {
          incluir = incluir && u.nombre.toUpperCase().includes(this.state.filtro.filtNombre.toUpperCase());
        }
        if (filtApellido) {
          incluir = incluir && u.apellido.toUpperCase().includes(this.state.filtro.filtApellido.toUpperCase());
        }
        return incluir;
      });
    } else {
      this.state.usuarios = this.state.rawUsuarios;
    }
    this.modalFiltrar();
  }

  //Muestra u oculta la modal para insertar nuevo usuario
  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }
  //Muestra u oculta la modal para filtrar usuarios
  modalFiltrar = () => {
    this.setState({ modalFiltrar: !this.state.modalFiltrar });
  }
  //Muestra u oculta la modal para mostrar las alertas de operación exitosa y error
  modalAlerta = () => {
    this.setState({ modalAlerta: !this.state.modalAlerta });
  }

  isNullOrEmpty = (value) => {
    return (!value || value == undefined || value == "" || value.length == 0);
  }


  //LLena los datos a mostrarse en la alerta de operación exitosa y error.
  crearAlert = (tipo, titulo, contenido) => {
    this.state.alert.tipo = tipo;
    this.state.alert.titulo = titulo;
    this.state.alert.contenido = contenido;
    this.modalAlerta();
  }

  //Define cambios en los valores del formulario de creación o edición de usuarios
  handleChange = async e => {
    if (e.target.id === 'nacionalidad') {
      const nacionalidad = this.state.nacionalidades.find(n => n.id == e.target.value);
      if (nacionalidad != null && nacionalidad.tipoDocumento != null) {
        this.setState({
          tiposDocumento: this.state.rawTiposDocumento.filter(t => t.id === nacionalidad.tipoDocumento.id)
        });
      } else {
        let tipos = new Array();
        this.state.nacionalidades.forEach(nac => {
          if (nac.tipoDocumento != null) {
            tipos.push(nac.tipoDocumento.id);
          }
        });
        this.setState({
          tiposDocumento: this.state.rawTiposDocumento.filter(t => !tipos.includes(t.id))
        });
      }
    }
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
  }

  //Define cambios en los valores del formulario de flitrado de usuarios
  handleChangeFilt = async e => {
    e.persist();
    await this.setState({
      filtro: {
        ...this.state.filtro,
        [e.target.name]: e.target.value
      }
    });
  }

  render() {
    const { form } = this.state;
    const { filtro } = this.state;

    let margin = {
      marginRight: '1%',
    };

    let validation = {
      //input:invalid:required
      border: '2px', color: 'dashed red'
    };

    return (
      <>
        <Container fluid>
          <Card>
            <Card.Header style={{ background: '#56BFFF', color: 'white' }}> <h1>Gestión de Usuarios</h1></Card.Header>
            <Card.Body>
              <Button color="success" style={margin} onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Crear</Button>
              <Button color="secondary" onClick={() => { this.setState({ filtro: null, tipoModal: 'filtrar' }); this.modalFiltrar() }}>Filtrar</Button>
              <br />
              <br />
              <Table responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Apellido</th>
                    <th>Tipo de Documento</th>
                    <th>Documento</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Nacionalidad</th>
                    <th>Observaciones</th>
                    <th>Estado</th>
                    <th>Opciones</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.usuarios.map(usuario => {
                    return (
                      <tr key={usuario.id}>
                        <td>{usuario.nombre}</td>
                        <td>{usuario.apellido}</td>
                        <td>{usuario.tipoDocumento.nombre}</td>
                        <td>{usuario.numeroDocumento}</td>
                        <td>{usuario.email}</td>
                        <td>{usuario.telefono}</td>
                        <td>{new Date(usuario.fecha).toLocaleDateString()}</td>
                        <td>{usuario.nacionalidad.nombre}</td>
                        <td>{usuario.observaciones}</td>
                        <td>{usuario.estado == this.ESTADO_ACTIVO ? "Activo" : "Inactivo"}</td>
                        <td>
                          <ButtonGroup>
                            <Button color="primary" size="sm" onClick={() => { this.seleccionarUsuario(usuario); this.modalInsertar() }}>Editar</Button>{" "}
                            {usuario.estado == this.ESTADO_ACTIVO ?
                              <Button color="danger" size="sm" onClick={() => { this.seleccionarUsuario(usuario); this.setState({ modalEliminar: true }) }}>Eliminar</Button>
                              : ''}
                          </ButtonGroup>
                        </td>
                      </tr>
                    )
                  })
                  }
                </tbody>
              </Table>
              <Modal isOpen={this.state.modalInsertar}>
                <ModalHeader style={{ display: 'block', background: '#56BFFF' }}>
                  <div className="container">
                    <div className="row">
                      <div className="col-11">
                        <h4 style={{ float: 'left', color: 'white' }}>{this.state.tipoModal == 'insertar' ? 'Crear' : 'Editar'}</h4>
                      </div>
                      <div className="col-1">
                        <span style={{ float: 'right', color: 'white' }} onClick={() => this.modalInsertar()}>x</span>
                      </div>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group container">
                    <div className="row">
                      <div className="col-6">
                        <label className="negrita" htmlFor="nombre">Nombre*:</label>
                        <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} required />
                        {this.state.validacion.nombre == false ?
                          <p className="error">Campo obligatorio</p>
                          : ''}
                      </div>
                      <div className="col-6">
                        <label className="negrita" htmlFor="apellido">Apellido*:</label>
                        <input className="form-control" type="text" name="apellido" id="apellido" onChange={this.handleChange} value={form ? form.apellido : ''} required />
                        {!this.state.validacion.apellido ?
                          <p className="error">Campo obligatorio</p>
                          : ''}
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-6">
                        <label className="negrita" htmlFor="nacionalidad">Nacionalidad*:</label>
                        <select className="form-control" type="text" name="nacionalidad" id="nacionalidad" onChange={this.handleChange} value={form ? (form.nacionalidad ? form.nacionalidad.id : '') : ''}>
                          <option value="x">Seleccione...</option>
                          {this.state.nacionalidades.map(nac => {
                            return (
                              <option value={nac.id}>{nac.nombre}</option>
                            )
                          })
                          }
                        </select>
                        {!this.state.validacion.nacionalidad ?
                          <p className="error">Campo obligatorio</p>
                          : ''}
                      </div>
                      <div className="col-6">
                        <label className="negrita" htmlFor="tipoDocumento">Tipo Documento*:</label>
                        <select className="form-control" type="text" name="tipoDocumento" id="tipoDocumento" onChange={this.handleChange} value={form ? (form.tipoDocumento ? form.tipoDocumento.id : '') : ''} required>
                          <option value="x">Seleccione...</option>
                          {this.state.tiposDocumento.map(tipo => {
                            return (
                              <option value={tipo.id}>{tipo.nombre}</option>
                            )
                          })
                          }
                        </select>
                        {!this.state.validacion.tipoDocumento ?
                          <p className="error">Campo obligatorio</p>
                          : ''}
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="numeroDocumento">Documento:</label>
                        <input className="form-control" type="number" name="numeroDocumento" id="numeroDocumento" onChange={this.handleChange} value={form ? form.numeroDocumento : ''} />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-6">
                        <label className="negrita" htmlFor="email">Email*:</label>
                        <input className="form-control" type="email" name="email" id="email" onChange={this.handleChange} value={form ? form.email : ''} />
                        {!this.state.validacion.email ?
                          <p className="error">Campo obligatorio</p>
                          : ''}
                      </div>
                      <div className="col-6">
                        <label htmlFor="telefono">Teléfono:</label>
                        <input className="form-control" type="text" name="telefono" id="telefono" onChange={this.handleChange} value={form ? form.telefono : ''} />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="observaciones">Observaciones:</label>
                        <input className="form-control" type="text" name="observaciones" id="observaciones" onChange={this.handleChange} value={form ? form.observaciones : ''} />
                      </div>
                    </div>
                    <br />
                    <div className="row">
                      <div className="col-12">
                        {this.state.tipoModal != 'insertar' ?
                          <label htmlFor="estado">Estado:</label>
                          : ''}
                        {this.state.tipoModal != 'insertar' ?
                          <select disabled className="form-control" type="text" name="estado" id="estado" onChange={this.handleChange} value={form ? (form.estado ? form.estado : '') : ''}>
                            <option value={this.ESTADO_ACTIVO}>Activo</option>
                            <option value={this.ESTADO_INACTIVO}>Inactivo</option>
                          </select> : ''}
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button style={margin} className="btn btn-success" onClick={() => this.validarCamposFormulario()}>
                    Aceptar
                  </button>
                  <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
              </Modal>
              <Modal isOpen={this.state.modalEliminar}>
                <ModalBody>
                  ¿Estás seguro que deseas eliminar el usuario {form && form.nombre}?
            </ModalBody>
                <ModalFooter>
                  <button className="btn btn-danger" onClick={() => this.deleteUsuario()}>Sí</button>
                  <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
                </ModalFooter>
              </Modal>
              <Modal isOpen={this.state.modalFiltrar}>
                <ModalHeader style={{ display: 'block', background: '#56BFFF' }}>
                  <div className="container">
                    <div className="row">
                      <div className="col-11">
                        <h4 style={{ float: 'left', color: 'white' }}>Filtrar</h4>
                      </div>
                      <div className="col-1">
                        <span style={{ float: 'right', color: 'white' }} onClick={() => this.modalFiltrar()}>x</span>
                      </div>
                    </div>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="container">
                    <div className="row">
                      <div className="col-12">
                        <label htmlFor="filtDocumento">Documento:</label>
                        <input className="form-control" type="text" name="filtDocumento" id="filtDocumento" onChange={this.handleChangeFilt} value={filtro ? filtro.filtDocumento : ''} />
                      </div>
                      <div className="col-12">
                        <label htmlFor="filtNombre">Nombre:</label>
                        <input className="form-control" type="text" name="filtNombre" id="filtNombre" onChange={this.handleChangeFilt} value={filtro ? filtro.filtNombre : ''} />
                      </div>
                      <div className="col-12">
                        <label htmlFor="filtApellido">Apellido:</label>
                        <input className="form-control" type="text" name="filtApellido" id="filtApellido" onChange={this.handleChangeFilt} value={filtro ? filtro.filtApellido : ''} />
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <button className="btn btn-success" onClick={() => this.filtrar()}>Filtrar</button>
                </ModalFooter>
              </Modal>
              <Modal isOpen={this.state.modalAlerta}>
                <ModalHeader style={{ float: 'center' }}>
                  {this.state.alert.titulo != null ? this.state.alert.titulo : ''}
                </ModalHeader>
                <ModalBody style={{ float: 'center' }} >
                  {this.state.alert.contenido != null ? this.state.alert.contenido : ''}
                </ModalBody>
                <ModalFooter>
                  <button className="btn btn-primary" onClick={() => this.modalAlerta()}>Ok</button>
                </ModalFooter>
              </Modal>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}
export default App;