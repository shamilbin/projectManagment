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
        email: data?.email_addresses[0]?.email_address,
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

//  inngest fuction to save workspace data to database

const syncWorkspaceCreation = inngest.createFunction(
  { id: `sync-workspace-from-clerk` },
  { event: `clerk/organisation.created` },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url,
      },
    });

    //  add creator as admin member
    await prisma.workspaceMember.create({
      data: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  }
);
// inngest fuction to update workspace data in database

const syncWorkspaceUpdation = inngest.createFunction(
  { id: `update-workspace-from-clerk` },
  { event: `clerk/organisation.updated` },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url,
      },
    });
  }
);

// inngest fuction to delete workspace data in database

const syncWorkspaceDeletion = inngest.createFunction(
  { id: `delete-workspace-from-clerk` },
  { event: `clerk/organisation.deleted` },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspace.delete({
      where: {
        id: data.id,
      },
    });
  }
);
// inngest fuction to save workspace member data in database

const syncWorkspaceMemberCreation = inngest.createFunction(
  { id: `sync-workspace-member-from-clerk` },
  { event: `clerk/organisationInvitation.accepted` },
  async ({ event }) => {
    const { data } = event;
    await prisma.workspaceMember.create({
      data: {
        userId: data.user_id,
        workspaceId: data.organisation_id,
        role: String(data.role_name).toUpperCase(),
      },
    });
  }
);

// Create an empty array where we'll export future Inngest functions
export const functions = [
  syncuserCreation,
  syncuserDeletion,
  syncuserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceUpdation,
  syncWorkspaceDeletion,
  syncWorkspaceMemberCreation,
];
