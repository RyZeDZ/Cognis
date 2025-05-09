# 🎨 CSS

## 🔹 Introduction

CSS (Cascading Style Sheets) is used to style the presentation of HTML elements. It allows for precise control over the appearance, layout, and design of a web page.

---

## 🔹 Selectors

- **Class Selector (`.`)** – Selects elements with a specific class attribute:
    
    ```html
    <div class="box"></div>
    ```
    
    ```css
    .box {
      background-color: yellow;
    }
    ```
    
- **ID Selector (`#`)** – Selects an element with a specific ID (unique per page):
    
    ```html
    <div id="header"></div>
    ```
    
    ```css
    #header {
      font-size: 24px;
    }
    ```
    
- **Universal Selector (`*`)** – Selects all elements:
    
    ```css
    * {
      margin: 0;
      padding: 0;
    }
    ```
    

---

## 🔹 Text & Background Styles

- **Text Color**:
    
    ```css
    p {
      color: red;
    }
    ```
    
- **Background Color**:
    
    ```css
    body {
      background-color: lightblue;
    }
    ```
    
- **Font Family**:
    
    ```css
    h1 {
      font-family: 'Arial', sans-serif;
    }
    ```
    

---

## 🔹 Box Model

- **Padding**: Space inside the element (between content and border).
    
    ```css
    .box {
      padding: 10px;
    }
    ```
    
- **Margin**: Space outside the element (between element and its neighbors).
    
    ```css
    .box {
      margin: 20px;
    }
    ```
    
- **Border**:
    
    ```css
    .box {
      border: 2px solid black;
    }
    ```
    

---

## 🔹 Layout Techniques

### ➤ **Flexbox** – One-dimensional layout system (row or column).

- **Flex Container**:
    
    ```css
    .container {
      display: flex;
      justify-content: space-between; /* Aligns items horizontally */
      align-items: center; /* Aligns items vertically */
    }
    ```
    
- **Flex Items**:
    
    ```css
    .item {
      flex: 1; /* Each item takes equal space */
    }
    ```
    
- **Align Items (Horizontal & Vertical)**:
    
    ```css
    .container {
      display: flex;
      justify-content: center; /* Horizontal centering */
      align-items: center; /* Vertical centering */
    }
    ```
    

---

## 🔹 **CSS Grid** – Two-dimensional layout system (rows & columns).

### ➤ Basic Grid Setup

```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3 equal columns */
  grid-template-rows: auto auto;     /* 2 rows, height adjusts automatically */
  gap: 10px;
}
```

### ➤ Example Layout

```html
<div class="container">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
```

- `repeat(3, 1fr)`: shorthand for `1fr 1fr 1fr`
    
- `1fr`: means “1 part of available space” (fractional unit)
    

---

### ➤ Controlling Item Span

- Make an item **span multiple columns**:
    
    ```css
    .item {
      grid-column: span 2;
    }
    ```
    
- Or place it exactly:
    
    ```css
    .item {
      grid-column: 1 / 3; /* starts at column 1, ends before column 3 */
    }
    ```
    

---

## 🔹 Box Display Properties

### ➤ **Block** (default for elements like `<div>`, `<h1>`, etc.)

- Takes up full width, starts on a new line:
    
    ```css
    div {
      display: block;
    }
    ```
    

### ➤ **Inline** (default for elements like `<span>`, `<a>`)

- Only takes up as much width as its content:
    
    ```css
    span {
      display: inline;
    }
    ```
    

### ➤ **Inline-Block**

- Behaves like inline, but allows setting width/height:
    
    ```css
    .button {
      display: inline-block;
      width: 100px;
      height: 40px;
    }
    ```
    

---

## 🔹 Summary

- **Flexbox**: Ideal for one-dimensional layouts (horizontal/vertical alignment).
    
- **Grid**: Best for complex two-dimensional layouts (rows and columns).
    
- **Selectors**: Use `.` for classes, `#` for IDs to style elements.
    
- Use **`display`** properties like `block`, `inline`, and `inline-block` to control element flow.
    