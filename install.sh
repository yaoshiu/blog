#!/bin/sh

curl -fsSL https://deno.land/install.sh | sh

/vercel/.deno/bin/deno install --allow-scripts
