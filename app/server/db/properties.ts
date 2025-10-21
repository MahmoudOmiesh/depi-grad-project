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
          propertyType: {
            omit: {
              id: true,
            },
          },
          media: {
            where: {
              isPrimary: true,
            },
            omit: {
              propertyId: true,
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
            omit: {
              id: true,
            },
            include: {
              apartmentDetails: {
                omit: {
                  id: true,
                  propertyTypeId: true,
                },
              },
              villaDetails: {
                omit: {
                  id: true,
                  propertyTypeId: true,
                },
              },
              commercialDetails: {
                omit: {
                  id: true,
                  propertyTypeId: true,
                },
              },
              landDetails: {
                omit: {
                  id: true,
                  propertyTypeId: true,
                },
              },
            },
          },
          media: {
            orderBy: {
              order: "asc",
            },
            omit: {
              propertyId: true,
            },
          },
          sellDetails: {
            omit: {
              id: true,
              propertyId: true,
            },
          },
          rentDetails: {
            omit: {
              id: true,
              propertyId: true,
            },
          },
          user: true,
        },
      });
    },
  },
};
