---
title: Rustの勉強[パターンとマッチング その4]
createdAt: 2026-03-07T16:24
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

- 町田.pmにきた
- 勉強するつもりがblogを改修してしまった

## お勉強

### メモ

https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html

- パターンから
- `match`の詳細な使いかたっぽい

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        // 50だったよ
        Some(50) => println!("Got 50"),
        // マッチしたよ
        Some(y) => println!("Matched, y = {:?}", y),
        // 既定のケース
        _ => println!("Default case, x = {:?}", x),
    }

    // 最後にはx = {}, y = {}
    println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

> match式内の新しいスコープ内にいるので、これは新しいy変数であり、最初に値10で宣言したyではありません。

- まあそうか
  - ライフタイム的にそうだよな
  - マッチガードで防げるらしい

```rust
fn main() {
    let x = Some(5);
    let y = 10;

    match x {
        Some(50) => println!("Got 50"),
        Some(n) if n == y => println!("Matched, n = {:?}", n),
        _ => println!("Default case, x = {:?}", x),
    }

    println!("at the end: x = {:?}, y = {:?}", x, y);
}
```

- 先取りして見た
- なるほど
  - matchの中にさらに条件式を書く記法があって、そこでyを評価すればいい
  - `n`は新しく`Some(n)`で定義された変数で、`some`の中の値が入っている
  - でsomeの値`n`と外部の`y`を比較できる

## まとめ

- match式に入った
- ライフタイムの考えがなかったのでmatch内も同じ変数が使えると思っていたが違った
- blogの改修をやりすぎた
  - けっこう良くなったので良しとする

明日はこれ  
https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#%E8%A4%87%E6%95%B0%E3%81%AE%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3

もっとざっくり読めそうな予感
