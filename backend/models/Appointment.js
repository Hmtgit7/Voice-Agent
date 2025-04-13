// models/Appointment.js
module.exports = (sequelize, DataTypes) => {
    const Appointment = sequelize.define('Appointment', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        job_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'jobs',
                key: 'id'
            }
        },
        candidate_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'candidates',
                key: 'id'
            }
        },
        date_time: {
            type: DataTypes.DATE,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'rescheduled'),
            defaultValue: 'scheduled'
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
        tableName: 'appointments',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Appointment;
};