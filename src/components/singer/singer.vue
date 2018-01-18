<template>
  <div class="singer" ref="singer">
    <view-list @select="select" :data="singerList" ref="list"></view-list>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
/* eslint-disable */
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import ViewList from "base/viewList";
import { mapMutations } from "vuex";
import * as types from "../../store/mutation-types";
import { playlistMixin } from "common/js/mixin";

const HOT_NAME = "热门";
const HOT_SINGER_LEN = 10;

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerList: []
    };
  },
  mounted() {
    this._getSingerList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    _getSingerList() {
      getSingerList().then(res => {
        this.singerList = this._sortSingerList(res.data.list);
      });
    },
    _sortSingerList(list) {
      let singers = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        const key = item.Findex;
        if (index < HOT_SINGER_LEN) {
          singers.hot.items.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        if (!singers[key]) {
          singers[key] = {
            title: key,
            items: []
          };
        }
        singers[key].items.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });

      let hot = [],
        ret = [];
      for (let key in singers) {
        if (singers[key].title === HOT_NAME) {
          hot.push(singers[key]);
        } else {
          ret.push(singers[key]);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return [...hot, ...ret];
    },
    select(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    ...mapMutations({
      setSinger: types.SET_SINGER
    })
  },
  components: {
    ViewList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>