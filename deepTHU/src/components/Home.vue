<template>
  <div id="Home">
		<div id="header" style="height: 100px;"></div> 
		<p id="title" style="padding: 5px; margin-bottom: 10px;">Deep THU</p>
		<!-- module for src file uploading -->
		<div id="body">
			<div id="srcFile" v-if="nothingSuccess" style="margin-top: 100px;"> 
				<v-btn
					:color="!localFileUploaded ? 'blue-grey' : 'green'"
					@click="onUploadButtonClicked"
					:loading="isLoading"
					:disabled="btnDisable"
				>
					<input style="display: none;" type="file" ref="video" name="fileSrc" class="fileBtn" @change="getFile" :disabled="btnDisable"/>
					<v-icon left dark color="white">folder_open</v-icon>
					<font :color="!btnDisable ? 'white' : 'black' "> {{ btnFileUploadStr }}</font>
				</v-btn>
				<v-btn
					@click="submitVideo"
					:disabled="btnDisable"
				>
					<v-icon left>cloud_upload</v-icon>
					 Upload
				</v-btn>
			</div>
			<div id="jumpSrcFile">
				<a href="javascript:void(0)" v-if="nothingSuccess" @click="onJumpSrcFileClicked">If you have task id for srcFile, click here</a>
			</div>
			<!-- module for dst file uploading -->
			<div id="dstFile" v-if="srcFileSuccess" style="margin-top: 100px;"> 
				<v-btn
					:color="!localFileUploaded ? 'blue-grey' : 'green'"
					@click="onUploadButtonClicked"
					:loading="isLoading"
					:disabled="btnDisable"
				>
					<input style="display: none;" type="file" ref="video" name="fileSrc" class="fileBtn" @change="getFile" :disabled="btnDisable"/>
					<v-icon left dark color="white">cloud_upload</v-icon>
					<font color="white"> {{ btnFileUploadStr }}</font>
				</v-btn>
				<v-btn
					@click="submitVideo"
					:disabled="btnDisable"
				>
					<v-icon left>cloud_upload</v-icon>
					 Upload
				</v-btn>
			</div>
			<div id="fileName">
				<v-text-field
					:value="fileDataName"
					label="File Chosen"
			    solo-inverted
      		dark
					disabled
				>
				</v-text-field>
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
				<v-dialog
					v-model="errorDialog"
					persistent
					max-width="700"
				>
					<v-card dark color="red lighten-2">
						<v-card-title>
							<v-icon left large>block</v-icon>Error
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
						<v-spacer></v-spacer>
						<v-btn
							color="white"
								round
							@click="allDialogChange"
						>
							<font color="black">OK</font>
						</v-btn>
					</v-card>
				</v-dialog>
				<!-- success dialogs -->
				<v-dialog
					max-width="700"
					v-model="successDialog"
					persistent
					round
				>
					<v-card dark color="rgb(182, 214, 146)">
						<v-card-title>
							<v-icon dark left large>check_circle</v-icon>
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
							<font color="black">OK</font>
						</v-btn>
					</v-card>
				</v-dialog>
				<!-- loading dialog -->
				<!-- <v-dialog
					v-model="isLoading"
					persistent
					max-width="700"
				>
					<v-card
						color="yellow lighten-2"
						dark
					>
						<v-card-title>
							<v-icon dark left large>timelapse</v-icon>
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
				</v-dialog> -->
				<!-- result dialog -->
				<v-dialog
					v-model="allSuccess"
					persistent
					max-width="700"
				>
					<v-card
						color="rgb(161, 191, 207)"
						dark
					>
						<v-card-title>
							<v-icon dark left large>work</v-icon>
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
								<font color="black">OK</font>
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
								<font color="black">SUBMIT</font>
							</v-btn>
							<v-btn
								color="white"
								round
								@click="onBackButtonClicked"
							>
								<font color="black">BACK</font>
							</v-btn>
						</v-card-text>
					
					</v-card>
				</v-dialog>
				<!-- userFormDialog -->
				<v-dialog
					v-model="userDialog"
					max-width="700px"
					persistent
				>
					<v-card
						dark
					>
						<v-card-title
						>
							<font color="white"> Before Upload...</font>
						</v-card-title>
					</v-card>
					<v-card
						
					>
						<v-card-text
						>
						<v-text-field
							v-model="email"
							label="E-mail (Recommanded)"
							:rules="[rules.email]"
						>

						</v-text-field>
						</v-card-text>

						<v-btn
							@click="onUserFormOkClicked"
							round
						>
							<font color="black">OK</font>
						</v-btn>
						<v-btn
							round
						>
							<font color="black">BACK</font>
						</v-btn>
					</v-card>	

				</v-dialog>
		</div>
	</div>
</template>
<script>
import UploadRequest from '../API/UploadRequest'
import TaskStatusView from './TaskStatusView'
import ResultDownloadView from './ResultDownload'
import { Promise, resolve } from 'q';
import { error } from 'util';

