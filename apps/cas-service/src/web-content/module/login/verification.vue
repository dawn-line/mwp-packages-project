<template>
  <div class="captcha-container">
    <div v-if="!verified" class="captcha-wrapper">
      <h3>验证码</h3>
      <p>请点击: <span class="target-object">{{ targetDescription }}</span></p>
      <div 
        ref="canvasContainer" 
        class="canvas-container"
        @click="handleCanvasClick"
      ></div>
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <button @click="resetCaptcha" class="reset-button">重置</button>
    </div>
    <div v-else class="success-message">
      <p>验证成功！</p>
      <button @click="resetCaptcha" class="reset-button">重新验证</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default {
  name: 'GeometryCaptcha',
  props: {
    difficulty: {
      type: Number,
      default: 5, // 决定生成多少个物体
    }
  },
  emits: ['verified', 'failed'],
  setup(props, { emit }) {
    const canvasContainer = ref(null);
    const verified = ref(false);
    const errorMessage = ref('');
    const targetDescription = ref('');
    
    // 存储场景相关对象
    const sceneData = ref({
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      objects: [],
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      targetObject: null
    });

    // 可用的颜色和形状
    const colors = [
      { name: '红色', value: 0xff0000 },
      { name: '绿色', value: 0x00ff00 },
      { name: '蓝色', value: 0x0000ff },
      { name: '黄色', value: 0xffff00 },
      { name: '紫色', value: 0x800080 },
      { name: '青色', value: 0x00ffff }
    ];
    
    const shapes = [
      { name: '立方体', creator: createCube },
      { name: '球体', creator: createSphere },
      { name: '圆柱体', creator: createCylinder },
      { name: '锥体', creator: createCone },
      { name: '环形', creator: createTorus }
    ];

    // 初始化3D场景
    const initScene = () => {
      const container = canvasContainer.value;
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      // 创建场景
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      
      // 创建相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 10;
      
      // 创建渲染器
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      
      // 添加轨道控制
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      
      // 添加光源
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // 保存场景数据
      sceneData.value = {
        ...sceneData.value,
        scene,
        camera,
        renderer,
        controls
      };
      
      // 创建物体
      createObjects();
      
      // 开始动画循环
      animate();
    };
    
    // 创建随机位置的多个物体
    const createObjects = () => {
      const { scene } = sceneData.value;
      const objects = [];
      
      // 清空现有物体
      while(scene.children.length > 0) { 
        if(scene.children[0].type === "Mesh") {
          scene.remove(scene.children[0]);
        } else {
          break;
        }
      }
      
      sceneData.value.objects = [];
      
      // 创建随机物体
      for (let i = 0; i < props.difficulty; i++) {
        const randomShapeIndex = Math.floor(Math.random() * shapes.length);
        const randomColorIndex = Math.floor(Math.random() * colors.length);
        
        const shape = shapes[randomShapeIndex];
        const color = colors[randomColorIndex];
        
        const object = shape.creator(color.value);
        
        // 随机位置
        object.position.x = (Math.random() - 0.5) * 8;
        object.position.y = (Math.random() - 0.5) * 8;
        object.position.z = (Math.random() - 0.5) * 8;
        
        // 随机旋转
        object.rotation.x = Math.random() * Math.PI;
        object.rotation.y = Math.random() * Math.PI;
        
        // 添加属性用于识别
        object.userData = {
          shape: shape.name,
          color: color.name
        };
        
        objects.push(object);
        scene.add(object);
      }
      
      sceneData.value.objects = objects;
      
      // 随机选择一个目标物体
      const targetIndex = Math.floor(Math.random() * objects.length);
      const targetObject = objects[targetIndex];
      sceneData.value.targetObject = targetObject;
      
      // 设置目标描述
      targetDescription.value = `${targetObject.userData.color}${targetObject.userData.shape}`;
    };
    
    // 几何体创建函数
    function createCube(color) {
      const geometry = new THREE.BoxGeometry(2, 2, 2);
      const material = new THREE.MeshPhongMaterial({ color });
      return new THREE.Mesh(geometry, material);
    }
    
    function createSphere(color) {
      const geometry = new THREE.SphereGeometry(1, 32, 32);
      const material = new THREE.MeshPhongMaterial({ color });
      return new THREE.Mesh(geometry, material);
    }
    
    function createCylinder(color) {
      const geometry = new THREE.CylinderGeometry(1, 1, 2, 32);
      const material = new THREE.MeshPhongMaterial({ color });
      return new THREE.Mesh(geometry, material);
    }
    
    function createCone(color) {
      const geometry = new THREE.ConeGeometry(1, 2, 32);
      const material = new THREE.MeshPhongMaterial({ color });
      return new THREE.Mesh(geometry, material);
    }
    
    function createTorus(color) {
      const geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
      const material = new THREE.MeshPhongMaterial({ color });
      return new THREE.Mesh(geometry, material);
    }
    
    // 动画循环
    const animate = () => {
      const { renderer, scene, camera, controls, objects } = sceneData.value;
      
      requestAnimationFrame(animate);
      
      // 让物体缓慢旋转
      objects.forEach(object => {
        object.rotation.x += 0.005;
        object.rotation.y += 0.005;
      });
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    // 处理canvas点击
    const handleCanvasClick = (event) => {
      if (verified.value) return;
      
      const { renderer, camera, raycaster, mouse, objects, targetObject } = sceneData.value;
      
      // 计算鼠标位置
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      // 设置射线
      raycaster.setFromCamera(mouse, camera);
      
      // 检测交叉
      const intersects = raycaster.intersectObjects(objects);
      
      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        // 检查是否点击了目标物体
        if (clickedObject === targetObject) {
          verified.value = true;
          errorMessage.value = '';
          emit('verified', true);
        } else {
          errorMessage.value = '验证失败，请重试！';
          emit('failed');
        }
      }
    };
    
    // 重置验证码
    const resetCaptcha = () => {
      verified.value = false;
      errorMessage.value = '';
      
      // 重新创建物体
      nextTick(() => {
        createObjects();
      });
    };
    
    // 组件挂载时初始化
    onMounted(() => {
      nextTick(() => {
        initScene();
      });
    });
    
    return {
      canvasContainer,
      verified,
      errorMessage,
      targetDescription,
      handleCanvasClick,
      resetCaptcha
    };
  }
};
</script>

<style scoped>
.captcha-container {
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin: 0 auto;
}

.canvas-container {
  width: 100%;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-bottom: 10px;
}

.target-object {
  font-weight: bold;
  color: #1890ff;
}

.error-message {
  color: #ff4d4f;
  margin-bottom: 10px;
}

.success-message {
  color: #52c41a;
  text-align: center;
  padding: 20px;
}

.reset-button {
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.reset-button:hover {
  background-color: #40a9ff;
}
</style>
