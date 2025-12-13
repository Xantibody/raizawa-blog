{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      nixpkgs,
      systems,
      ...
    }:
    let
      forAllSystems = f: nixpkgs.lib.genAttrs (import systems) (system: f system);
    in
    {
      devShells = forAllSystems (
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ (import ./nix/textlint-jtf-style.nix) ];
          };
          textlintrc = (pkgs.formats.json { }).generate "textlintrc" {
            plugins = {
              "@textlint/markdown" = true;
            };
            rules = {
              #  preset-jtf-style = true;
              preset-ja-technical-writing = {
                ja-no-mixed-period = false;
                no-exclamation-question-mark = false;
              };
              write-good = true;
              prh = {
                rulePaths = [
                  "${pkgs.textlint-rule-prh}/lib/node_modules/textlint-rule-prh/node_modules/prh/prh-rules/media/techbooster.yml"
                  "${pkgs.textlint-rule-prh}/lib/node_modules/textlint-rule-prh/node_modules/prh/prh-rules/media/WEB+DB_PRESS.yml"
                ];
              };
            };
          };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              hugo
              rumdl
              nodejs
              (textlint.withPackages [
                textlint-rule-preset-ja-technical-writing
                textlint-rule-prh
                textlint-rule-write-good
                #    textlint-rule-preset-jtf-style
                "@textlint/markdown"
              ])
            ];

            shellHook = ''
              [ -f .textlintrc ] && unlink .textlintrc
              ln -s ${textlintrc} .textlintrc
              $SHELL
            '';
          };
        }
      );
    };
}
