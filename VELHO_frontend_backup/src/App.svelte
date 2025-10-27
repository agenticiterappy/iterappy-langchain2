<script>
  import { onMount } from 'svelte';

  let token = null;
  let messages = [];
  let userInput = '';

  onMount(() => {
    // 1. Verifica se há um token na URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');

    if (tokenFromUrl) {
      // 2. Salva o token no localStorage e atualiza o estado
      localStorage.setItem('jwt_token', tokenFromUrl);
      token = tokenFromUrl;
      // Limpa a URL para não manter o token visível
      window.history.replaceState({}, document.title, "/");
    } else {
      // 3. Se não houver na URL, tenta carregar do localStorage
      token = localStorage.getItem('jwt_token');
    }
  });

  async function sendMessage() {
    if (!userInput.trim()) return;

    const currentMessage = userInput;
    messages = [...messages, { from: 'user', text: currentMessage }];
    userInput = '';

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 4. Envia o JWT no cabeçalho de autorização
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ message: currentMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      messages = [...messages, { from: 'bot', text: data.response.output }];

    } catch (error) {
      console.error("Error sending message:", error);
      messages = [...messages, { from: 'bot', text: 'Desculpe, ocorreu um erro.' }];
    }
  }

  function handleLogin() {
    window.location.href = '/api/login';
  }
</script>

<main>
  <h1>iTerappy Agent</h1>

  {#if !token}
    <!-- Se não estiver autenticado, mostra o botão de login -->
    <div class="login-container">
      <p>Por favor, faça login para começar.</p>
      <button on:click={handleLogin}>Login com Google</button>
    </div>
  {:else}
    <!-- Se estiver autenticado, mostra a interface de chat -->
    <div class="chat-container">
      <div class="messages">
        {#each messages as message}
          <div class="message {message.from}">
            <p>{message.text}</p>
          </div>
        {/each}
      </div>
      <div class="input-area">
        <input type="text" bind:value={userInput} on:keydown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Digite sua mensagem...">
        <button on:click={sendMessage}>Enviar</button>
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    font-family: sans-serif;
    text-align: center;
    max-width: 600px;
    margin: 2rem auto;
  }
  .login-container button {
    padding: 10px 20px;
    font-size: 1rem;
    cursor: pointer;
  }
  .chat-container {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem;
  }
  .messages {
    height: 400px;
    overflow-y: auto;
    border-bottom: 1px solid #eee;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .message {
    padding: 8px 12px;
    border-radius: 15px;
    max-width: 80%;
    word-wrap: break-word;
  }
  .message.user {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
  }
  .message.bot {
    background-color: #f1f1f1;
    color: black;
    align-self: flex-start;
  }
  .input-area {
    display: flex;
  }
  .input-area input {
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .input-area button {
    padding: 8px 12px;
    border: none;
    background-color: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 4px;
    margin-left: 8px;
  }
</style>