package com.RegistroUsuarios.RegistroUsuariosMav.ws;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.core.MediaType;

import com.RegistroUsuarios.RegistroUsuariosMav.model.Nacionalidad.Nacionalidad;
import com.RegistroUsuarios.RegistroUsuariosMav.model.Nacionalidad.NacionalidadesManager;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("nacionalidades/")
public class NacionalidadWebService {
	// Endpoint para retornar a todas las nacionalidades de la base de datos
	@GET
	@Path("json")
	@Produces(MediaType.APPLICATION_JSON)

	public List<Nacionalidad> getNacionalidades() {
		return NacionalidadesManager.findAll();
	}
}
