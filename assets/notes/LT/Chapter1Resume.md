# 📘 Chapter 1 – Resume
---

## ✳️ Words

A **word** is a finite sequence of symbols from an alphabet.

- **Notation:**  
  A word $w$ over an alphabet $A$ is written as:  
  $$ w = a_1a_2a_3\ldots a_n \quad \text{with } a_i \in A $$

- The **empty word** is denoted by:  $ \varepsilon $

---

## 📏 Word Length

- **Length of a word:**  
  $$ |w| = \text{number of symbols in } w $$  
  Example: If $w = abba$, then $|w| = 4$.

- **Length with respect to a symbol $a$:**  
  $$ |w|_a = \text{number of occurrences of } a \text{ in } w $$  
  Example: If $w = ababa$, then $|w|_a = 3$, $|w|_b = 2$.

---

## 🔁 Power of a Word

The **$n^{\text{th}}$ power** of a word $w$ is defined recursively:

- $$ w^0 = \varepsilon $$
- $$ w^n = w \cdot w^{n-1}, \quad n > 0 $$

Example:  
If $w = ab$, then:  
- $w^2 = abab$  
- $w^3 = ababab$

---

## 🔍 Prefixes, Suffixes, Factors, Subwords

Let $w = uvz$ where $u, v, z \in \Sigma^*$.

- **Prefix of $w$:**  
  $$ Pref(w) = \{ u \mid \exists v \in \Sigma^*, w = uv \} $$  
  Example: If $w = abc$, then $Pref(w) = \{\varepsilon, a, ab, abc\}$

- **Suffix of $w$:**  
  $$ Suff(w) = \{ z \mid \exists u \in \Sigma^*, w = uz \} $$  
  Example: If $w = abc$, then $Suff(w) = \{\varepsilon, c, bc, abc\}$

- **Factor (substring) of $w$:**  
  $$ Fact(w) = \{ v \mid \exists u,z \in \Sigma^*, w = uvz \} $$  
  Example: If $w = abc$, then $Fact(w) = \{\varepsilon, a, b, c, ab, bc, abc\}$

- **Subword (subsequence) of $w$:**  
  $$ SWord(w) = \text{all ordered selections of letters from } w $$  
  Example: If $w = abc$, then $SWord(w) = \{\varepsilon, a, b, c, ab, ac, bc, abc\}$

---

## 🔁 Conjugate Words

Two words $u$ and $v$ are **conjugates** if:  
$$ \exists x, y \in \Sigma^* : u = xy \text{ and } v = yx $$

Example:  
- $u = abc$, $v = bca$ → $v$ is a conjugate of $u$  
- $u = abc$, $v = acb$ → $v$ is **not** a conjugate of $u$

---

## 🔃 Mirror / Reverse of a Word

The **reverse** of a word $w$, denoted $w^R$, is:  
$$ w^R = a_n a_{n-1} \ldots a_1 $$

A **palindrome** is a word such that:  
$$ w = w^R $$

Example:  
- Palindrome: `abba`, `racecar`  
- Not a palindrome: `abc`, `hello`

---

## 🌀 Primitive and Periodic Words

- **Primitive Word:**  
  A word $w$ is **primitive** if it cannot be written as $w = u^n$ for some $u \in \Sigma^*$ and $n > 1$.

  ✅ Example (primitive): $w = abc$ → can't be written as a repetition  
  ❌ Example (not primitive): $w = aa$ → $w = a^2$

- **Periodic Word:**  
  A word $w$ is **periodic** if:  
  $$ \exists u \in \Sigma^*, n > 1 : w = u^n $$

  ✅ Example (periodic): $w = ababab$ → $w = (ab)^3$  
  ❌ Example (not periodic): $w = abc$ → no repetition pattern

---

## 🔣 Language Operations

Let $L_1, L_2 \subseteq \Sigma^*$

- **Concatenation:**  
  $$ L_1 \cdot L_2 = \{ uv \mid u \in L_1, v \in L_2 \} $$
  Example:  
  If $L_1 = \{a, ab\}$ and $L_2 = \{b\}$, then  
  $L_1 \cdot L_2 = \{ab, abb\}$

- **Union:**  
  $$ L_1 \cup L_2 = \{ w \mid w \in L_1 \text{ or } w \in L_2 \} $$
  Example:  
  If $L_1 = \{a, ab\}$ and $L_2 = \{ab, b\}$, then  
  $L_1 \cup L_2 = \{a, ab, b\}$

- **Intersection:**  
  $$ L_1 \cap L_2 = \{ w \mid w \in L_1 \text{ and } w \in L_2 \} $$
  Example:  
  $L_1 = \{a, ab\}$ and $L_2 = \{ab, b\}$  
  $L_1 \cap L_2 = \{ab\}$

- **Difference (Subtraction):**  
  $$ L_1 - L_2 = \{ w \mid w \in L_1 \text{ and } w \notin L_2 \} $$
  Example:  
  $L_1 = \{a, ab, b\}$ and $L_2 = \{b\}$  
  $L_1 - L_2 = \{a, ab\}$

- **Complement (relative to $\Sigma^*$):**  
  $$ \overline{L} = \Sigma^* \setminus L $$
  Example:  
  If $\Sigma = \{a, b\}$ and $L = \{a, ab\}$, then $\overline{L}$ contains all words over $\{a, b\}$ **except** $a$ and $ab$.

- **Equality:**  
  $$ L_1 = L_2 \iff L_1 \subseteq L_2 \text{ and } L_2 \subseteq L_1 $$  
  Example:  
  $L_1 = \{a, b\}$ and $L_2 = \{b, a\}$ → $L_1 = L_2$

- **Mirror (reverse):**  
  $$ L^R = \{ w^R \mid w \in L \} $$  
  Example:  
  If $L = \{ab, a\}$, then $L^R = \{ba, a\}$

- **Important identity:**  
  $$ L \cdot \varnothing = \varnothing $$

---

## 🔁 Power of a Language

- $$ L^0 = \{\varepsilon\} $$
- $$ L^n = L \cdot L^{n-1} $$

- **Kleene Star:**  
  $$ L^* = \bigcup_{n=0}^{\infty} L^n $$
  (zero or more repetitions)  
  Example: If $L = \{a\}$, then $L^* = \{\varepsilon, a, aa, aaa, \ldots\}$

- **Kleene Plus:**  
  $$ L^+ = \bigcup_{n=1}^{\infty} L^n = L \cdot L^* $$
  (one or more repetitions)  
  Example: If $L = \{a\}$, then $L^+ = \{a, aa, aaa, \ldots\}$
