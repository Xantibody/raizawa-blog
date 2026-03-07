---
title: Rustの勉強[パターンとマッチング その3]
createdAt: 2026-03-07T16:22
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch18-02-refutability.html>

### メモ

- 論駁可能とかいう難しい単語をやった
  - ろんばく

```rust
let Some(x) = some_option_value;
```

- この記法、難しすぎて調べなおした
- 見た目的にわからなかったがsameのときに`x`に台入

```rust
if let Some(x) = some_option_value {
println!("{}", x);
}
```

- これはコンパイル通るけど

```rust
if let x = 5 {
println!("{}", x);
};
```

- これはコンパイルが通らない

- 上が論駁可能で下が論駁不可能らしい
- 雰囲気わかったけどなんで`None`はしかとできるわけ
  - まぁ`enum`だからなのか

- どんな値が来ても必ず `x` に代入できてしまう
  - からっぽい
- 理解

- コンパイラに怒られたらやろう

## まとめ

- 当たり前に辻褄合わせろという話だった

- つぎはこれ
  - パターン記法
  - かなり興味がある

<https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html>
