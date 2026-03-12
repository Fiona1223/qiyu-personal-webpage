<template>
	<div id="qiyu-home">
		<!-- 英雄区（沉浸式视觉核心） -->
		<section class="hero">
			<!-- 动态渐变背景 -->
			<div class="hero-bg"></div>
			<!-- Canvas小鱼动画容器（替换原有小鱼容器） -->
			<div id="jsi-flying-fish-container" class="fish-container" ref="fishContainer"></div>
			<!-- 炫酷粒子装饰 -->
			<div class="particles" ref="particles"></div>
			<!-- 光效装饰 -->
			<div class="light-effect"></div>

			<div class="hero-container">
				<!-- 左侧文字区（带打字机动画） -->
				<div class="hero-text" ref="heroText">
					<h1 class="hero-title">
						<span class="title-char">祁</span>
						<span class="title-char">煜</span>
					</h1>
					<p class="hero-subtitle" ref="subtitle">深海里永不熄灭的焰火</p>
					<p class="hero-desc" ref="desc">
						你相信，海底也会燃起火焰吗？<br />
						他是宇宙写给我的情诗，是唯一的光
					</p>
					<div class="hero-buttons">
						<button class="btn btn-primary">
							<span>进入应援站</span>
							<svg
								class="btn-icon"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>
					</div>
				</div>

				<!-- 右侧人物展示区（核心视觉）- 点击切换图片 -->
				<div class="hero-image" ref="heroImage">
					<div class="image-container">
						<!-- 人物主体（带3D悬浮+点击切换效果） -->
						<div class="character-wrapper" @click="switchCharacterImage">
							<img
								:src="characterImages[currentImageIndex]"
								alt="祁煜"
								class="character-img"
								:class="{ 'image-fade': isImageChanging }"
							/>
							<!-- 人物光效边框 -->
							<div class="character-border"></div>
							<!-- 人物光晕 -->
							<div class="character-glow"></div>
							<!-- 点击提示 -->
							<div class="click-hint">点击切换形象</div>
						</div>
						<!-- 动态装饰元素 -->
						<div class="floating-decor"></div>
					</div>
				</div>
			</div>

			<!-- 滚动提示（更炫酷的动画） -->
			<div class="scroll-tip">
				<span>向下探索</span>
				<div class="scroll-icon"></div>
			</div>
		</section>

		<!-- 轻量展示区（弱化功能，强化展示） -->
		<section class="showcase-section" ref="showcaseSection">
			<div class="section-container">
				<!-- 极简标题 -->
				<h2 class="section-title">
					<span class="title-line"></span>
					关于祁煜
					<span class="title-line"></span>
				</h2>

				<!-- 1. 个人档案（极简展示） -->
				<div class="profile-module">
					<div class="profile-grid">
						<div class="profile-item">
							<span class="profile-label">生日</span>
							<span class="profile-value">6月18日</span>
						</div>
						<div class="profile-item">
							<span class="profile-label">星座</span>
							<span class="profile-value">双子座</span>
						</div>
						<div class="profile-item">
							<span class="profile-label">特长</span>
							<span class="profile-value">唱歌/绘画/配音</span>
						</div>
						<div class="profile-item">
							<span class="profile-label">代表色</span>
							<span class="profile-color" style="background: #7b61ff"></span>
						</div>
					</div>
				</div>

				<!-- 2. 视觉展示模块（炫酷3D轮播） -->
				<div class="gallery-module">
					<div class="carousel-container" ref="carouselContainer">
						<!-- 轮播轨道 -->
						<div
							class="carousel-track"
							:style="{ transform: `translateX(${-currentSlide * 100}%)` }"
						>
							<div class="carousel-slide" v-for="(item, index) in carouselImages" :key="index">
								<div class="slide-img-wrapper">
									<div class="slide-img-inner">
										<img :src="item.url" :alt="item.alt" />
									</div>
									<div class="slide-overlay">
										<h3 class="slide-title">{{ item.title }}</h3>
										<p class="slide-desc">{{ item.desc }}</p>
									</div>
								</div>
							</div>
						</div>

						<!-- 轮播控制按钮 -->
						<button class="carousel-btn prev-btn" @click="prevSlide">
							<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
						</button>
						<button class="carousel-btn next-btn" @click="nextSlide">
							<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>

						<!-- 轮播指示器 -->
						<div class="carousel-indicators">
							<span
								class="indicator"
								v-for="(item, index) in carouselImages"
								:key="index"
								:class="{ active: index === currentSlide }"
								@click="goToSlide(index)"
							></span>
						</div>
					</div>
				</div>

				<!-- 3. 引用展示（自动切换文字） -->
				<div class="quote-module">
					<div class="quote-content" ref="quoteContent">
						<svg class="quote-icon" viewBox="0 0 24 24" fill="#7B61FF">
							<path
								d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zm16-8c0 3-4 8-7 8v-11c0-1.25.756-2.017 2-2h5c1.1 0 2 .9 2 2v6z"
							/>
						</svg>
						<p class="quote-text" :class="{ 'quote-fade': isQuoteChanging }">
							{{ currentQuote.text }}
						</p>
						<p class="quote-author">—— {{ currentQuote.author }}</p>
					</div>
				</div>
			</div>
		</section>

		<!-- 极简页脚 -->
		<footer class="footer">
			<div class="footer-container">
				<p>祁煜 · 深海焰火 © 2025</p>
			</div>
		</footer>
	</div>
</template>

