<script setup lang="ts">
import { JobStatus } from '@/shared/interface/interface';
import { onMounted, reactive, watch } from 'vue';

const props = defineProps({
  width: {
    type: Number,
    default: 300,
  },
  height: {
    type: Number,
    default: 300,
  },
  status: {
    type: () => '' as JobStatus,
    default: 'running',
  },
});
const circle = reactive({
  x: props.width / 2 + 5,
  y: props.height / 2 + 22,
  radius: 90,
  speed: 2,
  rotation: 0,
  angleStart: 270,
  angleEnd: 90,
  hue: 223,
  thickness: 18,
  blur: 25,
});
watch(
  () => props.status,
  () => {
    circle.hue = getHue();
    if (ctx) {
      setProperties(ctx);
    }
  }
);
const getHue = (): number => {
  if (props.status === 'succeed') {
    clearTimer();
    return 110;
  } else if (['failed', 'stopped'].includes(props.status)) {
    clearTimer();
    return 10;
  }
  return 223;
};
let gradient1: any;
let gradient2: any;
let ctx: any;
const particles: any[] = [];
const particleMax = 100;
let timer: NodeJS.Timeout;

const clearTimer = () => {
  setTimeout(() => {
    timer && clearInterval(timer);
  }, 200);
};

/* super inefficient right now, could be improved */
onMounted(() => {
  let c = document.getElementById('loop_img') as HTMLCanvasElement;
  ctx = c?.getContext('2d');

  /* Append Canvas */
  // document.body.appendChild(c);
  if (ctx) {
    /* Set Constant Properties */
    setProperties(ctx);
    /* Loop It, Loop It Good */
    timer = setInterval(loop, 16);
  }
});
const setProperties = function (ctx: any) {
  ctx.shadowBlur = circle.blur;
  ctx.shadowColor = `hsla(${circle.hue}, 93%, 93%, .5)`;
  ctx.lineCap = 'round';

  gradient1 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
  gradient1.addColorStop(0, `hsla(${circle.hue}, 60%, 50%, .25)`);
  gradient1.addColorStop(1, `hsla(${circle.hue}, 70%, 50%, 0)`);

  gradient2 = ctx.createLinearGradient(0, -circle.radius, 0, circle.radius);
  gradient2.addColorStop(0, `hsla(${circle.hue}, 100%, 50%, 0)`);
  gradient2.addColorStop(0.1, `hsla(${circle.hue}, 100%, 100%, .7)`);
  gradient2.addColorStop(1, `hsla(${circle.hue}, 100%, 50%, 0)`);
};
const rand = (a: number, b: number) => {
  return ~~(Math.random() * (b - a + 1) + a);
};
const dToR = (degrees: number) => {
  return degrees * (Math.PI / 180);
};
const updateCircle = function () {
    if (circle.rotation < 360) {
      circle.rotation += circle.speed;
    } else {
      circle.rotation = 0;
    }
  },
  renderCircle = function () {
    ctx.save();
    ctx.translate(circle.x, circle.y);
    ctx.rotate(dToR(circle.rotation));
    ctx.beginPath();
    ctx.arc(0, 0, circle.radius, dToR(circle.angleStart), dToR(circle.angleEnd), true);
    ctx.lineWidth = circle.thickness;
    ctx.strokeStyle = gradient1;
    ctx.stroke();
    ctx.restore();
  },
  renderCircleBorder = function () {
    ctx.save();
    ctx.translate(circle.x, circle.y);
    ctx.rotate(dToR(circle.rotation));
    ctx.beginPath();
    ctx.arc(0, 0, circle.radius + circle.thickness / 2, dToR(circle.angleStart), dToR(circle.angleEnd), true);
    ctx.lineWidth = 2;
    ctx.strokeStyle = gradient2;
    ctx.stroke();
    ctx.restore();
  },
  renderCircleFlare = function () {
    ctx.save();
    ctx.translate(circle.x, circle.y);
    ctx.rotate(dToR(circle.rotation + 185));
    ctx.scale(1, 1);
    ctx.beginPath();
    ctx.arc(0, circle.radius, 30, 0, Math.PI * 2, false);
    ctx.closePath();
    let gradient3 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 30);
    gradient3.addColorStop(0, `hsla(${circle.hue - 10}, 50%, 50%, .35)`);
    gradient3.addColorStop(1, `hsla(${circle.hue - 10}, 50%, 50%, 0)`);
    ctx.fillStyle = gradient3;
    ctx.fill();
    ctx.restore();
  },
  renderCircleFlare2 = function () {
    ctx.save();
    ctx.translate(circle.x, circle.y);
    ctx.rotate(dToR(circle.rotation + 165));
    ctx.scale(1.5, 1);
    ctx.beginPath();
    ctx.arc(0, circle.radius, 25, 0, Math.PI * 2, false);
    ctx.closePath();
    let gradient4 = ctx.createRadialGradient(0, circle.radius, 0, 0, circle.radius, 25);
    gradient4.addColorStop(0, `hsla(${circle.hue + 3}, 100%, 50%, .2)`);
    gradient4.addColorStop(1, `hsla(${circle.hue + 3}, 100%, 50%, 0)`);
    ctx.fillStyle = gradient4;
    ctx.fill();
    ctx.restore();
  },
  createParticles = function () {
    if (particles.length < particleMax) {
      particles.push({
        x: circle.x + circle.radius * Math.cos(dToR(circle.rotation - 85)) + (rand(0, circle.thickness * 2) - circle.thickness),
        y: circle.y + circle.radius * Math.sin(dToR(circle.rotation - 85)) + (rand(0, circle.thickness * 2) - circle.thickness),
        vx: (rand(0, 100) - 50) / 1000,
        vy: (rand(0, 100) - 50) / 1000,
        radius: rand(1, 6) / 2,
        alpha: rand(10, 20) / 100,
      });
    }
  },
  updateParticles = function () {
    let i = particles.length;
    while (i--) {
      let p = particles[i];
      p.vx += (rand(0, 100) - 50) / 750;
      p.vy += (rand(0, 100) - 50) / 750;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.01;

      if (p.alpha < 0.02) {
        particles.splice(i, 1);
      }
    }
  },
  renderParticles = function () {
    let i = particles.length;
    while (i--) {
      let p = particles[i];
      ctx.beginPath();
      ctx.fillRect(p.x, p.y, p.radius, p.radius);
      ctx.closePath();
      ctx.fillStyle = `hsla(0, 0%, 100%, ${p.alpha})`;
    }
  },
  clear = function () {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0, 0, 0, .1)';
    ctx.fillRect(0, 0, props.width, props.height);
    ctx.globalCompositeOperation = 'lighter';
  };
const loop = function () {
  clear();
  updateCircle();
  renderCircle();
  renderCircleBorder();
  renderCircleFlare();
  renderCircleFlare2();
  createParticles();
  updateParticles();
  renderParticles();
};
</script>
<template>
  <div>
    <canvas id="loop_img" :width="width" :height="height"></canvas>
  </div>
</template>
<style lang="scss"></style>
