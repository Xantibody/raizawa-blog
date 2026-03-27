---
title: Rustの勉強[RustのOOP その3]
createdAt: 2026-03-04T02:41
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

- 早起きした
- 久々にこの体調を経験したが二度とやりたくない
  - 寝たのに全然体は起きない
  - 現場仕事していた時期からそう

## お勉強

<https://doc.rust-jp.rs/book-ja/ch17-02-trait-objects.html>

- これっぽい

<https://doc.rust-jp.rs/book-ja/ch17-03-oo-design-patterns.html>

- こっちだった

### メモ

> ステートパターンは、オブジェクト指向デザインパターンの1つです。 このパターンの肝は、値が内部的に持つことができる状態の集合を定義するということです。

- ステートレスなんて話よく聞くから今なら馴染むな
- `Mutex`とかこれで使えそうだよな

```rust
pub struct Post {
    state: Option<Box<dyn State>>,
    content: String,
}

impl Post {
    pub fn new() -> Post {
        Post {
            state: Some(Box::new(Draft {})),
            content: String::new(),
        }
    }
}

trait State {}

struct Draft {}

impl State for Draft {}
```

- この`dyn`やってない気がする
- んー言うことないな
  - 結局、Javaの継承の思考と同じ
  - クラスやインターフェースの役割をトレイトが担ってるからtrait boundでエラーが起きないようにする
- 強いて言うならトレイトの振る舞いがgetter、setterの脳死実装じゃないからちゃんと仕組み化してあることぐらい
- how toすぎるので実装する時に調べればいいな
- もう一つのパターンがあるらしい

```rust
pub struct Post {
    content: String,
}

pub struct DraftPost {
    content: String,
}

impl Post {
    pub fn new() -> DraftPost {
        DraftPost {
            content: String::new(),
        }
    }

    pub fn content(&self) -> &str {
        &self.content
    }
}

impl DraftPost {
    pub fn add_text(&mut self, text: &str) {
        self.content.push_str(text);
    }
}
```

- 俺だったらこっちで書くな

## まとめ

- 特に目新しいことはない
  - 当たり前、というかやって理解してきたことが書いてあった
- いろんな2〜3年で色々な職場みたけどこの思想を持った実装に出会ったことないなと思った
  - 辛いね

- 次ここ、長いな

<https://doc.rust-jp.rs/book-ja/ch17-03-oo-design-patterns.html#%E9%81%B7%E7%A7%BB%E3%82%92%E7%95%B0%E3%81%AA%E3%82%8B%E5%9E%8B%E3%81%B8%E3%81%AE%E5%A4%89%E5%BD%A2%E3%81%A8%E3%81%97%E3%81%A6%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B>
