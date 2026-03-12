<template>
	<div id="app" class="min-h-screen flex flex-col">
		<!-- 导航栏 -->
		<nav class="fixed top-0 left-0 right-0 z-50 bg-dark/90 text-white backdrop-blur">
			<div class="container mx-auto px-4 py-3 flex justify-between items-center">
				<div class="flex items-center">
					<i class="fa fa-heart text-accent mr-2"></i>
					<span class="font-bold text-lg">祁煜，是宇宙写给我的情诗</span>
				</div>
				<div class="hidden md:flex space-x-6">
					<router-link to="/" class="hover:text-accent transition-colors">首页</router-link>
					<router-link to="/about" class="hover:text-accent transition-colors"
						>关于他</router-link
					>
					<router-link to="/artBook" class="hover:text-accent transition-colors">艺术画集</router-link>
					<router-link to="/works" class="hover:text-accent transition-colors">深海誓约</router-link>
					<router-link to="/gallery" class="hover:text-accent transition-colors">利莫里亚</router-link>
					<router-link to="/quiz" class="hover:text-accent transition-colors">同人馆</router-link>
					<router-link to="/fanwall" class="hover:text-accent transition-colors"
						>应援墙</router-link
					>
				</div>
				<button class="md:hidden text-white">
					<i class="fa fa-bars"></i>
				</button>
			</div>
		</nav>

		<!-- 主内容区 -->
		<main class="flex-grow pt-15">
			<router-view />
		</main>

		<!-- 页脚 -->
		<footer class="bg-dark text-white py-6">
			<div class="container mx-auto px-4 text-center">
				<p>© 2026 祁煜网站，所有权保留</p>
				<div class="mt-2 flex justify-center space-x-4">
					<a href="#" class="text-gray-400 hover:text-accent transition-colors">
						<i class="fa fa-weibo"></i>
					</a>
					<a href="#" class="text-gray-400 hover:text-accent transition-colors">
						<i class="fa fa-wechat"></i>
					</a>
					<a href="#" class="text-gray-400 hover:text-accent transition-colors">
						<i class="fa fa-instagram"></i>
					</a>
				</div>
			</div>
		</footer>
	</div>
</template>

<style scoped>
	#app {
		font-family: 'Inter', sans-serif;
	}

	.router-link-active {
		color: var(--accent) !important;
	}
</style>
