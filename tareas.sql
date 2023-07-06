CREATE DATABASE tareas;

CREATE TABLE tareas (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(255),
  descripcion TEXT,
  completada BOOLEAN,
  usuario_id INTEGER
);

CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255),
  correo VARCHAR(255)
);