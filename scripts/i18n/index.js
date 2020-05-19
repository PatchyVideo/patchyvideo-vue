const split = require("./spliti18n");
const sync = require("./synci18n");

const args = process.argv.splice(2);
try {
  switch (args[0]) {
    case "split": {
      split();
      break;
    }
    case "sync": {
      if (args.length != 3) throw new Error("invalid args.");
      sync(args[1], args[2]);
      break;
    }
    default:
      throw new Error("Unknown/Empty method.");
  }
} catch (e) {
  console.error(e.toString());
  console.log(`
PatchyVideo FrontEnd i18n -- help
- split: split i18n from vue files.
- sync [from] [to]: sync one language to another.
  - Example: sync CHS CHT`);
}
