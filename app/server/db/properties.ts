import type { PropertiesGetPage } from "~/lib/schemas/queries/properties";
import { db } from "./root";

type PropertiesGetPageInternal = Omit<PropertiesGetPage, "cursor"> & {
  cursor: number | undefined;
};

export const _properties = {
  queries: {
    getPage: async ({ cursor, pageSize }: PropertiesGetPageInternal) => {
      return db.property.findMany({
        where: {
          id: {
            gt: cursor ?? 0,
          },
        },
        orderBy: {
          id: "asc",
        },
        take: pageSize,
        omit: {
          propertyTypeId: true,
        },
      });
    },
  },
};
