export class Shell {
    constructor(vga, vfs) {
        this.vga = vga;
        this.vfs = vfs;
        this.inputBuffer = "";
        this.promptStr = "C:\\> ";
        this.bg = this.vga.colors.black;
        this.onAppLaunch = null; 
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
                this.vga.print("Comandos: help, cls, ls, echo, edit, web, compile, exec\n", this.vga.colors.lightGray, this.bg);
                break;
            case 'echo':
                const msg = parts.slice(1).join(" ");
                this.vga.print(msg + "\n", this.vga.colors.white, this.bg);
                break;
            case 'ls':
            case 'dir':
                this.listDirectory();
                break;
            case 'edit':
                const editPath = parts[1];
                if (!editPath) { 
                    this.vga.print("Uso: edit /caminho/arquivo.txt\n", this.vga.colors.white, this.bg); 
                    break; 
                }
                if (this.onAppLaunch) this.onAppLaunch('editor', editPath);
                return;
            case 'web':
                const url = parts[1] || 'http://example.com';
                if (this.onAppLaunch) this.onAppLaunch('browser', url);
                return;
            case 'compile':
                const srcPath = parts[1];
                const binPath = parts[2];
                if (!srcPath || !binPath) {
                    this.vga.print("Uso: compile /origem.src /destino.exe\n", this.vga.colors.white, this.bg);
                    break;
                }
                try {
                    const srcData = new TextDecoder().decode(this.vfs.readFile(srcPath));
                    const lines = srcData.split('\n');
                    let bytecode = [0x4D, 0x5A]; 
                    
                    lines.forEach(line => {
                        const tokens = line.trim().split(' ');
                        if (tokens[0] === 'PRINT') {
                            bytecode.push(0x01);
                            bytecode.push(tokens[1].charCodeAt(0));
                        } else if (tokens[0] === 'CLEAR') {
                            bytecode.push(0x02);
                        } else if (tokens[0] === 'HALT') {
                            bytecode.push(0xFF);
                        }
                    });
                    
                    this.vfs.writeFile(binPath, new Uint8Array(bytecode));
                    this.vga.print(`Compilado com sucesso: ${binPath}\n`, this.vga.colors.green, this.bg);
                } catch (err) {
                    this.vga.print("Erro de compilacao.\n", this.vga.colors.red, this.bg);
                }
                break;
            case 'exec':
                const exePath = parts[1];
                if (!exePath) {
                    this.vga.print("Uso: exec /caminho/arquivo.exe\n", this.vga.colors.white, this.bg);
                    break;
                }
                try {
                    const binData = this.vfs.readFile(exePath);
                    if (this.onAppLaunch) this.onAppLaunch('vm', binData);
                    return;
                } catch (err) {
                    this.vga.print("Executavel nao encontrado.\n", this.vga.colors.red, this.bg);
                }
                break;
            default:
                this.vga.print(`Comando invalido: ${baseCmd}\n`, this.vga.colors.white, this.bg);
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
