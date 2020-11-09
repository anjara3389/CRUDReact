package com.RegistroUsuarios.RegistroUsuariosMav.model.Usuario;

import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

public class UsuariosManager {
	private static EntityManagerFactory FACTORY;
	private static EntityManager ENTITY_MANAGER;

	// Crea un usuario en la base de datos
	public static void create(Usuario nUsuario) {
		begin();
		ENTITY_MANAGER.persist(nUsuario);
		end();
	}

	// Actualiza un usuario en la base de datos
	public static void update(Usuario usuario) {
		begin();
		ENTITY_MANAGER.merge(usuario);
		end();
	}

	// Retorna un usuario dado su id en la base de datos
	public static Usuario findById(int id) {
		begin();
		Usuario usuario = ENTITY_MANAGER.find(Usuario.class, id);
		end();
		return usuario;
	}

    // Retorna todos los usuarios de la base de datos
	public static List<Usuario> findAll() {
		begin();
		String q = "Select u From Usuario u";
		Query query = ENTITY_MANAGER.createQuery(q);
		List<Usuario> usuarios = query.getResultList();
		end();
		return usuarios;
	}
   //finaliza una transacción
	private static void end() {
		ENTITY_MANAGER.getTransaction().commit();
		ENTITY_MANAGER.close();
		FACTORY.close();
	}
	//crea una transacción
	private static void begin() {
		FACTORY = Persistence.createEntityManagerFactory("UsuarioUnit");
		ENTITY_MANAGER = FACTORY.createEntityManager();
		ENTITY_MANAGER.getTransaction().begin();
	}

}
