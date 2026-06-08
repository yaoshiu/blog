{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    nixpkgs-astro.url = "github:yaoshiu/nixpkgs";
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      nixpkgs-astro,
      flake-utils,
      treefmt-nix,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
        pkgs-astro = import nixpkgs-astro {
          inherit system;
        };
      in
      {
        devShell = pkgs.mkShell {
          packages = with pkgs; [
            (pnpm.override { nodejs = nodejs-slim_22; })
            bun
            nodejs
            typescript-language-server
            pkgs-astro.astro-language-server
            tailwindcss-language-server
            prettier
          ];
        };


        formatter = treefmt-nix.lib.mkWrapper pkgs {
          projectRootFile = "flake.nix";

          settings = {
            excludes = [
              "*.md"
              "*.ttf"
              "*.woff2"
              "*.txt"
              "*.svg"
              "flake.lock"
              "bun.lockb"
              ".gitignore"
              ".gitattributes"
              ".envrc"
            ];

            formatter.prettier.includes = [ "*.astro" ];
          };

          programs = {
            nixfmt.enable = true;
            prettier = {
              enable = true;
              package = pkgs.prettier;
            };
          };
        };
      }
    );
}
