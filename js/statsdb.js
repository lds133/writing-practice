
const DB_NAME = "WPLoggerDB"

function DB_open() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 2);

        req.onupgradeneeded = (e) => {
            const db = e.target.result;

            if (!db.objectStoreNames.contains("rows")) {
                const store = db.createObjectStore("rows", {
                    keyPath: "id",
                    autoIncrement: true
                });

                store.createIndex("date", "date");
                store.createIndex("file", "file");
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}


async function DB_append(url, index, length, stats) {

    const db = await DB_open();
    const tx = db.transaction("rows", "readwrite");
    const store = tx.objectStore("rows");

    store.add({
        date: new Date(),
        file: url,
        index,
        length,
        ok: stats.ok,
        error: stats.error,
        hint: stats.hint,
        time: stats.seconds()
    });

    return tx.complete;
}


async function DB_getall() {
    const db = await DB_open();
    const tx = db.transaction("rows", "readonly");
    const store = tx.objectStore("rows");

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const rows = request.result.map(({ id, ...rest }) => rest);
            resolve(rows);
        };

        request.onerror = () => reject(request.error);
    });
}





