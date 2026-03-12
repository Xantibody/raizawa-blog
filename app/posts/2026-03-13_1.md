---
title: Rustの勉強[パターンとマッチング その8]
createdAt: 2026-03-13T02:07
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

- 時間を20分から15分に変えた
  - どれだけ詰め込めるか

<https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#ref%E3%81%A8ref-mut%E3%81%A7%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3%E3%81%AB%E5%8F%82%E7%85%A7%E3%82%92%E7%94%9F%E6%88%90%E3%81%99%E3%82%8B>

- ここから

### メモ

- `ref`って出てきたんだっけ
  - 記憶ねぇ

```rust
let robot_name = Some(String::from("Bors"));

match robot_name {
// 名前が見つかりました: {}
Some(name) => println!("Found a name: {}", name),
None => (),
}

// robot_nameは: {:?}
println!("robot_name is: {:?}", robot_name);
```

- これが失敗するらしい

> このコードを修正するために、`Some(name)`パターンに所有権を奪わせるのではなく、`robot_name`のその部分を借用させたいです。

- なるほどな、`&`でいい

> パターンの外なら、値を借用する手段は、`&`で参照を生成することだと既にご認識でしょうから、解決策は`Some(name)`を`Some(&name)`に変えることだとお考えかもしれませんね。

- 先回りされてる

> しかしながら、「分配して値を分解する」節で見かけたように、パターンにおける`&`記法は参照を生成せず、値の既存の参照にマッチします。

- うげ、なるほど

```rust
let robot_name = Some(String::from("Bors"));

match robot_name {
Some(ref name) => println!("Found a name: {}", name),
None => (),
}

println!("robot_name is: {:?}", robot_name);
```

- だから`ref`をつけるわけね
  - 理解

- 可変だと`ref mut`を付けるらしい
  - やらないほうがよさそう

- マッチガードは結構前に見たな
  - `match`のなかに新たに条件分岐が書ける
  - `Some(n)`とか書けば`n`に対しての比較で`match`できる

- 大変だった
  - 使わないと覚えられないなと思った

- `Unsafe`きた
  - だめなやつ

## まとめ

- パターンについては特にない
  - 一旦理解しておく必要があったので読んでいたらかなり長かった

- つぎここ

<https://doc.rust-jp.rs/book-ja/ch19-01-unsafe-rust.html>
