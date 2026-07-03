const GITHUB_CONFIG = {
  owner: "a1124575688",
  repo: "ExamStudy",
  path: "data.json",
  branch: "main",
  // 从构建环境变量读取，避免把 token 提交到仓库
  token: import.meta.env.VITE_GITHUB_TOKEN || "",
};

// 线上调试：确认 token 是否被注入（不打印真实 token）
if (typeof window !== "undefined") {
  console.log("[GitHub Sync] token configured:", !!GITHUB_CONFIG.token);
}

export default GITHUB_CONFIG;
