final: prev:
let
  inherit (prev)
    lib
    stdenvNoCC
    fetchFromGitHub
    fetchYarnDeps
    nodejs
    npmHooks
    yarnBuildHook
    yarnConfigHook
    textlint
    ;
in
{
  textlint-rule-preset-jtf-style = stdenvNoCC.mkDerivation (finalAttrs: {
    pname = "textlint-rule-preset-jtf-style";
    version = "3.0.3";

    src = fetchFromGitHub {
      owner = "textlint-ja";
      repo = "textlint-rule-preset-JTF-style";
      tag = "v${finalAttrs.version}";
      hash = "sha256-iI3sK59NOeXrbN+ROqN+68UnkWOureHuPfsNHuiudzM=";
    };

    offlineCache = fetchYarnDeps {
      yarnLock = "${finalAttrs.src}/yarn.lock";
      hash = "sha256-R6Bnay2r1VJ9NKIjvj80r4Jw29nv6lV8+r9N0QTrSTE=";
    };

    nativeBuildInputs = [
      nodejs
      yarnBuildHook
      yarnConfigHook
    ];

    # npmInstallHook を使わず手動でインストール
    # (上流の prepare スクリプトが git を要求するため)
    installPhase = ''
      runHook preInstall
      mkdir -p $out/lib/node_modules/textlint-rule-preset-jtf-style
      cp -r lib package.json $out/lib/node_modules/textlint-rule-preset-jtf-style/
      runHook postInstall
    '';

    meta = {
      description = "JTF日本語標準スタイルガイドの textlint プリセット";
      homepage = "https://github.com/textlint-ja/textlint-rule-preset-JTF-style";
      changelog = "https://github.com/textlint-ja/textlint-rule-preset-JTF-style/releases/tag/v${finalAttrs.version}";
      license = lib.licenses.mit;
      platforms = textlint.meta.platforms;
    };
  });
}
