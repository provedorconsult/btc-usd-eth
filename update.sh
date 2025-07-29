#!/bin/bash

# ---
# Script de Atualização para o Crypto Trading Signals Dashboard
#
# Este script automatiza o processo de atualização de uma implantação existente.
# Ele executa as seguintes ações:
# 1. Navega até o diretório da aplicação.
# 2. Puxa as últimas alterações do repositório Git.
# 3. Instala/atualiza as dependências do Node.js.
# 4. Aplica migrações de banco de dados com Drizzle Kit.
# 5. Recompila a aplicação para produção.
# 6. Reinicia o serviço systemd para aplicar as alterações.
# ---

# Interrompe o script se qualquer comando falhar
set -e

# --- Variáveis de Configuração ---
APP_DIR="/var/www/crypto-dashboard"
GIT_BRANCH="main" # Altere se você usar um branch diferente para produção

echo ">>> Iniciando a atualização da aplicação..."

# --- 1. Navegar para o Diretório da Aplicação ---
cd "$APP_DIR" || { echo "Falha ao acessar o diretório da aplicação: $APP_DIR"; exit 1; }

# --- 2. Obter o Código Mais Recente ---
echo ">>> Puxando as últimas alterações do repositório..."
sudo git checkout $GIT_BRANCH
sudo git pull origin $GIT_BRANCH

# --- 3. Instalar/Atualizar Dependências ---
echo ">>> Instalando/atualizando dependências do npm..."
sudo npm install

# --- 4. Aplicar Migrações de Banco de Dados ---
echo ">>> Aplicando migrações de banco de dados..."
# 'db:push' é o script definido em package.json para drizzle-kit push
sudo npm run db:push

# --- 5. Recompilar a Aplicação ---
echo ">>> Recompilando a aplicação..."
sudo npm run build

# --- 6. Reiniciar o Serviço ---
echo ">>> Reiniciando o serviço da aplicação..."
sudo systemctl restart crypto-dashboard

echo "✅ Atualização concluída com sucesso!"
