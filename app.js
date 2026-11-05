/* ============================================================
 * 动物人格测试 - 核心逻辑
 * 基于：大五人格模型 (FFM) + 动物行为学研究
 * 改动：选项打乱 + 微信友好分享 + 修正模糊选项文案
 * ============================================================ */

/* ---------- 12 道题目数据（搞笑版） ---------- */
const QUESTIONS = [
  {
    q: "你妈带你去一个陌生饭局，说都是亲戚。推开门那一瞬间，你最像哪个？",
    opts: [
      { letter: "A", text: "嘴炮模式瞬间激活：「哎哥！哎姐！你们好！我小时候见过你们！」其实根本记不住谁是谁。", dim: "S" },
      { letter: "B", text: "先观察 30 秒：消防通道在哪？有没有人表情不对？菜里会不会有我过敏的东西？确认安全才敢坐下。", dim: "E" },
      { letter: "C", text: "哇这菜我没见过！这装修挺有意思！角落那只猫是谁家的？完全忘了自己还没打招呼。", dim: "O" },
      { letter: "D", text: "看见有个长辈一个人坐角落玩手机。默默端杯茶过去：「叔/姨，喝茶。」好像TA有点尴尬。", dim: "C" }
    ]
  },
  {
    q: "难得了一天假，没人约没通知没破事。你打算怎么造？",
    opts: [
      { letter: "A", text: "群发一条：「今天没人管我！谁出来浪？」五分钟没回消息就开始 emo：大家都不爱我了。", dim: "S" },
      { letter: "B", text: "列一张精确到分钟的时间表：几点起几点吃几点拉屎几点睡，生活节奏像精密仪器。", dim: "E" },
      { letter: "C", text: "打开地图选一个从没去过的方向，穿上鞋就走。反正迷路了高德会救我。", dim: "O" },
      { letter: "D", text: "把上周欠朋友的一顿饭补了，帮邻居把快递搬上楼，顺便给小区流浪猫带点猫粮。", dim: "C" }
    ]
  },
  {
    q: "你正在摸鱼，老板突然喊：「之前方案全废了，明天下午交新的！」你的第一反应是？",
    opts: [
      { letter: "A", text: "立刻拉小群：「家人们听到了吗？全部重来！大家有什么想法快说！」一个人脑爆太累了。", dim: "S" },
      { letter: "B", text: "心往下一沉：之前熬的三个通宵全白费？时间来得及吗？会不会又要被骂？脑子像卡了循环播放坏消息。", dim: "E" },
      { letter: "C", text: "哎？全新的任务？那我之前想的那个骚操作方案可以试了！眼睛亮起来，摸鱼模式立刻切换工作狂。", dim: "O" },
      { letter: "D", text: "先问组里每个人手上有啥资源能共享，尽量别让任何人像我一样白熬三个通宵。", dim: "C" }
    ]
  },
  {
    q: "吃饭时间到。你饿了。你会怎么选？",
    opts: [
      { letter: "A", text: "先喊个人陪我。一个人吃饭像一个人看电影——不是不行，但总感觉哪里怪怪的。", dim: "S" },
      { letter: "B", text: "选我吃了十年的那家。新网红店可能踩雷、可能吃拉肚子、可能排队一小时，稳一点总没错。", dim: "E" },
      { letter: "C", text: "新开张的招牌菜！管他是网红店还是苍蝇馆，陌生的味道本身就是生活的小确幸啊喂！", dim: "O" },
      { letter: "D", text: "翻朋友圈看谁最近夸过哪家好吃，或者跟着小区楼下那群叔叔阿姨常去的馆子走——群众的眼睛是雪亮的。", dim: "C" }
    ]
  },
  {
    q: "小区花园里有只看起来很狼狈的流浪猫。你会？",
    opts: [
      { letter: "A", text: "拍一张发业主群：「有人认识这只吗？要不要凑钱送医院？」一只猫的事，必须大家一起扛。", dim: "S" },
      { letter: "B", text: "不敢直接碰。万一有狂犬病呢？万一它抓我呢？先百度「被流浪猫抓了怎么办」，然后再蹲远了观察。", dim: "E" },
      { letter: "C", text: "蹲下来看：这是什么品种？眼睛怎么了？之前在这见过没？它以前有主人吗？脑子里已经演完一部猫生纪录片。", dim: "O" },
      { letter: "D", text: "先回家拿了水和猫粮，然后联系救助机构。我出钱也行，总不能看着它等死吧。", dim: "C" }
    ]
  },
  {
    q: "办公室/教室来了个新人，看起来有点社恐不敢说话。你会怎么对待TA？",
    opts: [
      { letter: "A", text: "第一个冲过去：「嗨！我是XX！要不要一起吃午饭？我带你去食堂/外面那家超好吃的店！」社交牛逼症爆发。", dim: "S" },
      { letter: "B", text: "纠结了十分钟：我该不该打招呼？会不会TA就是想安静？会不会我热情过头显得奇怪？算了还是假装没看见吧。", dim: "E" },
      { letter: "C", text: "好奇TA：之前在哪上班/上学？为什么来这儿？家里几口人？哦不对最后一个太隐私了……从聊天里挖八卦才是正事。", dim: "O" },
      { letter: "D", text: "悄悄告诉TA：打印机在那边，请假要找那个戴眼镜的，中午可以去那家面馆，有不懂的随时找我——别让TA像个透明人。", dim: "C" }
    ]
  },
  {
    q: "你有一周假期，决定一个人出去浪。你会怎么规划？",
    opts: [
      { letter: "A", text: "先搜搜有没有朋友恰好在那个城市，约着吃顿火锅；或者到了当地看看能不能拼个团交个新朋友。一人游，没意思。", dim: "S" },
      { letter: "B", text: "做一份写满三页纸的攻略：每天住哪、几点起、地铁几号线、景点排队时间、当地医院地址、紧急联系人电话。踏实。", dim: "E" },
      { letter: "C", text: "不做。攻。略。到了机场再查天气，到了街上再看心情。哪个方向顺眼就往哪走，迷路了就是惊喜。", dim: "O" },
      { letter: "D", text: "查当地有没有公益机构能顺道帮忙，或者去看望一个很久没见的老朋友；回来给同事全带伴手礼，一个都不能落。", dim: "C" }
    ]
  },
  {
    q: "有件事让你焦虑得睡不着。你会怎么跟它相处？",
    opts: [
      { letter: "A", text: "约朋友出来吃火锅吐槽，从头到尾讲八遍——说到第八遍的时候，朋友已经能替你说完了，但你心里还是舒服多了。", dim: "S" },
      { letter: "B", text: "躺在床上反复想：会不会搞砸？后果是什么？最坏的情况是什么？有没有别的可能？越想越清醒，越清醒越想。", dim: "E" },
      { letter: "C", text: "换个角度想：这也算一次全新体验对吧？或者找找有没有之前没考虑过的骚操作解法——问题是墙，也可能是窗户。", dim: "O" },
      { letter: "D", text: "不想把负能量传染给朋友。自己扛着，等事情翻篇了再说。朋友不是你的情绪垃圾桶，别祸害人家。", dim: "C" }
    ]
  },
  {
    q: "不太熟的人要来家里做客（比如同事、爸妈的朋友）。你的第一反应是？",
    opts: [
      { letter: "A", text: "提前打三个电话：几点到？地铁哪个口出？路上好走吗？要不要我下去接？把一切安排得明明白白。", dim: "S" },
      { letter: "B", text: "紧张地擦了四遍桌子、摆了三遍茶杯、把袜子从沙发底下捡了五遍。万一客人觉得我家乱怎么办？万一冷场怎么办？", dim: "E" },
      { letter: "C", text: "有点小兴奋！终于有人可以聊天了！我那套收藏的奇怪茶具、绝版漫画、去年海边捡的贝壳，终于可以见光了！", dim: "O" },
      { letter: "D", text: "提前备好饮料零食，注意观察客人的表情——要是TA看起来拘束，就主动搭个话帮TA放松，别让人家尴尬。", dim: "C" }
    ]
  },
  {
    q: "你和另一个人同时在抢一个东西（职位、比赛名额、最后一张演出票）。你会？",
    opts: [
      { letter: "A", text: "找几个朋友一起出主意攒人脉——一个人的拳头拧不过一群人的大腿。teamwork！", dim: "S" },
      { letter: "B", text: "有点不安：对手是谁？TA有啥背景？会不会有我不知道的渠道？提前脑补输了之后的emo场景三遍。", dim: "E" },
      { letter: "C", text: "试试别人没试过的路子。大家都走正门，我偏要翻窗户——说不定就能出奇制胜，虽然也可能摔个狗吃屎。", dim: "O" },
      { letter: "D", text: "凭本事抢，不搞阴的。如果对方赢了，虽然心痛但也服气，甚至会说：「牛啊兄弟，你是真的强。」", dim: "C" }
    ]
  },
  {
    q: "你要搬去一个完全陌生的城市了。心情是？",
    opts: [
      { letter: "A", text: "第一件事：加三个当地群发帖求认识邻居；翻老同学通讯录看有没有人恰好也在那儿，抱大腿要紧。", dim: "S" },
      { letter: "B", text: "心里发紧：新环境、新领导、新同事、一切都不确定……出发前查好当地治安、医院、房价、甚至派出所地址。", dim: "E" },
      { letter: "C", text: "期待！一座新城市意味着新的早餐店、新的夜路、新的老头下棋围观点，还有可能遇到的意想不到的人。", dim: "O" },
      { letter: "D", text: "临走前把旧家具留给需要的人，把不用的东西分给邻居；到了新地方，主动帮楼下老人拎个菜、修个灯。", dim: "C" }
    ]
  },
  {
    q: "凌晨两点，你本来只想刷五分钟手机，结果停不下来。主要原因是？",
    opts: [
      { letter: "A", text: "不是刷短视频——是在跟朋友聊天，话题从今天的饭好不好吃聊到人生意义，越聊越投机，根本舍不得睡。", dim: "S" },
      { letter: "B", text: "脑子里一直循环播放白天没处理好的事，越想越焦虑，越焦虑越刷手机逃避，陷入死循环，像个卡带的磁带。", dim: "E" },
      { letter: "C", text: "在查一个之前完全没关注过的话题，越查越有意思，发现了一个全新的世界，比如「为什么猫喜欢踩奶」，停不下来。", dim: "O" },
      { letter: "D", text: "其实已经困了，但看到群里有人发求助帖你没忍住；又看到另一个人需要帮忙……等反应过来，天都快亮了。", dim: "C" }
    ]
  }
];

