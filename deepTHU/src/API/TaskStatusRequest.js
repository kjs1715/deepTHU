import axios from 'axios'
import Home from '../components/Home.vue'

const serverURL = "http://139.217.99.237:8000/"
// const serverURL = 'http://192.168.31.94:8000/'

export default {
  name: 'TaskStatusRequest',

  // for update video to backend (src video)
  // method : GET
  getTaskStatus(task_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(serverURL + "api/v1/task/query?task_id=" + task_id)
        .then(response => {
          let responseCode = response.status
          if (responseCode === 200) {
            resolve(response.data)
          } else if(responseCode >= 400 && responseCode < 500) {
            reject(response.error_info)
            console.log(adsfasd)
          } else {
            reject(response.error_info)
          }
        })
    })
  },
}