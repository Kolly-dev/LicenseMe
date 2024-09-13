const express = require("express");
const dbconnection = require("./config/db");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 5000;
app.use(express.json({ extended: false }));

dbconnection();

app.use(cors());

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/companyprofiles", require("./routes/companyRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/discounts", require("./routes/discountRoutes"));
app.use("/api/commissions", require("./routes/commissionRoutes"));
app.use("/api/licenses", require("./routes/licenseRoutes"));

app.listen(PORT, () => console.info(`Server is running on port ${PORT}`));
