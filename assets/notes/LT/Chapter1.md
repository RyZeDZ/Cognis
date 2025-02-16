# Chapter 1: Alphabets, Words, Languages  

---

## 1. Introduction  
- **Natural Language**: Ambiguous, human-centric (e.g., English, French).  
- **Formal Language**: Strict syntax, machine-readable (e.g., programming languages).  

---

## 2. Key Definitions  

### 2.1 Symbols  
A **symbol** is an abstract entity (e.g., $0$, $a$, $\land$).  

---

### 2.2 Alphabet ($V$)  
A finite, non-empty set of symbols.  

**Examples**:  
1. **Binary**: $V_1 = \\{0, 1\\}$  
2. **Letters**: $V_2 = \\{a, b, c, \ldots, z\\}$  
3. **Programming Keywords**: $V_3 = \\{\text{if}, \text{then}, \text{else}, \text{id}, \text{nb}\\}$  
4. **Math Operators**: $V_4 = \\{+, -, \times, \div, =\\}$  
5. **DNA Nucleotides**: $V_5 = \\{A, T, C, G\\}$  

---

### 2.3 Word ($w$)  
A finite sequence of symbols from $V$.  

**Examples**:  
- For $V_1 = \\{0, 1\\}$:  
  $w_1 = 0101$, $w_2 = 111$  
- For $V_3 = \\{\text{if}, \text{then}, \text{else}\\}$:  
  $w_3 = \text{if then else}$  
- For $V_5 = \\{A, T, C, G\\}$:  
  $w_4 = ATCCGTA$  

**Special Words**:  
- **Empty Word**: $\varepsilon$ (length 0).  
- **Notations**:  
  - $V^*$: All words over $V$ (including $\varepsilon$).  
  - $V^+ = V^* \setminus \\{\varepsilon\\}$.  

---

### 2.4 Word Length ($|w|$, $\text{length}(w)$)  
The number of symbols in $w$.  

**Examples**:  
- $|V_1| = |0101| = 4$   
- $\text{length}(V_3) = |\text{if then else}| = 3$  
- $|\varepsilon| = 0$  

**Symbol Occurrence**: $|w|_a = \text{number of occurrences of symbol } a \text{ in } w$.  
**Examples**:  
  - $|0101|_0 = 2$  
  - $|\text{if then else}|_{\text{if}} = 1$  

---

### 2.5 Concatenation ($\cdot$)  
Appending two words: $w_1 \cdot w_2 = w_1w_2$.  

**Examples**:  
- For $V_1 = \\{0, 1\\}$: $0 \cdot 1 = 01$  
- For $V_3 = \\{\text{if}, \text{then}\\}$: $\text{if} \cdot \text{then} = \text{if then}$  

**Properties**:  
- **Associative**: $(w_1 \cdot w_2) \cdot w_3 = w_1 \cdot (w_2 \cdot w_3)$  
- **Neutral Element**: $w \cdot \varepsilon = \varepsilon \cdot w = w$  
- **Non-Commutative**: Generally, $w_1 \cdot w_2 \neq w_2 \cdot w_1$ (e.g., $ab \neq ba$).  

---

### 2.6 Mirror/Reverse ($w^R$)  
Reverse the symbols in $w$.  

**Examples**:  
- $(abc)^R = cba$  
- $(\text{if then})^R = \text{then if}$  

A word is a **palindrome** if $w = w^R$.  
- **Example**: $(\text{radar})^R = \text{radar}$  

---

### 2.7 Power ($w^n$)  
Repeat $w$ $n$ times.  

**Examples**:  
- $a^3 = aaa$  
- $(\text{if})^{2} = \text{if if}$  

---

### 2.6 Sub-Word Concepts  
1. **Factor**: Contiguous subsequence (e.g., $ab$ in $aabba$).  
   - **Proper Factor**: Factor ≠ $w$ and ≠ $\varepsilon$.  
   - Notation: $\text{Fact}(w)$.  
