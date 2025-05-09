# Chapter 2: Grammars  

---

## 1. Grammar Definition  
A **grammar** is a formal system for generating all valid strings (words) in a language. It is a quadruplet $G = (V_T, V_N, S, P)$.  
- **Terminal symbols** ($V_T$): Basic alphabet symbols (e.g., $a, b, 0, 1$).  
- **Non-terminal symbols** ($V_N$): Intermediate symbols used in production rules (e.g., $S, A$).  
- **Start symbol** ($S \in V_N$): Initial symbol for derivations.  
- **Production rules** ($P$): Rules of the form $\alpha \rightarrow \beta$, where $\alpha \in (V_T \cup V_N)^+$ and $\beta \in (V_T \cup V_N)^*$.  

**Example**:  
- $V_T = \{a, b\}$, $V_N = \{S\}$, $P = \{S \rightarrow aSb, S \rightarrow \varepsilon\}$.  
- This grammar generates words like $ab$, $aabb$, $aaabbb$, etc.  

**Key Properties**:  
![Grammar.png](/assets/notes/LT/images/Grammar-definition.png)
- $V_T \cup V_N = V$
- $V_T \cap V_N = \emptyset$ (terminals and non-terminals are disjoint).
- The notation $\alpha \rightarrow \beta$ is called a derivation ($\alpha$ is a left member and $\beta$ is a right member). 
- Rules define how symbols can be replaced (e.g., $S \rightarrow aSb$).  

---

## 2. How Do Derivations Work?  
A **derivation** is the step-by-step process of applying production rules to build a word.  

### 2.1 Derivation Notations  
- **Single-step derivation**: Replace one non-terminal symbol.  
  **Notation**: $ \Rightarrow $.  
  **Example**: $ S \Rightarrow aSb $.  

- **k-step derivation**: Replace non-terminals in exactly $ k $ steps.  
  **Notation**: $ \overset{k}{\Rightarrow} $.   

- **Zero-or-more-step derivation**: Replace non-terminals in any number of steps (including zero).  
  **Notation**: $ \overset{*}{\Rightarrow} $.  

---

### 2.2 Derivation Example  
**Grammar**: $ S \rightarrow aSb \mid \varepsilon $.  

**Word**: $ aabb $.  

**Derivation Sequence**:  
1. $ S \Rightarrow aSb $ (using $ S \rightarrow aSb $).  
2. $ aSb \Rightarrow aaSbb $ (using $ S \rightarrow aSb $).  
3. $ aaSbb \Rightarrow aabb $ (using $ S \rightarrow \varepsilon $).  

**Notation**:  
- $ S \overset{3}{\Rightarrow} aabb $ (3 steps).  
- $ S \overset{*}{\Rightarrow} aabb $ (any number of steps).  

---

## 3. Language Generated by a Grammar ($L(G)$)  
The **language** $ L(G) $ is the set of all words derivable from $ S $ in any number of steps:  
$$ L(G) = \{w \in V_T^* \mid S \overset{*}{\Rightarrow} w\} $$  

**Example**:  
For $ G: S \rightarrow aS \mid \varepsilon $:  
- $ L(G) = \{a^n \mid n \geq 0\} $.  
- Derivation for $ a^3 $: $ S \overset{3}{\Rightarrow} aaa $.  

---

## 4. Word Generated by a Grammar  
A **word** $ w $ is **generated by a grammar** $ G $ if there exists a sequence of derivations starting from the axiom $ S $ that produces $ w $. Formally:  
$$ S \overset{\ast}{\Rightarrow} w \quad \text{and} \quad w \in V_T^\ast $$  

**Key Requirements**:  
1. The derivation starts with $ S $.  
2. All non-terminals are replaced by terminals by the end.  
3. The final word contains **only terminal symbols**.  

**Example**:  
Grammar $ G_1 $: $ S \rightarrow aS \mid \varepsilon $.  
- Word $ w = \text{aaaaa} $ is generated by:  
  $$ S \Rightarrow aS \Rightarrow aaS \Rightarrow aaaS \Rightarrow aaaaS \Rightarrow aaaaa $$  
  - **Notation**: $ S \overset{5}{\Rightarrow} \text{aaaaa} $.  


---

## 5. Classification of Grammars (Chomsky Hierarchy)  
Grammars are classified into **four types** based on rule restrictions, ordered by inclusion:  
**Type 3 ⊂ Type 2 ⊂ Type 1 ⊂ Type 0**  

### **Type 3: Regular Grammars**  
- **Rule Form**:  
  - **Right-Linear**: $A \Rightarrow \alpha B$ or $A \rightarrow \alpha$  
  - **Left-Linear**: $A \rightarrow B\alpha $ or $A \rightarrow \alpha$  
  - $ A, B \in V_N , \alpha \in V_T^* $ (only **one non-terminal** per rule, at the end/start).  
- **Example**:  
  $ S \rightarrow aS \mid b $.  
  Generates regular languages like $ \{a^n b \mid n \geq 0\} $.  

---

### **Type 2: Context-Free Grammars**  
- **Rule Form**: $ A \rightarrow \alpha $  
  - $ A \in V_N , \alpha \in (V_T \cup V_N)^* $.  
  - Rules apply regardless of surrounding symbols (no context).  
- **Example**:  
  $ S \rightarrow aSb \mid \varepsilon $.  
  Generates $ \{a^n b^n \mid n \geq 0\} $.  

---

### **Type 1: Context-Sensitive Grammars**  
- **Rule Form**: $ \alpha A \beta \rightarrow \alpha w \beta $  
  - $ A \in V_N$  
  - $ \alpha, \beta, w \in (V_T \cup V_N)^* , w \neq \varepsilon $.  
  - Rules depend on **context** ($\alpha$ before and $\beta$ after $A$).  
- **Alternative Definition**:  
  $ \alpha \rightarrow \beta $ where $ |\alpha| \leq |\beta| $.  
  - Exception: $ S \rightarrow \varepsilon $ allowed if $ S $ never appears on a rule’s right side.  

---

### **Type 0: Unrestricted Grammars**  
- **Rule Form**: $ \alpha \rightarrow \beta $  
  - $ \alpha \in (V_T \cup V_N)^+ ,  \beta \in (V_T \cup V_N)^* $.  
  - **No restrictions**: Any combination of symbols can be replaced.  
- **Example**:  
  Rules like $ aSb \rightarrow ba $.  


---
# 6 Equivalent Grammars

Two grammars are **equivalent** if they generate the **same language**.  
Grammars $ G $ and $ G' $ are **equivalent** (denoted $ G \equiv G' $) if:  
$$ L(G) = L(G') $$  

**Example**  
Consider two grammars for the language $ \{a^n b^n \mid n \geq 0\}$:  

**Grammar $ G_1 $:**  
- $ S \rightarrow aSb \mid \varepsilon $  

**Grammar $ G_2 $:**  
- $ S \rightarrow aB $  
- $ B \rightarrow Sb \mid \varepsilon $  

Both generate the same language, so $ G_1 \equiv G_2 $.  

---

**Key Takeaways**  
1. **Equivalent Grammars**: Different grammars can generate the same language.  
2. **Language Focus**: Equivalence depends on the generated language, not the grammar structure.  
3. **Derivation Flexibility**: A language can have infinitely many equivalent grammars.  
4. **Hierarchy**: Every Type 3 grammar is also Type 2, every Type 2 is Type 1, etc.  