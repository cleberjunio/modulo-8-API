require("express-async-errors");
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError");

const express = require("express");

const routes = require("./routes");

migrationsRun();

const app = express();
app.use(express.json());
app.use(routes);

//Tratamento de Erros
app.use((error, req, res, next) => {
  //erro gerado no lado do cliente
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  //erro gerado no lado do servidor
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});
const PORT = 3333;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
