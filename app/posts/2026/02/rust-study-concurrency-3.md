---
title: Rustの勉強[並行性 その3]
createdAt: 2026-02-24T01:40
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

- メッセージの受け渡しらしい
  - あんまりわかっていない
  - ポーリングとかキューイング的なイメージだろうか

<https://doc.rust-jp.rs/book-ja/ch16-02-message-passing.html>

- ざっくり読む

### メモ

- んー光らせたが
  - チャンネルという概念と受信機、転送機の話っぽい
  - 合っているかも

> チャンネルは、あるスレッドから別のスレッドへデータを送信する手段である、普遍的なプログラミング概念です。

- あってそうだな
  - マイクロサービスのふわっとした概念と同じかもね
- チャンネルに転送受信機がある
  - どっちかがドロップしたら終了

```rust
use std::sync::mpsc;

fn main() {
    let (tx, rx) = mpsc::channel();
}
```

- チャンネルはこうやって作るらしい
  - なるほど、セットで生成するんだな
  - でもこれはコンパイルできない

> `let`文でパターンを使用することと分配については、第18章で議論しましょう。

- 前から出てきた気がするけどな

> 転送機には、送信したい値を取る`send`メソッドがあります。`send`メソッドは`Result<T, E>`型を返すので、 既に受信機がドロップされ、値を送信する場所がなければ、送信処理はエラーを返します。

- うおーここでも`Result`使うのか
  - rust書く時にめちゃくちゃ重要だな

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
    });

    let received = rx.recv().unwrap();
    //       "取得しました: {}"
    println!("Got: {}", received);
}
```

- はいはい、なるほど
  - さすがにこれは説明読まなくて分かるな
- `rx.recv`で返ってくんだな
  - んあ？これ、どの型が返ってくるか不明だから型推論しないとだめだな
  - この辺でトラブりそう

> メッセージを待つこと以外にメインスレッドがすべき作業はないので、 メインスレッドをブロックするのは適切です。

- ブロックするという概念ね

```rust
use std::sync::mpsc;
use std::thread;

fn main() {
    let (tx, rx) = mpsc::channel();

    thread::spawn(move || {
        let val = String::from("hi");
        tx.send(val).unwrap();
        //       "valは{}です"
        println!("val is {}", val);
    });

    let received = rx.recv().unwrap();
    println!("Got: {}", received);
}
```

```shell
$ cargo run
Compiling message-passing v0.1.0 (file:///projects/message-passing)
error[E0382]: borrow of moved value: `val`
(エラー: ムーブされた値の借用: `val`)
--> src/main.rs:10:31
|
8 | let val = String::from("hi");
| --- move occurs because `val` has type `String`, which does not implement the `Copy` trait
| (`val`は`Copy`トレイトを実装しない`String`型を持つので、ムーブが発生します)
9 | tx.send(val).unwrap();
| --- value moved here
| (値はここでムーブされます)
10 | println!("val is {}", val);
| ^^^ value borrowed here after move
| (ここでムーブ後に借用されます)
|
= note: this error originates in the macro `$crate::format_args_nl` which comes from the expansion of the macro `println` (in Nightly builds, run with -Z macro-backtrace for more info)
help: consider cloning the value if the performance cost is acceptable
(ヘルプ: パフォーマンスコストが許容できる場合は、クローンすることを検討してください)
|
9 | tx.send(val.clone()).unwrap();
| ++++++++

For more information about this error, try `rustc --explain E0382`.
error: could not compile `message-passing` (bin "message-passing") due to 1 previous error
```

- 内部の値は`send`したら`rcev`側に`move`するって話だな

## まとめ

- 認識ズレてないか怪しかったが思ったよりそのままだった
- マイクロサービスってこういう感じを想定しているんだな
- これで送れる値って`<T>`かな

<https://doc.rust-lang.org/stable/std/sync/mpsc/fn.channel.html>

```rust
pub fn channel<T>() -> (Sender<T>, Receiver<T>)
```

- さすがにそうだな
- 今回は自分の中途半端な知識が合っているかの認識合わせだった
- 次はこの辺から

<https://doc.rust-jp.rs/book-ja/ch16-02-message-passing.html#%E8%A4%87%E6%95%B0%E3%81%AE%E5%80%A4%E3%82%92%E9%80%81%E4%BF%A1%E3%81%97%E5%8F%97%E4%BF%A1%E5%81%B4%E3%81%8C%E5%BE%85%E6%A9%9F%E3%81%99%E3%82%8B%E3%81%AE%E3%82%92%E7%A2%BA%E3%81%8B%E3%82%81%E3%82%8B>
