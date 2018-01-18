/* eslint-disable */
import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

const PlAY_KEY = '__play__'
const PLAY_MAX_LEN = 100

const LIKE_KEY = '__like__'
// const LIKE_MAX_LENGTH = 200

function insertArr(arr, val, fun, maxLen) {
    let index = arr.findIndex(fun)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (maxLen && arr.length > maxLen) {
        arr.pop()
    }
}

function deleteArr(arr, fun) {
    let index = arr.findIndex(fun)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

// 搜索历史
// 保存
export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArr(searches, query, item => item === query, SEARCH_MAX_LEN)
    storage.set(SEARCH_KEY, searches)
    return searches
}

// 页面加载时读取
export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

// 删除一项
export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteArr(searches, item => item === query)
    storage.set(SEARCH_KEY, searches)
    return searches
}

// 删除全部
export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

// 播放历史
// 保存
export function savePlay(song) {
    let songs = storage.get(PlAY_KEY, [])
    insertArr(songs, song, item => item.id === song.id, PLAY_MAX_LEN)
    storage.set(PlAY_KEY, songs)
    return songs
}

// 页面加载时读取
export function loadPlay() {
    return storage.get(PlAY_KEY, [])
}

// 收藏
// 添加
export function saveLike(song) {
    let songs = storage.get(LIKE_KEY, [])
    insertArr(songs, song, item => item.id === song.id)
    storage.set(LIKE_KEY, songs)
    return songs
}

// 取消
export function deleteLike(song) {
    let songs = storage.get(LIKE_KEY, [])
    deleteArr(songs, item => item.id === song.id)
    storage.set(LIKE_KEY, songs)
    return songs
}

// 页面加载
export function loadLike() {
    return storage.get(LIKE_KEY, [])
}