#!/bin/bash
banner='
+++++++++++++++++++++++++++++
+                           +
+        BSZFUZZING!        +
+                           +
+++++++++++++++++++++++++++++
'

echo "$banner"
read -p "Introduce la URL base (ej. http://example.com): " base_url

# Asegurarse que termine en /
[[ "$base_url" != */ ]] && base_url="${base_url}/"

host=$(echo "$base_url" | awk -F[/:] '{print $4}')

echo -e "\n[✔] Iniciando escaneo completo para: $base_url\n"

# DNS scan
echo "[DNS] Resolviendo IP..."
ips=$(dig +short "$host")
if [[ -z "$ips" ]]; then
  echo "    [!] No se pudo resolver DNS"
else
  while IFS= read -r ip; do
    echo "    [✓] $host => $ip"
  done <<< "$ips"
fi

# Proxy detection (simple)
echo -e "\n[PROXY] Comprobando proxy del sistema..."
if [[ -n "$http_proxy" ]]; then
  echo "    [✓] Proxy detectado en variable http_proxy: $http_proxy"
else
  echo "    [-] No se detectó proxy configurado en variables de entorno."
fi

# Analyze headers (HEAD request)
echo -e "\n[HEADERS] Analizando encabezados y configuración..."
headers=$(curl -s -I "$base_url")

if [[ -z "$headers" ]]; then
  echo "    [!] No se pudo obtener encabezados"
else
  echo "$headers" | while IFS= read -r line; do
    echo "    $line"
  done

  # Cookies
  echo "$headers" | grep -i "Set-Cookie" >/dev/null
  if [[ $? -eq 0 ]]; then
    echo "    [🍪] Cookies detectadas:"
    echo "$headers" | grep -i "Set-Cookie" | sed 's/^/        /'
  fi

  # Server
  server_line=$(echo "$headers" | grep -i "^Server:")
  if [[ -n "$server_line" ]]; then
    echo "    [🖥] Servidor detectado: ${server_line#Server: }"
    if echo "$server_line" | grep -Ei "apache|nginx|iis" >/dev/null; then
      echo "    [⚠] Revisa si la versión es vulnerable."
    fi
  fi

  # X-Powered-By
  xpb_line=$(echo "$headers" | grep -i "^X-Powered-By:")
  if [[ -n "$xpb_line" ]]; then
    echo "    [🧬] X-Powered-By: ${xpb_line#X-Powered-By: }"
  fi

  # Check security headers
  missing_headers=()
  for h in "X-Content-Type-Options" "X-Frame-Options" "Strict-Transport-Security" "Content-Security-Policy" "Referrer-Policy"; do
    echo "$headers" | grep -i "^$h:" >/dev/null || missing_headers+=("$h")
  done

  if (( ${#missing_headers[@]} > 0 )); then
    echo "    [⚠] Encabezados de seguridad ausentes: ${missing_headers[*]}"
  fi
fi

# Test insecure HTTP methods
echo -e "\n[HTTP METHODS] Probando métodos HTTP inseguros..."
methods=("PUT" "DELETE" "TRACE" "OPTIONS")

for method in "${methods[@]}"; do
  code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" "$base_url")
  if [[ "$code" -lt 400 ]]; then
    echo "    [⚠] Método habilitado: $method - Código: $code"
  fi
done

# Wordlist para fuzzing
wordlist=( "admin" "login" "api" "dashboard" "config" "test" "backup" ".env" "api/docs" "api/v1" "api/v2" "console" "control" "cpanel" "debug" "panel" "phpmyadmin" "private" "robots.txt" "secret" "file" "server-status" "sitemap.xml" "staging" "wp-admin" "wp-login.php" )

echo -e "\n[FUZZING] Escaneando rutas comunes..."
for path in "${wordlist[@]}"; do
  full_url="${base_url}${path}"
  code=$(curl -s -o /dev/null -w "%{http_code}" "$full_url")

  if [[ "$code" != "404" ]]; then
    echo "    [✓] Encontrado: $full_url => $code"
    if [[ "$path" == *"api"* ]]; then
      echo "        [API] Endpoint de API posible detectado."
    fi

    cookies=$(curl -s -I "$full_url" | grep -i "Set-Cookie")
    if [[ -n "$cookies" ]]; then
      echo "        [🍪] Cookies:"
      echo "$cookies" | sed 's/^/            /'
    fi

    if [[ "$path" == *.env ]] || [[ "$path" == ".git" ]]; then
      echo "        [⚠] Fuga de archivo sensible detectada: $path"
    fi

    if [[ "$path" == "server-status" ]]; then
      echo "        [⚠] Apache mod_status puede estar expuesto."
    fi
  fi
done

# SQL Injection tests
sql_payloads=( "' OR '1'='1" '" OR "1"="1' "';--" "' OR 1=1--" )
echo -e "\n[SQLI] Probando inyección SQL básica..."
for payload in "${sql_payloads[@]}"; do
  test_url="${base_url}?id=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$payload'''))")"
  content=$(curl -s "$test_url")
  if echo "$content" | grep -Ei "sql syntax|mysql|syntax error" >/dev/null; then
    echo "    [⚠] Posible vulnerabilidad SQLi detectada en: $test_url"
  fi
done

# XSS tests
xss_payloads=( "<script>alert(1)</script>" "\"'><script>alert(1)</script>" )
echo -e "\n[XSS] Probando vulnerabilidades XSS básicas..."
for payload in "${xss_payloads[@]}"; do
  test_url="${base_url}?q=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$payload'''))")"
  content=$(curl -s "$test_url")
  if echo "$content" | grep -F "$payload" >/dev/null; then
    echo "    [⚠] Posible vulnerabilidad XSS detectada en: $test_url"
  fi
done

echo -e "\n[✓] Escaneo completo finalizado."
