<template>
  <div id="Home">
		<div id="header" style="height: 200px;"></div> 
		<p id="title">Deep THU</p>
		<!-- module for src file uploading -->
		<div id="body">
			<div id="srcFile" v-if="nothingSuccess">
				<p><br>Src file here</p>
				<v-flex xs12 class="text-xs-center text-sm-center text-md-center text-lg-center">
				<v-btn
			   	color="blue-grey"
      		class="white--text"
					@click="onUploadButtonClicked"
				>
					<input style="display: none;" type="file" ref="video" name="fileSrc" class="fileBtn" @change="getFile" :disabled="btnDisable"/>
					<v-icon left dark>cloud_upload</v-icon>
					Find files
				</v-btn>
				</v-flex>
				<v-btn 
					color="second"
					@click="submitVideo"
					:disabled="btnDisable"
				>
					Upload
				</v-btn>
			</div>
			<div id="jumpSrcFile">
				<a href="javascript:void(0)" v-if="nothingSuccess" @click="onJumpSrcFileClicked">If you have task id for srcFile, click here</a>
			</div>
			<!-- module for dst file uploading -->
			<div id="dstFile" v-if="srcFileSuccess">
				<p><br>Dst file here</p>
				<input type="file" ref="video" name="fileDst" class="fileBtn" @change="getFile" :disabled="btnDisable"/>
				<v-btn 
					color="second"
					@click="submitVideo"
					:disabled="btnDisable"
				>
					Upload
				</v-btn>
			</div>
			<!-- Search component -->
			<task-status-view
				@getData="getData"
			>
			</task-status-view>
			<!-- Download component -->
			<!-- <result-download-view>

			</result-download-view> -->
			<!-- error dialogs -->
    	<v-layout row justify-center>
				<v-dialog
					v-model="errorDialog"
					persistent
					max-width="700"
				>
					<v-card dark color="red">
						<v-card-title color="red">
							<v-icon left>block</v-icon>Error
						</v-card-title>
						<v-card-text v-if="isBigFileDialog">
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
									color="white"
									round
									@click="allDialogChange"
								>
									<font color="red">OK</font>
								</v-btn>
						</v-card-actions>
					</v-card>
				</v-dialog>
				<!-- success dialogs -->
				<v-dialog
					max-width="700"
					v-model="successDialog"
					persistent
					round
				>
					<v-card dark color="green">
						<v-card-title>
							<v-icon dark left>check_circle</v-icon>
							Hurrrray!
						</v-card-title>
						<v-card-text>
							Successfully Uploaded {{ srcOrDst }} File!!
						</v-card-text>
						<v-card-actions>
							<v-spacer></v-spacer>
						</v-card-actions>
						<v-btn
							color="white"
							round
							@click="allDialogChange"
						>
							<font color="green">OK</font>
						</v-btn>
					</v-card>
				</v-dialog>
				<!-- loading dialog -->
				<v-dialog
					v-model="isLoading"
					persistent
					max-width="700"
				>
					<v-card
						color="yellow darken-2"
						dark
					>
						<v-card-title>
							<v-icon dark left>timelapse</v-icon>
							Just wait
						</v-card-title>
						<v-card-text>
							Uploading...Please wait...
							<v-progress-linear
								indeterminate
								color="white"
								class="mb-0"
							></v-progress-linear>
						</v-card-text>
					</v-card>
				</v-dialog>
				<!-- result dialog -->
				<v-dialog
					v-model="allSuccess"
					persistent
					max-width="700"
				>
					<v-card
						color="blue lighten-1"
						dark
					>
						<v-card-title>
							<v-icon dark left>work</v-icon>
							Succeed!
						</v-card-title>
						<v-card-text>
							Here is your task id, pls copy it!
							<v-text-field
								:value="taskId"
								readonly
								dark
								class="text-xs-center"
							>
								<v-spacer></v-spacer>
							</v-text-field>
							<v-btn
								color="white"
								round
								@click="clear"
							>
								<font color="blue">OK</font>
							</v-btn>
						</v-card-text>
					</v-card>
				</v-dialog>
				<!-- skip srcFile dialog -->
				<v-dialog
					v-model="skipSrcFileDialog"
					persistent
					max-width="700"
				>
					<v-card
						color="blue"
						dark
					>
						<v-card-title>
							Input your task ID here!
						</v-card-title>
						<v-card-text>
							<v-text-field
								:value="taskId"
								dark
							>
							</v-text-field>
							<v-btn
								color="white"
								round
								@click="submitButtonClicked"
							>
								<font color="blue">SUBMIT</font>
							</v-btn>
						</v-card-text>
					
					</v-card>


				</v-dialog>
    	</v-layout>
		</div>
	</div>
</template>
<script>
import UploadRequest from '../API/UploadRequest'
import TaskStatusView from './TaskStatusView'
import ResultDownloadView from './ResultDownload'

