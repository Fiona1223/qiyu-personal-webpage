<template>
	<section id="works" class="py-20 bg-gradient-to-b from-light to-white pt-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-16">
				<h2 class="font-display font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-dark mb-4">
					Scarlet 作品
				</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					欣赏Scarlet的精彩音乐作品和MV，感受她的音乐魅力
				</p>
				<div class="w-24 h-1 bg-primary mx-auto mt-4"></div>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<!-- 作品卡片 -->
				<div
					v-for="(work, index) in works"
					:key="index"
					class="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
				>
					<div class="relative">
						<img :src="work.image" :alt="work.title + ' MV封面'" class="w-full h-56 object-cover" />
						<div
							class="absolute inset-0 bg-dark/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
						>
							<button
								class="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform"
								@click="playWork(work.id)"
							>
								<i class="fa fa-play text-xl"></i>
							</button>
						</div>
						<div
							v-if="work.isHot"
							class="absolute top-4 right-4 bg-accent text-dark px-3 py-1 rounded-full text-sm font-bold"
						>
							热门
						</div>
					</div>
					<div class="p-6">
						<h3 class="font-display font-bold text-xl mb-2">{{ work.title }}</h3>
						<p class="text-gray-600 mb-4">{{ work.description }}</p>
						<div class="flex justify-between items-center">
							<span class="text-gray-500 text-sm"
								><i class="fa fa-calendar mr-1"></i> {{ work.date }}</span
							>
							<div class="flex items-center">
								<i class="fa fa-eye text-primary mr-1"></i>
								<span>{{ work.views }}</span>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="text-center mt-12">
				<a
					href="#"
					class="inline-block bg-dark hover:bg-dark/90 text-white font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105"
				>
					查看更多作品 <i class="fa fa-arrow-right ml-2"></i>
				</a>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref } from 'vue';

	// 作品数据
	const works = ref([
		{
			id: 'work1',
			title: '心跳节拍',
			description: 'Scarlet的出道单曲，以轻快的节奏和充满活力的表演赢得了大量粉丝的喜爱。',
			date: '2023-03-14',
			views: '1,245,321',
			image:
				'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/22725cc896da451caf09dac4e8693d31~tplv-a9rns2rl98-image.image?rcl=20250916150951149E4533A57FEDF78F90&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611392&x-signature=4OWlkoXXgI9g87Wv4VbpW0g3KOQ%3D',
			isHot: true,
		},
		{
			id: 'work2',
			title: '彩虹旋律',
			description: '一首充满希望和梦想的歌曲，展现了Scarlet温柔而坚定的一面。',
			date: '2023-06-18',
			views: '987,654',
			image:
				'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/aeca6d4b15784666a327d6f606f5934a~tplv-a9rns2rl98-image.image?rcl=2025091615040609D5FCD0BFAC8B42387A&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611048&x-signature=xWJZUNWJtXY0j0DJ%2BZ%2BnUTj14pI%3D',
			isHot: false,
		},
		{
			id: 'work3',
			title: '星之碎片',
			description: '一首抒情歌曲，Scarlet用她清澈的嗓音唱出了对粉丝的感谢之情。',
			date: '2023-09-22',
			views: '765,432',
			image:
				'https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/0c6849f02b274e8d8ad55bbf7405ba39~tplv-a9rns2rl98-image.image?rcl=2025091615102874561463F086FD9EDEBF&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611428&x-signature=wAIuHih4gZZfq6tzzWRVeZkPseI%3D',
			isHot: false,
		},
	]);

	// 播放作品
	const playWork = (workId) => {
		const work = works.value.find((w) => w.id === workId);
		if (work) {
			alert(`正在播放 ${work.title} MV`);
		}
	};
</script>

<style scoped>
	section {
		font-family: 'Inter', sans-serif;
	}

	.hover\:shadow-xl:hover {
		box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	}
</style>
