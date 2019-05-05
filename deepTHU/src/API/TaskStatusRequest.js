import axios from 'axios'

const serverURL = '/'

export default {
  name: StatusRequest,

  // for update video to backend (src video)
  // method : GET
  getTaskStatus(task_id) {
    return new Promise((resolve, reject) => {
      axios
        .get(serverURL + "/api/v1/task/result?" + task_id)
        .then(response => {
          let responseCode = response.status
          if (responseCode === 200) {
            resolve(response.data)
          } else if(responseCode >= 400 && responseCode < 500) {
            resolve(response.error_info)
          } else {
            reject(response.status)
          }
        })
        .catch(error => {
          console.log(error)
          reject(error)
        })
    })
}

}