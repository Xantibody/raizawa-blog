---
title: Rustの勉強[RustのOOP その3 & パターンとマッチング その1]
createdAt: 2026-03-06T02:26
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch17-03-oo-design-patterns.html#%E9%81%B7%E7%A7%BB%E3%82%92%E7%95%B0%E3%81%AA%E3%82%8B%E5%9E%8B%E3%81%B8%E3%81%AE%E5%A4%89%E5%BD%A2%E3%81%A8%E3%81%97%E3%81%A6%E5%AE%9F%E8%A3%85%E3%81%99%E3%82%8B>

- ここやる

### メモ

```rust
impl DraftPost {
    // --snip--
    pub fn request_review(self) -> PendingReviewPost {
        PendingReviewPost {
            content: self.content,
        }
    }
}

pub struct PendingReviewPost {
    content: String,
}

impl PendingReviewPost {
    pub fn approve(self) -> Post {
        Post {
            content: self.content,
        }
    }
}
```

- んー？なんか複雑になってないか？
  - あ、いや違うか
  - `Post`のインスタンスを作るためには`approve`を経由する必要があるわけね
  - 理解理解

```rust
use blog::Post;

fn main() {
    let mut post = Post::new();

    post.add_text("I ate a salad for lunch today");

    let post = post.request_review();

    let post = post.approve();

    assert_eq!("I ate a salad for lunch today", post.content());
}
```

> `post`を再代入するために`main`に行う必要のあった変更は、この実装がもう、 全くオブジェクト指向のステートパターンに沿っていないことを意味します: 状態間の変形は最早、`Post`実装内に完全にカプセル化されていません。

- でもこの実装いいじゃん

> 型システムとコンパイル時に起きる型チェックのおかげでもう無効な状態があり得なくなりました。

- うーん、いいのかもしれないけどRust特有で怖いな

> オブジェクト指向パターンは、 必ずしもRustの強みを活かす最善の方法にはなりませんが、利用可能な選択肢の1つではあります。

- まーこれがすべてだよな

<https://doc.rust-jp.rs/book-ja/ch18-00-patterns.html>

- 別の章にきました

```rust
match VALUE {
PATTERN => EXPRESSION,
PATTERN => EXPRESSION,
PATTERN => EXPRESSION,
}
```

> `match`式の必須事項の1つは、`match`式の値の可能性全てが考慮されなければならないという意味で網羅的である必要があることです。

- これやったな
  - だから漏れがないとも言えると
  - `_`を利用するとスキップできてしまうので

- `if let`もやったな
  - オレかオレ以外のマッチングパターン

```rust
fn main() {
let favorite*color: Option<&str> = None;
let is_tuesday = false;
let age: Result<u8, *> = "34".parse();

    if let Some(color) = favorite_color {
        // あなたのお気に入りの色、{}を背景色に使用します
        println!("Using your favorite color, {}, as the background", color);
    } else if is_tuesday {
        // 火曜日は緑の日！
        println!("Tuesday is green day!");
    } else if let Ok(age) = age {
        if age > 30 {
            // 紫を背景色に使用します
            println!("Using purple as the background color");
        } else {
            // オレンジを背景色に使用します
            println!("Using orange as the background color");
        }
    } else {
        // 青を背景色に使用します
        println!("Using blue as the background color");
    }

}
```

- なにこれ
  - 絶対にもっといい書き方あるだろ

> `if let`式を使うことの欠点は、コンパイラが網羅性を確認してくれないことです。

- なのでオレかオレ以外かでしか使わないほうがいい認識

- `while let`
  - うーん、これもループ書きたくないとき用かな

> `while`ループは`pop`が`Some`を返す限り、ブロックのコードを実行し続けます。 `pop`が`None`を返すと、ループは停止します。`while let`を使用してスタックから全ての要素を取り出せるのです

- いちおう最後まで見てくれるのか
  - いいかもね

```rust
let v = vec!['a', 'b', 'c'];

for (index, value) in v.iter().enumerate() {
println!("{} is at index {}", value, index);
}
```

- ほーん、`index`と`value`が取れるんだ
  - こういう言語意外とない気がする

## まとめ

- OOPはなんか学んだという感じはしなかった
- マッチパターンはおもしろい
- `while let`はどこかで使えそう

- 次は`let`から

<https://doc.rust-jp.rs/book-ja/ch18-01-all-the-places-for-patterns.html#let%E6%96%87>
