## ☕ Java: Classes, Constructors & Object Arrays

---

### 1. Creating a Class with Private Attributes

```java
// File: Student.java
public class Student {
    // Private attributes - can only be accessed within this class
    // This protects our data from unwanted external changes
    private String name;
    private int age;
    private double gpa;
    
    // Constructor - initializes object when created with "new"
    public Student(String studentName, int studentAge, double studentGpa) {
        this.name = studentName;
        this.age = studentAge;
        this.gpa = studentGpa;
    }
    
    
    public void displayInfo() {
        System.out.println("Student: " + name);
        System.out.println("Age: " + age);
        System.out.println("GPA: " + gpa);
    }
}
```
---
```java
// File: Main.java
public class Main {
    public static void main(String[] args) {
        // Create new Student objects using the constructor
        Student firstStudent = new Student("Mohamed", 20, 3.8);
        Student secondStudent = new Student("Amine", 19, 3.5);
        
        // Use methods to work with the objects
        firstStudent.displayInfo();
        System.out.println("----------");
        secondStudent.displayInfo();
    }
}
```

---

### 2. Working with Arrays of Objects

```java
// File: Main.java
public class Main {
    public static void main(String[] args) {
        // Create an array of Student objects
        Student[] classroom = new Student[3];
        
        // Fill the array with Student objects
        classroom[0] = new Student("Mohamed", 20, 3.8);
        classroom[1] = new Student("Amine", 19, 3.5);
        classroom[2] = new Student("Zakaria", 21, 3.9);
        
        // Display all students
        System.out.println("Class list:");
        for (int i = 0; i < classroom.length; i++) {
            System.out.println("Student #" + (i+1) + ":");
            classroom[i].displayInfo();
            System.out.println();
        }
        
        // Find the student in position 1
        System.out.println("Second student in the list:");
        classroom[1].displayInfo();
    }
}
```