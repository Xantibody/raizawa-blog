---
title: Rustの勉強[高度なトレイト その2]
createdAt: 2026-03-20T17:11
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html>

- 疲労困憊していた
- ここをやる
- ここやっている

### メモ

- これ思ったけど章節の節のタイトルがわかりずらいだけなんじゃねってなった

> 演算子に紐づいたトレイトを実装することで`std::ops`に列挙された処理と対応するトレイトをオーバーロードできます。

- ぬーん？
- なんだこれは
- オーバーロードってなんだっけってなったけどオーバーライドとちがって同じ実装を行うだけだった

```rust
use std::ops::Add;

#[derive(Debug, PartialEq)]
struct Point {
    x: i32,
    y: i32,
}

impl Add for Point {
    type Output = Point;

    fn add(self, other: Point) -> Point {
        Point {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

fn main() {
    assert_eq!(
        Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
        Point { x: 3, y: 3 }
    );
}
```

- これのどこがオーバーロードなんだよってなった

```rust
assert_eq!(Point { x: 1, y: 0 } + Point { x: 2, y: 3 },
```

- ここだ、あり得ない足し算してるけど`Add`を`impl`することでできるんだ
- え、これめっちゃ面白いじゃん

<https://doc.rust-lang.org/std/ops/trait.Add.html>

- じゃあ数字じゃないけどまったく同じ特性かつ概念があった場合は実装できるわけか

```rust
use std::ops::Add;

struct Millimeters(u32);
struct Meters(u32);

impl Add<Meters> for Millimeters {
    type Output = Millimeters;

    fn add(self, other: Meters) -> Millimeters {
        Millimeters(self.0 + (other.0 * 1000))
    }
}
```

- おおおお
- えーこれすごい

> `Millimeters`を`Meters`に足すため、`Self`という既定を使う代わりに`impl Add<Meters>`を指定して、 RHS型引数の値をセットしています。

- RHSってなんやねん

<https://doc.rust-jp.rs/rust-by-example-ja/generics/phantom/testcase_units.html#%E3%83%86%E3%82%B9%E3%83%88%E3%82%B1%E3%83%BC%E3%82%B9-%E5%8D%98%E4%BD%8D%E3%82%92%E6%89%B1%E3%81%86>

- なぜかここで見つけた

## まとめ

- 今回は感動度が高かった
- `Add`ってオーバーロードできるんだなー
  - とはいえここができるから複雑な実装をするのは違うので意味を考えて実装していきたい
- これ遊戯王の型の実装に使えるやん
- 次はここ

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html#%E6%98%8E%E7%A2%BA%E5%8C%96%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AE%E3%83%95%E3%83%AB%E3%83%91%E3%82%B9%E8%A8%98%E6%B3%95-%E5%90%8C%E3%81%98%E5%90%8D%E5%89%8D%E3%81%AE%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%82%92%E5%91%BC%E3%81%B6>
