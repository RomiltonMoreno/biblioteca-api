# 📚 API de Gestion de Bibliothèque (Thème 02)

**Auteur :** Romilton Moreno

**GitHub :** https://github.com/RomiltonMoreno

**Projet :** https://github.com/RomiltonMoreno/biblioteca-api


Projet d'évaluation pratique pour le module DevOps réalisé individuellement avec l'autorisation du Pr. Soufiane Hamida.

##  Technologies utilisées
*   **Backend :** Node.js avec le framework Express
*   **Base de données :** PostgreSQL
*   **ORM :** Sequelize
*   **Conteneurisation :** Docker & Docker Compose
*   **CI/CD :** GitHub Actions (Tests automatisés à chaque commit)
*   **Tests :** Jest & Supertest

##  Comment lancer le projet en local

### Prérequis
*   Docker et Docker Compose installés sur votre machine.

### Lancement de l'infrastructure
Pour démarrer l'API Express et la base de données PostgreSQL simultanément, exécutez la commande suivante à la racine du projet :

```bash
docker compose up --build
```

L'API sera accessible sur : `http://localhost:3000`

###  Points de terminaison (Endpoints API)
*   `GET /api/livres` : Récupérer tous les livres stockés en base de données.
*   `POST /api/livres` : Ajouter un nouveau livre (Payload exemple : `{"titre": "Livre", "auteur": "Auteur"}`).

##  Exécution des tests manuellement
Pour lancer la suite de tests sans passer par Docker :
```bash
npm install
npm test
```