/* ---------- 16 种动物数据 ---------- */
const ANIMALS = {
  "S_H_E_H_O_H_C_H": {
    emoji: "🐿️", name: "狐獴",
    species: "Suricata suricatta · Meerkat",
    slogan: "群体的眼睛，永远好奇永远守护",
    keywords: ["群居协作", "警戒哨兵", "家族守护者"],
    desc: "狐獴是天生的团队玩家 — 高度合作的家族结构、轮流放哨的生存策略、面对威胁时的集体反击，让它们在卡拉哈里沙漠的残酷环境中生生不息。它们的探索性让家族不断扩张领地，而高警觉性则是生存的第一道防线。",
    source: "学术依据：Manser et al. 2002（警报声系统）；Clutton-Brock et al. 2001（合作育幼）"
  },
  "S_H_E_H_O_H_C_L": {
    emoji: "🐒", name: "恒河猴",
    species: "Macaca mulatta · Rhesus Macaque",
    slogan: "群居但不信任何人",
    keywords: ["等级社会", "领地斗士", "警觉挑战者"],
    desc: '恒河猴的群体表面和谐，实则暗流涌动。它们通过精细的等级结构分配资源，对威胁高度敏感，会主动探索新领地，但绝不会让其他个体占自己的便宜。雄性在等级竞争中不惜使用暴力，这种物种层面的"不信任"正是它们成功适应人类定居区的关键。',
    source: "学术依据：Sade 1972（社会等级）；Hausfater 1984（杀婴行为）"
  },
  "S_H_E_H_O_L_C_H": {
    emoji: "🐑", name: "绵羊",
    species: "Ovis aries · Domestic Sheep",
    slogan: "一起吃草，一起逃跑",
    keywords: ["群体同步", "警戒集体", "熟悉偏好"],
    desc: "绵羊是群体安全感的信徒。它们不需要英雄，只需要身边有同伴 — 有同伴就有勇气前进，没同伴就寸步难行。对陌生事物充满警惕，对熟悉的牧场和同类则表现出惊人的忠诚。面对威胁时，群体同步逃跑本身就是一种有效的生存策略。",
    source: "学术依据：Miranda-de la Lama et al. 2011（群体凝聚力）；Dwyer 2004（社会依恋）"
  },
  "S_H_E_H_O_L_C_L": {
    emoji: "🐦", name: "家麻雀",
    species: "Passer domesticus · House Sparrow",
    slogan: "住同一个社区，但我不借你盐",
    keywords: ["群居竞争", "定居保守", "警戒集体"],
    desc: "家麻雀是城市最成功的物种之一，但成功不靠协作 — 而是靠在同一个社区里各自为战。它们群居是因为资源聚集，不是因为喜欢彼此；会集体起飞躲避威胁，但转头就在巢位竞争中互相拆台。定居性极强，一辈子活动范围不过几平方公里，新事物能绕就绕。",
    source: "学术依据：Anderson 2006（定居性）；Cordero et al. 1999（巢竞争）"
  },
  "S_H_E_L_O_H_C_H": {
    emoji: "🐬", name: "瓶鼻海豚",
    species: "Tursiops truncatus · Bottlenose Dolphin",
    slogan: "世界上最大的朋友圈",
    keywords: ["超级联盟", "文化创新", "情绪稳定"],
    desc: "瓶鼻海豚用实际行动证明：社交不是消耗品，而是资源。它们拥有已知最复杂的非人类社会结构 — 雄性联盟可达 14 只，还能形成跨联盟的超级网络。情绪稳定、好奇心旺盛，面对新物体第一反应是凑上去看看能不能用。",
    source: "学术依据：Connor et al. 2000（超级联盟）；Smolker et al. 1997（文化传统）"
  },
  "S_H_E_L_O_H_C_L": {
    emoji: "🐔", name: "原鸡",
    species: "Gallus gallus · Red Junglefowl",
    slogan: "群居但不分享女朋友",
    keywords: ["等级竞争", "地面探索", "情绪平和"],
    desc: '原鸡是群居动物中的"实用主义者" — 需要群体提供安全感，但资源绝对不能共享。雄性为配偶打得头破血流，等级低的只能趁主导者不注意偷袭。探索范围广但情绪稳定，不会因为一点风吹草动就起飞。',
    source: "学术依据：Banks 1992（等级系统）；Pizzari 2008（偷袭交配）"
  },
  "S_H_E_L_O_L_C_H": {
    emoji: "🐀", name: "裸鼹鼠",
    species: "Heterocephalus glaber · Naked Mole Rat",
    slogan: "我住地下，我团结，我不在乎",
    keywords: ["真社会性", "洞穴王国", "疼痛免疫"],
    desc: '裸鼹鼠是动物界最极端的"家庭主义者"。在一个可容纳整个家族的地下王国里，它们分工明确、高度合作，但一辈子都不会离开这座地下城市。情绪极度稳定（甚至对疼痛反应迟钝），探索欲几乎为零。',
    source: "学术依据：Sherman et al. 1991（真社会性）；Park et al. 2011（缺氧耐受）"
  },
  "S_H_E_L_O_L_C_L": {
    emoji: "🕊️", name: "原鸽",
    species: "Columba livia · Rock Pigeon",
    slogan: "一堆鸽子凑一起，但各飞各的",
    keywords: ["群居定居", "城市适应", "各自为战"],
    desc: "城市中最常见的群体 — 但这个群体没有组织、没有领导、没有协作，纯粹是资源聚集的产物。它们定居在熟悉的建筑物上，一辈子不挪窝；面对人类活动高度麻木；但一到繁殖季，筑巢位点的竞争能啄得头破血流。",
    source: "学术依据：Johnston & Janiga 1995（定居性）；Burley 1977（配偶竞争）"
  },
  "S_L_E_H_O_H_C_H": {
    emoji: "🦏", name: "黑犀牛",
    species: "Diceros bicornis · Black Rhinoceros",
    slogan: "独来独往，但不会冲你撞过来 — 大部分时候",
    keywords: ["独居警戒", "领地漫游", "和平饮水点"],
    desc: '黑犀牛是"独行侠中的绅士"。它们基本独来独往，对领地的态度是"我的就是我的，别来烦我"；但在公共水源点会放下架子，与其他犀牛和平共处。视力差所以警惕性极高，探索范围广，家域可达 50 平方公里。',
    source: "学术依据：Mukinya 1977（领地和家域）；Goddard 1967（社会行为）"
  },
  "S_L_E_H_O_H_C_L": {
    emoji: "🦊", name: "赤狐",
    species: "Vulpes vulpes · Red Fox",
    slogan: "一个人走夜路，听着风声就知道有没有麻烦",
    keywords: ["独居领地", "听觉猎手", "警觉漫游"],
    desc: "赤狐是动物界最经典的独居领地物种 — 一个人狩猎、一个人探索、一个人守护领地。听觉敏锐到能听见雪下老鼠的声音，活动范围可达 10 平方公里，对任何进入领地的同种个体都零容忍。",
    source: "学术依据：Baker 1974（领地行为）；Dell'Arte et al. 2007（人格差异）"
  },
  "S_L_E_H_O_L_C_H": {
    emoji: "🦔", name: "欧洲刺猬",
    species: "Erinaceus europaeus · European Hedgehog",
    slogan: "我可以蜷缩起来一整天，但有好吃的我不会把你赶走",
    keywords: ["独居警戒", "固定路线", "食物共享"],
    desc: '刺猬是独居动物中的"慷慨者"。它们基本独来独往，对领地的态度是"这是我的家"；但在食物丰富的地方（比如花园的喂鸟器下），会放下刺球与同类和平共处。活动范围小、路线固定、探索欲有限，但警觉性极高。',
    source: "学术依据：Morris 1984（领地和家域）；Hubert 2011（群居容忍性）"
  },
  "S_L_E_H_O_L_C_L": {
    emoji: "🐈", name: "家猫",
    species: "Felis catus · Domestic Cat",
    slogan: "这是我的沙发，请你滚出去",
    keywords: ["独居领地", "胆怯警戒", "固定路线"],
    desc: '家猫完美体现了"四个 L"的组合 — 低社交、高警觉、低探索、低协作。它们从野猫继承了强烈的领地意识和警戒心，一辈子活动范围不超过家门口；对陌生事物第一反应是躲起来；对自己的领地和物品有极强的占有欲。',
    source: "学术依据：Turner & Bateson 2014（社会行为）；Feaver et al. 1986（人格分类）"
  },
  "S_L_E_L_O_H_C_H": {
    emoji: "🦧", name: "红毛猩猩",
    species: "Pongo pygmaeus · Orangutan",
    slogan: "一个人也能过日子，而且过得还不错",
    keywords: ["独居智者", "工具创新", "情绪平和"],
    desc: '红毛猩猩是真正的"独居智者"。在所有大猿中，它们最不群居 — 一辈子大部分时间独自在树冠层游荡。但它们的情绪出奇地平和（不像黑猩猩那样好斗），探索性极强（会使用各种工具），偶尔还会表现出慷慨。',
    source: "学术依据：van Schaik 1999（工具使用）；Galdikas 1985（社会结构）"
  },
  "S_L_E_L_O_H_C_L": {
    emoji: "🐻", name: "棕熊",
    species: "Ursus arctos · Brown Bear",
    slogan: "几百平方公里都是我的，别来打扰我找三文鱼",
    keywords: ["独居漫游", "季节迁徙", "领地守护者"],
    desc: "棕熊是陆地上最大的食肉动物之一，也是最极致的独居领地物种。一个人的领地可达 1000 平方公里，跟踪三文鱼洄游、浆果成熟进行季节性迁徙。情绪稳定但领地意识极强 — 除非是母熊带幼崽或保护食物，否则不会主动攻击。",
    source: "学术依据：Craighead & Craighead 1972（领地行为）；Stonorov & Stokes 1972（迁徙）"
  },
  "S_L_E_L_O_L_C_H": {
    emoji: "🐘", name: "成年雄性亚洲象",
    species: "Elephas maximus · Adult Male Asian Elephant",
    slogan: "我从家族群搬出来住了，但不会跟你打架 — 除非我在发情",
    keywords: ["独居成年", "水源和平", "家域固定"],
    desc: '成年雄性亚洲象是"被迫独居的和平主义者"。从母系家族群中"毕业"后开始独居生活，但它们并不好斗 — 非 musth 期的雄性之间能在水源点和平共处。家域固定、探索欲有限、情绪稳定，偶尔还会形成松散的雄性联盟。',
    source: "学术依据：Sukumar 1989（社会结构）；Eisenberg 1981（雄性行为）"
  },
  "S_L_E_L_O_L_C_L": {
    emoji: "🐢", name: "箱龟",
    species: "Terrapene carolina · Eastern Box Turtle",
    slogan: "我在这棵落叶堆里住了 30 年，不会挪窝，也不会让你进来",
    keywords: ["极致宅", "气味领地", "情绪归零"],
    desc: '箱龟是动物界"四个 L"的极致体现 — 最宅、最固定、最不社交、最零协作。一个夏天的活动距离不超过 200 米，一辈子住在同一个落叶堆附近，情绪稳定到几乎为零（爬行动物本来就情绪振幅小），唯一的领地防御手段就是用尿味标记边界。',
    source: "学术依据：Dodd 2001（活动范围）；Schwartz et al. 1984（微生境偏好）"
  }
};

