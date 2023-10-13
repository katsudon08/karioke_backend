import { AES } from "crypto-ts"

export const encryptSong = (params: {
    title: string,
    artist: string,
    rank: number,
    key: number,
    memo: string
}): {
    title: string,
    artist: string,
    rank: string,
    key: string,
    memo: string
} => {
    const encryptedTitle = AES.encrypt(params.title, "title").toString()
    const encryptedArtist = AES.encrypt(params.artist, "artist").toString()
    const encryptedRank = AES.encrypt(String(params.rank), "rank").toString()
    const encryptedKey = AES.encrypt(String(params.key), "key").toString()
    const encryptedMemo = AES.encrypt(params.memo, "memo").toString()

    return {
        title: encryptedTitle,
        artist: encryptedArtist,
        rank: encryptedRank,
        key: encryptedKey,
        memo: encryptedMemo
    }
}

export const encryptTag = (param: {
    name: string
}) => {
    const encryptedName = AES.encrypt(param.name, "name").toString()

    return {
        name: encryptedName
    }
}