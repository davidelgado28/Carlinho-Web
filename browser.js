export class TextBrowser {
    constructor(vga, onExit) {
        this.vga = vga;
        this.onExit = onExit;
        this.active = false;
    }

    async navigate(url) {
        this.active = true;
        this.vga.clearScreen();
        this.vga.print(` Carlinho Web - Navegando para: ${url} [ESC para Sair]\n`, this.vga.colors.black, this.vga.colors.lightGray);
        this.vga.print("-".repeat(this.vga.cols) + "\n", this.vga.colors.lightGray);

        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
            const data = await response.json();
            const textContent = data.contents.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                                             .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                                             .replace(/<[^>]+>/g, ' ')
                                             .replace(/\s+/g, ' ')
                                             .trim();

            const preview = textContent.substring(0, 1500); 
            this.vga.print("\n" + preview + "\n...", this.vga.colors.white);
            
        } catch (error) {
            this.vga.print(`\nErro de Resolucao de Host ou CORS.`, this.vga.colors.red);
        }
    }

    handleInput(event) {
        if (event.key === 'Escape') {
            this.active = false;
            this.vga.clearScreen();
            this.onExit();
        }
    }
}
