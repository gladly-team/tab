const localStorageMgr = {};

localStorageMgr.setItem = function(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.log('localStorage not supported. ', e);
    }
};

localStorageMgr.getItem = function(key) {
    try {
        var value = localStorage.getItem(key);
        return value;
    } catch (e) {
        console.log('localStorage not supported. ', e);
        return null;
    }
};

localStorageMgr.removeItem = function(key) {
    try {
        localStorage.removeItem(key);
    } catch (e) {
        console.log('localStorage not supported. ', e);
    }
};

export default localStorageMgr;