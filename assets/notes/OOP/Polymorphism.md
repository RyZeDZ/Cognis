## ☕ Java Polymorphism

### What is Polymorphism?

Polymorphism allows objects of different classes to be treated as objects of a common superclass. This powerful feature enables you to write more flexible, reusable code.

### Abstract Classes

An abstract class is a class that cannot be instantiated directly and may contain abstract methods (methods without a body). It serves as a blueprint for concrete subclasses.

```java
// Abstract class
public abstract class Shape {
    protected String color;
    
    // Constructor
    public Shape(String color) {
        this.color = color;
    }
    
    // Regular method
    public String getColor() {
        return color;
    }
    
    // Abstract method - no implementation here
    public abstract double calculateArea();
    
    // Abstract method
    public abstract void draw();
}
```

Key characteristics:
- Declared with the `abstract` keyword
- Cannot be instantiated (`new Shape()` would cause compilation error)
- Can contain both regular and abstract methods
- Abstract methods have no implementation (no body) and end with a semicolon
- Subclasses must implement all abstract methods or be declared abstract themselves

### Creating Concrete Subclasses from Abstract Classes

Concrete subclasses provide implementations for all abstract methods:

```java
// Concrete subclass of Shape
public class Circle extends Shape {
    private double radius;
    
    public Circle(String color, double radius) {
        super(color);  // Call parent constructor
        this.radius = radius;
    }
    
    // Implementation of abstract method
    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }
    
    // Implementation of abstract method
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " circle with radius " + radius);
    }
    
    // Circle-specific method
    public double getRadius() {
        return radius;
    }
}

// Another concrete subclass
public class Rectangle extends Shape {
    private double width;
    private double height;
    
    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }
    
    @Override
    public double calculateArea() {
        return width * height;
    }
    
    @Override
    public void draw() {
        System.out.println("Drawing a " + color + " rectangle with width " + 
                          width + " and height " + height);
    }
}
```

### Method Overriding to Achieve Polymorphic Behavior

Polymorphism primarily works through method overriding:

```java
public class Main {
    public static void main(String[] args) {
        // Create different shapes
        Shape circle = new Circle("red", 5.0);
        Shape rectangle = new Rectangle("blue", 4.0, 6.0);
        
        // Polymorphic behavior - same method call, different behavior
        displayShapeInfo(circle);
        displayShapeInfo(rectangle);
    }
    
    public static void displayShapeInfo(Shape shape) {
        // The shape parameter could be ANY subclass of Shape
        System.out.println("Shape color: " + shape.getColor());
        
        // This calls the appropriate overridden method based on the actual object type
        shape.draw();
        
        // This also calls the appropriate implementation
        double area = shape.calculateArea();
        System.out.println("Area: " + area);
        
        System.out.println("-----------------");
    }
}
```

### Dynamic Binding of Methods at Runtime

Dynamic binding (or late binding) is what makes polymorphism work. The JVM determines which method implementation to call at runtime based on the actual object type, not the reference type:

```java
Shape shape = new Circle("red", 5.0);
shape.calculateArea();  // Calls Circle's implementation, not Shape's
```

How it works:
1. `shape` is a reference of type `Shape`
2. The object it points to is actually a `Circle`
3. When `calculateArea()` is called, Java looks at the actual object type (Circle)
4. Java then calls the appropriate implementation for that type
5. This happens at runtime, not compile time

### Explicit Casting and the instanceof Operator

Sometimes you need to access methods specific to a subclass. This requires casting:

```java
public static void processShape(Shape shape) {
    // All shapes can do these operations
    shape.draw();
    
    // Only Circle has getRadius()
    // This would cause an error: double radius = shape.getRadius();
    
    // Check type before casting to avoid ClassCastException
    if (shape instanceof Circle) {
        // Safe to cast
        Circle circle = (Circle) shape;
        double radius = circle.getRadius();
        System.out.println("This is a circle with radius: " + radius);
    }
    else if (shape instanceof Rectangle) {
        // Cast to Rectangle
        Rectangle rectangle = (Rectangle) shape;
        System.out.println("This is a rectangle");
    }
}
```

