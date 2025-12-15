# nix/overlays/textlint-jtf-style-pnpm.nix
self: super:
let
  inherit (super)
    lib
    fetchFromGitHub
    buildNpmPackage
    fetchPnpmDeps
    pnpm
    nodejs_22
    ;
in
{
  textlint-rule-preset-jtf-style = buildNpmPackage rec {
    pname = "textlint-rule-preset-jtf-style";
    version = "3.0.2";

    src = fetchFromGitHub {
      owner = "textlint-ja";
      repo = "textlint-rule-preset-JTF-style";
      rev = "v${version}";
      hash = "sha256-03s05TZcPN5WY8buxqNNKOXutsYL++REZDYiLIGpFDI="; # ← 1回ビルドして出る sha256 に置換
    };

    # ★ ここがポイント：pnpm ロックを使って依存取得
    pnpmDeps = fetchPnpmDeps {
      inherit src;
      hash = lib.fakeHash; # ← 同上（1回ビルドして出る値を貼る）
    };

    # pnpm 用セットアップフック。unstable なら pnpm.configHook があります
    nativeBuildInputs = [ pnpm.configHook ];

    nodejs = nodejs_22;

    # これは純粋なルールパッケージなのでビルドなしでOK
    dontNpmBuild = true;

    meta = with lib; {
      description = "JTF日本語標準スタイルガイドの textlint プリセット";
      homepage = "https://github.com/textlint-ja/textlint-rule-preset-JTF-style";
      license = licenses.mit;
      platforms = platforms.unix;
    };
  };
}
