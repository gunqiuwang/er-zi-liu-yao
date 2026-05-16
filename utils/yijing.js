// utils/yijing.js
// 易经六十四卦数据

const hexagrams = {
  '䷀': { name: '乾', title: '乾为天', text: '乾，元亨利贞。初九，潜龙勿用。九二，见龙在田，利见大人。九三，君子终日乾乾，夕惕若厉，无咎。九四，或跃在渊，无咎。九五，飞龙在天，利见大人。上九，亢龙有悔。用九，见群龙无首，吉。' },
  '䷁': { name: '坤', title: '坤为地', text: '坤，元亨利牝马之贞。君子有攸往，先迷后得主。利西南得朋，东北丧朋。安贞，吉。' },
  '䷂': { name: '屯', title: '水雷屯', text: '屯，元亨利贞。勿用有攸往，利建侯。' },
  '䷃': { name: '蒙', title: '山水蒙', text: '蒙，亨。匪我求童蒙，童蒙求我。初噬告，以再三渎。渎则不告，利贞。' },
  '䷄': { name: '需', title: '水天需', text: '需，有孚，光亨，贞吉。利涉大川。' },
  '䷅': { name: '讼', title: '天水讼', text: '讼，有孚，窒。惕中吉。终凶。利见大人。不利涉大川。' },
  '䷆': { name: '师', title: '地水师', text: '师，贞，丈人吉，无咎。' },
  '䷇': { name: '比', title: '水地比', text: '比，吉。原筮元永贞，无咎。不宁方来，后夫凶。' },
  '䷈': { name: '小畜', title: '风天小畜', text: '小畜，亨。密云不雨，自我西郊。' },
  '䷉': { name: '履', title: '天泽履', text: '履，履虎尾，不咥人，亨。' },
  '䷊': { name: '泰', title: '天地泰', text: '泰，小往大来，吉亨。' },
  '䷋': { name: '否', title: '天地否', text: '否之匪人，不利君子贞，大往小来。' },
  '䷌': { name: '同人', title: '天火同人', text: '同人，于野，亨。利涉大川，利君子贞。' },
  '䷍': { name: '大有', title: '火天大有', text: '大有，元亨。' },
  '䷎': { name: '谦', title: '地山谦', text: '谦，亨，君子有终。' },
  '䷏': { name: '豫', title: '雷地豫', text: '豫，利建侯行师。' },
  '䷐': { name: '随', title: '泽雷随', text: '随，元亨利贞，无咎。' },
  '䷑': { name: '蛊', title: '山风蛊', text: '蛊，元亨，利涉大川。先甲三日，后甲三日。' },
  '䷒': { name: '临', title: '地泽临', text: '临，元亨利贞。至于八月有凶。' },
  '䷓': { name: '观', title: '风地观', text: '观，盥而不荐，有孚颙若。' },
  '䷔': { name: '噬嗑', title: '火雷噬嗑', text: '噬嗑，亨。利用狱。' },
  '䷕': { name: '贲', title: '山火贲', text: '贲，亨。小利有攸往。' },
  '䷖': { name: '剥', title: '山地剥', text: '剥，不利有攸往。' },
  '䷗': { name: '复', title: '地雷复', text: '复，亨。出入无疾，朋来无咎。反复其道，七日来复，利有攸往。' },
  '䷘': { name: '无妄', title: '天雷无妄', text: '无妄，元亨利贞。其匪正有眚，不利有攸往。' },
  '䷙': { name: '大畜', title: '山天大畜', text: '大畜，利贞。不家食吉，利涉大川。' },
  '䷚': { name: '颐', title: '山雷颐', text: '颐，贞吉。观颐，自求口实。' },
  '䷛': { name: '大过', title: '泽风大过', text: '大过，栋桡。利有攸往，亨。' },
  '䷜': { name: '坎', title: '坎为水', text: '习坎，有孚，维心亨。行有尚。' },
  '䷝': { name: '离', title: '离为火', text: '离，丽也。日月丽乎天，百谷草木丽乎土，重明以丽乎正，乃化成天下。' },
  '䷞': { name: '咸', title: '泽山咸', text: '咸，亨，利贞。取女吉。' },
  '䷟': { name: '恒', title: '雷风恒', text: '恒，亨。无咎，利贞。利有攸往。' },
  '䷠': { name: '遁', title: '天山遁', text: '遁，亨，小利贞。' },
  '䷡': { name: '大壮', title: '雷天大壮', text: '大壮，利贞。' },
  '䷢': { name: '晋', title: '火地晋', text: '晋，康候用锡马蕃庶，昼日三接。' },
  '䷣': { name: '明夷', title: '地火明夷', text: '明夷，利艰贞。' },
  '䷤': { name: '家人', title: '风火家人', text: '家人，利女贞。' },
  '䷥': { name: '睽', title: '火泽睽', text: '睽，小事吉。' },
  '䷦': { name: '蹇', title: '水山蹇', text: '蹇，难也。见险而止，利西南，不利东北。' },
  '䷧': { name: '解', title: '雷水解', text: '解，利西南。无所往，其来复吉。有攸往，夙吉。' },
  '䷨': { name: '损', title: '山泽损', text: '损，有孚。元吉，无咎，可贞。利有攸往。' },
  '䷩': { name: '益', title: '风雷益', text: '益，利有攸往，利涉大川。' },
  '䷪': { name: '夬', title: '泽天夬', text: '夬，扬于王庭，孚号有厉。告自邑，不利即戎，利有攸往。' },
  '䷫': { name: '姤', title: '天风姤', text: '姤，女壮，勿用取女。' },
  '䷬': { name: '萃', title: '泽地萃', text: '萃，聚也。顺以说，刚中而应，故聚也。' },
  '䷭': { name: '升', title: '地风升', text: '升，元亨。用见大人，勿恤。南征吉。' },
  '䷮': { name: '困', title: '泽水困', text: '困，亨，贞大人吉，无咎。有言不信。' },
  '䷯': { name: '井', title: '水风井', text: '井，改邑不改井，无丧无得。往来井井。沔至，亦未繘井，羸其瓶，凶。' },
  '䷰': { name: '革', title: '泽火革', text: '革，己日乃孚。元亨利贞，悔亡。' },
  '䷱': { name: '鼎', title: '火风鼎', text: '鼎，元吉，亨。' },
  '䷲': { name: '震', title: '震为雷', text: '震，亨。震来虩虩，笑言哑哑。震惊百里，不丧匕鬯。' },
  '䷳': { name: '艮', title: '艮为山', text: '艮其背，不获其身。行其庭，不见其人。无咎。' },
  '䷴': { name: '渐', title: '风山渐', text: '渐，女归吉，利贞。' },
  '䷵': { name: '归妹', title: '雷泽归妹', text: '归妹，征凶，无攸利。' },
  '䷶': { name: '丰', title: '雷火丰', text: '丰，亨，大吉。' },
  '䷷': { name: '旅', title: '火山旅', text: '旅，小亨，旅贞吉。' },
  '䷸': { name: '巽', title: '巽为风', text: '巽，小亨。利有攸往，利见大人。' },
  '䷹': { name: '兑', title: '兑为泽', text: '兑，亨，利贞。' },
  '䷺': { name: '涣', title: '风水涣', text: '涣，亨。王假有庙，利涉大川，利贞。' },
  '䷻': { name: '节', title: '水泽节', text: '节，亨。苦节不可，贞。' },
  '䷼': { name: '中孚', title: '风泽中孚', text: '中孚，豚鱼吉。利涉大川，利贞。' },
  '䷽': { name: '小过', title: '雷山小过', text: '小过，亨，利贞。可小事，不可大事。' },
  '䷾': { name: '既济', title: '水火既济', text: '既济，亨，小利贞。初吉，终乱。' },
  '䷿': { name: '未济', title: '火水未济', text: '未济，亨。小狐汔济，濡其尾，无攸利。' }
};

