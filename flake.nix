{
  description = "tcardgen build using buildGoModule";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      lib = nixpkgs.lib;
      pkgs = import nixpkgs { inherit system; };
    in {
      packages.${system}.tcardgen = pkgs.buildGoModule {
        pname = "tcardgen";
        version = "0.0.1";

        src = pkgs.fetchFromGitHub {
          owner = "Xantibody";
          repo = "tcardgen";
          rev = "62bd37ddd6daa4ef077b2f8d5b9262723af65a82";
          sha256 = "sha256-+OyEK9Xb88j8r5LYYcB01K46cQv990yvCkYDUrXdVqM=";
        };

        vendorHash = "sha256-X39L1jDlgdwMALzsVIUBocqxvamrb+M5FZkDCkI5XCc=" ;
      doCheck = false;
      };
    };
}
