export class VirtualFileSystem {
    constructor(dbName = "CarlinhoOS_VFS", storeName = "filesystem") {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
        this.root = {
            type: 'dir',
            name: '/',
            children: {}
        };
    }
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onerror = (event) => {
                console.error("Erro ao abrir IndexedDB:", event.target.error);
                reject(event.target.error);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName);
                }
            };

            request.onsuccess = async (event) => {
                this.db = event.target.result;
                await this._loadFromDisk();
                resolve();
            };
        });
    }
    async _loadFromDisk() {
        return new Promise((resolve) => {
            const transaction = this.db.transaction([this.storeName], "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.openCursor();

            let hasFiles = false;

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    hasFiles = true;
                    const path = cursor.key;
                    const fileNode = cursor.value;
                    this._injectIntoMemory(path, fileNode);
                    cursor.continue();
                } else {
                    if (!hasFiles) {
                        this._seedDefaultFiles();
                    }
                    resolve();
                }
            };
        });
    }
    _injectIntoMemory(path, fileNode) {
        const parts = path.split('/').filter(p => p.length > 0);
        const fileName = parts.pop();
        let current = this.root;

        for (const part of parts) {
            if (!current.children[part]) {
                current.children[part] = { type: 'dir', name: part, children: {} };
            }
            current = current.children[part];
        }
        current.children[fileName] = fileNode;
    }
    async _seedDefaultFiles() {
        this.createDir('/bin');
        this.createDir('/home');
        this.createDir('/sys');
        
        await this.writeFile('/bin/shell.exe', new Uint8Array([0x4D, 0x5A, 0x00, 0x01]));
        const sampleCode = "CLEAR\nPRINT C\nPRINT A\nPRINT R\nHALT";
        await this.writeFile('/home/codigo.src', new TextEncoder().encode(sampleCode));
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
    async writeFile(path, data) {
        const parts = path.split('/').filter(p => p.length > 0);
        const fileName = parts.pop();
        const dirPath = '/' + parts.join('/');
        
        let dirNode = this._resolvePath(dirPath);
        if (!dirNode) {
            this.createDir(dirPath);
            dirNode = this._resolvePath(dirPath);
        }
        const fileNode = {
            type: 'file',
            name: fileName,
            data: data,
            timestamp: Date.now()
        };
        dirNode.children[fileName] = fileNode;

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([this.storeName], "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.put(fileNode, path);

            request.onsuccess = () => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }
    readFile(path) {
        const fileNode = this._resolvePath(path);
        if (!fileNode || fileNode.type !== 'file') {
            throw new Error(`Arquivo não encontrado: ${path}`);
        }
        return fileNode.data;
    }
}
