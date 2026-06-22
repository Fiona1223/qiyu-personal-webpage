<template>
	<div
		id="qiyu-home"
		:class="'site--bg-' + heroBgMode"
		:style="siteThemeStyle"
	>
		<div class="site-bg" aria-hidden="true">
			<div v-show="heroBgMode === 'color'" class="site-bg-solid"></div>
			<template v-if="heroBgMode === 'image'">
				<div
					class="site-bg-image"
					:style="{ backgroundImage: `url(${heroBgImage})` }"
				></div>
				<div
					class="site-bg-mask"
					:style="{ '--mask-strength': heroBgMaskOpacity }"
				></div>
			</template>
			<div class="site-bg-atmosphere">
				<div class="site-bg-surface"></div>
				<div class="site-bg-depth"></div>
				<div class="site-bg-accent"></div>
				<div class="site-bg-orb-wrap site-bg-orb-wrap--teal">
					<div class="site-bg-orb site-bg-orb--teal"></div>
				</div>
				<div class="site-bg-orb-wrap site-bg-orb-wrap--coral">
					<div class="site-bg-orb site-bg-orb--coral"></div>
				</div>
				<canvas
					ref="waterRippleCanvas"
					class="site-bg-water-ripple"
					aria-hidden="true"
				></canvas>
				<div class="site-bg-bubbles">
					<span
						v-for="i in 14"
						:key="'bubble-' + i"
						class="site-bg-bubble"
						:style="bubbleStyle(i)"
					></span>
				</div>
				<div class="site-bg-stars">
					<span
						v-for="i in 10"
						:key="'star-' + i"
						class="site-bg-star"
						:style="heroStarStyle(i)"
					></span>
				</div>
			</div>
		</div>

		<div class="site-bg-settings">
			<button
				type="button"
				class="hero-bg-settings-btn"
				:class="{ active: heroBgPanelOpen }"
				aria-label="背景设置"
				:aria-expanded="heroBgPanelOpen"
				@click="heroBgPanelOpen = !heroBgPanelOpen"
			>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
					<path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4" />
					<circle cx="12" cy="12" r="4" />
				</svg>
			</button>
			<div v-show="heroBgPanelOpen" class="hero-bg-panel" @click.stop>
				<p class="hero-bg-panel-title">背景设置</p>
				<div class="hero-bg-mode-tabs">
					<button
						type="button"
						:class="{ active: heroBgMode === 'color' }"
						@click="setHeroBgMode('color')"
					>纯色</button>
					<button
						type="button"
						:class="{ active: heroBgMode === 'image' }"
						@click="setHeroBgMode('image')"
					>图片</button>
				</div>

				<div v-if="heroBgMode === 'color'" class="hero-bg-options">
					<p class="hero-bg-options-label">主题色</p>
					<div class="hero-bg-swatches">
						<button
							type="button"
							v-for="preset in heroBgColorPresets"
							:key="preset.value"
							class="hero-bg-swatch"
							:class="{ active: heroBgColor === preset.value }"
							:style="{ background: preset.value }"
							:title="preset.label"
							:aria-label="preset.label"
							@click="selectHeroBgColor(preset.value)"
						></button>
					</div>
					<label class="hero-bg-custom-color">
						<span>自定义</span>
						<input
							type="color"
							:value="heroBgColor"
							@input="selectHeroBgColor($event.target.value)"
						/>
					</label>
				</div>

				<div v-else class="hero-bg-options">
					<p class="hero-bg-options-label">背景图</p>
					<div class="hero-bg-thumbs">
						<button
							type="button"
							v-for="preset in heroBgImagePresets"
							:key="preset.url"
							class="hero-bg-thumb"
							:class="{ active: heroBgImage === preset.url }"
							@click="selectHeroBgImage(preset.url)"
						>
							<img :src="preset.url" :alt="preset.label" loading="lazy" />
							<span>{{ preset.label }}</span>
						</button>
					</div>
					<label class="hero-bg-mask-control">
						<span>遮罩浓度</span>
						<input
							type="range"
							min="0.35"
							max="0.92"
							step="0.01"
							v-model.number="heroBgMaskOpacity"
							@input="saveHeroBgSettings"
						/>
					</label>
				</div>
			</div>
		</div>

		<div class="site-content">
		<!-- 英雄区（沉浸式视觉核心） -->
		<section class="hero" ref="heroSection">
			<div class="hero-container">
				<div class="hero-text" ref="heroText">
					<p class="hero-eyebrow">DEEP SEA · ETERNAL FLAME</p>
					<div class="hero-divider" aria-hidden="true"></div>
					<h1 class="hero-title">祁煜</h1>
					<p class="hero-subtitle">深海里永不熄灭的焰火</p>
					<div class="hero-tags">
						<span v-for="tag in heroTags" :key="tag" class="hero-tag">{{ tag }}</span>
					</div>
					<p class="hero-desc">
						你相信，海底也会燃起火焰吗？<br />
						他是宇宙写给我的情诗，是唯一的光
					</p>
				</div>

				<div class="hero-visual" ref="heroImage" @wheel.prevent="handleCharacterWheel">
					<button
						type="button"
						class="hero-nav hero-nav--prev"
						aria-label="上一形象"
						@click="prevCharacter"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M15 18l-6-6 6-6" />
						</svg>
					</button>

					<div class="image-container">
						<div class="character-halo" aria-hidden="true"></div>
						<div
							class="character-frame"
							ref="characterFrame"
							:class="{ 'is-switching': isImageChanging }"
						>
							<div class="media-frame-shine" aria-hidden="true"></div>
							<span class="frame-corner frame-corner--tl" aria-hidden="true"></span>
							<span class="frame-corner frame-corner--tr" aria-hidden="true"></span>
							<span class="frame-corner frame-corner--bl" aria-hidden="true"></span>
							<span class="frame-corner frame-corner--br" aria-hidden="true"></span>
							<div class="character-frame-border" aria-hidden="true"></div>
							<img
								:src="characterImages[currentCharacterIndex]"
								alt="祁煜"
								class="character-img"
								:class="{ 'image-fade': isImageChanging }"
							/>
						</div>
					</div>

					<button
						type="button"
						class="hero-nav hero-nav--next"
						aria-label="下一形象"
						@click="nextCharacter"
					>
						<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M9 18l6-6-6-6" />
						</svg>
					</button>

					<div class="hero-image-meta">
						<span class="hero-image-caption" :key="currentCharacterIndex">
							{{ characterCaptions[currentCharacterIndex] }}
						</span>
						<div class="hero-image-dots">
							<button
								type="button"
								class="hero-dot"
								v-for="(caption, index) in characterCaptions"
								:key="caption"
								:class="{ active: index === currentCharacterIndex }"
								:aria-label="`切换到${caption}`"
								@click="goToCharacter(index)"
							></button>
						</div>
					</div>
				</div>
			</div>

			<button type="button" class="hero-scroll" @click="scrollToShowcase" aria-label="向下滚动">
				<span>探索更多</span>
				<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
					<path d="M12 5v14M5 13l7 7 7-7" />
				</svg>
			</button>
		</section>

		<!-- 展示区：关于祁煜 -->
		<section class="showcase-section" ref="showcaseSection">
			<div class="showcase-bg" aria-hidden="true">
				<div class="showcase-petals">
					<span
						v-for="i in 14"
						:key="'petal-' + i"
						class="showcase-petal"
						:style="getPetalStyle(i)"
					></span>
				</div>
				<div class="showcase-sparkles">
					<span
						v-for="i in 8"
						:key="'spark-' + i"
						class="showcase-spark"
						:style="getSparkStyle(i)"
					></span>
				</div>
			</div>

			<div class="section-container">
				<header class="section-header reveal-item">
					<p class="section-eyebrow">CHARACTER PROFILE</p>
					<h2 class="section-title">
						<span class="title-deco">✦</span>
						<span class="title-text">关于祁煜</span>
						<span class="title-deco">✦</span>
					</h2>
					<p class="section-desc">艺术家 · 人鱼 · 深海里永不熄灭的焰火</p>
					<div class="title-shimmer"></div>
				</header>

				<div class="profile-module reveal-item">
					<div class="profile-grid">
						<div
							class="profile-card"
							v-for="(item, i) in profileItems"
							:key="item.label"
							:style="{ '--card-delay': i * 0.12 + 's' }"
						>
							<div class="profile-card-shine"></div>
							<span class="profile-icon">{{ item.icon }}</span>
							<span class="profile-label">{{ item.label }}</span>
							<span v-if="!item.isColor" class="profile-value">{{ item.value }}</span>
							<span v-else class="profile-color-swatch" :title="item.value"></span>
						</div>
					</div>
					<div class="character-tags">
						<span
							class="character-tag"
							v-for="(tag, i) in characterTags"
							:key="tag"
							:style="{ '--tag-delay': i * 0.08 + 's' }"
						>{{ tag }}</span>
					</div>
				</div>

				<div class="gallery-module reveal-item">
					<div class="gallery-header">
						<h3 class="gallery-title">
							<span class="gallery-title-icon">◇</span>
							视觉画廊
						</h3>
						<span class="gallery-counter">
							<em>{{ String(currentSlide + 1).padStart(2, '0') }}</em>
							<span class="counter-sep">/</span>
							{{ String(carouselImages.length).padStart(2, '0') }}
						</span>
					</div>
					<div class="carousel-container" ref="carouselContainer">
						<div class="carousel-frame-glow" aria-hidden="true"></div>
						<div
							class="carousel-track"
							:style="{ transform: `translateX(${-currentSlide * 100}%)` }"
						>
							<div
								class="carousel-slide"
								v-for="(item, index) in carouselImages"
								:key="index"
								:class="{ active: index === currentSlide }"
							>
								<div class="slide-img-wrapper">
									<div class="slide-img-inner">
										<img :src="item.url" :alt="item.alt" loading="lazy" />
									</div>
									<div class="slide-scanline" aria-hidden="true"></div>
									<div class="slide-overlay">
										<span class="slide-badge">{{ item.title }}</span>
										<h3 class="slide-title">{{ item.title }}</h3>
										<p class="slide-desc">{{ item.desc }}</p>
									</div>
								</div>
							</div>
						</div>

						<button class="carousel-btn prev-btn" @click="prevSlide" aria-label="上一张">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M19 12H5M12 19l-7-7 7-7" />
							</svg>
						</button>
						<button class="carousel-btn next-btn" @click="nextSlide" aria-label="下一张">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M5 12h14M12 5l7 7-7 7" />
							</svg>
						</button>

						<div class="carousel-indicators">
							<button
								type="button"
								class="indicator"
								v-for="(item, index) in carouselImages"
								:key="index"
								:class="{ active: index === currentSlide }"
								@click="goToSlide(index)"
								:aria-label="`切换到第 ${index + 1} 张`"
							></button>
						</div>

						<div class="carousel-progress" aria-hidden="true">
							<div
								class="carousel-progress-bar"
								:style="{ width: ((currentSlide + 1) / carouselImages.length) * 100 + '%' }"
							></div>
						</div>
					</div>
				</div>

				<div class="quote-module reveal-item">
					<div class="quote-orbit" aria-hidden="true">
						<span class="orbit-dot orbit-dot--1"></span>
						<span class="orbit-dot orbit-dot--2"></span>
						<span class="orbit-dot orbit-dot--3"></span>
					</div>
					<div class="quote-frame">
						<div class="quote-corner quote-corner--tl"></div>
						<div class="quote-corner quote-corner--tr"></div>
						<div class="quote-corner quote-corner--bl"></div>
						<div class="quote-corner quote-corner--br"></div>
						<div class="quote-content" ref="quoteContent">
							<svg class="quote-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<path
									d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2zm16-8c0 3-4 8-7 8v-11c0-1.25.756-2.017 2-2h5c1.1 0 2 .9 2 2v6z"
								/>
							</svg>
							<p class="quote-text" :class="{ 'quote-fade': isQuoteChanging }">
								{{ currentQuote.text }}
							</p>
							<p class="quote-author" :class="{ 'quote-fade': isQuoteChanging }">
								—— {{ currentQuote.author }}
							</p>
						</div>
					</div>
				</div>

				<!-- 人物侧写 -->
				<div class="story-portrait reveal-item">
					<div class="portrait-visual">
						<div class="portrait-frame">
							<img :src="portraitImage" alt="祁煜人物侧写" loading="lazy" />
							<div class="portrait-glow" aria-hidden="true"></div>
						</div>
						<div class="portrait-float portrait-float--1" aria-hidden="true">♪</div>
						<div class="portrait-float portrait-float--2" aria-hidden="true">✦</div>
					</div>
					<div class="portrait-copy">
						<p class="block-eyebrow">CHARACTER STORY</p>
						<h3 class="block-title">深海里的浪漫主义者</h3>
						<p
							class="portrait-paragraph"
							v-for="(para, i) in portraitParagraphs"
							:key="i"
							:style="{ '--para-delay': i * 0.15 + 's' }"
						>{{ para }}</p>
					</div>
				</div>

				<!-- 深海纪事时间线 -->
				<div class="timeline-module reveal-item">
					<div class="block-header">
						<p class="block-eyebrow">DEEP SEA CHRONICLE</p>
						<h3 class="block-title">深海纪事</h3>
						<p class="block-subtitle">利莫里亚的记忆，在洋流中缓缓浮现</p>
					</div>
					<div class="timeline-track">
						<div class="timeline-line" aria-hidden="true"></div>
						<div
							class="timeline-item"
							v-for="(item, i) in storyTimeline"
							:key="item.year"
							:class="{ 'timeline-item--right': i % 2 === 1 }"
							:style="{ '--item-delay': i * 0.12 + 's' }"
						>
							<div class="timeline-dot" aria-hidden="true"></div>
							<div class="timeline-card">
								<span class="timeline-year">{{ item.year }}</span>
								<h4 class="timeline-title">{{ item.title }}</h4>
								<p class="timeline-desc">{{ item.desc }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- 性格光谱 -->
				<div class="traits-module reveal-item">
					<div class="block-header">
						<p class="block-eyebrow">PERSONALITY SPECTRUM</p>
						<h3 class="block-title">性格光谱</h3>
					</div>
					<div class="traits-grid">
						<div
							class="trait-row"
							v-for="(trait, i) in personalityTraits"
							:key="trait.name"
							:style="{ '--trait-delay': i * 0.1 + 's' }"
						>
							<div class="trait-head">
								<span class="trait-name">{{ trait.name }}</span>
								<span class="trait-value">{{ trait.value }}%</span>
							</div>
							<div class="trait-bar">
								<div
									class="trait-bar-fill"
									:style="{ '--fill': trait.value + '%', background: trait.color }"
								></div>
							</div>
						</div>
					</div>
				</div>

				<!-- 画作拾遗 -->
				<div class="art-grid-module reveal-item">
					<div class="block-header">
						<p class="block-eyebrow">ART COLLECTION</p>
						<h3 class="block-title">画作拾遗</h3>
						<p class="block-subtitle">每一笔，都是他说不出口的温柔</p>
					</div>
					<div class="art-mosaic">
						<div
							class="art-card"
							v-for="(art, i) in artworkGallery"
							:key="art.title"
							:class="'art-card--' + (i % 3)"
							:style="{ '--art-delay': i * 0.08 + 's' }"
						>
							<img :src="art.url" :alt="art.title" loading="lazy" />
							<div class="art-card-overlay">
								<span class="art-card-tag">{{ art.tag }}</span>
								<h4>{{ art.title }}</h4>
								<p>{{ art.desc }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- 经典台词 -->
				<div class="voice-module reveal-item">
					<div class="block-header">
						<p class="block-eyebrow">VOICE LINES</p>
						<h3 class="block-title">经典台词</h3>
					</div>
					<div class="voice-layout">
						<div class="voice-list">
							<button
								type="button"
								class="voice-chip"
								v-for="(line, i) in voiceLines"
								:key="line.id"
								:class="{ active: activeVoiceIndex === i }"
								@click="selectVoiceLine(i)"
							>
								<span class="voice-chip-icon">{{ line.icon }}</span>
								<span class="voice-chip-label">{{ line.label }}</span>
							</button>
						</div>
						<div class="voice-display" :class="{ 'voice-display--pulse': voicePulse }">
							<div class="voice-wave" aria-hidden="true">
								<span v-for="n in 5" :key="n"></span>
							</div>
							<p class="voice-text">{{ voiceLines[activeVoiceIndex].text }}</p>
							<p class="voice-scene">— {{ voiceLines[activeVoiceIndex].scene }}</p>
						</div>
					</div>
				</div>

				<!-- 记忆碎片 -->
				<div class="memory-module reveal-item">
					<div class="block-header">
						<p class="block-eyebrow">MEMORY FRAGMENTS</p>
						<h3 class="block-title">记忆碎片</h3>
					</div>
					<div class="memory-grid">
						<div
							class="memory-card"
							v-for="(mem, i) in memoryFragments"
							:key="mem.title"
							:style="{ '--mem-delay': i * 0.1 + 's' }"
						>
							<span class="memory-icon">{{ mem.icon }}</span>
							<h4>{{ mem.title }}</h4>
							<p>{{ mem.text }}</p>
						</div>
					</div>
				</div>

				<!-- 继续探索 -->
				<div class="explore-module reveal-item">
					<div class="block-header">
						<p class="block-eyebrow">EXPLORE MORE</p>
						<h3 class="block-title">继续探索</h3>
						<p class="block-subtitle">深海的故事，远不止于此</p>
					</div>
					<div class="explore-grid">
						<router-link
							v-for="(link, i) in exploreLinks"
							:key="link.path"
							:to="link.path"
							class="explore-card"
							:style="{ '--explore-delay': i * 0.1 + 's' }"
						>
							<span class="explore-icon">{{ link.icon }}</span>
							<h4>{{ link.title }}</h4>
							<p>{{ link.desc }}</p>
							<span class="explore-arrow">→</span>
						</router-link>
					</div>
				</div>
			</div>
		</section>

		<footer class="footer reveal-item">
			<div class="footer-wave" aria-hidden="true"></div>
			<div class="footer-container">
				<p class="footer-brand">祁煜 · 深海焰火</p>
				<p class="footer-copy">© 2025 · 献给每一位踏入深海的人</p>
				<div class="footer-hearts" aria-hidden="true">
					<span>♡</span><span>♡</span><span>♡</span>
				</div>
			</div>
		</footer>
		</div>
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
				characterCaptions: ['深海焰火', '星夜幻想', '人鱼之约', '宇宙情书'],
				currentCharacterIndex: 0,
				isImageChanging: false,
				characterWheelLocked: false,
				characterSwitchTimer: null,

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

				profileItems: [
					{ label: '生日', value: '6月18日', icon: '✦' },
					{ label: '星座', value: '双子座', icon: '♊' },
					{ label: '特长', value: '唱歌 / 绘画 / 配音', icon: '♪' },
					{ label: '代表色', value: '珊瑚 · 青蓝', isColor: true, icon: '◆' },
				],
				characterTags: ['深海系', '浪漫主义者', '天才画家', '人鱼', '双子座', '焰火'],
				heroTags: ['人鱼', '天才画家', '双子座', '深海焰火'],
				showcaseObserver: null,

				waterRippleRaf: null,
				waterRippleDropTimer: null,
				waterRippleResizeHandler: null,

				heroBgMode: 'color',
				heroBgColor: '#041424',
				heroBgImage: 'https://picsum.photos/id/1015/1920/1080',
				heroBgMaskOpacity: 0.72,
				heroBgPanelOpen: false,
				heroBgColorPresets: [
					{ label: '深海蓝', value: '#041424' },
					{ label: '洋流青', value: '#062a3a' },
					{ label: '午夜海', value: '#0a2540' },
					{ label: '珊瑚夜', value: '#0d1f2d' },
					{ label: '潮汐墨', value: '#051a28' },
				],
				heroBgImagePresets: [
					{ label: '深海', url: 'https://picsum.photos/id/1015/1920/1080' },
					{ label: '星夜', url: 'https://picsum.photos/id/1011/1920/1080' },
					{ label: '焰火', url: 'https://picsum.photos/id/1010/1920/1080' },
					{ label: '潮汐', url: 'https://picsum.photos/id/1012/1920/1080' },
				],
				heroPanelOutsideHandler: null,

				portraitImage: 'https://picsum.photos/id/1015/600/800',
				portraitParagraphs: [
					'祁煜来自古老的利莫里亚文明，是深海里长大的天才画家。他用画笔记录洋流、星辰与失落的故乡，把无人听见的浪漫，都藏进每一幅画作里。',
					'表面上傲娇又毒舌，习惯用玩笑掩饰真心；可一旦认真起来，他会把整片深海最柔软的焰火，都留给你一个人看。',
					'唱歌、绘画、潜水——他擅长一切与「美」有关的事。对他而言，艺术不是技巧，而是把心跳翻译成你能读懂的语言。',
				],
				storyTimeline: [
					{ year: '远古', title: '利莫里亚之子', desc: '在深海文明中降生，与洋流和珊瑚一起成长，学会了用色彩记录世界的声音。' },
					{ year: '少年', title: '天才画家', desc: '展露出惊人的艺术天赋，画作开始流传于海底与陆地之间，被称为「深海的焰火」。' },
					{ year: '流浪', title: '失落的故乡', desc: '利莫里亚沉入历史，他踏上漫长的旅途，在人群中寻找熟悉的温度与归处。' },
					{ year: '相遇', title: '焰火重燃', desc: '与你的相遇，让沉寂已久的深海再次亮起光——这一次，他不想再放手。' },
					{ year: '如今', title: '岸上之约', desc: '他把画架支在海边，把歌声唱进风里，把关于你的故事，一幅一幅画下来。' },
				],
				personalityTraits: [
					{ name: '浪漫主义', value: 96, color: 'linear-gradient(90deg, #fb7185, #f472b6)' },
					{ name: '艺术天赋', value: 98, color: 'linear-gradient(90deg, #22d3ee, #06b6d4)' },
					{ name: '傲娇指数', value: 72, color: 'linear-gradient(90deg, #f472b6, #38bdf8)' },
					{ name: '占有欲', value: 88, color: 'linear-gradient(90deg, #fb7185, #0ea5e9)' },
					{ name: '温柔细腻', value: 91, color: 'linear-gradient(90deg, #a5f3fc, #22d3ee)' },
					{ name: '自由灵魂', value: 85, color: 'linear-gradient(90deg, #14b8a6, #38bdf8)' },
				],
				artworkGallery: [
					{ url: 'https://picsum.photos/id/1020/600/800', title: '深海焰火', tag: '代表作', desc: '黑暗中唯一不愿熄灭的光' },
					{ url: 'https://picsum.photos/id/1021/800/600', title: '潮汐来信', tag: '风景', desc: '洋流写给你的长篇情书' },
					{ url: 'https://picsum.photos/id/1022/600/900', title: '人鱼之歌', tag: '肖像', desc: '歌声里藏着整个夏天' },
					{ url: 'https://picsum.photos/id/1023/800/500', title: '星河沉海', tag: '幻想', desc: '把宇宙倒进深海里' },
					{ url: 'https://picsum.photos/id/1024/700/700', title: '珊瑚梦境', tag: '色彩', desc: '珊瑚与洋流交织的温柔幻境' },
					{ url: 'https://picsum.photos/id/1026/600/800', title: '岸边约定', tag: '日常', desc: '海风与画架，和你' },
				],
				voiceLines: [
					{ id: 1, icon: '♡', label: '告白', scene: '深夜海边', text: '我的焰火，只为你一个人燃烧。' },
					{ id: 2, icon: '◎', label: '傲娇', scene: '画室', text: '才不是特意为你画的……只是刚好想画而已。' },
					{ id: 3, icon: '♪', label: '温柔', scene: '潜水时', text: '别怕，跟着我——深海也会很温柔。' },
					{ id: 4, icon: '✦', label: '承诺', scene: '星空下', text: '不管你去哪里，我都会找到你。' },
					{ id: 5, icon: '◇', label: '思念', scene: '独处', text: '洋流的方向，总是朝着有你的地方。' },
					{ id: 6, icon: '☼', label: '日常', scene: '早晨', text: '起床了？今天的海很好看，要不要一起看？' },
				],
				activeVoiceIndex: 0,
				voicePulse: false,
				memoryFragments: [
					{ icon: '🐚', title: '第一幅画', text: '小时候用珊瑚汁在礁石上涂抹，那是他艺术之路的起点。' },
					{ icon: '🎨', title: '专属颜料', text: '他调出的珊瑚青蓝色，是利莫里亚天空最后的颜色。' },
					{ icon: '🌊', title: '潜水习惯', text: '每隔一段时间就要潜入深海，那是他与故乡对话的方式。' },
					{ icon: '🎵', title: '哼唱', text: '画画时总会轻声哼歌，旋律里藏着说不出口的话。' },
					{ icon: '⭐', title: '看星星', text: '陆上的星空和海底不一样，但他说，有你在都一样好看。' },
					{ icon: '🐟', title: '小鱼朋友', text: '海里的小鱼都是他的朋友，会跟着他游过整片珊瑚礁。' },
				],
				exploreLinks: [
					{ path: '/quiz', icon: '✦', title: '祁煜测验', desc: '测试你对他的了解程度' },
					{ path: '/gallery', icon: '◇', title: '影像画廊', desc: '更多精美立绘与 CG' },
					{ path: '/artBook', icon: '♪', title: '画集翻阅', desc: '沉浸式欣赏他的画作' },
					{ path: '/fanwall', icon: '♡', title: '粉丝留言墙', desc: '写下你想对祁煜说的话' },
					{ path: '/works', icon: '◎', title: '作品一览', desc: '歌曲、配音与创作档案' },
					{ path: '/about', icon: '☼', title: '关于本站', desc: '了解这个粉丝站的初心' },
				],

			};
		},
		computed: {
			siteThemeStyle() {
				const deep = this.heroBgColor;
				const mid = this.shiftOceanColor(deep, 1);
				const light = this.shiftOceanColor(deep, 2);
				return {
					'--bg-deep': deep,
					'--bg-mid': mid,
					'--bg-light': light,
				};
			},
		},
		mounted() {
			this.currentQuote = this.quotes[0];

			window.addEventListener('scroll', this.handleScroll);
			this.startCarousel();
			this.startQuoteRotation();
			this.loadHeroBgSettings();
			this.applyDocumentTheme();

			this.heroPanelOutsideHandler = (e) => {
				if (!this.heroBgPanelOpen) return;
				const panel = this.$el?.querySelector('.site-bg-settings');
				if (panel && !panel.contains(e.target)) {
					this.heroBgPanelOpen = false;
				}
			};
			document.addEventListener('click', this.heroPanelOutsideHandler);

			this.$nextTick(() => {
				this.$refs.heroSection?.classList.add('hero-ready');
				this.initShowcaseReveal();
				this.$refs.showcaseSection?.classList.add('show');
				this.initWaterRipple();
			});
		},
		beforeDestroy() {
			this.destroyWaterRipple();
			window.removeEventListener('scroll', this.handleScroll);
			document.body.style.backgroundColor = '';
			if (this.heroPanelOutsideHandler) {
				document.removeEventListener('click', this.heroPanelOutsideHandler);
			}
			if (this.showcaseObserver) {
				this.showcaseObserver.disconnect();
				this.showcaseObserver = null;
			}
			if (this.carouselTimer) clearInterval(this.carouselTimer);
			if (this.quoteTimer) clearInterval(this.quoteTimer);
			if (this.characterSwitchTimer) clearTimeout(this.characterSwitchTimer);
		},
		methods: {
			shiftColor(hex, amount) {
				const n = hex.replace('#', '');
				if (n.length !== 6) return hex;
				const r = Math.min(255, parseInt(n.slice(0, 2), 16) + amount);
				const g = Math.min(255, parseInt(n.slice(2, 4), 16) + amount);
				const b = Math.min(255, parseInt(n.slice(4, 6), 16) + amount);
				return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
			},

			shiftOceanColor(hex, level) {
				const n = hex.replace('#', '');
				if (n.length !== 6) return hex;
				const r = parseInt(n.slice(0, 2), 16);
				const g = parseInt(n.slice(2, 4), 16);
				const b = parseInt(n.slice(4, 6), 16);
				const step = level === 1 ? 14 : 28;
				const nr = Math.max(0, Math.min(255, r + step * 0.35));
				const ng = Math.max(0, Math.min(255, g + step * 0.85));
				const nb = Math.max(0, Math.min(255, b + step * 1.15));
				return `#${[nr, ng, nb].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;
			},

			loadHeroBgSettings() {
				try {
					const raw = localStorage.getItem('qiyu-hero-bg');
					if (!raw) return;
					const data = JSON.parse(raw);
					if (data.mode === 'color' || data.mode === 'image') this.heroBgMode = data.mode;
					if (data.color) this.heroBgColor = data.color;
					if (data.image) this.heroBgImage = data.image;
					if (typeof data.maskOpacity === 'number') this.heroBgMaskOpacity = data.maskOpacity;
				} catch {
					/* ignore */
				}
			},

			saveHeroBgSettings() {
				try {
					localStorage.setItem(
						'qiyu-hero-bg',
						JSON.stringify({
							mode: this.heroBgMode,
							color: this.heroBgColor,
							image: this.heroBgImage,
							maskOpacity: this.heroBgMaskOpacity,
						})
					);
				} catch {
					/* ignore */
				}
				this.applyDocumentTheme();
			},

			applyDocumentTheme() {
				const deep = this.heroBgColor;
				document.body.style.backgroundColor =
					this.heroBgMode === 'color' ? deep : '#041424';
			},

			setHeroBgMode(mode) {
				this.heroBgMode = mode;
				this.saveHeroBgSettings();
			},

			selectHeroBgColor(color) {
				this.heroBgColor = color;
				this.saveHeroBgSettings();
			},

			selectHeroBgImage(url) {
				this.heroBgImage = url;
				this.saveHeroBgSettings();
			},

			handleCharacterWheel(e) {
				if (this.characterWheelLocked) return;
				if (Math.abs(e.deltaY) < 20) return;
				this.switchCharacter(e.deltaY > 0 ? 1 : -1);
			},

			prevCharacter() {
				this.switchCharacter(-1);
			},

			nextCharacter() {
				this.switchCharacter(1);
			},

			switchCharacter(direction) {
				const len = this.characterImages.length;
				if (this.characterWheelLocked || len < 2) return;

				this.characterWheelLocked = true;
				this.isImageChanging = true;
				this.currentCharacterIndex = (this.currentCharacterIndex + direction + len) % len;

				if (this.characterSwitchTimer) clearTimeout(this.characterSwitchTimer);
				this.characterSwitchTimer = setTimeout(() => {
					this.isImageChanging = false;
					this.characterWheelLocked = false;
					this.characterSwitchTimer = null;
				}, 560);
			},

			goToCharacter(index) {
				if (index === this.currentCharacterIndex || this.characterWheelLocked) return;
				this.characterWheelLocked = true;
				this.isImageChanging = true;
				this.currentCharacterIndex = index;

				if (this.characterSwitchTimer) clearTimeout(this.characterSwitchTimer);
				this.characterSwitchTimer = setTimeout(() => {
					this.isImageChanging = false;
					this.characterWheelLocked = false;
					this.characterSwitchTimer = null;
				}, 560);
			},

			// ========== 轮播相关方法 ==========
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

			scrollToShowcase() {
				const el = this.$refs.showcaseSection;
				if (el) {
					el.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			},

			selectVoiceLine(index) {
				if (this.activeVoiceIndex === index) return;
				this.activeVoiceIndex = index;
				this.voicePulse = true;
				setTimeout(() => {
					this.voicePulse = false;
				}, 600);
			},

			heroStarStyle(i) {
				return {
					left: `${(i * 17 + 3) % 98}%`,
					top: `${(i * 23 + 7) % 92}%`,
					'--star-delay': `${(i * 0.35) % 5}s`,
					'--star-size': `${1 + (i % 3)}px`,
					'--star-duration': `${2.5 + (i % 5) * 0.9}s`,
				};
			},

			bubbleStyle(i) {
				const left = (i * 9.3 + 3) % 96;
				const delay = (i * 0.85) % 12;
				const duration = 13 + (i % 7) * 2;
				const size = 4 + (i % 6) * 3;
				return {
					left: `${left}%`,
					'--bubble-delay': `${delay}s`,
					'--bubble-duration': `${duration}s`,
					'--bubble-size': `${size}px`,
				};
			},

			initWaterRipple() {
				const canvas = this.$refs.waterRippleCanvas;
				if (!canvas || typeof window === 'undefined') return;
				if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

				const ctx = canvas.getContext('2d', { alpha: true });
				if (!ctx) return;

				let viewW = 0;
				let viewH = 0;
				let simW = 0;
				let simH = 0;
				let buffer1 = null;
				let buffer2 = null;

				const damp = 0.984;
				const simCanvas = document.createElement('canvas');
				const simCtx = simCanvas.getContext('2d', { alpha: true });

				const resize = () => {
					viewW = window.innerWidth;
					viewH = window.innerHeight;
					const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
					canvas.width = Math.floor(viewW * dpr);
					canvas.height = Math.floor(viewH * dpr);
					canvas.style.width = `${viewW}px`;
					canvas.style.height = `${viewH}px`;
					ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

					const scale = Math.min(1, 520 / viewW, 380 / viewH);
					simW = Math.max(160, Math.floor(viewW * scale));
					simH = Math.max(120, Math.floor(viewH * scale));
					simCanvas.width = simW;
					simCanvas.height = simH;

					const size = simW * simH;
					buffer1 = new Float32Array(size);
					buffer2 = new Float32Array(size);
				};

				const drop = (x, y, radius, strength) => {
					const cx = Math.floor(x);
					const cy = Math.floor(y);
					const r2 = radius * radius;
					for (let j = -radius; j <= radius; j++) {
						for (let i = -radius; i <= radius; i++) {
							const px = cx + i;
							const py = cy + j;
							if (px <= 0 || py <= 0 || px >= simW - 1 || py >= simH - 1) continue;
							const d2 = i * i + j * j;
							if (d2 <= r2) {
								buffer1[py * simW + px] += strength * (1 - d2 / r2);
							}
						}
					}
				};

				const randomDrop = () => {
					drop(
						Math.random() * simW,
						Math.random() * simH,
						4 + Math.random() * 8,
						90 + Math.random() * 110
					);
				};

				const scheduleDrop = () => {
					randomDrop();
					if (Math.random() > 0.45) randomDrop();
					this.waterRippleDropTimer = window.setTimeout(scheduleDrop, 700 + Math.random() * 1800);
				};

				const update = () => {
					for (let y = 1; y < simH - 1; y++) {
						const row = y * simW;
						for (let x = 1; x < simW - 1; x++) {
							const idx = row + x;
							buffer2[idx] =
								(buffer1[idx - 1] +
									buffer1[idx + 1] +
									buffer1[idx - simW] +
									buffer1[idx + simW]) /
									2 -
								buffer2[idx];
							buffer2[idx] *= damp;
						}
					}
					const swap = buffer1;
					buffer1 = buffer2;
					buffer2 = swap;
				};

				const render = () => {
					const imageData = simCtx.createImageData(simW, simH);
					const data = imageData.data;
					for (let y = 1; y < simH - 1; y++) {
						const row = y * simW;
						for (let x = 1; x < simW - 1; x++) {
							const idx = row + x;
							const offset =
								(buffer1[idx - 1] -
									buffer1[idx + 1] +
									buffer1[idx - simW] -
									buffer1[idx + simW]) *
								0.55;
							const intensity = Math.min(255, Math.abs(offset) * 3.2 + 12);
							const pi = idx * 4;
							data[pi] = 100 + offset * 0.4;
							data[pi + 1] = 210 + offset * 0.6;
							data[pi + 2] = 245 + offset * 0.3;
							data[pi + 3] = intensity;
						}
					}
					simCtx.putImageData(imageData, 0, 0);
					ctx.clearRect(0, 0, viewW, viewH);
					ctx.imageSmoothingEnabled = true;
					ctx.drawImage(simCanvas, 0, 0, viewW, viewH);
				};

				const loop = () => {
					update();
					render();
					this.waterRippleRaf = requestAnimationFrame(loop);
				};

				resize();
				this.waterRippleResizeHandler = resize;
				window.addEventListener('resize', resize);
				for (let i = 0; i < 5; i++) randomDrop();
				scheduleDrop();
				loop();
			},

			destroyWaterRipple() {
				if (this.waterRippleRaf) {
					cancelAnimationFrame(this.waterRippleRaf);
					this.waterRippleRaf = null;
				}
				if (this.waterRippleDropTimer) {
					clearTimeout(this.waterRippleDropTimer);
					this.waterRippleDropTimer = null;
				}
				if (this.waterRippleResizeHandler) {
					window.removeEventListener('resize', this.waterRippleResizeHandler);
					this.waterRippleResizeHandler = null;
				}
			},

			getPetalStyle(i) {
				const left = (i * 7.3 + 5) % 95;
				const delay = (i * 0.7) % 8;
				const duration = 12 + (i % 5) * 2;
				const size = 8 + (i % 4) * 3;
				return {
					left: `${left}%`,
					'--petal-delay': `${delay}s`,
					'--petal-duration': `${duration}s`,
					'--petal-size': `${size}px`,
				};
			},

			getSparkStyle(i) {
				return {
					left: `${(i * 13 + 8) % 90}%`,
					top: `${(i * 17 + 10) % 85}%`,
					'--spark-delay': `${i * 0.5}s`,
				};
			},

			initShowcaseReveal() {
				const root = this.$el;
				if (!root || typeof IntersectionObserver === 'undefined') {
					root?.querySelectorAll('.reveal-item').forEach((el) => el.classList.add('revealed'));
					return;
				}
				this.showcaseObserver = new IntersectionObserver(
					(entries) => {
						entries.forEach((entry) => {
							if (entry.isIntersecting) entry.target.classList.add('revealed');
						});
					},
					{ threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
				);
				root.querySelectorAll('.reveal-item').forEach((el) => {
					this.showcaseObserver.observe(el);
				});
			},

			handleScroll() {
				const showcaseSection = this.$refs.showcaseSection;
				if (showcaseSection && window.scrollY > 80) {
					showcaseSection.classList.add('show');
				}
			},
		},
	};
</script>

<style>
	html,
	body {
		height: 100%;
		overflow-x: hidden;
		background: #041424;
	}

	/* 全局重置 */
	#qiyu-home {
		margin: 0;
		padding: 0;
		position: relative;
		--coral: #fb7185;
		--coral-soft: #fda4af;
		--teal: #22d3ee;
		--teal-deep: #06b6d4;
		--aqua: #38bdf8;
		--seafoam: #a5f3fc;
		--pink: var(--coral);
		--pink-soft: var(--coral-soft);
		--purple: var(--teal);
		--purple-deep: var(--teal-deep);
		--violet: var(--seafoam);
		--bg-deep: #041424;
		--bg-mid: #0a2540;
		--bg-light: #0f3555;
		--text-primary: #e8f8fc;
		--text-muted: #8ecae6;
		--glass: rgba(255, 255, 255, 0.05);
		--glass-border: rgba(142, 202, 230, 0.14);
		--glow: rgba(34, 211, 238, 0.4);
		--shadow-soft: rgba(0, 0, 0, 0.4);
		min-height: 100vh;
		color: var(--text-primary);
		font-family: 'Poppins', 'PingFang SC', sans-serif;
	}

	#qiyu-home * {
		box-sizing: border-box;
	}

	.site-bg {
		position: fixed;
		inset: 0;
		z-index: 0;
		pointer-events: none;
	}

	.site-bg-solid {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 85% 50% at 50% 0%, rgba(34, 211, 238, 0.14), transparent 60%),
			radial-gradient(ellipse 50% 40% at 90% 80%, rgba(251, 113, 133, 0.07), transparent 55%),
			linear-gradient(
				180deg,
				var(--bg-light) 0%,
				var(--bg-mid) 45%,
				var(--bg-deep) 100%
			);
		transition: background 0.6s ease;
	}

	.site-bg-image {
		position: absolute;
		inset: 0;
		background-size: cover;
		background-position: center;
		background-attachment: fixed;
	}

	.site-bg-mask {
		position: absolute;
		inset: 0;
		background:
			linear-gradient(
				180deg,
				rgba(4, 20, 36, calc(var(--mask-strength, 0.72) * 0.5)) 0%,
				rgba(4, 20, 36, calc(var(--mask-strength, 0.72) * 0.82)) 50%,
				rgba(2, 12, 24, var(--mask-strength, 0.72)) 100%
			),
			radial-gradient(ellipse 85% 70% at 50% 25%, transparent 18%, rgba(4, 20, 36, 0.52) 100%);
		box-shadow: inset 0 0 140px rgba(2, 12, 24, 0.55);
	}

	.site-bg-atmosphere {
		position: absolute;
		inset: 0;
		overflow: hidden;
		pointer-events: none;
	}

	.site-bg-surface {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 38%;
		background:
			radial-gradient(ellipse 110% 65% at 50% -12%, rgba(165, 243, 252, 0.14), transparent 65%),
			linear-gradient(180deg, rgba(6, 182, 212, 0.08) 0%, transparent 100%);
	}

	.site-bg-depth {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50%;
		background: linear-gradient(0deg, rgba(2, 10, 20, 0.5) 0%, transparent 100%);
	}

	.site-bg-accent {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(ellipse 58% 42% at 14% 28%, rgba(34, 211, 238, 0.13), transparent 55%),
			radial-gradient(ellipse 52% 40% at 84% 74%, rgba(251, 113, 133, 0.09), transparent 52%);
		transition: opacity 0.5s ease;
	}

	.site--bg-color .site-bg-accent {
		opacity: 0.55;
	}

	.site--bg-image .site-bg-accent {
		opacity: 0.42;
	}

	/* 水面涟漪：Canvas 物理波纹模拟 */
	.site-bg-water-ripple {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0.88;
		mix-blend-mode: screen;
		pointer-events: none;
	}

	.site-bg-bubbles {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.site-bg-bubble {
		position: absolute;
		bottom: -20px;
		width: var(--bubble-size, 8px);
		height: var(--bubble-size, 8px);
		border-radius: 50%;
		border: 1px solid rgba(165, 243, 252, 0.35);
		background: radial-gradient(circle at 30% 28%, rgba(255, 255, 255, 0.28), rgba(34, 211, 238, 0.08));
		box-shadow: 0 0 8px rgba(34, 211, 238, 0.18);
		opacity: 0;
		animation: bubbleRise var(--bubble-duration, 15s) linear infinite;
		animation-delay: var(--bubble-delay, 0s);
	}

	@keyframes bubbleRise {
		0% { opacity: 0; transform: translateY(0) translateX(0); }
		10% { opacity: 0.6; }
		90% { opacity: 0.3; }
		100% { opacity: 0; transform: translateY(-108vh) translateX(14px); }
	}

	.site-bg-orb-wrap {
		position: absolute;
		pointer-events: none;
	}

	.site-bg-orb-wrap--teal {
		top: -6%;
		left: -4%;
	}

	.site-bg-orb-wrap--coral {
		bottom: -10%;
		right: -6%;
	}

	.site-bg-orb {
		border-radius: 50%;
		filter: blur(90px);
	}

	.site-bg-orb--teal {
		width: 360px;
		height: 360px;
		background: rgba(34, 211, 238, 0.13);
		animation: orbDrift 28s ease-in-out infinite alternate;
	}

	.site-bg-orb--coral {
		width: 320px;
		height: 320px;
		background: rgba(251, 113, 133, 0.11);
		animation: orbDrift 32s ease-in-out infinite alternate-reverse;
	}

	@keyframes orbDrift {
		0% { transform: translate(0, 0); }
		100% { transform: translate(20px, 16px); }
	}

	.site-bg-stars {
		position: absolute;
		inset: 0;
	}

	.site-bg-star {
		position: absolute;
		width: var(--star-size, 2px);
		height: var(--star-size, 2px);
		border-radius: 50%;
		background: var(--seafoam);
		box-shadow: 0 0 6px rgba(34, 211, 238, 0.55);
		animation: starTwinkle var(--star-duration, 4s) ease-in-out infinite;
		animation-delay: var(--star-delay, 0s);
	}

	@keyframes starTwinkle {
		0%, 100% { opacity: 0.2; }
		50% { opacity: 0.75; }
	}

	.site-content {
		position: relative;
		z-index: 1;
	}

	.site-bg-settings {
		position: fixed;
		top: 76px;
		right: 24px;
		z-index: 100;
	}

	.hero-bg-settings-btn {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--glass-border);
		background: rgba(4, 20, 36, 0.72);
		backdrop-filter: blur(12px);
		color: var(--text-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: color 0.25s ease, border-color 0.25s ease, background 0.25s ease;
	}

	#qiyu-home h1,
	#qiyu-home h2,
	#qiyu-home h3 {
		font-family: 'Montserrat', 'PingFang SC', sans-serif;
	}

	.hero {
		height: 100vh;
		min-height: 640px;
		position: relative;
		display: flex;
		align-items: center;
	}

	.hero-bg-settings-btn svg {
		width: 18px;
		height: 18px;
	}

	.hero-bg-settings-btn:hover,
	.hero-bg-settings-btn.active {
		color: var(--pink);
		border-color: rgba(251, 113, 133, 0.4);
		background: rgba(6, 42, 58, 0.85);
	}

	.hero-bg-panel {
		position: absolute;
		top: calc(100% + 10px);
		right: 0;
		width: min(280px, calc(100vw - 48px));
		padding: 16px;
		border-radius: 14px;
		border: 1px solid var(--glass-border);
		background: rgba(4, 20, 36, 0.92);
		backdrop-filter: blur(16px);
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.45);
	}

	.hero-bg-panel-title {
		margin: 0 0 12px;
		font-size: 13px;
		font-weight: 600;
		letter-spacing: 1px;
		color: var(--text-primary);
	}

	.hero-bg-mode-tabs {
		display: flex;
		gap: 6px;
		margin-bottom: 14px;
		padding: 4px;
		border-radius: 10px;
		background: rgba(255, 255, 255, 0.04);
	}

	.hero-bg-mode-tabs button {
		flex: 1;
		padding: 7px 0;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: var(--text-muted);
		font-size: 12px;
		cursor: pointer;
		transition: background 0.25s ease, color 0.25s ease;
	}

	.hero-bg-mode-tabs button.active {
		background: rgba(34, 211, 238, 0.28);
		color: var(--text-primary);
	}

	.hero-bg-options-label {
		margin: 0 0 8px;
		font-size: 11px;
		color: var(--text-muted);
		letter-spacing: 1px;
	}

	.hero-bg-swatches {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-bottom: 12px;
	}

	.hero-bg-swatch {
		width: 28px;
		height: 28px;
		padding: 0;
		border-radius: 50%;
		border: 2px solid transparent;
		cursor: pointer;
		transition: transform 0.2s ease, border-color 0.2s ease;
	}

	.hero-bg-swatch.active {
		border-color: var(--pink);
		transform: scale(1.08);
	}

	.hero-bg-custom-color {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		font-size: 12px;
		color: var(--text-muted);
	}

	.hero-bg-custom-color input[type='color'] {
		width: 36px;
		height: 28px;
		padding: 0;
		border: 1px solid var(--glass-border);
		border-radius: 6px;
		background: transparent;
		cursor: pointer;
	}

	.hero-bg-thumbs {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 8px;
		margin-bottom: 12px;
	}

	.hero-bg-thumb {
		position: relative;
		padding: 0;
		border: 2px solid transparent;
		border-radius: 10px;
		overflow: hidden;
		cursor: pointer;
		aspect-ratio: 16/10;
		background: rgba(255, 255, 255, 0.04);
		transition: border-color 0.25s ease;
	}

	.hero-bg-thumb img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.hero-bg-thumb span {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 4px 6px;
		font-size: 10px;
		text-align: center;
		color: #fff;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.65));
	}

	.hero-bg-thumb.active {
		border-color: var(--pink);
	}

	.hero-bg-mask-control {
		display: flex;
		flex-direction: column;
		gap: 6px;
		font-size: 12px;
		color: var(--text-muted);
	}

	.hero-bg-mask-control input[type='range'] {
		width: 100%;
		accent-color: var(--pink);
	}

	/* 入场：整块淡入，不逐元素乱跳 */
	.hero-text,
	.hero-visual {
		opacity: 0;
		transform: translateY(24px);
	}

	.hero-ready .hero-text {
		animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
	}

	.hero-ready .hero-visual {
		animation: heroFadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.22s forwards;
	}

	@keyframes heroFadeUp {
		to { opacity: 1; transform: translateY(0); }
	}

	/* 英雄区容器 */
	.hero-container {
		position: relative;
		z-index: 10;
		width: 100%;
		max-width: 1180px;
		margin: 0 auto;
		padding: 0 48px;
		display: grid;
		grid-template-columns: 1fr;
		gap: 48px;
		align-items: center;
	}

	@media (min-width: 992px) {
		.hero-container {
			grid-template-columns: 1fr 1fr;
			gap: 72px;
			padding: 0 56px;
		}
	}

	@media (max-width: 991px) {
		.hero-container {
			padding: 0 24px;
			padding-top: 24px;
		}
	}

	.hero-visual {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		grid-template-rows: 1fr auto;
		align-items: center;
		justify-items: center;
		column-gap: 20px;
		row-gap: 20px;
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
	}

	@media (min-width: 992px) {
		.hero-visual {
			max-width: 100%;
			column-gap: 24px;
		}
	}

	.hero-nav {
		grid-row: 1;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1px solid var(--glass-border);
		background: rgba(4, 20, 36, 0.6);
		backdrop-filter: blur(10px);
		color: var(--text-primary);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
		flex-shrink: 0;
	}

	.hero-nav svg {
		width: 18px;
		height: 18px;
	}

	.hero-nav:hover {
		background: rgba(34, 211, 238, 0.3);
		border-color: rgba(255, 255, 255, 0.2);
		transform: scale(1.05);
	}

	.hero-nav--prev { grid-column: 1; }
	.hero-nav--next { grid-column: 3; }

	.hero-visual .image-container {
		grid-column: 2;
		grid-row: 1;
		width: 100%;
	}

	.hero-image-meta {
		grid-column: 1 / -1;
		grid-row: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}

	.hero-image-caption {
		font-size: 14px;
		font-weight: 600;
		color: var(--text-muted);
		letter-spacing: 2px;
	}

	.hero-image-dots {
		display: flex;
		gap: 8px;
		align-items: center;
	}

	.hero-dot {
		width: 8px;
		height: 8px;
		padding: 0;
		border: none;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.hero-dot.active {
		width: 24px;
		border-radius: 4px;
		background: var(--pink);
		box-shadow: 0 0 10px var(--glow);
	}

	.hero-dot:hover:not(.active) {
		background: rgba(255, 255, 255, 0.55);
	}

	.media-frame {
		position: relative;
	}

	.media-frame-shine {
		position: absolute;
		inset: 0;
		z-index: 3;
		pointer-events: none;
		background: linear-gradient(
			115deg,
			transparent 40%,
			rgba(255, 255, 255, 0.05) 50%,
			transparent 60%
		);
		animation: frameShine 18s ease-in-out infinite;
	}

	@keyframes frameShine {
		0%, 100% { opacity: 0.2; transform: translateX(-30%); }
		50% { opacity: 0.45; transform: translateX(30%); }
	}

	.frame-corner {
		position: absolute;
		width: 22px;
		height: 22px;
		border-color: rgba(34, 211, 238, 0.55);
		border-style: solid;
		z-index: 4;
		pointer-events: none;
	}

	.frame-corner--tl { top: 12px; left: 12px; border-width: 2px 0 0 2px; }
	.frame-corner--tr { top: 12px; right: 12px; border-width: 2px 2px 0 0; }
	.frame-corner--bl { bottom: 12px; left: 12px; border-width: 0 0 2px 2px; }
	.frame-corner--br { bottom: 12px; right: 12px; border-width: 0 2px 2px 0; }

	.hero-text {
		position: relative;
	}

	@media (min-width: 992px) {
		.hero-text {
			text-align: left;
		}

		.hero-eyebrow,
		.hero-title,
		.hero-subtitle,
		.hero-desc {
			text-align: left;
		}

		.hero-divider {
			margin: 0 0 20px;
		}

		.hero-tags {
			justify-content: flex-start;
		}

		.hero-desc {
			margin-left: 0;
			margin-right: 0;
		}
	}

	@media (max-width: 991px) {
		.hero-text {
			text-align: center;
		}
	}

	.hero-eyebrow {
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 4px;
		text-transform: uppercase;
		color: var(--violet);
		margin-bottom: 12px;
		text-align: center;
		opacity: 0.85;
	}

	.hero-divider {
		width: 48px;
		height: 2px;
		margin: 0 auto 20px;
		background: linear-gradient(90deg, transparent, var(--pink), var(--purple), transparent);
		border-radius: 1px;
		opacity: 0.8;
	}

	.hero-title {
		font-size: clamp(3.5rem, 9vw, 6.5rem);
		font-weight: 800;
		line-height: 1.05;
		margin-bottom: 16px;
		text-align: center;
		letter-spacing: 0.08em;
		background: linear-gradient(135deg, #fff 0%, var(--pink-soft) 45%, var(--purple) 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
		filter: drop-shadow(0 0 24px rgba(34, 211, 238, 0.22));
	}

	.hero-subtitle {
		font-size: clamp(1.1rem, 2.5vw, 1.6rem);
		color: var(--text-muted);
		margin-bottom: 16px;
		letter-spacing: 3px;
		text-align: center;
		min-height: 1.6em;
	}

	.hero-tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-bottom: 20px;
	}

	.hero-tag {
		padding: 5px 14px;
		font-size: 12px;
		letter-spacing: 1px;
		color: var(--violet);
		background: rgba(34, 211, 238, 0.12);
		border: 1px solid rgba(34, 211, 238, 0.28);
		border-radius: 999px;
		backdrop-filter: blur(6px);
		transition: border-color 0.3s ease, background 0.3s ease, transform 0.3s ease;
	}

	.hero-tag:hover {
		border-color: rgba(251, 113, 133, 0.45);
		background: rgba(251, 113, 133, 0.1);
		transform: translateY(-2px);
	}

	.hero-desc {
		font-size: clamp(0.95rem, 1.8vw, 1.05rem);
		color: rgba(250, 245, 255, 0.72);
		line-height: 1.9;
		margin-bottom: 0;
		text-align: center;
		max-width: 420px;
		margin-left: auto;
		margin-right: auto;
	}

	.image-container {
		position: relative;
		width: 100%;
		display: flex;
		justify-content: center;
	}

	.character-halo {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 130%;
		height: 115%;
		transform: translate(-50%, -50%);
		background: radial-gradient(
			ellipse 62% 58% at 50% 42%,
			rgba(34, 211, 238, 0.2),
			rgba(251, 113, 133, 0.06) 48%,
			transparent 72%
		);
		filter: blur(36px);
		pointer-events: none;
		animation: haloPulse 8s ease-in-out infinite;
	}

	@keyframes haloPulse {
		0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
		50% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.03); }
	}

	.character-frame {
		position: relative;
		width: 100%;
		max-width: 400px;
		aspect-ratio: 4/5;
		border-radius: 22px;
		overflow: hidden;
		background:
			radial-gradient(ellipse 78% 58% at 50% 22%, rgba(34, 211, 238, 0.16), transparent 58%),
			radial-gradient(ellipse 48% 42% at 82% 88%, rgba(251, 113, 133, 0.07), transparent 55%),
			linear-gradient(165deg, rgba(10, 37, 64, 0.88), rgba(4, 20, 36, 0.94));
		backdrop-filter: blur(14px);
		box-shadow:
			0 28px 72px rgba(0, 0, 0, 0.48),
			0 0 56px rgba(34, 211, 238, 0.14),
			inset 0 1px 0 rgba(165, 243, 252, 0.1);
		z-index: 2;
	}

	@media (min-width: 992px) {
		.character-frame {
			max-width: 480px;
			border-radius: 24px;
		}
	}

	.character-frame.is-switching .character-img {
		opacity: 0;
	}

	.character-frame::before {
		content: '✦';
		position: absolute;
		top: 42%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: clamp(3rem, 12vw, 5rem);
		color: rgba(34, 211, 238, 0.14);
		pointer-events: none;
		z-index: 0;
	}

	.character-frame-border {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		border: 1px solid rgba(142, 202, 230, 0.18);
		pointer-events: none;
		z-index: 3;
	}

	.character-frame-border::before {
		content: '';
		position: absolute;
		inset: -1px;
		border-radius: inherit;
		padding: 1px;
		background: linear-gradient(
			160deg,
			rgba(34, 211, 238, 0.55),
			rgba(165, 243, 252, 0.25) 40%,
			rgba(251, 113, 133, 0.2) 70%,
			transparent 85%
		);
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none;
	}

	.character-img {
		position: relative;
		z-index: 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: opacity 0.45s ease, transform 0.45s ease;
		background:
			radial-gradient(circle at 50% 35%, rgba(34, 211, 238, 0.18), transparent 52%),
			linear-gradient(160deg, #0a2540, #041424);
	}

	.image-fade {
		opacity: 0;
		transform: scale(1.02);
	}

	.hero-scroll {
		position: absolute;
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 10;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		padding: 8px 16px;
		border: none;
		background: transparent;
		color: var(--text-muted);
		font-size: 12px;
		letter-spacing: 2px;
		cursor: pointer;
		transition: color 0.25s ease;
	}

	.hero-scroll svg {
		width: 18px;
		height: 18px;
		opacity: 0.7;
		animation: scrollHint 2.5s ease-in-out infinite;
	}

	@keyframes scrollHint {
		0%, 100% { transform: translateY(0); opacity: 0.5; }
		50% { transform: translateY(5px); opacity: 0.9; }
	}

	.hero-scroll:hover {
		color: var(--pink);
	}

	.hero-scroll:hover svg {
		animation: none;
		opacity: 1;
	}

	.showcase-section {
		position: relative;
		padding: 120px 20px 140px;
		background: transparent;
		overflow: hidden;
		opacity: 0;
		transform: translateY(40px);
		transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.showcase-section.show {
		opacity: 1;
		transform: translateY(0);
	}

	.showcase-bg {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 0;
	}

	.showcase-petals {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.showcase-petal {
		position: absolute;
		bottom: -20px;
		width: var(--petal-size, 10px);
		height: var(--petal-size, 10px);
		border-radius: 50%;
		border: 1px solid rgba(165, 243, 252, 0.3);
		background: radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.3), rgba(34, 211, 238, 0.12));
		box-shadow: 0 0 6px rgba(34, 211, 238, 0.2);
		opacity: 0;
		animation: petalFall var(--petal-duration, 14s) linear infinite;
		animation-delay: var(--petal-delay, 0s);
	}

	@keyframes petalFall {
		0% {
			opacity: 0;
			transform: translateY(0) rotate(0deg) translateX(0);
		}
		8% { opacity: 0.75; }
		90% { opacity: 0.5; }
		100% {
			opacity: 0;
			transform: translateY(-110vh) rotate(720deg) translateX(60px);
		}
	}

	.showcase-sparkles {
		position: absolute;
		inset: 0;
	}

	.showcase-spark {
		position: absolute;
		width: 3px;
		height: 3px;
		background: #fff;
		border-radius: 50%;
		box-shadow: 0 0 6px rgba(251, 113, 133, 0.8);
		animation: sparkTwinkle 3s ease-in-out infinite;
		animation-delay: var(--spark-delay, 0s);
	}

	@keyframes sparkTwinkle {
		0%, 100% { opacity: 0.15; transform: scale(0.6); }
		50% { opacity: 1; transform: scale(1.4); }
	}

	.section-container {
		position: relative;
		z-index: 1;
		max-width: 1100px;
		margin: 0 auto;
	}

	.reveal-item {
		opacity: 0;
		transform: translateY(36px);
		transition:
			opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
			transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.reveal-item.revealed {
		opacity: 1;
		transform: translateY(0);
	}

	.section-header {
		text-align: center;
		margin-bottom: 72px;
	}

	.section-eyebrow {
		font-size: 11px;
		letter-spacing: 4px;
		color: var(--pink);
		margin-bottom: 16px;
		opacity: 0.85;
	}

	.section-title {
		font-size: clamp(1.8rem, 4.5vw, 2.8rem);
		font-weight: 800;
		color: var(--text-primary);
		margin-bottom: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
	}

	.title-deco {
		color: var(--purple);
		font-size: 0.65em;
		animation: decoSpin 6s linear infinite;
	}

	.title-deco:last-child {
		animation-direction: reverse;
	}

	@keyframes decoSpin {
		0%, 100% { opacity: 0.5; transform: rotate(0deg) scale(1); }
		50% { opacity: 1; transform: rotate(180deg) scale(1.15); }
	}

	.title-text {
		background: linear-gradient(135deg, #e8f8fc, var(--coral) 40%, var(--teal) 80%, var(--seafoam));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.section-desc {
		font-size: clamp(0.95rem, 2vw, 1.1rem);
		color: var(--text-muted);
		letter-spacing: 2px;
	}

	.title-shimmer {
		width: 120px;
		height: 2px;
		margin: 24px auto 0;
		background: linear-gradient(90deg, transparent, var(--pink), var(--purple), transparent);
		animation: shimmerLine 3s ease-in-out infinite;
	}

	@keyframes shimmerLine {
		0%, 100% { opacity: 0.4; transform: scaleX(0.8); }
		50% { opacity: 1; transform: scaleX(1.2); }
	}

	.profile-module {
		margin-bottom: 72px;
	}

	.profile-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20px;
		margin-bottom: 28px;
	}

	.profile-card {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		padding: 28px 16px;
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
		border-radius: 20px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(16px);
		overflow: hidden;
		transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.45s ease, border-color 0.45s ease;
		animation: cardFloatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: var(--card-delay, 0s);
	}

	.reveal-item.revealed .profile-card:hover {
		transform: translateY(-6px);
		border-color: rgba(251, 113, 133, 0.35);
		box-shadow: 0 16px 48px rgba(34, 211, 238, 0.2), 0 0 0 1px rgba(251, 113, 133, 0.15);
	}

	@keyframes cardFloatIn {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}

	.profile-card-shine {
		position: absolute;
		inset: 0;
		background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.08) 50%, transparent 60%);
		transform: translateX(-100%);
		transition: transform 0.7s ease;
	}

	.profile-card:hover .profile-card-shine {
		transform: translateX(100%);
	}

	.profile-icon {
		font-size: 1.4rem;
		color: var(--pink);
	}

	.profile-label {
		font-size: 11px;
		color: var(--text-muted);
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.profile-value {
		font-size: 16px;
		font-weight: 600;
		color: var(--text-primary);
		text-align: center;
	}

	.profile-color-swatch {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--pink), var(--purple));
		box-shadow: 0 0 24px rgba(251, 113, 133, 0.5), 0 0 40px rgba(34, 211, 238, 0.3);
		animation: colorPulse 3s ease-in-out infinite;
	}

	@keyframes colorPulse {
		0%, 100% { box-shadow: 0 0 20px rgba(251, 113, 133, 0.4); }
		50% { box-shadow: 0 0 32px rgba(34, 211, 238, 0.6); }
	}

	.character-tags {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 12px;
	}

	.character-tag {
		padding: 8px 18px;
		font-size: 13px;
		color: var(--text-muted);
		background: rgba(34, 211, 238, 0.1);
		border: 1px solid rgba(34, 211, 238, 0.25);
		border-radius: 999px;
		backdrop-filter: blur(8px);
		transition: all 0.35s ease;
		animation: tagPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
		animation-delay: calc(var(--tag-delay, 0s) + 0.3s);
	}

	.reveal-item.revealed .character-tag:hover {
		color: var(--text-primary);
		background: rgba(251, 113, 133, 0.15);
		border-color: rgba(251, 113, 133, 0.4);
		transform: translateY(-2px);
		box-shadow: 0 4px 16px rgba(251, 113, 133, 0.2);
	}

	@keyframes tagPop {
		from { opacity: 0; transform: scale(0.85); }
		to { opacity: 1; transform: scale(1); }
	}

	.gallery-module {
		margin-bottom: 80px;
	}

	.gallery-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 24px;
		padding: 0 4px;
	}

	.gallery-title {
		font-size: 1.35rem;
		font-weight: 700;
		color: var(--text-primary);
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.gallery-title-icon {
		color: var(--pink);
		animation: iconPulse 2s ease-in-out infinite;
	}

	@keyframes iconPulse {
		0%, 100% { opacity: 0.6; }
		50% { opacity: 1; }
	}

	.gallery-counter {
		font-size: 14px;
		color: var(--text-muted);
		font-variant-numeric: tabular-nums;
		letter-spacing: 1px;
	}

	.gallery-counter em {
		font-style: normal;
		font-size: 1.4em;
		font-weight: 700;
		color: var(--pink);
	}

	.counter-sep {
		margin: 0 6px;
		opacity: 0.4;
	}

	.carousel-container {
		position: relative;
		width: 100%;
		overflow: hidden;
		border-radius: 24px;
		border: 1px solid var(--glass-border);
		box-shadow:
			0 32px 80px rgba(0, 0, 0, 0.45),
			inset 0 1px 0 rgba(255, 255, 255, 0.08);
	}

	.carousel-frame-glow {
		position: absolute;
		inset: -2px;
		border-radius: 26px;
		background: linear-gradient(135deg, rgba(251, 113, 133, 0.4), rgba(34, 211, 238, 0.3), rgba(251, 113, 133, 0.2));
		z-index: 0;
		opacity: 0.6;
		animation: frameGlow 4s ease-in-out infinite alternate;
		pointer-events: none;
	}

	@keyframes frameGlow {
		0% { opacity: 0.4; filter: blur(0); }
		100% { opacity: 0.75; filter: blur(1px); }
	}

	.carousel-track {
		position: relative;
		z-index: 1;
		display: flex;
		width: 100%;
		height: 520px;
		transition: transform 0.75s cubic-bezier(0.23, 1, 0.32, 1);
	}

	.carousel-slide {
		flex: 0 0 100%;
		width: 100%;
		height: 100%;
		position: relative;
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
	}

	.carousel-slide.active .slide-img-inner {
		animation: kenBurns 16s ease-in-out infinite alternate;
	}

	@keyframes kenBurns {
		0% { transform: scale(1) translate(0, 0); }
		100% { transform: scale(1.1) translate(-1.5%, -1%); }
	}

	.slide-img-wrapper img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.slide-scanline {
		position: absolute;
		inset: 0;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			rgba(255, 255, 255, 0.015) 2px,
			rgba(255, 255, 255, 0.015) 4px
		);
		pointer-events: none;
		opacity: 0.5;
	}

	.slide-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 80px 48px 48px;
		background: linear-gradient(to top, rgba(8, 5, 15, 0.92) 0%, rgba(8, 5, 15, 0.4) 55%, transparent 100%);
		color: white;
		transform: translateY(12px);
		opacity: 0;
		transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.carousel-slide.active .slide-overlay,
	.carousel-slide:hover .slide-overlay {
		transform: translateY(0);
		opacity: 1;
	}

	.slide-badge {
		display: inline-block;
		padding: 4px 12px;
		margin-bottom: 12px;
		font-size: 11px;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: var(--pink);
		border: 1px solid rgba(251, 113, 133, 0.4);
		border-radius: 999px;
		background: rgba(251, 113, 133, 0.1);
	}

	.slide-title {
		font-size: clamp(1.8rem, 4vw, 2.6rem);
		font-weight: 800;
		margin-bottom: 12px;
		background: linear-gradient(135deg, #fff, #e8f8fc);
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.slide-desc {
		font-size: clamp(0.95rem, 2vw, 1.15rem);
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.6;
		max-width: 520px;
	}

	.carousel-btn {
		position: absolute;
		top: 50%;
		transform: translateY(-50%) scale(0.9);
		width: 52px;
		height: 52px;
		border-radius: 50%;
		background: rgba(4, 20, 36, 0.55);
		border: 1px solid rgba(255, 255, 255, 0.25);
		color: white;
		cursor: pointer;
		z-index: 10;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
		backdrop-filter: blur(12px);
		opacity: 0.7;
	}

	.carousel-container:hover .carousel-btn {
		opacity: 1;
		transform: translateY(-50%) scale(1);
	}

	.carousel-btn:hover {
		background: rgba(34, 211, 238, 0.45);
		border-color: rgba(255, 255, 255, 0.6);
		box-shadow: 0 0 24px rgba(34, 211, 238, 0.4);
	}

	.prev-btn { left: 24px; }
	.next-btn { right: 24px; }

	.carousel-btn svg {
		width: 22px;
		height: 22px;
	}

	.carousel-indicators {
		position: absolute;
		bottom: 24px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 10px;
		z-index: 10;
	}

	.indicator {
		width: 32px;
		height: 4px;
		padding: 0;
		border: none;
		border-radius: 2px;
		background: rgba(255, 255, 255, 0.3);
		cursor: pointer;
		transition: all 0.4s ease;
	}

	.indicator.active {
		width: 48px;
		background: linear-gradient(90deg, var(--pink), var(--purple));
		box-shadow: 0 0 12px var(--glow);
	}

	.carousel-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: rgba(255, 255, 255, 0.08);
		z-index: 10;
	}

	.carousel-progress-bar {
		height: 100%;
		background: linear-gradient(90deg, var(--pink), var(--purple));
		transition: width 0.75s cubic-bezier(0.23, 1, 0.32, 1);
		box-shadow: 0 0 8px var(--glow);
	}

	.quote-module {
		position: relative;
		margin-bottom: 20px;
	}

	.quote-orbit {
		position: absolute;
		inset: -20px;
		pointer-events: none;
	}

	.orbit-dot {
		position: absolute;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--purple);
		box-shadow: 0 0 10px var(--glow);
	}

	.orbit-dot--1 {
		top: 10%;
		left: 8%;
		animation: orbitFloat 5s ease-in-out infinite;
	}

	.orbit-dot--2 {
		top: 20%;
		right: 10%;
		animation: orbitFloat 6s ease-in-out infinite reverse;
		animation-delay: -2s;
	}

	.orbit-dot--3 {
		bottom: 15%;
		left: 15%;
		animation: orbitFloat 7s ease-in-out infinite;
		animation-delay: -4s;
	}

	@keyframes orbitFloat {
		0%, 100% { transform: translate(0, 0); opacity: 0.5; }
		50% { transform: translate(12px, -12px); opacity: 1; }
	}

	.quote-frame {
		position: relative;
		padding: 52px 40px;
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(34, 211, 238, 0.04));
		border-radius: 24px;
		border: 1px solid var(--glass-border);
		backdrop-filter: blur(20px);
		overflow: hidden;
		box-shadow: 0 16px 48px var(--shadow-soft);
	}

	.quote-frame::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(251, 113, 133, 0.08), transparent 70%);
		pointer-events: none;
	}

	.quote-corner {
		position: absolute;
		width: 24px;
		height: 24px;
		border-color: rgba(34, 211, 238, 0.5);
		border-style: solid;
	}

	.quote-corner--tl { top: 16px; left: 16px; border-width: 2px 0 0 2px; }
	.quote-corner--tr { top: 16px; right: 16px; border-width: 2px 2px 0 0; }
	.quote-corner--bl { bottom: 16px; left: 16px; border-width: 0 0 2px 2px; }
	.quote-corner--br { bottom: 16px; right: 16px; border-width: 0 2px 2px 0; }

	.quote-content {
		position: relative;
		max-width: 680px;
		margin: 0 auto;
		text-align: center;
	}

	.quote-icon {
		width: 40px;
		height: 40px;
		margin-bottom: 24px;
		color: var(--purple);
		opacity: 0.6;
		animation: quoteIconFloat 4s ease-in-out infinite;
	}

	@keyframes quoteIconFloat {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-4px); }
	}

	.quote-text {
		font-size: clamp(1.15rem, 2.8vw, 1.55rem);
		color: var(--text-primary);
		line-height: 1.9;
		margin-bottom: 20px;
		font-style: italic;
		white-space: pre-line;
		transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.quote-author {
		font-size: 0.95rem;
		color: var(--text-muted);
		letter-spacing: 1px;
		transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.quote-fade {
		opacity: 0;
		transform: translateY(12px);
	}

	/* —— 扩展内容区块 —— */
	.block-eyebrow {
		font-size: 11px;
		letter-spacing: 4px;
		color: var(--pink);
		margin-bottom: 12px;
		opacity: 0.85;
	}

	.block-title {
		font-size: clamp(1.5rem, 3.5vw, 2rem);
		font-weight: 800;
		color: var(--text-primary);
		margin-bottom: 10px;
		background: linear-gradient(135deg, #e8f8fc, var(--coral) 50%, var(--teal));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.block-subtitle {
		font-size: 0.95rem;
		color: var(--text-muted);
		letter-spacing: 1px;
	}

	.block-header {
		text-align: center;
		margin-bottom: 48px;
	}

	.story-portrait {
		display: grid;
		grid-template-columns: 1fr 1.1fr;
		gap: 56px;
		align-items: center;
		margin-bottom: 100px;
	}

	.portrait-visual {
		position: relative;
	}

	.portrait-frame {
		position: relative;
		border-radius: 24px;
		overflow: hidden;
		border: 1px solid var(--glass-border);
		box-shadow: 0 24px 56px var(--shadow-soft);
	}

	.portrait-frame img {
		width: 100%;
		display: block;
		aspect-ratio: 3 / 4;
		object-fit: cover;
		transition: transform 8s ease;
	}

	.reveal-item.revealed .portrait-frame:hover img {
		transform: scale(1.05);
	}

	.portrait-glow {
		position: absolute;
		inset: -20%;
		background: radial-gradient(ellipse at 50% 80%, rgba(251, 113, 133, 0.25), transparent 60%);
		pointer-events: none;
		animation: glowPulse 6s ease-in-out infinite alternate;
	}

	.portrait-float {
		position: absolute;
		font-size: 1.5rem;
		color: var(--pink);
		text-shadow: 0 0 16px var(--glow);
		animation: portraitFloat 4s ease-in-out infinite;
	}

	.portrait-float--1 { top: 8%; right: -8%; }
	.portrait-float--2 { bottom: 12%; left: -6%; animation-delay: -2s; }

	@keyframes portraitFloat {
		0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.6; }
		50% { transform: translateY(-10px) rotate(15deg); opacity: 1; }
	}

	.portrait-paragraph {
		font-size: 1rem;
		line-height: 1.9;
		color: var(--text-muted);
		margin-bottom: 20px;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.7s ease, transform 0.7s ease;
		transition-delay: var(--para-delay, 0s);
	}

	.reveal-item.revealed .portrait-paragraph {
		opacity: 1;
		transform: translateY(0);
	}

	.timeline-module {
		margin-bottom: 100px;
	}

	.timeline-track {
		position: relative;
		max-width: 800px;
		margin: 0 auto;
		padding: 20px 0;
	}

	.timeline-line {
		position: absolute;
		left: 50%;
		top: 0;
		bottom: 0;
		width: 2px;
		transform: translateX(-50%);
		background: linear-gradient(180deg, transparent, var(--pink), var(--purple), transparent);
		opacity: 0.4;
	}

	.timeline-item {
		position: relative;
		width: 50%;
		padding: 0 40px 48px;
		opacity: 0;
		transform: translateY(24px);
		transition: opacity 0.7s ease, transform 0.7s ease;
		transition-delay: var(--item-delay, 0s);
	}

	.reveal-item.revealed .timeline-item {
		opacity: 1;
		transform: translateY(0);
	}

	.timeline-item:not(.timeline-item--right) {
		margin-left: 0;
		padding-right: 48px;
		text-align: right;
	}

	.timeline-item--right {
		margin-left: 50%;
		padding-left: 48px;
	}

	.timeline-dot {
		position: absolute;
		top: 24px;
		width: 14px;
		height: 14px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--pink), var(--purple));
		box-shadow: 0 0 16px var(--glow);
		z-index: 1;
	}

	.timeline-item:not(.timeline-item--right) .timeline-dot {
		right: -7px;
		transform: translateX(50%);
	}

	.timeline-item--right .timeline-dot {
		left: -7px;
		transform: translateX(-50%);
	}

	.timeline-card {
		padding: 24px 28px;
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
		border: 1px solid var(--glass-border);
		border-radius: 16px;
		backdrop-filter: blur(12px);
		transition: border-color 0.35s ease, box-shadow 0.35s ease;
	}

	.timeline-card:hover {
		border-color: rgba(251, 113, 133, 0.35);
		box-shadow: 0 8px 32px rgba(34, 211, 238, 0.15);
	}

	.timeline-year {
		font-size: 12px;
		letter-spacing: 2px;
		color: var(--pink);
	}

	.timeline-title {
		font-size: 1.15rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 8px 0;
	}

	.timeline-desc {
		font-size: 0.9rem;
		color: var(--text-muted);
		line-height: 1.7;
	}

	.traits-module {
		margin-bottom: 100px;
		padding: 48px 40px;
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.06), rgba(34, 211, 238, 0.04));
		border-radius: 24px;
		border: 1px solid var(--glass-border);
		box-shadow: 0 12px 40px var(--shadow-soft);
	}

	.traits-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 28px 48px;
		max-width: 720px;
		margin: 0 auto;
	}

	.trait-row {
		opacity: 0;
		transform: translateX(-12px);
		transition: opacity 0.6s ease, transform 0.6s ease;
		transition-delay: var(--trait-delay, 0s);
	}

	.reveal-item.revealed .trait-row {
		opacity: 1;
		transform: translateX(0);
	}

	.trait-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.trait-name {
		font-size: 14px;
		color: var(--text-primary);
		font-weight: 600;
	}

	.trait-value {
		font-size: 13px;
		color: var(--pink);
		font-variant-numeric: tabular-nums;
	}

	.trait-bar {
		height: 8px;
		background: rgba(255, 255, 255, 0.08);
		border-radius: 4px;
		overflow: hidden;
	}

	.trait-bar-fill {
		height: 100%;
		width: 0;
		border-radius: 4px;
		transition: width 1.4s cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: calc(var(--trait-delay, 0s) + 0.2s);
		box-shadow: 0 0 12px rgba(251, 113, 133, 0.3);
	}

	.reveal-item.revealed .trait-bar-fill {
		width: var(--fill);
	}

	.art-grid-module {
		margin-bottom: 100px;
	}

	.art-mosaic {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 220px;
		gap: 16px;
	}

	.art-card {
		position: relative;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--glass-border);
		opacity: 0;
		transform: scale(0.92);
		transition: opacity 0.6s ease, transform 0.6s ease, box-shadow 0.4s ease;
		transition-delay: var(--art-delay, 0s);
	}

	.reveal-item.revealed .art-card {
		opacity: 1;
		transform: scale(1);
	}

	.art-card--0 { grid-row: span 2; }
	.art-card--1 { grid-row: span 1; }
	.art-card--2 { grid-row: span 2; }

	.art-card img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.art-card:hover img {
		transform: scale(1.08);
	}

	.art-card-overlay {
		position: absolute;
		inset: 0;
		padding: 24px;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		background: linear-gradient(to top, rgba(8, 5, 15, 0.9) 0%, transparent 60%);
		opacity: 0;
		transform: translateY(8px);
		transition: all 0.45s ease;
	}

	.art-card:hover .art-card-overlay {
		opacity: 1;
		transform: translateY(0);
	}

	.art-card-tag {
		font-size: 10px;
		letter-spacing: 2px;
		color: var(--pink);
		margin-bottom: 6px;
	}

	.art-card-overlay h4 {
		font-size: 1.1rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 4px;
	}

	.art-card-overlay p {
		font-size: 0.85rem;
		color: rgba(255, 255, 255, 0.75);
	}

	.voice-module {
		margin-bottom: 100px;
	}

	.voice-layout {
		display: grid;
		grid-template-columns: 280px 1fr;
		gap: 32px;
		align-items: stretch;
	}

	.voice-list {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.voice-chip {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 18px;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid var(--glass-border);
		border-radius: 12px;
		color: var(--text-muted);
		cursor: pointer;
		transition: all 0.35s ease;
		text-align: left;
	}

	.voice-chip:hover,
	.voice-chip.active {
		background: rgba(34, 211, 238, 0.12);
		border-color: rgba(251, 113, 133, 0.35);
		color: var(--text-primary);
		transform: translateX(4px);
	}

	.voice-chip.active {
		box-shadow: 0 4px 20px rgba(34, 211, 238, 0.2);
	}

	.voice-chip-icon {
		font-size: 1.1rem;
		color: var(--pink);
	}

	.voice-display {
		position: relative;
		padding: 48px 40px;
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
		border: 1px solid var(--glass-border);
		border-radius: 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: 220px;
		overflow: hidden;
	}

	.voice-display--pulse {
		animation: voicePulse 0.6s ease;
	}

	@keyframes voicePulse {
		0% { box-shadow: 0 0 0 rgba(251, 113, 133, 0); }
		50% { box-shadow: 0 0 40px rgba(251, 113, 133, 0.25); }
		100% { box-shadow: 0 0 0 rgba(251, 113, 133, 0); }
	}

	.voice-wave {
		display: flex;
		gap: 4px;
		margin-bottom: 24px;
		height: 24px;
		align-items: flex-end;
	}

	.voice-wave span {
		width: 4px;
		background: linear-gradient(180deg, var(--pink), var(--purple));
		border-radius: 2px;
		animation: voiceWave 1s ease-in-out infinite;
	}

	.voice-wave span:nth-child(1) { height: 8px; animation-delay: 0s; }
	.voice-wave span:nth-child(2) { height: 16px; animation-delay: 0.1s; }
	.voice-wave span:nth-child(3) { height: 24px; animation-delay: 0.2s; }
	.voice-wave span:nth-child(4) { height: 14px; animation-delay: 0.3s; }
	.voice-wave span:nth-child(5) { height: 10px; animation-delay: 0.4s; }

	@keyframes voiceWave {
		0%, 100% { transform: scaleY(0.5); opacity: 0.5; }
		50% { transform: scaleY(1); opacity: 1; }
	}

	.voice-text {
		font-size: clamp(1.2rem, 2.5vw, 1.6rem);
		color: var(--text-primary);
		line-height: 1.7;
		font-style: italic;
		margin-bottom: 16px;
		transition: opacity 0.35s ease;
	}

	.voice-scene {
		font-size: 0.9rem;
		color: var(--text-muted);
		letter-spacing: 1px;
	}

	.memory-module {
		margin-bottom: 100px;
	}

	.memory-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.memory-card {
		padding: 28px 24px;
		background: linear-gradient(160deg, rgba(255, 255, 255, 0.05), transparent);
		border: 1px solid var(--glass-border);
		border-radius: 16px;
		text-align: center;
		transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
		opacity: 0;
		transform: translateY(20px);
		transition-delay: var(--mem-delay, 0s);
	}

	.reveal-item.revealed .memory-card {
		opacity: 1;
		transform: translateY(0);
	}

	.memory-card:hover {
		transform: translateY(-6px);
		border-color: rgba(251, 113, 133, 0.3);
		box-shadow: 0 12px 36px rgba(34, 211, 238, 0.12);
	}

	.memory-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 12px;
	}

	.memory-card h4 {
		font-size: 1rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 8px;
	}

	.memory-card p {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.65;
	}

	.explore-module {
		margin-bottom: 60px;
	}

	.explore-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 20px;
	}

	.explore-card {
		position: relative;
		display: block;
		padding: 32px 28px;
		background: linear-gradient(145deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0.02));
		border: 1px solid var(--glass-border);
		border-radius: 18px;
		text-decoration: none;
		color: inherit;
		overflow: hidden;
		opacity: 0;
		transform: translateY(16px);
		transition: opacity 0.6s ease, transform 0.6s ease, border-color 0.35s ease, box-shadow 0.35s ease;
		transition-delay: var(--explore-delay, 0s);
	}

	.reveal-item.revealed .explore-card {
		opacity: 1;
		transform: translateY(0);
	}

	.explore-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(135deg, rgba(251, 113, 133, 0.08), rgba(34, 211, 238, 0.06));
		opacity: 0;
		transition: opacity 0.35s ease;
	}

	.explore-card:hover {
		border-color: rgba(251, 113, 133, 0.4);
		box-shadow: 0 16px 48px rgba(34, 211, 238, 0.18);
		transform: translateY(-4px);
	}

	.explore-card:hover::before {
		opacity: 1;
	}

	.explore-icon {
		font-size: 1.5rem;
		color: var(--purple);
		display: block;
		margin-bottom: 14px;
		position: relative;
	}

	.explore-card h4 {
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 8px;
		position: relative;
	}

	.explore-card p {
		font-size: 0.85rem;
		color: var(--text-muted);
		line-height: 1.5;
		position: relative;
	}

	.explore-arrow {
		position: absolute;
		top: 28px;
		right: 24px;
		font-size: 1.2rem;
		color: var(--pink);
		opacity: 0;
		transform: translateX(-8px);
		transition: all 0.35s ease;
	}

	.explore-card:hover .explore-arrow {
		opacity: 1;
		transform: translateX(0);
	}

	.footer {
		position: relative;
		background: transparent;
		padding: 56px 20px 48px;
		text-align: center;
		border-top: 1px solid var(--glass-border);
		overflow: hidden;
	}

	.footer-wave {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 1px;
		background: linear-gradient(90deg, transparent, var(--pink), var(--purple), transparent);
		animation: footerWave 4s ease-in-out infinite;
	}

	@keyframes footerWave {
		0%, 100% { opacity: 0.5; }
		50% { opacity: 1; }
	}

	.footer-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	.footer-brand {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 8px;
		letter-spacing: 2px;
	}

	.footer-copy {
		font-size: 13px;
		color: rgba(255, 255, 255, 0.35);
		letter-spacing: 0.5px;
		margin-bottom: 16px;
	}

	.footer-hearts {
		display: flex;
		justify-content: center;
		gap: 16px;
		color: var(--pink);
		opacity: 0.5;
	}

	.footer-hearts span {
		animation: heartBeat 2s ease-in-out infinite;
	}

	.footer-hearts span:nth-child(2) { animation-delay: 0.3s; }
	.footer-hearts span:nth-child(3) { animation-delay: 0.6s; }

	@keyframes heartBeat {
		0%, 100% { transform: scale(1); opacity: 0.4; }
		50% { transform: scale(1.2); opacity: 0.9; }
	}

	#qiyu-home ::-webkit-scrollbar-track {
		background: var(--bg-deep);
	}

	#qiyu-home ::-webkit-scrollbar-thumb {
		background: var(--purple);
		border-radius: 4px;
	}

	#qiyu-home ::-webkit-scrollbar-thumb:hover {
		background: var(--pink);
	}

	@media (prefers-reduced-motion: reduce) {
		.hero-text,
		.hero-visual {
			opacity: 1 !important;
			transform: none !important;
		}

		.site-bg-orb,
		.site-bg-star,
		.site-bg-bubble,
		.media-frame-shine,
		.character-halo,
		.hero-scroll svg {
			animation: none !important;
		}
		.showcase-petal,
		.showcase-spark,
		.title-deco,
		.profile-color-swatch,
		.carousel-slide.active .slide-img-inner,
		.voice-wave span,
		.portrait-float {
			animation: none !important;
		}
		.reveal-item,
		.reveal-item.revealed .trait-bar-fill {
			opacity: 1;
			transform: none;
			width: var(--fill);
		}
	}

	#qiyu-home ::-webkit-scrollbar {
		width: 6px;
	}

	.indicator:hover {
		background: rgba(255, 255, 255, 0.55);
	}

	@media (max-width: 900px) {
		.profile-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.art-mosaic {
			grid-template-columns: repeat(2, 1fr);
		}

		.explore-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.memory-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 768px) {
		.showcase-section {
			padding: 80px 16px 64px;
		}

		.section-header {
			margin-bottom: 48px;
		}

		.profile-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 14px;
		}

		.profile-card {
			padding: 20px 12px;
		}

		.carousel-track {
			height: 320px;
		}

		.slide-overlay {
			padding: 48px 24px 32px;
			opacity: 1;
			transform: translateY(0);
		}

		.carousel-btn {
			width: 44px;
			height: 44px;
			opacity: 0.85;
		}

		.prev-btn { left: 12px; }
		.next-btn { right: 12px; }

		.quote-frame {
			padding: 36px 24px;
		}

		.gallery-header {
			flex-direction: column;
			align-items: flex-start;
			gap: 8px;
		}

		.story-portrait {
			grid-template-columns: 1fr;
			gap: 36px;
			margin-bottom: 72px;
		}

		.timeline-line {
			left: 20px;
		}

		.timeline-item,
		.timeline-item--right {
			width: 100%;
			margin-left: 0;
			padding: 0 0 36px 48px;
			text-align: left;
		}

		.timeline-item:not(.timeline-item--right) .timeline-dot,
		.timeline-item--right .timeline-dot {
			left: 20px;
			right: auto;
			transform: translateX(-50%);
		}

		.traits-grid {
			grid-template-columns: 1fr;
		}

		.traits-module {
			padding: 32px 20px;
		}

		.art-mosaic {
			grid-template-columns: 1fr;
			grid-auto-rows: 200px;
		}

		.art-card--0,
		.art-card--2 {
			grid-row: span 1;
		}

		.voice-layout {
			grid-template-columns: 1fr;
		}

		.voice-list {
			flex-direction: row;
			flex-wrap: wrap;
		}

		.voice-chip {
			flex: 1 1 calc(50% - 8px);
			min-width: 120px;
		}

		.memory-grid {
			grid-template-columns: 1fr;
		}

		.explore-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
