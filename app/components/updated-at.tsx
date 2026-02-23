export default function UpdatedAt({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) {
  if (updatedAt === createdAt) {
    return <></>;
  }
  return (
    <span>
      {" "}
      (更新: <time>{new Date(updatedAt).toLocaleDateString("ja-JP")}</time>)
    </span>
  );
}