export default {
	name: 'Home',
	serverURL: "/",
	data () {
		return {
			fileData: null,
			taskId: null,
			srcOrDst: null,
			errorText: null,
			sizeLimit: 50,

			// states
			nothingSuccess: true,
			srcFileSuccess: false,
			dstFileSuccess: false,
			allSuccess: false,
			taskIdResult: false,

			successDialog: false,
			errorDialog: false,
			noFileDialog: false,
			isBigFileDialog: false,
			isErrorDialog: false,
			isNotVideoFileDialog: false,
			skipSrcFileDialog: false,
			isLoading: false,

			btnDisable: false,
		}
	},

	components: {
		TaskStatusView: TaskStatusView,
		ResultDownloadView: ResultDownloadView
	},

	/*
	TODO: 1. Upload button: after btn clicked, it should become green and show file ref in a textfield or other components
	TODO: 2. adjust some sizes of components, it looks disgusting 
	*/
	watch: {
		// for preventing other parts (Ex: buttons, input form) could be clicked while dialog is existing
		successDialog(newVal) {
			if (newVal === true) {
				this.btnDisable = true
			} else {
				this.btnDisable = false
			}
		},

		errorDialog(newVal) {
			if (newVal === true) {
				this.btnDisable = true
			} else {
				this.btnDisable = false
			}
		}
	},

	methods: {
		// function for uploading files onto browser, including size limit for file
		getFile (event) {
			this.fileData = event.target.files[0]
			if (this.isBigFile) {
				this.isBigFileDialog = true
				this.errorDialog = true
				this.clearFilePaths()
				// this.btnDisable = true
				this.fileData = null
				return 
			}
			if (!this.isVideoFile) {
				this.isNotVideoFileDialog = true
				this.errorDialog = true
				this.clearFilePaths()
				// this.btnDisable = true
				this.fileData = null
				return 
			}
			console.log(this.fileData)
		},

		submitVideo () {
			if (this.fileData != null) {
				// for loading (network delay)
				this.isLoading = true
				if (this.nothingSuccess) {
					// case src upoloaded
					UploadRequest
						.postSrcRequest(this.fileData)
						.then((res) => {
							console.log(res)
							this.taskId = res.task_id
							this.srcFileSuccess = true 
							this.srcOrDst = 'src'
							this.successDialog = true
							this.srcFileSuccess = true
							this.nothingSuccess = false
							this.btnDisable = true
							this.fileData = null
						})
						.catch((error_info) => {
							onErrorDialogTriggered(error_info)
						})
						.then(() => {
							this.isLoading = false
						})
				} else if (this.srcFileSuccess) {
					// case dst uploaded
					console.log("here is dst")
					UploadRequest
						.postDstRequest(this.fileData, this.taskId)
						.then((res) => {
							this.srcOrDst = 'dst'
							this.successDialog = true
							this.srcFileSuccess = false
							this.dstFileSuccess = true;
							this.btnDisable = true
							this.fileData = null
							console.log("success")
						})
						.catch((error_info) => {
							onErrorDialogTriggered(error_info)
							console.log('failed')
						})
						.then(() => {
							this.isLoading = false
						})
				}
				this.clearFilePaths()
			} else {
				// if file is null
				this.noFileDialog = true
				this.errorDialog = true
			}
		}, 

		getData(data) {
			console.log(this.errorText)
			if (data.error_info !== null) {
				this.errorText = data.error_info
				this.errorDialog = true
				this.isErrorDialog = true
				// return 
			} else {
				this.task_id = data.task_id
			}
		},
		
		// control all dialogs
		allDialogChange() {
			this.successDialog = false
			this.noFileDialog = false
			this.isBigFileDialog = false
			this.isErrorDialog = false
			this.isNotVideoFileDialog = false
			this.errorDialog = false
			// this.skipSrcFileDialog = false
			// btn could be clicked again after dialog disapppeared,
			// the same as input file form 
			this.btnDisable = false
			// to solve conflict of successDialog and taskIdDialog
			if (this.dstFileSuccess == true && this.allSuccess === false) {
				this.allSuccess = true;
			}
		},

		onErrorDialogTriggered(error_info) {
			this.errorDialog = true
			this.isErrorDialog = true
			this.errorText = error_info
		},

		onJumpSrcFileClicked() {
			console.log("onJumpSrcFileClicked")
			this.skipSrcFileDialog = true;
		},

		submitButtonClicked() {
			this.skipSrcFileDialog = false;
			this.srcFileSuccess = true
			this.nothingSuccess = false
		},

		onUploadButtonClicked() {
			this.$refs.video.click()
		},

		// back to the firt state of website
		clear() {
			this.nothingSuccess = true
			this.srcFileSuccess = false
			this.dstFileSuccess = false
			this.allSuccess = false
			this.taskId = ''
		},

		clearFilePaths() {
			this.$refs.video.value = ''
			this.allDialogChange()
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

.dialogs {
  pointer-events: none;
}

#title {
	font-size: 110px;	
	font-weight: 100;
}

#jumpSrcFile a {
	color: beige;
	font-size: 20px;
}


</style>
