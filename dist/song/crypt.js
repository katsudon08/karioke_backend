"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptTag = exports.decryptSong = exports.encryptTag = exports.encryptSong = void 0;
const crypto_ts_1 = require("crypto-ts");
const encryptSong = (params) => {
    const encryptedTitle = crypto_ts_1.AES.encrypt(params.title, "title").toString();
    const encryptedArtist = crypto_ts_1.AES.encrypt(params.artist, "artist").toString();
    const encryptedRank = crypto_ts_1.AES.encrypt(String(params.rank), "rank").toString();
    const encryptedKey = crypto_ts_1.AES.encrypt(String(params.key), "key").toString();
    const encryptedMemo = crypto_ts_1.AES.encrypt(params.memo, "memo").toString();
    return {
        title: encryptedTitle,
        artist: encryptedArtist,
        rank: encryptedRank,
        key: encryptedKey,
        memo: encryptedMemo
    };
};
exports.encryptSong = encryptSong;
const encryptTag = (param) => {
    const encryptedName = crypto_ts_1.AES.encrypt(param.name, "name").toString();
    return {
        name: encryptedName
    };
};
exports.encryptTag = encryptTag;
const decryptSong = (params) => {
    const decryptedTitle = crypto_ts_1.AES.decrypt(params.title, "title").toString(crypto_ts_1.enc.Utf8);
    const decryptedArtist = crypto_ts_1.AES.decrypt(params.artist, "artist").toString(crypto_ts_1.enc.Utf8);
    const decryptedRank = crypto_ts_1.AES.decrypt(params.rank, "rank").toString(crypto_ts_1.enc.Utf8);
    const decryptedKey = crypto_ts_1.AES.decrypt(params.key, "key").toString(crypto_ts_1.enc.Utf8);
    const decryptedMemo = crypto_ts_1.AES.decrypt(params.memo, "memo").toString(crypto_ts_1.enc.Utf8);
    return {
        id: params.id,
        title: decryptedTitle,
        artist: decryptedArtist,
        rank: Number(decryptedRank),
        key: Number(decryptedKey),
        memo: decryptedMemo
    };
};
exports.decryptSong = decryptSong;
const decryptTag = (param) => {
    const decryptedName = crypto_ts_1.AES.decrypt(param.name, "name").toString(crypto_ts_1.enc.Utf8);
    return {
        id: param.id,
        name: decryptedName
    };
};
exports.decryptTag = decryptTag;
//# sourceMappingURL=crypt.js.map