<template>
  <div id="app">
    <!--
    <div id="nav">
      <router-link to="/">index</router-link> |
      <router-link to="/meal">meal</router-link>
      <router-link to="/orderDaily">OrderDaily</router-link>
      <router-link to="/about">About</router-link>
    </div> 
    -->
    <router-view/>
  </div>
</template>

<script>
// import jquery from "@/assets/js/jquery-1.10.2.js"
// import bootstrapmin from "@/assets/js/bootstrap.min.js"
// import jquerymetisMenu from "@/assets/js/jquery.metisMenu.js"
// import raphael from "@/assets/js/morris/raphael-2.1.0.min.js"
// import morris from "@/assets/js/morris/morris.js"
// import easypiechart from "@/assets/js/easypiechart.js"
// import easypiechartdata from "@/assets/js/easypiechart-data.js"
// import jquerychart from "@/assets/js/Lightweight-Chart/jquery.chart.js"

export default {
  
}
</script>

<style lang="less">
@import "assets/css/bootstrap.css";
@import "assets/css/bootstrap-theme.min.css";
@import "assets/css/font-awesome.css";
@import "assets/js/morris/morris-0.4.3.min.css";
@import "assets/css/custom-styles.css";
@import "assets/js/Lightweight-Chart/cssCharts.css";
@import "assets/css/tables.css";


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
