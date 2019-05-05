<template>
  <div id="header">
		<p>Upload File Here</p>
		<input type="file" name="file" class="fileBtn"/>
		<input type="submit" name="submit" value="upload" class="submitBtn" @click="submitVideo"/>
	</div>
</template>

<script>
export default {
	name: 'Home',
	methods: {
		submitVideo: function () {
			var formData = new FormData()
			formData.append()
		}
	}
}
</script>

<style>
#header {
  font-size: 20px;
}
</style>
