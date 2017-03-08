class Users {
    constructor() {
        this.users = [];
        this.names = new Set();
        this.rooms = new Map();
        this.nextId = 1;
    }

    addUser(person) {
        if (!person.id) {
            person.id = this.nextId;
            this.nextId = this.nextId + 1;
        }

        let name = person.name.toLowerCase();
        if (!this.names.has(name)) {
            this.users.push(person);

            // save unique unified names and rooms
            this.names.add(name);

            let room = person.room.toLowerCase();
            if (!this.rooms.has(room)) {
                this.rooms.set(room, person.room);
            }

            return true;
        }

        return false;
    }

    removeUser(id) {
        let user = this.users.filter(user => user.id === id)[0];

        if (user) {
            this.users = this.users.filter(user => user.id !== id);

            if (this.getUserList(user.room).length === 0) {
                this.rooms.delete(user.room.toLowerCase());
            }

            this.names.delete(user.name.toLowerCase());
        }

        return user;
    }

    getUser(id) {
        return this.users
            .filter(user => user.id === id)[0];
    }

    getUserList(room) {
        return this.users
            .filter(user => user.room.toLowerCase() === room.toLowerCase())
            .map(user => user.name);
    }

    getAllUserNames(room) {
        return this.users
            .map(user => user.name);
    }

    getRoomList() {
        return Array.from(this.rooms.values());
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
