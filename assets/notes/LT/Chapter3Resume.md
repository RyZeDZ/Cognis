## 📘 Chapter 3 – Automata

### 📐 Formal Definition of an Automaton

An **Automaton** is a 5-tuple:

$$
A = (V_T, Q, q_0, \delta, Q_F)
$$

Where:
- **$V_T$**: A finite set of **terminal symbols** (alphabet of the language)
- **$Q$**: A finite set of **states**
- **$q_0 \in Q$**: The **start state**
- **$\delta: Q \times V_T \rightarrow Q$**: A **transition function** that maps state-symbol pairs to a state (transition rule)
- **$Q_F \subseteq Q$**: A set of **accepting (final) states**

**Language recognized by an Automaton**: A language is recognized by an automaton if all the words in the language are accepted by this automaton.

---

### 📥 Formal Notation of Language Generated by Automaton

The **language generated** by an automaton $A$ is:

$$
L(A) = \\{ w \in V_T^* \mid A \text{ accepts } w \\}
$$

Where:
- $w$ is a string composed only of terminal symbols (from $V_T$).
- The automaton accepts $w$ if, starting from the initial state $q_0$, the automaton moves through a sequence of states, ending in an accepting state from $Q_F$ after processing all symbols of $w$.

---

### 🔁 Equivalent Automata

Two automata $A_1$ and $A_2$ are **equivalent** if:

$$
L(A_1) = L(A_2)
$$

Even if their states or transitions differ, they generate the same language.

---

## 🧑‍🏫 Classification of Automata

Automata are classified into different types based on their complexity and capabilities. For example:

| Automaton Type             | Formal Definition                         | Recognized Language  |
|----------------------------|-------------------------------------------|----------------------|
| **Finite State Automaton (FSA)** | Quintuple: $(V_T, Q, q_0, \delta, Q_F)$ | Regular Language     |
| **Deterministic FSA (DFA)** | Special case of FSA, deterministic transitions | Regular Language     |
| **Non-deterministic FSA (NDFA)** | FSA with non-deterministic transitions | Regular Language     |

---

## ⚙️ FINITE STATE AUTOMATA (FSA)

### 📐 Formal Definition of an FSA

A **Finite State Automaton (FSA)** is a 5-tuple:

$$
A = (V_T, Q, q_0, \delta, Q_F)
$$

Where:
- **$V_T$** is a finite set of terminal symbols.
- **$Q$** is a finite set of states.
- **$q_0 \in Q$** is the start state.
- **$\delta: Q \times V_T \rightarrow Q$** is the transition function.
- **$Q_F \subseteq Q$** is the set of accepting states.

#### Example:

Let’s consider an FSA $A = (\\{a, b\\}, \\{q_0, q_1\\}, q_0, \delta, \\{q_1\\})$, where the transition function $\delta$ is defined as:
- $\delta(q_0, a) = q_1$
- $\delta(q_1, b) = q_0$

This automaton recognizes the language of strings consisting of an odd number of `a`s followed by an even number of `b`s.

---

### 🔄 Deterministic and Non-Deterministic FSAs

#### 📐 Deterministic FSA (DFA)

A **Deterministic Finite Automaton (DFA)** is an FSA where for each state and input symbol, there is **exactly one** state to which the automaton can transition.

- **Formal Definition**: A DFA is a special case of an FSA where $\delta: Q \times V_T \rightarrow Q$ is a **total function** (no ambiguity in transitions).
- **Language Recognized by DFA**: Regular Language.

#### 📐 Non-deterministic FSA (NDFA)

A **Non-Deterministic Finite Automaton (NDFA)** is an FSA where for each state and input symbol, there may be **multiple possible states** to which the automaton can transition, or even no transition at all.

- **Formal Definition**: In an NDFA, the transition function $\delta$ is defined as $\delta: Q \times V_T \rightarrow 2^Q$ (set of possible next states).
- **Language Recognized by NDFA**: Regular Language.

#### Example of DFA and NDFA for a language accepting strings that contain an even number of `a`s:
- **DFA**: States = {q_0, q_1}, where q_0 is the start and accepting state (even number of `a`s), and q_1 is the rejecting state (odd number of `a`s).
- **NDFA**: States = {q_0, q_1}, but in this case, there can be multiple transitions from a state for the same input symbol (non-deterministic).

---

## 🔄 Representation of an FSA

FSAs can be represented in multiple ways:

1. **Definition**: The most formal representation as a 5-tuple $(V_T, Q, q_0, \delta, Q_F)$.
2. **Transition Table**: A table where rows represent states and columns represent symbols, with entries showing the next state(s) for a given state and input.
3. **State Diagram (Graph)**: A directed graph where:
   - Each node represents a state.
   - Each edge is labeled with an input symbol.
   - Accepting states are often shown as double circles.


---

### 🔄 Complete FSA

A **Complete FSA** is an automaton where for each state and symbol from the alphabet, there is always a defined transition. If no transition is defined, a **dead state** is added.

---

## 🔄 Determinization of an FSA

### 📐 Determinization without ε-Transitions

If an FSA has **no epsilon ($\varepsilon$) transitions**, the determinization process involves converting an NDFA into a DFA by creating new states that represent combinations of possible NDFA states. This is done by using the **powerset construction algorithm**.

### 📐 Determinization with ε-Transitions

If the FSA includes epsilon ($\varepsilon$) transitions (which allow for transitions without consuming any input symbol), the determinization process is more complex. The algorithm for this process involves:
1. Computing the **ε-closure** of states.
2. Applying the **powerset construction algorithm** using ε-closures instead of direct transitions.

---
