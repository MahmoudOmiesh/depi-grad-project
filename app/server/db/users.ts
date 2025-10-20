import type { UserGetPropertiesPage } from "~/lib/schemas/queries/users";
import { db } from "./root";

type UserGetPropertiesPageInternal = Omit<UserGetPropertiesPage, "cursor"> & {
  cursor: number | undefined;
};

export const _users = {
  queries: {
    getProperties: (
      userId: string,
      { cursor, pageSize }: UserGetPropertiesPageInternal,
    ) => {
      return db.property.findMany({
        where: { userId, id: { gt: cursor ?? 0 } },
        orderBy: { id: "asc" },
        take: pageSize + 1,
        omit: {
          propertyTypeId: true,
        },
        include: {
          propertyType: true,
          media: {
            where: {
              isPrimary: true,
            },
          },
          sellDetails: {
            omit: {
              propertyId: true,
            },
          },
          rentDetails: {
            omit: {
              propertyId: true,
            },
          },
        },
      });
    },
  },

  mutations: {
    deleteProperty: (userId: string, propertyId: number) => {
      return db.property.delete({
        where: { id: propertyId, userId },
        select: {
          id: true,
        },
      });
    },
  },
};
