<template>
  <div id="Home">
		<img src="../assets/logo.png">
		<div id="srcFile" v-if="nothingSuccess">
			<p><br>Src file here</p>
			<input type="file" ref="pathClear" name="fileSrc" class="fileBtn" @change="getFile"/>
			<v-btn 
				color="blue"
				@click="submitVideo"
				>
					Upload
				</v-btn>
		</div>
		<div id="dstFile" v-if="srcFileSuccess">
			<p><br>Dst file here</p>
			<input type="file" ref="pathClear" name="fileDst" class="fileBtn" @change="getFile"/>
			<v-btn 
				color="blue"
				@click="submitVideo"
				>
					Upload
				</v-btn>
		</div>
		<!-- Some dialogs -->
		<v-dialog
			v-model="successDialog"
			color="green"
		>
			<v-card>
				<v-card-text>
					Successfully Uploaded {{ srcOrDst }} File!!
				</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="green darken-1"
							flat
							@click="successDialog = false"
						>
							Ok
						</v-btn>
        </v-card-actions>
			</v-card>
		</v-dialog>
		<v-dialog
			v-model="noFileDialog"
			color="green"
		>
			<v-card>
				<v-card-text>
					No file input!!! Pls upload a file first....
				</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="green darken-1"
							flat
							@click="noFileDialog = false"
						>
							Ok
						</v-btn>
        </v-card-actions>
			</v-card>
		</v-dialog>
		<div id="uploadedSuccess" v-if="dstFileSuccess">
			<p><br>All file Uploaded!! This is your task id: {{ taskId }}</p>
		</div>

	</div>
</template>

<script>
import UploadRequest from '../API/UploadRequest'

export default {
	name: 'Home',
	data () {
		return {
			formData: null,
			taskId: null,
			srcOrDst: null,

			nothingSuccess: true,
			srcFileSuccess: false,
			dstFileSuccess: false,
			successDialog: false,
			noFileDialog: false
		}
	},
	methods: {
		getFile (event) {
			this.$data.formData = new FormData()
			this.$data.formData.append('file', event.target.files[0])
			console.log('event emitted...')
			console.log(this.$data.formData.get('file'))
		},

		submitVideo () {
			if (this.$data.formData != null) {
				if (this.$data.srcFileSuccess === false) {
					// case src upoloaded
					this.$data.srcOrDst = 'src'
					this.$data.successDialog = true
					this.$data.taskId = 'abcdefg123123' // taskid would get from here
					this.$data.srcFileSuccess = true
					this.$data.nothingSuccess = false
				} else if (this.$data.srcFileSuccess === true) {
					// case dst uploaded
					this.$data.srcOrDst = 'dst'
					this.$data.successDialog = true
					this.$data.srcFileSuccess = false
					this.$data.dstFileSuccess = true
					console.log(this.$data.formData.get('file'))
				}
				this.$refs.pathClear.value = '' // clear file
				this.$data.formData = null
			} else {
				// if file is null
				this.$data.noFileDialog = true
				return 0
			}
			// UploadRequest
			// 	.postSrcRequest(this.$data.formData)
			// 	.then(() => {
					
			// 	})

			// empty input
		}
	}
}
</script>

<style>
#Home {
  font-size: 20px;
}
</style>
