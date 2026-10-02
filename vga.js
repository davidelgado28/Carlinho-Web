export class VGADisplay {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.cols = 80;
        this.rows = 25;
        this.charWidth = 10;  
        this.charHeight = 20; 
        this.canvas.width = this.cols * this.charWidth;
        this.canvas.height = this.rows * this.charHeight;
        this.cursorX = 0;
        this.cursorY = 0;
        this.colors = {
            black: '#000000',
            darkGray: '#1E1E1E',
            lightGray: '#A9A9A9',
            white: '#FFFFFF',
            green: '#00FF00' 
        };

        this.videoMemory = new Array(this.cols * this.rows).fill(null).map(() => ({
            char: ' ',
            fg: this.colors.lightGray,
            bg: this.colors.black
        }));
    }
    init() {
        this.ctx.font = `${this.charHeight}px monospace`;
        this.ctx.textBaseline = 'top';
        this.clearScreen(this.colors.darkGray);
    }
    clearScreen(bgColor = this.colors.black) {
        for (let i = 0; i < this.videoMemory.length; i++) {
            this.videoMemory[i] = { char: ' ', fg: this.colors.white, bg: bgColor };
        }
        this.cursorX = 0;
        this.cursorY = 0;
        this.renderAll();
    }
    renderAll() {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                this.renderCell(x, y);
            }
        }
    }
    renderCell(x, y) {
        const index = y * this.cols + x;
        const cell = this.videoMemory[index];
        
        this.ctx.fillStyle = cell.bg;
        this.ctx.fillRect(x * this.charWidth, y * this.charHeight, this.charWidth, this.charHeight);
        
        if (cell.char !== ' ') {
            this.ctx.fillStyle = cell.fg;
            this.ctx.fillText(cell.char, x * this.charWidth, y * this.charHeight);
        }
    }
    print(text, fgColor = this.colors.white, bgColor = this.colors.black) {
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            
            if (char === '\n') {
                this.newLine();
                continue;
            }
            const index = this.cursorY * this.cols + this.cursorX;
            this.videoMemory[index] = { char, fg: fgColor, bg: bgColor };
            this.renderCell(this.cursorX, this.cursorY);

            this.cursorX++;
            if (this.cursorX >= this.cols) {
                this.newLine();
            }
        }
    }
    newLine() {
        this.cursorX = 0;
        this.cursorY++;
    }
}
