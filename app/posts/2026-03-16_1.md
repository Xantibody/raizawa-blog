---
title: Rustの勉強[unsafe その3]
createdAt: 2026-03-16T01:45
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>

を読んでいる

## お勉強

<https://doc.rust-jp.rs/book-ja/ch19-01-unsafe-rust.html#unsafe%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AB%E5%AE%89%E5%85%A8%E3%81%AA%E6%8A%BD%E8%B1%A1%E3%82%92%E8%A1%8C%E3%81%86>

- むちゃくちゃ体調がいい
  - 昨日何もせずにずっと寝ていた
- 15分縛りかつ準備も含めてるから圧縮するしかない

### メモ

- `unsafe`に対して安全という言葉を使っていることに違和感しかない

```rust
let mut v = vec![1, 2, 3, 4, 5, 6];

let r = &mut v[..];

let (a, b) = r.split_at_mut(3);

assert_eq!(a, &mut [1, 2, 3]);
assert_eq!(b, &mut [4, 5, 6]);
```

- こいつはsafe rustでは無理らしい

```bash
error[E0499]: cannot borrow `*slice` as mutable more than once at a time
(エラー: 一度に2回以上、`*slice`を可変で借用できません)
-->
|
6 | (&mut slice[..mid],
|      ----- first mutable borrow occurs here
7 |  &mut slice[mid..])
|       ^^^^^ second mutable borrow occurs here
8 | }
| - first borrow ends here
```

> Rustの借用チェッカーには、スライスの異なる部分を借用していることが理解できないのです; 同じスライスから2回借用していることだけ知っています。

- なるほどなー
- だけど普通に変数を切り出せばよくね
  - 無理らしい
  - どうやっても2回可変に参照してしまうっぽい
- `clone`すればよくねと思ったが、長さがあまりにも長すぎるとだめらしい
  - そしたらシステムだけで扱うのが正しいかすら怪しいが
  - csvで外出しするとかね

```rust
use std::slice;

fn split_at_mut(slice: &mut [i32], mid: usize) -> (&mut [i32], &mut [i32]) {
    let len = slice.len();
    let ptr = slice.as_mut_ptr();

    assert!(mid <= len);

    unsafe {
        (
            slice::from_raw_parts_mut(ptr, mid),
            slice::from_raw_parts_mut(ptr.offset(mid as isize), len - mid),
        )
    }
}
```

- まあこれは本来なら`Result`で返せばいい感じがな

## まとめ

- わからんところをgeminiをつかってサクッと理解できた
- だけどまだポインタ周りが雰囲気すぎるなー
- 明日は実際に書いたほうがいいかも

次はここ

<https://doc.rust-jp.rs/book-ja/ch19-01-unsafe-rust.html#unsafe%E3%82%B3%E3%83%BC%E3%83%89%E3%81%AB%E5%AE%89%E5%85%A8%E3%81%AA%E6%8A%BD%E8%B1%A1%E3%82%92%E8%A1%8C%E3%81%86>
