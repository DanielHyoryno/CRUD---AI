import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const User = db.define('users', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,  // Add this line to store the image file path
}, {
    freezeTableName: true
});

export default User;

(async () => {
    await db.sync();
})();
