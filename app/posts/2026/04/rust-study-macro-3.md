---
title: Rustの勉強[マクロ その3]
createdAt: 2026-04-08T03:28
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html>

を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%AEderive-%E3%83%9E%E3%82%AF%E3%83%AD%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9>

- `derive`?をやる

### メモ

> `hello_macro`関数の既定の実装を得られるように、手続き的マクロを提供します。

- あ、これ手続き的なんやね
- AIと壁打ちしてなんとなくnixでわかった
  - Derivationは手続き的
  - moduleを利用するときは宣言的（なことがおおい）
- 戻りましょ

```rust
use hello_macro::HelloMacro;
use hello_macro_derive::HelloMacro;

#[derive(HelloMacro)]
struct Pancakes;

fn main() {
    Pancakes::hello_macro();
}
```

- これを書けるようにしたい

```rust
pub trait HelloMacro {
    fn hello_macro();
}
```

```rust
use hello_macro::HelloMacro;

struct Pancakes;

impl HelloMacro for Pancakes {
    fn hello_macro() {
        println!("Hello, Macro! My name is Pancakes!");
    }
}

fn main() {
    Pancakes::hello_macro();
}
```

- この辺を定義する
- まあ分かるか

> しかしながら、使用者は、`hello_macro`を使用したい型それぞれに実装ブロックを記述する必要があります; この作業をしなくても済むようにしたいです。

- 繰り返しだしなー

> Rustにはリフレクションの能力がないので、型の名前を実行時に検索することができないのです。コンパイル時にコード生成するマクロが必要です。

- Rustってリフレクションないのか

> `foo`というクレートに対して、カスタムの`derive`手続き的マクロクレートは`foo_derive`と呼ばれます。

- あー`derive`っていうマクロかと思ったけど機能の名称なんだ
- `hello_macro`にこれが必要らしい

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

- 終わってるぐらいわからない

## まとめ

- 最後まったく分からなかった
- あんまりダラダラやりたくないなー
- 次はここから
  - `TokenStream`をパースする役割をもつ
