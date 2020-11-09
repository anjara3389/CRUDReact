package com.RegistroUsuarios.RegistroUsuariosMav.model.TipoDocumento;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

public class TiposDocumentoManager {
	private static EntityManagerFactory FACTORY;
	private static EntityManager ENTITY_MANAGER;

	//Retorna todos los tipos de documento de la base de datos
	public static List<TipoDocumento> findAll() {
		begin();
		String q = "Select t From TipoDocumento t";
		Query query = ENTITY_MANAGER.createQuery(q);
		List<TipoDocumento> tiposDocumento =  query.getResultList();
		end();
		return tiposDocumento;
	}
	//Finaliza una transacción
	private static void end() {
		ENTITY_MANAGER.getTransaction().commit();
		ENTITY_MANAGER.close();
		FACTORY.close();
	}
	//Crea una transacción
	private static void begin() {
		FACTORY = Persistence.createEntityManagerFactory("UsuarioUnit");
		ENTITY_MANAGER = FACTORY.createEntityManager();
		ENTITY_MANAGER.getTransaction().begin();
	}

}
