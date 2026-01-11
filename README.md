# Writing Practice Web App

![logo](quill100.png)

A lightweight, browser‑based web application to improve writing skills through **listening and typing practice**.

The app speaks short phrases aloud, displays letter placeholders, and provides instant visual and audio feedback as the user types. It is designed to be **fully static**, making it ideal for **GitHub Pages hosting**.

### Hotkeys in the Edit Box
- **F1** — Show hint
- **F2** — Repeat the pharase
- **Enter** — Move to the next phrase once the current phrase is completed successfully



https://lds133.github.io/writing-practice/

## Features

- Text‑to‑Speech playback of phrases
- Real‑time typing validation (case‑insensitive)
- Sound effects for correct / incorrect input
- Letter placeholders with visual feedback
- Hint button (reveals next missing letter)
- Repeat phrase button
- Previous / Next phrase navigation
- Phrase progress indicator
- Dataset tags displayed in UI
- Multiple datasets with pagination (10 per page)
- Works entirely in the browser (no backend)



## `manifest.json`

The manifest file lives in the **project root** and lists available dataset filenames.

### Example
```json
{
  "title": "Select Practice Set",
  "notes": "Some notes",  
  "datasets": [
    "test1.json",
    "test2.json"
  ]
}
```

### Notes
- Filenames are assumed to be located in the `/data` folder
- Order in the array defines display order


## Dataset JSON Format (`data/*.json`)

Each dataset defines a **practice set** and its phrases.

### Example
```json
{
  "title": "Test",
  "language": "en-US",
  "notes": "Test set",
  "tags": ["tag1", "tag2"],
  "data": [
    { "text": "practice makes writing better",
	  "notes": "Some notes" },
    { "text": "more practice better result" }
  ]
}
```

### Fields

| Field | Type | Description |
|------|------|-------------|
| `title` | string | Dataset title shown in UI |
| `language` | string | SpeechSynthesis language code (e.g. `en-US`) |
| `notes` | string | Short description shown on index & practice pages |
| `tags` | array | List of tags used for categorization |
| `data` | array | List of phrase objects |
| `data[].text` | string | Phrase to be spoken and typed (≤ 10 words recommended) |
| `data[].notes` | string | Optinal. Additional information to show |

### Notes
- Keep phrases short and clear
- Punctuation ignored
- Spaces are handled automatically


## Sound Effects

Sound files are optional but recommended.

| File | Trigger |
|----|----|
| `type_ok.wav` | Correct letter typed |
| `type_error.wav` | Incorrect letter |
| `type_spc.wav` | Space typed |
| `type_bs.wav` | Backspace |
| `type_success.wav` | Whole phrase completed correctly |

All sounds should be **short WAV files** for best responsiveness.



## convert.html – Text to Dataset Converter

The project includes a utility page convert.html that helps you quickly create dataset JSON files from plain text.

https://lds133.github.io/writing-practice/convert.html

### Purpose

- Convert raw text into a valid practice dataset
- Speed up creation of new data/*.json files
- Ensure correct JSON structure for the app

### How it works

The page is split into two panels:
Left panel: input text area (type or paste text)
Right panel: generated JSON output (read-only)
Text is split into sentences using a dot (.) as the delimiter
Each sentence becomes one phrase entry in the dataset.


---


## Debug

Run python based local server for debugging

```
python3 -m http.server 8000 --bind 0.0.0.0
```


A Python server that saves statistics to the tmp/data.csv file.
```
python3 runserver.py
```



http://192.168.30.13:8000/

Reload scripts in browser "Ctrl + Shift + R"

