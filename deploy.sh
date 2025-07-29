#!/bin/bash

# ---
# Script de Implantação para o Crypto Trading Signals Dashboard
#
# Este script automatiza a instalação completa da aplicação em um servidor Debian 12.
# Ele executa as seguintes ações:
# 1. Instala dependências do sistema (Node.js, PostgreSQL, Nginx, Git).
# 2. Configura o banco de dados PostgreSQL e o usuário.
# 3. Clona o repositório do projeto.
# 4. Instala as dependências do Node.js.
# 5. Cria o arquivo de ambiente .env.
# 6. Compila a aplicação para produção.
# 7. Configura um serviço systemd para manter a aplicação em execução.
# 8. Configura o Nginx como um proxy reverso para a aplicação.
# ---

# Interrompe o script se qualquer comando falhar
set -e

# --- Variáveis de Configuração (ajuste conforme necessário) ---
APP_DIR="/var/www/crypto-dashboard"
REPO_URL="https" # Insira a URL do seu repositório Git aqui
DB_NAME="crypto_db"
DB_USER="crypto_user"
DB_PASS="sua_senha_segura" # Altere para uma senha forte
APP_PORT="5000"

echo ">>> Iniciando a implantação do Crypto Trading Signals Dashboard..."

# --- 1. Instalação de Dependências do Sistema ---
echo ">>> Atualizando pacotes e instalando dependências..."
sudo apt-get update
sudo apt-get install -y curl gnupg git nginx postgresql

# Instala o Node.js v20 (recomendado pelo arquivo .replit)
# O repositório padrão do Debian pode ter uma versão mais antiga
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# --- 2. Configuração do Banco de Dados PostgreSQL ---
echo ">>> Configurando o banco de dados PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Cria o usuário e o banco de dados. O comando psql executa os comandos SQL.
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Banco de dados '$DB_NAME' já existe."
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';" || echo "Usuário '$DB_USER' já existe."
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# --- 3. Clonar Repositório ---
echo ">>> Clonando o repositório do projeto..."
sudo git clone "$REPO_URL" "$APP_DIR"
cd "$APP_DIR"

# --- 4. Instalação de Dependências do Projeto ---
echo ">>> Instalando dependências do npm..."
sudo npm install

# --- 5. Configuração do Ambiente ---
echo ">>> Criando o arquivo de ambiente .env..."
# O DATABASE_URL é necessário para o Drizzle Kit e para a aplicação.
DATABASE_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:5432/${DB_NAME}"
echo "DATABASE_URL=${DATABASE_URL}" | sudo tee .env
echo "PORT=${APP_PORT}" | sudo tee -a .env

# --- 6. Compilar a Aplicação ---
echo ">>> Compilando a aplicação para produção..."
sudo npm run build

# --- 7. Configurar o Serviço Systemd ---
echo ">>> Configurando o serviço systemd..."
# Cria um arquivo de serviço para gerenciar a aplicação Node.js
sudo tee /etc/systemd/system/crypto-dashboard.service > /dev/null <<EOF
[Unit]
Description=Crypto Trading Signals Dashboard
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=${APP_DIR}
ExecStart=/usr/bin/npm start
Restart=always
EnvironmentFile=${APP_DIR}/.env

[Install]
WantedBy=multi-user.target
EOF

# Recarrega o systemd, inicia e habilita o serviço na inicialização
sudo systemctl daemon-reload
sudo systemctl start crypto-dashboard
sudo systemctl enable crypto-dashboard

# --- 8. Configurar o Nginx ---
echo ">>> Configurando o Nginx como proxy reverso..."
# Remove a configuração padrão do Nginx
sudo rm -f /etc/nginx/sites-enabled/default

# Cria um novo arquivo de configuração para a aplicação
sudo tee /etc/nginx/sites-available/crypto-dashboard > /dev/null <<EOF
server {
    listen 80;
    server_name _; # Escuta em todos os domínios/IPs

    location / {
        proxy_pass http://localhost:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Ativa a nova configuração criando um link simbólico
sudo ln -s /etc/nginx/sites-available/crypto-dashboard /etc/nginx/sites-enabled/

# Testa a configuração do Nginx e reinicia o serviço
sudo nginx -t
sudo systemctl restart nginx

echo "✅ Implantação concluída com sucesso!"
echo "A aplicação está agora rodando em http://<seu_ip_do_servidor>"
