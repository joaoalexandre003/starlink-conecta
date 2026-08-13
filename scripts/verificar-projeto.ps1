$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)

Write-Host "[1/3] Instalando dependências e executando testes do backend..."
Set-Location "$Root\backend"
npm install
npm test

Write-Host "[2/3] Instalando dependências do frontend..."
Set-Location "$Root\frontend"
npm install

Write-Host "[3/3] Gerando build de produção do frontend..."
npm run build

Write-Host "Verificação concluída sem erros."
