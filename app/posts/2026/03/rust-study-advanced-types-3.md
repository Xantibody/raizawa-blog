---
title: Rustの勉強[高度な型 その3]
createdAt: 2026-03-27T14:05
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>

を読んでいる

- スト6をやるために広島に向かっている
- 新幹線でRust

## お勉強

- 引き続きこれをやっている

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html#never%E5%9E%8B%E3%81%AF%E7%B5%B6%E5%AF%BE%E3%81%AB%E8%BF%94%E3%82%89%E3%81%AA%E3%81%84>

### メモ

- `!`の取り合つかいが全く頭に入ってこなかった

```rust
let guess: u32 = match guess.trim().parse() {
    Ok(num) => num,
    Err(_) => continue,
};
```

- `guess.trim().parse()`が`Result`で帰ってくるってことでしょ?
- `let`だから型はコンパイル時に確定しなきゃいけないくて、`num`の型が帰ってくるようにすると`Err`は`!`型で帰ってくる
- この型がどの型にも適応できるnever型という理解
- 良さそうな理解な気がする

```rust
impl<T> Option<T> {
    pub fn unwrap(self) -> T {
        match self {
            Some(val) => val,
            None => panic!("called `Option::unwrap()` on a `None` value"),
        }
    }
}
```

- `unwrap`のコードらしい

> `panic!`の型は`!`なので、`match`式全体の結果は`T`と確認します。

- なるほど
- `T`は`val`の型であって、`panic!`の戻り値は`!`
- よって`val`の型、すなわち`T`にも適応できるということ
  - たぶんね

> `val`の型は`T`で、 `panic!`の型は`!`なので、`match`式全体の結果は`T`と確認します。

- 先走って書いたらあったわここに

> コンパイラが特定の型の値1つにどれくらいのスペースのメモリを確保するのかなどの特定の詳細を知る必要があるために、 Rustの型システムには混乱を招きやすい細かな仕様があります: 動的サイズ決定型の概念です。
>
> 時としてDSTやサイズなし型とも称され、これらの型により、実行時にしかサイズを知ることのできない値を使用するコードを書かせてくれます。

- おお、ここおもろそうだな

> そうです。`&str`ではなく、`str`は単独でDSTなのです。

- DST is NANI?
- `D`ynamically `S`ized `T`ypesっぽい
- ああ、普通に動的サイズというのを英語にしただけっぽいな

## まとめ

- neverが分かって結構スッキリした
- 応用編だからちょっとカロリーが高いな
- 次ここ

<https://doc.rust-jp.rs/book-ja/ch19-04-advanced-types.html#%E5%8B%95%E7%9A%84%E3%82%B5%E3%82%A4%E3%82%BA%E6%B1%BA%E5%AE%9A%E5%9E%8B%E3%81%A8sized%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88>
