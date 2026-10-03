export class KeyboardDriver {
    constructor() {
        this.onKeyPress = null; 
        this.init();
    }
    init() {
        document.addEventListener('keydown', (e) => {
            if (['Space', 'ArrowUp', 'ArrowDown', 'Backspace'].includes(e.code)) {
                e.preventDefault();
            }

            if (this.onKeyPress) {
                this.onKeyPress(e);
            }
        });
    }
}
