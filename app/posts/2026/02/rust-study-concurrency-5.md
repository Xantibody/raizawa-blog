---
title: Rustの勉強[並行性 その5]
createdAt: 2026-02-26T05:18
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

- 眠い
  - 朝の弱さな眠さ
  - 逆に朝弱いほうが自分にとっては正常な気がするのでいいのか
  - そしてなんかブログ落ちている

## お勉強

<https://doc.rust-jp.rs/book-ja/ch16-03-shared-state.html#mutext%E3%81%AEapi>

- ここからやる

### メモ

- `Mutex`の実用例だな

```rust
use std::sync::Mutex;

fn main() {
    let m = Mutex::new(5);

    {
        let mut num = m.lock().unwrap();
        *num = 6;
    }

    println!("m = {:?}", m);
}
```

- ん？これロック解除してなくない？
- あと参照渡しで代入するのかな

<https://doc.rust-lang.org/std/sync/type.LockResult.html>

- `LockResult`とかいう新たな型が返ってくるんだな

> ロックを獲得した後、今回の場合、`num`と名付けられていますが、戻り値を中に入っているデータへの可変参照として扱うことができます。

- はぇー

> 型システムにより、`m`の値を使用する前にロックを獲得していることが確認されます。`m`の型は`Mutex<i32>`であって`i32`ではないので、 `i32`を使用できるようにするには、`lock`を呼び出さなければならないのです。

- それはそうだよね
  - 包まれている

> ロックを保持している他のスレッドがパニックする

- いっている意味がわからなかったが、ほかのスレッドだから平行で動いてるときの話か

> お察しかもしれませんが、`Mutex<T>`はスマートポインタです。

- 全然察してなかった

> 自動的にロックを解除する`Drop`実装もしていて、これが内部スコープの終わりで発生します。

- おおーここて疑問が晴れた

> 次のリスト16-13の例はコンパイルエラーになりますが

- マジかよ

```rust
use std::sync::Mutex;
use std::thread;

fn main() {
    let counter = Mutex::new(0);
    let mut handles = vec![];

    for _ in 0..10 {
        let handle = thread::spawn(move || {
            let mut num = counter.lock().unwrap();

            *num += 1;
        });
        handles.push(handle);
    }

    for handle in handles {
        handle.join().unwrap();
    }

    println!("Result: {}", *counter.lock().unwrap());
}
```

```bash
$ cargo run
   Compiling shared-state v0.1.0 (file:///projects/shared-state)
error[E0382]: borrow of moved value: `counter`
(エラー: ムーブされた値の借用: `counter`)
  --> src/main.rs:21:29
   |
5  |     let counter = Mutex::new(0);
   |         ------- move occurs because `counter` has type `Mutex<i32>`, which does not implement the `Copy` trait
   |                (`counter`は`Copy`トレイトを実装しない`Mutex<i32>`型を持つので、ムーブが発生します)
...
9  |         let handle = thread::spawn(move || {
   |                                    ------- value moved into closure here, in previous iteration of loop
   |                                           (値は、ループの前回の反復時に、ここでクロージャ内にムーブされます)
...
21 |     println!("Result: {}", *counter.lock().unwrap());
   |                             ^^^^^^^ value borrowed here after move
   |                                    (値はここでムーブ後に借用されています)

For more information about this error, try `rustc --explain E0382`.
error: could not compile `shared-state` (bin "shared-state") due to 1 previous error
```

- 正解求めないでせっかくだから考えるか
- `counter`がどっかで`move`してるっぽいな
  - あーそもそもこれ`Mutex`を`move`しなきゃいけないんじゃない？
- 半分しかあってなかった
  - そもそも`move`はされてるけどループのなかで複数回`move`はできないっぽい
  - そりゃそうだろ

## まとめ

- 想像通りの使い方だったので実装が大変そうという感想
- スマートポインタに実装されている`drop`で`lock`を解除するのは目からウロコだった

次はここ
<https://doc.rust-jp.rs/book-ja/ch16-03-shared-state.html#%E8%A4%87%E6%95%B0%E3%81%AE%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%81%A7%E8%A4%87%E6%95%B0%E3%81%AE%E6%89%80%E6%9C%89%E6%A8%A9>
