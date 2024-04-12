require('dotenv').config(); // Cargar variables de entorno

const assistantApiKey = process.env.SECRET_MANAGER_APIKEY;

const AssistantV2 = require('ibm-watson/assistant/v2');
const { IamAuthenticator } = require('ibm-watson/auth');

const assistant = new AssistantV2({
  version: '2023-03-16',
  authenticator: new IamAuthenticator({
    apikey: assistantApiKey,
  }),
  serviceUrl: 'https://api.us-south.assistant.watson.cloud.ibm.com',
});

// Función para enviar un mensaje al asistente de Watson
const sendMessage = async (text) => {
  try {
    const response = await assistant.createSession({ assistantId: '7ebab8e4-1d85-4dc1-9b82-31200209eb9b' });
    const sessionId = response.result.session_id;

    const messageResponse = await assistant.message({
      assistantId: '7ebab8e4-1d85-4dc1-9b82-31200209eb9b',
      sessionId,
      input: {
        message_type: 'text',
        text,
      },
    });

    return messageResponse.result;
  } catch (error) {
    console.error('Error sending message to Watson Assistant:', error);
    throw error;
  }
};

module.exports = {
  sendMessage,
};