/* ---------- 状态变量 ---------- */
let currentQ = 0;
const answers = new Array(QUESTIONS.length).fill(null); // 存每题选择的 displayIndex

/* 选项打乱缓存：shuffledOpts[qi] = [{text, dim, letter}, ...] 打乱后的数组 */
let shuffledOpts = [];

/* ---------- DOM 引用 ---------- */
const $ = (id) => document.getElementById(id);

const pages = {
  start:  $("page-start"),
  quiz:   $("page-quiz"),
  result: $("page-result")
};
const sharePanel = $("page-share");

/* ---------- 工具：Fisher-Yates 打乱 ---------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- 开始新测试：为每题打乱选项 ---------- */
function prepareShuffled() {
  shuffledOpts = QUESTIONS.map(function(q) {
    const s = shuffle(q.opts);
    // 重新分配 A/B/C/D 字母
    s.forEach(function(o, i) { o.letter = String.fromCharCode(65 + i); });
    return s;
  });
}

/* ---------- 页面切换 ---------- */
function showPage(name) {
  Object.values(pages).forEach(function(p) { p.classList.remove("active"); });
  pages[name].classList.add("active");
  window.scrollTo(0, 0);
}

/* ---------- 渲染题目 ---------- */
function renderQuestion() {
  const q = QUESTIONS[currentQ];
  const opts = shuffledOpts[currentQ];

  $("current-num").textContent = currentQ + 1;
  $("progress-fill").style.width = (currentQ / QUESTIONS.length * 100) + "%";
  $("question-text").textContent = q.q;

  const wrap = $("options-wrap");
  wrap.innerHTML = "";
  opts.forEach(function(opt, i) {
    const btn = document.createElement("button");
    btn.className = "option-btn" + (answers[currentQ] === i ? " selected" : "");
    btn.innerHTML = '<span class="option-letter">' + opt.letter + "</span>" + opt.text;
    btn.onclick = function() { selectOption(i); };
    wrap.appendChild(btn);
  });

  const prev = $("btn-prev");
  if (currentQ === 0) {
    prev.classList.add("hidden");
  } else {
    prev.classList.remove("hidden");
    prev.textContent = currentQ === QUESTIONS.length - 1 ? "返回修改" : "上一题";
  }
}

