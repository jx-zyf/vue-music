<template>
  <scroll class="listview" 
          :data="data" 
          ref="listview"
          :listen-scroll="true"
          :probe-type=3
          @scroll="scroll"
  >
      <ul>
          <li v-for="group in data" class="list-group" ref="listGroup">
              <h2 class="list-group-title" v-text="group.title"></h2>
              <ul>
                  <li class="list-group-item" v-for="item in group.items" @click="select(item)">
                    <img v-lazy="item.avatar" class="avatar">
                    <span class="name" v-text="item.name"></span>
                  </li>
              </ul>
          </li>
      </ul>
      <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
        <ul>
            <li 
                v-for="(item, index) in shortcutList" 
                :data-index="index" 
                class="item" 
                v-text="item"
                :class="{'current': curIndex === index}"
            >
            </li>
        </ul>
      </div>
      <div class="list-fixed" v-show="fixedTitle" ref="fixedTitle">
        <div class="fixed-title" v-text="fixedTitle"></div>
      </div>
      <div class="loading-container" v-show="!data.length">
        <loading></loading>
      </div>
  </scroll>
</template>
<script>
/* eslint-disable */
import Scroll from "base/scroll";
import Loading from "base/loading";
import { getData } from "common/js/dom";

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      curIndex: 0,
      diff: -1
    };
  },
  created() {
    this.touch = {};
    this.listHeight = [];
  },
  computed: {
    shortcutList() {
      return this.data.map(group => group.title.substr(0, 1));
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.curIndex] ? this.data[this.curIndex].title : "";
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      let touchIndex = getData(e.target, "index");
      // 触摸开始位置
      this.touch.start = e.touches[0].pageY;
      // 开始位置索引
      this.touch.startIndex = parseInt(touchIndex);

      this._scrollTo(touchIndex, 1000);
    },
    onShortcutTouchMove(e) {
      // 触摸结束位置
      this.touch.end = e.touches[0].pageY;
      // 索引的差值
      let diff = Math.floor(
        (this.touch.end - this.touch.start) / ANCHOR_HEIGHT
      );
      // 结束位置索引
      let index = this.touch.startIndex + diff;
      this._scrollTo(index, 400);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    _scrollTo(index, time) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], time);
    },
    // 获取滚动高度
    scroll(pos) {
      this.scrollY = pos.y;
    },
    // 获取每个group上下限高度
    _getHeight() {
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      list.forEach(item => {
        height += item.clientHeight;
        this.listHeight.push(height);
      });
    },
    select(item) {
      this.$emit("select", item);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._getHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 顶部
      if (newY > 0) {
        this.curIndex = 0;
        return;
      }
      // 中间
      var height1, height2;
      for (let i = 0, l = listHeight.length - 1; i < l; i++) {
        height1 = listHeight[i];
        height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.curIndex = i;
          this.diff = height2 + newY;
          return;
        }
      }
      // 底部
      this.curIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (fixedTop === this.fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixedTitle.style.transform = `translate3d(0, ${fixedTop}px, 0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 10px 0 10px 30px;
      border-bottom: 1px dashed $color-highlight-background;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }

    .list-group-item:last-child {
      border: none;
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
        font-size: $font-size-medium;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
