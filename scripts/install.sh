#!/bin/sh
set -eu

script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
source_file="$script_dir/../vercel-ai-gateway.ts"
plugin_dir="${XDG_CONFIG_HOME:-$HOME/.config}/codexbar/providers"
destination="$plugin_dir/vercel-ai-gateway.ts"

mkdir -p "$plugin_dir"

if [ -e "$destination" ] && ! cmp -s "$source_file" "$destination"; then
  backup="$destination.backup.$(date +%Y%m%d%H%M%S)"
  cp "$destination" "$backup"
  printf 'Backed up the existing plugin to %s\n' "$backup"
fi

cp "$source_file" "$destination"
chmod 600 "$destination"

printf 'Installed Vercel AI Gateway for CodexBar at %s\n' "$destination"
printf 'Open CodexBar Settings > Plugins, click Refresh, and approve the plugin.\n'
