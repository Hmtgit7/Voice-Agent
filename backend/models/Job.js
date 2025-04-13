// models/Job.js
module.exports = (sequelize, DataTypes) => {
    const Job = sequelize.define('Job', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        requirements: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        available_slots: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: []
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'jobs',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Job;
};