import { Command } from "#base";
import { ApplicationCommandType, } from "discord.js";
// Function to roll the dice
function rollDice(sides) {
    return Math.floor(Math.random() * sides) + 1;
}
// Define the roll command
new Command({
    name: "r",
    description: "Roll a dice (D3, D10, D20, D100) ⬆️",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'type',
            description: 'Type of dice to roll',
            type: 3, // STRING
            required: true,
            choices: [
                { name: 'D3', value: '3' },
                { name: 'D10', value: '10' },
                { name: 'D20', value: '20' },
                { name: 'D100', value: '100' }
            ]
        }
    ],
    async run(interaction) {
        try {
            // Acknowledge the interaction immediately
            await interaction.deferReply();
            // Get the dice type from the interaction options
            const diceType = interaction.options.getString('type');
            // Convert dice type to number
            const sides = Number(diceType);
            // Ensure valid number of sides
            if (![3, 10, 20, 100].includes(sides)) {
                throw new Error("Invalid dice type");
            }
            // Roll the dice
            const result = rollDice(sides);
            // Delay sending the final reply by 10 seconds
            setTimeout(async () => {
                try {
                    // Use editReply to update the deferred reply
                    await interaction.editReply({ content: `You rolled a ${result} on a D${sides}` });
                }
                catch (error) {
                    console.error("Error editing reply:", error);
                }
            }, 10000); // 10000 milliseconds = 10 seconds
        }
        catch (error) {
            console.error("Error handling command:", error);
            // Handle errors and send a reply if something goes wrong
            try {
                await interaction.editReply({ content: "An error occurred while processing your request." });
            }
            catch (error) {
                console.error("Error editing reply after failure:", error);
            }
        }
    },
});
