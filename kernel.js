import { VGADisplay } from './vga.js';
import { VirtualFileSystem } from './vfs.js';
import { KeyboardDriver } from './keyboard.js';
import { Shell } from './shell.js';
import { VirtualMachine } from './vm.js';
import { Editor } from './editor.js';
import { TextBrowser } from './browser.js';

class Kernel {
    constructor() {
        this.display = new VGADisplay('monitor');
        this.vfs = new VirtualFileSystem();
        this.keyboard = new KeyboardDriver();
        this.vm = new VirtualMachine(this.display);
        this.shell = new Shell(this.display, this.vfs);

        this.activeProcess = 'shell';
        const returnToShell = () => {
            this.activeProcess = 'shell';
            this.shell.start();
        };

        this.editor = new Editor(this.display, this.vfs, returnToShell);
        this.browser = new TextBrowser(this.display, returnToShell);
        this.shell.onAppLaunch = (appName, args) => {
            this.activeProcess = appName;
            if (appName === 'editor') this.editor.open(args);
            if (appName === 'browser') this.browser.navigate(args);
            if (appName === 'vm') this.vm.execute(args, returnToShell);
        };
    }

    bootstrap() {
        this.display.init();
        const bg = this.display.colors.black; 
        
        const sampleCode = "CLEAR\nPRINT C\nPRINT A\nPRINT R\nHALT";
        this.vfs.writeFile('/home/codigo.src', new TextEncoder().encode(sampleCode));

        this.display.clearScreen(bg);
        this.display.print("Carlinho OS Web v1.0 - Sistema Completo\n", this.display.colors.green, bg);
        this.display.print("Digite 'edit /home/codigo.src' ou 'web http://example.com'\n", this.display.colors.lightGray, bg);
        this.display.print("Para compilar: 'compile /home/codigo.src /bin/app.exe'\n", this.display.colors.lightGray, bg);
        this.display.print("Para executar: 'exec /bin/app.exe'\n", this.display.colors.lightGray, bg);
        this.display.print("========================================================\n", this.display.colors.green, bg);
        this.keyboard.onKeyPress = (e) => {
            if (this.activeProcess === 'shell') this.shell.handleInput(e);
            else if (this.activeProcess === 'editor') this.editor.handleInput(e);
            else if (this.activeProcess === 'browser') this.browser.handleInput(e);
        };

        this.shell.start();
    }
}
const os = new Kernel();
os.bootstrap();
