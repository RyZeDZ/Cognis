**Set Theory and Relations**

### 1. Sets and Their Operations

- **Definition**: 
A set is a collection of distinct elements.
A set can be finite or infinite.

- **Description of a set**
- 1. In English: We describe the whole percisely.
	- *Examples*: 
		- The set of even numbers
		- The set of the alphabets
- 2. Enumeration: We list the set's elements; for an infinite set, we start with the first ones to deduce the rest.
	- *Examples*:
		- {0, 2, 4, 8, ...}
		- {a, b, c, d, ...}
- 3. Formal: We use precise mathematical notation.
	- *Examples*:
$$ B = \\{x \mid x \in \mathbb{N}, x \ mod \  2 = 0 \\} $$
$$ S = \\{x \mid x = n^2, \ n \in \mathbb{N} \\} $$

- **Cardinality**: The number of elements in a set.
  - *Notation*: Card(E) = |E| = number of elements
  - *Example*: If E = {1, 5, 3, 6}, then Card(E) = |E| = 4

- **Power Set**: The set of all subsets of a given set.
  - *Notation*: P(E) = Power set of E
  - *Examples*: 
    - If E = {a, b}, then: $$ P(E) = \\{\emptyset, \\{a\\}, \\{b\\}, \\{a, b\\}\\} $$
    - If E = {1, 2, 3}, then: $$ P(E) = \\{\emptyset, \\{1\\}, \\{2\\}, \\{3\\}, \\{1,2\\}, \\{1,3\\}, \\{2,3\\}, \\{1,2,3\\}\\} $$  

- **Operations**:
  - **Empty set**: Denoted { } OR ∅
  - **Union**: A ∪ B = {x | x ∈ A or x ∈ B}
    - *Example*: If A = {1, 2}, B = {2, 3}, then A ∪ B = {1, 2, 3}
  - **Intersection**: A ∩ B = {x | x ∈ A and x ∈ B}
    - *Example*: If A = {1, 2}, B = {2, 3}, then A ∩ B = {2}
  - **Difference**: A \ B = {x | x ∈ A and x ∉ B}
    - *Example*: If A = {1, 2, 3}, B = {2, 3}, then A \ B = {1}
  - **Complement**: A' = Universal set − A
    - *Example*: If U = {1, 2, 3, 4} and A = {1, 2}, then A' = {3, 4}
  - **Cartesian Product**: A × B = {(a, b) | a ∈ A, b ∈ B}
    - *Example*: If A = {1, 2}, B = {a, b}, then A × B = {(1, a), (1, b), (2, a), (2, b)}

### 2. Properties
- **Subset**: A ⊆ B ⇔ ∀x (x ∈ A → x ∈ B)
- **Proper Subset**: A ⊂ B ⇔ A ⊆ B and A ≠ B
- **Properties**:
  - A ⊆ A (Reflexivity)
  - If A ⊆ B and B ⊆ C, then A ⊆ C (Transitivity)
  - If A ⊆ B and B ⊆ A, then A = B (Antisymmetry)

### 3. Relations and Their Properties
- **Definition**: A relation R from A to B is a subset of A × B.
- The domain of 𝑅 = {𝑥 / (𝑥, 𝑦) ∈ 𝑅 }
- The codomain of 𝑅 = {𝑦 / (𝑥, 𝑦) ∈ 𝑅 }
- **Particular Relations**:
  - **Inverse Relation**:$$ R^{-1} = \\{ (y, x) \mid (x, y) \in R \\} $$
  - **Identity Relation**:  
  $$ \text{Id} = \\{(x, y) \mid x = y\\} $$  
  - **Universal/Total Relation**:  
  $$ U = A \times A $$  
  - **Empty Relation**: ∅


- **Properties of Relations**:
  - **Reflexive**: ∀x ∈ A, (x, x) ∈ R
  - **Symmetric**: If (x, y) ∈ R, then (y, x) ∈ R
  - **Antisymmetric**: If (x, y) ∈ R and (y, x) ∈ R, then x = y
  - **Transitive**: If (x, y) ∈ R and (y, z) ∈ R, then (x, z) ∈ R

### 4. Equivalence Relations and Partial Order
- **Pre-order** = Reflexive + Transitive
- **Equivalence** = Pre-order + Symmetric
- **Order** = Pre-order + Anti-symmetric

### 5. Law of Internal Composition
- **Definition**: A composition law \( * \) in a set \( S \) is a function that assigns each pair \( (a, b) ∈ S \) a unique element \( a * b ∈ S \).  
  $$ *: S \times S \to S, \quad \forall a, b \in S, \quad a * b \in S $$  

- **Properties**:  
  - **Commutativity**: \( x * y = y * x \)  
  - **Associativity**: \( (x * y) * z = x * (y * z) \)  
  - **Neutral Element**: \( e ∈ S \) such that \( x * e = e * x = x \)  
  - **Inverse Element**: \( x' ∈ S \) such that \( x * x' = x' * x = e \)  
  - **Distributivity**: \( * \) distributes over another operation \( \circ \) if:  
    $$ a * (b \circ c) = (a * b) \circ (a * c) $$  
    $$ (b \circ c) * a = (b * a) \circ (c * a) $$  
  - **Group Structure**: If \( S \) is closed under an associative operation with a neutral and inverse element, it forms a **group**.  
  - **Subgroup**: A non-empty subset \( S' \) of a group \( S \) is a **subgroup** if it also forms a group under \( * \).  


### 6. Monoids and Groups
- **Monoid**:
  - A set M with an associative binary operation (·) and an identity element e.
  - *Example*: (ℕ, +, 0) is a monoid.
- **Group**:
  - A monoid where every element has an inverse.
  - *Example*: (ℤ, +, 0) is a group because each integer has an inverse (-x).

