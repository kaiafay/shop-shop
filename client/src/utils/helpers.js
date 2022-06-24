export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference 
    let db, tx, store;

    // if version changes
    request.onupgradeneeded = function(e) {
      const db = request.result;
      // create object store
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle errors with connecting 
    request.onerror = function(e) {
      console.log('There was an error.');
    };

    // on database open success
    request.onsuccess = function(e) {
      // save reference of the database
      db = request.result;
      // open a transaction
      tx = db.transaction(storeName, 'readwrite');
      // save reference to object store
      store = tx.objectStore(storeName);

      db.onerror = function(e) {
        console.log('error', e);
      };

      switch(method) {
        case 'put':
          store.put(object);
          resolve(object);
          break;
        case 'get':
          const all = store.getAll();
          all.onsuccess = function() {
            resolve(all.result);
          };
          break;
        case 'delete':
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // when the transaction is complete, close the connection
      tx.oncomplete = function() {
        db.close();
      };
    };
  });
}
