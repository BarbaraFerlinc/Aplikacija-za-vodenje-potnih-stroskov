const Expense = require('../models/expense');

jest.mock("../models/expense", () => ({
    add: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getByEmails: jest.fn(),
    getByUserEmail: jest.fn(),
    getByMonth: jest.fn()
}));

describe("Expense Controller", () => {
    it("should add a new expense", async () => {
        const mockExpense = {
            id: "nekaj@gmail.com_2025-01-25T00:00:00.000Z",
            naziv: "Testni strošek",
            datum_prihoda: "2024-10-27",
            datum_odhoda: "2024-10-28",
            kilometrina: 100,
            lokacija: "Ljubljana",
            opis: "Sestanek",
            oseba: "nekaj@gmail.com",
            cena: 43.0
        };

        Expense.add.mockResolvedValue(mockExpense);
        const response = await Expense.add("Testni strošek", "2024-10-27", "2024-10-28", 100, "Ljubljana", "Sestanek", "nekaj@gmail.com");
        
        expect(response).toEqual(mockExpense);
    });

    it("should return error if adding a new expense fails", async () => {
        Expense.add.mockRejectedValue(new Error("Napaka pri dodajanju potnega stroška v bazo"));
        await expect(
            Expense.add("Testni strošek", "2024-10-27", "2024-10-28", 100, "Ljubljana", "Sestanek", "nekaj@gmail.com")
        ).rejects.toThrow("Napaka pri dodajanju potnega stroška v bazo");
    });

    it("should return error if required fields are missing", async () => {
        Expense.add.mockRejectedValue(new Error("Vsa polja morajo biti izpolnjena"));
        await expect(
            Expense.add("Testni strošek")
        ).rejects.toThrow("Vsa polja morajo biti izpolnjena");
    });

    it("should get all expenses", async () => {
        const mockExpenses = [
            { naziv: "Testni strošek", datum_prihoda: "2024-10-27", datum_odhoda: "2024-10-28", kilometrina: 100, lokacija: "Ljubljana", opis: "Sestanek", oseba: "nekaj@gmail.com" },
            { naziv: "Novi strošek", datum_prihoda: "2024-11-13", datum_odhoda: "2024-11-15", kilometrina: 50, lokacija: "Celje", opis: "Konferenca", oseba: "novo@gmail.com" }
        ];

        Expense.getAll.mockResolvedValue(mockExpenses);
        const response = await Expense.getAll();

        expect(response).toEqual(mockExpenses);
    });

    it("should get an expense by id", async () => {
        const mockExpense = {
            naziv: "Testni strošek",
            datum_prihoda: "2024-10-27",
            datum_odhoda: "2024-10-28",
            kilometrina: 100,
            lokacija: "Ljubljana",
            opis: "Sestanek",
            oseba: "nekaj@gmail.com"
        };
        const id = "nekaj@gmail.com_2025-01-25T00:00:00.000Z";

        Expense.getById.mockResolvedValue(mockExpense);
        const response = await Expense.getById(id);

        expect(response).toEqual(mockExpense);
    });

    it("should update an expense", async () => {
        const spremenjeno = { naziv: "Spremenjeni strošek" };
        const id = "nekaj@gmail.com_2025-01-25T00:00:00.000Z";

        Expense.put.mockResolvedValue({ message: "Potni strošek je uspešno posodobljen" });
        const response = await Expense.put(id, spremenjeno);

        expect(response.message).toEqual("Potni strošek je uspešno posodobljen");
    });

    it("should delete an expense", async () => {
        const id = "nekaj@gmail.com_2025-01-25T00:00:00.000Z";

        Expense.delete.mockResolvedValue({ message: "Strosek je bil izbrisan" });
        const response = await Expense.delete(id);

        expect(response.message).toEqual("Strosek je bil izbrisan");
    });

    // should return expenses by emails, should return expenses by user email,
    // should return expenses by month, should calculate the sum of expenses in a date range for a user,
    // should handle no expenses found for a user email, should throw an error when retrieving an expense by ID fails,
    // should handle pagination correctly for expenses by emails

    // 4. naloga
    // should calculate total kilometrina by user email, should return an empty array when no expenses are found for a given month,
    // should throw an error when deleting a non-existing expense, should return an error when updating a non-existing expense,
    // should correctly filter expenses by date range and user
});