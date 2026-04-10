---
title: Rustの勉強[マクロ その6]
createdAt: 2026-04-11T05:05
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html>

を読んでいる。

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html#%E5%B1%9E%E6%80%A7%E9%A2%A8%E3%83%9E%E3%82%AF%E3%83%AD>

### メモ

- 〇〇風マクロが2種類ある

> deriveは構造体とenumにしか使えませんでしたが、属性は関数のような他の要素に対しても使えるのです。属性風マクロを使った例を以下に示しています：webアプリケーションフレームワークを使っているときに、routeという関数につける属性名があるとします：

```rust
#[route(GET, "/")]
fn index() {
```

- Spring Bootで見たな

```rust
#[proc_macro_attribute]
pub fn route(attr: TokenStream, item: TokenStream) -> TokenStream {
```

- ああそうか、今までとは違って引数が2つあるんだな

> 関数風マクロは、関数呼び出しのように見えるマクロを定義します。

- なるほど

```rust
let sql = sql!(SELECT * FROM posts WHERE id=1);
```

- これが

```rust
#[proc_macro]
pub fn sql(input: TokenStream) -> TokenStream {
```

- こうなる

## まとめ

- おおーマクロ終わったぞ！
- 次のプロジェクト学ぼうか悩んだが、それやるぐらいなら自分で書くかー
- やったーおわりー
