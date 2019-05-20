<template>
  <div id="Home">
		<img src="../assets/logo.png">
		<!-- module for src file uploading -->
		<div id="srcFile" v-if="nothingSuccess">
			<p><br>Src file here</p>
			<input type="file" ref="pathClear" name="fileSrc" class="fileBtn" @change="getFile" :disabled="btnDisable"/>
			<v-btn 
				color="second"
				@click="submitVideo"
				:disabled="btnDisable"
			 >
				Upload
			</v-btn>
		</div>
		<!-- module for dst file uploading -->
		<div id="dstFile" v-if="srcFileSuccess">
			<p><br>Dst file here</p>
			<input type="file" ref="pathClear" name="fileDst" class="fileBtn" @change="getFile" :disabled="btnDisable"/>
			<v-btn 
				color="blue"
				@click="submitVideo"
				:disabled="btnDisable"
			 >
				Upload
			</v-btn>
		</div>
		<!-- all uploaded -->
		<div id="uploadedSuccess" v-if="dstFileSuccess">
			<p><br>All file Uploaded!! </p>
			<p>This is your task id: {{ taskId }} </p>
		</div>
		<!-- Search component -->
		<task-status-view
			@getData="getData"
		>
		</task-status-view>
		<!-- Download component -->
		<!-- <result-download-view>

		</result-download-view> -->
		<!-- dialogs -->
		<v-dialog
			v-model="allDialog"
			:persistent="allDialog"
		>
			<v-card>
				<v-card-text v-if="isSuccessfulDialog">
					Successfully Uploaded {{ srcOrDst }} File!!
				</v-card-text>
				<v-card-text v-else-if="isBigFileDialog">
					Your file should be smaller than {{ sizeLimit }}MB, pls upload again...
				</v-card-text>
				<v-card-text v-else-if="noFileDialog">
					No file input!!! Pls upload a file first....
				</v-card-text>
				<v-card-text v-else-if="isErrorDialog">
					{{ errorText }}
				</v-card-text>
				<v-card-text v-else-if="isNotVideoFileDialog">
					Pls input correct type of video file!! (Now only supporting mp4)
				</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn
							color="green darken-1"
							flat
							@click="allDialogChange"
						>
							Ok
						</v-btn>
        </v-card-actions>
			</v-card>
		</v-dialog>
	</div>
</template>

<script>
import UploadRequest from '../API/UploadRequest'
import TaskStatusView from './TaskStatusView'
import ResultDownloadView from './ResultDownload'

export default {
	name: 'Home',
	data () {
		return {
			fileData: null,
			taskId: null,
			srcOrDst: null,
			errorText: null,
			sizeLimit: 50,

			nothingSuccess: true,
			srcFileSuccess: false,
			dstFileSuccess: false,

			allDialog: false,
			isSuccessfulDialog: false,
			noFileDialog: false,
			isBigFileDialog: false,
			isErrorDialog: false,
			isNotVideoFileDialog: false,

			btnDisable: false
		}
	},

	components: {
		TaskStatusView: TaskStatusView,
		ResultDownloadView: ResultDownloadView
	},

	methods: {
		// function for uploading files onto browser, including size limit for file
		getFile (event) {
			this.fileData = event.target.files[0]
			if (this.isBigFile) {
				this.isBigFileDialog = true
				this.allDialog = true
				this.$refs.pathClear.value = ''
				this.btnDisable = true
				this.fileData = null
				return 
			}
			if (!this.isVideoFile) {
				this.isNotVideoFileDialog = true
				this.allDialog = true
				this.$refs.pathClear.value = ''
				this.btnDisable = true
				this.fileData = null
				return 
			}
			console.log(this.fileData)
		},

		submitVideo () {
			if (this.fileData != null) {
				if (this.nothingSuccess) {
					// case src upoloaded
					UploadRequest
						.postSrcRequest(this.fileData)
						.then((res) => {
							console.log(res)
							this.taskId = res.task_id
							this.srcFileSuccess = true 
							this.srcOrDst = 'src'
							this.isSuccessfulDialog = true
							this.allDialog = true
							this.srcFileSuccess = true
							this.nothingSuccess = false
							this.btnDisable = true
							this.fileData = null
						})
						.catch((error_info) => {
							errorDialog(error_info)
						})
				} else if (this.srcFileSuccess) {
					// case dst uploaded
					console.log("here is dst")
					UploadRequest
						.postDstRequest(this.fileData, this.taskId)
						.then((res) => {
							this.srcOrDst = 'dst'
							this.isSuccessfulDialog = true
							this.allDialog = true
							this.srcFileSuccess = false
							this.dstFileSuccess = true
							this.btnDisable = true
							this.fileData = null
							console.log("success")
						})
						.catch((error_info) => {
							errorDialog(error_info)
							console.log('failed')
						})
				}
				this.$refs.pathClear.value = '' // clear file
			} else {
				// if file is null
				this.noFileDialog = true
				this.allDialog = true
			}
		}, 

		getData(data) {
			console.log(this.errorText)
			if (data.error_info !== null) {
				this.errorText = data.error_info
				this.allDialog = true
				this.isErrorDialog = true
				// return 
			} else {
				this.task_id = data.task_id
			}
		},
		
		allDialogChange() {
			this.allDialog = false
			this.isSuccessfulDialog = false
			this.noFileDialog = false
			this.isBigFileDialog = false
			this.isErrorDialog = false
			this.isNotVideoFileDialog = false
			// btn could be clicked again after dialog disapppeared,
			// the same as input file form 
			this.btnDisable = false
		},

		// TODO: change all errorText-based dialog with this function
		errorDialog(error_info) {
			this.allDialog = true
			this.isErrorDialog = true
			this.errorText = error_info
		}
	},

	computed: {
		isBigFile () {
			var size = this.fileData.size
			if (size / 1024 / 1024 > this.sizeLimit) {
				return true
			}
			return false
		},

		isVideoFile() {
			var type = this.fileData.type
			if (type === "video/mp4") {
				return true
			}
			return false
		}, 

	},
}
</script>

<style>
#Home {
  font-size: 25px;
}

.fileBtn {
	font-size: 23px;
	border: 5px;
}
</style>
