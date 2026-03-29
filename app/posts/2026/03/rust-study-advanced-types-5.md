---
title: Rustの勉強[高度な型 その5]
createdAt: 2026-03-30T02:28
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html#%E5%8B%95%E7%9A%84%E3%82%B5%E3%82%A4%E3%82%BA%E6%B1%BA%E5%AE%9A%E5%9E%8B%E3%81%A8sized%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88>

- `Sized`トレイトね

### メモ

> 既定では、ジェネリック関数はコンパイル時に判明するサイズがある型に対してのみ動きます。ですが、以下の特別な記法を用いてこの制限を緩めることができます

- はいはい
- いちおう制約があるのね

```rust
fn generic<T: ?Sized>(t: &T) {
    // --snip--
}
```

> `?Sized`のトレイト境界は、`Sized`のトレイト境界の逆になります: これを「`T`は`Sized`かもしれないし、違うかもしれない」と解読するでしょう。この記法は、`Sized`にのみ利用可能で、他のトレイトにはありません。

- 唯一無二
- trait boundの記法が壊れた
- あー理解した
  - ジェネリクスで受け取るときの関数側の記法か
- おけおけ

<https://doc.rust-jp.rs/book-ja/ch19-05-advanced-functions-and-closures.html>

- 高度な関数とクロージャきた

## まとめ

- なんか予測しずらい概念だと進みが遅いな
- 難しい
- どう早めるか

次はこれ

<https://doc.rust-jp.rs/book-ja/ch19-05-advanced-functions-and-closures.html>
