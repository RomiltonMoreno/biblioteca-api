const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Base de données fictive pour commencer (on connectera Postgres plus tard)
let livres = [
    { id: 1, titre: "Le Petit Prince", auteur: "Antoine de Saint-Exupéry" },
    { id: 2, titre: "1984", auteur: "George Orwell" }
];

// Route de test
app.get('/', (req, res) => {
    res.send('API de Gestion de Bibliothèque opérationnelle !');
});

// GET : Liste de tous les livres
app.get('/api/livres', (req, res) => {
    res.json(livres);
});

// POST : Ajouter un livre
app.post('/api/livres', (req, res) => {
    const nouveauLivre = { id: livres.length + 1, ...req.body };
    livres.push(nouveauLivre);
    res.status(201).json(nouveauLivre);
});

app.listen(port, () => {
    console.log(`Serveur lancé sur http://localhost:${port}`);
});