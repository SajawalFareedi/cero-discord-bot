// const moment = require("moment");
// const Space = require("../cero-rpg/modules/Space");
// const Crypto = require("../cero-rpg/modules/Crypto");
// const Urban = require("../cero-rpg/modules/Urban");
// const GitHub = require("../cero-rpg/modules/Github");
// const maps = require("../cero-rpg/data/maps");
// const spells = require("../cero-rpg/data/globalSpells");
const enumHelper = require("../utils/enumHelper");
const { commandChannel } = require("../../settings");
const { infoLog } = require("../utils/logger");

const commands = [
  // RPG COMMANDS
  (help = {
    command: ["chelp", "ch"],
    operatorOnly: false,
    function: (params) => {
      const { messageObj } = params;
      const helpMsg = `You can private message me these commands except for checking other players!
cs, cstats <@Mention of player> - Sends a PM with the players stats (without < > and case-sensitive)
// ce, cequip - Sends a PM with your equipment
// ce, cequip <@Mention of player> - Sends a PM with the players equipment (without < > and case-sensitive)
cc, cchar, ccharacter - Sends PM with your stats and equipment
cc, cchar, ccharacter <@Mention of player> - Sends a PM with the players equipment and stats (without < > and case-sensitive)
// ccs, ccastspell - Lists spells available to cast
// ccs, ccastspell <spell> - Casts a global spell onto cero-rpg
// ct, ctitles - Lists current unlocked titles
// cel, ceventlog - Lists up to 15 past events
// cel, ceventlog <@Mention of player> - Lists up to 15 past events of mentioned player
// csb, cspellbook - Returns list of spells your character has learned
ci, cinv, cinventory - Displays what your character has in his/her inventory
cinvite - Sends you invite to the official server
// csetserver <Server ID> - Sets primary server (If your in more than one server that contains this bot).
cbugreport <Message> - Sends a bug report message to the official server.
cpatreon - Sends patreon link to show your support!`;
      messageObj.author.send(helpMsg, { split: true });
    },
  }),
  // (ping = {
  //   command: "cping",
  //   operatorOnly: false,
  //   function: (params) => {
  //     const { messageObj } = params;
  //     messageObj.reply("<:emoji_2:938819097536397423>");
  //   },
  // }),
  // Lists titles
  // (titles = {
  //   command: ["ct", "ctitles"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj } = params;
  //     return Game.fetchCommand({
  //       command: "listTitles",
  //       author: messageObj.author,
  //     });
  //   },
  // }),
  // Set title
  // (setTitle = {
  //   command: ["cst", "csettitle"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj } = params;
  //     if (!messageObj.content.includes(" ")) {
  //       return messageObj.author.send(
  //         "You must select a title to set. (eg. cst <title>)"
  //       );
  //     }

  //     const titleToSet = messageObj.content.split(/ (.+)/)[1];
  //     return Game.fetchCommand({
  //       command: "setTitle",
  //       author: messageObj.author,
  //       value: titleToSet,
  //     });
  //   },
  // }), 
  (character = {
    command: ["ccharacter", "cchar"],
    operatorOnly: false,
    // channelOnlyId: commandChannel,
    function: async (params) => {
      const { Game, Bot, messageObj } = params;
      if (messageObj.content.includes(" ")) {
        let checkPlayer = messageObj.content.split(/ (.+)/)[1];
        checkPlayer = checkPlayer.replace(/([\<\@\!\>])/g, "");
        const playerObj = await Bot.users.cache
          .filter((player) => player.id === checkPlayer && !player.bot)
          .array();
        if (
          playerObj.length === 0 &&
          process.env.NODE_ENV.includes("production")
        ) {
          messageObj.author.send(`${checkPlayer} was not found!`);
          return;
        } else if (process.env.NODE_ENV.includes("development")) {
          playerObj.push({
            id: checkPlayer,
          });
        }

        await Game.fetchCommand({
          command: "playerStats",
          author: messageObj.author,
          playerToCheck: playerObj[0],
        });
        return Game.fetchCommand({
          command: "playerEquipment",
          author: messageObj.author,
          playerToCheck: playerObj[0],
        });
      }

      await Game.fetchCommand({
        command: "playerStats",
        author: messageObj.author,
      });
      return Game.fetchCommand({
        command: "playerEquipment",
        author: messageObj.author,
      });
    },
  }),
  (inventory = {
    command: ["cinventory", "cinv", "ci"],
    operatorOnly: false,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, Bot, messageObj } = params;
      if (messageObj.content.includes(" ")) {
        let checkPlayer = messageObj.content.split(/ (.+)/)[1];
        checkPlayer = checkPlayer.replace(/([\<\@\!\>])/g, "");
        const playerObj = Bot.users.cache
          .filter((player) => player.id === checkPlayer && !player.bot)
          .array();
        if (
          playerObj.length === 0 &&
          process.env.NODE_ENV.includes("production")
        ) {
          messageObj.author.send(`${checkPlayer} was not found!`);
          return;
        } else if (process.env.NODE_ENV.includes("development")) {
          playerObj.push({
            id: checkPlayer,
          });
        }

        return Game.fetchCommand({
          command: "playerInventory",
          author: playerObj[0],
        }).then((playerInventory) => {
          if (!playerInventory) {
            return messageObj.author.send(
              "This players inventory was not found! This player probably was not born yet. Please be patient until destiny has chosen him/her."
            );
          }

          return Game.generateInventoryString(playerInventory).then((inv) =>
            messageObj.author.send(
              inv.replace(
                "Here is your inventory!",
                `Here is ${playerInventory.name}s inventory!`
              )
            )
          );
        });
      }

      Game.fetchCommand({
        command: "playerInventory",
        author: messageObj.author,
      }).then((playerInventory) => {
        if (!playerInventory) {
          return messageObj.author.send(
            "Your inventory was not found! You probably were not born yet. Please be patient until destiny has chosen you."
          );
        }

        Game.generateInventoryString(playerInventory).then((inv) =>
          messageObj.author.send(inv)
        );
      });
    },
  }),
  // (resetQuest = {
  //   command: ["cnewquest", "cnq"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: async (params) => {
  //     const { Game, messageObj } = params;
  //     const result = await Game.fetchCommand({
  //       command: "resetQuest",
  //       author: messageObj.author,
  //     });
  //     return messageObj.author.send(result);
  //   },
  // }),
  (stats = {
    command: ["cstats", "cs"],
    operatorOnly: false,
    // channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, Bot, messageObj } = params;
      let playerObj;

      if (messageObj.content.includes(" ")) {
        const checkPlayer = messageObj.content
          .split(/ (.+)/)[1]
          .replace(/(<[<@!>])/g, "");
        playerObj = Bot.users.cache.get(checkPlayer);
        if (!playerObj || playerObj.bot) {
          if (process.env.NODE_ENV.includes("production")) {
            return messageObj.author.send(`${checkPlayer} was not found!`);
          }
          playerObj = { id: checkPlayer };
        }
      }

      return Game.fetchCommand({
        command: "playerStats",
        author: messageObj.author,
        playerToCheck: playerObj,
      });
    },
  }),
  (equip = {
    command: ["cequip", "ce"],
    operatorOnly: false,
    // channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, Bot, messageObj } = params;
      let playerObj;

      if (messageObj.content.includes(" ")) {
        const checkPlayer = messageObj.content
          .split(/ (.+)/)[1]
          .replace(/(<[<@!>])/g, "");
        playerObj = Bot.users.cache.get(checkPlayer);
        if (!playerObj || playerObj.bot) {
          if (process.env.NODE_ENV.includes("production")) {
            return messageObj.author.send(`${checkPlayer} was not found!`);
          }
          playerObj = { id: checkPlayer };
        }
      }

      return Game.fetchCommand({
        command: "playerEquipment",
        author: messageObj.author,
        playerToCheck: playerObj,
      });
    },
  }),
  // (spellbook = {
  //   command: ["cspellbook", "csb"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, Bot, messageObj } = params;
  //     let playerObj;

  //     if (messageObj.content.includes(" ")) {
  //       const checkPlayer = messageObj.content
  //         .split(/ (.+)/)[1]
  //         .replace(/(<[<@!>])/g, "");
  //       playerObj = Bot.users.cache.get(checkPlayer);
  //       if (!playerObj || playerObj.bot) {
  //         if (process.env.NODE_ENV.includes("production")) {
  //           return messageObj.author.send(`${checkPlayer} was not found!`);
  //         }
  //         playerObj = { id: checkPlayer };
  //       }
  //     }

  //     return Game.fetchCommand({
  //       command: "playerSpellBook",
  //       author: messageObj.author,
  //       playerToCheck: playerObj,
  //     });
  //   },
  // }),
  // (lottery = {
  //   command: ["clottery"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, Bot, messageObj } = params;
  //     return Game.fetchCommand({
  //       command: "joinLottery",
  //       author: messageObj.author,
  //       Bot,
  //     });
  //   },
  // }),
  // (prizePool = {
  //   command: ["cprizepool"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj } = params;
  //     return Game.fetchCommand({
  //       command: "prizePool",
  //       author: messageObj.author,
  //     });
  //   },
  // }),
  // TODO: CREATE AND SETUP PATREON ACC
  (patreon = {
    command: ["cpatreon"],
    operatorOnly: false,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { messageObj } = params;
      messageObj.author.send(
        "If you would like to show your support you can become a patron!\
      \nKeep in mind that you gain no advantage from the others, this is purely to show your support to the developer!\
      \n<https://www.patreon.com/>"
      );
    },
  }),
  // (multi = {
  //   command: ["cmultiplier", "cmulti"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj } = params;
  //     return Game.fetchCommand({
  //       command: "checkMultiplier",
  //       author: messageObj.author,
  //     });
  //   },
  // }),
  // (setServer = {
  //   command: ["csetserver"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Bot, Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const messageSplit = messageObj.content.split(" ");
  //       const value = messageSplit[1].replace(/([\<\@\!\>])/g, "");
  //       const confirmation = messageSplit[2] === "true";
  //       return Game.fetchCommand({
  //         command: "setServer",
  //         author: messageObj.author,
  //         Bot,
  //         value,
  //         confirmation,
  //       });
  //     }

  //     return messageObj.author.send(
  //       "Please input server ID after the command. (ex: !setserver 11111111)"
  //     );
  //   },
  // }),
  // (map = {
  //   command: ["cmap", "cm"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { messageObj } = params;
  //     let mapInfo = "";
  //     maps.forEach((map) => {
  //       mapInfo = mapInfo.concat(
  //         `\n${map.name} (${map.biome.name}) Coordinates: ${map.coords}`
  //       );
  //     });

  //     messageObj.author.send(`\`\`\`Map of cero-rpg:\n${mapInfo}\`\`\``);
  //   },
  // }),
  // (lore = {
  //   command: "clore",
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitMessage = messageObj.content.split(/ (.+)/)[1].toLowerCase();
  //       const requestedMap = maps
  //         .filter((map) => map.name.toLowerCase() === splitMessage)
  //         .map((map) => map.lore);

  //       if (requestedMap.length === 0) {
  //         return messageObj.author.send(
  //           `${splitMessage} was not found. Did you type the map correctly?`
  //         );
  //       }

  //       return messageObj.author.send(
  //         `\`\`\`${splitMessage}: ${requestedMap[0]}\`\`\``
  //       );
  //     }

  //     return messageObj.author.send(
  //       "You must enter a map to retrieve its lore. Check `!help` for more info."
  //     );
  //   },
  // }),
  // TODO: CHANGE GIULD ID
  (bugreport = {
    command: "cbugreport",
    operatorOnly: false,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { messageObj, Bot } = params;
      if (messageObj.content.includes(" ")) {
        const report = messageObj.content.split(/ (.+)/)[1];
        const mainServer = Bot.guilds.cache.get("390509935097675777");
        if (
          mainServer.members.find(
            (member) => member.id === messageObj.author.id
          )
        ) {
          return messageObj.author.send(
            "Just send this in the bug reports channel. You're already in the official server"
          );
        }

        return mainServer.channels
          .find((channel) => channel.id === "392360791245848586")
          .send(`Bug Report:\n${report}`)
          .then((message) => {
            const guild = message.guild ? message.guild.name : "";
            const author = messageObj.author.id;
            infoLog.info({ type: "bugreport", from: author, guild, report });
            return messageObj.author.send(
              "Message has been sent to official server."
            );
          });
      }

      return messageObj.author.send(
        "You must have a message included in the bugreport."
      );
    },
  }),
  // (top10 = {
  //   command: "ctop10",
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj, guildId, Bot } = params;
  //     switch (
  //       messageObj.content.split(/ (.+)/)[1] === undefined
  //         ? "level"
  //         : messageObj.content.split(/ (.+)/)[1].toLowerCase()
  //     ) {
  //       case "gambles":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { gambles: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "stolen":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { stolen: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "stole":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { stole: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "gold":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { "gold.current": -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "spells":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { spellCast: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "events":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { events: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "bounty":
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { currentBounty: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       default:
  //         Game.fetchCommand({
  //           command: "top10",
  //           author: messageObj.author,
  //           type: { level: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //     }
  //   },
  // }),
  // (rank = {
  //   command: "crank",
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj, guildId, Bot } = params;
  //     switch (
  //       messageObj.content.split(/ (.+)/)[1] === undefined
  //         ? "level"
  //         : messageObj.content.split(/ (.+)/)[1].toLowerCase()
  //     ) {
  //       case "gambles":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { gambles: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "stolen":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { stolen: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "stole":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { stole: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "gold":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { "gold.current": -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "spells":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { spellCast: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "events":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { events: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       case "bounty":
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { currentBounty: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //       default:
  //         Game.fetchCommand({
  //           command: "getRank",
  //           author: messageObj.author,
  //           type: { level: -1 },
  //           guildId,
  //           Bot,
  //         });
  //         break;
  //     }
  //   },
  // }),
  // (castSpell = {
  //   command: ["ccastspell", "ccs"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Bot, Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const amount = messageObj.content.split(" ")[2];
  //       return Game.fetchCommand({
  //         Game,
  //         command: "castSpell",
  //         author: messageObj.author,
  //         Bot,
  //         amount: amount ? amount : 1,
  //         spell: messageObj.content.split(" ")[1].toLowerCase(),
  //       });
  //     }
  //     let spellsString = "```List of Spells:\n  ";
  //     spellsString = spellsString.concat(
  //       Object.keys(spells)
  //         .map(
  //           (spell) =>
  //             `${spell} - ${spells[spell].spellCost} gold - ${spells[spell].description}`
  //         )
  //         .join("\n  ")
  //     );

  //     return messageObj.author.send(spellsString.concat("```"));
  //   },
  // }),
  // (changeServerPrefix = {
  //   command: ["cprefix"],
  //   operatorOnly: false,
  //   serverOperatorOnly: true,
  //   function: async (params) => {
  //     const { Game, Bot, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitArray = messageObj.content.split(" ");
  //       let guildId;
  //       let newPrefix;

  //       if (splitArray.length === 3) {
  //         guildId = splitArray[1];
  //         newPrefix = splitArray[2];
  //       } else if (splitArray.length === 2) {
  //         if (messageObj.channel.type === "dm") {
  //           return messageObj.author.send(
  //             "You need to provide the guild id and a prefix in DM's"
  //           );
  //         }
  //         guildId = messageObj.guild.id;
  //         newPrefix = splitArray[1];
  //       } else {
  //         return messageObj.author.send(
  //           "Invalid amount of arguments. Check the help for more info."
  //         );
  //       }

  //       const guildToUpdate = Bot.guilds.cache.get(guildId);
  //       if (!guildToUpdate) {
  //         return messageObj.author.send("No guild found with this ID");
  //       }

  //       const memberToCheckPermission = guildToUpdate.members.cache.get(
  //         messageObj.author.id
  //       );
  //       if (!memberToCheckPermission) {
  //         return messageObj.author.send("You were not found within this guild");
  //       }

  //       if (!memberToCheckPermission.hasPermission("MANAGE_GUILD")) {
  //         return messageObj.author.send(
  //           "You do not have the permission to change the prefix for this guild"
  //         );
  //       }

  //       if (newPrefix === "") {
  //         return messageObj.author.send("Enter a non empty prefix");
  //       }

  //       if (newPrefix.includes("\n")) {
  //         return messageObj.author.send(
  //           "Please do not use line breaks inside the prefix"
  //         );
  //       }

  //       const result = await Game.fetchCommand({
  //         Bot,
  //         command: "modifyServerPrefix",
  //         author: messageObj.author,
  //         guildId: guildToUpdate.id,
  //         value: newPrefix,
  //       });
  //       if (result) {
  //         Game.getGuildCommandPrefix(guildToUpdate.id).prefix = newPrefix;
  //       } else {
  //         messageObj.author.send("An error occurred while updating the prefix");
  //       }
  //     }
  //   },
  // }),
  /**
   * places a bounty on a specific player for a specific amount should work with @playername and then a gold amount
   */
  // (placeBounty = {
  //   command: ["cbounty", "cb"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, Bot, messageObj } = params;
  //     const splitArray = messageObj.content.split(" ");
  //     if (messageObj.content.includes(" ") && splitArray.length === 3) {
  //       const recipient = splitArray[1].replace(/([\<\@\!\>])/g, "");
  //       const amount = splitArray[2];

  //       if (
  //         Number(amount) <= 0 ||
  //         Number(amount) % 1 !== 0 ||
  //         !amount.match(/^\d+$/)
  //       ) {
  //         return messageObj.author.send("Please use a regular amount of gold.");
  //       }
  //       if (Number(amount) < 100) {
  //         return messageObj.author.send(
  //           "You must place a bounty higher or equal to 100"
  //         );
  //       }
  //       if (!recipient.match(/^\d+$/)) {
  //         return messageObj.author.send("Please add a bounty to a player.");
  //       }
  //       if (recipient === messageObj.author.id) {
  //         return messageObj.author.send("You can't give yourself a bounty.");
  //       }
  //       return Game.fetchCommand({
  //         command: "placeBounty",
  //         author: messageObj.author,
  //         Bot,
  //         recipient,
  //         amount: Number(amount),
  //       });
  //     }

  //     return messageObj.author.send(
  //       "Please specify a player and amount of gold you wish to place on their head. You need to have enough gold to put on their head"
  //     );
  //   },
  // }),
  // (eventLog = {
  //   command: ["ceventlog", "cel"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: async (params) => {
  //     const { Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitCommand = messageObj.content.split(/ (.+)/);
  //       const result = await Game.fetchCommand({
  //         command: "playerEventLog",
  //         author: splitCommand[1].replace(/([\<\@\!\>])/g, ""),
  //         amount: 15,
  //       });
  //       if (!result || result.length === 0) {
  //         return messageObj.author.send(
  //           "This player has not activated any Events yet."
  //         );
  //       }
  //       return messageObj.author.send(`\`\`\`${result}\`\`\``, {
  //         split: { prepend: "```", append: "```" },
  //       });
  //     }

  //     const result = await Game.fetchCommand({
  //       command: "playerEventLog",
  //       author: messageObj.author.id,
  //       amount: 15,
  //     });
  //     if (!result || result.length === 0) {
  //       return messageObj.author.send("You have not activated any Events yet.");
  //     }

  //     return messageObj.author.send(`\`\`\`${result}\`\`\``, {
  //       split: { prepend: "```", append: "```" },
  //     });
  //   },
  // }),
  // (pvpLog = {
  //   command: ["cpvplog", "cpl"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: async (params) => {
  //     const { Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitCommand = messageObj.content.split(/ (.+)/);
  //       const result = await Game.fetchCommand({
  //         command: "playerPvpLog",
  //         author: splitCommand[1].replace(/([\<\@\!\>])/g, ""),
  //         amount: 15,
  //       });
  //       if (!result || result.length === 0) {
  //         return messageObj.author.send(
  //           "This player has not had any PvP Events yet."
  //         );
  //       }
  //       return messageObj.author.send(`\`\`\`${result}\`\`\``, {
  //         split: { prepend: "```", append: "```" },
  //       });
  //     }

  //     const result = await Game.fetchCommand({
  //       command: "playerPvpLog",
  //       author: messageObj.author.id,
  //       amount: 15,
  //     });
  //     if (!result || result.length === 0) {
  //       return messageObj.author.send("You have not had any PvP Events yet.");
  //     }

  //     return messageObj.author.send(`\`\`\`${result}\`\`\``, {
  //       split: { prepend: "```", append: "```" },
  //     });
  //   },
  // }),
  /**
   * Subscribe to PM messages
   */
  (privateMessage = {
    command: "cpm",
    operatorOnly: false,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, messageObj } = params;
      if (messageObj.content.includes(" ")) {
        const splitCommand = messageObj.content.split(/ (.+)/);
        switch (splitCommand[1].toLowerCase()) {
          case enumHelper.pmMode.on:
          case enumHelper.pmMode.off:
          case enumHelper.pmMode.filtered:
            return Game.fetchCommand({
              command: "modifyPM",
              author: messageObj.author,
              value: splitCommand[1].toLowerCase(),
            });
        }
      }

      return messageObj.author.send(`\`\`\`Possible options:
      on - You will be pmed in events that include you
      off - You won't be pmed in events that include you
      filtered - You will be pmed certain important events that include you
      \`\`\``);
    },
  }),
  /**
   * Modify if player will be @Mentioned in events
   */
  (modifyMention = {
    command: "cmention",
    operatorOnly: false,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, messageObj } = params;
      if (messageObj.content.includes(" ")) {
        const splitCommand = messageObj.content.split(/ (.+)/);

        // Use switch to validate the value
        switch (splitCommand[1].toLowerCase()) {
          case "on":
          case "off":
          case "action":
          case "move":
            return Game.fetchCommand({
              command: "modifyMention",
              author: messageObj.author,
              value: splitCommand[1].toLowerCase(),
            });
        }
      }

      return messageObj.author.send(`\`\`\`Possible options:
        on - You will be tagged in events that include you
        off - You won't be tagged in events that include you
        action - You will be tagged in action events that include you
        move - You will be tagged in move events that include you
        \`\`\``);
    },
  }),
  /**
   * Modify player's gender
   */
  (modifyGender = {
    command: "cgender",
    operatorOnly: false,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, messageObj } = params;
      if (messageObj.content.includes(" ")) {
        const splitCommand = messageObj.content.split(/ (.+)/);

        // Use switch to validate the value
        switch (splitCommand[1].toLowerCase()) {
          case "male":
          case "female":
          case "neutral":
          case "neuter":
            return Game.fetchCommand({
              command: "modifyGender",
              author: messageObj.author,
              value: splitCommand[1],
            });
        }
      }

      return messageObj.author.send(`\`\`\`Possible options:
        male
        female
        neutral
        neuter
        \`\`\``);
    },
  }),
  // (getStolenEquip = {
  //   command: ["cstolenequip", "cse"],
  //   operatorOnly: false,
  //   channelOnlyId: commandChannel,
  //   function: async (params) => {
  //     const { Game, messageObj, Bot } = params;
  //     const splitArray = messageObj.content.split(" ");
  //     let recipient;
  //     let header;
  //     if (messageObj.content.includes(" ") && splitArray.length === 2) {
  //       const playerId = splitArray[1].replace(/([\<\@\!\>])/g, "");
  //       const playerObj = await Bot.users.cache
  //         .filter((player) => player.id === playerId && !player.bot)
  //         .array();
  //       if (
  //         playerObj.length === 0 &&
  //         process.env.NODE_ENV.includes("production")
  //       ) {
  //         return messageObj.author.send(`${playerId} was not found!`);
  //       }
  //       recipient = await Game.Database.loadPlayer(playerId);
  //       header = `Here is ${recipient.name}'s stolen equipment!`;
  //     } else {
  //       recipient = await Game.Database.loadPlayer(messageObj.author.id);
  //       header = "Here is your stolen equipment!";
  //     }
  //     const stolenEquip = await Game.fetchCommand({
  //       command: "getStolenEquip",
  //       recipient,
  //     });
  //     if (stolenEquip) {
  //       return messageObj.author.send(`\`\`\`${header}\n${stolenEquip}\`\`\``);
  //     }
  //     return messageObj.author.send(
  //       `${
  //         messageObj.author.id === recipient.discordId
  //           ? "You have"
  //           : `${recipient.name} has`
  //       } no stolen equipment.`
  //     );
  //   },
  // }),
  // Bot Operator commands
  // (setPlayerBounty = {
  //   command: "csetbounty",
  //   operatorOnly: true,
  //   channelOnlyId: commandChannel,
  //   function: (params) => {
  //     const { Game, messageObj } = params;
  //     const splitArray = messageObj.content.split(" ");
  //     if (messageObj.content.includes(" ") && splitArray.length === 3) {
  //       const recipient = splitArray[1].replace(/([\<\@\!\>])/g, "");
  //       const amount = splitArray[2];
  //       Game.fetchCommand({
  //         command: "setPlayerBounty",
  //         recipient,
  //         amount: Number(amount),
  //       });
  //       return messageObj.author.send("Done");
  //     }
  //   },
  // }),
  (setPlayerGold = {
    command: "csetgold",
    operatorOnly: true,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, messageObj } = params;
      const splitArray = messageObj.content.split(" ");
      if (messageObj.content.includes(" ") && splitArray.length === 3) {
        const recipient = splitArray[1].replace(/([\<\@\!\>])/g, "");
        const amount = splitArray[2];
        Game.fetchCommand({
          command: "setPlayerGold",
          recipient,
          amount: Number(amount),
        });
        return messageObj.author.send("Done");
      }
    },
  }),
  // (holidaysCommands = {
  //   command: "choliday",
  //   operatorOnly: true,
  //   function: (params) => {
  //     const { Game, Bot, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitCommand = messageObj.content
  //         .split(" ")
  //         .map((e) => e.toLowerCase());
  //       switch (splitCommand[2]) {
  //         case "true":
  //         case "false":
  //           return Game.fetchCommand({
  //             command: "updateHoliday",
  //             Bot,
  //             author: messageObj.author,
  //             whichHoliday: splitCommand[1],
  //             isStarting: splitCommand[2] === "true",
  //           });
  //         default:
  //           return Game.fetchCommand({
  //             command: "sendPreEventMessage",
  //             Bot,
  //             author: messageObj.author,
  //             whichHoliday: splitCommand[1],
  //             whichMessage: splitCommand[2],
  //           });
  //       }
  //     }
  //   },
  // }),
  // Doesn't work for now.
  // (activateBlizzard = {
  //   command: "cblizzard",
  //   operatorOnly: true,
  //   function: (params) => {
  //     const { Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitCommand = messageObj.content.split(/ (.+)/);
  //       const blizzardBoolean = Game.blizzardSwitch(splitCommand[1]);
  //       switch (splitCommand) {
  //         case "on":
  //           messageObj.author.send(
  //             blizzardBoolean
  //               ? "Blizzard is already activated!"
  //               : "Blizzard activated."
  //           );
  //           break;
  //         case "off":
  //           messageObj.author.send(
  //             !blizzardBoolean
  //               ? "Blizzard is already deactivated!"
  //               : "Blizzard deactivated."
  //           );
  //           break;
  //       }
  //     }
  //   },
  // }),
  (giveGold = {
    command: "cgivegold",
    operatorOnly: true,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, messageObj } = params;
      if (
        messageObj.content.includes(" ") &&
        messageObj.content.split(" ").length > 2
      ) {
        const splitCommand = messageObj.content.split(" ");
        Game.fetchCommand({
          command: "giveGold",
          recipient: splitCommand[1],
          amount: splitCommand[2],
        });
        return messageObj.author.send("Done.");
      }
    },
  }),
  (resetPlayer = {
    command: "cresetplayer",
    operatorOnly: true,
    channelOnlyId: commandChannel,
    function: (params) => {
      const { Game, messageObj } = params;
      if (messageObj.content.includes(" ")) {
        Game.fetchCommand({
          command: "deletePlayer",
          recipient: messageObj.content.split(/ (.+)/)[1],
        });
        messageObj.author.send("Done.");
      }
    },
  }),
  // (resetLottery = {
  //   command: "cresetLottery",
  //   operatorOnly: true,
  //   function: (params) => {
  //     const { Bot, Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const guildId = messageObj.content.split(/ (.+)/)[1];
  //       const guild = Bot.guilds.cache.get(guildId);
  //       Game.fetchCommand({
  //         command: "resetLottery",
  //         author: messageObj.author,
  //         guildId,
  //         guild,
  //       });
  //     }
  //   },
  // }),
  // (removeLotteryPlayers = {
  //   command: "cresetLotteryPlayers",
  //   operatorOnly: true,
  //   function: (params) => {
  //     const { Bot, Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const guildId = messageObj.content.split(/ (.+)/)[1];
  //       const guild = Bot.guilds.cache.get(guildId);
  //       Game.fetchCommand({
  //         command: "resetLotteryPlayers",
  //         author: messageObj.author,
  //         guildId,
  //         guild,
  //       });
  //     }
  //   },
  // }),
  // (resetAll = {
  //   command: "cresetall",
  //   // channelOnlyId: commandChannel,
  //   function: async (params) => {
  //     const { Bot, Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const guildID = messageObj.content.split(/ (.+)/)[1];
  //       const guild = Bot.guilds.cache.get(guildID);
  //       if (!guild) {
  //         return messageObj.author.send("This guild does not exist.");
  //       }
  //       if (guild.owner.id !== messageObj.author.id) {
  //         return messageObj.author.send(
  //           "You're not the owner of this server. You do not have permission to reset this servers stats"
  //         );
  //       }
  //       return Game.fetchCommand({
  //         command: "resetPlayers",
  //         author: messageObj.author,
  //         Bot,
  //         guildId: guildID,
  //       });
  //     }
  //     return message.author.send("You must specify a guild id to reset.");
  //   },
  // }),
  // (aprilFools = {
  //   command: "caprilfools",
  //   operatorOnly: true,
  //   function: (params) => {
  //     const { Bot } = params;
  //     const aprilfools = Bot.guilds.cache
  //       .get(process.env.GUILD_ID)
  //       .members.filter(
  //         (player) =>
  //           (player.presence.status === "online" && !player.user.bot) ||
  //           (player.presence.status === "idle" && !player.user.bot) ||
  //           (player.presence.status === "dnd" && !player.user.bot)
  //       );
  //     aprilfools.forEach((player) =>
  //       player.send("Found a Mythical Alien Relic in Topscros Path")
  //     );
  //   },
  // }),
  (invite = {
    command: "cinvite",
    operatorOnly: false,
    function: (params) => {
      const { messageObj } = params;
      messageObj.author.send(
        "Official Server: <https://discord.gg/gK5fHk9UZw>"
      );
    },
  }),
  // MODULE COMMANDS
  // (giveEquipmentToPlayer = {
  //   command: "cgiveplayer",
  //   operatorOnly: true,
  //   function: async (params) => {
  //     const { Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const splitArray = messageObj.content.split(" ");
  //       const playerId = splitArray[1];
  //       const position = splitArray[2];
  //       const equipment = JSON.parse(
  //         splitArray.slice(3, splitArray.length).join(" ")
  //       );
  //       const player = Game.Database.loadPlayer(playerId);
  //       player.equipment[position] = equipment;
  //       await Game.savePlayer(player);
  //       messageObj.author.send("Done.");
  //     }
  //   },
  // }),
  // (randomRepo = {
  //   command: "cranrepo",
  //   function: async (params) => {
  //     const { Game, messageObj } = params;
  //     const repoList = await GitHub.randomRepo();
  //     const randomRepo = Game.randomChoice(repoList);
  //     messageObj.reply(
  //       `\nRepo: ${randomRepo.name}\nOwner: ${
  //         randomRepo.owner.login
  //       }\n${randomRepo.url.replace("api.", "").replace("/repos", "")}`
  //     );
  //   },
  // }),
  // nextLaunch = {
  //   command: '!nextlaunch',
  //   operatorOnly: false,
  //   function: async (params) => {
  //     const { messageObj } = params;
  //     const spaceInfo = await Space.nextLaunch();
  //     const nextLaunch = spaceInfo.launches[0];
  //     const codeBlock = '\`\`\`';
  //     let info = codeBlock;
  //     info += `${nextLaunch.provider}s ${nextLaunch.vehicle}`;
  //     info += `\nPayLoad: ${nextLaunch.payload}`;
  //     info += `\nLocation: ${nextLaunch.location}`;
  //     info += `\nLaunch Time: ${moment(nextLaunch.launchtime).utc('br')}`;
  //     info += `\nStream: ${nextLaunch.hasStream ? 'Yes' : 'No'}`;
  //     info += `\nDelayed: ${nextLaunch.delayed ? 'Yes' : 'No'}`;
  //     info += codeBlock;
  //     messageObj.reply(info);
  //   }
  // },

  // nextStreamlaunch = {
  //   command: '!nextstreamlaunch',
  //   operatorOnly: false,
  //   function: async (params) => {
  //     const { messageObj } = params;
  //     const spaceInfo = await Space.nextLaunch();
  //     let nextLaunch;
  //     for (let i = 0; i < spaceInfo.launches.length; i++) {
  //       if (spaceInfo.launches[i].hasStream) {
  //         nextLaunch = spaceInfo.launches[i];
  //         break;
  //       }
  //     }
  //     if (nextLaunch) {
  //       const codeBlock = '\`\`\`';
  //       let info = codeBlock;
  //       info += `${nextLaunch.provider}s ${nextLaunch.vehicle}`;
  //       info += `\nPayLoad: ${nextLaunch.payload}`;
  //       info += `\nLocation: ${nextLaunch.location}`;
  //       info += `\nLaunch Time: ${moment(nextLaunch.launchtime).utc('br')}`;
  //       info += `\nStream: ${nextLaunch.hasStream ? 'Yes' : 'No'}`;
  //       info += `\nDelayed: ${nextLaunch.delayed ? 'Yes' : 'No'}`;
  //       info += codeBlock;
  //       messageObj.reply(info);
  //     } else {
  //       messageObj.reply('Couldn\'t find next streamed launch.');
  //     }
  //   }
  // },

  // crypto = {
  //   command: '!crypto',
  //   operatorOnly: false,
  //   function: async (params) => {
  //     const { messageObj } = params;
  //     let currency = 'BRL';
  //     // https://coinmarketcap.com/api/#endpoint_ticker
  //     const validCurrencies = ['AUD', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PKR', 'PLN', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'ZAR', 'BTC', 'ETH', 'XRP', 'LTC', 'BCH'];
  //     if (messageObj.content.includes(' ')) {
  //       currency = messageObj.content.split(/ (.+)/)[1];
  //     }
  //     if (validCurrencies.indexOf(currency) === -1) {
  //       return messageObj.reply(`That\'s not a valid currency.\nValid currencies:\n${validCurrencies.join(', ')}`);
  //     }
  //     const cryptoInfo = await Crypto.top5(currency);
  //     const codeBlock = '\`\`\`';
  //     const currencyVar = `price_${currency.toLocaleLowerCase()}`;
  //     let info = codeBlock;
  //     cryptoInfo.forEach((c) => {
  //       info += `${c.name} (${c.symbol})`;
  //       info += `\nRank: ${c.rank}`;
  //       info += `\nUSD: ${c.price_usd}`;
  //       info += `\n${currency.toUpperCase()}: ${c[currencyVar]}`;
  //       info += `\nPercent Change 1h: ${c.percent_change_1h}%`;
  //       info += `\nPercent Change 24h: ${c.percent_change_24h}%`;
  //       info += `\nPercent Change 7d: ${c.percent_change_7d}%\n\n`;
  //     });
  //     info += codeBlock;
  //     messageObj.reply(info);
  //   }
  // },

  // (urban = {
  //   command: "curban",
  //   operatorOnly: false,
  //   function: async (params) => {
  //     const { Game, messageObj } = params;
  //     if (messageObj.content.includes(" ")) {
  //       const word = messageObj.content.split(/ (.+)/)[1].replace(/ /g, "%20");
  //       const result = await Urban.searchUrbanDictionary(word);
  //       if (result.list.length === 0) {
  //         return messageObj.reply(`${word} is not in the Urban Dictionary.`);
  //       }

  //       let definition = "Urban Dictionary Definition of ****\n```";
  //       const wordDefinition = result.list.sort((item1, item2) => {
  //         return item2.thumbs_up - item1.thumbs_up;
  //       })[0];
  //       definition = definition.replace(
  //         "****",
  //         `\`${Game.capitalizeFirstLetter(wordDefinition.word).replace(
  //           /%20/g,
  //           " "
  //         )}\``
  //       );

  //       return messageObj.reply(
  //         definition.concat(
  //           `Definition:\n${wordDefinition.definition}\n\nExample:\n${wordDefinition.example}\`\`\`\n[:thumbsup::${wordDefinition.thumbs_up} / :thumbsdown::${wordDefinition.thumbs_down}]`
  //         ),
  //         { split: true }
  //       );
  //     }

  //     return messageObj.reply("Please specify a word to look up.");
  //   },
  // }),
];
module.exports = commands;
