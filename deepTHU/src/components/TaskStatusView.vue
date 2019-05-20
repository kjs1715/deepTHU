<template>
  <div id="task-status-view">
    <p><br> Search your task here </p>
    <v-text-field 
      v-model="inputTaskID"
      append-icon="search" 
      label="Input Task ID Here"
      color="rgb(245,245,220)"
      @click:append="searchTaskID"
      solo-inverted
      >
    </v-text-field>
    Status: {{ task_state }}
  </div>
</template>

<script>
import TaskStatusRequest from '../API/TaskStatusRequest'

export default {
  name: "TaskStatusView",

  props: {
    // task_id,
  },

  data() {
    return {
      inputTaskID: "",
      task_state: null,
      error_info: 'aaa',
      task_id: null
    }
  }, 

  watch: {
    inputTaskID(newVal) {
      if (newVal === null || newVal === '') {
        newVal = ' '
      }
      console.log(newVal)
    },
  },

  methods: {
    searchTaskID() {
      // console.log(this.inputTaskID)
      // if (this.inputTaskID === '') {
      //   return 
      // }

      // TODO: after testing pls cancel comment under here
      // this.error_info = null
      TaskStatusRequest
        .getTaskStatus(this.inputTaskID)
        .then((res) => {
          console.log(res)
          this.task_id = res.task_id
        })
        .catch((res) => {
          this.error_info = res.error_info
          console.log(res.error_info)
        })
        .then(() => {
          this.$emit('getData', {
            task_id: this.task_id,
            error_info: this.error_info
          })
        })

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
