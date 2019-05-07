import axios from 'axios'

const serverURL = '/'

export default {
  name: 'UploadRequest',


  // for update video to backend (src video)
  // method : POST
  postSrcRequest(data_stream) {
    return new Promise((resolve, reject) => {
      const body = { tasks: [] }
      body.tasks.push(...data_stream)
      axios
        .post(serverURL + 'api/v1/src/upload', body)
        .then(response => {
          let responseCode = response.status
          console.log(responseCode)
          if (responseCode === 200) {
            resolve(response.data)
          } else if (responseCode === 400 || responseCode === 413) {
            resolve(response.error_info)
          } else {
            reject(response.status)
          }
        }).catch(error => {
          reject(error.response.status)
        })
    })
  },

  // for update video to backend (dst video)
  // method : POST
  postDstRequest(data_stream) {
    return new Promise((resolve, reject) => {
      const body = { tasks: [] }
      body.tasks.push(...data_stream)
      axios
        .post(serverURL + 'api/v1/dst/upload', body)
        .then(response => {
          let responseCode = response.status
          if (responseCode == 200) {
            resolve(response.data)
          } else if (responseCode >= 400 && responseCode < 500) {
            resolve(response.error_info)
          } else {
            reject(response.status)
          }
        })
    })
  }
}