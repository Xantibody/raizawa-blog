---
title: Rustの勉強[高度な型 その1]
createdAt: 2026-03-26T04:15
category: ぎじゅつ
tags:
  - Rust
---

## 始めに

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html>

を読んでいる

## お勉強

- 高度な型らしい
- 型システムはおもしろい
- ざっくり読んだが、まとまりがあるわけではなくHowtoっぽい

### メモ

ニュータイプパターン

- これは前回の概念なら外部のプロジェクトかクレートにある者どうしを組み合わせるためにwrapperを作って包むみたいな感じやった
- あー内部の型はシンプルだが、ラップして隠蔽することによって型として強制できるって話か
- これはいいな

型エイリアス

- `Box<Fn() + Send + 'static>`これなんだ
- trait boundっぽくね？となったがさらっと紹介されていたらしい

```rust
let f: Box<Fn() + Send + 'static> = Box::new(|| println!("hi"));

fn takes_long_type(f: Box<Fn() + Send + 'static>) {
    // --snip--
}

fn returns_long_type() -> Box<Fn() + Send + 'static> {
    // --snip--
}
```

- これを書き続けるのはつらい

```rust
type Thunk = Box<Fn() + Send + 'static>;

let f: Thunk = Box::new(|| println!("hi"));

fn takes_long_type(f: Thunk) {
    // --snip--
}

fn returns_long_type() -> Thunk {
    // --snip--
}
```

- だからこうやって書く
- とても理解できる

## まとめ

- 型システムおもろいな
- 多分一番好きな部分かもしれない
