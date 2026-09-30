import { ProcessMiningEngine } from '../services/processMiningEngine.js';
import { PROCESS_MODELS_DATA } from '../db/processModelsData.js';
const engine = new ProcessMiningEngine();
export async function getProcessModels(req, res) {
    try {
        const list = PROCESS_MODELS_DATA.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            description: p.description,
            target_tat_minutes: p.target_tat_minutes,
            node_count: p.official_graph.nodes.length,
            edge_count: p.official_graph.edges.length
        }));
        res.json(list);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function getProcessGraph(req, res) {
    try {
        const modelId = req.query.workflow || 'W2_PAC_CLEARANCE';
        const graphData = await engine.getProcessGraph(modelId);
        res.json(graphData);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
export async function getHeatmap(req, res) {
    try {
        const heatmap = await engine.getDepartmentHourHeatmap();
        res.json(heatmap);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
