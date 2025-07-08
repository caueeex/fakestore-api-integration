# 📁 Scripts - E-commerce FakeStore API

Esta pasta contém todos os scripts de automação para facilitar o desenvolvimento e execução da aplicação.

## 📋 Scripts Disponíveis

### 🚀 Scripts de Inicialização

#### `start.bat` / `start.sh`
**Função:** Inicia todos os serviços da aplicação
- Verifica dependências (Node.js, PHP)
- Instala dependências do backend se necessário
- Inicia servidor backend (Node.js) na porta 3000
- Configura frontend para uso com XAMPP
- Abre o navegador automaticamente

**Uso:**
```bash
# Windows
scripts\start.bat

# Linux/Mac
./scripts/start.sh
```

### 📦 Scripts de Instalação

#### `install.bat` / `install.sh`
**Função:** Instala e configura o ambiente de desenvolvimento
- Verifica se Node.js e NPM estão instalados
- Verifica se PHP está disponível
- Remove node_modules existente (limpeza)
- Instala todas as dependências do backend

**Uso:**
```bash
# Windows
scripts\install.bat

# Linux/Mac
./scripts/install.sh
```

### 🛑 Scripts de Parada

#### `stop.bat` / `stop.sh`
**Função:** Para todos os serviços em execução
- Para servidor Node.js
- Para servidor PHP
- Limpa processos relacionados

**Uso:**
```bash
# Windows
scripts\stop.bat

# Linux/Mac
./scripts/stop.sh
```

### 🧪 Scripts de Teste

#### `test.bat` / `test.sh`
**Função:** Executa testes básicos da aplicação
- Verifica se o backend está rodando
- Testa endpoint de produtos
- Testa endpoint de carrinho
- Verifica conectividade com API externa

**Uso:**
```bash
# Windows
scripts\test.bat

# Linux/Mac
./scripts/test.sh
```

#### `check-xampp.bat` / `check-xampp.sh`
**Função:** Verifica se o XAMPP está configurado corretamente
- Verifica se o Apache está rodando
- Testa acesso ao projeto
- Abre o frontend no navegador

**Uso:**
```bash
# Windows
scripts\check-xampp.bat

# Linux/Mac
./scripts/check-xampp.sh
```

## 🔄 Fluxo de Uso Recomendado

### Primeira Execução
```bash
# 1. Instalar dependências
scripts\install.bat    # Windows
./scripts/install.sh   # Linux/Mac

# 2. Iniciar aplicação
scripts\start.bat      # Windows
./scripts/start.sh     # Linux/Mac
```

### Uso Diário
```bash
# Iniciar
scripts\start.bat      # Windows
./scripts/start.sh     # Linux/Mac

# Testar (opcional)
scripts\test.bat       # Windows
./scripts/test.sh      # Linux/Mac

# Parar
scripts\stop.bat       # Windows
./scripts/stop.sh      # Linux/Mac
```

## ⚙️ Configuração

### Permissões (Linux/Mac)
```bash
# Tornar scripts executáveis
chmod +x scripts/*.sh
```

### Configurações Padrão
Os scripts usam as seguintes configurações:
- **Backend:** http://localhost:3000
- **Frontend (XAMPP):** http://localhost/crpmango/frontend/
- **Frontend (PHP):** http://localhost:8000

Para alterar, edite os scripts conforme necessário.

## 🐛 Solução de Problemas

### Script não executa (Linux/Mac)
```bash
# Verificar permissões
ls -la scripts/

# Tornar executável
chmod +x scripts/start.sh
```

### Porta já em uso
```bash
# Parar serviços
scripts\stop.bat      # Windows
./scripts/stop.sh     # Linux/Mac

# Verificar processos
netstat -an | findstr :3000  # Windows
lsof -i :3000               # Linux/Mac
```

### Dependências não encontradas
```bash
# Reinstalar
scripts\install.bat    # Windows
./scripts/install.sh   # Linux/Mac
```

## 📝 Logs

Os scripts geram logs no console. Para capturar logs:

```bash
# Windows
scripts\start.bat > logs.txt 2>&1

# Linux/Mac
./scripts/start.sh > logs.txt 2>&1
```

## 🔧 Personalização

### Adicionar novos scripts
1. Crie o arquivo `.bat` (Windows) e `.sh` (Linux/Mac)
2. Use as cores e formatação dos scripts existentes
3. Documente no README.md

### Modificar portas
Edite os scripts e altere:
- `localhost:3000` para backend
- `localhost:8000` para frontend

## 📊 Status dos Scripts

| Script | Windows | Linux/Mac | Função |
|--------|---------|-----------|--------|
| start | ✅ | ✅ | Iniciar serviços |
| install | ✅ | ✅ | Instalar dependências |
| stop | ✅ | ✅ | Parar serviços |
| test | ✅ | ✅ | Executar testes |
| check-xampp | ✅ | ✅ | Verificar XAMPP |

## 🤝 Contribuição

Para adicionar novos scripts:
1. Mantenha a consistência de formatação
2. Use cores para feedback visual
3. Inclua tratamento de erros
4. Documente no README.md
5. Teste em ambos os sistemas operacionais 