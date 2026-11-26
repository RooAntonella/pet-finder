import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

import { sequelize } from "../db";
import { Pet } from "./Pet";

export class Report extends Model<
  InferAttributes<Report>,
  InferCreationAttributes<Report>
> {
  declare id: CreationOptional<number>;
  declare petId: number;
  declare reporterName: string;
  declare reporterPhone: string;
  declare location: string;
  declare timestamp: CreationOptional<Date>;
}

Report.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    petId: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: Pet,
        key: "id",
      },
    },

    reporterName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    reporterPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Report",
    tableName: "reports",
    timestamps: false,
  },
);

Pet.hasMany(Report, {
  foreignKey: "petId",
});

Report.belongsTo(Pet, {
  foreignKey: "petId",
});
