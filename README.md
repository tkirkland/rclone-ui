# Rclone UI (Personal Fork)

A personal fork of [rclone-ui/rclone-ui](https://github.com/rclone-ui/rclone-ui) — a cross-platform GUI for [rclone](https://rclone.org).

## What's Different

This fork removes the licensing/updater system and produces unsigned personal builds for:
- **Linux x64** (`.deb`, `.rpm`)
- **Windows x64** (`.exe`)

Builds are automated via GitHub Actions on every push to `personal_changes`. Upstream is synced daily into `main`.

## Downloads

See [Releases](https://github.com/tkirkland/rclone-ui/releases) for the latest personal build.

For official builds with all platforms, signing, and auto-updates, see the [upstream project](https://github.com/rclone-ui/rclone-ui).

## Docker / Homelab Usage

```yaml
services:
  rclone:
    image: rclone/rclone
    container_name: rclone
    command: rcd --rc-addr=0.0.0.0:5572 --rc-no-auth
    ports:
      - 5572:5572
    volumes:
      - ./config:/config/rclone
      - /path/to/data:/data
```

After starting, open Rclone UI and go to Settings > Hosts. Use `--rc-user` and `--rc-pass` instead of `--rc-no-auth` in production.

## License

The upstream project is published under the [Apache License 2.0](LICENSE). This fork modifies the source for personal use. The licensing/registration system has been removed — if you find the project useful, consider supporting the [original authors](https://github.com/rclone-ui/rclone-ui).
