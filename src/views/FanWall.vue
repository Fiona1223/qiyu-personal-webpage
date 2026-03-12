<template>
	<section id="fanwall" class="py-20 bg-white pt-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-16">
				<h2 class="font-display font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-dark mb-4">
					粉丝应援墙
				</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					留下你对Scarlet的祝福和支持，与其他粉丝一起分享这份热爱
				</p>
				<div class="w-24 h-1 bg-primary mx-auto mt-4"></div>
			</div>

			<div class="max-w-3xl mx-auto mb-12">
				<form class="bg-light p-6 rounded-xl shadow-md" @submit.prevent="submitMessage">
					<div class="mb-4">
						<label for="fan-name" class="block text-gray-700 font-medium mb-2">你的昵称</label>
						<input
							type="text"
							id="fan-name"
							v-model="newMessage.name"
							class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							placeholder="请输入你的昵称"
							required
						/>
					</div>
					<div class="mb-4">
						<label for="fan-message" class="block text-gray-700 font-medium mb-2"
							>想对Scarlet说的话</label
						>
						<textarea
							id="fan-message"
							v-model="newMessage.content"
							rows="4"
							class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
							placeholder="写下你对Scarlet的祝福和支持..."
							required
						></textarea>
					</div>
					<div class="flex items-center mb-4">
						<input type="checkbox" id="show-name" v-model="newMessage.showName" class="mr-2" />
						<label for="show-name" class="text-gray-700">公开展示我的昵称</label>
					</div>
					<button
						type="submit"
						class="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105"
						:disabled="submitting"
					>
						{{ submitting ? '提交中...' : '提交应援' }}
					</button>
				</form>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				<div
					v-for="message in messages"
					:key="message.id"
					class="bg-light rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
				>
					<div class="flex items-center justify-between mb-3">
						<h4 class="font-bold text-primary">
							{{ message.showName ? message.name : '匿名粉丝' }}
						</h4>
						<span class="text-gray-500 text-sm">{{ formatDate(message.date) }}</span>
					</div>
					<p class="text-gray-700 mb-4">{{ message.content }}</p>
					<div class="flex items-center justify-between">
						<div class="flex items-center">
							<button
								class="flex items-center text-gray-500 hover:text-primary transition-colors"
								@click="likeMessage(message.id)"
							>
								<i class="fa fa-heart mr-1" :class="{ 'text-primary': message.liked }"></i>
								<span>{{ message.likes }}</span>
							</button>
						</div>
						<div class="flex space-x-2">
							<span class="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
								#Scarlet应援
							</span>
						</div>
					</div>
				</div>
			</div>

			<div class="text-center mt-12">
				<button
					class="inline-block bg-dark/10 hover:bg-dark/20 text-dark font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105"
					@click="loadMoreMessages"
					:disabled="loadingMore"
				>
					{{ loadingMore ? '加载中...' : '加载更多' }}
				</button>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref } from 'vue';

	// 应援墙数据
	const messages = ref([
		{
			id: 1,
			name: '星光守护者',
			content:
				'Scarlet的歌声总是能给我带来力量，每次听到《心跳节拍》都忍不住跟着舞动起来！期待你更多的作品，永远支持你！',
			date: new Date(2026, 2, 1),
			likes: 24,
			liked: false,
			showName: true,
		},
		{
			id: 2,
			name: '小红豆',
			content:
				'从出道开始就关注Scarlet了，看着你一步步成长真的很开心！6月18日的生日会我一定会参加的，提前说声生日快乐！',
			date: new Date(2026, 2, 3),
			likes: 18,
			liked: false,
			showName: true,
		},
		{
			id: 3,
			name: '匿名粉丝',
			content:
				'《星之碎片》这首歌真的太好听了，每次听都会感动到哭。Scarlet的嗓音真的是上天赐予的礼物，谢谢你带给我们这么美妙的音乐。',
			date: new Date(2026, 2, 5),
			likes: 32,
			liked: false,
			showName: false,
		},
	]);

	// 新消息
	const newMessage = ref({
		name: '',
		content: '',
		showName: true,
	});

	// 加载状态
	const submitting = ref(false);
	const loadingMore = ref(false);

	// 方法
	const submitMessage = () => {
		if (!newMessage.value.name.trim() || !newMessage.value.content.trim()) return;

		submitting.value = true;

		// 模拟API请求
		setTimeout(() => {
			const message = {
				id: Date.now(),
				name: newMessage.value.name.trim(),
				content: newMessage.value.content.trim(),
				date: new Date(),
				likes: 0,
				liked: false,
				showName: newMessage.value.showName,
			};

			messages.value.unshift(message);

			// 重置表单
			newMessage.value = {
				name: '',
				content: '',
				showName: true,
			};

			submitting.value = false;

			// 显示成功提示
			alert('应援提交成功！');
		}, 1000);
	};

	const likeMessage = (id) => {
		const message = messages.value.find((msg) => msg.id === id);
		if (message) {
			if (message.liked) {
				message.likes--;
			} else {
				message.likes++;
			}
			message.liked = !message.liked;
		}
	};

	const loadMoreMessages = () => {
		if (loadingMore.value) return;

		loadingMore.value = true;

		// 模拟加载更多数据
		setTimeout(() => {
			const moreMessages = [
				{
					id: Date.now() + 1,
					name: '音乐梦想家',
					content:
						'Scarlet的舞台表现力真的太强了，每次看你的表演都能感受到满满的能量！希望有机会能亲眼见到你本人！',
					date: new Date(2026, 1, 28),
					likes: 15,
					liked: false,
					showName: true,
				},
				{
					id: Date.now() + 2,
					name: '匿名粉丝',
					content:
						'作为一个不善言辞的人，你的音乐总能表达出我内心的感受。谢谢你，Scarlet，你是最棒的！',
					date: new Date(2026, 1, 25),
					likes: 22,
					liked: false,
					showName: false,
				},
			];

			messages.value.push(...moreMessages);

			loadingMore.value = false;
		}, 1500);
	};

	const formatDate = (date) => {
		const d = new Date(date);
		return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
			d.getDate()
		).padStart(2, '0')}`;
	};
</script>

<style scoped>
	section {
		font-family: 'Inter', sans-serif;
	}

	/* 卡片悬停效果 */
	.hover\:shadow-lg:hover {
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}

	.hover\:-translate-y-1:hover {
		transform: translateY(-4px);
	}

	/* 点赞按钮样式 */
	.text-primary {
		color: var(--primary);
	}

	/* 输入框焦点样式 */
	.focus\:ring-primary:focus {
		ring-color: var(--primary);
	}
</style>
