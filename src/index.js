const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

app.use(express.json());

// Connexion à PostgreSQL via les variables d'environnement de Docker
const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false
  }
);

// Définition du modèle Livre (Database Schema)
const Livre = sequelize.define('Livre', {
  titre: { type: DataTypes.STRING, allowNull: false },
  auteur: { type: DataTypes.STRING, allowNull: false }
});

// Synchronisation avec la base de données
sequelize.sync({ alter: true })
  .then(() => console.log('Base de données PostgreSQL synchronisée.'))
  .catch(err => console.error('Erreur de synchronisation DB:', err));

// Routes API REST actualisées
app.get('/api/livres', async (req, res) => {
  const livres = await Livre.findAll();
  res.json(livres);
});

app.post('/api/livres', async (req, res) => {
  try {
    const nouveauLivre = await Livre.create(req.body);
    res.status(201).json(nouveauLivre);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur actif sur le port ${port}`);
});