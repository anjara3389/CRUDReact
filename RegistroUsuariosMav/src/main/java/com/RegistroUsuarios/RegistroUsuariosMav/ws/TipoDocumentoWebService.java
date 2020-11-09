package com.RegistroUsuarios.RegistroUsuariosMav.ws;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.core.MediaType;

import com.RegistroUsuarios.RegistroUsuariosMav.model.TipoDocumento.TipoDocumento;
import com.RegistroUsuarios.RegistroUsuariosMav.model.TipoDocumento.TiposDocumentoManager;

import javax.ws.rs.Path;
import javax.ws.rs.Produces;

@Path("tipos-doc/")
public class TipoDocumentoWebService {

	// Endpoint para retornar todos tipos de documento de la base de datos
	@GET
	@Path("json")
	@Produces(MediaType.APPLICATION_JSON)

	public List<TipoDocumento> getTiposDocumento() {
		return TiposDocumentoManager.findAll();
	}
}
