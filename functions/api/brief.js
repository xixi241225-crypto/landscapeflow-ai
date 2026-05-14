export async function onRequest({ request }) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }
  const body = await request.json();
  const { projectName, projectType, area, style, goal } = body;

  const brief = `
【项目概况】
${projectName}定位为${projectType}项目，规划用地约 ${area} ㎡，整体设计语言遵循"${style}"美学逻辑。

【设计目标】
本项目核心目标为：${goal || '打造高品质城市公共空间'}。围绕这一目标，方案在功能策划、空间序列、植物配置、材料选型四个维度展开系统性设计。

【设计策略】
其一，以人群行为为驱动重组功能分区。其二，引入微气候调节策略，通过乔木阵列、水体降温、铺装透水提升场地全年舒适度。其三，植物配置遵循季相主题原则。其四，材料选型立足耐久性与本土性。

【创新点】
本方案在传统${projectType}设计逻辑基础上，叠加 AI 全流程辅助决策机制，通过 LandscapeFlow AI 工作台完成从踏勘解读到汇报成果的闭环输出。

—— 由 LandscapeFlow AI 自动生成
`.trim();

  return new Response(JSON.stringify({ success: true, brief, timestamp: Date.now() }), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' }
  });
}
