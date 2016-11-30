class Users {
    constructor() {
        this.users = [];
        this.nextId = 1;
    }

    addUser(person) {
        if (!person.id) {
            person.id = this.nextId;
            this.nextId = this.nextId + 1;
        }
        this.users.push(person);
    }

    removeUser(id) {
        let user = this.users.filter(user => user.id === id)[0];

        if (user) {
            this.users = this.users.filter(user => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users
            .filter(user => user.id === id)[0];
    }

    getUserList(room) {
        return this.users
            .filter(user => user.room === room)
            .map(user => user.name);
    }
}

class Person {

    constructor(id, name, room) {
        this.id = id;
        this.name = name;
        this.room = room;
    }

    toString() {
        return `id: ${this.id} name: ${this.name} room: ${this.room}`
    }
}

module.exports = {Person, Users};
