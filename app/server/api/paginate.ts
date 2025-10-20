import type { Pagination } from "~/lib/schemas/common/pagination";
import { tryCatch } from "~/lib/utils";

function encodeCursor(id: number) {
  return Buffer.from(`${id}`).toString("base64");
}

function decodeCursor(encodedCursor: string) {
  return parseInt(Buffer.from(encodedCursor, "base64").toString("utf-8"));
}

export async function paginate<
  T extends Record<string, unknown> & {
    id: number;
  },
>({
  input,
  getPage,
}: {
  input: Pagination & { filters?: Record<string, unknown> };
  getPage: (options: {
    cursor: number | undefined;
    pageSize: number;
  }) => Promise<Array<T>>;
}) {
  const { cursor: encodedCursor, ...rest } = input;

  const cursor = encodedCursor ? decodeCursor(encodedCursor) : undefined;

  const { data, error } = await tryCatch(getPage({ cursor, ...rest }));

  if (error) {
    console.error("Error getting page", error);
    throw error;
  }

  const hasNextPage = data.length > input.pageSize && !!data.pop();

  const nextCursor = hasNextPage
    ? encodeCursor(data[data.length - 1].id)
    : null;

  return {
    data: data,
    nextCursor,
  };
}
