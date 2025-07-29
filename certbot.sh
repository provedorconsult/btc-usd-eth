#!/bin/bash

# ---
# Script para Habilitar HTTPS com Certbot
#
# Este script automatiza a configuração de um certificado SSL da Let's Encrypt
# para um site servido pelo Nginx em um servidor Debian 12.
#
# Pré-requisitos:
# 1. A aplicação já deve estar implantada e a funcionar via HTTP.
# 2. O servidor Nginx já deve estar configurado para o seu domínio na porta 80.
# 3. O DNS do seu domínio (ex: seudominio.com) deve estar a apontar para o IP deste servidor.
# ---

# Interrompe o script se qualquer comando falhar
set -e

# --- Verificações Iniciais ---
if [ "$EUID" -ne 0 ]; then
  echo "Por favor, execute este script como root ou com sudo."
  exit 1
fi

if ! command -v nginx &> /dev/null; then
    echo "Nginx não foi encontrado. Por favor, execute o script de implantação primeiro."
    exit 1
fi

# --- Solicitar Informações do Utilizador ---
read -p "Digite o seu nome de domínio (ex: seudominio.com): " DOMAIN
read -p "Digite o seu endereço de e-mail (para notificações da Let's Encrypt): " EMAIL

if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "O nome de domínio e o e-mail são obrigatórios."
    exit 1
fi

echo ">>> A configurar HTTPS para $DOMAIN..."

# --- 1. Instalar o Certbot e o Plugin do Nginx ---
echo ">>> A instalar o Certbot e o plugin do Nginx..."
apt-get update
apt-get install -y certbot python3-certbot-nginx

# --- 2. Obter o Certificado SSL ---
echo ">>> A obter o certificado SSL da Let's Encrypt..."
# A opção --nginx modifica automaticamente a configuração do Nginx.
# A opção --redirect redireciona todo o tráfego HTTP para HTTPS.
# A opção --agree-tos concorda com os Termos de Serviço da Let's Encrypt.
# A opção -n (ou --non-interactive) executa sem prompts interativos.
certbot --nginx --redirect --agree-tos --email "$EMAIL" -d "$DOMAIN" -d "www.$DOMAIN" -n

# --- 3. Verificar a Renovação Automática ---
echo ">>> A verificar o processo de renovação automática..."
# O Certbot adiciona automaticamente um cronjob ou timer do systemd para renovação.
# Este comando simula o processo de renovação para garantir que está a funcionar.
certbot renew --dry-run

# --- 4. Reiniciar o Nginx (se necessário) ---
# O Certbot geralmente recarrega o Nginx, mas uma reinicialização garante que tudo está a funcionar.
echo ">>> A reiniciar o Nginx para aplicar as alterações..."
systemctl restart nginx

echo "✅ Configuração de HTTPS concluída com sucesso!"
echo "O seu site está agora acessível em https://$DOMAIN"
