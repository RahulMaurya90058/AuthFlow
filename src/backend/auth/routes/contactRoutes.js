import express from "express";

export const createContactRoutes = ({
  sendContactMessage,
}) => {
  if (!sendContactMessage) {
    throw new Error(
      "Contact controller is required"
    );
  }

  const router = express.Router();

  router.post(
    "/send",
    sendContactMessage
  );

  return router;
};