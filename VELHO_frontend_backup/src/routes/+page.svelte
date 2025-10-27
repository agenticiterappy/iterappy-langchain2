<script lang="ts">
    import { onMount } from 'svelte';
    import { Button, Card, Label, Input } from 'flowbite-svelte';

    // Lógica antiga (mantida)
    let token: string | null = null;
    let messages: { from: 'user' | 'bot'; text: string }[] = [];
    let userInput: string = '';

    onMount(() => {
        // 1. Lógica de tratamento de JWT na URL (igual a antes)
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        if (tokenFromUrl) {
            localStorage.setItem('jwt_token', tokenFromUrl);
            token = tokenFromUrl;
            window.history.replaceState({}, document.title, "/");
        } else {
            token = localStorage.getItem('jwt_token');
        }
    });

    async function sendMessage() {
        if (!userInput.trim() || !token) return;

        const currentMessage = userInput;
        messages = [...messages, { from: 'user', text: currentMessage }];
        userInput = '';

        try {
            // A requisição usa o proxy do Vite para ir para http://localhost:8787/api/chat
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ message: currentMessage }),
            });

            if (!response.ok) {
                // Se o token expirar ou for inválido, forçamos o logout
                if (response.status === 401) {
                    localStorage.removeItem('jwt_token');
                    token = null;
                    alert('Sessão expirada. Faça login novamente.');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            messages = [...messages, { from: 'bot', text: data.output || data.response.output }];

        } catch (error) {
            console.error("Error sending message:", error);
            messages = [...messages, { from: 'bot', text: 'Desculpe, ocorreu um erro na comunicação com o Agente.' }];
        }
    }

    // Função de login (igual a antes)
    function handleLogin() {
        // Redireciona para o Worker (proxy)
        window.location.href = '/api/login'; 
    }
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
    <Card class="w-full max-w-xl shadow-2xl rounded-xl">
        <h1 class="text-3xl font-serif text-center mb-6 text-gray-800 dark:text-gray-100">iTerappy Agent</h1>

        {#if !token}
            <div class="flex flex-col items-center space-y-4">
                <p class="text-lg text-gray-600 dark:text-gray-300">Por favor, faça login para começar a sua sessão de terapia assistida.</p>
                <Button color="blue" on:click={handleLogin} class="w-full sm:w-auto">
                    Login com Google
                </Button>
            </div>
        {:else}
            <div class="flex flex-col h-[500px] space-y-4">
                <div class="flex-grow overflow-y-auto space-y-3 p-2 border-b dark:border-gray-700">
                    {#each messages as message}
                        <div class="flex {message.from === 'user' ? 'justify-end' : 'justify-start'}">
                            <span class="max-w-xs sm:max-w-md p-3 rounded-xl shadow-md 
                                {message.from === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-tl-none'}">
                                {message.text}
                            </span>
                        </div>
                    {/each}
                </div>

                <div class="flex items-center space-x-2">
                    <Label for="chat-input" class="sr-only">Mensagem</Label>
                    <Input id="chat-input" type="text" bind:value={userInput} placeholder="Sua mensagem para o Agente..." class="flex-grow" 
                           on:keydown={(e) => e.key === 'Enter' && sendMessage()} required />
                    <Button color="blue" on:click={sendMessage} class="p-3">
                        Enviar
                    </Button>
                </div>
            </div>
        {/if}
    </Card>
</div>