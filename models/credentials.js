const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, // Ensures email is unique
        required: true, // Requires email field
    },
    password: {
        type: String,
        required: true, // Requires password field
    }
});

const CredentialsModel = mongoose.model('Credentials', userSchema);

module.exports = CredentialsModel;
