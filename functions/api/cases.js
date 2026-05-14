const DEFAULT_CASES = [
  { id: 'coast', name: '滨海景观公园', tag: '热门', meta: '12 张幻灯片 · 含平面图 · 含效果图', img: 'assets/tmpl-coast.jpg' },
  { id: 'playground', name: '儿童友好乐园', tag: '精选', meta: '10 张幻灯片 · 含色彩方案 · 含设施清单', img: 'assets/tmpl-playground.jpg' },
  { id: 'pocket', name: '城市口袋公园', tag: null, meta: '14 张幻灯片 · 含功能分析 · 含植物配置', img: 'assets/tmpl-pocket.jpg' },
  { id: 'commercial', name: '商业街区景观', tag: '新品', meta: '16 张幻灯片 · 含夜景方案 · 含铺装细节', img: 'assets/tmpl-commercial.jpg' },
  { id: 'community', name: '社区居住景观', tag: null, meta: '12 张幻灯片 · 含四季变化 · 含灌溉系统', img: 'assets/tmpl-community.jpg' },
  { id: 'wetland', name: '生态湿地修复', tag: '精选', meta: '18 张幻灯片 · 含生态分析 · 含水文设计', img: 'assets/tmpl-wetland.jpg' }
];

export async function onRequest({ request }) {
  // KV 绑定的变量名是全局变量，不是 env.LANDSCAPE_CASES
  let cases = DEFAULT_CASES;
  let source = 'default';

  try {
    if (typeof LANDSCAPE_CASES !== 'undefined') {
      // 强制刷新 KV 为最新数据
      await LANDSCAPE_CASES.put('cases', JSON.stringify(DEFAULT_CASES));
      const stored = await LANDSCAPE_CASES.get('cases', 'json');
      if (stored && Array.isArray(stored) && stored.length > 0) {
        cases = stored;
        source = 'kv';
      }
    }
  } catch (e) {
    source = 'fallback';
  }

  return new Response(JSON.stringify({ success: true, cases, source, count: cases.length }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=60'
    }
  });
}