// 六爻顺序（从初爻到上爻）
const yaoSequence = ['初爻', '二爻', '三爻', '四爻', '五爻', '上爻'];

// 生成随机卦象（基于当天和输入）
function generateHexagram(dateStr, chars) {
  // 使用日期和字符生成种子
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) {
    seed = ((seed << 5) - seed) + dateStr.charCodeAt(i);
  }
  for (let i = 0; i < chars.length; i++) {
    seed = ((seed << 5) - seed) + chars.charCodeAt(i);
  }

  // 线性同余随机数生成器
  const random = (() => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed;
  });

  // 生成六爻
  const lines = [];
  for (let i = 0; i < 6; i++) {
    // 奇数为阳，偶数为阴
    const isYang = random() % 2 === 1;
    const isChanging = random() % 4 === 0; // 20% 变爻概率
    lines.push({
      yang: isYang,
      changing: isChanging
    });
  }

  // 计算卦名
  // 简化：使用随机选择
  const hexagramKeys = Object.keys(hexagrams);
  const index = random() % hexagramKeys.length;
  const hexKey = hexagramKeys[index];

  return {
    symbol: hexKey,
    ...hexagrams[hexKey],
    lines: lines
  };
}

// 获取卦象符号
function getHexagramSymbol(name) {
  const keys = Object.keys(hexagrams);
  for (const key of keys) {
    if (hexagrams[key].name === name) {
      return key;
    }
  }
  return '䷿';
}

module.exports = {
  hexagrams,
  generateHexagram,
  getHexagramSymbol,
  yaoSequence
};