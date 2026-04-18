/* 剪切板工具类*/
import Clipboard from 'clipboard'

interface Options {
  /** Fixes IE by appending element to body */
  appendToBody: boolean
}

const clipboard_ = (opts?: Options) => {
  // default appendToBody true
  const appendToBody = opts?.appendToBody === undefined ? true : opts.appendToBody
  return {
    toClipboard(text: string, container?: HTMLElement) {
      return new Promise((resolve, reject) => {
        // make fake element
        const fakeEl = document.createElement('button')
        // setup a new Clipboard.js
        const clipboard = new Clipboard(fakeEl, {
          text: () => text,
          action: () => 'copy',
          container: container === undefined ? document.body : container
        })
        clipboard.on('success', (e) => {
          clipboard.destroy()
          resolve(e)
        })
        clipboard.on('error', (e) => {
          clipboard.destroy()
          reject(e)
        })
        // appendToBody fixes IE
        if (appendToBody) document.body.append(fakeEl)
        // simulate click
        fakeEl.click()
        // remove from body if appended
        if (appendToBody) fakeEl.remove()
      })
    }
  }
};
export default clipboard_;
