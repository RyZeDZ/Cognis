## 🔹 **Introduction to PHP**

PHP (Hypertext Preprocessor) is a widely-used, open-source server-side scripting language designed for web development but also suitable for general-purpose programming. PHP is embedded within HTML and used to create dynamic web pages and interact with databases.

---

## 🔹 **Basic PHP Syntax**

* **PHP Tags**:

  * PHP code is written between the tags `<?php` and `?>`.
  * Example:

    ```php
    <?php
    // PHP code here
    ?>
    ```

* **Outputting to the Browser**:

  * The `echo` statement is used to output text or HTML to the browser.

    ```php
    echo "Hello, World!";
    ```

---

## 🔹 **PHP Variables and Data Types**

* **Declaring Variables**:

  * Variables in PHP are prefixed with `$`.
  * Example:

    ```php
    $name = "John";
    $age = 25;
    ```

* **Data Types**:

  * PHP supports multiple data types: `String`, `Integer`, `Float`, `Boolean`, `Array`, `Object`, and `NULL`.

---

## 🔹 **PHP Functions**

* **Defining Functions**:

  * PHP allows you to define functions for code reuse.
  * Example:

    ```php
    function greet($name) {
        echo "Hello, $name!";
    }
    greet("Alice");
    ```

---

## 🔹 **Conditional Statements**

* **If-Else Statements**:

  * Used to execute code based on a condition.
  * Example:

    ```php
    if ($age > 18) {
        echo "You are an adult.";
    } else {
        echo "You are a minor.";
    }
    ```

* **Switch Statement**:

  * Used to check multiple conditions.
  * Example:

    ```php
    switch ($day) {
        case "Monday":
            echo "Start of the week.";
            break;
        case "Friday":
            echo "End of the week.";
            break;
        default:
            echo "Midweek day.";
    }
    ```

---

## 🔹 **Loops**

* **For Loop**:

  * Used to repeat a block of code a certain number of times.
  * Example:

    ```php
    for ($i = 0; $i < 5; $i++) {
        echo $i;
    }
    ```

* **While Loop**:

  * Used when the number of iterations is not known beforehand.
  * Example:

    ```php
    while ($i < 5) {
        echo $i;
        $i++;
    }
    ```

---

## 🔹 **Handling Forms with PHP**

* **Form Handling**:

  * PHP can handle data sent via forms using the `$_GET` and `$_POST` superglobals.
  * Example (HTML form and PHP):

    ```html
    <form method="POST" action="process.php">
        <input type="text" name="username">
        <input type="submit" value="Submit">
    </form>
    ```

    ```php
    <?php
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        $username = $_POST["username"];
        echo "Hello, $username!";
    }
    ?>
    ```

---

## 🔹 **PHP Arrays**

* **Indexed Arrays**:

  * Arrays with numeric indices.
  * Example:

    ```php
    $fruits = ["Apple", "Banana", "Cherry"];
    echo $fruits[0]; // Apple
    ```

* **Associative Arrays**:

  * Arrays with key-value pairs.
  * Example:

    ```php
    $person = ["name" => "John", "age" => 30];
    echo $person["name"]; // John
    ```

* **Looping through Arrays**:

  * You can loop through arrays using `foreach`.
  * Example:

    ```php
    foreach ($fruits as $fruit) {
        echo $fruit;
    }
    ```

---

## 🔹 **PHP Superglobals**

* **`$_GET` and `$_POST`**:

  * Used to collect form data sent via GET and POST methods.

* **`$_SERVER`**:

  * Provides server information such as the request method, server name, etc.

* **`$_SESSION`**:

  * Used for storing session variables, which persist across page requests.

---

## 🔹 **Connecting to Databases**

* **MySQL Database Connection**:

  * Use PHP to connect to a MySQL database using `mysqli_connect()`.
  * Example:

    ```php
    $conn = mysqli_connect("localhost", "root", "", "database_name");
    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }
    ```