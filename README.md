# 艾宾浩斯学习系统

基于艾宾浩斯遗忘曲线的个人学习记录与复习提醒工具，使用 React + TypeScript + Vite 构建，可部署到 GitHub Pages。

## 功能

- 记录每日学习内容
- 自动生成艾宾浩斯复习节点（1、2、4、7、15、30 天）
- 每日复习看板与打卡
- 复习日历视图
- JSON 数据导出/导入备份
- LocalStorage 本地持久化

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## 部署到 GitHub Pages

1. 在 GitHub 新建仓库，例如 `ExamStudy`
2. 将代码推送到 `main` 分支
3. 打开仓库 Settings -> Pages -> Source，选择 GitHub Actions
4. GitHub Actions 会自动构建并部署到 `https://你的用户名.github.io/ExamStudy/`

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand
- React Router
- lucide-react
