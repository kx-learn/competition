import { loadDigitalAgents } from "./virtualTeamStore";

/**
 * 根据消息里的 senderName（可能含「张三（岗位）」）匹配本地数字员工。
 */
export function findAgentBySenderLabel(senderName) {
	if (!senderName || typeof senderName !== "string") return null;
	const agents = loadDigitalAgents();
	const t = senderName.trim();
	const strip = (s) =>
		s
			.replace(/（[^）]*）/g, "")
			.replace(/\([^)]*\)/g, "")
			.trim();
	const simple = strip(t);
	return (
		agents.find((a) => (a.name || "") === simple) ||
		agents.find((a) => (a.name || "") === t) ||
		agents.find((a) => t.includes(a.name)) ||
		null
	);
}
