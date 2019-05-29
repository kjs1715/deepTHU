<template>
  <div id="result-download-view">
    <br><p>Download your task here</p>
    <v-text-field 
      v-model="inputTaskID"
      append-icon="search" 
      label="Input Task ID Here"
      color="rgb(245,245,220)"
      solo-inverted
      @click:append="searchTaskID"
      @keypress.enter.native="searchTaskID"
      >
    </v-text-field>
    		<v-dialog
			v-model="onDialog"
			:persistent="onDialog"
		>
			<v-card>
        <v-card-text>
          <a :href="downloadUrl">Link Here</a>
        </v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="green darken-1"
							flat
							@click="onClicked"
						>
							Ok
						</v-btn>
        </v-card-actions>
			</v-card>
		</v-dialog>
  </div>
</template>

<script>
import TaskResultRequest from '../API/TaskResultRequest'

export default {
  name: 'ResultDownloadView',

  data() {
    return {
      inputTaskID: '',
      downloadUrl: '',

      onDialog: false
    }
  },

  methods: {
    searchTaskID() {
      // TaskResultRequest
      //   .getTaskResult(this.inputTaskID)
      //   .then((response) => {
      //     let reader = new FileReader()
      //     reader.addEventListener('load', () => {
      //       this.downloadUrl = reader.result
      //       console.log(this.downloadUrl)
      //       this.onDialog = true
      //     }, false)
      //     reader.readAsDataURL(new Blob([response.data]))
      //   })
      downloadFile()
    },

    downloadFile() {
      let path = TaskResultRequest.getFileAPI(this.inputTaskID)
      window.open(path)
    },

    onClicked() {
      this.onDialog = false
    }
  }
}
</script>

<style>
#result-download-view {
  text-align: center;
  align-self: center;
  width: 500px;
  margin: 0 auto;
}
</style>
