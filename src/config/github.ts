const GITHUB_CONFIG = {
  owner: "a1124575688",
  repo: "ExamStudy",
  path: "data.json",
  branch: "main",
  // 从构建环境变量读取，避免把 token 提交到仓库
  token: import.meta.env.VITE_GITHUB_TOKEN || "",
};

export default GITHUB_CONFIG;
