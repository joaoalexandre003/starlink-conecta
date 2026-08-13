#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[1/3] Instalando dependências e executando testes do backend..."
cd "$ROOT/backend"
npm install
npm test

echo "[2/3] Instalando dependências do frontend..."
cd "$ROOT/frontend"
npm install

echo "[3/3] Gerando build de produção do frontend..."
npm run build

echo "Verificação concluída sem erros."
