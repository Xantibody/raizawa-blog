---
title: Rustの勉強[パターンとマッチング その7]
createdAt: 2026-03-11T02:37
category: ぎじゅつ
tags:
  - Rust
---

## はじめに

<https://doc.rust-jp.rs/book-ja/>
を読んでいる

## お勉強

- やるか
- なんだか疲れている

<https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#%E5%8F%83%E7%85%A7%E3%82%92%E5%88%86%E9%85%8D%E3%81%99%E3%82%8B>

### メモ

- 多分参照の分配だな

```rust
let points = vec![
    Point { x: 0, y: 0 },
    Point { x: 1, y: 5 },
    Point { x: 10, y: -3 },
];

let sum_of_squares: i32 = points
.iter()
.map(|&Point { x, y }| x * x + y * y)
.sum();
```

- まぁなんとなく記述でわかるか
- `&Point { x, y }`
  - まぁここだよね

- 借用の渡し方しないと怒られる
- `move`するなってやつだな

```rust
let ((feet, inches), Point {x, y}) = ((3, 10), Point { x: 3, y: -10 });
```

- これできるのはいいけどクソコードやな

> `match`式の最後のアームとして役に立ちますが、 関数の引数も含めてあらゆるパターンで使えます。リスト18-17に示したようにですね。

> ファイル名: src/main.rs

```rust
fn foo(_: i32, y: i32) {
    // このコードは、y引数を使うだけです: {}
    println!("This code only uses the y parameter: {}", y);
}

fn main() {
    foo(3, 4);
}
```

> リスト18-17: 関数シグニチャで`_`を使用する

- なるほどなー

```rust
fn main() {
    let _x = 5;
    let y = 10;
}
```

- マジでダメそうな書き方

> `_`だけを使うのとアンダースコアで始まる名前を使うことには微妙な違いがあることに注意してください。 `_x`記法はそれでも、値を変数に束縛する一方で、`_`は全く束縛しません。

- ふーん

> 多くの部分がある値では、`..`記法を使用していくつかの部分だけを使用して残りを無視し、 無視する値それぞれにアンダースコアを列挙する必要性を回避できます。

- 便利そう

```rust
struct Point {
x: i32,
y: i32,
z: i32,
}

let origin = Point { x: 0, y: 0, z: 0 };

match origin {
Point { x, .. } => println!("x is {}", x),
}
```

- んーでも普通に関数としての引数に取り出した値を渡すか構造体に実装すればよくね

```rust
fn main() {
    let numbers = (2, 4, 8, 16, 32);

    match numbers {
        (.., second, ..) => {
            println!("Some numbers: {}", second)
        }
    }
}
```

- この書き方は適当だからだめって話しね
- `_`すればいい

## まとめ

- この章まだ続くな...

次ここ  
https://doc.rust-jp.rs/book-ja/ch18-03-pattern-syntax.html#ref%E3%81%A8ref-mut%E3%81%A7%E3%83%91%E3%82%BF%E3%83%BC%E3%83%B3%E3%81%AB%E5%8F%82%E7%85%A7%E3%82%92%E7%94%9F%E6%88%90%E3%81%99%E3%82%8B
