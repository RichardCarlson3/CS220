//Takes in a random int from 1 up to a certain number and displays the name(or alias if no name) of the random Game of Thrones character
//Also displays the first book the character appears in and asks if the user would like additional information on the book
//Things like the publisher, the country, and the # of pages(default)
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    const num = await rl.question("Enter a random number greater than 0 but not too big: ");
    const url = await fetch(`https://anapioficeandfire.com/api/characters/${num}`).then(res =>
      res.ok ? res.json() : Promise.reject(new Error(`${res.statusText}, try a different number`))
    );
    if (url.name !== "") console.log(`Congrats! Your Game of Thrones Character is ${url.name}`);
    else console.log(`Congrats! Your Game of Thrones Character is known as ${url.aliases[0]}`);
    const book = await fetch(url.books[0]).then(res =>
      res.ok ? res.json() : Promise.reject(new Error(`Error:${res.statusText}`))
    );
    console.log(`Their first appearance was in the book ${book.name}`);
    const info = await rl.question(
      "What would you like to know more about the book?(Publisher? Country? Number of Pages?)"
    );
    if (info === "Publisher") {
      console.log(book.publisher);
    } else if (info === "Country") console.log(book.country);
    else {
      console.log(`The number of pages in the book is ${book.numberOfPages}`);
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  } finally {
    rl.close();
  }
}
