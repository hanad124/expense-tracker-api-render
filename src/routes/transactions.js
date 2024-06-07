import { Router } from "express";

import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactions,
  getTransaction,
  getTransactionsByCategory,
} from "../controllers/transactions.js";

import { isAuthenticated } from "../middlewares/authMiddleware.js";

const transactionRouter = Router();

transactionRouter.post("/", isAuthenticated, createTransaction);
transactionRouter.patch("/:id", isAuthenticated, updateTransaction);
transactionRouter.delete("/:id", isAuthenticated, deleteTransaction);
transactionRouter.get("/", isAuthenticated, getTransactions);
transactionRouter.get("/:id", isAuthenticated, getTransaction);
transactionRouter.get(
  "/category/:id",
  isAuthenticated,
  getTransactionsByCategory
);

export { transactionRouter };
