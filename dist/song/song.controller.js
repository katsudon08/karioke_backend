"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongController = void 0;
const common_1 = require("@nestjs/common");
const song_service_1 = require("./song.service");
const tag_service_1 = require("./tag.service");
const tagmap_service_1 = require("./tagmap.service");
const crypto_ts_1 = require("crypto-ts");
const crypt_1 = require("./crypt");
let SongController = class SongController {
    constructor(songService, tagService, tagMapService) {
        this.songService = songService;
        this.tagService = tagService;
        this.tagMapService = tagMapService;
    }
    async getAll() {
        const result = {
            songs: (await this.songService.songs()).sort((a, b) => a.id - b.id),
            tags: (await this.tagService.tags()).sort((a, b) => a.id - b.id),
            tagMaps: (await this.tagMapService.tagMaps()).sort((a, b) => a.id - b.id)
        };
        return result;
    }
    async getDecryptedAll() {
        const encryptedSongs = (await this.songService.songs()).sort((a, b) => a.id - b.id);
        const encryptedTags = (await this.tagService.tags()).sort((a, b) => a.id - b.id);
        const tagMaps = (await this.tagMapService.tagMaps()).sort((a, b) => a.id - b.id);
        const decryptedSongs = [...encryptedSongs].map(song => (0, crypt_1.decryptSong)(song));
        const decryptedTags = [...encryptedTags].map(tag => (0, crypt_1.decryptTag)(tag));
        const result = {
            songs: decryptedSongs,
            tags: decryptedTags,
            tagMaps: tagMaps
        };
        return result;
    }
    async crypto() {
        const getSong = await this.songService.song({
            id: 8
        });
        const encryptedTitle = crypto_ts_1.AES.encrypt(getSong.title, "title").toString();
        const encryptedArtist = crypto_ts_1.AES.encrypt(getSong.artist, "artist").toString();
        const encryptedRank = crypto_ts_1.AES.encrypt(String(getSong.rank), "rank").toString();
        const encryptedKey = crypto_ts_1.AES.encrypt(String(getSong.key), "key").toString();
        const encryptedMemo = crypto_ts_1.AES.encrypt(getSong.memo, "memo").toString();
        console.log(encryptedTitle);
        return {
            "title": encryptedTitle,
            "artist": encryptedArtist,
            "rank": encryptedRank,
            "key": encryptedKey,
            "memo": encryptedMemo
        };
    }
    async getSongs() {
        const encryptedSongs = (await this.songService.songs()).sort((a, b) => a.id - b.id);
        const decryptedSongs = [...encryptedSongs].map(song => (0, crypt_1.decryptSong)(song));
        console.log(decryptedSongs);
        return decryptedSongs;
    }
    async getTags() {
        const encryptedTags = (await this.tagService.tags()).sort((a, b) => a.id - b.id);
        const decryptedTags = [...encryptedTags].map(tag => (0, crypt_1.decryptTag)(tag));
        const tags = [...decryptedTags].map(tag => tag.name);
        return tags;
    }
    async getTagOnIds() {
        const encryptedTags = (await this.tagService.tags()).sort((a, b) => a.id - b.id);
        const decryptedTags = [...encryptedTags].map(tag => (0, crypt_1.decryptTag)(tag));
        return decryptedTags;
    }
    async getSongIds() {
        const ids = [...await this.songService.songs()].map(song => song.id);
        const sortedIds = [...ids].sort();
        return sortedIds;
    }
    async getTagIds() {
        const ids = [...await this.tagService.tags()].map(tag => tag.id);
        const sortedIds = [...ids].sort();
        return sortedIds;
    }
    async getTagMapIds() {
        const ids = [...await this.tagMapService.tagMaps()].map(tag => tag.id);
        const sortedIds = [...ids].sort();
        return sortedIds;
    }
    async getTagMap() {
        const tagmaps = (await this.tagMapService.tagMaps()).sort((a, b) => a.id - b.id);
        return tagmaps;
    }
    async createSong(params) {
        console.log(params);
        const tags = [...await this.tagService.tags()].map(tag => (0, crypt_1.decryptTag)(tag));
        console.log("tags", tags);
        const newTags = [...tags].filter(tag => params.tags.includes(tag.name));
        console.log("newtags", newTags);
        const tagIds = [...newTags].map(tag => tag.id);
        console.log("tagids", tagIds);
        const encryptedSong = (0, crypt_1.encryptSong)(params);
        const song = await this.songService.createSong(encryptedSong);
        console.log(song);
        for await (const id of tagIds) {
            await this.tagMapService.createTagMap({
                songId: song.id,
                tagId: id
            });
        }
        return "succeed";
    }
    async createTag(param) {
        console.log(param);
        console.log(param.name);
        const encryptedName = (0, crypt_1.encryptTag)(param);
        return this.tagService.createTag(encryptedName);
    }
    async updateSong(params) {
        console.log(params);
        const encryptedSong = (0, crypt_1.encryptSong)(params.data);
        const tagmaps = await this.tagMapService.tagMaps();
        const newTagMaps = [...tagmaps].filter(tagmap => tagmap.songId === params.data.id);
        newTagMaps.map(tagmap => {
            this.tagMapService.deleteTagMap({
                id: tagmap.id
            });
        });
        params.tagIds.map(id => {
            this.tagMapService.createTagMap({
                songId: params.data.id,
                tagId: id
            });
        });
        return this.songService.updateSong({
            where: {
                id: params.data.id
            },
            data: encryptedSong
        });
    }
    async updateTag(params) {
        console.log(params);
        const encryptedName = (0, crypt_1.encryptTag)(params.data);
        return this.tagService.updateTag({
            where: {
                id: params.data.id
            },
            data: encryptedName
        });
    }
    async deleteSong(param) {
        console.log(param);
        const tagmaps = await this.tagMapService.tagMaps();
        const filterTagmaps = [...tagmaps].filter(tagmap => tagmap.songId === param.id);
        if (filterTagmaps.length !== 0) {
            filterTagmaps.map(async (tagmap) => {
                await this.tagMapService.deleteTagMap({
                    id: tagmap.id
                });
            });
        }
        return this.songService.deleteSong({
            id: param.id
        });
    }
    async deleteTag(param) {
        console.log(param);
        return this.tagService.deleteTag({
            id: param.id
        });
    }
    async deleteSongs() {
        await this.songService.deleteSongs();
        await this.tagMapService.deleteTagMaps();
        console.log("succeeded");
        return "succeeded";
    }
    async deleteTagSongs(param) {
        console.log("slug: ", param.slug);
        const tagOnIds = await this.tagService.tags();
        const decryptedTags = [...tagOnIds].map(tag => (0, crypt_1.decryptTag)(tag));
        console.log("tagOnIds", decryptedTags);
        const filterTags = [...decryptedTags].filter(tag => tag.name === param.slug);
        console.log(filterTags);
        if (filterTags.length === 0) {
            return "not delete 1";
        }
        const filterTagId = [...filterTags].map(tag => tag.id)[0];
        const tagmaps = await this.tagMapService.tagMaps();
        const filterTagmaps = [...tagmaps].filter(tag => tag.tagId === filterTagId);
        console.log(filterTagmaps);
        if (filterTagmaps.length !== 0) {
            filterTagmaps.map(async (tagmap) => {
                await this.tagMapService.deleteTagMap({
                    id: tagmap.id
                });
            });
        }
        await this.tagService.deleteTag({
            id: filterTagId
        });
        return "succeeded";
    }
    async deleteAll() {
        await this.songService.deleteSongs();
        await this.tagService.deleteTags();
        await this.tagMapService.deleteTagMaps();
        return "succeeded";
    }
};
exports.SongController = SongController;
__decorate([
    (0, common_1.Get)("test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)("testDecrypted"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getDecryptedAll", null);
__decorate([
    (0, common_1.Get)("crypto"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "crypto", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getSongs", null);
__decorate([
    (0, common_1.Get)("tag"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getTags", null);
__decorate([
    (0, common_1.Get)("tagOnId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getTagOnIds", null);
__decorate([
    (0, common_1.Get)("id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getSongIds", null);
__decorate([
    (0, common_1.Get)("tagId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getTagIds", null);
__decorate([
    (0, common_1.Get)("tagmapId"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getTagMapIds", null);
__decorate([
    (0, common_1.Get)("tagmap"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "getTagMap", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "createSong", null);
__decorate([
    (0, common_1.Post)("tag"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "createTag", null);
__decorate([
    (0, common_1.Put)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "updateSong", null);
__decorate([
    (0, common_1.Put)("tag"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "updateTag", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "deleteSong", null);
__decorate([
    (0, common_1.Delete)("tag"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "deleteTag", null);
__decorate([
    (0, common_1.Delete)("home"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "deleteSongs", null);
__decorate([
    (0, common_1.Delete)("slug"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "deleteTagSongs", null);
__decorate([
    (0, common_1.Delete)("test"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SongController.prototype, "deleteAll", null);
exports.SongController = SongController = __decorate([
    (0, common_1.Controller)('song'),
    __metadata("design:paramtypes", [song_service_1.SongService,
        tag_service_1.TagService,
        tagmap_service_1.TagMapService])
], SongController);
//# sourceMappingURL=song.controller.js.map