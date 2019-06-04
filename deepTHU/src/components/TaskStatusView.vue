<template>
  <div id="task-status-view">
    <br><br>
    <v-text-field 
      v-model="inputTaskID"
      append-icon="search" 
      label="Input your Task ID Here and Check for Progress"
      color="rgb(245,245,220)"
      @click:append="searchTaskID"
      solo-inverted
      dark
      @keyup.enter="searchTaskID"
      >
    </v-text-field>
      Status: 
    <v-btn
      :color="task_state_color"
      @click="downloadFile"
      :loading="isLoading"
    >
      {{ task_state }}
    </v-btn>
		<!-- <v-dialog
      v-model="isLoading"
      hide-overlay
      persistent
      max-width="700"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Searching...Please wait...
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import TaskStatusRequest from '../API/TaskStatusRequest'
import TaskResultRequest from '../API/TaskResultRequest'

export default {
  name: "TaskStatusView",

  props: {
    // task_id,
  },

  data() {
    return {
      inputTaskID: "",
      task_state: 'None',
      task_state_color: 'second',
      error_info: null,
      task_id: '',

      isLoading: false,

      states: {
        creating: ['CREATING', 'yellow darken-1'],
        created: ['CREATED', 'yellow'],
        finished: ['FINISHED', 'green'],
        running: ['RUNNING', 'blue'],
        failed: ['FAILED', 'red'],
        none: ['NONE', 'second']
      }
    }
  }, 

  watch: {
    inputTaskID(newVal) {
      if (newVal === null || newVal === '') {
        newVal = ' '
      }
      console.log(newVal)
    },

    // task_state(newVal) {
    //   if (newVal === '' || newVal === null) {
    //     newVal = 'None'
    //   }
    // }
  },

  methods: {
    searchTaskID() {
      // console.log(this.inputTaskID)
      // if (this.inputTaskID === '') {
      //   return 
      // }

      // TODO: after testing pls cancel comment under here
      this.error_info = null
      // if (this.task_id)
      this.isLoading = true
      TaskStatusRequest
        .getTaskStatus(this.inputTaskID)
        .then((res) => {
          console.log(res)
          this.task_id = res.task_id
          this.changeTaskState(res.task_state)
          console.log(this.task_state)
        })
        .catch((res) => {
          console.log("heyyyyyy " + res)
          this.error_info = res.error_info
          console.log(res.error_info)
        })
        .then(() => {
          this.isLoading = false
        })
        .then(() => {
          console.log(this.error_info)
          this.$emit('getData', {
            task_id: this.task_id,
            error_info: this.error_info
          })
          console.log('here')
          // TODO: fix here
        })
    },

    downloadFile() {
      console.log("clicked")
      if (this.task_state === this.states.finished[0]) {
        let path = TaskResultRequest.getFileAPI(this.inputTaskID)
        window.open(path)
      }
    },
    
    // change colors of status
    changeTaskState(task_state) {
      this.task_state = task_state
      if (this.task_state === this.states.creating[0])
        this.task_state_color = this.states.creating[1]
      else if (this.task_state === this.states.created[0])
        this.task_state_color = this.states.created[1]
      else if (this.task_state === this.states.running[0])
        this.task_state_color = this.states.running[1]
      else if (this.task_state === this.states.finished[0])
        this.task_state_color = this.states.finished[1]
      else if (this.task_state === this.states.failed[0])
        this.task_state_color = this.states.failed[1]
      else if (this.task_state === this.states.none[0])
        this.task_state_color = this.states.none[1]
    }
  }
}
</script>

<style>
#task-status-view {
  text-align: center;
  align-self: center;
  width: 500px;
  margin: 0 auto;
}

</style>
