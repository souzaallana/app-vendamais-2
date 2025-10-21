# Configuração da IA (Nano Banana)

Este documento explica como configurar a integração com a API do Nano Banana para processamento de imagens com IA.

## Status Atual

✅ **Edge Function deployada e funcional**
✅ **Sistema de logging configurado**
✅ **Fallback com mock data implementado**
⚠️ **API keys pendentes de configuração**

## Como Funciona

A aplicação chama a Edge Function `ai-process-images` que:

1. **Remove o fundo** das fotos usando IA
2. **Gera variações com manequim** baseado na descrição fornecida
3. **Extrai dados** do produto (título, descrição, categoria, cores, material)
4. **Salva todos os logs** no banco de dados para análise

## Configuração das API Keys

### 1. Criar conta no Banana.dev

Acesse: https://www.banana.dev/

### 2. Obter API Key

No dashboard do Banana, copie sua **API Key**

### 3. Configurar Models

Você precisa configurar 3 models no Banana:

#### Model 1: Remoção de Fundo (REMBG)
- **Nome**: Background Removal
- **Modelo sugerido**: `rembg` ou similar
- **Copie o Model Key**

#### Model 2: Virtual Try-On (Manequim)
- **Nome**: Virtual Try-On
- **Modelo sugerido**: `stable-diffusion-inpainting` ou `virtual-tryon`
- **Copie o Model Key**

#### Model 3: Vision/Text Extraction
- **Nome**: Product Analysis
- **Modelo sugerido**: `llava` ou `gpt-4-vision` via Banana
- **Copie o Model Key**

### 4. Adicionar Secrets no Supabase

No painel do Supabase > Edge Functions > Settings, adicione:

```bash
NANO_BANANA_API_KEY=sua-api-key-aqui
NANO_BANANA_REMBG_MODEL_KEY=model-key-rembg
NANO_BANANA_TRYON_MODEL_KEY=model-key-tryon
NANO_BANANA_VISION_MODEL_KEY=model-key-vision
```

## Testando a Integração

### Modo Mock (Sem API Keys)

Quando as API keys não estão configuradas, o sistema usa **dados mockados**:
- ✅ Interface funciona normalmente
- ✅ Fotos são exibidas (sem processamento)
- ✅ Dados de exemplo são gerados
- ✅ Logs são salvos com `api_provider: 'mock'`

### Modo Produção (Com API Keys)

Quando as API keys estão configuradas:
- ✅ Fotos são processadas pela IA real
- ✅ Fundo é removido automaticamente
- ✅ Variações com manequim são geradas
- ✅ Dados reais são extraídos das imagens
- ✅ Logs são salvos com custos e duração reais

## Verificando os Logs

Todas as chamadas de API são registradas em `ai_processing_logs`:

```sql
SELECT
  created_at,
  api_provider,
  operation_type,
  status,
  cost,
  duration_ms,
  output_data
FROM ai_processing_logs
ORDER BY created_at DESC;
```

## Custos Estimados (com Nano Banana)

Por produto (8 fotos):
- **Remoção de fundo**: $0.0025 × 8 = $0.02
- **Geração de manequim**: $0.01 × 8 = $0.08
- **Extração de dados**: $0.02 × 1 = $0.02

**Total por produto**: ~$0.12

## Alternativas à Nano Banana

Se preferir usar outras APIs, você pode modificar a Edge Function para chamar:

### Replicate
```typescript
const response = await fetch('https://api.replicate.com/v1/predictions', {
  method: 'POST',
  headers: {
    'Authorization': `Token ${replicateApiKey}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    version: 'model-version-id',
    input: { image: imageBase64 }
  })
});
```

### Remove.bg (apenas fundo)
```typescript
const response = await fetch('https://api.remove.bg/v1.0/removebg', {
  method: 'POST',
  headers: {
    'X-Api-Key': removeBgApiKey,
  },
  body: formData
});
```

## Próximos Passos

1. ✅ Criar conta no Banana.dev
2. ✅ Configurar os 3 models
3. ✅ Adicionar secrets no Supabase
4. ✅ Testar com fotos reais
5. ✅ Ajustar prompts conforme necessário
6. ✅ Monitorar custos e performance

## Suporte

Em caso de dúvidas:
- Documentação Banana: https://docs.banana.dev
- Supabase Edge Functions: https://supabase.com/docs/guides/functions
