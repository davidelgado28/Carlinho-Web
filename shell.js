case 'edit':
    const editPath = parts[1];
    if (!editPath) { this.vga.print("Uso: edit /caminho/arquivo.txt\n"); break; }
    this.onAppLaunch('editor', editPath);
    return; 

case 'web':
    const url = parts[1] || 'http://example.com';
    this.onAppLaunch('browser', url);
    return; 

case 'compile': 
    const srcPath = parts[1];
    const binPath = parts[2];
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
        this.vga.print(`Compilado com sucesso: ${binPath}\n`);
    } catch {
        this.vga.print("Erro de compilacao.\n");
    }
    break;

case 'exec': 
    const exePath = parts[1];
    try {
        const binData = this.vfs.readFile(exePath);
        this.onAppLaunch('vm', binData);
        return; 
    } catch {
        this.vga.print("Executavel nao encontrado.\n");
    }
    break;
