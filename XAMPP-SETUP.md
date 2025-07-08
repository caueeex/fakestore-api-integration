# 🚀 Configuração com XAMPP

Este guia explica como configurar o projeto para funcionar com XAMPP.

## 📁 Estrutura no XAMPP

```
C:\xampp\htdocs\crpmango\
├── backend\
│   ├── package.json
│   └── server.js
├── frontend\
│   ├── config.php
│   └── index.php
├── README.md
├── start-xampp.bat
├── test.bat
└── test-integration.js
```

## 🔧 Passos para Configuração

### 1. Copiar o Projeto

1. Copie toda a pasta `crpmango` para `C:\xampp\htdocs\`
2. A estrutura final deve ser: `C:\xampp\htdocs\crpmango\`

### 2. Iniciar o XAMPP

1. Abra o XAMPP Control Panel
2. Inicie o **Apache** (clique em "Start")
3. Verifique se está funcionando acessando: `http://localhost`

### 3. Iniciar o Backend

1. Abra o prompt de comando
2. Navegue até a pasta do projeto:
   ```bash
   cd C:\xampp\htdocs\crpmango
   ```
3. Execute o script de inicialização:
   ```bash
   start-xampp.bat
   ```

### 4. Acessar a Aplicação

- **Frontend**: `http://localhost/crpmango/frontend/`
- **Backend**: `http://localhost:3000`
- **Health Check**: `http://localhost:3000/api/health`

## 🎯 URLs de Acesso

| Componente | URL | Descrição |
|------------|-----|-----------|
| Frontend | `http://localhost/crpmango/frontend/` | Interface principal |
| Backend | `http://localhost:3000` | API Node.js |
| Health | `http://localhost:3000/api/health` | Status do backend |

## ✅ Verificação de Funcionamento

### 1. Verificar XAMPP
- Acesse: `http://localhost`
- Deve aparecer a página inicial do XAMPP

### 2. Verificar Frontend
- Acesse: `http://localhost/crpmango/frontend/`
- Deve aparecer a interface do e-commerce
- Se o backend não estiver rodando, aparecerá um aviso

### 3. Verificar Backend
- Acesse: `http://localhost:3000/api/health`
- Deve retornar: `{"status":"OK","message":"Backend funcionando corretamente"}`

### 4. Testar Integração
- Execute: `test.bat`
- Deve mostrar o resultado dos testes

## 🛠️ Solução de Problemas

### XAMPP não inicia
- Verifique se a porta 80 não está sendo usada
- Execute o XAMPP como administrador
- Verifique os logs no XAMPP Control Panel

### Backend não conecta
- Verifique se o Node.js está instalado
- Execute: `node --version`
- Verifique se a porta 3000 está livre

### Frontend não carrega
- Verifique se o Apache está rodando no XAMPP
- Acesse: `http://localhost` para confirmar
- Verifique se a pasta está em `C:\xampp\htdocs\crpmango\`

### Erro de CORS
- O backend já tem CORS configurado
- Se persistir, verifique se as URLs estão corretas

## 📝 Configurações Avançadas

### Alterar Porta do Backend
Edite o arquivo `backend/server.js`:
```javascript
const PORT = process.env.PORT || 3001; // Mude para 3001
```

E atualize `frontend/config.php`:
```php
$config = [
    'backend_url' => 'http://localhost:3001', // Mude para 3001
    // ...
];
```

### Alterar URL do Frontend
Se quiser acessar via IP local:
```php
$config = [
    'frontend_url' => 'http://192.168.1.100/crpmango/frontend',
    // ...
];
```

## 🔄 Fluxo Completo

1. **XAMPP Apache** → Serve o frontend PHP
2. **Frontend PHP** → Interface web
3. **JavaScript** → Chama o backend Node.js
4. **Backend Node.js** → Integra com FakeStore API
5. **FakeStore API** → Retorna dados dos produtos/carrinho

## 📊 Monitoramento

### Logs do XAMPP
- Apache: `C:\xampp\apache\logs\error.log`
- PHP: `C:\xampp\php\logs\php_error_log`

### Logs do Backend
- Console do terminal onde o `start-xampp.bat` foi executado
- Logs detalhados de todas as requisições

## 🎉 Pronto!

Após seguir estes passos, você terá:
- ✅ Frontend rodando no XAMPP
- ✅ Backend rodando em Node.js
- ✅ Integração completa com FakeStore API
- ✅ Interface moderna e funcional
- ✅ Tratamento de erros completo 