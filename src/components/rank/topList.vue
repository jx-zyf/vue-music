<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImg" :songs="songs" :rank="rank"></music-list>
    </transition>
</template>
<script>
/* eslint-disable */
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { ERR_OK } from "api/config";
import { getMusicList } from "api/rank";
import { createSong } from "common/js/song";

export default {
  data() {
    return {
      songs: [],
      rank: true,
    };
  },
  computed: {
    ...mapGetters(["topList"]),
    title() {
      return this.topList.topTitle;
    },
    bgImg() {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
    }
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push({
          path: "/rank"
        });
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.initSongs(res.songlist);
        }
      });
    },
    initSongs(list) {
      let ret = [],
        data;
      list.forEach(item => {
        data = item.data;
        if (data.songid && data.albummid) {
          ret.push(createSong(data));
        }
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.slide-enter-active, .slide-leave-active {
    transition: all 0.6s;
}

.slide-enter, .slide-leave-to {
    transform: translate3d(100%, 0, 0);
}
</style>
