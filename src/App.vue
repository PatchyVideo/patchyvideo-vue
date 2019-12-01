<template>
  <div id="app" :class="this.$store.state.bgcMark">
      <router-view/>

  </div>
</template>
<script>



  export default{
    data(){
      return{

      }
    },
    components:{

    }
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
    width: 100%;
    height: 100%;
}
    .home{

    }
    .login{
        height: 100%;
        width: 100%;
        background: url(static/img/login.jpg) no-repeat top center;
        /* background-position: 200px 0; */
        background-size: cover;
        background-attachment: fixed;
    }
    .signup{
        height: 100%;
        width: 100%;
        background: url(static/img/sign_up.jpg) no-repeat top center;
        /* background-position: 200px 0; */
        background-size: cover;
        background-attachment: fixed;
    }

</style>
