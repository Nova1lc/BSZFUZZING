# 🛡️ BSZ Fuzzing Tool - Documentación Técnica

Realiza un escaneo de seguridad completo y automatizado a una URL objetivo, realizando tareas de reconocimiento, detección de configuración, pruebas de vulnerabilidades comunes y descubrimiento de rutas

## 📌 Descripción General

**BSZ Fuzzing** es una herramienta de escaneo web ligera que se ejecuta directamente desde el navegador, sin necesidad de instalación ni dependencias externas.  
Su objetivo principal es ayudar a detectar de forma rápida y automatizada posibles vulnerabilidades, configuraciones incorrectas y rutas sensibles en una aplicación web.

---

## 🛠️ ¿Para qué sirve?

**BSZ Fuzzing** realiza un análisis de seguridad integral sobre una URL objetivo mediante:

- 🔍 **Reconocimiento de cabeceras HTTP**
- 🛡️ **Evaluación de configuración SSL/TLS**
- 🧪 **Pruebas de vulnerabilidades básicas** (XSS, métodos HTTP inseguros, errores SQL)
- 📂 **Fuzzing de rutas y archivos comunes**
- 🧠 **Identificación de tecnologías utilizadas**

Esto permite al usuario obtener una **radiografía técnica del sitio web evaluado**, destacando posibles debilidades que deben ser corregidas.

---

## 🧯 ¿Cómo puede ayudarte a detectar y solucionar errores?

**BSZ Fuzzing** no solo detecta problemas, sino que proporciona información útil para su mitigación:

| Tipo de Problema                         | Descripción                                                               | Acción Recomendada                                      |
|-----------------------------------------|---------------------------------------------------------------------------|---------------------------------------------------------|
| 🔴 Headers de seguridad faltantes       | Cabeceras como `X-Frame-Options`, `Content-Security-Policy` no presentes | Configurar cabeceras en el servidor web                 |
| 🔴 Cookies sin `Secure` / `HttpOnly`    | Las cookies pueden ser robadas o interceptadas                           | Establecer flags en el backend o en el servidor         |
| 🔴 SSL sin HSTS o con certificados inseguros | Posible vulnerabilidad a ataques downgrade o MITM                    | Implementar HSTS y revisar configuración HTTPS           |
| 🟠 Archivos sensibles o rutas expuestas | Acceso a archivos como `.env`, `config.php`, `/admin`                    | Proteger rutas mediante autenticación o eliminación      |
| 🟠 Métodos HTTP inseguros activados     | Métodos como PUT o DELETE abiertos al público                            | Deshabilitar métodos innecesarios desde el servidor      |
| ⚠️ Mensajes de error SQL                | Muestra información de base de datos o errores internos                  | Usar manejo de errores genérico y ocultar trazas        |
| ⚠️ XSS Reflejado                        | Entrada no validada que se refleja en la salida                          | Escapar contenido y validar entradas en frontend/backend |

---

## 🛠️ Funcionalidades Principales

| Categoría                  | Funciones Incluidas                                                                 |
|---------------------------|--------------------------------------------------------------------------------------|
| 🔍 **Análisis de Headers HTTP** | - Detección de headers de seguridad faltantes<br>- Verificación de cookies (Secure / HttpOnly)<br>- Identificación del servidor web |
| 🔐 **Verificación SSL/TLS**     | - Validación de certificados<br>- Comprobación de HSTS                                              |
| 🛣️ **Fuzzing de Rutas**         | - Escaneo de más de 400 rutas comunes y archivos sensibles<br>- Detección de directorios expuestos   |
| 🧪 **Pruebas de Seguridad**     | - Detección de métodos HTTP inseguros<br>- Pruebas XSS reflejadas<br>- Mensajes de error SQL          |
| 🧠 **Detección de Tecnologías** | - Identificación de frameworks frontend y backend<br>- Detección de CMS y sistemas de gestión         |
| 📄 **Generación de Reportes**   | - Exportación de resultados en formato `.txt`                                                         |

---
# ⚙️ Flujo Principal (`startScan()`)

### 🔄 Etapas del Análisis

1. ✅ Validación de URL de entrada
2. 🧠 Análisis de headers HTTP
3. 🔐 Verificación SSL/TLS
4. 🧪 Prueba de métodos HTTP
5. 🔎 Fuzzing de rutas
6. 🚨 Pruebas XSS básicas
7. 🔍 Detección de tecnologías
8. 📄 Generación de reporte

