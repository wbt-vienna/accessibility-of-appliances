let localStorageService = {};
let KEY_PASSWORD = 'AOA_KEY_PASSWORD';
let KEY_USERNAME = 'AOA_KEY_USERNAME';
let storage = null;

if (typeof (Storage) !== "undefined") {
    try {
        storage = window.localStorage;
    } catch (e) {
        log.error('could not access local storage, maybe disabled by user? Error: ' + e)
    }

}

localStorageService.save = function (key, value) {
    if (storage) {
        try {
            return storage.setItem(key, value);
        } catch (e) {
            log.error(e)
        }
    }
};

localStorageService.get = function (key) {
    if (storage) {
        try {
            return storage.getItem(key);
        } catch (e) {
            log.error(e)
        }
    }
};

localStorageService.remove = function (key) {
    if (storage) {
        try {
            return storage.removeItem(key);
        } catch (e) {
            log.error(e)
        }
    }
};

localStorageService.savePassword = function (password) {
    return localStorageService.save(KEY_PASSWORD, password);
};

localStorageService.getPassword = function () {
    return localStorageService.get(KEY_PASSWORD);
};

/**
 * saves the name of the user who created the last entry
 * @param username
 * @return {void | undefined}
 */
localStorageService.saveUser = function (username) {
    return localStorageService.save(KEY_USERNAME, username);
};

/**
 * gets the name of the user who created the last entry
 * @return {string | undefined}
 */
localStorageService.getUser = function () {
    return localStorageService.get(KEY_USERNAME) || "";
};


export {localStorageService};