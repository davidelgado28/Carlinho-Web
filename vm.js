export class VirtualMachine {
    constructor(vga) {
        this.vga = vga;
    }

    execute(executableBytes, onExit) {
        if (!executableBytes || executableBytes.length < 2) {
            this.vga.print("Erro: Arquivo corrompido.\n", this.vga.colors.red);
            onExit();
            return;
        }
        if (executableBytes[0] !== 0x4D || executableBytes[1] !== 0x5A) {
            this.vga.print("Erro: Nao e um executavel Carlinho OS valido (MZ header ausente).\n", this.vga.colors.white);
            onExit();
            return;
        }

        let pc = 2; 
        const executeNext = () => {
            if (pc >= executableBytes.length) {
                onExit();
                return;
            }

            const opcode = executableBytes[pc++];

            switch (opcode) {
                case 0x01: 
                    const charCode = executableBytes[pc++];
                    this.vga.print(String.fromCharCode(charCode), this.vga.colors.white);
                    break;
                case 0x02: 
                    this.vga.clearScreen();
                    break;
                case 0xFF: 
                    this.vga.print("\n[Processo Terminado]\n", this.vga.colors.lightGray);
                    onExit();
                    return;
                default:
                    this.vga.print(`\n[Falha Geral] Opcode desconhecido: ${opcode} em PC=${pc-1}\n`);
                    onExit();
                    return;
            }
            setTimeout(executeNext, 10);
        };
        executeNext();
    }
}
