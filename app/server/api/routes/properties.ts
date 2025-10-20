import { OpenAPIHono } from "@hono/zod-openapi";
import { docs } from "../open-api";

// Create the route definition

// Create the router and register the route
export const propertiesRoute = new OpenAPIHono()
  .openapi(docs.properties.get, async (c) => {
    return c.json(
      {
        message: "hello",
      },
      200,
    );
  })
  .openapi(docs.properties.getById, async (c) => {
    return c.json(
      {
        property: "123",
      },
      200,
    );
  });

// TODO: Add more routes
// get a property by id
// create a property
// update a property
// delete a property
// view user's properties (paginated)
