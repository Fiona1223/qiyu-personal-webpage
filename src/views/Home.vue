<template>
	<div id="qiyu-home">
		<!-- 英雄区（沉浸式视觉核心） -->
		<section class="hero">
			<!-- 动态渐变背景（优化动画） -->
			<div class="hero-bg"></div>
			<!-- Canvas小鱼动画容器 -->
			<div id="jsi-flying-fish-container" class="fish-container" ref="fishContainer"></div>
			<!-- 炫酷粒子装饰（优化动画） -->
			<div class="particles" ref="particles"></div>
			<!-- 光效装饰（新增呼吸光效） -->
			<div class="light-effect"></div>
			<!-- 新增：流动光带装饰 -->
			<div class="light-streak light-streak-1"></div>
			<div class="light-streak light-streak-2"></div>

			<div class="hero-container">
				<!-- 左侧人物立牌滑动区（新增核心功能） -->
				<div
					class="character-standee-container"
					ref="standeeContainer"
					@wheel="handleStandeeScroll"
				>
					<div
						class="standee-track"
						:style="{ transform: `translateY(${-currentStandeeIndex * 100}%)` }"
					>
						<div
							class="standee-item"
							v-for="(item, index) in standeeImages"
							:key="index"
							:class="{ active: index === currentStandeeIndex }"
						>
							<img :src="item" alt="祁煜立牌" class="standee-img" />
							<div class="standee-caption">{{ standeeCaptions[index] }}</div>
						</div>
					</div>
					<!-- 滑动指示器 -->
					<div class="standee-indicators">
						<span
							class="standee-dot"
							v-for="(item, index) in standeeImages"
							:key="index"
							:class="{ active: index === currentStandeeIndex }"
							@click="goToStandee(index)"
						></span>
					</div>
				</div>

				<!-- 中间文字区（优化动画） -->
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

				<!-- 右侧人物展示区（联动切换） -->
				<div class="hero-image" ref="heroImage">
					<div class="image-container">
						<!-- 人物主体（优化3D悬浮+联动切换） -->
						<div class="character-wrapper">
							<img
								:src="characterImages[currentStandeeIndex]"
								alt="祁煜"
								class="character-img"
								:class="{ 'image-fade': isImageChanging }"
							/>
							<!-- 优化人物光效边框 -->
							<div class="character-border"></div>
							<!-- 新增：动态光环 -->
							<div class="character-ring"></div>
							<!-- 人物光晕 -->
							<div class="character-glow"></div>
							<!-- 更新提示文字 -->
							<div class="scroll-hint">滚动切换形象</div>
						</div>
						<!-- 优化动态装饰元素 -->
						<div class="floating-decor"></div>
					</div>
				</div>
			</div>

			<!-- 滚动提示（优化动画） -->
			<div class="scroll-tip">
				<span>向下探索</span>
				<div class="scroll-icon"></div>
			</div>
		</section>

		<!-- 轻量展示区（保持不变） -->
		<section class="showcase-section" ref="showcaseSection">
			<div class="section-container">
				<!-- 极简标题 -->
				<h2 class="section-title">
					<span class="title-line"></span>
					关于祁煜
					<span class="title-line"></span>
				</h2>

				<!-- 1. 个人档案 -->
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

				<!-- 2. 视觉展示模块 -->
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

				<!-- 3. 引用展示 -->
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
				// 新增：人物立牌图片列表
				standeeImages: [
					'https://picsum.photos/id/1005/400/800',
					'https://picsum.photos/id/1012/400/800',
					'https://picsum.photos/id/1014/400/800',
					'https://picsum.photos/id/1025/400/800',
				],
				// 立牌描述文字
				standeeCaptions: ['深海焰火', '星夜幻想', '人鱼之约', '宇宙情书'],
				currentStandeeIndex: 0,
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

			// 1. 初始化Canvas小鱼动画
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
			// ========== 核心新增：立牌滚动切换逻辑 ==========
			handleStandeeScroll(e) {
				e.preventDefault();

				// 标记图片切换中
				this.isImageChanging = true;

				// 根据滚轮方向切换索引
				if (e.deltaY > 0) {
					// 向下滚动 - 下一张
					this.currentStandeeIndex = (this.currentStandeeIndex + 1) % this.standeeImages.length;
				} else {
					// 向上滚动 - 上一张
					this.currentStandeeIndex =
						(this.currentStandeeIndex - 1 + this.standeeImages.length) % this.standeeImages.length;
				}

				// 动画结束后重置状态
				setTimeout(() => {
					this.isImageChanging = false;
				}, 500);
			},

			// 点击指示器切换立牌
			goToStandee(index) {
				this.isImageChanging = true;
				this.currentStandeeIndex = index;

				setTimeout(() => {
					this.isImageChanging = false;
				}, 500);
			},

			// ========== Canvas小鱼动画实现（保持不变） ==========
			initFishRenderer() {
				const self = this;

				// 定义小鱼渲染器
				this.RENDERER = {
					POINT_INTERVAL: 8,
					FISH_COUNT: 5,
					MAX_INTERVAL_COUNT: 80,
					INIT_HEIGHT_RATE: 0.5,
					THRESHOLD: 80,
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

				// 定义水面点类
				this.SURFACE_POINT = function (renderer, x) {
					this.renderer = renderer;
					this.x = x;
					this.init();
				};

				this.SURFACE_POINT.prototype = {
					SPRING_CONSTANT: 0.01,
					SPRING_FRICTION: 0.95,
					WAVE_SPREAD: 0.15,
					ACCELARATION_RATE: 0.003,

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

				// 定义鱼类
				this.FISH = function (renderer) {
					this.renderer = renderer;
					this.init();
				};

				this.FISH.prototype = {
					GRAVITY: 0.15,

					init: function () {
						this.direction = Math.random() < 0.5;
						this.x = this.direction
							? this.renderer.width + this.renderer.THRESHOLD
							: -this.renderer.THRESHOLD;
						this.previousY = this.y;
						this.vx = this.getRandomValue(1.5, 3.5) * (this.direction ? -1 : 1);

						if (this.renderer.reverse) {
							this.y = this.getRandomValue(
								(this.renderer.height * 1) / 10,
								(this.renderer.height * 4) / 10
							);
							this.vy = this.getRandomValue(0.5, 1.5);
							this.ay = this.getRandomValue(0.01, 0.05);
						} else {
							this.y = this.getRandomValue(
								(this.renderer.height * 6) / 10,
								(this.renderer.height * 9) / 10
							);
							this.vy = this.getRandomValue(-1.5, -0.5);
							this.ay = this.getRandomValue(-0.05, -0.01);
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
							this.theta += Math.PI / 60;
							this.theta %= Math.PI * 2;
							this.phi += Math.PI / 80;
							this.phi %= Math.PI * 2;
						}
						this.renderer.generateEpicenter(
							this.x + (this.direction ? -1 : 1) * this.renderer.THRESHOLD,
							this.y,
							(this.y - this.previousY) * 0.5
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

			// ========== 轮播相关方法（保持不变） ==========
			startCarousel() {
				this.carouselTimer = setInterval(() => {
					this.nextSlide();
				}, 6000);
			},

			nextSlide() {
				const track = this.$refs.carouselContainer?.querySelector('.carousel-track');
				if (track) track.classList.add('carousel-animate');

				this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
				this.resetCarouselTimer();

				setTimeout(() => {
					if (track) track.classList.remove('carousel-animate');
				}, 800);
			},

			prevSlide() {
				const track = this.$refs.carouselContainer?.querySelector('.carousel-track');
				if (track) track.classList.add('carousel-animate');

				this.currentSlide =
					(this.currentSlide - 1 + this.carouselImages.length) % this.carouselImages.length;
				this.resetCarouselTimer();

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
				}, 8000);
			},

			changeQuote() {
				this.isQuoteChanging = true;

				this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
				this.currentQuote = this.quotes[this.currentQuoteIndex];

				setTimeout(() => {
					this.isQuoteChanging = false;
				}, 800);
			},

			// 创建粒子效果（优化动画）
			createParticles() {
				const particlesContainer = this.$refs.particles;
				if (!particlesContainer) return;

				for (let i = 0; i < 30; i++) {
					const particle = document.createElement('div');
					particle.className = 'particle';

					const size = Math.random() * 4 + 1;
					const isCircle = Math.random() > 0.5;
					particle.style.cssText = `
						left: ${Math.random() * 100}%;
						top: ${Math.random() * 100}%;
						width: ${size}px;
						height: ${size}px;
						background: ${isCircle ? '#7B61FF' : '#C850C0'};
						border-radius: ${isCircle ? '50%' : '0'};
						opacity: ${Math.random() * 0.5 + 0.1};
						animation: particleFloat ${Math.random() * 30 + 20}s infinite linear;
						animation-delay: ${Math.random() * 5}s;
					`;

					particlesContainer.appendChild(particle);
				}
			},

			// 打字机文字动画（优化速度）
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
						setTimeout(typeWriter, 180); // 优化打字速度
					}
				};

				setTimeout(typeWriter, 800);
			},

			// 元素渐入动画（优化时序）
			initElementAnimations() {
				// 文字区渐入
				setTimeout(() => {
					if (this.$refs.heroText) this.$refs.heroText.classList.add('fade-in');
				}, 300);

				// 立牌区渐入
				setTimeout(() => {
					if (this.$refs.standeeContainer) this.$refs.standeeContainer.classList.add('fade-in');
				}, 600);

				// 图片区渐入
				setTimeout(() => {
					if (this.$refs.heroImage) this.$refs.heroImage.classList.add('fade-in');
				}, 900);

				// 展示区自动显示
				setTimeout(() => {
					if (this.$refs.showcaseSection) this.$refs.showcaseSection.classList.add('show');
				}, 1500);
			},

			// 滚动监听（优化视差效果）
			handleScroll() {
				const scrollTop = window.scrollY;
				const heroBg = document.querySelector('.hero-bg');
				const lightEffect = document.querySelector('.light-effect');

				// 优化背景视差效果
				if (heroBg && scrollTop < window.innerHeight) {
					heroBg.style.transform = `translateY(${scrollTop * 0.05}px) scale(1.02)`;
				}

				// 优化光效淡出
				if (lightEffect && scrollTop < window.innerHeight) {
					lightEffect.style.opacity = 1 - scrollTop / (window.innerHeight * 2);
				}

				// 展示区动画
				const showcaseSection = this.$refs.showcaseSection;
				if (showcaseSection && scrollTop > 100) {
					showcaseSection.classList.add('show');
				}
			},

			// 鼠标跟随效果（优化幅度）
			initMouseFollow() {
				const heroImage = this.$refs.heroImage;
				if (!heroImage) return;

				document.addEventListener('mousemove', (e) => {
					// 优化鼠标跟随幅度，更自然
					const x = (e.clientX - window.innerWidth / 2) / 60;
					const y = (e.clientY - window.innerHeight / 2) / 60;

					const characterWrapper = heroImage.querySelector('.character-wrapper');
					if (characterWrapper && !this.isImageChanging) {
						characterWrapper.style.transform = `translate(${x}px, ${y}px) rotateY(${
							x / 4
						}deg) rotateX(${-y / 4}deg)`;
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

	/* 英雄区核心样式（优化动画） */
	.hero {
		height: 100vh;
		position: relative;
		overflow: hidden;
		display: flex;
		align-items: center;
	}

	/* 动态渐变背景（全新动画） */
	.hero-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(135deg, #0f1642, #2a1659, #411b70);
		background-size: 400% 400%;
		/* 新增：更流畅的渐变动画 */
		animation: gradientShift 25s ease infinite alternate;
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		z-index: 1;
	}

	/* 优化渐变动画 */
	@keyframes gradientShift {
		0% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 100%;
		}
	}

	/* Canvas小鱼动画容器样式 */
	.fish-container {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		pointer-events: none;
		opacity: 0.7;
	}

	/* 粒子效果（优化动画） */
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
		/* 新增：粒子旋转动画 */
		transform-origin: center center;
	}

	/* 优化粒子动画 */
	@keyframes particleFloat {
		0% {
			transform: translateY(100vh) rotate(0deg) scale(0.8);
			opacity: 0;
		}
		10% {
			opacity: 0.6;
		}
		90% {
			opacity: 0.6;
		}
		100% {
			transform: translateY(-10vh) rotate(360deg) scale(1.2);
			opacity: 0;
		}
	}

	/* 光效装饰（全新呼吸光效） */
	.light-effect {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 1000px;
		height: 1000px;
		transform: translate(-50%, -50%);
		background: radial-gradient(circle, rgba(123, 97, 255, 0.2) 0%, rgba(123, 97, 255, 0) 70%);
		border-radius: 50%;
		z-index: 3;
		transition: opacity 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		/* 新增：呼吸动画 */
		animation: lightBreath 8s ease-in-out infinite;
	}

	/* 新增：呼吸光效动画 */
	@keyframes lightBreath {
		0%,
		100% {
			transform: translate(-50%, -50%) scale(1);
			opacity: 0.8;
		}
		50% {
			transform: translate(-50%, -50%) scale(1.1);
			opacity: 1;
		}
	}

	/* 新增：流动光带样式 */
	.light-streak {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 2;
		pointer-events: none;
		background: linear-gradient(90deg, transparent, rgba(123, 97, 255, 0.05), transparent);
		animation: lightStreak 15s linear infinite;
	}

	.light-streak-2 {
		animation-delay: 7.5s;
		transform: rotate(90deg);
	}

	@keyframes lightStreak {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	/* 英雄区容器（重构布局） */
	.hero-container {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1600px;
		margin: 0 auto;
		padding: 0 40px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	/* 响应式布局（适配立牌） */
	@media (min-width: 1200px) {
		.hero-container {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
			height: 100%;
			gap: 30px;
		}
		/* 立牌容器 */
		.character-standee-container {
			width: 20%;
			opacity: 0;
			transform: translateY(30px);
			transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s;
			height: 70vh;
			overflow: hidden;
			position: relative;
		}
		.hero-text {
			width: 30%;
			opacity: 0;
			transform: translateY(30px);
			transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s;
		}
		.hero-image {
			width: 40%;
			opacity: 0;
			transform: translateY(50px) scale(0.95);
			transition: all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s;
		}
	}

	@media (max-width: 1199px) and (min-width: 992px) {
		.hero-container {
			flex-direction: row;
			align-items: center;
			gap: 20px;
		}
		.character-standee-container {
			width: 25%;
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out 0.2s;
			height: 60vh;
			overflow: hidden;
			position: relative;
		}
		.hero-text {
			width: 35%;
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out 0.4s;
		}
		.hero-image {
			width: 35%;
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out 0.6s;
		}
	}

	@media (max-width: 991px) {
		.hero-container {
			padding: 0 20px;
		}
		/* 移动端隐藏立牌 */
		.character-standee-container {
			display: none;
		}
		.hero-text {
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out;
			margin-bottom: 60px;
			text-align: center;
		}
		.hero-image {
			opacity: 0;
			transform: translateY(20px);
			transition: all 1s ease-out 0.3s;
			width: 80%;
			margin: 0 auto;
		}
	}

	/* 渐入动画 */
	.fade-in {
		opacity: 1 !important;
		transform: translate(0) scale(1) !important;
	}

	/* ========== 新增：立牌容器样式 ========== */
	.standee-track {
		width: 100%;
		height: 100%;
		transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.standee-item {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.standee-img {
		width: 100%;
		height: 90%;
		object-fit: cover;
		border-radius: 10px;
		box-shadow: 0 15px 35px rgba(123, 97, 255, 0.2);
		transition: all 0.5s ease;
	}

	.standee-item.active .standee-img {
		box-shadow: 0 20px 40px rgba(123, 97, 255, 0.4);
		transform: scale(1.02);
	}

	.standee-caption {
		color: #fff;
		margin-top: 15px;
		font-size: 18px;
		font-weight: 600;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
		opacity: 0.8;
	}

	/* 立牌指示器 */
	.standee-indicators {
		position: absolute;
		right: -20px;
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 5;
	}

	.standee-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		transition: all 0.3s ease;
	}

	.standee-dot.active {
		background: #7b61ff;
		width: 10px;
		height: 10px;
		box-shadow: 0 0 10px rgba(123, 97, 255, 0.8);
	}

	/* 文字区样式（优化） */
	.hero-title {
		font-size: clamp(4rem, 10vw, 7rem);
		font-weight: 900;
		color: #ffffff;
		line-height: 1.1;
		margin-bottom: 20px;
		text-shadow: 0 0 30px rgba(123, 97, 255, 0.3);
		text-align: center;
	}

	.title-char {
		display: inline-block;
		/* 优化标题浮动动画 */
		animation: titleFloat 6s ease-in-out infinite;
	}

	.title-char:nth-child(2) {
		animation-delay: 0.8s;
	}

	@keyframes titleFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg);
		}
		25% {
			transform: translateY(-10px) rotate(2deg);
		}
		75% {
			transform: translateY(-5px) rotate(-1deg);
		}
	}

	.hero-subtitle {
		font-size: clamp(1.2rem, 3vw, 2rem);
		color: #e0d7ff;
		margin-bottom: 25px;
		letter-spacing: 2px;
		text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		/* 新增：文字发光动画 */
		animation: textGlow 4s ease-in-out infinite alternate;
		text-align: center;
	}

	@keyframes textGlow {
		0% {
			text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
		}
		100% {
			text-shadow: 0 0 15px rgba(123, 97, 255, 0.5), 0 2px 8px rgba(0, 0, 0, 0.2);
		}
	}

	.hero-desc {
		font-size: clamp(1rem, 2vw, 1.2rem);
		color: #ffffff;
		line-height: 1.8;
		margin-bottom: 40px;
		opacity: 0.9;
		text-align: center;
	}

	/* 按钮样式（优化） */
	.hero-buttons {
		display: flex;
		justify-content: center;
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
		transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
		display: flex;
		align-items: center;
		gap: 10px;
		position: relative;
		overflow: hidden;
	}

	.btn-primary {
		background: linear-gradient(90deg, #7b61ff, #c850c0);
		color: white;
		box-shadow: 0 10px 30px rgba(123, 97, 255, 0.3);
		/* 新增：按钮呼吸效果 */
		animation: btnBreath 3s ease-in-out infinite alternate;
	}

	@keyframes btnBreath {
		0% {
			box-shadow: 0 10px 30px rgba(123, 97, 255, 0.2);
		}
		100% {
			box-shadow: 0 15px 40px rgba(123, 97, 255, 0.4);
		}
	}

	.btn-primary::before {
		content: '';
		position: absolute;
		top: 0;
		left: -100%;
		width: 100%;
		height: 100%;
		background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
		transition: all 1s ease;
	}

	.btn-primary:hover {
		transform: translateY(-5px) scale(1.03);
		box-shadow: 0 15px 40px rgba(123, 97, 255, 0.4);
	}

	.btn-primary:hover::before {
		left: 100%;
	}

	.btn-icon {
		width: 20px;
		height: 20px;
		transition: transform 0.4s ease;
	}

	.btn:hover .btn-icon {
		transform: translateX(5px) rotate(90deg);
	}

	/* 人物展示区（优化） */
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
		transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		transform-style: preserve-3d;
		box-shadow: 0 20px 60px rgba(123, 97, 255, 0.2);
		/* 新增：悬浮呼吸效果 */
		animation: wrapperBreath 6s ease-in-out infinite alternate;
	}

	@keyframes wrapperBreath {
		0% {
			box-shadow: 0 20px 60px rgba(123, 97, 255, 0.15);
			transform: scale(1);
		}
		100% {
			box-shadow: 0 25px 70px rgba(123, 97, 255, 0.3);
			transform: scale(1.02);
		}
	}

	.character-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: translateZ(20px);
		transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
			transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
	}

	.image-fade {
		opacity: 0;
		transform: translateZ(20px) scale(1.08) rotate(5deg);
	}

	/* 替换提示文字 */
	.scroll-hint {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.7);
		font-size: 14px;
		animation: hintPulse 4s ease-in-out infinite;
		z-index: 5;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
	}

	@keyframes hintPulse {
		0%,
		100% {
			opacity: 0.7;
			transform: translateX(-50%) scale(1);
		}
		50% {
			opacity: 1;
			transform: translateX(-50%) scale(1.05);
		}
	}

	.character-border {
		position: absolute;
		top: -5px;
		left: -5px;
		right: -5px;
		bottom: -5px;
		border: 2px solid rgba(123, 97, 255, 0.5);
		border-radius: 50%;
		/* 优化边框动画 */
		animation: borderRotate 8s linear infinite;
		transform: translateZ(10px);
	}

	@keyframes borderRotate {
		0% {
			transform: translateZ(10px) rotate(0deg);
			box-shadow: 0 0 20px rgba(123, 97, 255, 0.3);
		}
		100% {
			transform: translateZ(10px) rotate(360deg);
			box-shadow: 0 0 30px rgba(123, 97, 255, 0.5);
		}
	}

	/* 新增：动态光环 */
	.character-ring {
		position: absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
		border: 1px solid rgba(123, 97, 255, 0.3);
		border-radius: 50%;
		animation: ringPulse 4s ease-in-out infinite;
		z-index: -1;
	}

	@keyframes ringPulse {
		0% {
			transform: scale(1);
			opacity: 0.3;
		}
		50% {
			transform: scale(1.05);
			opacity: 0.8;
		}
		100% {
			transform: scale(1);
			opacity: 0.3;
		}
	}

	.character-glow {
		position: absolute;
		top: -20px;
		left: -20px;
		right: -20px;
		bottom: -20px;
		background: radial-gradient(circle, rgba(123, 97, 255, 0.25) 0%, rgba(123, 97, 255, 0) 70%);
		border-radius: 50%;
		z-index: -1;
		animation: glowPulse 8s ease-in-out infinite;
	}

	@keyframes glowPulse {
		0%,
		100% {
			opacity: 0.6;
			transform: scale(1);
		}
		50% {
			opacity: 0.9;
			transform: scale(1.03);
		}
	}

	.floating-decor {
		position: absolute;
		top: 20%;
		right: 10%;
		width: 70px;
		height: 70px;
		background: linear-gradient(45deg, #7b61ff, #c850c0);
		border-radius: 50%;
		opacity: 0.2;
		/* 优化装饰动画 */
		animation: decorFloat 10s ease-in-out infinite;
	}

	@keyframes decorFloat {
		0%,
		100% {
			transform: translateY(0) rotate(0deg) scale(1);
			opacity: 0.2;
		}
		25% {
			transform: translateY(-20px) rotate(90deg) scale(1.1);
			opacity: 0.3;
		}
		75% {
			transform: translateY(-10px) rotate(270deg) scale(0.9);
			opacity: 0.25;
		}
	}

	/* 滚动提示（优化） */
	.scroll-tip {
		position: absolute;
		bottom: 50px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		color: white;
		text-align: center;
		animation: scrollBounce 4s infinite ease-in-out;
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
		animation: scrollDown 3s infinite ease-in-out;
	}

	@keyframes scrollBounce {
		0%,
		100% {
			transform: translateX(-50%) translateY(0);
			opacity: 0.8;
		}
		50% {
			transform: translateX(-50%) translateY(-15px);
			opacity: 1;
		}
	}

	@keyframes scrollDown {
		0% {
			transform: translateX(-50%) translateY(0);
			opacity: 1;
		}
		100% {
			transform: translateX(-50%) translateY(15px);
			opacity: 0;
		}
	}

	/* 以下样式保持不变 */
	.showcase-section {
		padding: 120px 20px;
		background: #0a0a1a;
		opacity: 0;
		transform: translateY(80px);
		transition: all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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

	.profile-module {
		background: rgba(255, 255, 255, 0.02);
		padding: 40px;
		border-radius: 20px;
		margin-bottom: 80px;
		backdrop-filter: blur(10px);
		border: 1px solid rgba(123, 97, 255, 0.08);
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
		box-shadow: 0 0 15px rgba(123, 97, 255, 0.4);
	}

	.gallery-module {
		margin-bottom: 80px;
	}

	.carousel-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 20px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
		perspective: 1500px;
	}

	.carousel-track {
		display: flex;
		width: 100%;
		height: 500px;
		transition: transform 0.6s ease-out;
		transform-style: preserve-3d;
	}

	.carousel-animate {
		transition: transform 1s cubic-bezier(0.23, 1, 0.32, 1);
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
