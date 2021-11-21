
function clone<x>(data: x){
  return JSON.parse(JSON.stringify(data))

}

export default clone