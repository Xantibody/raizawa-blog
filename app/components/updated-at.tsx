import { isSameDay, toLocalDate } from "../lib/date";

export default function UpdatedAt({
  createdAt,
  updatedAt,
}: {
  createdAt: string;
  updatedAt: string;
}) {
  if (isSameDay(createdAt, updatedAt)) {
    return <></>;
  }
  return (
    <span>
      {" "}
      (更新: <time>{toLocalDate(updatedAt)}</time>)
    </span>
  );
}
