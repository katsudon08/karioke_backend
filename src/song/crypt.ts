import { Song, Tag } from "@prisma/client"
import { AES, enc } from "crypto-ts"

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
}): {
    name: string
} => {
    const encryptedName = AES.encrypt(param.name, "name").toString()

    return {
        name: encryptedName
    }
}

export const decryptSong = (params: Song): {
    id: number,
    title: string,
    artist: string,
    rank: number,
    key: number,
    memo: string
} => {
    const decryptedTitle = AES.decrypt(params.title, "title").toString(enc.Utf8)
    const decryptedArtist = AES.decrypt(params.artist, "artist").toString(enc.Utf8)
    const decryptedRank = AES.decrypt(params.rank, "rank").toString(enc.Utf8)
    const decryptedKey = AES.decrypt(params.key, "key").toString(enc.Utf8)
    const decryptedMemo = AES.decrypt(params.memo, "memo").toString(enc.Utf8)

    return {
        id: params.id,
        title: decryptedTitle,
        artist: decryptedArtist,
        rank: Number(decryptedRank),
        key: Number(decryptedKey),
        memo: decryptedMemo
    }
}

export const decryptTag = (param: Tag): {
    id: number,
    name: string
} => {
    const decryptedName = AES.decrypt(param.name, "name").toString(enc.Utf8)

    return {
        id: param.id,
        name: decryptedName
    }
}