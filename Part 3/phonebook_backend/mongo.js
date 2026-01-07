const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const new_name = process.argv[3] ?? null;
const new_phone = process.argv[4] ?? null;

// Add a DB name: phonebook
const url = `mongodb+srv://fullstack:${password}@clusterfso.oekfcyf.mongodb.net/phonebook?retryWrites=true&w=majority&appName=ClusterFSO`;

mongoose.set("strictQuery", false);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});
const Person = mongoose.model("PB", personSchema);

async function main() {
  try {
    await mongoose.connect(url, {
      family: 4,
      serverSelectionTimeoutMS: 20000,
    });

    if (!new_name && !new_phone) {
      console.log("phonebook:");
      const persons = await Person.find({});
      persons.forEach((p) => console.log(`${p.name} ${p.number}`));
    } else {
      const person = new Person({ name: new_name, number: new_phone });
      await person.save();
      console.log(`added ${new_name} number ${new_phone} to phonebook`);
    }
  } catch (err) {
    console.error("Mongo error:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

main();
