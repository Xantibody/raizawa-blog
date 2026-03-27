---
title: Rustの勉強[並行性 その7]
createdAt: 2026-02-28T01:07
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

- `Arc`やった
- アークって呼んだほうがかっこよさそう
- 昨日のgoの勉強会で話してて思ったがRustは型で包んで表現することが多いなと思った

### メモ

> なぜ全ての基本型がアトミックでなく、標準ライブラリの型も標準で`Arc<T>`を使って実装されていないのか疑問に思う可能性があります。 その理由は、スレッド安全性が、本当に必要な時だけ支払いたいパフォーマンスの犠牲とともに得られるものだからです。

- ま、そうっすよねー

```rust
use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter = Arc::clone(&counter);
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

- 実装のトレイトが一緒で`use`を変えるだけとかそんな感じであろう
- Rustの気持ちになってきたな

> 単純な数値演算を行おうとしているなら、`Mutex<T>`型よりも単純な、 標準ライブラリの`std::sync::atomic`モジュールによって提供される型があることに注意してください。

- 別の型があるのだけ分かった

<https://doc.rust-jp.rs/book-ja/ch16-04-extensible-concurrency-sync-and-send.html>

- すげーいっぱいあるじゃん

> 面白いことに、Rust言語には、寡少な並行性機能があります。

- 全部これでいいじゃん
  - まぁパフォーマンスがとか言われんだろな

> でここまでに語った並行性機能のほとんどは、 標準ライブラリの一部であり、言語ではありません。

- 言語ではない？
  - 言語に実装されてるわけではないという話か

- んーなるほど
- 根本何をやっているかの話か
- 標準ライブラリなだけで別に`tokio`みたいなcrateと扱いは変わらず、言語レベルで実装されている物の話をしてるな
- `Send`と`Sync`があるらしい

## まとめ

- `Arc`で安全に並行処理できるよね
- でも遅くなるよというパフォーマンスの問題
- なんか当たり前って感じだった

つぎはここ
<https://doc.rust-jp.rs/book-ja/ch16-04-extensible-concurrency-sync-and-send.html#sync%E3%81%A8send%E3%83%88%E3%83%AC%E3%82%A4%E3%83%88%E3%81%A7%E6%8B%A1%E5%BC%B5%E5%8F%AF%E8%83%BD%E3%81%AA%E4%B8%A6%E8%A1%8C%E6%80%A7>
