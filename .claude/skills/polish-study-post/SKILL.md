---
name: polish-study-post
description: Format and create Rust study blog posts from raw memo text. Use this skill when the user pastes raw study notes, asks to format a study post, mentions "勉強" post formatting, or wants to create a new blog post from their study memo. Also triggers when the user provides a file path to an existing study post that needs polishing.
---

# Polish Study Post

Transform raw study memos into well-structured blog posts, or polish existing study posts.

## Absolute Rule: Never Modify Original Text

The original text must NEVER be changed, reworded, or rephrased. Only markdown formatting may be added around the original text. Markdown syntax (`` ` ``, `>`, `-`, `#`, etc.) may be **added**, but the words themselves must remain exactly as the author wrote them.

## Workflow

### Mode A: Raw memo → New post (primary)

The user pastes raw study notes directly in the conversation or provides a raw text file.

1. Read the raw memo text
2. Ask the user for the post title (e.g., "Rustの勉強[unsafe その1]") — suggest one based on the content
3. Apply formatting rules to the memo content
4. Show the formatted content to the user for review
5. After approval, create the post file using the CLI:
   ```bash
   bun run new-post -- rust "<title>"
   ```
   This creates `app/posts/YYYY-MM-DD_N.md` with correct frontmatter (title, createdAt, category, tags) automatically. The template name corresponds to a file in `scripts/templates/` (e.g., `rust`, `gijutsu`, `shumi`, `sonota`).
6. Replace the body of the created file (everything after the frontmatter `---`) with the formatted content

### Mode B: Polish existing file

The user provides a path to an existing post file.

1. Read the file
2. Apply formatting rules
3. Show the diff for review
4. After approval, write back

## Section Structure

Place content into these fixed sections based on the content flow:

```markdown
## はじめに

<!-- Study reference link + "を読んでいる" -->

## お勉強

<!-- Today's study URL, session comments (mood, time, what to study today) -->

### メモ

<!-- Main body: notes, code, quotes, reactions -->

## まとめ

<!-- Key takeaways, reflections, next study URL -->
```

Rules:

- If the author wrote "まとめ" as plain text, convert it to `## まとめ`
- `####` subsections under `### メモ` are author-driven; do not create them
- The first URL in the memo (the overall study reference like `doc.rust-jp.rs/book-ja/`) goes in `## はじめに`
- A more specific URL (with anchors/subsections) that appears before the main notes goes in `## お勉強`
- A URL at the end (after "まとめ" / "次ここ" / "つぎここ") goes in `## まとめ`

## Content Classification

The raw memo is a stream of text mixing the author's thoughts with material from the study source. The core challenge is distinguishing between them. Use these heuristics:

### Author comments → `-` list items

The author's own thoughts, reactions, observations. Characteristics:

- Casual, first-person tone ("なるほど", "うげ", "ほんとそれ", "理解", "ここ大事そう")
- Short reactions or opinions
- Questions or doubts ("〜って出てきたんだっけ", "記憶ねぇ")
- Judgments about the material ("便利そう", "やらないほうがよさそう", "クソコードやな")
- Comments about their own state ("体しんどいなー", "ヤバい全然頭が働かない")

```markdown
- なるほどな、`&`でいい
- 先回りされてる
```

### Follow-up thoughts → `  -` nested list items (2-space indent)

When a comment elaborates on or directly follows up the previous comment:

```markdown
- ここから
  - あー複数の所有権をもてそうって話
  - 真相は謎
```

Pattern: if the raw text has a short comment followed immediately by related sub-thoughts (often with indentation or on the next line), nest them.

### Study material quotes → `>` block quotes

Text from the book, documentation, or reference material. Characteristics:

- Formal, explanatory tone — reads like documentation or textbook prose
- Long sentences with technical explanations
- Often contains phrases like "〜ことです", "〜ください", "〜でしょう", "〜ません"
- Descriptions of how something works, rather than reactions to it
- Lists of concepts from the source (e.g., enumerated capabilities of a feature)

```markdown
> `unsafe`は、借用チェッカーや他のRustの安全性チェックを無効にしないことを理解するのは重要なことです
```

Indented lists from the source material (like feature enumerations) also become block quotes:

```markdown
> 生ポインタを参照外しすること
> `unsafe`な関数やメソッドを呼ぶこと
> 可変で静的な変数にアクセスしたり変更すること
> `unsafe`なトレイトを実装すること
```

### When uncertain

If a line could be either, look at the surrounding context:

- Does it follow a block quote and react to it? → author comment
- Does it explain a concept in textbook-like language? → block quote
- Still ambiguous? → leave as-is and ask the user about the specific lines

## Code Formatting

### Code blocks

Raw memos contain Rust code without fences. Detect code by looking for:

- `let`, `fn`, `match`, `struct`, `enum`, `impl`, `use`, `mod`, `pub`, `trait`
- Rust syntax patterns: `=>`, `::`, `println!`, `vec![]`, type annotations
- Multiple consecutive lines that form a coherent code block

Wrap in fenced code blocks:

````markdown
```rust
let robot_name = Some(String::from("Bors"));
```
````

- Terminal/error output uses ```bash` language identifier
- Preserve code indentation as-is
- Fix markdown escapes inside code fences (e.g., `\*` → `*`)

### Inline code

Wrap technical terms in backticks: Rust keywords, types, macros, functions, operators.
Examples: `Rc<T>`, `RefCell<T>`, `mut`, `panic!`, `move`, `unsafe`, `Box<T>`, `ref`, `ref mut`, `Some`, `None`, `&`

Apply inline code in both author comments and block quotes.

## General Formatting

### URLs

- Bare URLs → wrap in angle brackets: `<https://example.com>`
- Fix broken link syntax

### Block quotes

- Space after `>`: `> text`
- Multi-line quotes: `>` on each line including blank lines

### Lists

- Use `-` with single space: `- item`
- Nested: 2-space indent per level
- Blank lines before and after list blocks

### Headings

- Space after `#`
- Blank line before and after headings

### Cleanup

- Remove trailing whitespace
- File ends with single newline
- Normalize multiple blank lines to one
- Preserve frontmatter as-is
