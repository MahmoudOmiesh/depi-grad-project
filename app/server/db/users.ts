import type { UserGetPropertiesPage } from "~/lib/schemas/queries/users";
import { db } from "./root";
import type { PropertyInsert } from "~/lib/schemas/queries/properties";

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
    createProperty: async (userId: string, property: PropertyInsert) => {
      return db.$transaction(async (tx) => {
        const { id: propertyTypeId } = await tx.propertyType.create({
          data: {
            name: property.propertyType.name,
            ...(property.propertyType.name === "APARTMENT" && {
              apartmentDetails: {
                create: {
                  subtype: property.propertyType.apartmentDetails.subtype,
                  bedrooms: property.propertyType.apartmentDetails.bedrooms,
                  bathrooms: property.propertyType.apartmentDetails.bathrooms,
                  furnished: property.propertyType.apartmentDetails.furnished,
                  level: property.propertyType.apartmentDetails.level,
                },
              },
            }),
            ...(property.propertyType.name === "VILLA" && {
              villaDetails: {
                create: {
                  subtype: property.propertyType.villaDetails.subtype,
                  bedrooms: property.propertyType.villaDetails.bedrooms,
                  bathrooms: property.propertyType.villaDetails.bathrooms,
                  furnished: property.propertyType.villaDetails.furnished,
                },
              },
            }),
            ...(property.propertyType.name === "COMMERCIAL" && {
              commercialDetails: {
                create: {
                  subtype: property.propertyType.commercialDetails.subtype,
                },
              },
            }),
            ...(property.propertyType.name === "LAND" && {
              landDetails: {
                create: {
                  subtype: property.propertyType.landDetails.subtype,
                },
              },
            }),
          },
          select: {
            id: true,
          },
        });

        const { id: propertyId } = await tx.property.create({
          data: {
            userId,
            // slug: slugify(property.title),
            slug: property.title,
            ownerName: property.ownerName,
            ownerPhone: property.ownerPhone,
            title: property.title,
            description: property.description,
            price: property.price,
            governorate: property.governorate,
            city: property.city,
            area: property.area,
            purpose: property.purpose,
            propertyTypeId,
            amenities: {
              set: property.amenities,
            },
            media: {
              connect: property.mediaIds.map((mediaId) => ({ id: mediaId })),
            },
          },
          select: {
            id: true,
          },
        });

        // create rent/sell details
        if (property.purpose === "RENT") {
          await tx.rentDetails.create({
            data: {
              deposit: property.rentDetails.deposit,
              insurance: property.rentDetails.insurance,
              rentFrequency: property.rentDetails.rentFrequency,
              propertyId,
            },
          });
        }

        if (property.purpose === "SELL") {
          await tx.sellDetails.create({
            data: {
              paymentMethod: property.sellDetails.paymentMethod,
              ...(property.sellDetails.paymentMethod === "INSTALLMENT" && {
                downPayment: property.sellDetails.downPayment,
              }),
              propertyId,
            },
          });
        }

        return { id: propertyId };
      });
    },
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
