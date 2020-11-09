package com.RegistroUsuarios.RegistroUsuariosMav.ws;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.core.MediaType;

import com.RegistroUsuarios.RegistroUsuariosMav.model.Usuario.Usuario;
import com.RegistroUsuarios.RegistroUsuariosMav.model.Usuario.UsuariosManager;

import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

@Path("usuarios/")
public class UsuarioWebService {
	// Endpoint para retornar todos usuarios de la base de datos
	@GET
	@Path("json")
	@Produces(MediaType.APPLICATION_JSON)

	public List<Usuario> getUsuarios() {
		return UsuariosManager.findAll();
	}

	// Endpoint para retornar un usuario de la base de datos dado su id
	@GET
	@Path("json/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Usuario getUsuarioById(@PathParam("id") int id) {
		Usuario usuario = UsuariosManager.findById(id);
		if (usuario != null)
			return usuario;
		else
			return null;
	}

	// Endpoint para crear un usuario en la base de datos
	@POST
	@Path("usuario")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public void createUsuario(Usuario usuario) {
		UsuariosManager.create(usuario);
	}

	// Endpoint para actualizar un usuario en la base de datos
	@PUT
	@Path("usuario")
	@Produces(MediaType.APPLICATION_JSON)
	public void updateUsuario(Usuario usuario) {
		UsuariosManager.update(usuario);
	}
}
