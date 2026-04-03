<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';

import WaveDiffusion from './components/WaveDiffusion.vue';
</script>
<template>
  <Splitpanes>
    <Pane class="ml10">
      <Splitpanes>
        <Pane class="ml8">
          <WaveDiffusion />
        </Pane>
      </Splitpanes>
    </Pane>
  </Splitpanes>
</template>
<style scoped></style>
