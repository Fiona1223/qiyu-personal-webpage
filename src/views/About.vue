<template>
	<section id="about" class="py-20 bg-white pt-24">
		<div class="container mx-auto px-4">
			<div class="text-center mb-16">
				<h2 class="font-display font-bold text-[clamp(1.8rem,4vw,2.5rem)] text-dark mb-4">
					关于 Scarlet
				</h2>
				<div class="w-24 h-1 bg-primary mx-auto"></div>
			</div>

			<div class="flex flex-col lg:flex-row items-center gap-12">
				<div class="lg:w-1/2">
					<div class="relative">
						<img
							src="https://p9-flow-imagex-sign.byteimg.com/tos-cn-i-a9rns2rl98/rc/pc/code_assistant/c60eacc5c30a4ff6ad560582fc0192da~tplv-a9rns2rl98-image.image?rcl=2025091614582553E6A7588095000289F2&rk3s=8e244e95&rrcfp=e75484ac&x-expires=1758610705&x-signature=%2Bf%2FALvylYcb5gApti5jB5f4W4X4%3D"
							alt="Scarlet的舞台照"
							class="w-full h-auto rounded-xl shadow-xl"
						/>
						<div class="absolute -top-4 -left-4 bg-accent text-dark p-4 rounded-lg shadow-lg">
							<p class="font-bold">出道日期</p>
							<p>2023年3月14日</p>
						</div>
					</div>
				</div>

				<div class="lg:w-1/2">
					<h3 class="font-display font-bold text-2xl mb-4 text-primary">Scarlet 档案</h3>
					<p class="text-gray-700 mb-6 leading-relaxed">
						Scarlet是一位充满活力的二次元偶像，以其独特的红发造型和甜美又不失个性的嗓音深受粉丝喜爱。她擅长流行舞曲和抒情歌曲，舞台表现力极强，每次演出都能点燃全场气氛。
					</p>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<div class="bg-light p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<h4 class="font-bold text-dark mb-2 flex items-center">
								<i class="fa fa-music text-primary mr-2"></i> 代表作品
							</h4>
							<p class="text-gray-600">《心跳节拍》、《彩虹旋律》、《星之碎片》</p>
						</div>
						<div class="bg-light p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<h4 class="font-bold text-dark mb-2 flex items-center">
								<i class="fa fa-trophy text-primary mr-2"></i> 成就
							</h4>
							<p class="text-gray-600">连续3个月蝉联动漫音乐榜冠军</p>
						</div>
						<div class="bg-light p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<h4 class="font-bold text-dark mb-2 flex items-center">
								<i class="fa fa-heart text-primary mr-2"></i> 粉丝名
							</h4>
							<p class="text-gray-600">Scarlets (斯卡莱特们)</p>
						</div>
						<div class="bg-light p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
							<h4 class="font-bold text-dark mb-2 flex items-center">
								<i class="fa fa-calendar text-primary mr-2"></i> 生日
							</h4>
							<p class="text-gray-600">6月18日</p>
						</div>
					</div>

					<div class="flex space-x-4">
						<a
							href="#"
							class="bg-primary hover:bg-primary/90 text-white p-3 rounded-full transition-all transform hover:scale-110"
						>
							<i class="fa fa-twitter"></i>
						</a>
						<a
							href="#"
							class="bg-[#FF0000] hover:bg-[#CC0000] text-white p-3 rounded-full transition-all transform hover:scale-110"
						>
							<i class="fa fa-youtube-play"></i>
						</a>
						<a
							href="#"
							class="bg-[#E1306C] hover:bg-[#C13584] text-white p-3 rounded-full transition-all transform hover:scale-110"
						>
							<i class="fa fa-instagram"></i>
						</a>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
	section {
		font-family: 'Inter', sans-serif;
	}

	.hover\:shadow-lg:hover {
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>
