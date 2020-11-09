package com.RegistroUsuarios.RegistroUsuariosMav.model.Nacionalidad;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.xml.bind.annotation.XmlRootElement;

import com.RegistroUsuarios.RegistroUsuariosMav.model.TipoDocumento.TipoDocumento;

//Entidad que representa las nacionalidades a las que puede pertenecer un usuario.
@XmlRootElement
@Entity
@Table(name = "nacionalidades")
public class Nacionalidad {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(nullable = false)
	private int id;
	@Column(nullable = false)
	private String nombre;
	@JoinColumn(name = "tipo_documento", nullable = true)
	@ManyToOne(optional = true, fetch = FetchType.EAGER)
	private TipoDocumento tipoDocumento;

	public Nacionalidad() {
		super();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public TipoDocumento getTipoDocumento() {
		return tipoDocumento;
	}

	public void setTipoDocumento(TipoDocumento tipoDocumento) {
		this.tipoDocumento = tipoDocumento;
	}
}