Key points:
- `instanceof` checks if an object is an instance of a specific class
- Explicit casting with `(ClassName)` converts a reference to another type

### Polymorphism with Arrays of Objects

A major benefit of polymorphism is the ability to store different subclass objects in a collection of the superclass type:

```java
public class ShapeGallery {
    public static void main(String[] args) {
        // Array of Shape references
        Shape[] shapes = new Shape[4];
        
        // Fill with different types of shapes
        shapes[0] = new Circle("red", 5.0);
        shapes[1] = new Rectangle("blue", 4.0, 6.0);
        shapes[2] = new Circle("green", 3.0);
        shapes[3] = new Rectangle("yellow", 2.0, 8.0);
        
        // Process all shapes in the same way
        double totalArea = 0;
        
        for (int i = 0; i < shapes.length; i++) {
            // Polymorphic calls - right version is called for each shape
            shapes[i].draw();
            
            // Calculate the total area of all shapes
            totalArea += shapes[i].calculateArea();
            
            // If we need to perform shape-specific operations
            if (shapes[i] instanceof Circle) {
                Circle circle = (Circle) shapes[i];
                System.out.println("Circle radius: " + circle.getRadius());
            }
        }
        
        System.out.println("Total area of all shapes: " + totalArea);
    }
}
```

This demonstrates the power of polymorphism:
- Different objects stored in the same array
- Same method call produces different behaviors
- Code that works with any Shape, regardless of its actual type
- Flexibility to add new Shape subclasses without changing existing code

### Complete Example of Polymorphism

```java
// Abstract base class
public abstract class Animal {
    protected String name;
    
    public Animal(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    // Abstract methods to be implemented by subclasses
    public abstract void makeSound();
    public abstract void move();
}

// Concrete subclass
public class Dog extends Animal {
    public Dog(String name) {
        super(name);
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " says: Woof woof!");
    }
    
    @Override
    public void move() {
        System.out.println(name + " runs on four legs");
    }
    
    // Dog-specific method
    public void fetch() {
        System.out.println(name + " is fetching the ball");
    }
}

// Another concrete subclass
public class Bird extends Animal {
    private double wingspan;
    
    public Bird(String name, double wingspan) {
        super(name);
        this.wingspan = wingspan;
    }
    
    @Override
    public void makeSound() {
        System.out.println(name + " says: Chirp chirp!");
    }
    
    @Override
    public void move() {
        System.out.println(name + " flies with wings spread " + wingspan + " centimeters wide");
    }
    
    // Bird-specific method
    public void fly() {
        System.out.println(name + " is flying high");
    }
}

// Using polymorphism
public class AnimalDemo {
    public static void main(String[] args) {
        // Create an array of Animal references
        Animal[] animals = new Animal[3];
        animals[0] = new Dog("Rex");
        animals[1] = new Bird("Tweety", 5.2);
        animals[2] = new Dog("Buddy");
        
        // Process all animals polymorphically
        for (int i = 0; i < animals.length; i++) {
            System.out.println("Animal " + (i+1) + ": " + animals[i].getName());
            animals[i].makeSound();  // Polymorphic call
            animals[i].move();       // Polymorphic call
            
            // Access specific methods using instanceof and casting
            if (animals[i] instanceof Dog) {
                Dog dog = (Dog) animals[i];
                dog.fetch();  // Dog-specific method
            } 
            else if (animals[i] instanceof Bird) {
                Bird bird = (Bird) animals[i];
                bird.fly();   // Bird-specific method
            }
            
            System.out.println("---------------");
        }
    }
}
```

This example demonstrates all aspects of polymorphism:
- Abstract class defining a common interface
- Concrete subclasses with specific implementations
- Dynamic method binding at runtime
- Type checking with instanceof
- Explicit casting to access specialized methods
- Array of superclass references holding different subclass objects