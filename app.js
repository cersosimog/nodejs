// Importa a biblioteca Express, que ajudará a criar o servidor
const express = require('express');
const fetch = require('node-fetch'); // Adiciona o node-fetch para fazer requisições HTTP
const app = express();

// Configura o servidor para entender JSON
app.use(express.json());

// Define uma rota POST para receber o webhook do Kommo
app.post('/webhook', (req, res) => {
  // Captura os dados enviados pelo Kommo
  const kommoData = req.body;
  console.log('Dados recebidos do Kommo:', kommoData);

  // Envia os dados para o Zendesk usando a API deles
  fetch('https://petloosupport.zendesk.com/api/v2/tickets', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer LflQV75PghpGMD1MPVhYDcHBstYQ0wKlwd8M7ZrS' // Substitua SEU_TOKEN pelo seu token de autenticação do Zendesk
    },
    body: JSON.stringify({
      ticket: {
        subject: 'Novo Ticket de Kommo',
        description: kommoData.description || 'Descrição não fornecida',
      }
    })
  })
  .then(response => response.json())
  .then(data => console.log('Ticket criado no Zendesk:', data))
  .catch(error => console.error('Erro ao criar ticket no Zendesk:', error));

  // Retorna uma resposta de sucesso para a requisição do Kommo
  res.status(200).send('Webhook recebido com sucesso!');
});

// Inicia o servidor escutando em uma porta definida pelo Railway ou na porta 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando na porta', process.env.PORT || 3000);


});
