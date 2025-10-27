<!-- frontend/svelte/ChatWidget.svelte -->
<script lang="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const messages = writable<{ sender: string; text: string }[]>([]);
  let input = "";

  async function sendMessage() {
    if (!input.trim()) return;

    messages.update((msgs) => [...msgs, { sender: "user", text: input }]);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    messages.update((msgs) => [...msgs, { sender: "agent", text: data.response }]);
    input = "";
  }
</script>

<div class="chat-widget">
  {#each $messages as msg}
    <div class="message {msg.sender}">{msg.text}</div>
  {/each}
  <input
    bind:value={input}
    on:keydown={(e) => e.key === "Enter" && sendMessage()}
    placeholder="Digite sua mensagem..."
  />
  <button on:click={sendMessage}>Enviar</button>
</div>

<style>
  .chat-widget {
    max-width: 400px;
    margin: auto;
  }
  .message.user {
    text-align: right;
    background: #daf1da;
    margin: 5px;
    padding: 8px;
    border-radius: 8px;
  }
  .message.agent {
    text-align: left;
    background: #f1f0f0;
    margin: 5px;
    padding: 8px;
    border-radius: 8px;
  }
</style>