/* ---------- 选择选项 ---------- */
function selectOption(displayIndex) {
  answers[currentQ] = displayIndex;

  const btns = document.querySelectorAll(".option-btn");
  btns.forEach(function(b, i) { b.classList.toggle("selected", i === displayIndex); });

  setTimeout(function() {
    if (currentQ < QUESTIONS.length - 1) {
      currentQ++;
      renderQuestion();
    } else {
      showResult();
    }
  }, 350);
}

/* ---------- 上一题 ---------- */
function goPrev() {
  if (currentQ > 0) {
    currentQ--;
    renderQuestion();
  }
}

/* ---------- 计分（使用打乱后的 opts） ---------- */
function computeScores() {
  const scores = { S: 0, E: 0, O: 0, C: 0 };
  answers.forEach(function(displayIdx, qi) {
    if (displayIdx !== null) {
      const dim = shuffledOpts[qi][displayIdx].dim;
      scores[dim]++;
    }
  });
  return scores;
}

/* ============================================================
 * 大头贴合成模块
 * ============================================================ */

/* ============================================================
 * 发箍配置：每个动物一个 emoji，直接显示在 CSS 画的半圆形发箍底座上
 * 想改表情/加图都在这里改
 * ============================================================ */
const HEADBAND_CONFIG = {
  "S_H_E_H_O_H_C_H": { emoji: "🦝", label: "狐獴" },
  "S_H_E_H_O_H_C_L": { emoji: "🐒", label: "恒河猴" },
  "S_H_E_H_O_L_C_H": { emoji: "🐑", label: "绵羊" },
  "S_H_E_H_O_L_C_L": { emoji: "🐦", label: "家麻雀" },
  "S_H_E_L_O_H_C_H": { emoji: "🐬", label: "瓶鼻海豚" },
  "S_H_E_L_O_H_C_L": { emoji: "🐓", label: "原鸡" },
  "S_H_E_L_O_L_C_H": { emoji: "🐀", label: "裸鼹鼠" },
  "S_H_E_L_O_L_C_L": { emoji: "🕊️", label: "野鸽" },
  "S_L_E_H_O_H_C_H": { emoji: "🦏", label: "黑犀牛" },
  "S_L_E_H_O_H_C_L": { emoji: "🦊", label: "赤狐" },
  "S_L_E_H_O_L_C_H": { emoji: "🦔", label: "欧洲刺猬" },
  "S_L_E_H_O_L_C_L": { emoji: "🐱", label: "家猫" },
  "S_L_E_L_O_H_C_H": { emoji: "🦧", label: "红毛猩猩" },
  "S_L_E_L_O_H_C_L": { emoji: "🐻", label: "棕熊" },
  "S_L_E_L_O_L_C_H": { emoji: "🐘", label: "亚洲象" },
  "S_L_E_L_O_L_C_L": { emoji: "🐢", label: "箱龟" }
};

