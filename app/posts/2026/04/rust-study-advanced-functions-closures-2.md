---
title: Rustの勉強[高度な関数とクロージャ その2]
createdAt: 2026-04-01T12:00
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-05-advanced-functions-and-closures.html#%E9%96%A2%E6%95%B0%E3%83%9D%E3%82%A4%E3%83%B3%E3%82%BF>

- これやってる

### メモ

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

- クロージャーのポインタをもらう方法らしい
- `add_one`を入れてるよねって話か
- えー
  - こんな記述したら悪魔のコードが出来上がりそう

> クロージャはトレイトによって表現されます。つまり、クロージャを直接は返却できないのです。

- ふむ

```rust
fn returns_closure() -> Fn(i32) -> i32 {
    |x| x + 1
}
```

- これはだめらしい

```bash
error[E0277]: the trait bound `std::ops::Fn(i32) -> i32 + 'static:
std::marker::Sized` is not satisfied
-->
|
1 | fn returns_closure() -> Fn(i32) -> i32 {
|                         ^^^^^^^^^^^^^^ `std::ops::Fn(i32) -> i32 + 'static`
does not have a constant size known at compile-time
|
= help: the trait `std::marker::Sized` is not implemented for
`std::ops::Fn(i32) -> i32 + 'static`
= note: the return type of a function must have a statically known size
```

- ということはtrait boundみたいな表現をどっかでするのかな？

> エラーは、再度`Sized`トレイトを参照しています！コンパイラには、クロージャを格納するのに必要なスペースがどれくらいかわからないのです。

- また長さが分からない問題か

```rust
fn returns_closure() -> Box<Fn(i32) -> i32> {
    Box::new(|x| x + 1)
}
```

- わろた
  - そりゃそうなんだけど、そういうことか
  - スマートポインタにしろってことね
- 難しー

## まとめ

- マクロちょっとやる
- あと20、21だけかなー

<https://doc.rust-jp.rs/book-ja/ch19-06-macros.html>
