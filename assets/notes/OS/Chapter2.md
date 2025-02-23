# Chapter VI: The UNIX System

## 1. General Architecture of UNIX  
### 1.1. Core Components  

UNIX has **4 layers**:  
1. **Kernel**:  
   - Manages hardware (CPU, memory, disks).  
   - Handles processes and system calls.  
2. **Shell**:  
   - Command interpreter (e.g., Bash, C-Shell).  
   - Executes scripts and user commands.  
3. **Libraries**:  
   - Provide high-level interfaces to kernel services.  
4. **Utilities**:  
   - Programs like `gcc`, `vi`, `make`.  

![Unix architecture](/assets/notes/OS/images/UNIX-architecture.png)  

## 2. UNIX Files  
### 2.1. File System Organization  
- **Hierarchical Tree Structure**:  
  - Root directory (`/`) → Subdirectories → Files.  
  - **Special Directories**:  
    - `.`: Current directory.  
    - `..`: Parent directory.  
    
![Unix File System](/assets/notes/OS/images/Unix-File-System.png)
[Source: GeekForGeeks](https://www.geeksforgeeks.org/unix-file-system/)


### 2.2. File Paths  
- **Absolute Path**: Starts from root (`/usr/bin/compress`).  
- **Relative Path**: Starts from current directory (`../durand`).  

**Example**:  
If current directory is `/home/cognis/lessons`:  
- Access `congis` via `../`.  

### 2.3. File Types  
1. **Ordinary Files:** Store text or binary data and support read, write, create, and delete (e.g., `document.txt`, `program.exe`).  
2. **Directories**: Contain files/subdirectories.  
3. **Special Files**:  
   - **Character-mode**: Terminals, printers.  
   - **Block-mode**: Disks.  
4. **Symbolic Links**: Shortcuts to files.  

### 2.4. File Permissions  
- **Access Rights**: `r` (read file), `w` (write to file), `x` (execute file).  
- **User Classes**: Owner, Group, Others.  

```bash
$ ls -l
-rwxr--r-- 1 ryze cognis 4096 May 28 08:30 file.txt  
```
*Note: The command `ls` lists the files/folders in the current working directory. The `-l` flag shows the permissions for each file/folder.*
![Filesystem.png](/assets/notes/OS/images/Unix-File-System-Illustration.png)

**Explanation**:  

- **File type**: The type of the file (e.g `-` for file, `d` for directory, `l` for symbolic links, ...)  
- **Permissions**: Divided into 3 parts:  
  - *Owner*: The owner of the file (`rwx` in the previous example), meaning the owner has Read, Write and Execute privileges on the file.  
  - *Group*: The group that owns the file (`r--` in the previous example), meaning they can only Read the file.  
  - *Other*: Everyone else (`r--` in the previous example).  

- **Hard link**: Number of references to this file (in this case, `1`).  
- **Owner**: The owner (user) of this file (`ryze` in this example).    
- **Group**: The group that owns this file (`cognis`).  
- **Size**: The size of the file in Bytes.  
- **Date**: The last modification date of the file.  
- **File name**: The name of the file.  

**Change file permissions**:  

- `chmod 754 file.txt` → sets permissions using octal notation:  
7 = 111 (rwx) → Owner (all enabled)  
5 = 101 (r-x) → Group (read & execute)  
4 = 100 (r--) → Others (read-only)  

---

## 3. Basic UNIX Commands  
### 3.1. User Management  
| Command          | Description                      |  
|-------------------|----------------------------------|  
| `whoami`          | Show current user ID.           |  
| `passwd`          | Change password.                |  
| `id`              | Display UID and GID.            |  

### 3.2. Directory Commands  
| Command         | Action                          |  
|-----------------|---------------------------------|  
| `cd ~`          | Go to home directory.          |  
| `pwd`           | Show current directory path.   |  
| `mkdir dir`     | Create directory.              |  
| `rmdir dir`     | Delete empty directory.        |  

### 3.3. File Operations  
- **`ls` Options**:  
  - `ls -a`: Show hidden files (e.g., `.bashrc`).  
  - `ls -l`: Detailed list with permissions.  
  - `ls -d`: Shows directories only.

### 3.4. Redirection  
| Syntax          | Purpose                          |  
|-----------------|----------------------------------|  
| `command > file`| Overwrite file with output.      |  
| `command >> file`| Append output to file.          |  

---

## 4. Programming in C Under UNIX  
### 4.1. Compilation  
- Compile: `cc main.c -o main`  
- Run: `./main`  

### 4.2. Makefiles  
```makefile
# Example Makefile  
all: hello goodbye  

hello:
	echo "Hello, Make!"

goodbye:
	echo "Goodbye, Make!"

clean:
	echo "Cleaning up..."
  
```

### 4.3. Command-Line Arguments  
```c
#include <stdio.h>  
int main(int argc, char *argv[]) {  
    printf("Program: %s\n", argv[0]); // e.g., "./test"  
}  
```

### 4.4. Process Management with `fork()`  
```c
#include <unistd.h>  
int main() {  
    pid_t pid = fork();  
    if (pid == 0) {  
        printf("Child PID: %d\n", getpid());  
    } else {  
        wait(NULL);  
        printf("Parent PID: %d\n", getpid());  
    }  
}  
```

---

## 5. UNIX Processes  
### 5.1. Process Lifecycle  
1. **Creation**: `fork()` duplicates the parent process.  
2. **Execution**: `exec()` replaces child process code.  
3. **Termination**: `exit()` ends the process.  

### 5.2. Key Commands  
| Command | Description                  |  
|---------|------------------------------|  
| `ps`    | List running processes.      |  
| `kill`  | Terminate a process by PID.  |  
