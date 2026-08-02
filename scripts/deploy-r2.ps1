#!/usr/bin/env pwsh
# pulse-landing: upload dist/ to R2 bucket pulse-landing.
# Run from project root:  pwsh scripts/deploy-r2.ps1
#
# Content-type map: covers all extensions pulse-landing produces.
# Cache-Control: HTML = 1h (so deploys land without a hard reload),
# everything else = 1y (fingerprint-free but rare-changing assets).

$ErrorActionPreference = 'Stop'
$PSNativeCommandUseErrorActionPreference = $true

$BUCKET = 'pulse-landing'
# R120: Resolve-Path fixes the bug where $DIST was relative and
# $_.FullName was absolute, making Substring($DIST.Length) cut into
# the path and the upload key became a deep nested path instead of
# the expected 'pulse-landing/index.html'. With absolute $DIST, the
# rel-key is just the file path under dist/.
$DIST = (Resolve-Path (Join-Path $PSScriptRoot '..\dist')).Path

if (-not (Test-Path $DIST)) {
  throw "dist/ not found at $DIST. Run 'npm run build' first."
}

function Get-ContentType($path) {
  switch -Wildcard ($path) {
    '*.html'         { 'text/html; charset=utf-8'; break }
    '*.css'          { 'text/css; charset=utf-8'; break }
    '*.js'           { 'application/javascript; charset=utf-8'; break }
    '*.mjs'          { 'application/javascript; charset=utf-8'; break }
    '*.json'         { 'application/json; charset=utf-8'; break }
    '*.xml'          { 'application/xml; charset=utf-8'; break }
    '*.txt'          { 'text/plain; charset=utf-8'; break }
    '*.svg'          { 'image/svg+xml'; break }
    '*.png'          { 'image/png'; break }
    '*.jpg'          { 'image/jpeg'; break }
    '*.jpeg'         { 'image/jpeg'; break }
    '*.webp'         { 'image/webp'; break }
    '*.ico'          { 'image/x-icon'; break }
    '*.woff'         { 'font/woff'; break }
    '*.woff2'        { 'font/woff2'; break }
    '*.apk'          { 'application/vnd.android.package-archive'; break }
    '*.exe'          { 'application/octet-stream'; break }
    '*.msi'          { 'application/octet-stream'; break }
    '*.sha256'       { 'text/plain; charset=utf-8'; break }
    default          { 'application/octet-stream' }
  }
}

function Get-CacheControl($path) {
  if ($path -like '*.html') { 'public, max-age=3600' }
  else { 'public, max-age=31536000, immutable' }
}

# Collect all files relative to dist/, with size + content-type
$files = Get-ChildItem $DIST -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($DIST.Length).TrimStart('\', '/').Replace('\', '/')
  $ct = Get-ContentType $rel
  $cc = Get-CacheControl $rel
  [pscustomobject]@{
    Rel = $rel
    Local = $_.FullName
    Size = $_.Length
    ContentType = $ct
    CacheControl = $cc
  }
}

Write-Host ("Found {0} file(s) under {1}" -f $files.Count, $DIST)
Write-Host "Bucket: $BUCKET"
Write-Host ""

# Upload each file
$ok = 0; $fail = 0
foreach ($f in $files) {
  $key = $f.Rel
  Write-Host ("  -> {0,-50} {1,10:N0} B  {2}" -f $key, $f.Size, $f.ContentType)
  # --remote REQUIRED on wrangler <4.80: without it, writes hit the local
  # R2 dev simulator and the bucket stays empty in Cloudflare.
  wrangler r2 object put "$BUCKET/$key" `
    --remote `
    --file $f.Local `
    --content-type $f.ContentType `
    --cache-control $f.CacheControl 2>&1 | Out-Null
  if ($LASTEXITCODE -eq 0) { $ok++ } else {
    Write-Host "    FAIL (exit $LASTEXITCODE)" -ForegroundColor Red
    $fail++
  }
}

Write-Host ""
Write-Host ("Upload summary: {0} ok, {1} fail, {2} total" -f $ok, $fail, $files.Count)
if ($fail -gt 0) { exit 1 }
