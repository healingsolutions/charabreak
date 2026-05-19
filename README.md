# Gaming Web Local MVP

This workspace contains a Docker-based WordPress demo and the `gaming-web` plugin.

## Quick Start

```powershell
.\scripts\setup-wordpress.ps1
```

Then open:

- Site: `http://localhost:8089`
- Admin: `http://localhost:8089/wp-admin`
- Login: `admin / password`

The setup script starts Docker, installs WordPress if needed, activates the plugin, enables Gaming Web settings, and seeds 10 pages plus 30 posts of Japanese demo content.

## Apollo Elementor Demo

The local demo can also use the Apollo business consulting Elementor template kit as a polished business-site surface for Gaming Web.

Required local plugins:

```powershell
docker compose run --rm wpcli plugin install elementor elementskit-lite romethemeform --activate
```

Place/extract the Apollo kit into `gaming-web/_tmp_apollo`, then import the selected Elementor pages:

```powershell
docker compose run --rm wpcli eval-file /var/www/html/wp-content/plugins/gaming-web/scripts/import-apollo-kit.php
```

The importer creates seven Elementor pages, enables Gaming Web on them, adds clear rewards, and sets `Apollo Business Gaming Demo` as the front page. It does not change the active theme or import site-wide template settings.

## Manual Commands

```powershell
docker compose up -d
docker compose run --rm wpcli core install --url="http://localhost:8089" --title="Gaming Web Demo" --admin_user="admin" --admin_password="password" --admin_email="admin@example.test" --skip-email
docker compose run --rm wpcli plugin activate gaming-web
docker compose run --rm wpcli eval-file /var/www/html/wp-content/plugins/gaming-web/scripts/seed-demo.php
```

## Notes

- Plugin assets load only on enabled singular pages/posts.
- The game layer uses overlay DOM only and removes itself on exit.
- Anonymous events are stored in `wp_gaming_web_events`.
- The JavaScript core is split into framework-agnostic ES Modules under `gaming-web/assets/js`.
