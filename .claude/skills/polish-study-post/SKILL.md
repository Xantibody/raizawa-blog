---
name: polish-study-post
description: Format study blog posts with section hierarchy, author comments, and quotes.
---

# Polish Study Post

Format study blog posts into clean, well-structured markdown following the established patterns of this blog.

## Absolute Rule: Never Modify Original Text

**The original text must NEVER be changed, reworded, or rephrased. Only markdown formatting may be added around the original text.**

Markdown syntax (`` ` ``, `>`, `-`, `#`, etc.) may be **added** to the text, but the words themselves must remain exactly as the author wrote them.

## Workflow

1. **Identify the file**: If the user provides a file path as an argument, use that. Otherwise, ask which file to process.

2. **Read the file**: Read the specified file to understand its content.

3. **Apply formatting rules**: Apply all formatting rules below (both generic markdown and study-post-specific).

4. **Show the diff**: Present the changes to the user for review before writing.

5. **Write the result**: After user approval, write the formatted content back to the file.

## Section Structure

Study posts follow this fixed section hierarchy. The author may write content as a stream without proper section placement. Place the section headers at appropriate positions based on the content flow.

```markdown
## はじめに

<!-- Intro: what the author is studying, context, general thoughts -->
<!-- Contains: study link, "を読んでいる", and general comments like "光らせる" thoughts -->

## お勉強

<!-- Study URL for the day and opening thoughts about the session -->
<!-- Contains: today's study URL, "今日はここ", review of previous session -->

### メモ

<!-- Study notes: observations, code examples, quotes from study material -->
<!-- This is the main body of the post -->
<!-- Optional #### subsections for distinct topics within notes -->

## まとめ

<!-- Summary: key takeaways, reflections -->
<!-- End with: next study URL, optional quiz/問題 -->
```

- Do not add, remove, or reorder these sections.
- `####` subsections under `### メモ` are optional and author-driven; do not create them.
- If the author wrote "まとめ" as plain text (not a header), convert it to `## まとめ`.

## Formatting Rules

### Author Comments → `-` List Items

Lines where the author writes their own thoughts, reactions, or observations should be formatted as unordered list items using `-`.

```markdown
- なるほど、何がなるほどかはなぞだが
- ここ大事そうか
```

### Related Sub-thoughts → `  -` Nested List Items

When an author comment is a follow-up or elaboration of the previous comment, indent it as a nested list item (2-space indent).

```markdown
- ここから
  - あー複数の所有権をもてそうって話
  - 真相は謎
```

### Reference/Book Quotes → `>` Block Quotes

Text quoted from the study material (book, documentation, articles) should be formatted as block quotes using `>`.

```markdown
> 値と`List`を指す`Rc<T>`を保持するようになりました
```

### Distinguishing Comments from Quotes

- If the line is the author's own words → `-` list item
- If the line is copied/referenced from the study material → `>` block quote
- When uncertain, leave the line as-is and ask the user

### Code

- Inline code for technical terms: wrap Rust keywords, types, macros, etc. in backticks (e.g., `Rc<T>`, `RefCell<T>`, `mut`, `panic!`, `move`, `unsafe`, `Box<T>`)
- Apply inline code in both author comments and book quotes
- Code blocks should use triple backticks with `rust` language identifier
- Terminal/error output should use triple backticks with `bash` language identifier
- Fix markdown escapes inside code fences (e.g., `\*` → `*`)
- Preserve code indentation as-is; do not fix inconsistent indentation

### Block Quotes

- Ensure `>` block quotes have proper spacing: `> text` (space after `>`)
- Multi-line block quotes should have `>` on each line, including blank lines (`>`)

### Lists

- Unordered lists should use `-` with a single space: `- item`
- Nested lists should be indented with 2 spaces per level
- Ensure blank lines before and after list blocks for proper rendering

### Headings

- Ensure space after `#`: `# Heading` not `#Heading`
- Ensure blank line before and after headings
- Do not change the heading hierarchy chosen by the author

### Links

- Bare URLs should be wrapped in angle brackets: `<https://example.com>`
- Fix broken markdown link syntax: `[text](url)`

### General Cleanup

- Remove trailing whitespace
- Ensure file ends with a single newline
- Normalize multiple consecutive blank lines to a single blank line
- Preserve frontmatter (YAML between `---` fences) as-is, but ensure `---` is on its own line
