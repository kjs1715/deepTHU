import axios from 'axios'
import Const from '../../static/const'

// const serverURL = "http://139.217.99.237:8000/"
// const serverURL = Home.getServerURL()
const serverURL = Const.serverURL

export default {
  name: 'UploadRequest',

  // for update video to backend (src video)
  // method : POST
  postSrcRequest(data_stream, training_time, email) {
    return new Promise((resolve, reject) => {
      var formData = new FormData()
      // const body = { file: [] }
      // body.file.push(...data_stream)
      formData.append('file', data_stream)
      console.log(formData.get('file'))
      if (email != '') {
        axios
          .post(serverURL + 'api/v1/src/upload?training_time=' + training_time + "&email=" + email, formData)
          .then(response => {
            let responseCode = response.status
            if (responseCode === 200) {
              resolve(response.data)
            } else if (responseCode === 400 || responseCode === 413) {
              reject(response.error_info)
            } else {
              reject(response.error_info)
            }
          })
      } else {
        axios
          .post(serverURL + 'api/v1/src/upload?training_time=' + training_time, formData)
          .then(response => {
            let responseCode = response.status
            if (responseCode === 200) {
              resolve(response.data)
            } else if (responseCode === 400 || responseCode === 413) {
              reject(response.error_info)
            } else {
              reject(response.error_info)
            }
          })
      }
    })
  },

  // for update video to backend (dst video)
  // method : POST
  postDstRequest(data_stream, task_id) {
    return new Promise((resolve, reject) => {
      var formData = new FormData()
      formData.append('file', data_stream)
      axios
        .post(serverURL + 'api/v1/dst/upload?task_id=' + task_id, formData)
        .then(response => {
          let responseCode = response.status
          if (responseCode == 200) {
            resolve(response.data)
          } else if (responseCode >= 400 && responseCode < 500) {
            reject(response.error_info)
          } else {
            reject(response.error_info)
          }
        })
    })
  }
}