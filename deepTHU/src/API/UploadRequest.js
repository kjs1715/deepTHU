import axios from 'axios'

// const serverURL = 'http://192.168.31.94:8000/'
const serverURL = '/'

export default {
  name: 'UploadRequest',


  // for update video to backend (src video)
  // method : POST
  postSrcRequest(data_stream) {
    return new Promise((resolve, reject) => {
      var formData = new FormData()
      // const body = { file: [] }
      // body.file.push(...data_stream)
      formData.append('file', data_stream)
      console.log(formData.get('file'))
      axios
        .post(serverURL + 'api/v1/src/upload', formData)
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