{
  inputs = {
    treefmt-nix = {
      url = "github:numtide/treefmt-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
      treefmt-nix,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShell = pkgs.mkShell {
          packages = with pkgs; [
            bun
            nodejs
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
            prettier.enable = true;
          };
        };
      }
    );
}