2. **Prefix**: Starting subsequence (e.g., $aa$ in $aabba$).  
   - **Proper Prefix**: Prefix ≠ $w$ and ≠ $\varepsilon$.  
   - Notation: $\text{Pref}(w)$.  
3. **Suffix**: Ending subsequence (e.g., $ba$ in $aabba$).  
   - **Proper Suffix**: Suffix ≠ $w$ and ≠ $\varepsilon$.  
   - Notation: $\text{Suff}(w)$.  
4. **Subword**: Non-contiguous subsequence preserving order (e.g., $aba$ in $abca$).  
   - **Proper Subword**: Subword ≠ $w$ and ≠ $\varepsilon$.  
   - Notation: $\text{Subw}(w)$.  

**Examples**:  
- For $w = \text{cognisontop}$ :  
  - Prefix: $\text{cog}$  
  - Suffix: $\text{op}$  
  - Subword: $\text{gst}$  

---

### 2.9 Special Words  
1. **Primitive Word**: Cannot be written as $u^n$ for $n > 1$.  
   - Example: $ab$ (since $ab \neq u^2$ for any $u$).  
2. **Periodic Word**: Repeats a primitive word (e.g., $abab = (ab)^2$).  

---

## 3. Languages  
### 3.1 Definition  
A **language** $L$ is a subset of $V^*$ (can be finite or infinite).  

**Examples**:  
1. $L_1 = \\{0^n1^n \mid n \geq 0\\}$ (balanced binary strings).  
2. $L_2 = \\{\text{if } x \text{ then } y \mid x, y \in V_3\\}$ (conditional statements).  
3. $L_3 = \\{A^nT^n \mid n \geq 0\\}$ (DNA strand pairs).  

---

### 3.2 Operations on Languages  
1. **Set Operations**:  
   - **Union**: $L_1 \cup L_2 = \\{w \mid w \in L_1 \text{ or } w \in L_2\\}$  
     - Example: $\\{a\\} \cup \\{b\\} = \\{a, b\\}$  
   - **Intersection**: $L_1 \cap L_2 = \\{w \mid w \in L_1 \text{ and } w \in L_2\\}$  
     - Example: $\\{a\\} \cap \\{a, b\\} = \\{a\\}$  
   - **Difference**: $L_1 - L_2 = \\{w \mid w \in L_1 \text{ and } w \notin L_2\\}$  
     - Example: $\\{a, b\\} - \\{b\\} = \\{a\\}$  
   - **Complement**: $\overline{L} = V^* \setminus L$  
     - Example: $\overline{\\{a\\}} = V^* \setminus \\{a\\} = \\{\varepsilon, b, aa, ab, \ldots\\} \)$  

2. **Language-Specific Operations**:  
   - **Concatenation**: $L_1 \cdot L_2 = \\{uv \mid u \in L_1, v \in L_2\\}$.  
     - Example: $\\{a\\} \cdot \\{b\\} = \\{ab\\}$.  
   - **Kleene Star**: $L^* = \bigcup_{i \geq 0} L^i$.  
     - Example: $\\{a\\}^* = \\{\varepsilon, a, aa, ...\\}$.  
   - **Kleene Plus**: $L^+ = \bigcup_{i \geq 1} L^i$  
     - Example: $\\{a\\}^+ = \\{a, aa, aaa, \ldots\\}$  
   - **Mirror Language**: $L^R = \\{w^R \mid w \in L\\}$  
     - Example: $\\{ab\\}^R = \\{ba\\}$  

---

### 3.3 Key Properties  

**Union**:  
$$\quad L \cup \emptyset = L \quad \text{(absorption)}$$  
$$\quad L \cup V^* = V^* \quad \text{(absorption)}$$  


**Concatenation**:  
$$\quad L \cdot \emptyset = \emptyset \cdot L = \emptyset \quad \text{(absorption)}$$  
$$\quad L \cdot \{\varepsilon\} = \{\varepsilon\} \cdot L = L$$

**Kleene Star**:  
$$\quad \{\varepsilon\}^* = \{\varepsilon\}$$  
$$\quad V^* = V^+ \cup \{\varepsilon\}$$  