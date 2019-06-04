var Mock = require("mockjs")
const serverURL = '/'

var fileData

Mock.mock(RegExp(serverURL + "api/v1/src/upload" + '.*'), 'post', (req) => {
  if (req.body !== null) {
    console.log(req.body)
    return {
      status: "200",
      task_id: "1232345235"
    }
  } else {
    return {
      status: "400",
      error_info: "Only one file in field 'file' should be uploaded."
      // task_id: "12345678"
    }
  }
})

Mock.mock(RegExp(serverURL + "api/v1/dst/upload?" + '.*'), 'post', (req) => {
  console.log(req)
  if (req.body === null) {
    filaData = req.body
    return {
      status: "404",
      error_info: "Only one file in field 'file' should be uploaded."
      // task_id: "12345678"
    }
  } else if (req.data) {

  }
})

Mock.mock(RegExp(serverURL + "api/v1/task/query?task_id=" + '.*'), 'get', (req) => {
  index = req.url.indexOf('?')
  str = req.url.substr(index+1, req.url.length)
  // if (str !== '') {
  //   return {
  //     status: "200",
  //     task_id: str
  //   }
  // } else {
    return {
      status: "200",
      error_info: "Only one file in field 'file' should be uploaded."
      // task_id: "12345678"
    // }
  } 
})

Mock.mock(RegExp(serverURL + "api/v1/task/result?task_id=" + '.*'), 'get', (req) => {
  console.log("Received request")
  return {
    status: "200",
    data: fileData
    // data: 
    // error_info: "Only one file in field 'file' should be uploaded."
  }
})