<script>
	export default {
		name: 'QiyuHome',
		data() {
			return {
				// 人物头像列表
				characterImages: [
					'https://picsum.photos/id/1005/800/800',
					'https://picsum.photos/id/1012/800/800',
					'https://picsum.photos/id/1014/800/800',
					'https://picsum.photos/id/1025/800/800',
				],
				currentImageIndex: 0,
				isImageChanging: false,

				// 轮播图片数据
				carouselImages: [
					{
						url: 'https://picsum.photos/id/1010/1200/800',
						alt: '祁煜-深海焰火',
						title: '深海焰火',
						desc: '于深海之中，燃起不灭的焰火',
					},
					{
						url: 'https://picsum.photos/id/1011/1200/800',
						alt: '祁煜-星夜幻想',
						title: '星夜幻想',
						desc: '在星夜下，编织浪漫的幻想',
					},
					{
						url: 'https://picsum.photos/id/1012/1200/800',
						alt: '祁煜-人鱼之约',
						title: '人鱼之约',
						desc: '与深海的人鱼，定下永恒的约定',
					},
					{
						url: 'https://picsum.photos/id/1013/1200/800',
						alt: '祁煜-宇宙情书',
						title: '宇宙情书',
						desc: '写给宇宙的情书，跨越星河而来',
					},
				],
				currentSlide: 0,
				carouselTimer: null,

				// 引用文字列表
				quotes: [
					{
						text: '深海的孤独，因你而有了温度；\n无声的洋流，因你而燃起焰火。',
						author: '致祁煜',
					},
					{
						text: '星河沉入海底，而你照亮了整个深海。',
						author: '深海的诗',
					},
					{
						text: '你的歌声，是深海里最温柔的潮汐。',
						author: '潮汐的回响',
					},
					{
						text: '在无人知晓的深海，你是唯一的光。',
						author: '深海之光',
					},
				],
				currentQuoteIndex: 0,
				currentQuote: {},
				isQuoteChanging: false,
				quoteTimer: null,

				// Canvas小鱼动画相关
				RENDERER: null,
			};
		},
		mounted() {
			// 初始化当前引用
			this.currentQuote = this.quotes[0];

			// 1. 初始化Canvas小鱼动画（替换原有小鱼动画）
			this.initFishRenderer();
			// 2. 初始化粒子动画
			this.createParticles();
			// 3. 初始化文字动画
			this.initTextAnimations();
			// 4. 元素渐入动画
			this.initElementAnimations();
			// 5. 滚动监听
			window.addEventListener('scroll', this.handleScroll);
			// 6. 鼠标跟随效果
			this.initMouseFollow();
			// 7. 启动轮播自动播放
			this.startCarousel();
			// 8. 启动引用自动切换
			this.startQuoteRotation();

			// 监听窗口大小变化，重新调整小鱼动画
			window.addEventListener('resize', () => {
				if (this.RENDERER && this.RENDERER.setup) {
					this.RENDERER.setup();
				}
			});
		},
		beforeDestroy() {
			window.removeEventListener('scroll', this.handleScroll);
			window.removeEventListener('resize', () => {
				if (this.RENDERER && this.RENDERER.setup) {
					this.RENDERER.setup();
				}
			});
			// 清除定时器
			if (this.carouselTimer) clearInterval(this.carouselTimer);
			if (this.quoteTimer) clearInterval(this.quoteTimer);
		},
		methods: {
			// ========== 核心修改：Canvas小鱼动画实现（优化版） ==========
			initFishRenderer() {
				const self = this;

				// 定义小鱼渲染器 - 优化参数，降低波动和速度
				this.RENDERER = {
					POINT_INTERVAL: 8, // 增加点间距，减少波动细节
					FISH_COUNT: 5, // 减少鱼的数量，更简洁
					MAX_INTERVAL_COUNT: 80, // 延长鱼的生成间隔
					INIT_HEIGHT_RATE: 0.5,
					THRESHOLD: 80, // 增大阈值，减少触发波动的范围
					WATCH_INTERVAL: 300,

					init: function () {
						this.setParameters();
						this.reconstructMethods();
						this.setup();
						this.bindEvent();
						this.render();
					},
					setParameters: function () {
						this.$window = window;
						this.$document = document.body;
						this.$container = document.getElementById('jsi-flying-fish-container');
						this.$canvas = document.createElement('canvas');
						this.$container.appendChild(this.$canvas);
						this.context = this.$canvas.getContext('2d');
						this.points = [];
						this.fishes = [];
						this.watchIds = [];
					},
					createSurfacePoints: function () {
						var count = Math.round(this.width / this.POINT_INTERVAL);
						this.pointInterval = this.width / (count - 1);
						this.points.push(new self.SURFACE_POINT(this, 0));

						for (var i = 1; i < count; i++) {
							var point = new self.SURFACE_POINT(this, i * this.pointInterval),
								previous = this.points[i - 1];

							point.setPreviousPoint(previous);
							previous.setNextPoint(point);
							this.points.push(point);
						}
					},
					reconstructMethods: function () {
						this.watchWindowSize = this.watchWindowSize.bind(this);
						this.jdugeToStopResize = this.jdugeToStopResize.bind(this);
						this.startEpicenter = this.startEpicenter.bind(this);
						this.moveEpicenter = this.moveEpicenter.bind(this);
						this.reverseVertical = this.reverseVertical.bind(this);
						this.render = this.render.bind(this);
					},
					setup: function () {
						this.points.length = 0;
						this.fishes.length = 0;
						this.watchIds.length = 0;
						this.intervalCount = this.MAX_INTERVAL_COUNT;
						this.width = this.$container.offsetWidth;
						this.height = this.$container.offsetHeight;
						// 根据容器大小调整鱼的数量（优化版）
						this.fishCount = Math.max(
							2,
							Math.round((((this.FISH_COUNT * this.width) / 800) * this.height) / 800)
						);
						this.$canvas.width = this.width;
						this.$canvas.height = this.height;
						this.reverse = false;

						this.fishes.push(new self.FISH(this));
						this.createSurfacePoints();
					},
					watchWindowSize: function () {
						this.clearTimer();
						this.tmpWidth = this.$window.innerWidth;
						this.tmpHeight = this.$window.innerHeight;
						this.watchIds.push(setTimeout(this.jdugeToStopResize, this.WATCH_INTERVAL));
					},
					clearTimer: function () {
						while (this.watchIds.length > 0) {
							clearTimeout(this.watchIds.pop());
						}
					},
					jdugeToStopResize: function () {
						var width = this.$window.innerWidth,
							height = this.$window.innerHeight,
							stopped = width == this.tmpWidth && height == this.tmpHeight;

						this.tmpWidth = width;
						this.tmpHeight = height;

						if (stopped) {
							this.setup();
						}
					},
					bindEvent: function () {
						this.$window.addEventListener('resize', this.watchWindowSize);
						this.$container.addEventListener('click', this.reverseVertical);
						this.$container.addEventListener('mouseenter', this.startEpicenter);
						this.$container.addEventListener('mousemove', this.moveEpicenter);
					},
					getAxis: function (event) {
						var rect = this.$container.getBoundingClientRect();
						return {
							x: event.clientX - rect.left,
							y: event.clientY - rect.top,
						};
					},
					startEpicenter: function (event) {
						this.axis = this.getAxis(event);
					},
					moveEpicenter: function (event) {
						var axis = this.getAxis(event);

						if (!this.axis) {
							this.axis = axis;
						}
						// 降低鼠标移动触发的波动幅度
						this.generateEpicenter(axis.x, axis.y, (axis.y - this.axis.y) * 0.3);
						this.axis = axis;
					},
					generateEpicenter: function (x, y, velocity) {
						if (y < this.height / 2 - this.THRESHOLD || y > this.height / 2 + this.THRESHOLD) {
							return;
						}
						var index = Math.round(x / this.pointInterval);

						if (index < 0 || index >= this.points.length) {
							return;
						}
						this.points[index].interfere(y, velocity);
					},
					reverseVertical: function () {
						this.reverse = !this.reverse;

						for (var i = 0, count = this.fishes.length; i < count; i++) {
							this.fishes[i].reverseVertical();
						}
					},
					controlStatus: function () {
						for (var i = 0, count = this.points.length; i < count; i++) {
							this.points[i].updateSelf();
						}
						for (var i = 0, count = this.points.length; i < count; i++) {
							this.points[i].updateNeighbors();
						}
						if (this.fishes.length < this.fishCount) {
							if (--this.intervalCount == 0) {
								this.intervalCount = this.MAX_INTERVAL_COUNT;
								this.fishes.push(new self.FISH(this));
							}
						}
					},
					render: function () {
						requestAnimationFrame(this.render);
						this.controlStatus();
						this.context.clearRect(0, 0, this.width, this.height);
						// 优化鱼的颜色，更柔和的紫色调
						this.context.fillStyle = 'rgba(123, 97, 255, 0.6)';

						for (var i = 0, count = this.fishes.length; i < count; i++) {
							this.fishes[i].render(this.context);
						}
						this.context.save();
						this.context.globalCompositeOperation = 'xor';
						this.context.beginPath();
						this.context.moveTo(0, this.reverse ? 0 : this.height);

						for (var i = 0, count = this.points.length; i < count; i++) {
							this.points[i].render(this.context);
						}
						this.context.lineTo(this.width, this.reverse ? 0 : this.height);
						this.context.closePath();
						this.context.fill();
						this.context.restore();
					},
				};

				// 定义水面点类 - 优化参数，大幅降低水波幅度
				this.SURFACE_POINT = function (renderer, x) {
					this.renderer = renderer;
					this.x = x;
					this.init();
				};

				this.SURFACE_POINT.prototype = {
					SPRING_CONSTANT: 0.01, // 降低弹簧常数，减少波动
					SPRING_FRICTION: 0.95, // 增加摩擦力，更快衰减
					WAVE_SPREAD: 0.15, // 降低波的传播速度
					ACCELARATION_RATE: 0.003, // 降低加速度，减少波动幅度

					init: function () {
						this.initHeight = this.renderer.height * this.renderer.INIT_HEIGHT_RATE;
						this.height = this.initHeight;
						this.fy = 0;
						this.force = { previous: 0, next: 0 };
					},
					setPreviousPoint: function (previous) {
						this.previous = previous;
					},
					setNextPoint: function (next) {
						this.next = next;
					},
					interfere: function (y, velocity) {
						this.fy =
							this.renderer.height *
							this.ACCELARATION_RATE *
							(this.renderer.height - this.height - y >= 0 ? -1 : 1) *
							Math.abs(velocity);
					},
					updateSelf: function () {
						this.fy += this.SPRING_CONSTANT * (this.initHeight - this.height);
						this.fy *= this.SPRING_FRICTION;
						this.height += this.fy;
					},
					updateNeighbors: function () {
						if (this.previous) {
							this.force.previous = this.WAVE_SPREAD * (this.height - this.previous.height);
						}
						if (this.next) {
							this.force.next = this.WAVE_SPREAD * (this.height - this.next.height);
						}
					},
					render: function (context) {
						if (this.previous) {
							this.previous.height += this.force.previous;
							this.previous.fy += this.force.previous;
						}
						if (this.next) {
							this.next.height += this.force.next;
							this.next.fy += this.force.next;
						}
						context.lineTo(this.x, this.renderer.height - this.height);
					},
				};

				// 定义鱼类 - 优化参数，减慢鱼的速度
				this.FISH = function (renderer) {
					this.renderer = renderer;
					this.init();
				};

				this.FISH.prototype = {
					GRAVITY: 0.15, // 降低重力，减少上下浮动

					init: function () {
						this.direction = Math.random() < 0.5;
						this.x = this.direction
							? this.renderer.width + this.renderer.THRESHOLD
							: -this.renderer.THRESHOLD;
						this.previousY = this.y;
						// 大幅降低水平速度
						this.vx = this.getRandomValue(1.5, 3.5) * (this.direction ? -1 : 1);

						if (this.renderer.reverse) {
							this.y = this.getRandomValue(
								(this.renderer.height * 1) / 10,
								(this.renderer.height * 4) / 10
							);
							this.vy = this.getRandomValue(0.5, 1.5); // 降低垂直速度
							this.ay = this.getRandomValue(0.01, 0.05); // 降低加速度
						} else {
							this.y = this.getRandomValue(
								(this.renderer.height * 6) / 10,
								(this.renderer.height * 9) / 10
							);
							this.vy = this.getRandomValue(-1.5, -0.5); // 降低垂直速度
							this.ay = this.getRandomValue(-0.05, -0.01); // 降低加速度
						}
						this.isOut = false;
						this.theta = 0;
						this.phi = 0;
					},
					getRandomValue: function (min, max) {
						return min + (max - min) * Math.random();
					},
					reverseVertical: function () {
						this.isOut = !this.isOut;
						this.ay *= -1;
					},
					controlStatus: function (context) {
						this.previousY = this.y;
						this.x += this.vx;
						this.y += this.vy;
						this.vy += this.ay;

						if (this.renderer.reverse) {
							if (this.y > this.renderer.height * this.renderer.INIT_HEIGHT_RATE) {
								this.vy -= this.GRAVITY;
								this.isOut = true;
							} else {
								if (this.isOut) {
									this.ay = this.getRandomValue(0.01, 0.05);
								}
								this.isOut = false;
							}
						} else {
							if (this.y < this.renderer.height * this.renderer.INIT_HEIGHT_RATE) {
								this.vy += this.GRAVITY;
								this.isOut = true;
							} else {
								if (this.isOut) {
									this.ay = this.getRandomValue(-0.05, -0.01);
								}
								this.isOut = false;
							}
						}
						if (!this.isOut) {
							this.theta += Math.PI / 60; // 减慢鱼鳍摆动速度
							this.theta %= Math.PI * 2;
							this.phi += Math.PI / 80; // 减慢尾部摆动速度
							this.phi %= Math.PI * 2;
						}
						this.renderer.generateEpicenter(
							this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD,
							this.y,
							(this.y - this.previousY) * 0.5 // 降低鱼触发的水波幅度
						);

						if (
							(this.vx > 0 && this.x > this.renderer.width + this.renderer.THRESHOLD) ||
							(this.vx < 0 && this.x < -this.renderer.THRESHOLD)
						) {
							this.init();
						}
					},
					render: function (context) {
						context.save();
						context.translate(this.x, this.y);
						context.rotate(Math.PI + Math.atan2(this.vy, this.vx));
						context.scale(1, this.direction ? 1 : -1);
						context.beginPath();
						context.moveTo(-30, 0);
						context.bezierCurveTo(-20, 15, 15, 10, 40, 0);
						context.bezierCurveTo(15, -10, -20, -15, -30, 0);
						context.fill();

						context.save();
						context.translate(40, 0);
						context.scale(0.9 + 0.2 * Math.sin(this.theta), 1);
						context.beginPath();
						context.moveTo(0, 0);
						context.quadraticCurveTo(5, 10, 20, 8);
						context.quadraticCurveTo(12, 5, 10, 0);
						context.quadraticCurveTo(12, -5, 20, -8);
						context.quadraticCurveTo(5, -10, 0, 0);
						context.fill();
						context.restore();

						context.save();
						context.translate(-3, 0);
						context.rotate(
							(Math.PI / 3 + (Math.PI / 10) * Math.sin(this.phi)) * (this.renderer.reverse ? -1 : 1)
						);

						context.beginPath();

						if (this.renderer.reverse) {
							context.moveTo(5, 0);
							context.bezierCurveTo(10, 10, 10, 30, 0, 40);
							context.bezierCurveTo(-12, 25, -8, 10, 0, 0);
						} else {
							context.moveTo(-5, 0);
							context.bezierCurveTo(-10, -10, -10, -30, 0, -40);
							context.bezierCurveTo(12, -25, 8, -10, 0, 0);
						}
						context.closePath();
						context.fill();
						context.restore();
						context.restore();
						this.controlStatus(context);
					},
				};

				// 初始化小鱼渲染器
				this.RENDERER.init();
			},

			// ========== 原有功能保持不变 ==========
			// 头像切换功能
			switchCharacterImage() {
				this.isImageChanging = true;

				// 切换索引
				this.currentImageIndex = (this.currentImageIndex + 1) % this.characterImages.length;

				// 动画结束后重置状态
				setTimeout(() => {
					this.isImageChanging = false;
				}, 500);
			},

			// 轮播相关方法
			startCarousel() {
				this.carouselTimer = setInterval(() => {
					this.nextSlide();
				}, 6000); // 延长轮播间隔，更舒缓
			},

			nextSlide() {
				// 添加过渡动画类
				const track = this.$refs.carouselContainer?.querySelector('.carousel-track');
				if (track) track.classList.add('carousel-animate');

				this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
				this.resetCarouselTimer();

				// 动画结束后移除类
				setTimeout(() => {
					if (track) track.classList.remove('carousel-animate');
				}, 800);
			},

			prevSlide() {
				// 添加过渡动画类
				const track = this.$refs.carouselContainer?.querySelector('.carousel-track');
				if (track) track.classList.add('carousel-animate');

				this.currentSlide =
					(this.currentSlide - 1 + this.carouselImages.length) % this.carouselImages.length;
				this.resetCarouselTimer();

				// 动画结束后移除类
				setTimeout(() => {
					if (track) track.classList.remove('carousel-animate');
				}, 800);
			},

			goToSlide(index) {
				const track = this.$refs.carouselContainer?.querySelector('.carousel-track');
				if (track) track.classList.add('carousel-animate');

				this.currentSlide = index;
				this.resetCarouselTimer();

				setTimeout(() => {
					if (track) track.classList.remove('carousel-animate');
				}, 800);
			},

			resetCarouselTimer() {
				clearInterval(this.carouselTimer);
				this.startCarousel();
			},

			// 引用自动切换
			startQuoteRotation() {
				this.quoteTimer = setInterval(() => {
					this.changeQuote();
				}, 8000); // 延长引用切换间隔
			},

			changeQuote() {
				this.isQuoteChanging = true;

				// 切换索引
				this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
				this.currentQuote = this.quotes[this.currentQuoteIndex];

				// 动画结束后重置状态
				setTimeout(() => {
					this.isQuoteChanging = false;
				}, 800);
			},

			// 创建粒子效果（优化版）
			createParticles() {
				const particlesContainer = this.$refs.particles;
				if (!particlesContainer) return;

				// 减少粒子数量，更简洁
				for (let i = 0; i < 30; i++) {
					const particle = document.createElement('div');
					particle.className = 'particle';

					// 随机样式 - 优化参数，更柔和
					const size = Math.random() * 4 + 1;
					const isCircle = Math.random() > 0.5;
					particle.style.cssText = `
						left: ${Math.random() * 100}%;
						top: ${Math.random() * 100}%;
						width: ${size}px;
						height: ${size}px;
						background: ${isCircle ? '#7B61FF' : '#C850C0'};
						border-radius: ${isCircle ? '50%' : '0'};
						opacity: ${Math.random() * 0.5 + 0.1}; // 降低不透明度，更柔和
						animation: particleFloat ${Math.random() * 30 + 20}s infinite linear; // 减慢粒子漂浮速度
						animation-delay: ${Math.random() * 5}s;
					`;

					particlesContainer.appendChild(particle);
				}
			},

			// 打字机文字动画
			initTextAnimations() {
				const subtitle = this.$refs.subtitle;
				if (!subtitle) return;

				const text = subtitle.textContent;
				subtitle.textContent = '';
				let index = 0;

				const typeWriter = () => {
					if (index < text.length) {
						subtitle.textContent += text.charAt(index);
						index++;
						setTimeout(typeWriter, 150); // 减慢打字机速度
					}
				};

				setTimeout(typeWriter, 800);
			},

			// 元素渐入动画
			initElementAnimations() {
				// 文字区渐入
				setTimeout(() => {
					if (this.$refs.heroText) this.$refs.heroText.classList.add('fade-in');
				}, 300);

				// 图片区渐入
				setTimeout(() => {
					if (this.$refs.heroImage) this.$refs.heroImage.classList.add('fade-in');
				}, 800);

				// 展示区自动显示
				setTimeout(() => {
					if (this.$refs.showcaseSection) this.$refs.showcaseSection.classList.add('show');
				}, 1500);
			},

			// 滚动监听
			handleScroll() {
				const scrollTop = window.scrollY;
				const heroBg = document.querySelector('.hero-bg');
				const lightEffect = document.querySelector('.light-effect');

				// 背景视差（优化版，更缓慢）
				if (heroBg && scrollTop < window.innerHeight) {
					heroBg.style.transform = `translateY(${scrollTop * 0.08}px)`; // 降低视差幅度
				}

				// 光效跟随
				if (lightEffect && scrollTop < window.innerHeight) {
					lightEffect.style.opacity = 1 - scrollTop / (window.innerHeight * 1.5); // 更缓慢的淡出
				}

				// 展示区动画
				const showcaseSection = this.$refs.showcaseSection;
				if (showcaseSection && scrollTop > 100) {
					showcaseSection.classList.add('show');
				}
			},

			// 鼠标跟随效果（优化版，更柔和）
			initMouseFollow() {
				const heroImage = this.$refs.heroImage;
				if (!heroImage) return;

				document.addEventListener('mousemove', (e) => {
					// 降低鼠标跟随幅度，更柔和
					const x = (e.clientX - window.innerWidth / 2) / 50;
					const y = (e.clientY - window.innerHeight / 2) / 50;

					const characterWrapper = heroImage.querySelector('.character-wrapper');
					if (characterWrapper && !this.isImageChanging) {
						characterWrapper.style.transform = `translate(${x}px, ${y}px) rotateY(${
							x / 3
						}deg) rotateX(${-y / 3}deg)`; // 降低旋转角度
					}
				});
			},
		},
	};
