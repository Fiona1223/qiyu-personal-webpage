<template>
	<nav
		id="navbar"
		class="fixed w-full z-50 transition-all duration-300"
		:class="{
			'bg-dark/95 backdrop-blur shadow-lg py-2': scrolled,
			'bg-transparent py-3': !scrolled,
		}"
	>
		<div class="container mx-auto px-4 flex items-center justify-between">
			<router-link to="/" class="flex items-center space-x-2">
				<span class="text-primary text-2xl"><i class="fa fa-heart"></i></span>
				<span class="font-display font-bold text-xl text-white text-shadow"
					>祁煜，是宇宙写给我的情诗</span
				>
			</router-link>

			<!-- 桌面导航 -->
			<div class="hidden md:flex items-center space-x-8">
				<router-link to="/about" class="text-white hover:text-accent transition-colors font-medium"
					>关于偶像</router-link
				>
				<router-link to="/works" class="text-white hover:text-accent transition-colors font-medium"
					>作品</router-link
				>
				<router-link
					to="/gallery"
					class="text-white hover:text-accent transition-colors font-medium"
					>图集</router-link
				>
				<router-link to="/quiz" class="text-white hover:text-accent transition-colors font-medium"
					>趣味测试</router-link
				>
				<router-link
					to="/fanwall"
					class="text-white hover:text-accent transition-colors font-medium"
					>应援墙</router-link
				>
			</div>

			<!-- 移动端菜单按钮 -->
			<button class="md:hidden text-white text-2xl" @click="toggleMobileMenu">
				<i :class="mobileMenuOpen ? 'fa fa-times' : 'fa fa-bars'"></i>
			</button>
		</div>

		<!-- 移动端菜单 -->
		<div class="md:hidden bg-dark/95 backdrop-blur" v-show="mobileMenuOpen">
			<div class="container mx-auto px-4 py-4 flex flex-col space-y-4">
				<router-link
					to="/about"
					class="text-white hover:text-accent transition-colors py-2 border-b border-gray-700"
					@click="closeMobileMenu"
					>关于偶像</router-link
				>
				<router-link
					to="/works"
					class="text-white hover:text-accent transition-colors py-2 border-b border-gray-700"
					@click="closeMobileMenu"
					>作品</router-link
				>
				<router-link
					to="/gallery"
					class="text-white hover:text-accent transition-colors py-2 border-b border-gray-700"
					@click="closeMobileMenu"
					>图集</router-link
				>
				<router-link
					to="/quiz"
					class="text-white hover:text-accent transition-colors py-2 border-b border-gray-700"
					@click="closeMobileMenu"
					>趣味测试</router-link
				>
				<router-link
					to="/fanwall"
					class="text-white hover:text-accent transition-colors py-2"
					@click="closeMobileMenu"
					>应援墙</router-link
				>
			</div>
		</div>
	</nav>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';

	// 响应式状态
	const scrolled = ref(false);
	const mobileMenuOpen = ref(false);

	// 滚动事件处理
	const handleScroll = () => {
		scrolled.value = window.scrollY > 50;
	};

	// 切换移动端菜单
	const toggleMobileMenu = () => {
		mobileMenuOpen.value = !mobileMenuOpen.value;
	};

	// 关闭移动端菜单
	const closeMobileMenu = () => {
		mobileMenuOpen.value = false;
	};

	// 生命周期
	onMounted(() => {
		window.addEventListener('scroll', handleScroll);
	});

	onUnmounted(() => {
		window.removeEventListener('scroll', handleScroll);
	});
</script>

<style scoped>
	/* 导航栏样式优化 */
	#navbar {
		font-family: 'Inter', sans-serif;
	}

	.text-shadow {
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.backdrop-blur {
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}

	/* 移动端菜单动画 */
	.v-enter-active,
	.v-leave-active {
		transition: opacity 0.3s ease, height 0.3s ease;
	}

	.v-enter-from,
	.v-leave-to {
		opacity: 0;
		height: 0;
	}
</style>
