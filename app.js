/* ============================================================
 * 动物人格测试 - 核心逻辑
 * 基于：大五人格模型 (FFM) + 动物行为学研究
 * 改动：选项打乱 + 微信友好分享 + 修正模糊选项文案
 * ============================================================ */

/* ---------- 12 道题目数据 ---------- */
const QUESTIONS = [
  {
    q: "朋友突然带你去一个你完全陌生的聚会，没人提前告诉你是什么人。走进门的那一刻，你最像哪个？",
    opts: [
      { letter: "A", text: "微笑环视全场，主动和最近的人搭话，介绍自己 — 先认识在场所有人", dim: "S" },
      { letter: "B", text: "先确认环境没危险：看看有没有奇怪的人、消防通道在哪、喝的东西有没有问题，才敢放松", dim: "E" },
      { letter: "C", text: "环顾四周：装修挺特别、桌上的食物是新菜系、角落还有只猫 — 好奇死了", dim: "O" },
      { letter: "D", text: '注意到一个人坐在角落没人理，主动走过去问"要不要一起过去那边？"', dim: "C" }
    ]
  },
  {
    q: "难得一天独处休息日，没人约没工作。你最可能的安排是？",
    opts: [
      { letter: "A", text: '拿起手机给几个朋友发消息："今天空了，有人出来吃饭吗？"', dim: "S" },
      { letter: "B", text: "计划得明明白白：几点起床、做什么事、几点午休，按表走，不想被打乱", dim: "E" },
      { letter: "C", text: "翻翻食谱做从没做过的菜、搜一个没去过的地方走走、或者学个新技能", dim: "O" },
      { letter: "D", text: "把上周朋友借的东西送回去、帮邻居收快递、整理书架准备下周读书会带的书", dim: "C" }
    ]
  },
  {
    q: "你正在专注做一件事，突然被通知：原定明天的计划全部取消，换成另一个完全不同的任务，明天下午就要交付。你的第一反应是？",
    opts: [
      { letter: "A", text: '立刻给同事/同学发消息："听说了吗？全部推翻重来！你们有什么想法？"', dim: "S" },
      { letter: "B", text: "心一沉：这也太突然了，之前做的都白费了？开始担忧时间够不够、会不会出岔子", dim: "E" },
      { letter: "C", text: "兴奋起来：全新任务？好啊！那我可以试试之前想做但没机会的方案", dim: "O" },
      { letter: "D", text: "赶紧联系团队其他人，问大家手上有什么资源可以共享，尽量减少重复劳动", dim: "C" }
    ]
  },
  {
    q: "你一个人，站在餐厅、外卖 APP 或厨房前犹豫吃什么。你会怎么选？",
    opts: [
      { letter: "A", text: "叫上一个朋友一起去吃 — 一个人吃饭太无聊了，有人聊天才叫吃饭", dim: "S" },
      { letter: "B", text: "选熟悉的、吃过很多次的那家 — 新东西可能不好吃也不卫生，稳一点好", dim: "E" },
      { letter: "C", text: "试试这家新开店的招牌菜！不管是网红店还是路边摊，新东西就是值得试试", dim: "O" },
      { letter: "D", text: "先想想朋友圈里有没有人说过这家不错、或者选邻居常点的那家，跟着靠谱的人走", dim: "C" }
    ]
  },
  {
    q: "你在小区里发现一只看起来很可怜的流浪猫狗。你会怎么做？",
    opts: [
      { letter: "A", text: "拍照片发朋友圈/业主群，问有没有人愿意一起集资送它去医院", dim: "S" },
      { letter: "B", text: "先不敢靠近 — 它可能有狂犬病、可能会咬人，先远远拍个照问懂的人再行动", dim: "E" },
      { letter: "C", text: "蹲下来观察它：什么品种？什么状态？之前在这见过它吗？好奇它的经历", dim: "O" },
      { letter: "D", text: "先回家拿食物和水给它，然后联系救助机构，哪怕自己出钱也没关系", dim: "C" }
    ]
  },
  {
    q: "办公室/教室来了一个新人，看起来有点拘谨。你会怎么对待 TA？",
    opts: [
      { letter: "A", text: "立刻走过去自我介绍，问 TA 要不要一起吃午饭，把 TA 拉进你的社交圈", dim: "S" },
      { letter: "B", text: "犹豫一下 — TA 看起来不太好接近，万一热情过头显得奇怪呢？先观察几天再说", dim: "E" },
      { letter: "C", text: "好奇 TA 是做什么/学什么的，之前在哪工作/上学 — 从聊天里发现新的信息和角度", dim: "O" },
      { letter: "D", text: "主动帮 TA 适应环境：告诉 TA 打印机在哪、怎么请假/选课、邻座是谁 — 让 TA 不那么难", dim: "C" }
    ]
  },
  {
    q: "你有一周假期，打算一个人出去旅行。你会怎么规划？",
    opts: [
      { letter: "A", text: "先看看有没有朋友正好在那个城市，约着一起吃饭/逛景点，或者在路上拼个团交新朋友", dim: "S" },
      { letter: "B", text: "做非常详细的攻略：每天住哪、几点起、去哪些景点、应急电话，甚至查好当地医院地址", dim: "E" },
      { letter: "C", text: "不做攻略 — 到了再说，随机应变，哪个方向吸引自己就往哪走，说不定有意外惊喜", dim: "O" },
      { letter: "D", text: "查当地有没有需要帮助的公益组织，或者顺路看一个朋友；旅行回来给同事带手信", dim: "C" }
    ]
  },
  {
    q: "你遇到一件让你特别焦虑/烦躁的事，你会怎么处理？",
    opts: [
      { letter: "A", text: "约朋友出来吃饭/喝酒/散步，把这事从头到尾讲一遍 — 说出来就好了", dim: "S" },
      { letter: "B", text: "脑子里反复想这件事：会不会搞砸？后果会怎样？越想越睡不着，但又忍不住想", dim: "E" },
      { letter: "C", text: "换个角度想：这也算一次新体验吧？或者看看能不能找到之前没想过的解决方案", dim: "O" },
      { letter: "D", text: "不想让别人也被这事影响 — 先自己扛着，等事情解决了再跟人提", dim: "C" }
    ]
  },
  {
    q: "有不太熟的人要来家里做客（比如同事、父母的朋友）。你的第一反应是？",
    opts: [
      { letter: "A", text: '提前打电话问："什么时候到？要不要帮你查地铁？路上方便吗？" 非常热情地安排', dim: "S" },
      { letter: "B", text: "紧张地收拾了一遍又一遍：万一客人觉得我家乱怎么办？万一冷场怎么办？", dim: "E" },
      { letter: "C", text: "兴奋起来：有客人来可以聊天！我可以把收藏的奇怪东西拿出来展示", dim: "O" },
      { letter: "D", text: '提前准备好饮料和零食，注意观察客人的反应，不自在就主动搭话帮 TA 放松', dim: "C" }
    ]
  },
  {
    q: "你和另一个人同时竞争一个资源（比如职位、比赛名额、难抢的商品）。你会怎么做？",
    opts: [
      { letter: "A", text: "找几个朋友帮你出主意、攒人脉 — 一个人的力量有限，团队合作才能赢", dim: "S" },
      { letter: "B", text: "有点不安：对手是谁？TA 有什么优势？会不会走捷径？提前想好万一输了怎么办", dim: "E" },
      { letter: "C", text: "大胆创新 — 别人都用 A 方法，我试试 B 方法，说不定能出奇制胜", dim: "O" },
      { letter: "D", text: "公平竞争不耍手段；如果对方表现更好，虽然失落但也服气，甚至主动祝贺", dim: "C" }
    ]
  },
  {
    q: "你因为工作/学习要搬到一个完全陌生的城市。你的反应是？",
    opts: [
      { letter: "A", text: "先加入当地几个微信群/QQ 群发帖求认识新邻居；找有没有老同学/老同事在这个城市", dim: "S" },
      { letter: "B", text: "紧张：新环境、新人际关系、不确定的一切……去之前查好当地安全状况、医院、房价", dim: "E" },
      { letter: "C", text: "期待！新城市意味着新美食、新风景、新文化，我要多走走多看看", dim: "O" },
      { letter: "D", text: "临走前把旧家具留给需要的人、把不用的东西送给邻居；到了新地方主动帮楼下老人做点小事", dim: "C" }
    ]
  },
  {
    q: "已经凌晨 2 点了，你本来只想刷一会儿手机，结果停不下来。主要原因是？",
    opts: [
      { letter: "A", text: "不是刷短视频，是在跟朋友聊天 — 话题越来越投机，越聊越嗨，根本不想睡", dim: "S" },
      { letter: "B", text: "脑子里一直在想白天没处理好的事，越想越焦虑，越焦虑越刷手机逃避，陷入循环", dim: "E" },
      { letter: "C", text: "在查一个之前没关注过的话题，越查越有意思，发现了新世界，停不下来", dim: "O" },
      { letter: "D", text: "其实困了，但看到群里有人发求助帖，你答应了，又看到另一个求助帖……不知不觉就很晚了", dim: "C" }
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

/* ---------- 发箍配置表 ----------
 * 每个动物有两个字段：
 *   headbandEmoji: 临时 fallback，用 Canvas 画成"发箍+耳朵"效果，立即可用
 *   headbandImage: 可替换的透明 PNG 路径。后续你可以把真实发箍图放到
 *                  headbands/ 目录下，然后把这里改成 "headbands/狐獴.png"
 * 两者都可以为空字符串，代码会自动 fallback
 */
const HEADBAND_CONFIG = {
  "S_H_E_H_O_H_C_H": { emoji: "🦝", image: "", label: "狐獴耳朵" },
  "S_H_E_H_O_H_C_L": { emoji: "🐒", image: "", label: "猴子耳朵" },
  "S_H_E_H_O_L_C_H": { emoji: "🐑", image: "", label: "绵羊耳朵" },
  "S_H_E_H_O_L_C_L": { emoji: "🐦", image: "", label: "麻雀耳朵" },
  "S_H_E_L_O_H_C_H": { emoji: "🐬", image: "", label: "海豚发箍" },
  "S_H_E_L_O_H_C_L": { emoji: "🐔", image: "", label: "鸡耳朵" },
  "S_H_E_L_O_L_C_H": { emoji: "🐀", image: "", label: "老鼠耳朵" },
  "S_H_E_L_O_L_C_L": { emoji: "🕊️", image: "", label: "鸽子耳朵" },
  "S_L_E_H_O_H_C_H": { emoji: "🦏", image: "", label: "犀牛角" },
  "S_L_E_H_O_H_C_L": { emoji: "🦊", image: "", label: "狐狸耳朵" },
  "S_L_E_H_O_L_C_H": { emoji: "🦔", image: "", label: "刺猬耳朵" },
  "S_L_E_H_O_L_C_L": { emoji: "🐈", image: "", label: "猫耳朵" },
  "S_L_E_L_O_H_C_H": { emoji: "🦧", image: "", label: "红毛猩猩" },
  "S_L_E_L_O_H_C_L": { emoji: "🐻", image: "", label: "熊耳朵" },
  "S_L_E_L_O_L_C_H": { emoji: "🐘", image: "", label: "大象耳朵" },
  "S_L_E_L_O_L_C_L": { emoji: "🐢", image: "", label: "小乌龟" }
};

/* ---------- 大头贴状态 ---------- */
let headbandState = {
  photoDataUrl: null,       // 用户照片的 dataURL
  currentKey: null,          // 当前结果的维度 key
  scale: 100,                // 滑块值：40-200 → 0.4-2.0
  offsetX: 0,                // 滑块值：-50~50 → 像素偏移（相对容器宽度百分比）
  offsetY: 0,                // 滑块值：-50~50 → 像素偏移
  rotate: 0                  // 滑块值：-30~30 度
};

/* ---------- 初始化：绑定事件 ---------- */
function initHeadband() {
  // 点击容器 / 上传按钮 → 触发文件选择
  $("headband-container").addEventListener("click", function() {
    $("photo-input").click();
  });
  $("btn-upload-photo").addEventListener("click", function(e) {
    e.stopPropagation();
    $("photo-input").click();
  });

  // 选择文件 → 读取
  $("photo-input").addEventListener("change", function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      headbandState.photoDataUrl = ev.target.result;
      applyPhoto();
    };
    reader.readAsDataURL(file);
  });

  // 滑块联动
  ["scale", "x", "y", "rotate"].forEach(function(key) {
    const sliderId = "slider-" + (key === "scale" ? "scale" : key);
    $("slider-" + key).addEventListener("input", function() {
      updateHeadbandTransform();
    });
  });

  // 重置按钮
  $("btn-reset-headband").addEventListener("click", resetHeadband);

  // 生成大头贴按钮
  $("btn-generate-photo").addEventListener("click", generateComposite);

  // 下载按钮
  $("btn-download-photo").addEventListener("click", function() {
    const img = $("generated-photo");
    const a = document.createElement("a");
    a.href = img.src;
    a.download = "我的动物大头贴.png";
    a.click();
  });
}

/* ---------- 应用用户照片 ---------- */
function applyPhoto() {
  const container = $("headband-container");
  const img = $("user-photo");
  const placeholder = $("upload-placeholder");

  img.src = headbandState.photoDataUrl;
  container.classList.add("has-photo");
  placeholder.classList.add("hidden");

  // 显示滑块组
  $("slider-group").classList.remove("hidden");
}

/* ---------- 加载当前动物对应的发箍 ---------- */
function loadHeadband(animalKey) {
  headbandState.currentKey = animalKey;
  const config = HEADBAND_CONFIG[animalKey];
  const img = $("animal-headband");

  if (!config) { img.style.display = "none"; return; }

  // 重置位置
  resetHeadband();

  if (config.image) {
    // 用户自己放了 PNG → 用 PNG
    img.src = config.image;
    img.style.display = "block";
  } else {
    // fallback：用 emoji 做一个临时"发箍"SVG
    // 方式：在 Canvas 上画 emoji + 一个弧形发箍形状，导出为 dataURL
    const svg = buildHeadbandSvg(config.emoji);
    img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svg);
    img.style.display = "block";
  }
}

