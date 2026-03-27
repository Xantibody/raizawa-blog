---
title: Rustの勉強[高度なトレイト その1]
createdAt: 2026-03-20T16:28
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>

を読んでいる。

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html>

高度なトレイトから。

- 久しぶりに新しい章だから光らせねーと
- すげーhow toっぽいなー

### メモ

> 関連型は、ジェネリクスにより扱う型を指定せずに関数を定義できるという点でジェネリクスに似た概念のように思える可能性があります。では、何故関連型を使用するのでしょうか？

- 全然わからん

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}
```

- これが

```rust
impl Iterator for Counter {
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        // --snip--
    }
}
```

- こう実装される

```rust
pub trait Iterator<T> {
    fn next(&mut self) -> Option<T>;
}
```

- これでいいんでねって話をしてる

> 換言すれば、トレイトにジェネリックな引数があると、毎回ジェネリックな型引数の具体的な型を変更してある型に対して複数回実装できるということです。`Counter`に対して`next`メソッドを使用する際に、どの`Iterator`の実装を使用したいか型注釈をつけなければならないでしょう

- ？？？？
- コードで語れ!
- こういうのはgeminiが得意そうだな

```rust
// もしこう定義されていたら...
pub trait GenericIterator<T> {
    fn next(&mut self) -> Option<T>;
}

struct MyCounter {
    count: i32,
}

// 同じ構造体に対して、i32を返すイテレータと
impl GenericIterator<i32> for MyCounter {
    fn next(&mut self) -> Option<i32> {
        Some(self.count)
    }
}

// Stringを返すイテレータを同時に実装できてしまう
impl GenericIterator<String> for MyCounter {
    fn next(&mut self) -> Option<String> {
        Some(self.count.to_string())
    }
}
```

- これを関連型で書くと

```rust
pub trait Iterator {
    // 関連型：実装時に「一つ」だけ型を決める
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}

struct MyCounter {
    count: u32,
}

impl Iterator for MyCounter {
    // ここで型を固定する
    type Item = u32;

    fn next(&mut self) -> Option<Self::Item> {
        self.count += 1;
        if self.count < 3 {
            Some(self.count)
        } else {
            None
        }
    }
}

fn main() {
    let mut counter = MyCounter { count: 0 };

    // 型が一つに決まっているので、推論が完璧に効く
    while let Some(v) = counter.next() {
        println!("{}", v);
    }
}
```

- 推論が楽になるのか
- まぁあんまり使わないほうがいいんだろうな
  - 面倒なほうが隠蔽できないし

## まとめ

- なんで？ってなったが記述量を減らすためだった
- だけどこれって標準の`crate`だからいいんだよな
- `crate`を作るなら必要かなと感じた