/* ---------- DIY 贴纸系统：状态 ---------- */
let stickerState = {
  photoDataUrl: null,
  currentKey: null,
  stickers: [],      // [{id, emoji, x%, y%, scale, rotate}]
  selectedId: null,
  dragging: null     // {id, startX, startY, origX, origY}
};

/* 16 种动物的专属 emoji 列表（+ 相关的自然元素） */
const ANIMAL_EMOJI = {
  "S_H_E_H_O_H_C_H": { main: "🦝", extra: ["🐾", "🌵", "☀️", "👀"] },
  "S_H_E_H_O_H_C_L": { main: "🐒", extra: ["🍌", "🌴", "👀", "🙈"] },
  "S_H_E_H_O_L_C_H": { main: "🐑", extra: ["☁️", "🌿", "💤", "🌾"] },
  "S_H_E_H_O_L_C_L": { main: "🐦", extra: ["🌰", "🏠", "🪺", "🌿"] },
  "S_H_E_L_O_H_C_H": { main: "🐬", extra: ["🌊", "🌊", "🐟", "💫"] },
  "S_H_E_L_O_H_C_L": { main: "🐓", extra: ["🐣", "🌽", "🥚", "🍂"] },
  "S_H_E_L_O_L_C_H": { main: "🐀", extra: ["🕳️", "💤", "🧑‍🤝‍🧑", "❤️"] },
  "S_H_E_L_O_L_C_L": { main: "🕊️", extra: ["🏠", "🪺", "💤", "☁️"] },
  "S_L_E_H_O_H_C_H": { main: "🦏", extra: ["🦣", "🌴", "🌑", "💪"] },
  "S_L_E_H_O_H_C_L": { main: "🦊", extra: ["🍂", "🍁", "🌙", "👀"] },
  "S_L_E_H_O_L_C_H": { main: "🦔", extra: ["🍂", "🌿", "💤", "🏠"] },
  "S_L_E_H_O_L_C_L": { main: "🐱", extra: ["🐾", "🧶", "🏠", "💤"] },
  "S_L_E_L_O_H_C_H": { main: "🦧", extra: ["🌴", "🍌", "🦍", "🌿"] },
  "S_L_E_L_O_H_C_L": { main: "🐻", extra: ["🍯", "🌲", "💤", "🥄"] },
  "S_L_E_L_O_L_C_H": { main: "🐘", extra: ["🌴", "💧", "🦣", "🌿"] },
  "S_L_E_L_O_L_C_L": { main: "🐢", extra: ["🌿", "💧", "🏡", "☀️"] }
};

