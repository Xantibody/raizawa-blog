declare module "virtual:git-timestamps" {
  const timestamps: Record<string, { createdAt: string; updatedAt: string }>;
  export default timestamps;
}
