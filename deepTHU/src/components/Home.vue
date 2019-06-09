<template>
  <div id="Home">
        <div id="header" style="height: 100px;"></div> 
        <p id="title" style="padding: 5px;">DeepTHU</p>
        <!-- module for src file uploading -->
        <div id="body">
            <div id="tutorial">
                <a href="javascript:void(0)" @click="onTutorialClicked">How to use?</a>
            </div>
                <div id="fileName">
                    <!-- <v-flex justify-center sm6> -->
                        <v-text-field
                            :value="fileDataName"
                            label="File Name"
                            solo-inverted
                            dark
                            disabled
                            style="margin-top: 34px;"
                        >
                        </v-text-field>
                    <!-- </v-flex>     -->
                </div>
            <div id="srcFile" v-if="nothingSuccess || allSuccess"> 
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
            <!-- Search component -->
            <task-status-view
                @getData="getData"
                :style="!nothingSuccess ? 'margin-top: 34px;' : ''"
            >
            </task-status-view>
            <!-- Download component -->
            <!-- <result-download-view>

            </result-download-view> -->
            <!-- error dialogs -->
                <v-dialog
                    v-model="errorDialog"
                    persistent
                    max-width="900"
                >
                    <v-card dark color="red">
                        <v-card-title>
                            <v-icon left large>block</v-icon>Error
                        </v-card-title>
                    </v-card>
                    <v-card>
                        <v-card-text v-if="isBigFileDialog">
                            Size limit: {{ sizeLimit }}MB, pls upload again.
                        </v-card-text>
                        <v-card-text v-else-if="noFileDialog">
                            No file input! Pls upload a file first.
                        </v-card-text>
                        <v-card-text v-else-if="isErrorDialog">
                            {{ errorText }}
                        </v-card-text>
                        <v-card-text v-else-if="isNotVideoFileDialog">
                            Pls input video file!
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
                    max-width="900"
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
                    max-width="900"
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
                    max-width="900"
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
                    max-width="900px"
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
                            :disabled="(row != null && btnOKdisable) || (row == null && !btnOKdisable)"
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
                    max-width="900px"
                    max-height="500px"
                    style="overflow: auto;"
                >
                    <v-card dark>
                        <v-card-title> 
                            <v-icon large dark left>
                                star
                            </v-icon>
                            Tutorial
                        </v-card-title>
                    </v-card>
                    <v-card>
                        <v-card-text>
                            <h3 style="text-align: left;">介绍</h3><br>
                            <p style="text-align: left; font-size: 18px;">
                                这是一个基于Deepfakes的视频换脸网站，用户可以提交两个视频，第一个视频我们会提取出视频中的脸，然后将第二个视频的脸替换为前一个视频的脸。
                            </p><br>
                            <p style="text-align: left; font-size: 18px;">
                                <strong><font color="red">注：如果两张看起来就不可能会有好效果的脸拿来训练，请做好效果很差的心理准备！<br><br>最终的效果取决于视频质量、视频时长、训练时长以及两张脸本身的特征。</font></strong><br><br>
                            </p>
                            <h3 style="text-align: left;">支持的视频格式</h3><br>
                            <ul style="text-align: left; font-size: 18px;">
                                <li>mp4   (推荐)</li>
                                <li>avi</li>
                                <li>mkv</li>
                                <li>flv</li>
                                <li>mov</li>
                            </ul><br>
                            <h3 style="text-align: left;">视频长度</h3><br>
                            <p style="text-align: left; font-size: 18px;">
                                建议时长2~8分钟，时间太长服务器会限制文件大小（{{ sizeLimit }}MB），时间过短训练效果会比较差。<br><br>

                            </p><br>
                            <h3 style="text-align: left;">使用步骤</h3><br>
                            <h5 style="text-align: left;">上传视频</h5><br>
                            <ul style="text-align: left; font-size: 18px;">
                                <li>
                                    首先，通过点击   <img src="../../static/img/src_file_btn.png" alt="" align="top"> 来选择源文件（提取脸部的视频），若前一个图标变为 
                                    <img src="../../static/img/src_file_btn_success.png" alt="" align="top"> ，则说明视频加载成功，此时用户也可以点击”Find Again“图标，重新选择视频进行加载。<br>
                                    <br>然后通过点击 <img src="../../static/img/upload.png" alt="" align="top">，向后台服务器上传源视频文件，上传成功之后会出现提示成功的对话框，并显示有任务ID，用户可以选择此时将任务ID复制下来，也可以在上传了目的视频之后记下来。<br><br>
                                    <strong>
                                        注: 点击”upload“按钮会弹出对话框，用户可以填写邮箱，我们将在任务建立，失败，或完成时，把任务状态和任务ID发送给用户（选填）；<br><br>
                                        用户需要选择视频训练时间（1~7小时）（必填）。<br><br>
                                    </strong>
                                     <strong>一般</strong>选择3~5小时会有不错的效果。<br><br>
                                </li><br>
                                <li>
                                    第二步是上传目的视频，流程与上传源视频一样。<br><br>
                                    <strong>注：若已经上传过源视频并持有任务ID，可以点击“Find Src File”下面的链接，输入任务ID即可跳过第一步。</strong>
                                </li><br>
                                <li>
                                    上传了所有视频之后，我们会提供任务ID，用户可以通过任务ID查询任务和下载任务。
                                </li><br>
                            </ul>
                            <h5 style="text-align: left;">查询任务状态</h5><br>
                            <img src="../../static/img/task_status_search.png" alt="" align="top"><br><br>
                            <ul style="text-align: left; font-size: 18px;">
                                用户需要在搜索框里输入任务ID，点击搜索按钮，或是按Enter键都可以进行查询。查询的状态总共有五种：<br><br>
                                <li>
                                    <img src="../../static/img/waiting_state.png" alt="" align="top" width="90" height="35"> -> 在等待队列中
                                </li><br>
                                <li>
                                    <img src="../../static/img/creating_state.png" alt="" align="top" width="90" height="35"> -> 正在创建任务
                                </li><br>
                                <li>
                                    <img src="../../static/img/running_state.png" alt="" align="top" width="90" height="35"> -> 正在训练视频
                                </li><br>
                                <li>
                                    <img src="../../static/img/finish_state.png" alt="" align="top" width="90" height="35"> -> 完成了任务，可以进行下载
                                </li><br>
                                <li>
                                    <img src="../../static/img/failed_state.png" alt="" align="top" width="90" height="35"> -> 任务建立失败
                                </li><br><br>
                                <strong>注：等待队列会有号码显示，，该号码为用户在队列中的顺序。</strong><br><br>
                                <img src="../../static/img/waiting_queue_state.png" alt="" align="middle" width="130" height="60"><br><br>
                            </ul>
                            <h5 style="text-align: left;">下载任务</h5><br>
                            <p style="text-align: left; font-size: 18px;">
                                查询到任务的状态之后，若是 <img src="../../static/img/finish_state.png" alt="" align="top" width="90" height="35"> 状态，点击该按钮即可下载视频。
                            </p>
                        </v-card-text>
                        <v-btn
                            @click="tutorialDialog = false"
                            round
                        >
                            <font color="black">I GOT IT</font>
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
            sizeLimit: 200,

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
                '1', '2', '3', '4', '5', '6', '7'
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
                const pattern = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$")
                const pattern1 = /^\d+@qq\.com$/;
                if (value == '') {
                    this.btnOkdisable = false
                    return true
                }
                if (!pattern.test(value)) {
                    this.btnOkdisable = true
                } else {
                    this.btnOkdisable = false
                }
                console.log(this.btnOkdisable)
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
            this.fileData = event.target.files[0]
            this.fileDataName = event.target.files[0].name
            console.log(event.target.files)
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
                            this.nothingSuccess = true
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
            console.log("allDialog clicked")
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
            console.log("tutorial clicked")
        },

        // back to the firt state of website
        clear() {
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
            type = type.substring(type.length-3, type.length)
            console.log(type)
            if (type === "mp4" || type === "avi" || type === "mkv" || type === "flv" || type === "mov") {
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
    // margin-top: 50px;
    position: relative;
}

#dstFile {
    // margin-top: 50px;
    position: relative;
}

#fileName {
    padding-top: 20px;
    margin: 0 auto;
    max-width: 900px;
    width: 320px;
    align-self: center;
}

.btnFindFileClass {
    color: blue-grey;
}

.btnFileUploadedClass {
    color: green;
}


</style>


// TODO: modifiy training time