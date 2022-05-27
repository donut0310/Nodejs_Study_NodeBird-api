import Sequelize from "sequelize";

export class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        email: {
          type: Sequelize.STRING(40),
          allowNull: true,
          unique: true,
        },
        nick: {
          type: Sequelize.STRING(15),
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        provider: {
          type: Sequelize.STRING(10),
          allowNull: false,
          defaultValue: "local",
        },
        snsId: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true, // true => createdAt, updateAt, deletedAt 자동생성
        underscored: false,
        modelName: "User",
        tableName: "users",
        paranoid: true,
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }

  static associate(db) {
    db.User.hasMany(db.Post); // User <=> Post 1:N
    db.User.belongsToMany(db.User, {
      // User <=> User N:M
      foreignKey: "followingId",
      as: "Followers", // 같은 테이블 간의 N:M관계에서 필요, foreingKye와 반대되는 모델을 가리킴
      through: "Follow", // 테이블간 관계 사이에 자동으로 생성할 모델 이름
    });
    db.User.belongsToMany(db.User, {
      foreignKey: "followerId",
      as: "Followings",
      through: "Follow",
    });
    db.User.hasMany(db.Domain);
  }
}
