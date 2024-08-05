import { Command } from "#base";
import { ApplicationCommandType, ChatInputCommandInteraction, APIApplicationCommandOptionChoice } from "discord.js";

// Function to roll the dice
function rollDice(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
}

// Function to parse dice notation (e.g., 2d20)
function parseDiceNotation(diceNotation: string): { numberOfDice: number, sides: number } | null {
    const match = /^(\d+)d(\d+)$/.exec(diceNotation);
    if (!match) return null;

    const numberOfDice = parseInt(match[1], 10);
    const sides = parseInt(match[2], 10);

    if (![3, 5, 6, 10, 20, 100].includes(sides)) return null;

    return { numberOfDice, sides };
}

new Command({
    name: "r",
    description: "Roll dice (e.g., 2d20 for rolling two D20 dice) ⬆️",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'roll',
            description: 'Dice roll notation (e.g., 2d20)',
            type: 3, // STRING
            required: true,
        }
    ],
    async run(interaction: ChatInputCommandInteraction) {
        try {
        
            await interaction.deferReply();

         
            const rollNotation: string | null = interaction.options.getString('roll');

            if (!rollNotation) {
                await interaction.editReply({ content: "You must provide a dice to be rolled." });
                return;
            }

            const parsed = parseDiceNotation(rollNotation);
            if (!parsed) {
                await interaction.editReply({ content: "Invalid dice format. Use the following format as example (2d20)."});
                return;
            }

            const { numberOfDice, sides } = parsed;

            const results: number[] = [];
            for (let i = 0; i < numberOfDice; i++) {
                results.push(rollDice(sides));
            }

            const total = results.reduce((acc, curr) => acc + curr, 0);

            // Use editReply to update the deferred reply
            await interaction.editReply({ content: `You rolled: ${results.join(", ")} (Total: ${total}) on ${numberOfDice}d${sides}` });

        } catch (error) {
            console.error("Error handling command:", error);
            // Handle errors and send a reply if something goes wrong
            try {
                await interaction.editReply({ content: "An error occurred while processing your request." });
            } catch (editError) {
                console.error("Error editing reply after failure:", editError);
            }
        }
    },
});
