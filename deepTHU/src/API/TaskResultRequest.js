import axios from 'axios'

// const serverURL = 'http://192.168.31.94:8000/'
const serverURL = '/'

export default {
  name: 'TaskResultRequest',

  // for update video to backend (src video)
  // method : GET
  getTaskResult(task_id) {
    return new Promise((resolve, reject) => {
      axios({
        url: serverURL + "api/v1/task/result?task_id=" + task_id,
        method: 'GET',
        responseType: 'blob'
      }).then((response) => {
        let responeseCode = response.status
        if (responeseCode === 200) {
          resolve(response)
        } else if (responeseCode === 400 || responeseCode === 404 || responeseCode === 409) {
          reject(response.error_info)
        }
      })
    })
  },

  getFileAPI(task_id) {
    return serverURL + 'api/v1/task/result?task_id=' + task_id
  }
}