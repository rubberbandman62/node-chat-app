const expect = require('expect');
const {describe, beforeEach, it} = require('mocha');
const {Users, Person} = require('./users');

let users;

describe('Users', () => {
    beforeEach(() => {
        users = new Users();
        users.users.push(new Person(1, 'name1', 'room1'));
        users.users.push(new Person(2, 'name2', 'room2'));
        users.users.push(new Person(3, 'name3', 'room1'));
        users.nextId = 4;
    });

    it('should add a user to the list of users', () => {
        users.addUser(new Person(undefined, 'newPerson', 'newRoom'));
        users.addUser(new Person(undefined, 'newPerson1', 'newRoom1'));
        expect(users.users.length).toBe(5);

        expect(users.users[3].id).toBe(4);
        expect(users.users[3].name).toBe('newPerson');
        expect(users.users[3].room).toBe('newRoom');

        expect(users.users[4].id).toBe(5);
        expect(users.users[4].name).toBe('newPerson1');
        expect(users.users[4].room).toBe('newRoom1');

        expect(users.nextId).toBe(6);
    });

    it('should remove the second user', () => {
        let user = users.removeUser(2);
        expect(users.users.length).toBe(2);
        expect(users.users[0].id).toBe(1);
        expect(users.users[1].id).toBe(3);
        expect(users.users[1].name).toBe('name3');
        expect(users.users[1].room).toBe('room1');
        expect(user).toEqual(new Person(2, 'name2', 'room2'));
    });

    it('should not remove a user', () => {
        let user = users.removeUser(99);
        expect(users.users.length).toBe(3);
        expect(user).toNotExist();
    });

    it('should return the second user', () => {
        let user = users.getUser(2);
        expect(user.name).toBe('name2');
        expect(user.room).toBe('room2');
    });

    it('should not return a user for non existing id', () => {
        let user = users.getUser(99);
        expect(user).toNotExist();
    });

    it('should return a list of two user names', () => {
        let userList = users.getUserList('room1');
        expect(userList.length).toBe(2);
        expect(userList).toEqual(['name1', 'name3']);
    });

    it('should return a list of one user name', () => {
        let userList = users.getUserList('room2');
        expect(userList.length).toBe(1);
        expect(userList).toEqual(['name2']);
    });

    it('should return an empty list for not existing rooms', () => {
        let userList = users.getUserList('room99');
        expect(userList.length).toBe(0);
    });
});

