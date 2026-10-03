import { VGADisplay } from './vga.js';
import { VirtualFileSystem } from './vfs.js';

class Kernel {
    constructor() {
        this.display = new VGADisplay('monitor');
        this.vfs = new VirtualFileSystem();
    }

    bootstrap() {
        this.display.init();
        
        const bg = this.display.colors.darkGray;
        this.display.clearScreen(bg);
        this.display.print("Inicializando Carlinho OS...\n", this.display.colors.lightGray, bg);
        this.display.print("Montando Virtual File System... OK\n", this.display.colors.lightGray, bg);
        this.display.print("Checando memória... OK\n", this.display.colors.lightGray, bg);
        this.display.print("\n", this.display.colors.lightGray, bg);
        this.display.print("Carlinho OS Web v0.1\n", this.display.colors.green, bg);
        this.display.print("=============================================\n", this.display.colors.green, bg);
        this.display.print("> ", this.display.colors.white, bg);
        this.vfs.writeFile('/bin/shell.exe', new Uint8Array([0x4D, 0x5A, 0x00, 0x01])); 
    }
}
const os = new Kernel();
os.bootstrap();
