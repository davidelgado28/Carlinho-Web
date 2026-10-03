# Carlinho OS Web

**Carlinho OS Web** is a hyper-focused, lightweight operating system simulator that runs entirely client-side in the browser. Inspired by the philosophy of TempleOS, it provides a retro, low-level development environment with a text-mode VGA aesthetic, giving developers total control over the virtual hardware.

---

## Project Philosophy & Aesthetics

* **Retro Dark Mode VGA**: Rendered via an HTML5 `<canvas>` simulating a text-mode memory buffer (80 columns x 25 rows) with crisp pixelated fonts.
* **Client-Side Architecture**: Pure Vanilla JavaScript (ES6+ modules) with no heavy frameworks, ensuring blazing-fast performance.
* **Persistent Low-Level Storage**: Features a Virtual File System (VFS) backed by the browser's **IndexedDB** to store source files and compiled executables permanently.

---

## Architecture & File Structure

The system is strictly divided into modular components mimicking real OS subsystems:

* **`index.html`**: The physical chassis of the computer, embedding the CRT-styled canvas monitor over a custom background.
* **`vga.js`**: Low-level video subsystem simulating text-mode memory (`0xb8000`), managing cell rendering, cursor tracking, automatic scrolling, and backspace handling.
* **`vfs.js`**: Virtual File System that mirrors a directory tree in RAM while asynchronously persisting files and directories into IndexedDB.
* **`keyboard.js`**: Hardware interrupt driver capturing global keyboard events and routing them to the active userland process.
* **`kernel.js`**: Ring 0 core orchestrator, task scheduler, and process manager initializing subsystems and routing input multiplexing.
* **`shell.js`**: Userland command-line interface (CLI) interpreting built-in commands and launching applications.
* **`vm.js`**: Virtual Machine and PE Loader that validates the `MZ` magic header in binary files and executes custom native bytecode.
* **`editor.js`**: Text User Interface (TUI) code editor featuring retro color schemes, file editing, and direct disk saving (`F2`).
* **`browser.js`**: Text-mode web browser simulating Lynx-style web navigation via proxy requests.
