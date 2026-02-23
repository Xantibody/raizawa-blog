export default function UpdatedAt({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) {
  const createdDate = new Date(createdAt).toLocaleDateString("ja-JP");
  const updatedDate = new Date(updatedAt).toLocaleDateString("ja-JP");
  if (updatedDate === createdDate) {
    return <></>;
  }
  return (
    <span>
      {" "}
      (更新: <time>{updatedDate}</time>)
    </span>
  );
}
