# Operating Systems – Chapter 1 Notes  

## 1. Introduction  
- A computer system automates information processing, consisting of **hardware** (CPU, memory, I/O devices) and **software** (application programs & system software).  
- **Operating System (OS)**: A critical system software that acts as an **intermediary** between hardware and applications.  

## 2. OS Concept  
- Positioned between **hardware** and **user applications** in the system.  
- Runs in **privileged mode** to manage resources efficiently.  
- Functions as:  
  - **A virtual machine:** Abstracts hardware complexities.  
  - **A resource manager:** Controls CPU, memory, disk, etc.  

## 3. OS Functions & Roles  
1. **Provides a Simple Virtual Machine**  
   - Offers an abstraction of hardware for easier program development.  
2. **Manages Resources**  
   - **CPU:** Allocates processor time.  
   - **Memory:** Assigns and reclaims memory.  
   - **Files:** Handles file operations.  
   - **I/O:** Controls peripheral access.  
   - **Security:** Ensures data protection.  
   - **Networking:** Manages remote communication.  
3. **Handles Inter-Program Communication**  
   - Provides mechanisms for processes to exchange data.  
4. **Protects the System**  
   - Manages user permissions and error handling.  

## 4. Examples of Operating Systems  
- **Unix (1969):** First written in C, multi-user, multi-tasking.  
- **Linux (1991):** Open-source Unix variant.  
- **Mac OS:** GUI-based, Unix kernel.  
- **MS-DOS:** Early single-user OS.  
- **Windows:** GUI-based, evolved from DOS.  

## 5. Unix Overview    
- **Main Components:**  
  - **Kernel:** Core part, manages resources.  
  - **Libraries:** Provide system functions.  
  - **Shell:** Command-line interface for user interaction.  
  - **Utilities:** Tools like editors, compilers, etc.  
- **Key Features:**  
  - Portable (C language-based).  
  - Multi-user & multitasking.  
  - Time-sharing for fair resource distribution.  
  - Hierarchical file system.  
  - Treats devices as files for uniform access.  
  - Virtual memory support.  

## 6. Roles of components
- **Main Memory**: Holds instructions and data currently being used or processed by the CPU.  
- **Processor (CPU)**: Responsible for performing calculations, executing instructions, and coordinating tasks between different components of the computer.  
- **Control Unit (CU)**: Ensures that all the different parts of the processor work together and perform their tasks in the correct order.  
- **Arithmetic and Logic Unit (ALU)**: Responsible for arithmetic and logical operations.
- **Registers**: A small but fast storage unit inside the CPU.
- **Buses**: Allows transfers of data between the components of the computer