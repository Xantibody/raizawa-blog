---
title: Rustの勉強[並行性 その6]
createdAt: 2026-02-27T02:37
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

- 朝面倒なことがあったがメンタル関係なく勉強はしたい
  - ここの切り替えだいじにしたい

## お勉強

<https://doc.rust-jp.rs/book-ja/ch16-03-shared-state.html#%E8%A4%87%E6%95%B0%E3%81%AE%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E3%81%A7%E8%A4%87%E6%95%B0%E3%81%AE%E6%89%80%E6%9C%89%E6%A8%A9>
ここからやる

### メモ

- `Mutex`の所有権はスレッドごとに移動できないという話か

```rust
use std::rc::Rc;
use std::sync::Mutex;
use std::thread;

fn main() {
    let counter = Rc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Rc::clone(&counter);
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

- `Rc`で複数で参照できるように包む

> 再三、コンパイルし……別のエラーが出ました！コンパイラはいろんなことを教えてくれています。

```bash
$ cargo run
   Compiling shared-state v0.1.0 (file:///projects/shared-state)
error[E0277]: `Rc<Mutex<i32>>` cannot be sent between threads safely
(エラー: `Rc<Mutex<i32>>`はスレッド間で安全に送信できません)
  --> src/main.rs:11:36
   |
11 |         let handle = thread::spawn(move || {
   |                      ------------- ^------
   |                      |             |
   |  ____________________|_____________within this `{closure@src/main.rs:11:36: 11:43}`
   |                      |             (この`{[closure@src/main.rs:11:36: 11:43}`の中で)
   |                      |
   |                      required by a bound introduced by this call
   |                      (この呼び出しによって導入される境界によって必要とされます)
12 | |             let mut num = counter.lock().unwrap();
13 | |
14 | |             *num += 1;
15 | |         });
   | |_________^ `Rc<Mutex<i32>>` cannot be sent between threads safely
   |              (`Rc<Mutex<i32>>`はスレッド間で安全に送信できません)
   |
   = help: within `{closure@src/main.rs:11:36: 11:43}`, the trait `Send` is not implemented for `Rc<Mutex<i32>>`
   =(ヘルプ: `{closure@src/main.rs:11:36: 11:43}`の中で、トレイト`Send`は`Rc<Mutex<i32>>`に対して実装されていません
note: required because it's used within this closure
(注釈: このクロージャの中で使用されているので、要求されます)
  --> src/main.rs:11:36
   |
11 |         let handle = thread::spawn(move || {
   |                                    ^^^^^^^
note: required by a bound in `spawn`
(注釈: `spawn`の境界によって要求されます)
  --> /rustc/07dca489ac2d933c78d3c5158e3f43beefeb02ce/library/std/src/thread/mod.rs:678:1

For more information about this error, try `rustc --explain E0277`.
error: could not compile `shared-state` (bin "shared-state") due to 1 previous error
```

- マジか

> 残念ながら、`Rc<T>`はスレッド間で共有するには安全ではないのです。

- ふざけんな
  - そういえばシングルスレッド専用って書いてあったじゃんか

- `Arc`があるらしい
  - なるほど、これが説明したかったのか

> スレッド安全性が、本当に必要な時だけ支払いたいパフォーマンスの犠牲とともに得られるものだからです。

- まぁそうだよねー

## まとめ

- `Arc`があることを証明するために長々説明されただけだった

<https://doc.rust-jp.rs/book-ja/ch16-03-shared-state.html#arct%E3%81%A7%E5%8E%9F%E5%AD%90%E7%9A%84%E3%81%AA%E5%8F%82%E7%85%A7%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88>
次はここ
