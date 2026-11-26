import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../db";
import { User } from "./User";

export class Pet extends Model<
  InferAttributes<Pet>,
  InferCreationAttributes<Pet>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare status: "lost" | "found";
  declare imageUrl: string;
  declare location: string;
  declare lat: number;
  declare lng: number;
  declare userId: number;
}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("lost", "found"),
      allowNull: false,
      defaultValue: "lost",
    },

    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: User,
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Pet",
    tableName: "pets",
    timestamps: false,
  },
);

User.hasMany(Pet, {
  foreignKey: "userId",
});

Pet.belongsTo(User, {
  foreignKey: "userId",
});
