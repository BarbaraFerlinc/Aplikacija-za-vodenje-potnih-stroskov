const User = require('../models/user');

jest.mock("../models/user", () => ({
    add: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getByFullName: jest.fn(),
    getByEmail: jest.fn(),
}));

describe("User model tests", () => {
    it("should add a new user", async () => {
        const mockUser = {
            ime: "Janez",
            priimek: "Novak",
            email: "janez.novak@example.com",
            geslo: "geslo123",
            tip: "delavec"
        };

        User.add.mockResolvedValue(mockUser);
        const response = await User.add(mockUser);

        expect(response).toEqual(mockUser);
    });

    it("should return error if adding a new user fails", async () => {
        User.add.mockRejectedValue(new Error("Napaka pri dodajanju uporabnika v bazo"));
        await expect(
            User.add("Janez", "Novak", "janez.novak@example.com", "geslo123", "delavec")
        ).rejects.toThrow("Napaka pri dodajanju uporabnika v bazo");
    });

    it("should return error if required fields are missing", async () => {
        User.add.mockRejectedValue(new Error("Vsa polja morajo biti izpolnjena"));
        await expect(
            User.add("Janez", "Novak")
        ).rejects.toThrow("Vsa polja morajo biti izpolnjena");
    });

    it("should get all users", async () => {
        const mockUsers = [
            { ime: "Janez", priimek: "Novak", email: "janez.novak@example.com", tip: "delavec" },
            { ime: "Marko", priimek: "Horvat", email: "marko.horvat@example.com", tip: "delavec" }
        ];

        User.getAll.mockResolvedValue(mockUsers);
        const response = await User.getAll();

        expect(response).toEqual(mockUsers);
    });

    it("should get a user by id", async () => {
        const mockUser = {
            ime: "Janez",
            priimek: "Novak",
            email: "janez.novak@example.com",
            tip: "delavec"
        };
        const email = "janez.novak@example.com";

        User.getById.mockResolvedValue(mockUser);
        const response = await User.getById(email);

        expect(response).toEqual(mockUser);
    });

    it("should update a user", async () => {
        const spremenjeno = { priimek: "Horvat" };
        const email = "janez.novak@example.com";

        User.put.mockResolvedValue({ message: "Uporabnik je uspešno posodobljen" });
        const response = await User.put(email, spremenjeno);

        expect(response.message).toEqual("Uporabnik je uspešno posodobljen");
    });

    it("should delete a user", async () => {
        const email = "janez.novak@example.com";

        User.delete.mockResolvedValue({ message: "Uporabnik je bil izbrisan" });
        const response = await User.delete(email);

        expect(response.message).toEqual("Uporabnik je bil izbrisan");
    });

    it("should get a user with matching full name", async () => {
        const mockUsers = [
            { ime: "Janez", priimek: "Novak", email: "janez.novak@example.com", tip: "delavec" }
        ];
        const ime = "Janez";
        const priimek = "Novak";

        User.getByFullName.mockResolvedValue(mockUsers);
        const response = await User.getByFullName(ime, priimek);

        expect(response).toEqual(mockUsers);
    });

    it("should get empty array if there is no user with matching full name", async () => {
        const ime = "Janez";
        const priimek = "Novak";

        User.getByFullName.mockResolvedValue([]);
        const response = await User.getByFullName(ime, priimek);

        expect(response).toEqual([]);
    });

    it("should get a user by email", async () => {
        const mockUser = {
            ime: "Janez",
            priimek: "Novak",
            email: "janez.novak@example.com",
            tip: "delavec"
        };
        const email = "janez.novak@example.com";

        User.getByEmail.mockResolvedValue(mockUser);
        const response = await User.getByEmail(email);

        expect(response).toEqual(mockUser);
    });

    it("should get null if no user matches email", async () => {
        const email = "janez.novak@example.com";

        User.getByEmail.mockResolvedValue(null);
        const response = await User.getByEmail(email);

        expect(response).toBeNull();
    });
});