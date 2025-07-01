**Set Theory and Relations**

### 1. Sets and Their Operations

- **Definition**:
  A set is a collection of distinct elements.

- **Description of a set**
- 1. Formal: We use precise mathematical notation. - _Examples_:
     $$ B = \{x \mid x \in \mathbb{N}, x \ mod \ 2 = 0 \} $$
$$ S = \{x \mid x = n^2, \ n \in \mathbb{N} \} $$

- **Power Set**: The set of all subsets of a given set.
  - _Example in Python:_

```python
def power_set(s):
  x = len(s)
  subsets = []
  for i in range(1 << x):
    subsets.append([s[j] for j in range(x) if (i & (1 << j))])
  return subsets

print(power_set({1, 2, 3}))
```

- **Operations**:
  - **Union**: $A \cup B = \{x | x \in A \text{ or } x \in B\}$
  - **Intersection**: $A \cap B = \{x | x \in A \text{ and } x \in B\}$
  - **Cartesian Product**: $A \times B = \{(a, b) | a \in A, b \in B\}$
