<script setup lang="ts">
import { onMounted, ref } from 'vue';

const topButtonRef = ref(); // 获取波浪按钮
const rippleRef = ref(); // 波浪容器
const rippleBodyRef = ref(); // 波浪容器
const appBoyRef = ref(); // app容器
const backButtonRef = ref(); // 返回

const rippleTime = 1.8; // 波浪动画时间
const rippleBodyTime = 0.8; // 波浪动画时间
const rippleTimeOffset = 0; // 波浪动画时间偏移
const rippleBodyTimeOffset = 0;

const appBody = document.querySelector('#appBody');
const getInfo = (tag) => {
  const size = Math.max(appBody.offsetWidth, appBody.offsetHeight);
  console.log(appBody.getBoundingClientRect(), size, tag);
};

const setRippleSize = () => {
  getInfo('set');

  // 控制波浪小球的起始位置
  /** @type { "top" | "bottom"} */
  const vertical = 'top';
  /** @type { "left" | "right"} */
  const horizontal = 'right';

  // 控制波浪小球的起始距离
  const padding = 0;

  // 将视图大小作为波浪小球的大小
  const size = Math.max(
    appBoyRef.value.offsetWidth,
    appBoyRef.value.offsetHeight,
  );
  rippleRef.value.style.width = rippleRef.value.style.height = `${size}px`;

  // 控制波浪小球的初始缩放大小，与css动画对应
  rippleRef.value.style.transform = 'scale(0.01)';

  let x = appBoyRef.value.getBoundingClientRect().left - 40 - size / 2;
  let y = appBoyRef.value.getBoundingClientRect().top - 70 - size / 2;
  x = x + padding;
  y = y + padding;
  // x,y
  // eslint-disable-next-line eqeqeq
  rippleRef.value.style.left = `${horizontal == 'left' ? x : x * -1}px`;
  // eslint-disable-next-line eqeqeq
  rippleRef.value.style.top = `${vertical == 'top' ? y : -padding}px`;
};

const closeAnimation = () => {
  // 关闭动画
  rippleBodyRef.value.style.animation = `reverse-ripple-body-animation ${rippleBodyTime}s linear forwards`;
  setTimeout(
    () => {
      rippleRef.value.style.animation = `reverse-ripple-animation ${rippleTime}s linear forwards`;
    },
    (rippleBodyTime + rippleBodyTimeOffset) * 1000,
  );
};

// 打开动画
const openAnimation = () => {
  // 打开动画
  rippleRef.value.style.animation = `ripple-animation ${rippleTime}s linear forwards`;

  setTimeout(
    () => {
      rippleBodyRef.value.style.animation = `ripple-body-animation ${rippleBodyTime}s linear forwards`;
    },
    (rippleTime + rippleTimeOffset) * 1000,
  );
};

window.addEventListener('resize', () => {
  setRippleSize();
});

onMounted(() => {
  getInfo('init');

  setRippleSize();
});
</script>

<template>
  <div id="appBody" ref="appBoyRef" class="app-body">
    <p>底部内容</p>

    <div
      id="topButton"
      ref="topButtonRef"
      class="top-button"
      @click="openAnimation"
    >
      +
    </div>

    <div id="ripple" ref="rippleRef" class="ripple"></div>

    <div id="ripple-body" ref="rippleBodyRef" class="ripple-bodys">
      <h1 style="color: rgb(255 230 4)">你好</h1>
      <div
        id="backButton"
        ref="backButtonRef"
        class="back-button"
        @click="closeAnimation"
      >
        ↗
      </div>
    </div>
  </div>
</template>

<style>
.app-body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: 18px;
  line-height: 60px;
  color: gray;
  text-align: center;
  cursor: pointer;
  background-color: #f3f4f7;
  border: none;
}

.top-button {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: white;
  cursor: pointer;
  background-color: #6200ea;
  border: none;
  border-radius: 50%;
}

.back-button {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 20px;
  color: white;
  cursor: pointer;
  background-color: #f16f18;
  border: none;
  border-radius: 50%;
}

.ripple {
  position: absolute;
  z-index: 4;

  /* background-color: #6200ea; */
  background-color: #405fe9;
  border-radius: 50%;
  box-shadow: 0 0 10px 1px #508fb9;
}

.ripple-bodys {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #508fb9;
  opacity: 0.5;
}

.back-button {
  padding: 1rem;
  color: brown;
}

@keyframes ripple-animation {
  from {
    transform: scale(0.01);
  }

  to {
    transform: scale(3);
  }
}

@keyframes reverse-ripple-animation {
  from {
    transform: scale(3);
  }

  to {
    transform: scale(0.01);
  }
}

@keyframes ripple-body-animation {
  from {
    z-index: 10;
    opacity: 0;
  }

  to {
    z-index: 10;
    opacity: 1;
  }
}

@keyframes reverse-ripple-body-animation {
  from {
    z-index: 10;
    opacity: 1;
  }

  to {
    z-index: -1;
    opacity: 0;
  }
}
</style>
