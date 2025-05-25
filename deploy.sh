#!/bin/bash

# Script de déploiement EagleView Frontend sur EC2 + CloudFlare

echo "🚀 Déploiement EagleView Frontend..."

# 1. Créer archive pour EC2
echo "📦 Création de l'archive..."
tar --exclude='node_modules' --exclude='.git' --exclude='.next' -czf eagleview-deployment.tar.gz .

echo "✅ Archive prête pour EC2 !"
echo ""
echo "📋 ÉTAPES DÉPLOIEMENT EC2:"
echo "1. Transférez eagleview-deployment.tar.gz sur EC2"
echo "   scp eagleview-deployment.tar.gz ubuntu@YOUR-EC2-IP:~/"
echo ""
echo "2. Sur EC2, exécutez:"
echo "   tar -xzf eagleview-deployment.tar.gz"
echo "   sudo apt update && sudo apt install -y docker.io docker-compose"
echo "   sudo systemctl start docker"
echo "   sudo usermod -aG docker ubuntu"
echo "   docker-compose up -d"
echo ""
echo "3. Configurez CloudFlare:"
echo "   - DNS A record: monitoring → IP-EC2"
echo "   - SSL: Flexible mode"
echo "   - Accès: https://monitoring.linkafric.com" 