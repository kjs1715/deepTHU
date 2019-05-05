<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>For testing</h2>
    <router-link id="home" to="/home" style="font-size: 20px;">Just testing bitch</router-link>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'WTF is wrong with Vue'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2, .home {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