/* ---------- 初始化 DIY 编辑器 ---------- */
function initHeadband() {
  const editor = $("photo-editor");
  const stickersLayer = $("stickers-layer");

  // 点击编辑区 → 上传或取消选中
  editor.addEventListener("click", function(e) {
    // 点击贴纸本身不触发
    if (e.target.closest(".sticker")) return;
    // 点击底部贴纸按钮不触发
    if (e.target.closest(".sticker-btn")) return;
    // 点击编辑区的任何地方 → 如果还没照片就上传
    if (!stickerState.photoDataUrl) {
      $("photo-input").click();
    } else {
      // 有照片但没点到贴纸 → 取消选中
      if (!e.target.closest(".sticker")) deselectSticker();
    }
  });

  // 文件输入
  $("photo-input").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      stickerState.photoDataUrl = ev.target.result;
      applyPhoto();
    };
    reader.readAsDataURL(file);
  });

  // 贴纸栏按钮 → 添加贴纸
  document.querySelectorAll(".sticker-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.stopPropagation();
      addSticker(this.dataset.emoji);
    });
  });

  // 清空全部
  $("btn-clear-all").addEventListener("click", function() {
    if (stickerState.stickers.length === 0) return;
    if (confirm("确定清空所有贴纸吗？")) {
      stickerState.stickers = [];
      stickerState.selectedId = null;
      renderStickers();
      updateEditorToolbar();
    }
  });

  // 保存大头贴
  $("btn-save-photo").addEventListener("click", generateComposite);

  // 删除选中贴纸
  $("btn-delete-sticker").addEventListener("click", function() {
    removeSticker(stickerState.selectedId);
  });

  // 选中贴纸的滑块
  $("sticker-scale").addEventListener("input", function() {
    if (!stickerState.selectedId) return;
    const s = stickerState.stickers.find(x => x.id === stickerState.selectedId);
    if (s) { s.scale = parseFloat(this.value); renderStickers(); }
  });
  $("sticker-rotate").addEventListener("input", function() {
    if (!stickerState.selectedId) return;
    const s = stickerState.stickers.find(x => x.id === stickerState.selectedId);
    if (s) { s.rotate = parseFloat(this.value); renderStickers(); }
  });
}

/* ---------- 渲染"动物专属贴纸"栏 ---------- */
function renderAnimalStickers(key) {
  const row = $("animal-stickers");
  row.innerHTML = "";
  const conf = ANIMAL_EMOJI[key];
  if (!conf) return;
  const all = [conf.main, ...conf.extra];
  all.forEach(emoji => {
    const btn = document.createElement("button");
    btn.className = "sticker-btn";
    btn.dataset.emoji = emoji;
    btn.textContent = emoji;
    btn.addEventListener("click", function() { addSticker(emoji); });
    row.appendChild(btn);
  });
}

/* ---------- 添加一个贴纸 ---------- */
let _stickerId = 0;
function addSticker(emoji) {
  const s = {
    id: ++_stickerId,
    emoji: emoji,
    x: 50 + (Math.random() * 20 - 10),  // 中心附近随机
    y: 25 + (Math.random() * 15 - 7),   // 偏顶部
    scale: 1.0,
    rotate: Math.random() * 20 - 10
  };
  stickerState.stickers.push(s);
  stickerState.selectedId = s.id;
  renderStickers();
  updateEditorToolbar();
}

/* ---------- 删除一个贴纸 ---------- */
function removeSticker(id) {
  stickerState.stickers = stickerState.stickers.filter(s => s.id !== id);
  if (stickerState.selectedId === id) stickerState.selectedId = null;
  renderStickers();
  updateEditorToolbar();
}

/* ---------- 渲染所有贴纸到 DOM ---------- */
function renderStickers() {
  const layer = $("stickers-layer");
  const existing = {};
  // 记录当前 DOM 里有的贴纸
  layer.querySelectorAll(".sticker").forEach(el => {
    if (el.dataset.id) existing[el.dataset.id] = el;
  });

  // 收集 id 集合
  const currentIds = new Set(stickerState.stickers.map(s => String(s.id)));

  // 1. 删掉已经不存在的贴纸 DOM
  Object.keys(existing).forEach(id => {
    if (!currentIds.has(id)) existing[id].remove();
  });

  // 2. 更新 / 新增
  stickerState.stickers.forEach(s => {
    let el = existing[String(s.id)];
    if (!el) {
      // 新增
      el = document.createElement("div");
      el.className = "sticker";
      el.textContent = s.emoji;
      el.dataset.id = s.id;
      layer.appendChild(el);
      bindStickerEvents(el, s);
    }
    // 更新内容（emoji 可能变）
    if (el.textContent !== s.emoji) el.textContent = s.emoji;
    // 更新位置/缩放/旋转
    el.style.left = s.x + "%";
    el.style.top = s.y + "%";
    el.style.transform =
      "translate(-50%, -50%) scale(" + s.scale + ") rotate(" + s.rotate + "deg)";
    // 更新选中态
    el.classList.toggle("selected", s.id === stickerState.selectedId);
  });
}

