// import { DiscussionPopup } from "@contentstack/collab-sdk";
import React from "react";
import "@contentstack/venus-components/build/variables.css";

const Comp: React.FC = () => {
  const generateRandomUID = (offset: number) =>
    `${offset}-${Math.random().toString(36).substring(2, 10)}`;
  const mockLoadMoreMessages = (offset: number, limit: number) => {
    return Promise.resolve({
      count: 10,
      conversations: [
        {
          discussion_uid: "discussion-1",
          uid: `${offset}1`, // First comment fixed UID to perform update and delete
          to_users: [],
          to_roles: [],
          message: "First comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u3",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Second comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u2",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Third comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u2",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Fourth comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u2",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Fifth comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u2",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Sixth comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u2",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Seventh comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u2",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Eighth comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u1",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Ninth comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u1",
        },
        {
          discussion_uid: "discussion-1",
          uid: generateRandomUID(offset),
          to_users: [],
          to_roles: [],
          message: "Tenth comment",
          entry_uid: "entry-1",
          locale: "en-US",
          created_at: new Date().toISOString(),
          created_by: "u1",
        },
      ],
    });
  };

  const stackMetadata = {
    currentUser: {
      uid: "u3",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      username: "johndoe3",
      active: true,
    },
    users: [
      {
        uid: "u1",
        active: true,
        username: "johndoe",
        first_name: "John",
        last_name: "Doe",
        email: "john@example.com",
      },
      {
        uid: "u2",
        active: true,
        username: "janedoe",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
      },
      {
        uid: "u3",
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        username: "johndoe3",
        active: true,
      },
      {
        uid: "u4",
        active: false,
        username: "janedoe",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
      },
    ],
    roles: [
      {
        uid: "r1",
        name: "Admin",
      },
    ],
  };

  // Mock Data
  const activeDiscussion = {
    uid: "discussion-1",
    title: "Test Discussion",
    field: {
      uid: "example",
      path: "path",
      og_path: "path",
    },
  };
  return (
    // <DiscussionPopup
    //   onCreateComment={async (payload) => {
    //     // Implement the function to return ICommentResponse
    //     const response: any = {
    //       // populate the response object with appropriate values
    //     };
    //     return response;
    //   }}
    //   onEditComment={async (payload) => {
    //     // Implement the function to return ICommentResponse
    //     const response: any = {
    //       // populate the response object with appropriate values
    //     };
    //     return response;
    //   }}
    //   onDeleteComment={async (payload) => {
    //     // Implement the function to return ICommentResponse
    //     const response: any = {
    //       // populate the response object with appropriate values
    //     };
    //     return response;
    //   }}
    //   onClose={async () => {
    //     // Implement the function to handle close event
    //     const response: any = {
    //       // populate the response object with appropriate values
    //     };
    //     return response;
    //   }}
    //   onResolve={async (payload) => {
    //     // Implement the function to return ICommentResponse
    //     const response: any = {
    //       // populate the response object with appropriate values
    //     };
    //     return response;
    //   }}
    //   stackMetadata={stackMetadata}
    //   loadMoreMessages={mockLoadMoreMessages}
    //   activeDiscussion={activeDiscussion}
    //   setActiveDiscussion={() => {
    //     // Implement the function to set active discussion
    //   }}
    //   createNewDiscussion={async () => {
    //     // Implement the function to create new discussion
    //     const response: any = {
    //       // populate the response object with appropriate values
    //     };
    //     return response;
    //   }}
    // />
    <>hi</>
  );
};

export default Comp;
