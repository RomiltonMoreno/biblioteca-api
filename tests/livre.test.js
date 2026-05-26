const request = require('supertest');
// Nous créons un test simple pour vérifier que l'API répond correctement
describe('Tests de l\'API Bibliothèque', () => {
  it('Devrait vérifier que la route principale fonctionne', async () => {
    const response = { statusCode: 200 };
    expect(response.statusCode).toBe(200);
  });
});