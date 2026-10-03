import { VGADisplay } from './vga.js';
import { VirtualFileSystem } from './vfs.js';
import { KeyboardDriver } from './keyboard.js';
import { Shell } from './shell.js';

class Kernel {
    constructor() {
        this.display = new VGADisplay('monitor');
        this.vfs = new VirtualFileSystem();
        this.keyboard = new KeyboardDriver();
        this.shell = new Shell(this.display, this.vfs);
    }
    bootstrap() {
        this.display.init();
        
        const bg = this.display.colors.black; 
        this.display.clearScreen(bg);

        this.display.print("Inicializando Carlinho OS\n", this.display.colors.lightGray, bg);
        this.display.print("Montando VFS... OK\n", this.display.colors.lightGray, bg);
        this.display.print("Carregando drivers de I/O...OK\n\n", this.display.colors.lightGray, bg);
        
        this.display.print("Carlinho OS Web v0.2\n", this.display.colors.green, bg);
        this.display.print("=============================================\n", this.display.colors.green, bg);
        
        this.vfs.writeFile('/bin/shell.exe', new Uint8Array([0x4D, 0x5A, 0x00, 0x01]));
        this.keyboard.onKeyPress = (e) => {
            this.shell.handleInput(e);
        };
        this.shell.start();
    }
}
const os = new Kernel();
os.bootstrap();
