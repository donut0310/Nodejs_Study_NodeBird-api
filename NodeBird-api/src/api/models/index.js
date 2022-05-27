// Package Modules
import Sequelize from "sequelize";

// Custom Modules
import { User } from "./user.js";
import { Post } from "./post.js";
import { Hashtag } from "./hashtag.js";
import { Domain } from "./domain.js";
import Config from "../config/config.js";

const env = process.env.NODE_ENV || "development";
const config = Config[env];

export const db = {};
export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;
db.Domain = Domain;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);
Domain.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);
Domain.associate(db);

export default db;
