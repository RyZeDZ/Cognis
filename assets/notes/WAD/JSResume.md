# 🧠 JavaScript

## 🔹 1. Variables

- `let` → for values that can change
    
- `const` → for values that don’t change
    
```js
let x = 5;
const y = 10;
```

---

## 🔹 2. Data Types

- `number` → `let age = 20;`
    
- `string` → `let name = "Ali";`
    
- `boolean` → `let isStudent = true;`
    
- `array` → `let list = [1, 2, 3];`
    
- `object` → `let person = { name: "Sara", age: 25 };`
    

---

## 🔹 3. Operators

- **Arithmetic**: `+`, `-`, `*`, `/`, `%`
    
- **Comparison**: `==`, `===`, `!=`, `<`, `>`, `<=`, `>=`
    
- **Logical**: `&&`, `||`, `!`
    

---

## 🔹 4. Arrays

- Access: `list[0]`
    
- Add: `list.push(value)`
    
- Remove: `list.pop()`
    
- Length: `list.length`
    

---

## 🔹 5. Objects

- Access: `person.name`
    
- Change: `person.age = 30`
    

---

## 🔹 6. Conditionals

```js
if (x > 10) {
  // code
} else {
  // code
}
```

---

## 🔹 7. Loops

```js
for (let i = 0; i < 5; i++) {
  // code
}
```

```js
while (x < 5) {
  // code
  x++;
}
```

---

## 🔹 8. Functions

```js
function greet(name) {
  console.log("Hello " + name);
}
```

---

# 🌐 DOM 

## 🔹 1. What is the DOM?

- The **Document Object Model** is a tree-like structure that represents an HTML page.
    
- JavaScript uses it to **access and change** content, structure, and style dynamically.
    

---

## 🔹 2. Accessing Elements

```html
<div id="hello">Original</div>

<script>
  let element = document.getElementById("hello");
</script>
```

- `getElementById()` – Get a single element by ID.
    
- `getElementsByClassName()` – Get all elements with a class.
    
- `getElementsByTagName()` – Get all elements of a tag type.
---

## 🔹 3. Changing Content

```html
<div id="hello"></div>

<script>
  let element = document.getElementById("hello");
  element.textContent = "Hi there";     // Plain text
  element.innerHTML = "<b>Hi</b>";      // Interprets HTML
</script>
```

---

## 🔹 4. Input Values

```html
<input id="myInput" />

<script>
  let input = document.getElementById("myInput");
  input.value = "Default text";
</script>
```

---

## 🔹 5. Changing Styles

```html
<p id="text"></p>

<script>
  let element = document.getElementById("text");
  element.style.color = "red";
  element.style.backgroundColor = "yellow";
</script>
```

---

## 🔹 6. Class Operations

```html
<p id="box" class="hidden"></p>

<script>
  let element = document.getElementById("box");
  element.classList.add("visible");
  element.classList.remove("hidden");
  element.classList.toggle("highlight");
</script>
```

---

## 🔹 7. Creating and Removing Elements

```html
<div id="container"></div>

<script>
  let container = document.getElementById("container");
  let newElement = document.createElement("p");
  newElement.textContent = "Hello";
  container.appendChild(newElement);       // Add element
  container.removeChild(newElement);       // Remove element
</script>
```

---

## 🔹 8. Events

```html
<button id="btn">Click me</button>

<script>
  let button = document.getElementById("btn");
  button.addEventListener("click", function() {
    alert("Button clicked!");
  });
</script>
```

---

## 🔹 9. `document.write()`

```html
<script>
  document.write("<h1>Hello World</h1>");
</script>
```

- Writes content **directly to the page** while it’s loading.
    
- Overwrites the whole document if used after the page has loaded.

---

## 🔹 10. `eval()` Function

```html
<div id="display">3+4</div>

<script>
  let display = document.getElementById("display");
  let result = eval(display.textContent);   // result = 7
  display.textContent = result;
</script>
```

- `eval()` runs a string as **JavaScript code**.
    
- Useful for calculators or expression evaluation.