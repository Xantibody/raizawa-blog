---
title: Rustの勉強[高度な関数とクロージャ その1]
createdAt: 2026-03-30T12:00
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

- 少しだけ疲れが溜まってる
  - こういうとき無理するとストレスになるので5分だけ

### メモ

> クロージャを関数に渡す方法について語りました; 普通の関数を関数に渡すこともできるのです！

- やばw
- バグりそう
- でもここがポインタという概念なの面白いな

```rust
fn add_one(x: i32) -> i32 {
    x + 1
}

fn do_twice(f: fn(i32) -> i32, arg: i32) -> i32 {
    f(arg) + f(arg)
}

fn main() {
    let answer = do_twice(add_one, 5);

    // 答えは{}
    println!("The answer is: {}", answer);
}
```

- 書き方きんも
  - jsみたいだし、絶対混乱する

## まとめ

- キモかった
- 次も同じ場所
