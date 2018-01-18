<template>
  <div id="app">
    <m-header />
    <tab />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <play></play>
  </div>
</template>

<script>
/* eslint-disable */
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";
import Play from "components/play/play";

export default {
  components: {
    MHeader,
    Tab,
    Play
  }
};
</script>

<style <style lang="stylus" scoped>
</style>
