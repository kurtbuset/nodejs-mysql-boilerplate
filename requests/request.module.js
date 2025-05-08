module.exports = (sequelize, DataTypes) => {
    const Request = sequelize.define('Request', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'pending'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });

    const RequestItem = sequelize.define('RequestItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        itemName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

    Request.associate = models => {
        Request.hasMany(models.RequestItem, {
            foreignKey: 'requestId',
            as: 'items',
            onDelete: 'CASCADE'
        });
        Request.belongsTo(models.Employee, { foreignKey: 'employeeId' });
    };

    RequestItem.associate = models => {
        RequestItem.belongsTo(models.Request, { foreignKey: 'requestId' });
    };

    // Attach sub-model to allow importing from a single file
    Request.RequestItem = RequestItem;

    return Request;
};