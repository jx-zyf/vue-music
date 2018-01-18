/* eslint-disable */

import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveLike, deleteLike } from 'common/js/cache'

// 播放选择的歌曲
export const selectPlay = ({ commit, state }, { list, index }) => {
    commit(types.SET_SEQUENCE_LIST, list);
    if (state.mode === playMode.random) {
        let randomList = shuffle(list);
        commit(types.SET_PLAYLIST, randomList);
        index = findIndex(randomList, list[index]);
    } else {
        commit(types.SET_PLAYLIST, list);
    }
    commit(types.SET_CURRENT_INDEX, index);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true)
}

// 随机播放
export const randomPlay = ({ commit }, { list }) => {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list);
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    commit(types.SET_CURRENT_INDEX, 0);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true)
}

function findIndex(list, song) {
    return list.findIndex(item => item.id === song.id)
}

// 插入歌曲
export const insertSong = ({ commit, state }, song) => {
    let playlist = state.playlist.slice(0),
        sequenceList = state.sequenceList.slice(0),
        currentIndex = state.currentIndex;
    // 记录当前歌曲
    let currentSong = playlist[currentIndex];
    // 记录当前歌曲在列表中的索引
    let fpIndex = findIndex(playlist, song);
    // 插入歌曲
    currentIndex++;
    playlist.splice(currentIndex, 0, song);
    // 如果之前列表包含这首歌
    if (fpIndex > -1) {
        // 如果插入的索引大于之前列表的索引，直接删除，并且当前歌曲索引减一
        if (currentIndex > fpIndex) {
            playlist.splice(fpIndex, 1);
            currentIndex--;
        } else {
            // 如果插入的索引小于之前列表的索引，原歌曲索引会加一
            playlist.splice(fpIndex + 1, 1);
        }
    }

    // 新插入歌曲在sequenceList中的索引
    let curSIndex = findIndex(sequenceList, currentSong) + 1;
    let fsIndex = findIndex(sequenceList, song);
    sequenceList.splice(curSIndex, 0, song);
    if (fsIndex > -1) {
        if (curSIndex > fsIndex) {
            sequenceList.splice(fsIndex, 1);
        } else {
            sequenceList.splice(fsIndex + 1, 1);
        }
    }

    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);
    commit(types.SET_FULL_SCREEN, true);
    commit(types.SET_PLAYING_STATE, true)
}

// 保存搜索历史
export const saveSearchHistory = ({ commit }, query) => {
    commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

// 删除一条搜索历史
export const deleteSearchHistory = ({ commit }, query) => {
    commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

// 清空搜索历史
export const clearSearchHistory = ({ commit }) => {
    commit(types.SET_SEARCH_HISTORY, clearSearch())
}

// 删除歌曲
export const deleteSong = ({ commit, state }, song) => {
    let playlist = state.playlist.slice(0),
        sequenceList = state.sequenceList.slice(0),
        currentIndex = state.currentIndex;
    let pIndex = findIndex(playlist, song);
    playlist.splice(pIndex, 1);
    let sIndex = findIndex(sequenceList, song);
    if (!state.playing) {
        // 暂停状态下删除当前播放歌曲
        if (currentIndex === sIndex) {
            commit(types.SET_PLAYING_STATE, true);
        }
    }
    sequenceList.splice(sIndex, 1);

    if (currentIndex > pIndex || currentIndex === playlist.length) {
        currentIndex--
    }


    commit(types.SET_PLAYLIST, playlist);
    commit(types.SET_SEQUENCE_LIST, sequenceList);
    commit(types.SET_CURRENT_INDEX, currentIndex);

    if (!playlist.length) {
        commit(types.SET_PLAYING_STATE, false);
    }
}

// 清空播放列表
export const clearSongList = ({ commit }) => {
    commit(types.SET_PLAYLIST, [])
    commit(types.SET_SEQUENCE_LIST, [])
    commit(types.SET_CURRENT_INDEX, -1)
    commit(types.SET_PLAYING_STATE, false)
}

// 保存播放记录
export const savePlayHistory = ({ commit }, song) => {
    commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 收藏
export const saveLikeList = ({ commit }, song) => {
    commit(types.SET_LIKE_LIST, saveLike(song))
}

export const deleteLikeList = ({ commit }, song) => {
    commit(types.SET_LIKE_LIST, deleteLike(song))
}