/* ---------- 程序化生成发箍 SVG（emoji + 弧形底座） ---------- */
function buildHeadbandSvg(emoji) {
  // 尺寸：宽 400 高 220（发箍是一个弧形条带 + emoji）
  return '' +
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 220" width="400" height="220">' +
    // 透明背景
    '<rect width="400" height="220" fill="transparent"/>' +
    // 发箍弧形底座（从左下到右下的半圆弧）
    '<path d="M 40 180 Q 200 -40 360 180 Z" fill="rgba(107,142,122,0.35)" stroke="rgba(77,107,90,0.6)" stroke-width="3"/>' +
    // emoji（居中偏上）
    '<text x="200" y="150" text-anchor="middle" font-size="140" font-family="Apple Color Emoji, Segoe UI Emoji, sans-serif" dominant-baseline="middle">' + emoji + '</text>' +
    '</svg>';
}

/* ---------- 更新发箍 CSS transform ---------- */
function updateHeadbandTransform() {
  const s = headbandState;
  const img = $("animal-headband");
  if (!img || img.style.display === "none") return;

  // scale: 40-200 → 0.4-2.0
  const scaleRatio = s.scale / 100;
  // 偏移：滑块 -50~50 → -25%~25%（相对发箍自身宽度）
  const xPct = s.offsetX;
  const yPct = s.offsetY;

  img.style.transform =
    "translate(calc(-50% + " + xPct + "%), " + yPct + "%) " +
    "scale(" + scaleRatio + ") " +
    "rotate(" + s.rotate + "deg)";
}

