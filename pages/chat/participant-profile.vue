<template>
	<view class="page">
		<view v-if="viewKind === 'self'" class="card">
			<view class="head">
				<view class="avatar-wrap">
					<text class="avatar-text">{{ selfLetter }}</text>
				</view>
				<view class="head-main">
					<text class="name">{{ selfDisplayName }}</text>
					<text class="sub">{{ selfPhone }}</text>
				</view>
			</view>
			<view class="meta-block">
				<text class="lab">说明</text>
				<text class="val multiline">这是你在各会话中展示的资料；昵称与「我的」中个人资料一致。</text>
			</view>
		</view>

		<view v-else-if="viewKind === 'agent' && agent" class="card">
			<view class="head">
				<view class="avatar-wrap agent">
					<text class="avatar-text">{{ agentLetter }}</text>
				</view>
				<view class="head-main">
					<text class="name">{{ agent.name }}</text>
					<text class="sub role-line">{{ agent.role }}</text>
				</view>
			</view>

			<view class="section-t">性格与风格</view>
			<view class="meta-block">
				<text class="lab">性格关键词</text>
				<text class="val multiline">{{ agent.personality || "—" }}</text>
			</view>
			<view class="meta-block">
				<text class="lab">回复风格</text>
				<text class="val">{{ agent.replyStyle || "—" }}</text>
			</view>
			<view class="meta-block">
				<text class="lab">爱好 / 口头禅</text>
				<text class="val multiline">{{ agent.hobbies || "—" }}</text>
			</view>

			<view class="section-t">能力与经历</view>
			<view class="meta-block">
				<text class="lab">岗位 / 职责</text>
				<text class="val multiline">{{ agent.role }}</text>
			</view>
			<view class="meta-block">
				<text class="lab">项目经历摘要</text>
				<text class="val multiline">{{ agent.experience || "—" }}</text>
			</view>

			<view class="section-t">其他</view>
			<view class="meta-block">
				<text class="lab">性别（展示）</text>
				<text class="val">{{ agent.gender || "—" }}</text>
			</view>
			<view class="meta-block">
				<text class="lab">补充说明</text>
				<text class="val multiline">{{ agent.remark || "—" }}</text>
			</view>
		</view>

		<view v-else-if="viewKind === 'basic'" class="card basic-card">
			<view class="head solo">
				<view class="avatar-wrap plain">
					<text class="avatar-text">{{ basicLetter }}</text>
				</view>
				<text class="name center">{{ basicTitle }}</text>
			</view>
			<text class="hint">{{ basicHint }}</text>
		</view>

		<view v-else class="empty">
			<text>未找到该成员资料</text>
		</view>
	</view>
</template>

<script>
	import { getDigitalAgentById } from "@/utils/virtualTeamStore";
	import { getUserInfo } from "@/utils/index";

	export default {
		data() {
			return {
				viewKind: "",
				agent: null,
				user: {},
				basicTitle: "",
				basicHint: "",
			};
		},
		computed: {
			selfDisplayName() {
				const u = this.user || {};
				return u.nickname || u.name || u.username || u.phone || u.mobile || "我";
			},
			selfLetter() {
				const n = this.selfDisplayName;
				return n && n.length ? String(n).slice(0, 1) : "我";
			},
			selfPhone() {
				const p = this.user.phone || this.user.mobile || "";
				if (!p || String(p).length < 7) return "手机号未绑定或未展示";
				const s = String(p);
				return `${s.slice(0, 3)}****${s.slice(-4)}`;
			},
			agentLetter() {
				const n = (this.agent && this.agent.name) || "?";
				return String(n).slice(0, 1);
			},
			basicLetter() {
				const n = this.basicTitle || "?";
				return String(n).slice(0, 1);
			},
		},
		onLoad(options) {
			const kind = (options && options.kind) || "basic";
			this.viewKind = kind;
			if (kind === "self") {
				this.user = getUserInfo() || {};
				return;
			}
			if (kind === "agent") {
				const id = options.id ? decodeURIComponent(options.id) : "";
				this.agent = getDigitalAgentById(id);
				return;
			}
			this.basicTitle = options.title ? decodeURIComponent(options.title) : "联系人";
			this.basicHint = options.hint ? decodeURIComponent(options.hint) : "";
			if (options.workflowTitle || options.threadTitle) {
				const a = options.workflowTitle ? decodeURIComponent(options.workflowTitle) : "";
				const b = options.threadTitle ? decodeURIComponent(options.threadTitle) : "";
				const extra = [a, b].filter(Boolean).join(" · ");
				if (extra) {
					this.basicHint = this.basicHint ? `${this.basicHint}\n${extra}` : extra;
				}
			}
		},
	};
</script>

<style scoped>
	.page {
		min-height: 100vh;
		background: #f1f5f9;
		padding: 28rpx;
		box-sizing: border-box;
	}

	.card {
		background: #fff;
		border-radius: 24rpx;
		padding: 36rpx 28rpx;
		box-shadow: 0 4rpx 24rpx rgba(15, 23, 42, 0.06);
	}

	.head {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-bottom: 32rpx;
	}

	.head.solo {
		flex-direction: column;
		align-items: center;
		margin-bottom: 24rpx;
	}

	.head.solo .name.center {
		text-align: center;
		margin-top: 16rpx;
	}

	.avatar-wrap {
		width: 120rpx;
		height: 120rpx;
		border-radius: 24rpx;
		background: linear-gradient(145deg, #3b82f6, #2563eb);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.avatar-wrap.agent {
		background: linear-gradient(145deg, #8b5cf6, #6366f1);
	}

	.avatar-wrap.plain {
		background: linear-gradient(145deg, #64748b, #475569);
	}

	.avatar-text {
		font-size: 48rpx;
		font-weight: 700;
		color: #fff;
	}

	.head-main {
		margin-left: 28rpx;
		flex: 1;
		min-width: 0;
	}

	.head.solo .head-main {
		margin-left: 0;
	}

	.name {
		font-size: 38rpx;
		font-weight: 700;
		color: #0f172a;
		display: block;
	}

	.sub {
		font-size: 26rpx;
		color: #64748b;
		margin-top: 10rpx;
		display: block;
	}

	.role-line {
		color: #6366f1;
		font-weight: 500;
	}

	.section-t {
		font-size: 26rpx;
		font-weight: 600;
		color: #475569;
		margin: 28rpx 0 16rpx;
	}

	.meta-block {
		margin-bottom: 24rpx;
	}

	.lab {
		font-size: 24rpx;
		color: #94a3b8;
		display: block;
		margin-bottom: 8rpx;
	}

	.val {
		font-size: 30rpx;
		color: #334155;
		line-height: 1.55;
	}

	.val.multiline {
		white-space: pre-wrap;
		word-break: break-word;
	}

	.basic-card .hint {
		font-size: 28rpx;
		color: #64748b;
		line-height: 1.55;
		white-space: pre-wrap;
		display: block;
		text-align: center;
	}

	.empty {
		padding: 80rpx 24rpx;
		text-align: center;
		color: #94a3b8;
		font-size: 28rpx;
	}
</style>
