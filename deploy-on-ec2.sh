#!/bin/bash

# Script à exécuter SUR EC2 pour déployer EagleView
# Ce script doit être copié et exécuté sur l'instance EC2

set -e

APP_NAME="eagleview"
DOCKER_IMAGE="eagleview:latest"

echo "🚀 Déploiement EagleView sur EC2..."

# 1. Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "📥 Installation de Docker..."
    sudo apt update
    sudo apt install -y docker.io docker-compose
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    echo "⚠️  Docker installé. Vous devez vous reconnecter pour appliquer les permissions."
    echo "   Exécutez: exit, puis reconnectez-vous et relancez ce script."
    exit 1
fi

# 2. Vérifier que les fichiers sont présents
if [ ! -f "${APP_NAME}-deployment.tar.gz" ]; then
    echo "❌ Fichier ${APP_NAME}-deployment.tar.gz introuvable."
    echo "   Assurez-vous d'avoir transféré les fichiers avec scp."
    exit 1
fi

if [ ! -f "eagleview-docker-image.tar.gz" ]; then
    echo "❌ Fichier eagleview-docker-image.tar.gz introuvable."
    echo "   Assurez-vous d'avoir transféré les fichiers avec scp."
    exit 1
fi

# 3. Arrêter l'ancienne version si elle existe
echo "🛑 Arrêt de l'ancienne version..."
docker-compose down 2>/dev/null || true
docker stop eagleview-app 2>/dev/null || true
docker rm eagleview-app 2>/dev/null || true

# 4. Extraire les nouveaux fichiers
echo "📦 Extraction des fichiers..."
tar -xzf ${APP_NAME}-deployment.tar.gz

# 5. Charger la nouvelle image Docker
echo "🐳 Chargement de l'image Docker..."
docker load < eagleview-docker-image.tar.gz

# 6. Démarrer la nouvelle version
echo "🚀 Démarrage de l'application..."
docker-compose up -d

# 7. Attendre que l'application démarre
echo "⏳ Attente du démarrage de l'application..."
sleep 10

# 8. Vérifier que l'application fonctionne
echo "✅ Vérification du déploiement..."
if curl -s -f http://localhost:3000 > /dev/null; then
    echo "🎉 Déploiement réussi !"
    echo ""
    echo "📊 Statut des conteneurs:"
    docker ps
    echo ""
    echo "🌐 Application accessible sur:"
    echo "   - http://$(curl -s ifconfig.me):3000"
    echo "   - http://localhost:3000 (depuis EC2)"
    echo ""
    echo "🔍 Pour voir les logs:"
    echo "   docker logs eagleview-app"
    echo "   docker-compose logs -f"
else
    echo "❌ L'application ne répond pas. Vérifiez les logs:"
    docker logs eagleview-app
    exit 1
fi

# 9. Nettoyage optionnel
echo ""
echo "🧹 Nettoyage des anciennes images (optionnel):"
echo "   docker image prune -f" 