// src/frontend/next.js/pages/dashboard.tsx
import { useState, useEffect } from 'react';
import { APIKeyManager } from '../../../src/core/security/api_key_manager';

export default function Dashboard() {
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    // Buscar chaves do usuário
    async function fetchAPIKeys() {
      // Implementar lógica de busca de chaves
    }
    fetchAPIKeys();
  }, []);

  const generateNewAPIKey = async (agentType) => {
    const newKey = apiKeyManager.generateAPIKey(agentType, userId);
    // Salvar no backend
  };

  return (
    <div className="dashboard">
      <h1>Painel de Gerenciamento de API Keys</h1>
      
      <section className="api-keys">
        <h2>Suas Chaves de API</h2>
        {apiKeys.map(key => (
          <div key={key.id} className="api-key-card">
            <p>Agente: {key.agentType}</p>
            <p>Uso: {key.usageCount} chamadas</p>
            <p>Tokens Consumidos: {key.tokensUsed}</p>
            <button onClick={() => setSelectedKey(key)}>
              Detalhes
            </button>
          </div>
        ))}
      </section>

      <section className="key-generation">
        <h2>Gerar Nova Chave</h2>
        <select onChange={(e) => generateNewAPIKey(e.target.value)}>
          <option>Selecione um Agente</option>
          <option value="psychotherapist">Psicoterapeuta</option>
          <option value="triage">Triagem</option>
          <option value="scheduling">Agendamento</option>
        </select>
      </section>
    </div>
    
  );
}
