// models/Candidate.js
module.exports = (sequelize, DataTypes) => {
    const Candidate = sequelize.define('Candidate', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true
            }
        },
        current_ctc: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        expected_ctc: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        notice_period: {
            type: DataTypes.INTEGER,  // in days
            allowNull: true
        },
        experience: {
            type: DataTypes.FLOAT,  // in years
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('new', 'contacted', 'scheduled', 'rejected', 'hired'),
            defaultValue: 'new'
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
        tableName: 'candidates',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return Candidate;
};