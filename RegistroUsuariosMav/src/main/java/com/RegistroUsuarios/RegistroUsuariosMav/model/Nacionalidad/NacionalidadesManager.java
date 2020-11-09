package com.RegistroUsuarios.RegistroUsuariosMav.model.Nacionalidad;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

public class NacionalidadesManager {
	private static EntityManagerFactory FACTORY;
	private static EntityManager ENTITY_MANAGER;

	// Retorna todas las nacionalidades desde la base de datos
	public static List<Nacionalidad> findAll() {
		begin();
		String q = "Select n From Nacionalidad n";
		Query query = ENTITY_MANAGER.createQuery(q);
		List<Nacionalidad> nacionalidades = query.getResultList();
		end();
		return nacionalidades;
	}

	// Finaliza la transacción
	private static void end() {
		ENTITY_MANAGER.getTransaction().commit();
		ENTITY_MANAGER.close();
		FACTORY.close();
	}

	// Inicia la transacción
	private static void begin() {
		FACTORY = Persistence.createEntityManagerFactory("UsuarioUnit");
		ENTITY_MANAGER = FACTORY.createEntityManager();
		ENTITY_MANAGER.getTransaction().begin();
	}
}
