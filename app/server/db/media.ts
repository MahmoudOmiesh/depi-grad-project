import type { MediaInsert } from "~/lib/schemas/queries/media";
import { db } from "./root";

export const _media = {
  mutations: {
    insert: async (media: MediaInsert) => {
      return db.media.create({
        data: media,
        select: {
          id: true,
        },
      });
    },
  },
};
