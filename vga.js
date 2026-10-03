    newLine() {
        this.cursorX = 0;
        this.cursorY++;
        
        if (this.cursorY >= this.rows) {
            this.scroll();
            this.cursorY = this.rows - 1; 
        }
    }
    scroll() {
        for (let y = 1; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const sourceIndex = y * this.cols + x;
                const destIndex = (y - 1) * this.cols + x;
                this.videoMemory[destIndex] = { ...this.videoMemory[sourceIndex] };
            }
        }
        const lastRowStart = (this.rows - 1) * this.cols;
        for (let x = 0; x < this.cols; x++) {
            this.videoMemory[lastRowStart + x] = { char: ' ', fg: this.colors.white, bg: this.colors.black };
        }
        this.renderAll();
    }
    backspace(bgColor = this.colors.black) {
        if (this.cursorX > 0) {
            this.cursorX--;
        } else if (this.cursorY > 0) {
            this.cursorY--;
            this.cursorX = this.cols - 1;
        }
        
        const index = this.cursorY * this.cols + this.cursorX;
        this.videoMemory[index] = { char: ' ', fg: this.colors.white, bg: bgColor };
        this.renderCell(this.cursorX, this.cursorY);
    }
