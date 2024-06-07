const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Conectar a la base de datos de MongoDB
mongoose.connect('mongodb://localhost:27017/escuela', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir los esquemas de Mongoose
const MaestroSchema = new mongoose.Schema({
  nombre: String,
  materias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Materia' }]
});

const MateriaSchema = new mongoose.Schema({
  nombre: String
});

// Crear los modelos de Mongoose
const Maestro = mongoose.model('Maestro', MaestroSchema);
const Materia = mongoose.model('Materia', MateriaSchema);

// Ruta para crear un maestro
app.post('/maestros', async (req, res) => {
  const maestro = new Maestro(req.body);
  await maestro.save();
  res.send(maestro);
});

// Ruta para crear una materia
app.post('/materias', async (req, res) => {
  const materia = new Materia(req.body);
  await materia.save();
  res.send(materia);
});

// Ruta para asignar materias a un maestro
app.post('/asignar-materias', async (req, res) => {
  const { maestroId, materiaIds } = req.body;
  const maestro = await Maestro.findById(maestroId);
  maestro.materias.push(...materiaIds);
  await maestro.save();
  res.send(maestro);
});

// Ruta para obtener todos los maestros con sus materias
app.get('/maestros', async (req, res) => {
  const maestros = await Maestro.find().populate('materias');
  res.send(maestros);
});

// Ruta para obtener todas las materias
app.get('/materias', async (req, res) => {
  const materias = await Materia.find();
  res.send(materias);
});

// Ruta para eliminar un maestro
app.delete('/maestros/:id', async (req, res) => {
  await Maestro.findByIdAndDelete(req.params.id);
  res.send({ message: 'Maestro eliminado' });
});

// Ruta para eliminar una materia
app.delete('/materias/:id', async (req, res) => {
  await Materia.findByIdAndDelete(req.params.id);
  res.send({ message: 'Materia eliminada' });
});

// Ruta para actualizar un maestro
app.put('/maestros/:id', async (req, res) => {
  const maestro = await Maestro.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(maestro);
});

// Ruta para actualizar una materia
app.put('/materias/:id', async (req, res) => {
  const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(materia);
});


// Iniciar el servidor
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});