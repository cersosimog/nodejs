// Importa a biblioteca Express para criar o servidor
const express = require('express');
const fetch = require('node-fetch'); // Importa node-fetch para fazer requisições HTTP
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
      'Authorization': `Bearer ${process.env.ZENDESK_TOKEN}` // Usa a variável de ambiente para o token
    },
    body: JSON.stringify({
      ticket: {
        subject: 'Novo Ticket de Kommo',
        description: kommoData.description || 'Descrição não fornecida',
      }
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erro na criação do ticket: ${response.statusText}`);
    }
    return response.json();
  })
  .then(data => {
    console.log('Ticket criado no Zendesk:', data);
    res.status(200).send('Ticket criado com sucesso!');
  })
  .catch(error => {
    console.error('Erro ao criar ticket no Zendesk:', error);
    res.status(500).send('Erro ao processar o webhook.');
  });
});

// Inicia o servidor escutando em uma porta definida pelo Railway ou na porta 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando na porta', process.env.PORT || 3000);
});
