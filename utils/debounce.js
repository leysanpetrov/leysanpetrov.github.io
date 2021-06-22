export const debounce = (appendData, debounceTime = 500) => {
  let timeOut
  return function () {
    const func = () => { appendData.apply(this, arguments) }
    clearTimeout(timeOut)
    timeOut = setTimeout(func, debounceTime)
  }
}

