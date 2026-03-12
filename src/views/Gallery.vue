<template>
	<section id="gallery" class="py-20 bg-dark text-white pt-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-16">
				<h2 class="font-display font-bold text-[clamp(1.8rem,4vw,2.5rem)] mb-4">精美图集</h2>
				<p class="text-gray-300 max-w-2xl mx-auto">收集Scarlet的舞台照、宣传照和插画作品</p>
				<div class="w-24 h-1 bg-accent mx-auto mt-4"></div>
			</div>

			<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				<div
					v-for="(image, index) in galleryImages"
					:key="index"
					class="gallery-item overflow-hidden rounded-lg cursor-pointer group"
					@click="openLightbox(index)"
				>
					<img
						:src="image.url"
						:alt="image.alt"
						class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
					/>
				</div>
			</div>

			<div class="text-center mt-12">
				<a
					href="#"
					class="inline-block bg-accent hover:bg-accent/90 text-dark font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105"
				>
					浏览更多图片 <i class="fa fa-picture-o ml-2"></i>
				</a>
			</div>
		</div>

		<!-- 图片灯箱 -->
		<div
			class="lightbox fixed inset-0 z-50 flex items-center justify-center bg-black/90"
			:class="{ active: lightboxOpen }"
			v-show="lightboxOpen"
		>
			<div class="relative max-w-4xl max-h-[90vh] w-full px-4">
				<button
					class="absolute top-4 right-4 bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center z-10"
					@click="closeLightbox"
				>
					<i class="fa fa-times"></i>
				</button>
				<img
					:src="currentImage.url"
					:alt="currentImage.alt"
					class="w-full h-auto max-h-[80vh] object-contain rounded-lg"
				/>
				<div
					class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-dark/70 backdrop-blur px-4 py-2 rounded-full"
				>
					<span class="text-white">{{ currentImageIndex + 1 }} / {{ galleryImages.length }}</span>
				</div>
				<button
					class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-dark/70 text-white w-10 h-10 rounded-full flex items-center justify-center"
					@click="prevImage"
				>
					<i class="fa fa-chevron-left"></i>
				</button>
				<button
					class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-dark/70 text-white w-10 h-10 rounded-full flex items-center justify-center"
					@click="nextImage"
				>
					<i class="fa fa-chevron-right"></i>
				</button>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref, onMounted, onUnmounted } from 'vue';

	// 图集数据
	const galleryImages = ref([
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/4135f0ffbe71472681fb9a44647a5583~tplv-a9rns2rl98-image.image?rcl=20250916151050AD9FF2A12A7E0C6445BF&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611450&x-signature=k5ZUxIzY%2BdssTKYKZe0MEI2gKps%3D',
			alt: 'Scarlet舞台照1',
		},
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/0b497bcb584b4a80a3bc75b4e3c3bc53~tplv-a9rns2rl98-image.image?rcl=20250916151150B8671A3A46665383428D&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611511&x-signature=SZOpa644EdkNsACXl4r3IJQ0UhQ%3D',
			alt: 'Scarlet舞台照2',
		},
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/c173e9e174be4d209f36bb9d9ac7e1ac~tplv-a9rns2rl98-image.image?rcl=20250916151129D4DCFEF789BF491AC0ED&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611489&x-signature=5kdfq3ZZ3NrCq2%2Fo7kJ9hCH938M%3D',
			alt: 'Scarlet宣传照1',
		},
		{
			url: 'https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/6a2d803bbbfb40429b8b706486ee7212~tplv-a9rns2rl98-image.image?rcl=20250916151141A6B34C866F2AAE17F7C0&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611501&x-signature=S6sT1hX2R1HmVRd3inxTV8chO9s%3D',
			alt: 'Scarlet宣传照2',
		},
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/2921d4f1e935406ab3af46f495872bc~tplv-a9rns2rl98-image.image?rcl=20250916151210F30C5ED111631B78D518&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611530&x-signature=qNjSa3Ihj4DAtR8%2ByqPl2seKSzI%3D',
			alt: 'Scarlet插画1',
		},
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/3a71ca987c9d4cb7aabffdb444a52e97~tplv-a9rns2rl98-image.image?rcl=202509161513150764E3AF4A2A837C2150&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611596&x-signature=NmfwXic%2FeS770j%2BfZWef5MKw0kE%3D',
			alt: 'Scarlet插画2',
		},
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/f4384931159c46b592da9ee6bf75552b~tplv-a9rns2rl98-image.image?rcl=2025091615133155D1DE6D5DCE2604695C&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611612&x-signature=rJ9YYsdVbP8j%2BzZvMJ7QqErXwvM%3D',
			alt: 'Scarlet日常照1',
		},
		{
			url: 'https://p3-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/351c88d0b0d644be82ca7e4298e9af97~tplv-a9rns2rl98-image.image?rcl=202509161513462CD392BD23D856865612&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758611627&x-signature=mqF%2FT8n9rRj%2F0%2Bg9okJ1vVfFUY8%3D',
			alt: 'Scarlet日常照2',
		},
	]);

	// 灯箱状态
	const lightboxOpen = ref(false);
	const currentImageIndex = ref(0);

	// 打开灯箱
	const openLightbox = (index) => {
		currentImageIndex.value = index;
		lightboxOpen.value = true;
		document.body.style.overflow = 'hidden';
	};

	// 关闭灯箱
	const closeLightbox = () => {
		lightboxOpen.value = false;
		document.body.style.overflow = 'auto';
	};

	// 上一张图片
	const prevImage = () => {
		currentImageIndex.value =
			(currentImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length;
	};

	// 下一张图片
	const nextImage = () => {
		currentImageIndex.value = (currentImageIndex.value + 1) % galleryImages.value.length;
	};

	// 计算属性 - 当前图片
	const currentImage = () => {
		return galleryImages.value[currentImageIndex.value] || { url: '', alt: '' };
	};

	// 键盘事件处理
	const handleKeydown = (e) => {
		if (lightboxOpen.value) {
			if (e.key === 'Escape') {
				closeLightbox();
			} else if (e.key === 'ArrowLeft') {
				prevImage();
			} else if (e.key === 'ArrowRight') {
				nextImage();
			}
		}
	};

	// 生命周期
	onMounted(() => {
		document.addEventListener('keydown', handleKeydown);
	});

	onUnmounted(() => {
		document.removeEventListener('keydown', handleKeydown);
	});
</script>

<style scoped>
	section {
		font-family: 'Inter', sans-serif;
	}

	/* 灯箱样式 */
	.lightbox {
		opacity: 0;
		visibility: hidden;
		transition: all 0.3s ease;
	}

	.lightbox.active,
	.lightbox[v-show='lightboxOpen'] {
		opacity: 1;
		visibility: visible;
	}

	.backdrop-blur {
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	/* 图片悬停效果 */
	.group-hover\:scale-110 {
		transform: scale(1.1);
	}
</style>
