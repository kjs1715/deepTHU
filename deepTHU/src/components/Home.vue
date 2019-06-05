<template>
  <div id="Home">
		<div id="header" style="height: 100px;"></div> 
		<p id="title" style="padding: 5px; margin: 10px;">DeepTHU</p>
		<!-- module for src file uploading -->
		<div id="body">
			<div id="tutorial">
				<a href="javascript:void(0)" @click="onTutorialClicked">How to use?</a>
			</div>
			<div id="srcFile" v-if="nothingSuccess"> 
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
					:disabled="btnDisable || uploadDisable"
				>
					<v-icon left>cloud_upload</v-icon>
					Upload
				</v-btn>	
			</div>
			<div id="jumpSrcFile">
				<a href="javascript:void(0)" v-if="nothingSuccess" @click="onJumpSrcFileClicked">If you have task id for srcFile, click here</a>
			</div>
			<!-- module for dst file uploading -->
			<div id="dstFile" v-if="srcFileSuccess"> 
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
					:disabled="btnDisable || uploadDisable"
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
					:style="srcFileSuccess ? 'margin-top: 68px;' : 'margin-top: 34px;' "
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
					<v-card dark color="red">
						<v-card-title>
							<v-icon left large>block</v-icon>Error
						</v-card-title>
					</v-card>
					<v-card>
						<v-card-text v-if="isBigFileDialog">
							Size limit {{ sizeLimit }}MB, pls upload again.
						</v-card-text>
						<v-card-text v-else-if="noFileDialog">
							No file input! Pls upload a file first.
						</v-card-text>
						<v-card-text v-else-if="isErrorDialog">
							{{ errorText }}
						</v-card-text>
						<v-card-text v-else-if="isNotVideoFileDialog">
							Pls input mp4 file!
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
					<v-card dark>
						<v-card-title>
							<v-icon dark left large>check_circle</v-icon>
							Hurrrray!
						</v-card-title>
					</v-card>
					<v-card>
						<v-card-text>
							Successfully Uploaded {{ srcOrDst }} File!!
								<v-text-field
										:value="taskId"
										readonly
										class="text-xs-center"
										label="TaskID"
									>
										<v-spacer></v-spacer>
								</v-text-field>
								<v-btn
									round
									@click="allDialogChange"
								>
									<font color="black">OK</font>
								</v-btn>
						</v-card-text>

						<v-card-actions>
							<v-spacer></v-spacer>
						</v-card-actions>

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
						dark
					>
						<v-card-title>
							<v-icon dark left large>work</v-icon>
							Succeed!
						</v-card-title>
					</v-card>
					<v-card>
						<v-card-text>
							Here is your task id, pls copy it!
							<v-text-field
								:value="taskId"
								readonly
								class="text-xs-center"
								label="Task ID"
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
						dark
					>
						<v-card-title >
							<font> Input your task ID here!</font>
						</v-card-title>
					</v-card>
					<v-card>
						<v-card-text>
							<v-text-field
								v-model="taskId"
								label="Task ID"
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
							<v-icon left dark color="white">pan_tool</v-icon>
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
							<br>
							<v-select
								v-model="row"
								:items="times"
								label="Training Time"
								single-line
								chips
							>
							</v-select>
							<br><br>
						</v-card-text>

						<v-btn
							@click="onUserFormOkClicked"
							:disabled="btnOKdisable || row == null"
							round
						>
							<font color="black">OK</font>
						</v-btn>
						<v-btn
							round
							@click="onUserFormBackClicked"
						>
							<font color="black">BACK</font>
						</v-btn>
					</v-card>	
				</v-dialog>
				<!-- tutorial dialog -->
				<v-dialog
					v-model="tutorialDialog"
				>

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
import TaskStatusRequest from '../API/TaskStatusRequest';

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
			uploadDisable: false,

			btnFileUploadStr: "Find src file",

			// email
			email: '',
			// training time 
			training_time: 0,
			times: [
				'1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'
			],

			// variables for user form data
			userFormData: false, 
			userDialog: false,
			btnOKdisable: false,

			// row chosen variable for checkbox in user Form
			row: null,

			// tutorial
			tutorialDialog: false,

			rules: {
				email: value => {
				const pattern = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$")
				const pattern1 = /^\d+@qq\.com$/;
				if (value == '') {
					this.btnOkDisable = false
					return true
				}
				if (!pattern.test(value)) {
					this.btnOkDisable = true
				} else {
					this.btnOkDisable = false
				}
				// let test1 = pattern1.test(value)
				// if (test) {
				// 	this.btnOKdisable = false
				// } else {
				// 	if (!test) {
				// 		this.btnOKdisable = true
				// 	} else {
				// 		this.btnOKdisable = false
				// 	}
				// }
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
	TODO: 2. adjust some sizes of components, it looks disgusting 
	TODO: 3. formData: back button; checkbox; testing
	TODO: 4. maybe I need to add history func in order to make sure people do not forget their ids
	TODO: 5. add a function for copy ids from ctrl-c (clipboard)
	TODO: 6. wrong with jump Src
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
							this.uploadDisable = false
							this.fileData = null
							this.localFileUploaded = false
							this.uploadDisable = false
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
							// this.successDialog = true
							this.srcFileSuccess = false
							this.allSuccess = true
							this.btnDisable = true
							this.uploadDisble = false
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
			// TODO: needed testing with server
			console.log(this.taskId)
			console.log("submit button clicked")
			this.skipSrcFileDialog = false
			this.btnDisable = false
			this.uploadDisable = true
			this.isLoading = true
			TaskStatusRequest
			 .getTaskStatus(this.taskId)
			 .then((res) => {
				 if (res.error_info != null) {
						this.errorText = res.error_info
						this.errorDialog = true
						this.isErrorDialog = true
						this.taskId = ''
						return 
				 }
				console.log(res)
			 	console.log("succeed submit")
			 	this.srcFileSuccess = true
				this.nothingSuccess = false
				this.fileData = null
				this.srcOrDst = 'dst'
				this.localFileUploaded = false
				this.btnFileUploadStr = "Find dst file"
			 })
			 .then(() => {
				 this.isLoading = false
				 this.uploadDisable = false
			 })
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
			this.uploadDisable = true
			this.isLoading = false
			this.training_time = this.row
			console.log(this.training_time)
			this.submitVideo()
		},

		onUserFormBackClicked() {
			this.userDialog = false
			this.isLoading = false
			this.btnDisable = false
		},

		onTutorialClicked() {
			this.tutorialDialog = true
		},

		// back to the firt state of website
		clear() {
			this.nothingSuccess = true
			this.srcFileSuccess = false
			this.dstFileSuccess = false
			this.allSuccess = false
			this.taskId = ''
			this.fileData = null
			this.email = ''
			this.training_time = null
			this.row = null
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

		isVideoFile () {
			var type = this.fileData.type
			console.log(type)
			if (type === "video/mp4") {
				return true
			}
			return false
		}, 

		options () {
				row: this.row
		}
	},
}
</script>

<style lang="scss">
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
	font-family: 'RalewayThin', sans-serif;
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

#tutorial a{
	color: beige;
	font-size: 20px;
	position: relative;
}

#tutorial {
	margin-top: 50px;
}

#srcFile {
	/* width: 30%; */
	margin-top: 50px;
	position: relative;
}

#dstFile {
	margin-top: 50px;
	position: relative;
}

#fileName {
	padding: 20px;
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
