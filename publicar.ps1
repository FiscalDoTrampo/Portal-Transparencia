# Publica as alteracoes desta pasta no GitHub (add + commit + push).
# Uso normal: duplo clique em Publicar.cmd
# Uso manual: powershell -ExecutionPolicy Bypass -File publicar.ps1

$repo = $PSScriptRoot
if (-not $repo) { $repo = Split-Path -Parent $MyInvocation.MyCommand.Path }
Set-Location -LiteralPath $repo

try { $Host.UI.RawUI.WindowTitle = "Publicar no GitHub" } catch {}
function Info($t)  { Write-Host $t -ForegroundColor Cyan }
function Ok($t)    { Write-Host $t -ForegroundColor Green }
function Erro($t)  { Write-Host $t -ForegroundColor Red }
function Aviso($t) { Write-Host $t -ForegroundColor Yellow }

Info "Pasta: $repo"
Write-Host ""

if (-not (Test-Path (Join-Path $repo ".git"))) {
  Erro "Esta pasta nao e um repositorio git. Nada foi enviado."
  exit 1
}

$remoto = (git remote get-url origin) 2>$null
if (-not $remoto) {
  Erro "Nenhum repositorio remoto (origin) configurado. Nada foi enviado."
  exit 1
}
Info "Repositorio: $remoto"

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
if ($branch -ne "main") {
  Aviso "Atencao: branch atual e '$branch'. O GitHub Pages publica a partir de 'main'."
}

# Trava de seguranca: arquivos grandes demais para o GitHub
$grandes = Get-ChildItem -LiteralPath $repo -Recurse -File -Force -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notlike "*\.git\*" -and $_.Length -gt 50MB }
if ($grandes) {
  Erro "Arquivos acima de 50 MB (o GitHub recusa):"
  $grandes | ForEach-Object { Write-Host ("  {0:N1} MB  {1}" -f ($_.Length / 1MB), $_.FullName) -ForegroundColor Red }
  Erro "Remova ou compacte esses arquivos e rode de novo."
  exit 1
}

$pendentes = git status --porcelain
if ($pendentes) {
  Info "Alteracoes encontradas:"
  $pendentes | ForEach-Object { Write-Host "  $_" }
  Write-Host ""

  git add -A
  if ($LASTEXITCODE -ne 0) { Erro "Falha ao preparar os arquivos (git add)."; exit 1 }

  $msg = "Atualizacao " + (Get-Date -Format "dd/MM/yyyy HH:mm")
  git commit -m $msg | Out-Null
  if ($LASTEXITCODE -ne 0) { Erro "Falha ao criar o commit."; exit 1 }
  Ok "Commit criado: $msg"
} else {
  Info "Nenhuma alteracao local para commitar."
}

$ahead = 0
if (git rev-parse --verify --quiet "origin/$branch" 2>$null) {
  $ahead = [int](git rev-list --count "origin/$branch..HEAD")
}

if (-not $pendentes -and $ahead -eq 0) {
  Ok "Tudo ja esta publicado. Nada a enviar."
  exit 0
}

Info "Enviando para o GitHub..."
git push origin $branch
if ($LASTEXITCODE -ne 0) {
  Aviso "O envio falhou. Atualizando com o que ja existe no GitHub e tentando de novo..."
  git pull --rebase origin $branch
  if ($LASTEXITCODE -eq 0) { git push origin $branch }
}
if ($LASTEXITCODE -ne 0) {
  Erro "Nao foi possivel publicar. Leia a mensagem acima."
  exit 1
}

Write-Host ""
Ok "Publicado com sucesso."
Info "Site (apos alguns minutos): https://fiscaldotrampo.github.io/Portal-Transparencia/"
Info "Codigo: https://github.com/FiscalDoTrampo/Portal-Transparencia"
