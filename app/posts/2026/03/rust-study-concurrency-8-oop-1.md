---
title: Rustの勉強[並行性 その8, RustのOOP その1]
createdAt: 2026-03-01T12:54
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる
昨日、一日虚無な時間をへてスッキリした

## お勉強

https://doc.rust-jp.rs/book-ja/ch16-04-extensible-concurrency-sync-and-send.html#sync%E3%81%A8send%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%81%A7%E6%8B%A1%E5%BC%B5%E5%8F%AF%E8%83%BD%E3%81%AA%E4%B8%A6%E8%A1%8C%E6%80%A7
ここから初める
確か言語レベルでの平行処理の話だと思う

### メモ

- `Sendマーカートレイト`と`Syncマーカートレイト`とふたつあるらしい

> Rustのほとんどの型はSendですが

- ほう
- んー読み進めていってもよくわからんな

> Sendマーカートレイトは、Sendを実装した型を持つ値の所有権をスレッド間で転送できることを示唆します。
> Syncマーカートレイトは、Syncを実装した型は、複数のスレッドから参照されても安全であることを示唆します。

- ここか

> 故に、Rustの型システムとトレイト境界により、Rc<T>の値を不安全にスレッド間で誤って送信することが絶対ないよう保証してくれるのです。

- あれか、安全にmoveできるトレイトって感じかな
  - しくみはわからんが

> Syncマーカートレイトは、Syncを実装した型は、複数のスレッドから参照されても安全であることを示唆します。
> 言い換えると、&T(Tへの不変参照)がSendなら、型TはSyncであり、参照が他のスレッドに安全に送信できることを意味します

- これを初めに書いてくれ~~~
- これをゼロから実装するのは危ないから`unsafe`になるかもよっていわれた

- よしーいったん並行性終わったぞーーーー
  - 実際に実装しないとわからんな

#### Rustのオブジェクト指向プログラミング機能

https://doc.rust-jp.rs/book-ja/ch17-00-oop.html

- お、OOP
- 最近、これ本当にあっているか？となっているやつ
- 逆に知りたい

> 広くオブジェクト指向と捉えられる特定の特徴と、それらの特徴がこなれたRustでどう表現されるかを探究します

- いいじゃん

> OOP言語は特定の一般的な特徴を共有しています。
> 具体的には、オブジェクトやカプセル化、継承などです。
> それらの個々の特徴が意味するものとRustがサポートしているかを見ましょう。

- 継承に本当にいい思い出がない
- トレイトなら隠蔽されすぎずにきれいに書けるんだろうか

- お、カプセル化

> カプセル化を制御する方法は、第7章で議論しました
> pubキーワードを使用して、自分のコードのどのモジュールや型、関数、メソッドを公開するか決められ、既定ではそれ以外のものは全て非公開になります。

- そうね
  - だからテストのときにprivateな関数のテストできるのすごいって話だったな

```rust
pub struct AveragedCollection {
    list: Vec<i32>,
    average: f64,
}
```

> 構造体は、他のコードが使用できるようにpubで印づけされていますが、構造体のフィールドは非公開のままです。

- おおーなるほど

```rust
impl AveragedCollection {
    pub fn add(&mut self, value: i32) {
        self.list.push(value);
        self.update_average();
    }

    pub fn remove(&mut self) -> Option<i32> {
        let result = self.list.pop();
        match result {
            Some(value) => {
                self.update_average();
                Some(value)
            }
            None => None,
        }
    }

    pub fn average(&self) -> f64 {
        self.average
    }

    fn update_average(&mut self) {
        let total: i32 = self.list.iter().sum();
        self.average = total as f64 / self.list.len() as f64;
    }
}
```

> 値が追加されたりリストから削除される度に、平均も更新されることを保証したいので、今回の場合重要です。 addやremove、averageメソッドを構造体に実装することでこれをします。
> add、remove、averageの公開メソッドが、AveragedCollectionのインスタンス内のデータにアクセスまたは変更するための、唯一の方法になります。要素がaddメソッドを使用してlistに追加されたり、removeメソッドを使用して削除されたりすると、各メソッドの実装がaverageフィールドの更新を扱う非公開のupdate_averageメソッドも呼び出します。

- `getter`、`setter`を脳死で書くよりよほど意味のあるプログラミングだと思う

## まとめ

- トレイトマーカーで不変か可変の参照かを明示的にできるということが書いてあった
- OOPを始めた
  - OOPは本当にこれできるのかという疑問があるから感動させてほしい

次はここから
https://doc.rust-jp.rs/book-ja/ch17-01-what-is-oo.html#:~:text=add%E3%80%81remove%E3%80%81average%E3%81%AE%E5%85%AC%E9%96%8B%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%81%8C%E3%80%81AveragedCollection%E3%81%AE%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E5%86%85%E3%81%AE%E3%83%87%E3%83%BC%E3%82%BF%E3%81%AB%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%BE%E3%81%9F%E3%81%AF%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B%E3%81%9F%E3%82%81%E3%81%AE%E3%80%81%20%E5%94%AF%E4%B8%80%E3%81%AE%E6%96%B9%E6%B3%95%E3%81%AB%E3%81%AA%E3%82%8A%E3%81%BE%E3%81%99%E3%80%82%E8%A6%81%E7%B4%A0%E3%81%8Cadd%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6list%E3%81%AB%E8%BF%BD%E5%8A%A0%E3%81%95%E3%82%8C%E3%81%9F%E3%82%8A%E3%80%81remove%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%82%92%E4%BD%BF%E7%94%A8%E3%81%97%E3%81%A6%E5%89%8A%E9%99%A4%E3%81%95%E3%82%8C%E3%81%9F%E3%82%8A%E3%81%99%E3%82%8B%E3%81%A8%E3%80%81%20%E5%90%84%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%81%AE%E5%AE%9F%E8%A3%85%E3%81%8Caverage%E3%83%95%E3%82%A3%E3%83%BC%E3%83%AB%E3%83%89%E3%81%AE%E6%9B%B4%E6%96%B0%E3%82%92%E6%89%B1%E3%81%86%E9%9D%9E%E5%85%AC%E9%96%8B%E3%81%AEupdate%5Faverage%E3%83%A1%E3%82%BD%E3%83%83%E3%83%89%E3%82%82%E5%91%BC%E3%81%B3%E5%87%BA%E3%81%97%E3%81%BE%E3%81%99
