import axios from 'axios'
import Const from '../../static/const'

// const serverURL = "http://139.217.99.237:8000/"
// const serverURL = Home.getServerURL()
const serverURL = Const.serverURL

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
          console.log(responseCode)
          if (responseCode === 200) {
            resolve(response.data)
          } else if(responseCode === 400 || responseCode === 404) {
            reject(response.error_info)
          } else {
            reject(response.error_info)
          }
        })
        .catch(error => {
          resolve(error.response.data)
        })
    })
  },
}