</script>

<style>
	/* 全局重置 */
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		font-family: 'Microsoft Yahei', 'PingFang SC', sans-serif;
	}

	html,
	body {
		height: 100%;
		overflow-x: hidden;
		background: #0a0a1a;
	}

	#qiyu-home {
		min-height: 100vh;
	}

	/* 英雄区核心样式 */
	.hero {
		height: 100vh;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	/* 动态渐变背景（优化版，更柔和的渐变） */
	.hero-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #0f1642, #2a1659, #411b70);
		background-size: 300% 300%; /* 减小渐变范围，更稳定 */
		animation: gradientShift 30s ease infinite; /* 减慢渐变速度 */
		transition: transform 0.2s ease-out; /* 更平滑的过渡 */
		z-index: 1;
	}

	@keyframes gradientShift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	/* Canvas小鱼动画容器样式（优化版） */
	.fish-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		pointer-events: none;
		opacity: 0.7; /* 降低不透明度，更融入背景 */
	}

	/* 粒子效果（优化版） */
	.particles {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		pointer-events: none;
	}

	.particle {
		position: absolute;
		animation: particleFloat infinite linear;
	}

	@keyframes particleFloat {
		0% {
			transform: translateY(100vh) rotate(0deg);
		}
		100% {
			transform: translateY(-10vh) rotate(360deg);
		}
	}

	/* 光效装饰（优化版，更柔和） */
	.light-effect {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 900px;
		height: 900px;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, rgba(123, 97, 255, 0.15) 0%, rgba(123, 97, 255, 0) 70%);
		border-radius: 50%;
		z-index: 3;
		transition: opacity 0.8s ease-out; /* 更平滑的过渡 */
	}

	/* 英雄区容器 */
	.hero-container {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 响应式布局 */
	@media (min-width: 992px) {
		.hero-container {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 100%;
		}
		.hero-text {
			width: 45%;
			opacity: 0;
			transform: translateY(30px);
			transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 更慢的动画 */
		}
		.hero-image {
			width: 50%;
			opacity: 0;
			transform: translateY(50px) scale(0.95);
			transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s; /* 更慢的动画 */
		}
	}

	@media (max-width: 991px) {
		.hero-container {
			padding: 0 20px;
		}
		.hero-text {
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out; /* 更平滑的动画 */
			margin-bottom: 60px;
			text-align: center;
		}
		.hero-image {
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out 0.3s; /* 更平滑的动画 */
			width: 80%;
			margin: 0 auto;
		}
	}

	/* 渐入动画 */
	.fade-in {
		opacity: 1 !important;
		transform: translate(0) scale(1) !important;
	}

	/* 文字区样式 */
	.hero-title {
		font-size: clamp(4rem, 10vw, 7rem);
		font-weight: 900;
		color: #ffffff;
		line-height: 1.1;
		margin-bottom: 20px;
		text-shadow: 0 0 20px rgba(123, 97, 255, 0.2); /* 降低阴影强度 */
	}

	.title-char {
		display: inline-block;
		animation: titleFloat 4s ease-in-out infinite; /* 减慢浮动动画 */
	}

	.title-char:nth-child(2) {
		animation-delay: 0.5s;
	}

	@keyframes titleFloat {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-8px); /* 减小浮动幅度 */
		}
	}

	.hero-subtitle {
		font-size: clamp(1.2rem, 3vw, 2rem);
		color: #e0d7ff;
		margin-bottom: 25px;
		letter-spacing: 2px;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15); /* 降低阴影强度 */
	}

	.hero-desc {
		font-size: clamp(1rem, 2vw, 1.2rem);
		color: #ffffff;
		line-height: 1.8;
		margin-bottom: 40px;
		opacity: 0.9;
	}

	/* 按钮样式 */
	.hero-buttons {
		display: flex;
		justify-content: flex-start;
	}

	@media (max-width: 991px) {
		.hero-buttons {
			justify-content: center;
		}
	}

	.btn {
		padding: 15px 40px;
		border-radius: 50px;
		border: none;
		font-size: 18px;
		font-weight: 700;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 更慢的过渡 */
		display: flex;
		align-items: center;
		gap: 10px;
		position: relative;
		overflow: hidden;
	}

	.btn-primary {
		background: linear-gradient(90deg, #7b61ff, #c850c0);
		color: white;
		box-shadow: 0 10px 30px rgba(123, 97, 255, 0.2); /* 降低阴影强度 */
	}

	.btn-primary::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
		transition: all 0.8s ease; /* 减慢流光速度 */
	}

	.btn-primary:hover {
		transform: translateY(-5px) scale(1.03); /* 减小缩放幅度 */
		box-shadow: 0 15px 40px rgba(123, 97, 255, 0.3); /* 降低阴影强度 */
	}

	.btn-primary:hover::before {
		left: 100%;
	}

	.btn-icon {
		width: 20px;
		height: 20px;
		transition: transform 0.4s ease; /* 更慢的过渡 */
	}

	.btn:hover .btn-icon {
		transform: translateX(5px);
	}

	/* 人物展示区 */
	.image-container {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.character-wrapper {
		position: relative;
		width: clamp(280px, 80%, 500px);
		aspect-ratio: 1/1;
		border-radius: 50%;
		overflow: hidden;
		transition: transform 0.3s ease-out; /* 更慢的过渡 */
		transform-style: preserve-3d;
		box-shadow: 0 20px 60px rgba(123, 97, 255, 0.15); /* 降低阴影强度 */
		cursor: pointer;
	}

	.character-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: translateZ(20px);
		transition: opacity 0.5s ease, transform 0.5s ease;
	}

	.image-fade {
		opacity: 0;
		transform: translateZ(20px) scale(1.05); /* 减小缩放幅度 */
	}

	.click-hint {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.6); /* 降低不透明度 */
		font-size: 14px;
		animation: hintPulse 3s ease-in-out infinite; /* 减慢提示动画 */
		z-index: 5;
	}

	@keyframes hintPulse {
		0%,
		100% {
			opacity: 0.6;
			transform: translateX(-50%) scale(1);
		}
		50% {
			opacity: 0.9;
			transform: translateX(-50%) scale(1.03); /* 减小缩放幅度 */
		}
	}

	.character-border {
		position: absolute;
		top: -5px;
		left: -5px;
		right: -5px;
		bottom: -5px;
		border: 2px solid rgba(123, 97, 255, 0.4); /* 降低边框不透明度 */
		border-radius: 50%;
		animation: borderPulse 4s ease-in-out infinite; /* 减慢边框动画 */
		transform: translateZ(10px);
	}

	@keyframes borderPulse {
		0%,
		100% {
			opacity: 0.4;
			transform: scale(1) translateZ(10px);
		}
		50% {
			opacity: 0.8;
			transform: scale(1.01) translateZ(10px); /* 减小缩放幅度 */
		}
	}

	.character-glow {
		position: absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(circle, rgba(123, 97, 255, 0.2) 0%, rgba(123, 97, 255, 0) 70%);
		border-radius: 50%;
		z-index: -1;
		animation: glowPulse 6s ease-in-out infinite; /* 减慢光晕动画 */
	}

	@keyframes glowPulse {
		0%,
		100% {
			opacity: 0.5;
		}
		50% {
			opacity: 0.8;
		}
	}

	.floating-decor {
		position: absolute;
		top: 20%;
		right: 10%;
		width: 70px; /* 减小装饰大小 */
		height: 70px;
		background: linear-gradient(45deg, #7b61ff, #c850c0);
		border-radius: 50%;
		opacity: 0.2; /* 降低不透明度 */
		animation: decorFloat 8s ease-in-out infinite; /* 减慢装饰动画 */
	}

	@keyframes decorFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		50% {
			transform: translateY(-15px) rotate(180deg); /* 减小浮动幅度 */
		}
	}

	/* 滚动提示 */
	.scroll-tip {
		position: absolute;
		bottom: 50px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		color: white;
		text-align: center;
		animation: scrollBounce 3s infinite; /* 减慢滚动提示动画 */
	}

	.scroll-icon {
		width: 24px;
		height: 40px;
		border: 2px solid white;
		border-radius: 30px;
		margin: 15px auto;
		position: relative;
	}

	.scroll-icon::after {
		content: '';
		position: absolute;
		top: 8px;
		left: 50%;
		transform: translateX(-50%);
		width: 6px;
		height: 10px;
		background: white;
		border-radius: 3px;
		animation: scrollDown 2.5s infinite; /* 减慢滚动图标动画 */
	}

	@keyframes scrollBounce {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
		}
		50% {
			transform: translateX(-50%) translateY(-10px); /* 减小弹跳幅度 */
		}
	}

	@keyframes scrollDown {
		0% {
			transform: translateX(-50%) translateY(0);
			opacity: 1;
		}
		100% {
			transform: translateX(-50%) translateY(12px); /* 减小下落距离 */
			opacity: 0;
		}
	}

	/* 展示区样式 */
	.showcase-section {
		padding: 120px 20px;
		background: #0a0a1a;
		opacity: 0;
		transform: translateY(80px);
		transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 更慢的动画 */
	}

	.showcase-section.show {
		opacity: 1;
		transform: translateY(0);
	}

	.section-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.section-title {
		font-size: clamp(1.8rem, 4vw, 2.8rem);
		color: white;
		text-align: center;
		margin-bottom: 80px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}

	.title-line {
		width: 80px;
		height: 2px;
		background: linear-gradient(90deg, transparent, #7b61ff, transparent);
	}

	/* 个人档案模块 */
	.profile-module {
		background: rgba(255, 255, 255, 0.02); /* 降低背景不透明度 */
		padding: 40px;
		border-radius: 20px;
		margin-bottom: 80px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(123, 97, 255, 0.08); /* 降低边框不透明度 */
	}

	.profile-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 30px;
		justify-items: center;
	}

	.profile-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	.profile-label {
		font-size: 14px;
		color: #adb5bd;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.profile-value {
		font-size: 18px;
		font-weight: 600;
		color: white;
	}

	.profile-color {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		box-shadow: 0 0 15px rgba(123, 97, 255, 0.4); /* 降低阴影强度 */
	}

	/* 优化版轮播图样式 */
	.gallery-module {
		margin-bottom: 80px;
	}

	.carousel-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2); /* 降低阴影强度 */
		perspective: 1500px;
	}

	.carousel-track {
		display: flex;
		width: 100%;
		height: 500px;
		transition: transform 0.6s ease-out; /* 更慢的过渡 */
		transform-style: preserve-3d;
	}

	/* 轮播动画增强 */
	.carousel-animate {
		transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1); /* 更慢的动画 */
	}

	.carousel-slide {
		flex: 0 0 100%;
		width: 100%;
		height: 100%;
		position: relative;
		transform-style: preserve-3d;
	}

	.slide-img-wrapper {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.slide-img-inner {
		width: 100%;
		height: 100%;
		transition: transform 12s ease; /* 更慢的缩放动画 */
	}

	.carousel-slide:hover .slide-img-inner {
		transform: scale(1.03); /* 减小缩放幅度 */
	}

	.slide-img-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.slide-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 60px 40px;
		background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent); /* 降低遮罩不透明度 */
		color: white;
		transform: translateY(10px); /* 减小初始偏移 */
		opacity: 0;
		transition: all 0.8s ease-out; /* 更慢的过渡 */
	}

	.carousel-slide:hover .slide-overlay {
		transform: translateY(0);
		opacity: 1;
	}

	.slide-title {
		font-size: 2.5rem;
		font-weight: 800;
		margin-bottom: 15px;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4); /* 降低阴影强度 */
		transform: translateY(8px); /* 减小初始偏移 */
		transition: transform 0.8s ease 0.2s; /* 更慢的过渡 */
	}

	.carousel-slide:hover .slide-title {
		transform: translateY(0);
	}

	.slide-desc {
		font-size: 1.2rem;
		opacity: 0.9;
		text-shadow: 0 1px 4px rgba(0, 0, 0, 0.4); /* 降低阴影强度 */
		transform: translateY(8px); /* 减小初始偏移 */
		transition: transform 0.8s ease 0.3s; /* 更慢的过渡 */
	}

	.carousel-slide:hover .slide-desc {
		transform: translateY(0);
	}

	/* 轮播控制按钮 */
	.carousel-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%) scale(0.8);
		width: 60px;
		height: 60px;
		border-radius: 50%;
		background: rgba(123, 97, 255, 0.2); /* 降低背景不透明度 */
		border: 2px solid rgba(255, 255, 255, 0.4); /* 降低边框不透明度 */
		color: white;
		cursor: pointer;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 更慢的过渡 */
		backdrop-filter: blur(10px);
		opacity: 0;
	}

	.carousel-container:hover .carousel-btn {
		transform: translateY(-50%) scale(1);
		opacity: 1;
	}

	.carousel-btn:hover {
		background: rgba(123, 97, 255, 0.6); /* 降低背景不透明度 */
		transform: translateY(-50%) scale(1.05); /* 减小缩放幅度 */
		border-color: white;
	}

	.prev-btn {
		left: 30px;
	}

	.next-btn {
		right: 30px;
	}

	.carousel-btn svg {
		width: 24px;
		height: 24px;
	}

	/* 轮播指示器 */
	.carousel-indicators {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%) translateY(20px);
		display: flex;
		gap: 15px;
		z-index: 10;
		opacity: 0;
		transition: all 0.5s ease-out; /* 更慢的过渡 */
	}

	.carousel-container:hover .carousel-indicators {
		transform: translateX(-50%) translateY(0);
		opacity: 1;
	}

	.indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.4); /* 降低背景不透明度 */
		cursor: pointer;
		transition: all 0.4s ease; /* 更慢的过渡 */
		transform: scale(0.8);
	}

	.indicator.active {
		background: #7b61ff;
		transform: scale(1.2); /* 减小缩放幅度 */
		box-shadow: 0 0 8px rgba(123, 97, 255, 0.6); /* 降低阴影强度 */
	}

	.indicator:hover {
		transform: scale(1);
		background: rgba(255, 255, 255, 0.7); /* 降低背景不透明度 */
	}

	/* 引用模块 */
	.quote-module {
		background: linear-gradient(135deg, rgba(123, 97, 255, 0.08), rgba(200, 80, 192, 0.08));
		padding: 60px 40px;
		border-radius: 20px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(123, 97, 255, 0.08); /* 降低边框不透明度 */
		margin-bottom: 40px;
	}

	.quote-content {
		max-width: 800px;
		margin: 0 auto;
		text-align: center;
	}

	.quote-icon {
		width: 40px;
		height: 40px;
		margin-bottom: 20px;
		opacity: 0.4; /* 降低不透明度 */
	}

	.quote-text {
		font-size: clamp(1.2rem, 3vw, 1.8rem);
		color: white;
		line-height: 1.8;
		margin-bottom: 20px;
		font-style: italic;
		transition: opacity 1s ease-out, transform 1s ease-out; /* 更慢的过渡 */
	}

	.quote-fade {
		opacity: 0;
		transform: translateY(15px); /* 减小偏移幅度 */
	}

	.quote-author {
		font-size: 1rem;
		color: #e0d7ff;
		opacity: 0.7; /* 降低不透明度 */
	}

	/* 页脚 */
	.footer {
		background: #050510;
		padding: 40px 20px;
		text-align: center;
	}

	.footer-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer p {
		color: rgba(255, 255, 255, 0.4); /* 降低不透明度 */
		font-size: 14px;
	}

	/* 滚动条美化 */
	::-webkit-scrollbar {
		width: 8px;
	}

	::-webkit-scrollbar-track {
		background: #0a0a1a;
	}

	::-webkit-scrollbar-thumb {
		background: #7b61ff;
		border-radius: 4px;
	}

	::-webkit-scrollbar-thumb:hover {
		background: #c850c0;
	}

	/* 响应式适配 */
	@media (max-width: 768px) {
		.carousel-track {
			height: 300px;
		}
		.slide-title {
			font-size: 1.8rem;
		}
		.slide-desc {
			font-size: 1rem;
		}
		.carousel-btn {
			width: 40px;
			height: 40px;
		}
		.prev-btn {
			left: 15px;
		}
		.next-btn {
			right: 15px;
		}
		/* 移动端轮播交互优化 */
		.carousel-btn {
			opacity: 0.6; /* 降低不透明度 */
			transform: translateY(-50%) scale(1);
		}
		.carousel-indicators {
			opacity: 0.6; /* 降低不透明度 */
			transform: translateX(-50%) translateY(0);
		}
		.slide-overlay {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
