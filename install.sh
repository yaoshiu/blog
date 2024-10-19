#!/bin/sh

curl -fsSL https://deno.land/install.sh | sh

export PATH="/vercel/.deno/bin:$PATH"

deno install --allow-scripts
