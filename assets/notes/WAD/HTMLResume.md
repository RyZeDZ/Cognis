
---
# 🌐 HTML

## 🔹 Introduction

HTML (HyperText Markup Language) is the standard language for creating web pages. It structures content using **tags** enclosed in angle brackets `< >`.

---

## 🔹 Headings

- HTML provides **six levels** of headings:
    
    ```html
    <h1> to <h6>
    ```
    
    - `<h1>` is the largest (main title).
        
    - `<h6>` is the smallest.
        

---

## 🔹 Paragraphs & Text Formatting
🔸 Some tags are **self-closing** (e.g. `<br>`, `<img>`), unlike others that need a closing tag (e.g. `<p>...</p>`).

- Paragraphs:
    
    ```html
    <p>This is a paragraph.</p>
    ```
    
- Line break:
    
    ```html
    <br>
    ```
    
- Horizontal line:
    
    ```html
    <hr>
    ```
    
- **Text styles**:
    
    ```html
    <b>Bold</b>
    <i>Italic</i>
    <u>Underline</u>
    <em>Emphasized</em>
    <strong>Strong importance</strong>
    <mark>Highlighted</mark>
    ```
    

---

## 🔹 Lists

- **Unordered List** (bullets):
    
    ```html
    <ul>
      <li>Item</li>
    </ul>
    ```
    
- **Ordered List** (numbers):
    
    ```html
    <ol>
      <li>Step</li>
    </ol>
    ```
    
- **Nested lists** are supported by placing `<ul>` or `<ol>` inside `<li>`.
    

---

## 🔹 Links

- Basic hyperlink:
    
    ```html
    <a href="https://example.com">Visit</a>
    ```
    
- Anchor within the same page:
    
    ```html
    <a href="#section2">Go down</a>
    <section id="section2">...</section>
    ```
    
- `target="_blank"` opens the link in a new tab.
    

---

## 🔹 Images

- Insert an image:
    
    ```html
    <img src="image.jpg" alt="Description" width="300" height="200">
    ```
    
- `alt` is essential for accessibility and SEO.
    

---

## 🔹 Tables

- Table structure:
    
    ```html
    <table>
      <tr>
        <th>Header</th>
        <th>...</th>
      </tr>
      <tr>
        <td>Data</td>
        <td>...</td>
      </tr>
	  <tr>
        <td>More data if you wish</td>
        <td>...</td>
      </tr>
    </table>
    ```
    
- Attributes (optional but common):

	- **`border`** – Sets the thickness of the table border (e.g., `border="1"` adds a visible border).
	- **`cellpadding`** – Adds space inside each cell between the content and the border.
	- **`cellspacing`** – Adds space between individual table cells.
	- **`width`** – Sets the table’s width (e.g., `80%` of the page or a fixed pixel value).
	- **`align`** – Aligns the table on the page (`left`, `center`, or `right`).

        
- Merge cells:
    
    ```html
    <td colspan="2">Merged columns</td>
    <td rowspan="2">Merged rows</td>
    ```
    

---

## 🔹 Sections & Layout

- Use `<section>` to organize content logically:
    
    ```html
    <section>
      <h2>Section Title</h2>
      <p>Content...</p>
    </section>
    ```
    
- You can combine it with anchors (`<a>`) for navigation.
    

---

## 🔹 Forms

- Basic structure:
    
    ```html
    <form>
      <label for="name">Name:</label>
      <input type="text" id="name" required><br>
    
      <input type="submit" value="Send">
    </form>
    ```
    
- Common `<input>` types:
    
    - `text`, `password`, `email`, `number`, `radio`, `checkbox`, `submit`
        
- Group options:
    
    ```html
    <select>
      <option>Choice 1</option>
      <option>Choice 2</option>
      <option>Choice 3</option>
    </select>
    ```
    
- Multiline input:
    
    ```html
    <textarea rows="4" cols="50"></textarea>
    ```
    
- All fields can be made **mandatory** with `required` (e.g. `<input type="text" required>`).
    

---

## 🔹 Frames

- Legacy layout using `<frame>` and `<frameset>` (not used in HTML5):
    
    ```html
    <frameset cols="50%,50%">
      <frame src="left.html">
      <frame src="right.html">
    </frameset>
    ```
