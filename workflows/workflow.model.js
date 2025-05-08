module.exports = (sequelize, DataTypes) => {
    const Workflow = sequelize.define('Workflow', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        employeeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'),
            allowNull: false,
            defaultValue: 'pending'
        },
        details: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        actionBy: {
            type: DataTypes.STRING, 
            allowNull: true
        },
        actionDate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    Workflow.associate = models => {
        Workflow.belongsTo(models.Employee, { foreignKey: 'employeeId' });
    };

    return Workflow;
};