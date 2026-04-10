---
title: Rustの勉強[マクロ その4]
createdAt: 2026-04-08T11:53
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html>

を読んでいる。

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%AEderive-%E3%83%9E%E3%82%AF%E3%83%AD%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9>

- `TokenStream`をパースする役割を持つ
- まあ今日は分割かな
- どこから読んだか探してたらだいじそうなところあった

> 手続き的マクロを定義する関数は`TokenStream`を入力として受け取り、`TokenStream`を出力として生成します。 `TokenStream`型はRustに内蔵されている`proc_macro`クレートで定義されており、トークンの列を表します。

- 概念が2つあることが分かった

> これを執筆している時点では、手続き的マクロは、独自のクレートに存在する必要があります。

- なるほろね
- crateのcargoに以下を書かなきゃいけない

```toml
[lib]
proc-macro = true

[dependencies]
syn = "1.0"
quote = "1.0"
```

```rust
extern crate proc_macro;

use proc_macro::TokenStream;
use quote::quote;
use syn;

#[proc_macro_derive(HelloMacro)]
pub fn hello_macro_derive(input: TokenStream) -> TokenStream {
    // 操作可能な構文木としてのRustコードの表現を構築する
    // Construct a representation of Rust code as a syntax tree
    // that we can manipulate
    let ast = syn::parse(input).unwrap();

    // トレイトの実装内容を構築
    // Build the trait implementation
    impl_hello_macro(&ast)
}
```

> `TokenStream`をパースする役割を持つ`hello_macro_derive`関数と、構文木を変換する役割を持つ`impl_hello_macro`関数にコードを分割したことに注目してください

- おーなるほどね
  - ガチでパースするわけね
  - 危険な匂いがしてきた

> `proc_macro`クレートはコンパイラのAPIで、私達のコードからRustのコードを読んだり操作したりすることを可能にします。

> `syn`クレートは、文字列からRustコードを構文解析し、処理を行えるデータ構造にします。`quote`クレートは、`syn`データ構造を取り、Rustコードに変換し直します。

- うおーーー
  - マジで駄目な処理そう
  - これが黒魔術

## まとめ

- 結局、メタプログラミングの具体を聞いているだけだなーという感覚

次はこの場所から:

> まもなく`impl_hello_macro`関数を定義し、そこにインクルードしたい新しいRustコードを構築します。
