## ☕ Java Fundamentals for Beginners

---

### 1. Hello World: Your First Java Program

Every Java program needs two key components:
- A **class** (a container for your code)
- A **main method** (the starting point that Java looks for)

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

This program simply displays "Hello, World!" on the screen.
- `public class HelloWorld` creates a container named "HelloWorld"
- `public static void main(String[] args)` is the special method Java looks for to start
- `System.out.println()` is like telling Java to display something on screen

---

### 2. Data Types and Variables

Variables are like labeled containers that store different types of information:

```java
// Declaring and initializing different types of variables
int age = 20;                 // Whole numbers only
double gpa = 16.69;           // Decimal numbers
char grade = 'A';             // Single character (use single quotes)
boolean isPassing = true;     // Only true or false
String name = "Cognis";       // Text (use double quotes)
```

---

### 3. Creating Methods (Reusable Code Blocks)

Methods are like mini-programs you can call whenever needed:

```java
public class Calculator {
    // This method takes two numbers and gives back their sum
    public static int add(int a, int b) {
        return a + b;
    }

    public static void main(String[] args) {
        int result = add(5, 3);     // We call the method here
        System.out.println("5 + 3 = " + result);
    }
}
```

Method breakdown:
- `public` - Anyone can use this method
- `static` - The method belongs to the class (not an object)
- `int` - The method will return an integer value
- `add` - The name we chose for our method
- `(int a, int b)` - The method parameters


---

### 4. Reading User Input

To read something from the user, we can use:

```java
import java.util.Scanner;  // Importing the Scanner tool

public class NameGreeter {
    public static void main(String[] args) {
        // Create a Scanner to read from keyboard
        Scanner scanner = new Scanner(System.in);
        
        // Ask user for information
        System.out.print("What is your name? ");
        
        // Wait for and store their answer
        String userName = scanner.next();
        
        // Use their answer
        System.out.println("Nice to meet you, " + userName + "!");
	}
}
```

---

### 5. String Methods (Working with Text)

Strings (text) have special methods to manipulate them:

```java
// COMPARING STRINGS
String password = "secret123";
String userInput = "Secret123";

// a. equals() - Is the content exactly the same? (case-sensitive)
boolean exactMatch = password.equals(userInput);  // false

// b. compareTo() - Which string comes first alphabetically?
int compareResult = "apple".compareTo("banana");  // negative number (apple comes first)

// c. == operator - DANGER! Tests if two variables point to the same object, not content
String str1 = new String("hello");
String str2 = new String("hello");
boolean sameObject = (str1 == str2);  // false (different objects, even though content matches)

// COMBINING STRINGS
String firstName = "Cognis";
String lastName = "Dev";

// Using + operator
String fullName1 = firstName + " " + lastName;  // "Cognis Dev"

// Using concat() method
String fullName2 = firstName.concat(" ").concat(lastName);  // "Cognis Dev"
```

Remember: Always use `equals()` to compare string content, never `==`.

---

### 6. Conditional Statements

```java
// IF-ELSE: For simple conditions
int age = 17;

if (age >= 18) {
    System.out.println("You can vote!");
} else {
    System.out.println("You cannot vote yet.");
    System.out.println("Wait " + (18 - age) + " more years.");
}

// SWITCH: For multiple specific values
int dayNumber = 3;
String dayName;

switch (dayNumber) {
    case 1:
        dayName = "Monday";
        break;  // Important! Stops fall-through
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    case 4: 
        dayName = "Thursday";
        break;
    case 5:
        dayName = "Friday";
        break;
    default:  // Like an "else" for all other cases
        dayName = "Weekend";
}

System.out.println("Day " + dayNumber + " is " + dayName);
```

---

### 7. Loops (Repeating Code)

Loops repeat code until a condition is met:

```java
// FOR LOOP: When you know exactly how many repetitions
System.out.println("Counting from 1 to 5:");
for (int i = 1; i <= 5; i++) {
    System.out.println("Count: " + i);
}

// WHILE LOOP: When you don't know how many repetitions
System.out.println("\nDoubling a number until it exceeds 100:");
int number = 2;
while (number <= 100) {
    System.out.println(number);
    number = number * 2;  // Double the number each time
}

// DO-WHILE LOOP: Always runs at least once
System.out.println("\nCountdown:");
int countdown = 3;
do {
    System.out.println(countdown + "...");
    countdown--;
} while (countdown > 0);
System.out.println("Go!");
```

- `for` loop: Best when you know the number of repetitions
- `while` loop: Best when repetitions depend on a condition
- `do-while` loop: Like `while`, but always runs at least once

---

### 8. Matrices (2D Arrays)

A matrix is like a table or grid of values:

```java
// Creating a 3x3 matrix (a grid with 3 rows and 3 columns)
int[][] matrix = {
    {1, 2, 3},    // Row 0
    {4, 5, 6},    // Row 1
    {7, 8, 9}     // Row 2
};

// Accessing elements: matrix[row][column]
System.out.println("Center element: " + matrix[1][1]);  // Gets 5

// Printing the entire matrix
System.out.println("The entire matrix:");
for (int row = 0; row < matrix.length; row++) {
    for (int col = 0; col < matrix[row].length; col++) {
        System.out.print(matrix[row][col] + "\t");  // \t adds a tab space
    }
    System.out.println();  // Move to next line after each row
}
```

Think of a matrix as a spreadsheet:
- First index [row] selects which row
- Second index [column] selects which column in that row
- Together [row][column] points to a specific cell