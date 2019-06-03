<template>
  <div id="app">
    <head>
    </head>
    <router-view/>
    <div id="footer">
			<v-footer
				dark
				height="auto"
        fixed
			>
				<v-card
      		class="flex"
      		flat
      		tile
    		>
					<v-card-text>
						DO NOT UPLOAD PORN VIDEOS
					</v-card-text>
				</v-card>
			</v-footer>
		</div>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: beige;
  /* border-top: 60px; */
  background-color: rgb(41, 44, 58);
  background-size: 100% 100%;
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: scroll;
}
</style>