#!/bin/bash

# Script de déploiement EagleView sur EC2
# Version avec image Docker pré-construite

set -e

echo "🚀 Préparation du déploiement EagleView sur EC2..."

# Variables de configuration
EC2_USER="ubuntu"
EC2_HOST=""  # À définir lors de l'exécution
APP_NAME="eagleview"
DOCKER_IMAGE="eagleview:latest"

# Fonction d'aide
show_usage() {
    echo "Usage: $0 <EC2_IP_ADDRESS>"
    echo "Exemple: $0 18.206.123.45"
    exit 1
}

# Vérifier les paramètres
if [ $# -eq 0 ]; then
    show_usage
fi

EC2_HOST=$1

echo "📦 Création de l'archive de déploiement..."

# Créer l'archive avec les fichiers nécessaires
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='.next' \
    --exclude='eagleview-*.tar.gz' \
    -czf ${APP_NAME}-deployment.tar.gz \
    docker-compose.yml \
    Dockerfile \
    .dockerignore \
    package.json \
    package-lock.json \
    next.config.ts \
    src/ \
    public/ \
    components.json \
    tsconfig.json \
    postcss.config.mjs \
    README.md

echo "✅ Archive créée: ${APP_NAME}-deployment.tar.gz"
echo "✅ Image Docker sauvée: eagleview-docker-image.tar.gz"

echo ""
echo "📋 COMMANDES POUR DÉPLOIEMENT SUR EC2:"
echo "================================="
echo ""
echo "1. 📤 Transférer les fichiers sur EC2:"
echo "   scp ${APP_NAME}-deployment.tar.gz ${EC2_USER}@${EC2_HOST}:~/"
echo "   scp eagleview-docker-image.tar.gz ${EC2_USER}@${EC2_HOST}:~/"
echo ""
echo "2. 🔐 Se connecter à EC2:"
echo "   ssh ${EC2_USER}@${EC2_HOST}"
echo ""
echo "3. 🛠️  Installer Docker sur EC2 (première fois uniquement):"
echo "   sudo apt update"
echo "   sudo apt install -y docker.io docker-compose"
echo "   sudo systemctl start docker"
echo "   sudo systemctl enable docker"
echo "   sudo usermod -aG docker ubuntu"
echo "   exit  # Se reconnecter pour appliquer les permissions"
echo ""
echo "4. 🔄 Déployer l'application:"
echo "   # Extraire les fichiers"
echo "   tar -xzf ${APP_NAME}-deployment.tar.gz"
echo "   "
echo "   # Charger l'image Docker"
echo "   docker load < eagleview-docker-image.tar.gz"
echo "   "
echo "   # Arrêter l'ancienne version (si elle existe)"
echo "   docker-compose down || true"
echo "   "
echo "   # Démarrer la nouvelle version"
echo "   docker-compose up -d"
echo ""
echo "5. ✅ Vérifier le déploiement:"
echo "   docker ps"
echo "   curl http://localhost:3000"
echo ""
echo "6. 🌐 Configurer CloudFlare (si nécessaire):"
echo "   - DNS A record: monitoring.linkafric.com → ${EC2_HOST}"
echo "   - SSL: Flexible mode"
echo "   - Accès: https://monitoring.linkafric.com"
echo ""
echo "7. 🔍 Monitoring et logs:"
echo "   docker logs eagleview-app"
echo "   docker-compose logs -f"
echo ""
echo "🎯 Application accessible sur:"
echo "   - Local: http://${EC2_HOST}:3000"
echo "   - CloudFlare: https://monitoring.linkafric.com" 