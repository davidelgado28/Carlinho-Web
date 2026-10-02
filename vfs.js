export class VirtualFileSystem {
    constructor() {
        this.root = {
            type: 'dir',
            name: '/',
            children: {}
        };
        this.createDir('/bin');
        this.createDir('/home');
        this.createDir('/sys');
    }

    _resolvePath(path) {
        if (path === '/') return this.root;
        const parts = path.split('/').filter(p => p.length > 0);
        let current = this.root;

        for (const part of parts) {
            if (current.type !== 'dir' || !current.children[part]) {
                return null; 
            }
            current = current.children[part];
        }
        return current;
    }
    createDir(path) {
        const parts = path.split('/').filter(p => p.length > 0);
        let current = this.root;

        for (const part of parts) {
            if (!current.children[part]) {
                current.children[part] = { type: 'dir', name: part, children: {} };
            }
            current = current.children[part];
        }
    }
    writeFile(path, data) {
        const parts = path.split('/').filter(p => p.length > 0);
        const fileName = parts.pop();
        const dirPath = '/' + parts.join('/');
        
        const dirNode = this._resolvePath(dirPath);
        if (!dirNode || dirNode.type !== 'dir') {
            throw new Error(`Diretório não encontrado para gravar: ${path}`);
        }

        dirNode.children[fileName] = {
            type: 'file',
            name: fileName,
            data: data,
            timestamp: Date.now()
        };
    }

    readFile(path) {
        const fileNode = this._resolvePath(path);
        if (!fileNode || fileNode.type !== 'file') {
            throw new Error(`Arquivo não encontrado: ${path}`);
        }
        return fileNode.data;
    }
}
