// models/Conversation.js
module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        candidate_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'candidates',
                key: 'id'
            }
        },
        transcript: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        entities_extracted: {
            type: DataTypes.JSONB,
            allowNull: true
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        tableName: 'conversations',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });

    return Conversation;
};