/* ---------- 贴纸事件（选中 + 拖拽 + 双击删除） ---------- */
function bindStickerEvents(el, sticker) {
  let dragging = false;
  let startX, startY, origX, origY;
  let moved = false;
  let lastClickTime = 0;

  function onDown(e) {
    dragging = true;
    moved = false;
    const p = getPoint(e);
    startX = p.x; startY = p.y;
    origX = sticker.x; origY = sticker.y;
    // 不调 selectSticker！否则 renderStickers 销毁当前 el
    e.preventDefault();
  }
  function onMove(e) {
    if (!dragging) return;
    const p = getPoint(e);
    const rect = $("stickers-layer").getBoundingClientRect();
    const dx = ((p.x - startX) / rect.width) * 100;
    const dy = ((p.y - startY) / rect.height) * 100;
    sticker.x = Math.max(0, Math.min(100, origX + dx));
    sticker.y = Math.max(0, Math.min(100, origY + dy));
    moved = true;
    // 直接改 style，不调 renderStickers（避免重建 DOM）
    el.style.left = sticker.x + "%";
    el.style.top = sticker.y + "%";
  }
  function onUp() {
    if (!dragging) return;
    dragging = false;
    // 拖拽结束后再选中 + 刷新选中态（确保 selected class 正确）
    const now = Date.now();
    if (!moved && now - lastClickTime < 300) {
      // 双击删除
      removeSticker(sticker.id);
      return;
    }
    lastClickTime = now;
    // 点击 → 选中
    if (!moved) {
      if (stickerState.selectedId === sticker.id) {
        deselectSticker();
      } else {
        selectSticker(sticker.id);
      }
    }
  }

  el.addEventListener("mousedown", onDown);
  window.addEventListener("mousemove", onMove);
  window.addEventListener("mouseup", onUp);
  el.addEventListener("touchstart", onDown, { passive: false });
  window.addEventListener("touchmove", onMove, { passive: false });
  window.addEventListener("touchend", onUp);
}

/* ---------- 选中/取消选中 ---------- */
function selectSticker(id) {
  stickerState.selectedId = id;
  renderStickers();
  updateEditorToolbar();
}
function deselectSticker() {
  stickerState.selectedId = null;
  renderStickers();
  updateEditorToolbar();
}

/* ---------- 更新编辑工具栏的滑块值 ---------- */
function updateEditorToolbar() {
  const editor = $("sticker-editor");
  const tip = document.querySelector(".control-tip");
  if (stickerState.selectedId) {
    const s = stickerState.stickers.find(x => x.id === stickerState.selectedId);
    $("sticker-scale").value = s.scale;
    $("sticker-rotate").value = s.rotate;
    editor.classList.remove("hidden");
    if (tip) tip.textContent = "💡 拖拽移动，双击删除，或用下方滑块调整";
  } else {
    editor.classList.add("hidden");
    if (tip) tip.textContent = "💡 点击贴纸栏添加装饰，点击贴纸后可拖拽/缩放";
  }
}

/* ---------- 应用用户照片 ---------- */
function applyPhoto() {
  const editor = $("photo-editor");
  const img = $("user-photo");
  const placeholder = $("upload-placeholder");
  const controls = $("editor-controls");

  img.src = stickerState.photoDataUrl;
  editor.classList.add("has-photo");
  placeholder.classList.add("hidden");
  controls.classList.remove("hidden");
  renderStickers();
  updateEditorToolbar();
}

/* ---------- 加载当前动物 → 渲染专属贴纸栏 ---------- */
function loadHeadband(animalKey) {
  stickerState.currentKey = animalKey;
  renderAnimalStickers(animalKey);
}

/* 工具：从事件取坐标 */
function getPoint(e) {
  if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  if (e.changedTouches && e.changedTouches[0]) return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  return { x: e.clientX, y: e.clientY };
}

/* ---------- html2canvas 合成 ---------- */
function generateComposite() {
  if (!stickerState.photoDataUrl) {
    alert("请先上传你的照片哦~");
    return;
  }

  // 取消选中（避免截图里带虚线框和 🗑 角标）
  const hadSelection = stickerState.selectedId !== null;
  if (hadSelection) {
    // 临时清除 selected class
    document.querySelectorAll(".sticker.selected").forEach(el => el.classList.remove("selected"));
  }

  const btn = $("btn-save-photo");
  const orig = btn.textContent;
  btn.textContent = "生成中...";
  btn.disabled = true;

  html2canvas($("photo-editor"), {
    backgroundColor: null,
    scale: 3,
    useCORS: true,
    allowTaint: true,
    logging: false
  }).then(function(canvas) {
    if (hadSelection) renderStickers();  // 恢复选中
    $("generated-photo").src = canvas.toDataURL("image/png");
    $("photo-result-wrap").classList.remove("hidden");
    btn.textContent = orig;
    btn.disabled = false;
    setTimeout(() => $("photo-result-wrap").scrollIntoView({ behavior: "smooth", block: "center" }), 100);
    $("toast").textContent = "✓ 大头贴已生成！长按图片保存";
    $("toast").classList.add("show");
    setTimeout(() => $("toast").classList.remove("show"), 2500);
  }).catch(function(err) {
    if (hadSelection) renderStickers();
    btn.textContent = orig;
    btn.disabled = false;
    alert("生成失败：" + err.message);
  });
}

/* ---------- 结果展示 ---------- */
let lastResult = null; // 缓存结果供分享使用

function showResult() {
  showPage("result");

  const scores = computeScores();
  const hilo = {};
  ["S", "E", "O", "C"].forEach(function(d) {
    hilo[d] = scores[d] >= 3 ? "H" : "L"; /* 3 = 均值切分，确保 16 种组合都能被测到 */
  });
  const key = "S_" + hilo.S + "_E_" + hilo.E + "_O_" + hilo.O + "_C_" + hilo.C;
  const animal = ANIMALS[key] || ANIMALS["S_L_E_L_O_L_C_L"];

  lastResult = { animal: animal, scores: scores };

  $("result-wrap").innerHTML =
    '<span class="result-emoji">' + animal.emoji + "</span>" +
    '<div class="result-species">' + animal.species + "</div>" +
    '<h2 class="result-title">' + animal.name + "</h2>" +
    '<p class="result-slogan">' + animal.slogan + "</p>" +
    '<div class="result-keywords">' +
      animal.keywords.map(function(k) { return '<span class="keyword-tag">' + k + "</span>"; }).join("") +
    "</div>" +
    '<p class="result-desc">' + animal.desc + "</p>" +
    '<div class="result-source">' +
      "<strong>匹配依据</strong><br/>" + animal.source +
    "</div>";

  ["S", "E", "O", "C"].forEach(function(d) {
    $("score-" + d).textContent = scores[d];
    $("dim-" + d).style.width = "0%";
  });
  requestAnimationFrame(function() {
    setTimeout(function() {
      ["S", "E", "O", "C"].forEach(function(d) {
        $("dim-" + d).style.width = (scores[d] / 12 * 100) + "%";
      });
    }, 150);
  });

  // 根据结果加载对应动物的发箍
  loadHeadband(key);
}

