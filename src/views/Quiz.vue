<template>
	<section id="quiz" class="py-20 bg-gradient-to-br from-secondary/10 to-primary/10 pt-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-16">
				<h2 class="font-display font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-dark mb-4">
					Scarlet 趣味测试
				</h2>
				<p class="text-gray-600 max-w-2xl mx-auto">
					测试你对Scarlet的了解程度，看看你是不是忠实粉丝！
				</p>
				<div class="w-24 h-1 bg-primary mx-auto mt-4"></div>
			</div>

			<div class="bg-white rounded-2xl shadow-xl overflow-hidden">
				<div class="p-6 md:p-10">
					<div class="flex flex-col md:flex-row gap-10">
						<div class="md:w-1/3">
							<h3 class="font-display font-bold text-2xl mb-4 text-primary">Scarlet粉丝测试</h3>
							<p class="text-gray-600 mb-6">
								回答关于Scarlet的问题，测试你对她的了解程度。完成后可以获得专属粉丝称号哦！
							</p>

							<div class="bg-light p-5 rounded-lg mb-6">
								<div class="flex justify-between items-center mb-3">
									<span class="font-bold">测试进度</span>
									<span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
										>{{ currentQuestion + 1 }}/{{ questions.length }}</span
									>
								</div>
								<div class="w-full bg-gray-200 rounded-full h-2.5 mb-3">
									<div
										class="bg-primary h-2.5 rounded-full"
										:style="{ width: ((currentQuestion + 1) / questions.length) * 100 + '%' }"
									></div>
								</div>
								<div class="flex justify-between items-center mb-3">
									<span class="font-bold">当前得分</span>
									<span class="bg-accent/10 text-dark px-3 py-1 rounded-full text-sm">{{
										score
									}}</span>
								</div>
								<div class="flex justify-between items-center">
									<span class="font-bold">剩余时间</span>
									<span
										class="bg-dark/10 text-dark px-3 py-1 rounded-full text-sm"
										:class="{ 'text-red-500': timeLeft < 10 }"
										>{{ formattedTime }}</span
									>
								</div>
							</div>

							<div class="bg-light p-5 rounded-lg mb-6">
								<h4 class="font-bold mb-3">测试说明</h4>
								<ul class="text-gray-600 list-disc pl-5 space-y-1 text-sm">
									<li>共5道关于Scarlet的问题</li>
									<li>每道题有30秒答题时间</li>
									<li>选择正确答案可获得20分</li>
									<li>完成后将根据得分获得粉丝称号</li>
								</ul>
							</div>

							<button
								class="w-full bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105 mb-4"
								@click="startQuiz"
								:disabled="quizStarted"
							>
								开始测试
							</button>

							<button
								class="w-full bg-dark/10 hover:bg-dark/20 text-dark font-semibold px-6 py-3 rounded-lg transition-all"
								@click="resetQuiz"
								:disabled="!quizCompleted"
							>
								重新测试
							</button>
						</div>

						<div class="md:w-2/3">
							<!-- 测试区域 -->
							<div
								class="relative bg-dark/5 rounded-xl overflow-hidden min-h-[400px] border-2 border-dark/10 p-6"
							>
								<!-- 测试开始提示 -->
								<div
									class="absolute inset-0 flex flex-col items-center justify-center z-20 bg-dark/70 text-white"
									v-show="!quizStarted && !quizCompleted"
								>
									<i class="fa fa-question-circle text-6xl mb-4 text-accent"></i>
									<h3 class="text-2xl font-bold mb-2">Scarlet粉丝测试</h3>
									<p class="mb-6 text-center px-4">
										准备好测试你对Scarlet的了解了吗？点击开始按钮开始挑战！
									</p>
								</div>

								<!-- 问题容器 -->
								<div class="h-full flex flex-col" v-show="quizStarted && !quizCompleted">
									<div class="mb-8">
										<h3 class="text-xl font-bold mb-2">{{ currentQuestionData.text }}</h3>
										<p class="text-gray-500 text-sm">{{ currentQuestionData.hint }}</p>
									</div>

									<div class="grid grid-cols-1 gap-3 flex-grow">
										<button
											v-for="(answer, index) in currentQuestionData.answers"
											:key="index"
											class="answer-btn border-2 rounded-lg p-4 text-left hover:bg-gray-50 transition-colors"
											:class="{
												'answer-correct': showResults && answer.isCorrect,
												'answer-incorrect':
													showResults && selectedAnswer === index && !answer.isCorrect,
												'border-gray-300': !showResults,
												'border-green-500': showResults && answer.isCorrect,
												'border-red-500':
													showResults && selectedAnswer === index && !answer.isCorrect,
											}"
											:disabled="showResults"
											@click="selectAnswer(index)"
										>
											<span class="font-bold mr-2">{{ String.fromCharCode(65 + index) }}.</span
											>{{ answer.text }}
										</button>
									</div>

									<div class="mt-6">
										<button
											class="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-lg transition-all float-right"
											v-show="showResults && !isLastQuestion"
											@click="nextQuestion"
										>
											下一题 <i class="fa fa-arrow-right ml-1"></i>
										</button>
									</div>
								</div>

								<!-- 测试结果 -->
								<div
									class="h-full flex flex-col items-center justify-center text-center p-6"
									v-show="quizCompleted"
								>
									<div class="text-6xl mb-4" :class="resultIcon"></div>
									<h3 class="text-2xl font-bold mb-2">{{ resultTitle }}</h3>
									<p class="mb-6 max-w-md">{{ resultDescription }}</p>
									<div class="mb-6 p-4 bg-light rounded-lg">
										<p class="text-lg">
											<span class="font-bold">最终得分:</span>
											<span class="text-primary text-2xl">{{ score }}</span
											>/100
										</p>
										<p class="text-accent font-bold mt-2">{{ fanTitle }}</p>
									</div>
									<button
										class="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
										@click="resetQuiz"
									>
										再玩一次
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<script setup>
	import { ref, computed, onUnmounted } from 'vue';

	// 测试数据
	const questions = ref([
		{
			text: 'Scarlet的出道日期是哪一天？',
			hint: '这是一个特别的日子，象征着爱与浪漫',
			answers: [
				{ text: '2023年2月14日', isCorrect: false },
				{ text: '2023年3月14日', isCorrect: true },
				{ text: '2023年6月18日', isCorrect: false },
			],
		},
		{
			text: 'Scarlet的代表作品不包括以下哪首歌曲？',
			hint: '回忆一下Scarlet的音乐作品列表',
			answers: [
				{ text: '心跳节拍', isCorrect: false },
				{ text: '彩虹旋律', isCorrect: false },
				{ text: '星光闪耀', isCorrect: true },
			],
		},
		{
			text: 'Scarlet的粉丝名称是什么？',
			hint: '这个名称与Scarlet的名字有直接关联',
			answers: [
				{ text: 'Scarlets', isCorrect: true },
				{ text: 'RedStars', isCorrect: false },
				{ text: 'Scarlettes', isCorrect: false },
			],
		},
		{
			text: 'Scarlet的生日是哪一天？',
			hint: '在炎热的夏季',
			answers: [
				{ text: '5月20日', isCorrect: false },
				{ text: '6月18日', isCorrect: true },
				{ text: '7月7日', isCorrect: false },
			],
		},
		{
			text: 'Scarlet的哪首歌曲连续3个月蝉联动漫音乐榜冠军？',
			hint: '这是她的出道单曲',
			answers: [
				{ text: '心跳节拍', isCorrect: true },
				{ text: '彩虹旋律', isCorrect: false },
				{ text: '星之碎片', isCorrect: false },
			],
		},
	]);

	// 测试状态
	const quizStarted = ref(false);
	const quizCompleted = ref(false);
	const currentQuestion = ref(0);
	const score = ref(0);
	const timeLeft = ref(30);
	const timer = ref(null);
	const selectedAnswer = ref(null);
	const showResults = ref(false);

	// 计算属性
	const currentQuestionData = computed(() => {
		return questions.value[currentQuestion.value] || {};
	});

	const isLastQuestion = computed(() => {
		return currentQuestion.value === questions.value.length - 1;
	});

	const formattedTime = computed(() => {
		const minutes = Math.floor(timeLeft.value / 60);
		const seconds = timeLeft.value % 60;
		return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	});

	const resultIcon = computed(() => {
		if (score.value === 100) {
			return 'fa fa-trophy text-accent';
		} else if (score.value >= 80) {
			return 'fa fa-star text-primary';
		} else if (score.value >= 60) {
			return 'fa fa-heart text-secondary';
		} else {
			return 'fa fa-smile-o text-gray-500';
		}
	});

	const resultTitle = computed(() => {
		if (score.value === 100) {
			return '超级粉丝';
		} else if (score.value >= 80) {
			return '忠实粉丝';
		} else if (score.value >= 60) {
			return '热情粉丝';
		} else {
			return '新朋友';
		}
	});

	const resultDescription = computed(() => {
		if (score.value === 100) {
			return '太棒了！你对Scarlet的了解简直了如指掌，真是超级粉丝！';
		} else if (score.value >= 80) {
			return '非常好！你是Scarlet的忠实粉丝，对她有很深入的了解。';
		} else if (score.value >= 60) {
			return '不错！你对Scarlet有一定的了解，继续加油！';
		} else {
			return '加油！你刚刚开始了解Scarlet，还有很多有趣的事情等着你去发现。';
		}
	});

	const fanTitle = computed(() => {
		if (score.value === 100) {
			return 'Scarlet的守护天使';
		} else if (score.value >= 80) {
			return 'Scarlet的铁杆粉丝';
		} else if (score.value >= 60) {
			return 'Scarlet的热情支持者';
		} else {
			return 'Scarlet的新朋友';
		}
	});

	// 方法
	const startQuiz = () => {
		quizStarted.value = true;
		quizCompleted.value = false;
		currentQuestion.value = 0;
		score.value = 0;
		timeLeft.value = 30;
		selectedAnswer.value = null;
		showResults.value = false;

		startTimer();
	};

	const resetQuiz = () => {
		quizStarted.value = false;
		quizCompleted.value = false;
		currentQuestion.value = 0;
		score.value = 0;
		timeLeft.value = 30;
		selectedAnswer.value = null;
		showResults.value = false;

		stopTimer();
	};

	const startTimer = () => {
		timeLeft.value = 30;

		timer.value = setInterval(() => {
			timeLeft.value--;

			if (timeLeft.value <= 0) {
				stopTimer();

				if (!showResults.value) {
					showResults.value = true;

					// 如果是最后一题，延迟显示结果
					if (isLastQuestion.value) {
						setTimeout(() => {
							showResultsScreen();
						}, 2000);
					}
				}
			}
		}, 1000);
	};

	const stopTimer = () => {
		if (timer.value) {
			clearInterval(timer.value);
			timer.value = null;
		}
	};

	const selectAnswer = (index) => {
		if (showResults.value) return;

		selectedAnswer.value = index;
		showResults.value = true;

		const isCorrect = currentQuestionData.value.answers[index].isCorrect;

		if (isCorrect) {
			score.value += 20;
		}

		stopTimer();

		// 如果是最后一题，延迟显示结果
		if (isLastQuestion.value) {
			setTimeout(() => {
				showResultsScreen();
			}, 2000);
		}
	};

	const nextQuestion = () => {
		if (currentQuestion.value < questions.value.length - 1) {
			currentQuestion.value++;
			selectedAnswer.value = null;
			showResults.value = false;
			timeLeft.value = 30;

			startTimer();
		}
	};

	const showResultsScreen = () => {
		quizCompleted.value = true;
		quizStarted.value = false;
	};

	// 清理计时器
	onUnmounted(() => {
		if (timer.value) {
			clearInterval(timer.value);
		}
	});
</script>

<style scoped>
	section {
		font-family: 'Inter', sans-serif;
	}

	/* 答案按钮样式 */
	.answer-btn {
		cursor: pointer;
	}

	.answer-correct {
		background-color: rgba(72, 187, 120, 0.1);
	}

	.answer-incorrect {
		background-color: rgba(220, 38, 38, 0.1);
	}

	.text-red-500 {
		color: #ef4444;
	}

	.border-green-500 {
		border-color: #22c55e;
	}

	.border-red-500 {
		border-color: #ef4444;
	}

	/* 浮动按钮 */
	.float-right {
		float: right;
	}
</style>
