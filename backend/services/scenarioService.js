function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function getActiveScenario(userType) {
  return new Promise((resolve, reject) => {
    if (!global.db) return resolve(null);
    const query = `
      SELECT * FROM scenarios
      WHERE is_active = 1
        AND (? IS NULL OR target_user_type = ? OR target_user_type IS NULL)
      ORDER BY id DESC
      LIMIT 1
    `;
    global.db.get(query, [userType || null, userType || null], (err, row) => {
      if (err) reject(err);
      else resolve(row || null);
    });
  });
}

async function getFirstNodeId(userType) {
  const scenario = await getActiveScenario(userType);
  if (!scenario) return null;
  const nodes = safeParse(scenario.nodes, []);
  return nodes.length ? nodes[0].id : null;
}

async function getNextNodeId(userType, currentNodeId) {
  const scenario = await getActiveScenario(userType);
  if (!scenario) return null;
  const edges = safeParse(scenario.edges, []);
  const edge = edges.find(e => e.from === currentNodeId);
  return edge ? edge.to : null;
}

async function getScenarioNode(userType, nodeId) {
  const scenario = await getActiveScenario(userType);
  if (!scenario) return null;
  const nodes = safeParse(scenario.nodes, []);
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;
  return {
    question: node.question,
    options: node.options || [],
    answer_type: node.type || 'multiple_choice'
  };
}

module.exports = { getFirstNodeId, getNextNodeId, getScenarioNode };
