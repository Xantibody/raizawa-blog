---
title: Rustの勉強[パターンとマッチング その6]
createdAt: 2026-03-09T10:16
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

- 昨日は逆から読んで後悔した
- あまりにもどうでもいい作業中に並行してやることにした

## お勉強

https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#:~:text=%E3%81%A8y%E3%81%A7%E3%81%99%E3%80%82-,%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E5%90%8D%3A%20src/main.rs,-struct%20Point%20{%0A%20%20%20%20x

ここから

### メモ

```rust
fn main() {
    let p = Point { x: 0, y: 7 };

    match p {
        // x軸上の{}
        Point { x, y: 0 } => println!("On the x axis at {}", x),
        // y軸上の{}
        Point { x: 0, y } => println!("On the y axis at {}", y),
        // どちらの軸上でもない: ({}, {})
        Point { x, y } => println!("On neither axis: ({}, {})", x, y),
    }
}
```

- お、これいいじゃん
- これは分かりやすい`match`な気がしている
- `Point { x, y }`はその他すべてだが、マッチガードを使ってるから`match`内の`println!`で使う変数を定義してるんだな
  - `_`にできたほうがわかりやすいんだが

- なるほど、分配の意味がわかってきた

```rust
enum Message {
    Quit,
    Move { x: i32, y: i32 },
    Write(String),
    ChangeColor(i32, i32, i32),
}

fn main() {
    let msg = Message::ChangeColor(0, 160, 255);

    match msg {
        Message::Quit => {
            // Quit列挙子には分配すべきデータがない
            println!("The Quit variant has no data to destructure.")
        }
        Message::Move { x, y } => {
            println!(
                // x方向に{}、y方向に{}だけ動く
                "Move in the x direction {} and in the y direction {}",
                x, y
            );
        }
        // テキストメッセージ: {}
        Message::Write(text) => println!("Text message: {}", text),
        Message::ChangeColor(r, g, b) => {
            println!(
                // 色を赤{}, 緑{}, 青{}に変更
                "Change the color to red {}, green {}, and blue {}",
                r, g, b
            )
        }
    }
}
```

```rust
Message::Write(text) => println!("Text message: {}", text),
        Message::ChangeColor(r, g, b) => {
            println!(
                // 色を赤{}, 緑{}, 青{}に変更
                "Change the color to red {}, green {}, and blue {}",
                r, g, b
            )
        }
```

- ここか
  - 変数を使ってる箇所
  - 特段新しいことはしていない

## まとめ

- 思ったより便利な`match`が多いなーと思った
  - とはいえここで理解したいだけで実装するときはAIのレビューか調べ直しする気がする
    - まあ知っていることがいいんだろうな
- 他のことと並行しながらやるのやっぱクリティ激下がるな

色々試してしまってるので進捗遅いが次はここ

https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#:~:text=%E5%80%A4%E3%81%AB%E5%88%86%E9%85%8D%E3%81%99%E3%82%8B-,%E3%81%93%E3%81%AE,%E3%81%97%E3%82%87%E3%81%86,-%3A
