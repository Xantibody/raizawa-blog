---
title: Rustの勉強[高度な型 その2]
createdAt: 2026-03-27T02:58
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html>

を読んでいる。

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html#never%E5%9E%8B%E3%81%AF%E7%B5%B6%E5%AF%BE%E3%81%AB%E8%BF%94%E3%82%89%E3%81%AA%E3%81%84>

- これやる
- めちゃくちゃ疲れとる

### メモ

> Rustには、`!`という名前の特別な型があります。それは型理論の専門用語では Empty型 と呼ばれ値なしを表します

- はえー
- 重要そうじゃん

```rust
fn bar() -> ! {
    // --snip--
}
```

- あ、prefixに付けるとかではなくて本当にこのままなんだ
- だめだ、今日かなり体調悪いかもな

```rust
let guess = match guess.trim().parse() {
    Ok(_) => 5,
    Err(_) => "hello",
}
```

> このコードの`guess`は整数かつ文字列にならなければならないでしょうが、Rustでは、`guess`は1つの型にしかならないことを要求されます。

- まあそうだね

## まとめ

- 全然頭に入ってこなかった
- `!`はわかった
- 引き続き同じところ