export default {
	name: 'Home',
	serverURL: "/",
	data () {
		return {
			fileData: null,
			fileDataName:"",
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

			// judge whether file is uploaded onto browser or not
			localFileUploaded : false,

			successDialog: false,
			errorDialog: false,
			noFileDialog: false,
			isBigFileDialog: false,
			isErrorDialog: false,
			isNotVideoFileDialog: false,
			skipSrcFileDialog: false,
			isLoading: false,

			btnDisable: false,

			btnFileUploadStr: "Find src file",

			// email
			email: ' ',
			// training time 
			training_time: 4,

			// variables for user form data
			userFormData: false, 
			userDialog: false,

			rules: {
				email: value => {
				const pattern = /(^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$)|(^$)/;
      	return pattern.test(value) || 'Invalid e-mail.'
		}
	},
		}
	},

	components: {
		TaskStatusView: TaskStatusView,
		ResultDownloadView: ResultDownloadView
	},



	/*
	TODO: 1. Upload button: after btn clicked, it should become green and show file ref in a textfield or other components
	TODO: 2. adjust some sizes of components, it looks disgusting 
	TODO: 3. formData: back button; checkbox; testing
	TODO: 4. maybe I need to add history func in order to make sure people do not forget their ids
	TODO: 5. add a function for copy ids from ctrl-c (clipboard)
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
		},

		localFileUploaded(newVal) {
			// status for string of upload button
			if ((newVal == true && this.nothingSuccess) || (newVal == true && this.srcFileSuccess)) {
				this.btnFileUploadStr = "FIND AGAIN"
			} else if (newVal == false && this.srcFileSuccess) {
				this.btnFileUploadStr = "find dst file"
			} else if (newVal == false && (this.nothingSuccess || this.dstFileSuccess)) {
				this.btnFileUploadStr = "find src file"
			}
		}, 
	},

	methods: {
		// function for uploading files onto browser, including size limit for file
		getFile (event) {
			console.log("get file here")
			this.fileData = event.target.files[0]
			this.fileDataName = event.target.files[0].name
			console.log(this.fileData)
			if (this.isBigFile) {
				this.isBigFileDialog = true
				this.errorDialog = true
				this.clearFilePaths()
				// this.btnDisable = true
				this.fileData = null
				this.fileDataName = ''
				this.localFileUploaded = false
				return 
			}
			if (!this.isVideoFile) {
				this.isNotVideoFileDialog = true
				this.errorDialog = true
				this.clearFilePaths()
				// this.btnDisable = true
				this.fileData = null
				this.fileDataName = ''
				this.localFileUploaded = false
				console.log("triggered file extention error")
				return 
			}
			this.localFileUploaded = true
			console.log(this.fileData)
		},

		submitVideo () {
			console.log("submit video")
			if (!this.localFileUploaded) {
				return 
			}
			if (this.fileData != null) {
				// for loading (network delay)
				this.isLoading = true
				if (this.nothingSuccess) {
					// case src upoloaded
					// user needs to input email(recommanded) and training time before upload
					if (!this.userFormData && this.fileData != null) {
							this.userDialog = true
							this.btnDisable = true
							return 
					}
					console.log(this.email)
					UploadRequest
						.postSrcRequest(this.fileData, this.training_time, this.email)
						.then((res) => {
							console.log(res)
							this.taskId = res.task_id
							this.srcOrDst = 'src'
							this.successDialog = true
							this.srcFileSuccess = true
							this.nothingSuccess = false
							this.btnDisable = true
							this.fileData = null
							this.localFileUploaded = false
						})
						.catch((error_info) => {
							this.onErrorDialogTriggered(error_info)
							console.log(err)
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
							this.localFileUploaded = false
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
			this.skipSrcFileDialog = true
			this.btnDisable = true
		},

		submitButtonClicked() {
			this.skipSrcFileDialog = false
			this.srcFileSuccess = true
			this.nothingSuccess = false
			this.btnDisable = false
		},

		onUploadButtonClicked() {
			this.$refs.video.click()
		},

		onBackButtonClicked() {
			this.btnDisable = false
			this.skipSrcFileDialog = false
		},

		onUserFormOkClicked() {
			this.userFormData = true
			this.userDialog = false
			this.btnDisable = false
			this.isLoading = false
		},

		// back to the firt state of website
		clear() {
			this.nothingSuccess = true
			this.srcFileSuccess = false
			this.dstFileSuccess = false
			this.allSuccess = false
			this.taskId = ''
			this.fileData = null
			Object.assign(this.$data, this.$options.data())
		},

		clearFilePaths() {
			this.$refs.video.value = ''
			this.fileDataName = ''
			// this.allDialogChange()
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
			console.log(type)
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
	font-family: "Montserrat", sans-serif;
	font-smoothing: antialiased;
	font-size: 4em;	
	font-weight: 100;
	text-shadow: 0 1px 2px rgba(black,.15);
	/* font-family:  */
}

#jumpSrcFile a {
	color: beige;
	font-size: 20px;
	position: relative;
}

#srcFile {
	/* width: 30%; */
	position: relative;
}

#dstFile {
	position: relative;
}

#fileName {
	padding: 50px;
	margin: 0 auto;
	max-width: 700px;
	width: 500px;
	align-self: center;
}

.btnFindFileClass {
	color: blue-grey;
}

.btnFileUploadedClass {
	color: green;
}


</style>
