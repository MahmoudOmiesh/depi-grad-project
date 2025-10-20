import type { PropertiesGetPage } from "~/lib/schemas/queries/properties";
import { db } from "./root";

type PropertiesGetPageInternal = Omit<PropertiesGetPage, "cursor"> & {
  cursor: number | undefined;
};

export const _properties = {
  queries: {
    getPage: async ({
      cursor,
      pageSize,
      ...filters
    }: PropertiesGetPageInternal) => {
      return db.property.findMany({
        where: {
          id: {
            gt: cursor ?? 0,
          },
          ...(filters.title && { title: { contains: filters.title } }),
          ...(filters.propertyTypes && {
            propertyType: {
              name: {
                in: filters.propertyTypes,
              },
            },
          }),
          ...(filters.purpose && {
            purpose: {
              equals: filters.purpose,
            },
          }),
          ...(filters.governorates && {
            governorate: {
              in: filters.governorates,
            },
          }),
          ...(filters.city && {
            city: {
              contains: filters.city,
            },
          }),
          ...(filters.minPrice != null || filters.maxPrice != null
            ? {
                price: {
                  ...(filters.minPrice != null && { gte: filters.minPrice }),
                  ...(filters.maxPrice != null && { lte: filters.maxPrice }),
                },
              }
            : {}),
        },
        orderBy: {
          id: "asc",
        },
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

    getById: (id: number) => {
      return db.property.findUnique({
        where: {
          id,
        },
        omit: {
          propertyTypeId: true,
        },
        include: {
          propertyType: {
            include: {
              apartmentDetails: true,
              villaDetails: true,
              commercialDetails: true,
              landDetails: true,
            },
          },
          media: {
            orderBy: {
              order: "asc",
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
          user: true,
        },
      });
    },
  },
};
