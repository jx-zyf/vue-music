<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImg" :songs="songs"></music-list>
    </transition>
</template>
<script>
/* eslint-disable */
import MusicList from "components/music-list/music-list";
import { mapGetters } from "vuex";
import { getSongList } from "api/recommend";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";

export default {
  data() {
    return {
      songs: []
    };
  },
  computed: {
    ...mapGetters(["disc"]),
    title() {
      return this.disc.dissname;
    },
    bgImg() {
      return this.disc.imgurl;
    }
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push("/recommend");
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this.initSongs(res.cdlist[0].songlist);
        }
      });
    },
    initSongs(list) {
      let ret = [];
      list.forEach(item => {
        if (item.songid && item.albummid) {
          ret.push(createSong(item));
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
