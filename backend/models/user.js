const db = require("../db");
const bcrypt = require("bcrypt");
const { hashPassword } = require("../utils/hash_password");

class User {
  static async add(ime, priimek, email, geslo, tip) {
    try {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(geslo, saltRounds);

      const id = email;
      const novUporabnik = {
        ime: ime,
        priimek: priimek,
        email: email,
        geslo: hashedPassword,
        tip: tip,
      };

      db.collection("Uporabniki").doc(id).set(novUporabnik);
      return { message: "Uspešna registracija", uporabnik: novUporabnik };
    } catch (error) {
      throw new Error(
        "Napaka pri dodajanju uporabnika v bazo: " + error.message
      );
    }
  }

  static async getAll() {
    try {
      const uporabnikiRef = db.collection("Uporabniki");
      const response = await uporabnikiRef.get();
      const uporabniki = [];
      response.forEach((doc) => {
        const uporabnik = {};
        uporabniki.push(doc.data());
      });

      return uporabniki;
    } catch (error) {
      throw new Error(
        "Napaka pri pridobivanju uporabnikov iz baze: " + error.message
      );
    }
  }

  static async getById(id) {
    try {
      const uporabnikRef = db.collection("Uporabniki").doc(id);
      const response = await uporabnikRef.get();
      const uporabnik = response.data();

      return uporabnik;
    } catch (error) {
      throw new Error(
        "Napaka pri pridobivanju uporabnika iz baze: " + error.message
      );
    }
  }

  static async put(id, updatedData) {
    try {
      const uporabnikRef = db.collection("Uporabniki").doc(id);
      const response = await uporabnikRef.get();
      const uporabnik = response.data();
      if (uporabnik == undefined) {
        throw new Error("Uporabnik ne obstaja");
      }

      if (updatedData.geslo) {
        updatedData.geslo = await hashPassword(updatedData.geslo);
      }

      const novUporabnik = {
        ...uporabnik,
        ...updatedData,
      };

      await db.collection("Uporabniki").doc(id).set(novUporabnik);

      return { message: "Uporabnik je uspešno posodobljen" };
    } catch (error) {
      throw new Error(
        "Napaka pri posodabljanju uporabnika v bazi: " + error.message
      );
    }
  }

  static async delete(id) {
    try {
      const uporabnikRef = db.collection("Uporabniki").doc(id);
      const response = await uporabnikRef.get();
      const uporabnik = response.data();
      if (uporabnik == undefined) {
        throw new Error("Uporabnik ne obstaja");
      }
      await db.collection("Users").doc(id).delete();

      return { message: "Uporabnik je bil izbrisan" };
    } catch (error) {
      throw new Error(
        "Napaka pri brisanju uporabnika iz baze: " + error.message
      );
    }
  }
}

module.exports = { User };
