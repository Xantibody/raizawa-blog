package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
)

type Entry struct {
	OldPath   string `json:"old_path"`
	Title     string `json:"title"`
	CreatedAt string `json:"created_at"`
	NewSlug   string `json:"new_slug"`
}

var frontmatterRe = regexp.MustCompile(`(?m)^---\s*\n([\s\S]*?)\n---`)
var titleRe = regexp.MustCompile(`(?m)^title:\s*(.+)$`)
var createdAtRe = regexp.MustCompile(`(?m)^createdAt:\s*(.+)$`)

func readFrontmatter(path string) (title, createdAt string, err error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return "", "", err
	}
	content := string(data)
	fm := frontmatterRe.FindStringSubmatch(content)
	if len(fm) < 2 {
		return "", "", fmt.Errorf("no frontmatter found in %s", path)
	}
	block := fm[1]
	if m := titleRe.FindStringSubmatch(block); len(m) >= 2 {
		title = strings.TrimSpace(m[1])
	}
	if m := createdAtRe.FindStringSubmatch(block); len(m) >= 2 {
		createdAt = strings.TrimSpace(m[1])
	}
	return title, createdAt, nil
}

func generateMapping(postsDir string) ([]Entry, error) {
	files, err := os.ReadDir(postsDir)
	if err != nil {
		return nil, err
	}
	var entries []Entry
	for _, f := range files {
		if f.IsDir() || !strings.HasSuffix(f.Name(), ".md") {
			continue
		}
		title, createdAt, err := readFrontmatter(filepath.Join(postsDir, f.Name()))
		if err != nil {
			return nil, fmt.Errorf("reading %s: %w", f.Name(), err)
		}
		entries = append(entries, Entry{
			OldPath:   f.Name(),
			Title:     title,
			CreatedAt: createdAt,
			NewSlug:   "",
		})
	}
	return entries, nil
}

func executeMapping(postsDir, mappingFile string) error {
	data, err := os.ReadFile(mappingFile)
	if err != nil {
		return err
	}
	var entries []Entry
	if err := json.Unmarshal(data, &entries); err != nil {
		return err
	}

	for _, e := range entries {
		if e.NewSlug == "" {
			return fmt.Errorf("empty new_slug for %s", e.OldPath)
		}
		// Extract year/month from createdAt (e.g. "2026-03-24T02:05")
		parts := strings.Split(e.CreatedAt, "-")
		if len(parts) < 3 {
			return fmt.Errorf("invalid createdAt format for %s: %s", e.OldPath, e.CreatedAt)
		}
		year := parts[0]
		month := parts[1]

		newDir := filepath.Join(postsDir, year, month)
		if err := os.MkdirAll(newDir, 0o755); err != nil {
			return fmt.Errorf("creating directory %s: %w", newDir, err)
		}

		oldPath := filepath.Join(postsDir, e.OldPath)
		newPath := filepath.Join(newDir, e.NewSlug+".md")

		cmd := exec.Command("git", "mv", oldPath, newPath)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr
		if err := cmd.Run(); err != nil {
			return fmt.Errorf("git mv %s -> %s: %w", oldPath, newPath, err)
		}
		fmt.Printf("Moved: %s -> %s/%s/%s.md\n", e.OldPath, year, month, e.NewSlug)
	}
	return nil
}

func main() {
	execute := flag.Bool("execute", false, "Execute migration using mapping.json")
	flag.Parse()

	postsDir := filepath.Join("app", "posts")

	if *execute {
		mappingFile := filepath.Join("scripts", "migrate-posts", "mapping.json")
		if err := executeMapping(postsDir, mappingFile); err != nil {
			fmt.Fprintf(os.Stderr, "Error: %v\n", err)
			os.Exit(1)
		}
		fmt.Println("Migration complete!")
		return
	}

	entries, err := generateMapping(postsDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	data, err := json.MarshalIndent(entries, "", "  ")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}

	outputPath := filepath.Join("scripts", "migrate-posts", "mapping.json")
	if err := os.WriteFile(outputPath, data, 0o644); err != nil {
		fmt.Fprintf(os.Stderr, "Error: %v\n", err)
		os.Exit(1)
	}
	fmt.Printf("Mapping written to %s (%d entries)\n", outputPath, len(entries))
}
