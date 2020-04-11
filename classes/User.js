class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    get get_username() {
        return this.username;
    }

    get get_email() {
        return this.email;
    }

    set set_username(username) {
        this.username = username;
    }

    set set_email(email) {
        this.email = email;
    }

}

module.exports = User;