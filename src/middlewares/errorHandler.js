const { Prisma } = require("@prisma/client");
const { z } = require("zod");

function errorHandler(err, req, res, next) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return res
          .status(400)
          .json({
            error: `${err.meta.target[0]} must be unique, this ${err.meta.target[0]} is already register`,
            details: err.meta,
          });
      case "P2025":
        return res.status(404).json({ error: "Record not found" });
      case "P2003":
        return res.status(400).json({ error: "Foreign key constraint failed" });
      default:
        return res.status(500).json({ error: "An unknown error occurred", details: err.message });
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: "Validation error", details: err.message });
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    return res.status(500).json({ error: "Prisma Client Rust panic error" });
  } else if (err instanceof z.ZodError) {
    const errorMessages = err.errors.map((e) => e.message);
    return res.status(400).json({ errors: errorMessages });
  } else {
    return res.status(500).json({ error: "An unknown error occurred" });
  }
}

module.exports = errorHandler;
