import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "project-management" });

// inngest fuction to save user data to dataBase

const syncuserCreation = inngest.createFunction(
  { id: `sync-user-from-clerk` },
  { event: `clerk/user.created` },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.create({
      data: {
        id: data.id,
        email: data?.email_addresses[0]?.email_addres,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

// inngest fuction to delete user data to dataBase

const syncuserDeletion = inngest.createFunction(
  { id: `delete-user-with-clerk` },
  { event: `clerk/user.deleted` },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  }
);

// inngest fuction to update user data to dataBase

const syncuserUpdation = inngest.createFunction(
  { id: `update-user-with-clerk` },
  { event: `clerk/user.updated` },
  async ({ event }) => {
    const { data } = event;
    await prisma.user.update({
      where: { id: data.id },
      data: {
        email: data?.email_addresses[0]?.email_address,
        name: data?.first_name + " " + data?.last_name,
        image: data?.image_url,
      },
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [syncuserCreation, syncuserDeletion, syncuserUpdation];