/* ---------- 重置发箍位置 ---------- */
function resetHeadband() {
  headbandState.scale = 100;
  headbandState.offsetX = 0;
  headbandState.offsetY = 0;
  headbandState.rotate = 0;

  $("slider-scale").value = 100;
  $("slider-x").value = 0;
  $("slider-y").value = 0;
  $("slider-rotate").value = 0;

  updateHeadbandTransform();
}

/* ---------- Canvas 合成导出 ---------- */
function generateComposite() {
  if (!headbandState.photoDataUrl) {
    alert("请先上传你的照片哦~");
    return;
  }

  const canvas = $("result-canvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width;   // 750
  const H = canvas.height;  // 1000 (3:4)

  ctx.clearRect(0, 0, W, H);

  // 1) 绘制用户照片（居中 cover 裁切，保持预览与合成一致）
  const userImg = new Image();
  userImg.crossOrigin = "anonymous";
  userImg.onload = function() {
    drawCover(ctx, userImg, 0, 0, W, H);

    // 2) 绘制发箍
    drawHeadbandOnCanvas(ctx, W, H);

    // 3) 导出为 dataURL
    const dataUrl = canvas.toDataURL("image/png");
    const resultWrap = $("photo-result-wrap");
    resultWrap.classList.remove("hidden");
    $("generated-photo").src = dataUrl;
    $("generated-photo").style.display = "block";

    // 滚动到结果
    setTimeout(function() {
      resultWrap.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    // Toast
    $("toast").classList.add("show");
    setTimeout(function() { $("toast").classList.remove("show"); }, 2200);
  };
  userImg.src = headbandState.photoDataUrl;
}

/* ---------- Canvas 辅助：cover 裁切 ---------- */
function drawCover(ctx, img, x, y, w, h) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(w / iw, h / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = x + (w - dw) / 2;
  const dy = y + (h - dh) / 2;
  ctx.drawImage(img, dx, dy, dw, dh);
}

/* ---------- Canvas 辅助：按当前 transform 绘制发箍 ---------- */
function drawHeadbandOnCanvas(ctx, W, H) {
  const headImg = $("animal-headband");
  if (!headImg || headImg.style.display === "none") return;

  // 获取预览容器的实际尺寸（用 getBoundingClientRect）
  const container = $("headband-container");
  const rect = container.getBoundingClientRect();
  const cw = rect.width;
  const ch = rect.height;

  // 发箍在预览中的尺寸（CSS: width: 60% container）
  const hw = cw * 0.6;
  // 发箍在预览中的 top（CSS: top: -5% container 高度）
  const topPct = -0.05;

  // 把滑块 translate/scale/rotate 转换为 Canvas 坐标
  // Canvas 坐标系：左上角 (0,0)，像素 = W/cw（按宽度比）
  const scaleRatio = W / cw;

  const imgW = hw * scaleRatio;
  const imgH = hw * 1.1 * scaleRatio; // 发箍原始宽高比约 400:220 ≈ 1.8 → 这里近似
  const cx = (cw / 2) * scaleRatio;                          // 发箍锚点 x（容器中心）
  const cy = (ch * topPct + hw * 0.55) * scaleRatio;          // 锚点 y：top + 发箍底部（发箍底部中心是 transform-origin）

  // 滑块值 → 像素（滑块 x:-50~50 相对发箍宽度百分比）
  const s = headbandState;
  const translateX = (s.offsetX / 100) * imgW;
  const translateY = (s.offsetY / 100) * imgW;
  const scale = s.scale / 100;
  const rotateRad = (s.rotate * Math.PI) / 180;

  ctx.save();
  ctx.translate(cx + translateX, cy + translateY);
  ctx.rotate(rotateRad);
  ctx.scale(scale, scale);
  ctx.translate(-imgW / 2, -imgH); // 把锚点移到发箍底部中心
  ctx.drawImage(headImg, 0, 0, imgW, imgH);
  ctx.restore();
}

/* ---------- 结果展示 ---------- */
let lastResult = null; // 缓存结果供分享使用

function showResult() {
  showPage("result");

  const scores = computeScores();
  const hilo = {};
  ["S", "E", "O", "C"].forEach(function(d) {
    hilo[d] = scores[d] >= 7 ? "H" : "L";
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