---

# 📊 Tabla de Métodos HTTP Verificados

| Método  | Seguro | Descripción                                |
|---------|--------|--------------------------------------------|
| OPTIONS | ❌     | Puede exponer información sensible         |
| TRACE   | ❌     | Puede ser usado para ataques XST           |
| PUT     | ❌     | Permite modificar recursos                 |
| DELETE  | ❌     | Permite eliminar recursos                  |
| PATCH   | ❌     | Permite modificaciones parciales           |
| GET     | ✅     | Método seguro por defecto                  |
| POST    | ✅     | Método seguro cuando se usa correctamente |

---

# 🔍 Vulnerabilidades Detectables

### 🔧 Configuraciones Inseguras
- Headers de seguridad faltantes
- Cookies sin flags Secure / HttpOnly
- HSTS no implementado

### 📤 Exposición de Información
- Archivos sensibles (`.env`, `config.php`)
- Directorios expuestos (`/admin`, `/backup`)
- Mensajes de error SQL visibles

### 🚨 Problemas de Seguridad
- Métodos HTTP inseguros habilitados
- XSS reflejados básicos
- HTTPS no implementado

---

# 📋 Ejemplo de Uso

1. Ingresar URL objetivo (ej: `https://ejemplo.com`)
2. Hacer clic en **"Iniciar escaneo"**
3. Esperar a que complete el análisis
4. Revisar resultados en pantalla
5. (Opcional) Exportar reporte completo

---

# 🚫 Limitaciones

- Solo prueba vulnerabilidades básicas
- No realiza escaneo autenticado
- Las pruebas XSS son básicas (no DOM-based)
- El fuzzing es limitado al lado cliente (sin crawler profundo)

---

# 📌 Recomendaciones de Uso

- ⚠️ Solo para **pruebas autorizadas**
- ❌ No usar en producción sin permiso
- 🔍 Complementar con herramientas como: Burp Suite, OWASP ZAP
- 🧪 Verificar manualmente posibles falsos positivos

---

# 📂 Estructura del Reporte

```text
[📊 RESUMEN FINAL]
    URL escaneada: https://ejemplo.com
    Tecnologías detectadas: WordPress, jQuery
    Rutas encontradas: 12
    Problemas de seguridad encontrados: 3

[⚠] VULNERABILIDADES:
    - Cookie sin flag Secure
    - HSTS no habilitado
    - Archivo sensible encontrado: /wp-config.php
```

# bash :

<img width="955" height="177" alt="image" src="https://github.com/user-attachments/assets/4c2f29bf-132c-4d6e-96c6-613eb5a572d4" />

# Web : 

<img width="515" height="726" alt="image" src="https://github.com/user-attachments/assets/330ee77f-a2f7-428d-a838-cfb00530b6d2" />

`url : https://appbsz.crearforo.net/h167-bsz-fuzzing-web	`

# ✨ Autor de Scripts Compartido

<table>
  <tr>
    <td valign="middle">
      <a href="https://github.com/Nova1lc">
        <img src="https://github.com/Nova1lc.png" width="30" height="30" style="border-radius: 50%;">
      </a>
    </td>
    <td>
      <b>Nova1lc</b><br>
      🔗 <a href="https://github.com/Nova1lc">github.com/Nova1lc</a><br>
      💻 Ingeniería inversa y optimización de scripts.<br>
      🌐 Proyectos colaborativos y herramientas privadas

        
      🌐 Redes, pentesting.
    </td>
  </tr>
</table>

---

<table>
  <tr>
    <td valign="middle">
      <a href="https://github.com/Avastroficial">
        <img src="https://github.com/Avastroficial.png" width="30" height="30" style="border-radius: 50%;">
      </a>
    </td>
    <td>
      <b>Avastroficial</b><br>
      🔗 <a href="https://github.com/Avastroficial">github.com/Avastroficial</a><br>
      🧠 Automatización, web tools y bots.<br>
      🚀 Explorando nuevos frameworks.
    </td>
  </tr>
</table>

---


## 🤝 Colaboración

Ambos contribuimos con pasión y conocimientos para crear herramientas útiles, estables y fáciles de compartir.  
Este repositorio reúne lo mejor de nuestras ideas y prácticas de desarrollo.

> Si encuentras útil este proyecto, ⭐ dale una estrella y síguenos en GitHub.

# ¡NO ME HAGO RESPONSABLE DEL MAL USO QUE LE DEN!
