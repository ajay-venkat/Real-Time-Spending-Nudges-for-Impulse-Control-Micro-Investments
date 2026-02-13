import fs from 'fs';
import path from 'path';

class LocalStorage {
    constructor(filename) {
        this.filename = path.join(__dirname, filename);
        this.ensureFileExists();
    }

    ensureFileExists() {
        if (!fs.existsSync(this.filename)) {
            fs.writeFileSync(this.filename, JSON.stringify({}), 'utf8');
        }
    }

    setItem(key, value) {
        const data = this.getData();
        data[key] = value;
        this.saveData(data);
    }

    getItem(key) {
        const data = this.getData();
        return data[key] || null;
    }

    removeItem(key) {
        const data = this.getData();
        delete data[key];
        this.saveData(data);
    }

    getData() {
        const rawData = fs.readFileSync(this.filename, 'utf8');
        return JSON.parse(rawData);
    }

    saveData(data) {
        fs.writeFileSync(this.filename, JSON.stringify(data, null, 2), 'utf8');
    }
}

export default LocalStorage;