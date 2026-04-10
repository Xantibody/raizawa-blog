---
title: Rustの勉強[マクロ その5]
createdAt: 2026-04-09T12:06
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html>

を読んでいる。

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html#%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%81%AEderive-%E3%83%9E%E3%82%AF%E3%83%AD%E3%81%AE%E6%9B%B8%E3%81%8D%E6%96%B9>

- 遅延して昼から勉強しているが一番元気な時間かもしれない
- 3つのcrateを使ってメタプログラミングすることがわかった

### メモ

- `TokenStream`でコードを生成するがresult型じゃないのでエラーハンドリングが難しい
- そこをうまくやろうと書いている

```rust
fn impl_hello_macro(ast: &syn::DeriveInput) -> TokenStream {
    let name = &ast.ident;
    let gen = quote! {
        impl HelloMacro for #name {
            fn hello_macro() {
                println!("Hello, Macro! My name is {}!", stringify!(#name));
            }
        }
    };
    gen.into()
}
```

- んー宣言のときより普通のコードだな
- ここに関してはちゃんと型使っているのウケるな

> `quote!`マクロを使うことで、私達が返したいRustコードを定義することができます。ただ、コンパイラが期待しているものは`quote!`マクロの実行結果とはちょっと違うものです。なので、`TokenStream`に変換してやる必要があります。

- マクロ作るためにマクロ使っているのにマクロの期待値とは違うとはこれはいかに

> ここで使用した`stringify!`マクロは、言語に組み込まれています。`1 + 2`などのようなRustの式を取り、コンパイル時に`"1 + 2"`のような文字列リテラルにその式を変換します。

- ガチで文字列操作だけでコード書けてしまう
- 説明が長すぎて忘れていたが`#[derive(HelloMacro)]`は`hello_macro`トレイトを自動実装するマクロだった
- 雰囲気だけ分かったが、実際に動かさないと明示的には説明できないなーと思った

## まとめ

- 何でもありすぎて言語の学びとしてこれといえなくなってきた
- 次は多分最後

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html#%E5%B1%9E%E6%80%A7%E9%A2%A8%E3%83%9E%E3%82%AF%E3%83%AD>
