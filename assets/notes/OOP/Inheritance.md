## ☕ Java Inheritance

### What is Inheritance?

Inheritance allows a class to acquire (inherit) the properties and behaviors of another class.

In Java, inheritance creates a parent-child relationship between classes:
- The **superclass** (parent class) provides common attributes and methods
- The **subclass** (child class) inherits these elements and can add specialized ones

### Creating a Subclass: The `extends` Keyword

To create a subclass in Java, we use the `extends` keyword:

```java
// Superclass (parent)
public class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    // Getters and setters
    public String getName() { return name; }
    public int getAge() { return age; }
    
    public void setName(String name) { this.name = name; }
    public void setAge(int age) { this.age = age; }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name + " and I'm " + age + " years old.");
    }
}

// Subclass (child) - inherits from Person
public class Student extends Person {
    private String studentId;
    
    public Student(String name, int age, String studentId) {
        super(name, age);  // Call to parent constructor
        this.studentId = studentId;
    }
    
    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }
    
    public void study() {
        System.out.println(getName() + " is studying.");
    }
}
```

### Using the `super` Keyword

The `super` keyword refers to the superclass (parent) and serves two key purposes:

1. **Calling the superclass constructor**: 
   ```java
   super(name, age);  // Must be the first line in the subclass constructor
   ```

2. **Accessing superclass methods and attributes**:
   ```java
   super.introduce();  // Calls the introduce() method from the Person class
   ```

Without the `super()` call in the constructor, Java would try to call the parent's no-argument constructor, causing errors if it doesn't exist.

### Protected Access Modifier

The `protected` access modifier is particularly useful in inheritance:

```java
public class Person {
    private String name;      // Only accessible within Person
    protected int age;        // Accessible to Person and its subclasses
    public String address;    // Accessible to everyone
    
    // Rest of the class...
}

public class Student extends Person {
    public void celebrateBirthday() {
        age++;  // Can access protected attribute directly
        // name++; // ERROR: Cannot access private attribute
    }
}
```

Access levels in Java, from most to least restrictive:
- `private`: Only within the same class
- `protected`: Within the same class, subclasses, and same package
- (default): Within the same package (no modifier)
- `public`: Accessible from anywhere

### Method Overriding

Method overriding occurs when a subclass provides a specific implementation for a method already defined in the superclass:

```java
// In Person class
public void introduce() {
    System.out.println("Hi, I'm " + getName() + " and I'm " + getAge() + " years old.");
}

// In Student class - overriding the introduce method
@Override  // Annotation to verify this is properly overriding a method
public void introduce() {
    System.out.println("Hi, I'm " + getName() + ", a student with ID " + studentId + ".");
}
```

Key points about method overriding:
- The method signature (name and parameters) must be identical
- The return type must be the same or a subtype of the original
- The access level cannot be more restrictive than the original
- The `@Override` annotation is optional but recommended (catches errors)

If you want to extend rather than completely replace the superclass method:

```java
@Override
public void introduce() {
    super.introduce();  // Call the parent's version first
    System.out.println("I am also a student with ID " + studentId + ".");
}
```