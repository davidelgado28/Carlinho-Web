export class Shell {
    constructor(vga, vfs) {
        this.vga = vga;
        this.vfs = vfs;
        this.inputBuffer = "";
        this.promptStr = "C:\\> ";
        this.bg = this.vga.colors.black; 
    }
    start() {
        this.vga.print(this.promptStr, this.vga.colors.green, this.bg);
    }
    handleInput(event) {
        if (event.key === 'Enter') {
            this.vga.print('\n', this.vga.colors.white, this.bg);
            this.executeCommand(this.inputBuffer.trim());
            this.inputBuffer = "";
            this.vga.print(this.promptStr, this.vga.colors.green, this.bg);
            return;
        }
        if (event.key === 'Backspace') {
            if (this.inputBuffer.length > 0) {
                this.inputBuffer = this.inputBuffer.slice(0, -1);
                this.vga.backspace(this.bg);
            }
            return;
        }
        if (event.key.length === 1) {
            this.inputBuffer += event.key;
            this.vga.print(event.key, this.vga.colors.white, this.bg);
        }
    }
    executeCommand(cmd) {
        if (cmd === "") return;

        const parts = cmd.split(" ");
        const baseCmd = parts[0].toLowerCase();

        switch (baseCmd) {
            case 'clear':
            case 'cls':
                this.vga.clearScreen(this.bg);
                break;
            case 'help':
                this.vga.print("Comandos disponiveis: help, cls, ls, echo\n", this.vga.colors.lightGray, this.bg);
                break;
            case 'echo':
                const msg = parts.slice(1).join(" ");
                this.vga.print(msg + "\n", this.vga.colors.white, this.bg);
                break;
            case 'ls':
            case 'dir':
                this.listDirectory();
                break;
            default:
                this.vga.print(`Comando invalido ou nome de arquivo ruim: ${baseCmd}\n`, this.vga.colors.white, this.bg);
        }
    }
    listDirectory() {
        const root = this.vfs.root;
        this.vga.print("Diretorio de /\n\n", this.vga.colors.lightGray, this.bg);
        
        for (const key in root.children) {
            const node = root.children[key];
            const isDir = node.type === 'dir' ? "<DIR>" : "     ";
            this.vga.print(`${isDir}  ${node.name}\n`, this.vga.colors.white, this.bg);
        }
    }
}
