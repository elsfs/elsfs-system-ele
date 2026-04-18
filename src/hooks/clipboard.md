# Usage

## Simple
```vue
<template lang="html">
  <button @click="copy">Copy!</button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import useClipboard from '#/hooks/clipboard'

export default defineComponent({
  setup() {
    const { toClipboard } = useClipboard()

    const copy = async () => {
      try {
        await toClipboard('Any text you like')
        console.log('Copied to clipboard')
      } catch (e) {
        console.error(e)
      }
    }

    return { copy }
  }
})
</script>
```
## With ref
```vue
<template lang="html">
  <div>
    <input type="text" v-model="text">
    <button @click="copy">Copy!</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api'
import useClipboard from '#/hooks/clipboard'


export default defineComponent({
  setup() {
    const { toClipboard } = useClipboard()

    const text = ref('')

    const copy = async () => {
      try {
        await toClipboard(text.value)
        console.log('Copied to clipboard')
      } catch (e) {
        console.error(e)
      }
    }

    return { copy, text }
  }
})
</script>
```
## API
```typescript
useClipboard(options: Options)
```
```typescript
interface Options {
  /** Fixes IE by appending element to body. Defaults to true. */
  appendToBody: boolean
}
```
returns an object with a single key: toClipboard
```typescript
toClipboard(text: string, container?: HTMLElement)

```
requires that you pass in at least one argument that is a string. This is the text to be copied to the clipboard. The second optional argument is a html element that will be used as the container internally when using clipboard.js.


