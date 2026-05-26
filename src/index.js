const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
const port = 3000;

app.use(express.json());

// Connexion PostgreSQL
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  logging: false
});

// MODÈLES (Database Schema)
const Auteur = sequelize.define('Auteur', {
  nom: { type: DataTypes.STRING, allowNull: false }
});

const Livre = sequelize.define('Livre', {
  titre: { type: DataTypes.STRING, allowNull: false },
  categorie: { type: DataTypes.STRING, allowNull: false }
});

const Emprunt = sequelize.define('Emprunt', {
  nomEmprunteur: { type: DataTypes.STRING, allowNull: false },
  statut: { type: DataTypes.ENUM('en_cours', 'rendu'), defaultValue: 'en_cours' },
  dateEmprunt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  dateRetour: { type: DataTypes.DATE, allowNull: true }
});

// RELATIONS
Auteur.hasMany(Livre);
Livre.belongsTo(Auteur);
Livre.hasMany(Emprunt);
Emprunt.belongsTo(Livre);

// Synchronisation de la base de données
sequelize.sync({ alter: true })
  .then(() => console.log('Base de données synchronisée avec succès.'))
  .catch(err => console.error('Erreur DB:', err));

// --- ROUTES ---

// 1. GESTION DES LIVRES & AUTEURS (CRUD / Inscription)
app.post('/api/auteurs', async (req, res) => {
  const auteur = await Auteur.create(req.body);
  res.status(201).json(auteur);
});

app.post('/api/livres', async (req, res) => {
  const livre = await Livre.create(req.body);
  res.status(201).json(livre);
});

// 2. RECHERCHE MULTI-CRITÈRES (Titre, Auteur ou Catégorie)
app.get('/api/livres/recherche', async (req, res) => {
  const { q } = req.query; // Le mot-clé recherché
  if (!q) return res.status(400).json({ error: "Paramètre de recherche 'q' manquant." });

  const resultats = await Livre.findAll({
    where: {
      [Op.or]: [
        { titre: { [Op.iLike]: `%${q}%` } },
        { categorie: { [Op.iLike]: `%${q}%` } }
      ]
    },
    include: [{ model: Auteur, where: { nom: { [Op.iLike]: `%${q}%` } }, required: false }]
  });
  res.json(resultats);
});

// 3. GESTION DES EMPRUNTS (Création)
app.post('/api/emprunts', async (req, res) => {
  const { nomEmprunteur, LivreId } = req.body;
  
  // Vérifier si le livre est déjà emprunté et non rendu
  const dejaEmprunte = await Emprunt.findOne({ where: { LivreId, statut: 'en_cours' } });
  if (dejaEmprunte) return res.status(400).json({ error: "Ce livre est déjà emprunté." });

  const nouvelEmprunt = await Emprunt.create({ nomEmprunteur, LivreId });
  res.status(201).json(nouvelEmprunt);
});

// 4. GESTION DES RENDUS (Retour d'un livre)
app.put('/api/emprunts/:id/rendu', async (req, res) => {
  const emprunt = await Emprunt.findByPk(req.params.id);
  if (!emprunt || emprunt.statut === 'rendu') {
    return res.status(404).json({ error: "Emprunt actif introuvable ou déjà rendu." });
  }

  emprunt.statut = 'rendu';
  emprunt.dateRetour = new Date();
  await emprunt.save();
  res.json({ message: "Livre bien retourné !", emprunt });
});

// 5. HISTORIQUE DES TRANSACTIONS & EMPRUNTS EN COURS
app.get('/api/transactions', async (req, res) => {
  const { statut } = req.query; // Filtre optionnel : ?statut=en_cours ou ?statut=rendu
  const filtre = statut ? { statut } : {};

  const historique = await Emprunt.findAll({
    where: filtre,
    include: [Livre],
    order: [['createdAt', 'DESC']]
  });
  res.json(historique);
});

app.listen(port, () => console.log(`Serveur actif sur le port ${port}`));