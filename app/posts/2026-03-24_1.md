---
title: Rustの勉強[高度なトレイト その3]
createdAt: 2026-03-24T02:05
category: ぎじゅつ
tags:
  - Rust
---

## 始めに

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html>

を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html#%E6%98%8E%E7%A2%BA%E5%8C%96%E3%81%AE%E3%81%9F%E3%82%81%E3%81%AE%E3%83%95%E3%83%AB%E3%83%91%E3%82%B9%E8%A8%98%E6%B3%95-%E5%90%8C%E3%81%98%E5%90%8D%E5%89%8D%E3%81%AE%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%82%92%E5%91%BC%E3%81%B6>

- 前回やろうとしていたこれ
- トレイト

### メモ

```rust
trait Pilot {
    fn fly(&self);
}

trait Wizard {
    fn fly(&self);
}

struct Human;

impl Pilot for Human {
    fn fly(&self) {
        // キャプテンのお言葉
        println!("This is your captain speaking.");
    }
}

impl Wizard for Human {
    fn fly(&self) {
        // 上がれ！
        println!("Up!");
    }
}

impl Human {
    fn fly(&self) {
        // *激しく腕を振る*
        println!("*waving arms furiously*");
    }
}
```

- んあーなるほど、別のトレイトの同じメソッドか
- 普通に設計ミスってそうだが

```rust
fn main() {
    let person = Human;
    Pilot::fly(&person);
    Wizard::fly(&person);
    person.fly();
}
```

- なるほどね、`&self` だから自身を借用しないといけないのか

```rust
trait Animal {
    fn baby_name() -> String;
}

struct Dog;

impl Dog {
    fn baby_name() -> String {
        // スポット(Wikipediaによると、飼い主の事故死後もその人の帰りを待つ忠犬の名前の模様)
        String::from("Spot")
    }
}

impl Animal for Dog {
    fn baby_name() -> String {
        // 子犬
        String::from("puppy")
    }
}

fn main() {
    // 赤ちゃん犬は{}と呼ばれる
    println!("A baby dog is called a {}", Dog::baby_name());
}
```

- なるほど

```bash
A baby dog is called a Spot
```

- こういう結果になるのか
- 普通に設計ミスだと思ってしまう

> `Dog` に対して `Animal` 実装を使用したいと明確化し、コンパイラに指示するには、フルパス記法を使う必要があります。

```rust
fn main() {
    println!("A baby dog is called a {}", <Dog as Animal>::baby_name());
}
```

- いやーだめだろ
  - 呼べるんだけどさ
  - 読みづらすぎる

> スーパートレイトを使用して別のトレイト内で、あるトレイトの機能を必要とする

> 時として、あるトレイトに別のトレイトの機能を使用させる必要がある可能性があります。

- ほんとに？
  - エッジケースすぎるだろ

## まとめ

- 設計ミスだろで片付きそうな機能ばかりでつらいな
- あまりにもエッジケースすぎて進むのおっそい

次ここ

<https://doc.rust-jp.rs/book-ja/ch19-03-advanced-traits.html#%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E5%88%A5%E3%81%AE%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E5%86%85%E3%81%A7%E3%81%82%E3%82%8B%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%81%AE%E6%A9%9F%E8%83%BD%E3%82%92%E5%BF%85%E8%A6%81%E3%81%A8%E3%81%99%E3%82%8B>
