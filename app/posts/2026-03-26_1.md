---
title: Rustの勉強[高度なトレイト その4]
createdAt: 2026-03-26T04:11
category: ぎじゅつ
tags:
  - Rust
---

## 始めに

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html>

を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html#%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E5%88%A5%E3%81%AE%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E5%86%85%E3%81%A7%E3%81%82%E3%82%8B%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%81%AE%E6%A9%9F%E8%83%BD%E3%82%92%E5%BF%85%E8%A6%81%E3%81%A8%E3%81%99%E3%82%8B>

ここかららしい

### メモ

```rust
use std::fmt;

trait OutlinePrint: fmt::Display {
    fn outline_print(&self) {
        let output = self.to_string();
        let len = output.len();
        println!("{}", "_".repeat(len + 4));
        println!("_{}_", " ".repeat(len + 2));
        println!("_ {} _", output);
        println!("_{}_", " ".repeat(len + 2));
        println!("{}", "_".repeat(len + 4));
    }
}
```

- これ何の話してんだって思ったけどstdライブラリか

```bash
error[E0277]: the trait bound `Point: std::fmt::Display` is not satisfied
  --> src/main.rs:20:6
   |
20 | impl OutlinePrint for Point {}
   |      ^^^^^^^^^^^^ `Point` cannot be formatted with the default formatter;
try using `:?` instead if you are using a format string
   |
   = help: the trait `std::fmt::Display` is not implemented for `Point`
```

- ディスプレイの実装を満たしたらしい
- あー

> 時として、あるトレイトに別のトレイトの機能を使用させる必要がある可能性があります。この場合、依存するトレイトも実装されることを信用する必要があります。信用するトレイトは、実装しているトレイトのスーパートレイトです。

- ここの依存関係のトレイトも満たしてねッて感じだった

次

> ニュータイプという用語は、 Haskellプログラミング言語に端を発しています。

- ここかっこよくて抜選した

> このパターンを使用するのに実行時のパフォーマンスを犠牲にすることはなく、ラッパ型はコンパイル時に省かれます

- なんか凄そうなこと書いてあるぞ

- ニュータイプパターン、まったくわからん
- あーなるほど

```rust
use std::fmt;

struct Wrapper(Vec<String>);

impl fmt::Display for Wrapper {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "[{}]", self.0.join(", "))
    }
}

fn main() {
    let w = Wrapper(vec![String::from("hello"), String::from("world")]);
    println!("w = {}", w);
}
```

- そもそも前提として同じプロジェクト内か同じクレート内じゃないと実装できない制約を`wrapper`で囲んでいるという話

## まとめ

- まぁエッジケースだな（2回目）
- 普通はエラーがでて初めて調べることになりそう

次は高度な型

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html>