/* ---------- 生成分享文字 ---------- */
function buildShareText() {
  const a = lastResult.animal;
  const s = lastResult.scores;
  return "我是一只" + a.name + " " + a.emoji + "\n" +
    a.slogan + "\n" +
    "社交驱力" + s.S + "/12  情绪反应性" + s.E + "/12  探索倾向" + s.O + "/12  协作倾向" + s.C + "/12\n" +
    "来测测你是哪种动物吧！🐾";
}

/* ---------- 复制文字到剪贴板 ---------- */
function copyText(text) {
  // 兼容方案
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  // fallback
  return new Promise(function(resolve, reject) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); resolve(); }
    catch (e) { reject(e); }
    document.body.removeChild(ta);
  });
}

/* ---------- 用 Canvas 生成分享图片 ---------- */
function buildShareImage() {
  const a = lastResult.animal;
  const s = lastResult.scores;

  const W = 750, H = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // 背景（鼠尾草绿渐变）
  const grd = ctx.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, "#f5ede0");
  grd.addColorStop(1, "#e8e3db");
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, W, H);

  // 装饰圈
  ctx.fillStyle = "rgba(107, 142, 122, 0.08)";
  ctx.beginPath(); ctx.arc(W * 0.85, 120, 180, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(60, H - 100, 120, 0, Math.PI * 2); ctx.fill();

  // 标题
  ctx.fillStyle = "#6b8e7a";
  ctx.font = "bold 24px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("🐾 动物人格测试", W / 2, 80);

  // 动物 emoji
  ctx.font = "160px sans-serif";
  ctx.fillStyle = "#2b2a26";
  ctx.fillText(a.emoji, W / 2, 290);

  // 物种学名
  ctx.fillStyle = "#999";
  ctx.font = "italic 16px -apple-system, sans-serif";
  ctx.fillText(a.species, W / 2, 340);

  // 动物名
  ctx.fillStyle = "#2b2a26";
  ctx.font = "bold 48px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.fillText(a.name, W / 2, 420);

  // Slogan
  ctx.fillStyle = "#4d6b5a";
  ctx.font = "bold 22px -apple-system, 'PingFang SC', sans-serif";
  ctx.fillText("「" + a.slogan + "」", W / 2, 470);

  // 关键词标签
  let tagX = W / 2 - 180;
  a.keywords.forEach(function(k) {
    const w = ctx.measureText(k).width + 40;
    ctx.fillStyle = "#a3c4b2";
    roundRect(ctx, tagX, 500, w, 44, 22);
    ctx.fill();
    ctx.fillStyle = "#4d6b5a";
    ctx.font = "18px -apple-system, 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(k, tagX + w / 2, 529);
    tagX += w + 14;
  });

  // 分隔线
  ctx.strokeStyle = "rgba(107, 142, 122, 0.2)";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 590); ctx.lineTo(W - 80, 590); ctx.stroke();

  // 描述
  ctx.fillStyle = "#2b2a26";
  ctx.font = "19px -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  wrapText(ctx, a.desc, 80, 620, W - 160, 30);

  // 维度得分
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  const dims = [
    { label: "社交驱力", val: s.S, x: 80, color: "#6b8e7a" },
    { label: "情绪反应性", val: s.E, x: 290, color: "#d4a373" },
    { label: "探索倾向", val: s.O, x: 80, y: 970, color: "#7a8eb8" },
    { label: "协作倾向", val: s.C, x: 290, y: 970, color: "#a89870" }
  ];
  dims.forEach(function(d) {
    const y = d.y || 920;
    ctx.fillStyle = d.color;
    ctx.font = "bold 20px -apple-system, sans-serif";
    ctx.fillText(d.val + "/12", d.x, y);
    ctx.fillStyle = "#666";
    ctx.font = "14px -apple-system, sans-serif";
    ctx.fillText(d.label, d.x + 70, y);
  });

  // 底部引导
  ctx.fillStyle = "#6b8e7a";
  ctx.textAlign = "center";
  ctx.font = "bold 15px -apple-system, 'PingFang SC', sans-serif";
  ctx.fillText("🐾 保存图片，发给朋友测测你是哪种动物", W / 2, H - 40);

  return canvas;
}

/* ---------- Canvas 辅助：圆角矩形 ---------- */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ---------- Canvas 辅助：文本换行 ---------- */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = text.split("");
  let line = "";
  let cy = y;
  chars.forEach(function(c) {
    const test = line + c;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, cy);
      line = c;
      cy += lineHeight;
    } else {
      line = test;
    }
  });
  if (line) ctx.fillText(line, x, cy);
}

/* ---------- 保存为图片（触发下载） ---------- */
function downloadImage() {
  const canvas = buildShareImage();
  canvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "我的动物人格测试结果.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}

/* ---------- 事件绑定 ---------- */
$("btn-start").addEventListener("click", function() {
  currentQ = 0;
  answers.fill(null);
  prepareShuffled();
  $("total-num").textContent = QUESTIONS.length;
  renderQuestion();
  showPage("quiz");
});

$("btn-prev").addEventListener("click", goPrev);

$("btn-restart").addEventListener("click", function() {
  currentQ = 0;
  answers.fill(null);
  showPage("start");
});

/* 一键保存结果图片 */
$("btn-share").addEventListener("click", function() {
  downloadImage();
  $("toast").classList.add("show");
  setTimeout(function() { $("toast").classList.remove("show"); }, 2200);
});

/* ---------- 页面加载完毕后初始化大头贴模块 ---------- */
initHeadband();
