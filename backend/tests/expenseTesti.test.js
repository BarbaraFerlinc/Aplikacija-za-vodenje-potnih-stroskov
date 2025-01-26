const Expense = require('../models/expense');

jest.mock("../models/expense", () => ({
    add: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getByEmails: jest.fn(),
    getByUserEmail: jest.fn(),
    getByMonth: jest.fn(),
    getCenaSumByUser: jest.fn(),
    getKilometrinaSumByMonth: jest.fn(),
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

    // naloga 6
    it("should calculate the correct totalCena for a user", async () => {
        const email = "nekaj@gmail.com";
        const mockValues = [38.7, 430, 21.5, 51.6];
        const mockTotalCena = 541.8;

        Expense.getCenaSumByUser.mockResolvedValue({ email, totalCena: mockTotalCena });
        const response = await Expense.getCenaSumByUser(email);

        expect(response).toEqual({ email, totalCena: mockValues[0]+mockValues[1]+mockValues[2]+mockValues[3] });
    });

    it("should get totalCena as 0 if user has no expenses", async () => {
        const email = "nekaj@gmail.com";
        const mockTotalCena = 0;

        Expense.getCenaSumByUser.mockResolvedValue({ email, totalCena: 0 });
        const response = await Expense.getCenaSumByUser(email);

        expect(response).toEqual({ email, totalCena: mockTotalCena });
    });

    it("should return error if email is missing", async () => {
        Expense.getCenaSumByUser.mockRejectedValue(new Error("Parameter 'email' je obvezen."));
        await expect(
            Expense.getCenaSumByUser()
        ).rejects.toThrow("Parameter 'email' je obvezen.");
    });

    it("should return error if there is a database issue", async () => {
        Expense.getCenaSumByUser.mockRejectedValue(new Error("Error calculating total cena for user"));
        await expect(
            Expense.getCenaSumByUser("nekaj@gmail.com")
        ).rejects.toThrow("Error calculating total cena for user");
    });
    
    it("should get expenses by month", async () => {
        const mockExpenses = [
            { naziv: "Testni strošek", datum_prihoda: "2024-10-27", datum_odhoda: "2024-10-28", kilometrina: 100, lokacija: "Ljubljana", opis: "Sestanek", oseba: "nekaj@gmail.com" }
        ];
        const year = 2024;
        const month = 11;

        Expense.getByMonth.mockResolvedValue(mockExpenses);
        const response = await Expense.getByMonth(year, month, 12, 0);

        expect(response).toEqual(mockExpenses);
    });

    // naloga 7
    it("should calculate the correct totalKilometrina for a month for a usesr", async () => {
        const email = "nekaj@gmail.com";
        const year = 2024;
        const month = 10;
        const mockValues = [1000, 94];
        const mockTotalKilometrina = 1094;

        Expense.getKilometrinaSumByMonth.mockResolvedValue({ email, month: "2024-10", totalKilometrina: mockTotalKilometrina });
        const response = await Expense.getKilometrinaSumByMonth(email, year, month);

        expect(response).toEqual({ email, month: `${year}-${month}`, totalKilometrina: mockValues[0]+mockValues[1] });
    });

    it("should get totalKilometrina as 0 if user has no expenses in specific month", async () => {
        const email = "nekaj@gmail.com";
        const year = 2024;
        const month = 10;
        const mockTotalKilometrina = 0;

        Expense.getKilometrinaSumByMonth.mockResolvedValue({ email, month: "2024-10", totalKilometrina: 0 });
        const response = await Expense.getKilometrinaSumByMonth(email);

        expect(response).toEqual({ email, month: `${year}-${month}`, totalKilometrina: mockTotalKilometrina });
    });

    it("should return error if email is missing", async () => {
        Expense.getKilometrinaSumByMonth.mockRejectedValue(new Error("Vsa polja morajo biti izpolnjena"));
        await expect(
            Expense.getKilometrinaSumByMonth("nekaj@gmail.com", 2024)
        ).rejects.toThrow("Vsa polja morajo biti izpolnjena");
    });

    it("should return error if there is a database issue", async () => {
        Expense.getKilometrinaSumByMonth.mockRejectedValue(new Error("Error calculating total kilometrina"));
        await expect(
            Expense.getKilometrinaSumByMonth("nekaj@gmail.com", 2024, 10)
        ).rejects.toThrow("Error calculating total kilometrina");
    });

    it("should get expenses by emails", async () => {
        const mockExpenses = [
            { id: "nekaj@gmail.com_2025-01-25T00:00:00.000Z", naziv: "Testni strošek", datum_prihoda: "2024-10-27", datum_odhoda: "2024-10-28", kilometrina: 100, lokacija: "Ljubljana", opis: "Sestanek", oseba: "nekaj@gmail.com" }
        ];
        const emails = ["nekaj@gmail.com"];

        Expense.getByEmails.mockResolvedValue({ stroski: mockExpenses, totalItems: 1 });
        const response = await Expense.getByEmails(emails, 12, 1);

        expect(response.stroski).toEqual(mockExpenses);
        expect(response.totalItems).toBe(1);
    });
});