export class Editor {
    constructor(vga, vfs, onExit) {
        this.vga = vga;
        this.vfs = vfs;
        this.onExit = onExit;
        this.active = false;
        this.buffer = "";
        this.filepath = "";
    }

    open(filepath) {
        this.active = true;
        this.filepath = filepath;
        try {
            const data = this.vfs.readFile(filepath);
            this.buffer = new TextDecoder().decode(data);
        } catch {
            this.buffer = ""; 
        }
        this.render();
    }

    render() {
        this.vga.clearScreen('#0000AA'); 
        this.vga.print(` Carlinho Edit - ${this.filepath} [ESC: Sair | F2: Salvar]\n`, this.vga.colors.black, this.vga.colors.lightGray);
        this.vga.print("=".repeat(this.vga.cols) + "\n", this.vga.colors.lightGray, '#0000AA');
        this.vga.print(this.buffer, this.vga.colors.white, '#0000AA');
    }

    handleInput(event) {
        if (event.key === 'Escape') {
            this.active = false;
            this.vga.clearScreen();
            this.onExit();
            return;
        }
        
        if (event.key === 'F2') {
            const encoded = new TextEncoder().encode(this.buffer);
            this.vfs.writeFile(this.filepath, encoded);
            this.render();
            this.vga.print("\n[Arquivo Salvo]", this.vga.colors.green, '#0000AA');
            return;
        }

        if (event.key === 'Backspace') {
            this.buffer = this.buffer.slice(0, -1);
            this.render();
            return;
        }

        if (event.key === 'Enter') {
            this.buffer += '\n';
            this.render();
            return;
        }

        if (event.key.length === 1) {
            this.buffer += event.key;
            this.render();
        }
    }
}
