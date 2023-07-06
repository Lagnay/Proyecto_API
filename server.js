const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'tareas',
  password: 'Vale2902',
  port: 5432,
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Crear una nueva tarea
app.post('/tareas', async (req, res) => {
    const { titulo, descripcion, usuario_id } = req.body;
  
    try {
      const { rows } = await pool.query('INSERT INTO tareas (titulo, descripcion, completada, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *', [titulo, descripcion, false, usuario_id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Leer todas las tareas
  app.get('/tareas', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT * FROM tareas');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Leer una tarea específica
  app.get('/tareas/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const { rows } = await pool.query('SELECT * FROM tareas WHERE id = $1', [id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Actualizar una tarea
  app.put('/tareas/:id', async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, completada, usuario_id } = req.body;
  
    try {
      const { rows } = await pool.query('UPDATE tareas SET titulo = $1, descripcion = $2, completada = $3, usuario_id = $4 WHERE id = $5 RETURNING *', [titulo, descripcion, completada, usuario_id, id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Eliminar una tarea
  app.delete('/tareas/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
      res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Asignar una tarea a un usuario
  app.post('/tareas/:id/usuario', async (req, res) => {
    const { id } = req.params;
    const { usuario_id } = req.body;
  
    try {
      const { rows } = await pool.query('UPDATE tareas SET usuario_id = $1 WHERE id = $2 RETURNING *', [usuario_id, id]);
      res.json(rows[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

const port = 3000;

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
